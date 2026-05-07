import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ZBIORKI = [
  { id: 1, tytul: 'Leczenie Burka po wypadku', opis: 'Burek wymaga kosztownej operacji kręgosłupa po potrąceniu przez samochód. Każda złotówka się liczy!', cel: 5000, zebrano: 3750, kolor: 'from-orange-400 to-pink-500', kolorBtn: 'bg-orange-500 hover:bg-orange-600', kolorBar: 'bg-gradient-to-r from-orange-400 to-pink-500' },
  { id: 2, tytul: 'Nowe wybiegi dla kotów', opis: 'Chcemy zbudować większe, bezpieczniejsze wybiegi dla naszych kotków. Pomóż nam stworzyć im raj!', cel: 8000, zebrano: 3200, kolor: 'from-violet-500 to-blue-500', kolorBtn: 'bg-violet-600 hover:bg-violet-700', kolorBar: 'bg-gradient-to-r from-violet-500 to-blue-500' },
  { id: 3, tytul: 'Karma i leki na zimę', opis: 'Zbliża się zima — musimy zgromadzić zapasy jedzenia i leków dla wszystkich podopiecznych schroniska.', cel: 3000, zebrano: 2550, kolor: 'from-emerald-400 to-teal-500', kolorBtn: 'bg-emerald-500 hover:bg-emerald-600', kolorBar: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
];

const GALERIA = [
  { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80', opis: 'Złoty Retriever' },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80', opis: 'Rudy kotek' },
  { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80', opis: 'Szczęśliwy Labrador' },
  { url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80', opis: 'Szary kocur' },
  { url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&q=80', opis: 'Jamnik' },
  { url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&q=80', opis: 'Mały koteczek' },
  { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80', opis: 'Husky' },
  { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80', opis: 'Wesoły piesek' },
];

const Lapa = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="50" cy="62" rx="22" ry="18" />
    <ellipse cx="22" cy="45" rx="11" ry="13" transform="rotate(-20 22 45)" />
    <ellipse cx="38" cy="32" rx="11" ry="13" />
    <ellipse cx="62" cy="32" rx="11" ry="13" />
    <ellipse cx="78" cy="45" rx="11" ry="13" transform="rotate(20 78 45)" />
  </svg>
);

function Home({ uzytkownik }) {
  const [zwierzeta, setZwierzeta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalZbiorka, setModalZbiorka] = useState(null);
  const [kwota, setKwota] = useState('');
  const [sukcesZbiorka, setSukcesZbiorka] = useState(false);

  const [opinie, setOpinie] = useState([]);
  const [opinieLoading, setOpinieLoading] = useState(true);
  const [formularzOpinia, setFormularzOpinia] = useState({ imie: uzytkownik || '', tresc: '', ocena: 5 });
  const [sukcesOpinia, setSukcesOpinia] = useState(false);
  const [bladOpinia, setBladOpinia] = useState('');
  const [wysylanieOpinia, setWysylanieOpinia] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/zwierzeta`)
      .then(res => res.json())
      .then(data => { setZwierzeta(data); setLoading(false); })
      .catch(() => setLoading(false));

    pobierzOpinie();
  }, []);

  const pobierzOpinie = () => {
    setOpinieLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/opinie`)
      .then(res => res.json())
      .then(data => { setOpinie(data); setOpinieLoading(false); })
      .catch(() => setOpinieLoading(false));
  };

  const handleDonacja = (e) => {
    e.preventDefault();
    setSukcesZbiorka(true);
    setTimeout(() => { setSukcesZbiorka(false); setModalZbiorka(null); setKwota(''); }, 2500);
  };

  const handleOpinia = async (e) => {
    e.preventDefault();
    setBladOpinia('');
    setWysylanieOpinia(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/opinie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularzOpinia),
      });
      const data = await res.json();
      if (!res.ok) { setBladOpinia(data.error); return; }
      setSukcesOpinia(true);
      setFormularzOpinia({ imie: uzytkownik || '', tresc: '', ocena: 5 });
      pobierzOpinie();
      setTimeout(() => setSukcesOpinia(false), 3000);
    } catch {
      setBladOpinia('Brak połączenia z serwerem.');
    } finally {
      setWysylanieOpinia(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen font-black text-2xl animate-pulse bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
      Ładowanie piesków...
    </div>
  );

  const koloryCykl = ['from-violet-500 to-fuchsia-500', 'from-orange-400 to-pink-500', 'from-emerald-400 to-teal-500'];

  return (
    <div className="animate-in fade-in duration-1000">

      {/* --- HERO --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 py-20 lg:py-32">
        <Lapa style={{position:'absolute',top:40,left:32,width:64,height:64,color:'rgba(255,255,255,0.12)',transform:'rotate(12deg)',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',top:128,right:64,width:48,height:48,color:'rgba(255,255,255,0.10)',transform:'rotate(-6deg)',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',bottom:64,left:'25%',width:40,height:40,color:'rgba(255,255,255,0.10)',transform:'rotate(45deg)',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',bottom:32,right:'33%',width:56,height:56,color:'rgba(253,224,71,0.18)',transform:'rotate(-12deg)',pointerEvents:'none'}} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white font-bold text-[10px] mb-6 uppercase tracking-[0.2em] backdrop-blur-sm border border-white/30">
              Schronisko Nowej Generacji
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
              Każda łapa zasługuje na{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">ciepły dom.</span>
            </h1>
            <p className="text-lg text-purple-200 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Łapa Pomocy to miejsce, gdzie porzucone serca odnajdują nadzieję. Pomóż nam tworzyć historie ze szczęśliwym zakończeniem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#zwierzeta" className="px-10 py-5 bg-white text-violet-700 font-black rounded-2xl shadow-xl hover:bg-yellow-300 hover:text-slate-900 hover:-translate-y-1 transition-all duration-300 text-center">
                Adoptuj teraz
              </a>
              <a href="#wesprzyj" className="px-10 py-5 bg-orange-400 text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-orange-500 hover:-translate-y-1 transition-all duration-300 text-center">
                Wesprzyj nas
              </a>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 overflow-hidden rounded-[4rem] shadow-2xl shadow-black/30 rotate-2 hover:rotate-0 transition-transform duration-700 border-4 border-white/20">
              <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" alt="Szczęśliwe psy" className="w-full h-full object-cover" />
            </div>
            <div style={{position:'absolute',top:-24,right:-24,width:96,height:96,background:'#fde047',borderRadius:24,transform:'rotate(12deg)',opacity:0.85,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Lapa style={{width:48,height:48,color:'#ea580c'}} />
            </div>
            <div style={{position:'absolute',bottom:-24,left:-24,width:64,height:64,background:'#f472b6',borderRadius:16,transform:'rotate(-12deg)',opacity:0.85,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Lapa style={{width:32,height:32,color:'white'}} />
            </div>
          </div>
        </div>
      </section>

      {/* --- STATYSTYKI --- */}
      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <Lapa style={{position:'absolute',right:32,top:16,width:80,height:80,color:'#ede9fe',transform:'rotate(12deg)',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',left:16,bottom:16,width:64,height:64,color:'#ffedd5',transform:'rotate(-6deg)',pointerEvents:'none'}} />
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: zwierzeta.length, label: 'Zwierząt w schronisku', kolor: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600' },
              { val: '148', label: 'Szczęśliwych adopcji', kolor: 'from-orange-400 to-pink-500', bg: 'bg-orange-50', text: 'text-orange-500' },
              { val: '3', label: 'Lata działalności', kolor: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
              { val: '98%', label: 'Zadowolonych adopcji', kolor: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-3xl p-8 text-center border border-white shadow-sm`}>
                <p className={`text-5xl font-black mb-2 bg-gradient-to-r ${s.kolor} bg-clip-text text-transparent`}>{s.val}</p>
                <p className={`${s.text} font-bold text-xs uppercase tracking-widest`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LISTA PODOPIECZNYCH --- */}
      <main id="zwierzeta" className="mx-auto w-full max-w-[1200px] px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
              Nasi <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">podopieczni</span>
            </h2>
            <p className="text-slate-400 text-lg">Poznaj zwierzęta, które czekają właśnie na Ciebie</p>
          </div>
          <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg">Wszystkie</button>
            <button className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all">Psy</button>
            <button className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all">Koty</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {zwierzeta.map((pet, i) => {
            const kolor = koloryCykl[i % koloryCykl.length];
            return (
              <div key={pet._id} className="group relative rounded-[3rem] bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-50 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${kolor}`}></div>
                <div className="relative h-72 w-full overflow-hidden rounded-[2.5rem] mb-8">
                  <img src={pet.foto} alt={pet.imie} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">{pet.rasa}</span>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-3xl font-black text-slate-900 mb-1">{pet.imie}</h4>
                      <p className={`font-bold text-sm uppercase tracking-tighter bg-gradient-to-r ${kolor} bg-clip-text text-transparent`}>{pet.wiek} • {pet.status}</p>
                    </div>
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${kolor} text-white`}>
                      <Lapa className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <Link to={`/pies/${pet._id}`} className={`block w-full text-center rounded-[1.5rem] bg-gradient-to-r ${kolor} py-5 text-sm font-black text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
                    Poznaj lepiej {pet.imie}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- GALERIA --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <Lapa style={{position:'absolute',top:32,left:32,width:80,height:80,color:'#fbcfe8',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',bottom:32,right:32,width:64,height:64,color:'#ddd6fe',pointerEvents:'none'}} />
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-bold text-[10px] mb-4 uppercase tracking-[0.2em]">Galeria</span>
            <h2 className="text-5xl font-black tracking-tight text-slate-900">
              Nasze <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">słodkie</span> łapki
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALERIA.map((foto, i) => (
              <div key={i} className={`relative overflow-hidden rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${i === 0 || i === 5 ? 'md:row-span-2' : ''}`}>
                <img src={foto.url} alt={foto.opis} className="w-full h-full object-cover aspect-square" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <Lapa className="w-5 h-5 text-white" />
                    <span className="text-white font-black text-sm">{foto.opis}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WESPRZYJ NAS --- */}
      <section id="wesprzyj" className="py-24 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden">
        <Lapa style={{position:'absolute',top:48,right:48,width:96,height:96,color:'rgba(255,255,255,0.05)',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',bottom:48,left:48,width:80,height:80,color:'rgba(255,255,255,0.05)',pointerEvents:'none'}} />
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-orange-300 font-bold text-[10px] mb-4 uppercase tracking-[0.2em] border border-white/20">Zbiórki</span>
            <h2 className="text-5xl font-black tracking-tight text-white">
              Wesprzyj nasze <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">zbiórki</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg">Każda złotówka pomaga naszym podopiecznym</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ZBIORKI.map((z) => {
              const procent = Math.round((z.zebrano / z.cel) * 100);
              return (
                <div key={z.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-5 hover:bg-white/10 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${z.kolor} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white text-2xl">volunteer_activism</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{z.tytul}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm flex-1">{z.opis}</p>
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-white">{z.zebrano.toLocaleString()} zł</span>
                      <span className="text-slate-400">cel: {z.cel.toLocaleString()} zł</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${z.kolorBar} rounded-full`} style={{ width: `${procent}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-slate-400 mt-1 font-bold">{procent}%</p>
                  </div>
                  <button onClick={() => setModalZbiorka(z)} className={`w-full ${z.kolorBtn} text-white font-black py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1`}>
                    Wesprzyj
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- OPINIE --- */}
      <section id="opinie" className="bg-white py-24 border-t border-slate-50 relative overflow-hidden">
        <Lapa style={{position:'absolute',top:32,right:32,width:64,height:64,color:'#fce7f3',pointerEvents:'none'}} />
        <Lapa style={{position:'absolute',bottom:32,left:32,width:48,height:48,color:'#ede9fe',pointerEvents:'none'}} />
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 font-bold text-[10px] mb-4 uppercase tracking-[0.2em]">Historie adopcji</span>
            <h2 className="text-5xl font-black tracking-tight text-slate-900">
              Co mówią nasi <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">adoptujący</span>
            </h2>
          </div>

          {opinieLoading ? (
            <div className="text-center text-slate-400 font-bold animate-pulse py-8">Ładowanie opinii...</div>
          ) : opinie.length === 0 ? (
            <div className="text-center text-slate-400 font-bold py-8">Bądź pierwszy — dodaj swoją opinię!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {opinie.map((o, i) => (
                <div key={o._id || i} className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col gap-6 border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className={j < o.ocena ? 'text-yellow-400 text-lg' : 'text-slate-200 text-lg'}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed italic flex-1">"{o.tresc}"</p>
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${koloryCykl[i % koloryCykl.length]} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                      {o.imie.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{o.imie}</p>
                      <p className="text-xs text-slate-400 font-bold">{new Date(o.data).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FORMULARZ OPINII */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-[3rem] p-10 border border-violet-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center">
                <Lapa className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Dodaj swoją opinię</h3>
                <p className="text-slate-400 text-sm">Podziel się swoją historią adopcji</p>
              </div>
            </div>

            {sukcesOpinia && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-3 rounded-2xl mb-4">
                Dziękujemy za opinię! Pojawi się za chwilę.
              </div>
            )}
            {bladOpinia && (
              <div className="bg-red-50 border border-red-200 text-red-600 font-bold text-sm px-4 py-3 rounded-2xl mb-4">{bladOpinia}</div>
            )}

            <form onSubmit={handleOpinia} className="flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Twoje imię</label>
                <input
                  required
                  type="text"
                  placeholder="Jan Kowalski"
                  value={formularzOpinia.imie}
                  onChange={e => setFormularzOpinia({ ...formularzOpinia, imie: e.target.value })}
                  className="w-full border-2 border-white rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-violet-400 transition-all bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Ocena</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setFormularzOpinia({ ...formularzOpinia, ocena: n })}
                      className={`text-3xl transition-transform hover:scale-125 ${n <= formularzOpinia.ocena ? 'text-yellow-400' : 'text-slate-200'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Twoja opinia (max 500 znaków)</label>
                <textarea
                  required
                  rows="4"
                  maxLength={500}
                  placeholder="Napisz kilka słów o adopcji..."
                  value={formularzOpinia.tresc}
                  onChange={e => setFormularzOpinia({ ...formularzOpinia, tresc: e.target.value })}
                  className="w-full border-2 border-white rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-violet-400 transition-all bg-white resize-none"
                />
                <p className="text-right text-xs text-slate-400 mt-1">{formularzOpinia.tresc.length}/500</p>
              </div>
              <button type="submit" disabled={wysylanieOpinia}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60">
                {wysylanieOpinia ? 'Wysyłanie...' : 'Dodaj opinię'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MODAL DONACJI */}
      {modalZbiorka && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => { setModalZbiorka(null); setSukcesZbiorka(false); setKwota(''); }}>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            {sukcesZbiorka ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Dziękujemy!</h3>
                <p className="text-slate-500">Twoja wpłata <span className="font-black text-emerald-600">{kwota} zł</span> pomaga naszym podopiecznym.</p>
              </div>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${modalZbiorka.kolor} flex items-center justify-center mb-6`}>
                  <span className="material-symbols-outlined text-white text-2xl">volunteer_activism</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{modalZbiorka.tytul}</h3>
                <p className="text-slate-500 mb-8 text-sm">{modalZbiorka.opis}</p>
                <form onSubmit={handleDonacja} className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Kwota wpłaty (zł)</label>
                    <div className="flex gap-2 mb-3">
                      {['10', '25', '50', '100'].map(k => (
                        <button key={k} type="button" onClick={() => setKwota(k)}
                          className={`flex-1 py-2 rounded-xl text-sm font-black border-2 transition-all ${kwota === k ? `border-transparent text-white bg-gradient-to-r ${modalZbiorka.kolor}` : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                          {k} zł
                        </button>
                      ))}
                    </div>
                    <input required type="number" min="1" placeholder="Inna kwota..." value={kwota} onChange={e => setKwota(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-violet-400 transition-all" />
                  </div>
                  <button type="submit" className={`${modalZbiorka.kolorBtn} text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95`}>
                    Wpłać {kwota ? `${kwota} zł` : ''}
                  </button>
                  <button type="button" onClick={() => { setModalZbiorka(null); setKwota(''); }} className="bg-slate-100 text-slate-600 font-bold text-sm py-3 rounded-2xl hover:bg-slate-200 transition-all">Anuluj</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
