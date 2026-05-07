import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ZBIORKI = [
  {
    id: 1,
    tytul: 'Leczenie Burka po wypadku',
    opis: 'Burek wymaga kosztownej operacji kręgosłupa po potrąceniu przez samochód. Każda złotówka się liczy!',
    cel: 5000,
    zebrano: 3750,
    kolor: 'from-orange-400 to-pink-500',
    kolorBtn: 'bg-orange-500 hover:bg-orange-600',
    kolorBar: 'bg-gradient-to-r from-orange-400 to-pink-500',
  },
  {
    id: 2,
    tytul: 'Nowe wybiegi dla kotów',
    opis: 'Chcemy zbudować większe, bezpieczniejsze wybiegi dla naszych kotków. Pomóż nam stworzyć im raj!',
    cel: 8000,
    zebrano: 3200,
    kolor: 'from-violet-500 to-blue-500',
    kolorBtn: 'bg-violet-600 hover:bg-violet-700',
    kolorBar: 'bg-gradient-to-r from-violet-500 to-blue-500',
  },
  {
    id: 3,
    tytul: 'Karma i leki na zimę',
    opis: 'Zbliża się zima — musimy zgromadzić zapasy jedzenia i leków dla wszystkich podopiecznych schroniska.',
    cel: 3000,
    zebrano: 2550,
    kolor: 'from-emerald-400 to-teal-500',
    kolorBtn: 'bg-emerald-500 hover:bg-emerald-600',
    kolorBar: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  },
];

