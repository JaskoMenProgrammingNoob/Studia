import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DogDetails from './pages/DogDetails';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] text-slate-900">
        <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/90 backdrop-blur-md px-6 py-4 md:px-20">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <a href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                <span className="material-symbols-outlined text-2xl">pets</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Łapa Pomocy</h2>
            </a>

            <div className="flex items-center gap-6">
              <a href="/#zwierzeta" className="text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors">Zwierzęta</a>
              <a href="/#wesprzyj" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors">Wesprzyj nas</a>
              <a href="/#opinie" className="text-sm font-bold text-slate-500 hover:text-pink-500 transition-colors">Opinie</a>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pies/:id" element={<DogDetails />} />
          <Route path="/zarzadzanie-schroniskiem" element={<Admin />} />
        </Routes>

        <footer className="mt-20 border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
          <p>© 2026 Łapa Pomocy. Projekt Fullstack MERN.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
