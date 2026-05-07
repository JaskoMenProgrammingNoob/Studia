import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DogDetails from './pages/DogDetails';
import Admin from './pages/Admin';

function App() {
  const [modalRej, setModalRej] = useState(false);
  const [uzytkownik, setUzytkownik] = useState(null);
  const [form, setForm] = useState({ imie: '', email: '', haslo: '', powtorz: '' });
  const [blad, setBlad] = useState('');
  const [ladowanie, setLadowanie] = useState(false);
  const [sukces, setSukces] = useState(false);

  const handleRejestracja = async (e) => {
    e.preventDefault();
    setBlad('');
    if (form.haslo !== form.powtorz) { setBlad('Hasła nie są zgodne.'); return; }
    setLadowanie(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rejestracja`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imie: form.imie, email: form.email, haslo: form.haslo }),
      });
      const data = await res.json();
      if (!res.ok) { setBlad(data.error); return; }
      setUzytkownik(data.imie);
      setSukces(true);
      setTimeout(() => { setModalRej(false); setSukces(false); setForm({ imie: '', email: '', haslo: '', powtorz: '' }); }, 2000);
    } catch {
      setBlad('Brak połączenia z serwerem.');
    } finally {
      setLadowanie(false);
    }
  };

  return (
    <Router>
      <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] text-slate-900">
        <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/90 backdrop-blur-md px-6 py-4 md:px-20">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <a href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl">pets</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-violet-600">Łapa Pomocy</h2>
            </a>

            <div className="flex items-center gap-6">
              <a href="/#zwierzeta" className="text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors">Zwierzęta</a>
              <a href="/#wesprzyj" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Wesprzyj nas</a>
              <a href="/#opinie" className="text-sm font-bold text-slate-500 hover:text-pink-500 transition-colors">Opinie</a>
              {uzytkownik ? (
                <span className="px-5 py-2 rounded-xl bg-violet-100 text-violet-700 font-black text-sm">Cześć, {uzytkownik}!</span>
              ) : (
                <button onClick={() => setModalRej(true)} className="px-5 py-2.5 bg-violet-600 text-white font-black text-sm rounded-xl shadow-md hover:bg-violet-700 hover:-translate-y-0.5 transition-all">
                  Zarejestruj się
                </button>
              )}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home uzytkownik={uzytkownik} />} />
          <Route path="/pies/:id" element={<DogDetails />} />
          <Route path="/zarzadzanie-schroniskiem" element={<Admin />} />
        </Routes>

        <footer className="mt-20 border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
          <p>© 2026 Łapa Pomocy. Projekt Fullstack MERN.</p>
        </footer>

        {/* MODAL REJESTRACJI */}
        {modalRej && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => { setModalRej(false); setBlad(''); setSukces(false); }}>
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl overflow-y-auto max-h-[92vh]" onClick={e => e.stopPropagation()}>
              {sukces ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-violet-500 text-4xl">check_circle</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Witaj, {uzytkownik}!</h3>
                  <p className="text-slate-500">Rejestracja zakończona pomyślnie.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-2xl">person_add</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Rejestracja</h3>
                      <p className="text-slate-400 text-sm">Dołącz do społeczności Łapy Pomocy</p>
                    </div>
                  </div>

                  {blad && <p className="bg-red-50 text-red-500 font-bold text-sm px-4 py-3 rounded-2xl mb-4">{blad}</p>}

                  <form onSubmit={handleRejestracja} className="flex flex-col gap-4">
                    {[
                      { key: 'imie', label: 'Imię', type: 'text', placeholder: 'Jan' },
                      { key: 'email', label: 'E-mail', type: 'email', placeholder: 'jan@mail.pl' },
                      { key: 'haslo', label: 'Hasło (min. 6 znaków)', type: 'password', placeholder: '••••••••' },
                      { key: 'powtorz', label: 'Powtórz hasło', type: 'password', placeholder: '••••••••' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">{f.label}</label>
                        <input
                          required
                          type={f.type}
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 outline-none focus:border-violet-400 transition-all"
                        />
                      </div>
                    ))}
                    <button type="submit" disabled={ladowanie} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 mt-2">
                      {ladowanie ? 'Rejestrowanie...' : 'Zarejestruj się'}
                    </button>
                    <button type="button" onClick={() => { setModalRej(false); setBlad(''); }} className="bg-slate-100 text-slate-600 font-bold text-sm py-3 rounded-2xl hover:bg-slate-200 transition-all">
                      Anuluj
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
