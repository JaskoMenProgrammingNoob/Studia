import React, { useState } from 'react';


function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    imie: '',
    rasa: '',
    wiek: '',
    status: 'Do adopcji',
    foto: '',
    opis: '',
    gatunek: 'pies'
  });
  const [customGatunek, setCustomGatunek] = useState('');
  const [useCustomGatunek, setUseCustomGatunek] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem('adminToken', passwordInput);
    setToken(passwordInput);
    setPasswordInput('');
    setLoginError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = useCustomGatunek
        ? { ...formData, gatunek: customGatunek.toLowerCase().trim() }
        : formData;

      if (useCustomGatunek && !customGatunek.trim()) {
        alert('Podaj nazwę gatunku.');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nowy-obiekt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (res.status === 401) {
        sessionStorage.removeItem('adminToken');
        setToken('');
        setLoginError('Nieprawidłowe hasło. Zaloguj się ponownie.');
        return;
      }

      if (res.ok) {
        alert("✅ Sukces! Nowy zwierzak został dodany do bazy.");
        setFormData({ imie: '', rasa: '', wiek: '', status: 'Do adopcji', foto: '', opis: '', gatunek: 'pies' });
        setCustomGatunek('');
        setUseCustomGatunek(false);
      } else {
        alert("❌ Błąd serwera. Spróbuj ponownie.");
      }
    } catch (err) {
      alert("❌ Brak połączenia z serwerem. Czy uruchomiłeś 'node server.js'?");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6 flex items-center justify-center">
        <div className="w-full max-w-sm bg-zinc-900 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
            Panel <span className="text-[#13ec13]">Admina</span>
          </h1>
          <p className="text-zinc-500 mb-8 font-medium">Podaj hasło, aby kontynuować</p>
          {loginError && <p className="text-red-400 text-sm mb-4 font-bold">{loginError}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              required
              type="password"
              placeholder="Hasło admina"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13] transition-all"
            />
            <button
              type="submit"
              className="bg-[#13ec13] text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
      <div className="max-w-2xl mx-auto bg-zinc-900 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#13ec13]/10 blur-[100px] rounded-full"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">
              Panel <span className="text-[#13ec13]">Admina</span>
            </h1>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-red-400 text-sm font-bold transition-colors"
            >
              Wyloguj
            </button>
          </div>
          <p className="text-zinc-500 mb-8 font-medium">System zarządzania podopiecznymi schroniska</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Imię pupila</label>
                <input 
                  required 
                  type="text"
                  placeholder="np. Burek" 
                  value={formData.imie} 
                  onChange={e => setFormData({...formData, imie: e.target.value})} 
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13] transition-all" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Gatunek</label>
                <select
                  value={useCustomGatunek ? '__inne' : formData.gatunek}
                  onChange={e => {
                    if (e.target.value === '__inne') {
                      setUseCustomGatunek(true);
                      setFormData({...formData, gatunek: ''});
                    } else {
                      setUseCustomGatunek(false);
                      setCustomGatunek('');
                      setFormData({...formData, gatunek: e.target.value});
                    }
                  }}
                  className="bg-zinc-800 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13] cursor-pointer"
                >
                  <option value="pies">Pies</option>
                  <option value="kot">Kot</option>
                  <option value="__inne">Inny gatunek...</option>
                </select>
                {useCustomGatunek && (
                  <input
                    required
                    type="text"
                    placeholder="np. królik, chomik, papuga..."
                    value={customGatunek}
                    onChange={e => {
                      setCustomGatunek(e.target.value);
                      setFormData({...formData, gatunek: e.target.value.toLowerCase().trim()});
                    }}
                    className="bg-white/5 border border-[#13ec13] p-4 rounded-2xl text-white outline-none mt-2"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Rasa</label>
                <input 
                  required 
                  type="text"
                  placeholder="np. Golden Retriever" 
                  value={formData.rasa} 
                  onChange={e => setFormData({...formData, rasa: e.target.value})} 
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Wiek</label>
                <input 
                  required 
                  type="text"
                  placeholder="np. 2 lata" 
                  value={formData.wiek} 
                  onChange={e => setFormData({...formData, wiek: e.target.value})} 
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13]" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Link do zdjęcia (URL)</label>
              <input 
                required 
                type="url"
                placeholder="https://images.unsplash.com/..." 
                value={formData.foto} 
                onChange={e => setFormData({...formData, foto: e.target.value})} 
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13]" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#13ec13] ml-2">Opis i charakterystyka</label>
              <textarea 
                required 
                rows="4"
                placeholder="Napisz kilka zdań o zwierzaku..." 
                value={formData.opis} 
                onChange={e => setFormData({...formData, opis: e.target.value})} 
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#13ec13] resize-none" 
              />
            </div>

            <button 
              type="submit" 
              className="bg-[#13ec13] text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#13ec13]/20 mt-4 text-lg uppercase tracking-wider"
            >
              Dodaj do bazy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;