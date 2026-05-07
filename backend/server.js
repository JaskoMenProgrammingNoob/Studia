require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
}));

const adopcjaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Za dużo wniosków. Spróbuj ponownie za godzinę.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Za dużo żądań. Spróbuj ponownie za 15 minut.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const DB_URL = process.env.MONGODB_URI || "mongodb+srv://admin:123@schronisko.k8imroe.mongodb.net/?appName=Schronisko";
const client = new MongoClient(DB_URL);

function walidujZwierze(body) {
    const { imie, rasa, wiek, status, foto, opis, gatunek } = body;
    if (!imie || !rasa || !wiek || !foto || !opis || !gatunek) return 'Wszystkie pola są wymagane.';
    if ([imie, rasa, wiek, status, foto, opis, gatunek].some(v => typeof v !== 'string')) return 'Nieprawidłowy typ danych.';
    if (imie.length > 50 || rasa.length > 100 || wiek.length > 30 || opis.length > 1000) return 'Przekroczono dozwoloną długość pola.';
    if (!['pies', 'kot'].includes(gatunek)) return 'Gatunek musi być "pies" lub "kot".';
    if (!['Do adopcji', 'Zarezerwowany', 'Adoptowany'].includes(status)) return 'Nieprawidłowy status.';
    if (!foto.startsWith('https://')) return 'Link do zdjęcia musi zaczynać się od https://.';
    return null;
}

function walidujZgloszenie(body) {
    const { piesId, piesImie, imieNazwisko, kontakt, wiadomosc } = body;
    if (!piesId || !piesImie || !imieNazwisko || !kontakt || !wiadomosc) return 'Wszystkie pola są wymagane.';
    if ([piesId, piesImie, imieNazwisko, kontakt, wiadomosc].some(v => typeof v !== 'string')) return 'Nieprawidłowy typ danych.';
    if (imieNazwisko.length > 100 || kontakt.length > 100 || wiadomosc.length > 2000) return 'Przekroczono dozwoloną długość pola.';
    return null;
}

function requireAdmin(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token || token !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Brak dostępu' });
    next();
}

async function startServer() {
    try {
        await client.connect();
        console.log("✅ BAZA DANYCH PODŁĄCZONA (MongoDB Atlas)!");

        const db = client.db("Schronisko");

        // --- ZWIERZETA ---
        app.get('/api/zwierzeta', async (req, res) => {
            try {
                const zwierzeta = await db.collection("Zwierzeta").find({}).toArray();
                res.json(zwierzeta);
            } catch { res.status(500).json({ error: "Błąd pobierania danych" }); }
        });

        app.get('/api/zwierzeta/:id', async (req, res) => {
            try {
                if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Nieprawidłowe ID" });
                const zwierze = await db.collection("Zwierzeta").findOne({ _id: new ObjectId(req.params.id) });
                if (!zwierze) return res.status(404).json({ error: "Nie znaleziono zwierzęcia" });
                res.json(zwierze);
            } catch { res.status(500).json({ error: "Błąd pobierania danych" }); }
        });

        // --- ADOPCJA ---
        app.post('/api/adopcja', adopcjaLimiter, async (req, res) => {
            const blad = walidujZgloszenie(req.body);
            if (blad) return res.status(400).json({ error: blad });
            try {
                const { piesId, piesImie, imieNazwisko, kontakt, wiadomosc } = req.body;
                await db.collection("Zgloszenia").insertOne({ piesId, piesImie, imieNazwisko, kontakt, wiadomosc, data: new Date() });
                console.log("📩 Nowy wniosek zapisany!");
                res.status(201).json({ message: "Wniosek zapisany!" });
            } catch { res.status(500).json({ error: "Błąd serwera" }); }
        });

        // --- ADMIN ---
        app.post('/api/nowy-obiekt', adminLimiter, requireAdmin, async (req, res) => {
            const blad = walidujZwierze(req.body);
            if (blad) return res.status(400).json({ error: blad });
            try {
                const { imie, rasa, wiek, status, foto, opis, gatunek } = req.body;
                const result = await db.collection("Zwierzeta").insertOne({ imie, rasa, wiek, status, foto, opis, gatunek, dataDodania: new Date() });
                console.log("🐾 Dodano zwierzaka o ID:", result.insertedId);
                res.status(201).json({ message: "Zwierzak dodany pomyślnie!" });
            } catch { res.status(500).json({ error: "Błąd serwera" }); }
        });

        // --- REJESTRACJA ---
        app.post('/api/rejestracja', async (req, res) => {
            const { imie, email, haslo } = req.body;
            if (!imie || !email || !haslo) return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
            if (typeof imie !== 'string' || typeof email !== 'string' || typeof haslo !== 'string') return res.status(400).json({ error: 'Nieprawidłowy typ danych.' });
            if (imie.length > 50) return res.status(400).json({ error: 'Imię za długie.' });
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' });
            if (haslo.length < 6) return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków.' });
            if (haslo.length > 100) return res.status(400).json({ error: 'Hasło za długie.' });
            try {
                const uzytkownicy = db.collection('Uzytkownicy');
                const istnieje = await uzytkownicy.findOne({ email: email.toLowerCase() });
                if (istnieje) return res.status(409).json({ error: 'Ten e-mail jest już zarejestrowany.' });
                const hasloHash = await bcrypt.hash(haslo, 10);
                await uzytkownicy.insertOne({ imie, email: email.toLowerCase(), haslo: hasloHash, dataRejestracji: new Date() });
                console.log(`👤 Nowy użytkownik: ${imie} (${email})`);
                res.status(201).json({ message: 'Zarejestrowano!', imie });
            } catch { res.status(500).json({ error: 'Błąd serwera.' }); }
        });

        // --- OPINIE ---
        app.get('/api/opinie', async (req, res) => {
            try {
                const opinie = await db.collection('Opinie').find({}).sort({ data: -1 }).toArray();
                res.json(opinie);
            } catch { res.status(500).json({ error: 'Błąd pobierania opinii.' }); }
        });

        app.post('/api/opinie', async (req, res) => {
            const { imie, tresc, ocena } = req.body;
            if (!imie || !tresc || !ocena) return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
            if (typeof imie !== 'string' || typeof tresc !== 'string') return res.status(400).json({ error: 'Nieprawidłowy typ danych.' });
            if (imie.length > 50 || tresc.length > 500) return res.status(400).json({ error: 'Przekroczono dozwoloną długość.' });
            const ocenaNum = parseInt(ocena);
            if (isNaN(ocenaNum) || ocenaNum < 1 || ocenaNum > 5) return res.status(400).json({ error: 'Ocena musi być od 1 do 5.' });
            try {
                await db.collection('Opinie').insertOne({ imie, tresc, ocena: ocenaNum, data: new Date() });
                console.log(`⭐ Nowa opinia od: ${imie}`);
                res.status(201).json({ message: 'Opinia dodana!' });
            } catch { res.status(500).json({ error: 'Błąd serwera.' }); }
        });

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Serwer śmiga na porcie ${PORT}`);
            console.log("📌 Trasy: GET /api/zwierzeta, POST /api/adopcja, POST /api/nowy-obiekt, POST /api/rejestracja, GET|POST /api/opinie");
        });

    } catch (e) {
        console.error("❌ Błąd połączenia z bazą:", e);
    }
}

startServer();