function Home() {
  const [zwierzeta, setZwierzeta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalZbiorka, setModalZbiorka] = useState(null);
  const [kwota, setKwota] = useState('');
  const [sukces, setSukces] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/zwierzeta`)
      .then(res => res.json())
      .then(data => { setZwierzeta(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDonacja = (e) => {
    e.preventDefault();
    setSukces(true);
    setTimeout(() => {
      setSukces(false);
      setModalZbiorka(null);
      setKwota('');
    }, 2500);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen font-black text-2xl animate-pulse bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
      Ładowanie piesków...
    </div>
  );

  return (
    <div className="animate-in fade-in duration-1000">

      {/* --- HERO --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white font-bold text-[10px] mb-6 uppercase tracking-[0.2em] backdrop-blur-sm border border-white/30">
              Schronisko Nowej Generacji
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
              Każda łapa zasługuje na{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                ciepły dom.
              </span>
            </h1>
            <p className="text-lg text-purple-200 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Łapa Pomocy to miejsce, gdzie porzucone serca odnajdują nadzieję. Pomóż nam tworzyć historie ze szczęśliwym zakończeniem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#zwierzeta" className="px-10 py-5 bg-white text-violet-700 font-black rounded-2xl shadow-xl hover:bg-yellow-300 hover:text-slate-900 hover:-translate-y-1 transition-all duration-300 text-center">
                Adoptuj teraz
              </a>
              <a href="#wesprzyj" className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white font-black rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 text-center">
                Wesprzyj nas
              </a>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 overflow-hidden rounded-[4rem] shadow-2xl shadow-black/30 rotate-2 hover:rotate-0 transition-transform duration-700 border-4 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800"
                alt="Szczęśliwe psy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-3xl rotate-12 opacity-80"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-400 rounded-2xl -rotate-12 opacity-80"></div>
          </div>
        </div>
      </section>

      {/* --- STATYSTYKI --- */}
      <section className="py-16 bg-slate-50">
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
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg transition-all">Wszystkie</button>
            <button className="px-8 py-3 rounded-xl text-slate-400 text-sm font-bold hover:text-slate-900 transition-all">Psy</button>
            <button className="px-8 py-3 rounded-xl text-slate-400 text-sm font-bold hover:text-slate-900 transition-all">Koty</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {zwierzeta.map((pet, i) => {
            const kolory = [
              'from-violet-500 to-fuchsia-500',
              'from-orange-400 to-pink-500',
              'from-emerald-400 to-teal-500',
            ];
            const kolor = kolory[i % kolory.length];
            return (
              <div key={pet._id} className="group relative rounded-[3rem] bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-slate-50 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kolor}`}></div>
                <div className="relative h-72 w-full overflow-hidden rounded-[2.5rem] mb-8">
                  <img src={pet.foto} alt={pet.imie} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                      {pet.rasa}
                    </span>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="text-3xl font-black text-slate-900 mb-1">{pet.imie}</h4>
                      <p className={`font-bold text-sm uppercase tracking-tighter bg-gradient-to-r ${kolor} bg-clip-text text-transparent`}>{pet.wiek} • {pet.status}</p>
                    </div>
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${kolor} text-white`}>
                      <span className="material-symbols-outlined text-2xl font-bold">pets</span>
                    </div>
                  </div>
                  <Link
                    to={`/pies/${pet._id}`}
                    className={`block w-full text-center rounded-[1.5rem] bg-gradient-to-r ${kolor} py-5 text-sm font-black text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                  >
                    Poznaj lepiej {pet.imie}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- WESPRZYJ NAS / ZBIÓRKI --- */}
      <section id="wesprzyj" className="py-24 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-orange-300 font-bold text-[10px] mb-4 uppercase tracking-[0.2em] border border-white/20">
              Zbiórki
            </span>
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
                      <div className={`h-full ${z.kolorBar} rounded-full transition-all duration-1000`} style={{ width: `${procent}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-slate-400 mt-1 font-bold">{procent}%</p>
                  </div>

                  <button
                    onClick={() => setModalZbiorka(z)}
                    className={`w-full ${z.kolorBtn} text-white font-black py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    Wesprzyj
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- OPINIE --- */}
      <section id="opinie" className="bg-white py-24 border-t border-slate-50">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 font-bold text-[10px] mb-4 uppercase tracking-[0.2em]">
              Historie adopcji
            </span>
            <h2 className="text-5xl font-black tracking-tight text-slate-900">
              Co mówią nasi <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">adoptujący</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { imie: 'Marta K.', lokalizacja: 'Warszawa', opinia: 'Adoptowałam Burka 2 lata temu i to była najlepsza decyzja w moim życiu. Cały proces był prosty i profesjonalny. Polecam każdemu!', zwierze: 'Adoptowała Burka', avatar: 'M', kolor: 'from-violet-500 to-fuchsia-500' },
              { imie: 'Tomasz W.', lokalizacja: 'Kraków', opinia: 'Schronisko pomogło mi znaleźć idealnego towarzysza. Moja kotka Luna jest teraz gwiazdą całej rodziny. Dziękuję całemu zespołowi!', zwierze: 'Adoptował Lunę', avatar: 'T', kolor: 'from-orange-400 to-pink-500' },
              { imie: 'Ania i Piotr', lokalizacja: 'Wrocław', opinia: 'Baliśmy się czy uda nam się zaopiekować psem, ale schronisko przeprowadziło nas przez wszystko krok po kroku. Rex jest teraz nieodłączną częścią rodziny.', zwierze: 'Adoptowali Rexa', avatar: 'A', kolor: 'from-emerald-400 to-teal-500' },
            ].map((o) => (
              <div key={o.imie} className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col gap-6 border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed italic flex-1">"{o.opinia}"</p>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${o.kolor} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                    {o.avatar}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{o.imie}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{o.zwierze} • {o.lokalizacja}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODAL DONACJI --- */}
      {modalZbiorka && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => { setModalZbiorka(null); setSukces(false); setKwota(''); }}>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            {sukces ? (
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
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="Inna kwota..."
                      value={kwota}
                      onChange={e => setKwota(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-violet-400 transition-all"
                    />
                  </div>
                  <button type="submit" className={`${modalZbiorka.kolorBtn} text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95`}>
                    Wpłać {kwota ? `${kwota} zł` : ''}
                  </button>
                  <button type="button" onClick={() => { setModalZbiorka(null); setKwota(''); }} className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                    Anuluj
                  </button>
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
