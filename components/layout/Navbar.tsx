import React from 'react';
import { BarChart3, Database, FileStack, Home, MessageSquare } from 'lucide-react';
import { VISION_IMAGE_URL } from '@/utils/constants';

interface NavbarProps {
  activeSection: 'home' | 'dashboard';
  setActiveSection: (section: 'home' | 'dashboard') => void;
  onDashboardAction: (view: 'analitica' | 'documentos' | 'datos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
  const isDashboard = activeSection === 'dashboard';
  const dashboardItems = [
    { view: 'analitica' as const, icon: BarChart3, label: 'Gobernanza' },
    { view: 'documentos' as const, icon: FileStack, label: 'Proyecto LP' },
    { view: 'datos' as const, icon: Database, label: 'Planeacion LP' }
  ];

  const goHome = () => {
    setActiveSection('home');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const goContact = () => {
    if (activeSection !== 'home') setActiveSection('home');
    setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <nav className="fixed left-0 right-0 top-3 z-[60] px-3 pointer-events-none md:top-4 md:px-4">
      <div className={`mx-auto flex h-[64px] max-w-6xl items-center justify-between gap-4 rounded-full px-3 pl-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl pointer-events-auto ${isDashboard ? 'border border-slate-200/80 bg-white/90' : 'border border-white/30 bg-transparent'}`}>
        <button onClick={goHome} className={`flex min-w-0 items-center gap-3 rounded-full py-1 pr-2 text-left transition ${isDashboard ? 'hover:bg-slate-50' : 'hover:bg-white/10'}`}>
          <img src={VISION_IMAGE_URL} alt="Cali 500+" className="h-10 w-10 shrink-0 rounded-full border border-white/60 bg-white object-cover shadow-sm" />
          <div className="hidden min-w-0 sm:block">
            <p className={`truncate text-sm font-bold ${isDashboard ? 'text-[#3A0D7B]' : 'text-white drop-shadow'}`}>Cali 500+</p>
            <p className={`truncate text-[11px] font-semibold uppercase tracking-[0.08em] ${isDashboard ? 'text-[#F46217]' : 'text-white/80 drop-shadow'}`}>Sistema documental institucional</p>
          </div>
        </button>

        <div className={`hidden items-center gap-1 rounded-full border p-1 md:flex ${isDashboard ? 'border-slate-200 bg-slate-50/90' : 'border-white/20 bg-white/10'}`}>
          <button onClick={goHome} className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition hover:bg-white hover:text-[#3A0D7B] hover:shadow-sm ${isDashboard ? 'text-slate-700' : 'text-white'}`}>
            <Home className="h-4 w-4" />
            Inicio
          </button>
          <button onClick={() => onDashboardAction('analitica')} className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition hover:bg-white hover:text-[#3A0D7B] hover:shadow-sm ${isDashboard ? 'text-slate-700' : 'text-white'}`}>
            <BarChart3 className="h-4 w-4" />
            {dashboardItems[0].label}
          </button>
          <button onClick={() => onDashboardAction('documentos')} className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition hover:bg-white hover:text-[#3A0D7B] hover:shadow-sm ${isDashboard ? 'text-slate-700' : 'text-white'}`}>
            <FileStack className="h-4 w-4" />
            {dashboardItems[1].label}
          </button>
          <button onClick={() => onDashboardAction('datos')} className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition hover:bg-white hover:text-[#3A0D7B] hover:shadow-sm ${isDashboard ? 'text-slate-700' : 'text-white'}`}>
            <Database className="h-4 w-4" />
            {dashboardItems[2].label}
          </button>
        </div>

        <button onClick={goContact} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#F46217] px-4 text-sm font-semibold text-white transition hover:bg-[#F52789]">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Contacto</span>
        </button>
      </div>

      <div className="mx-auto mt-2 flex max-w-6xl gap-1 overflow-x-auto rounded-2xl border border-white/70 bg-white/90 p-1 shadow-[0_14px_34px_rgba(15,23,42,0.18)] backdrop-blur-xl pointer-events-auto md:hidden">
        <button onClick={goHome} className="inline-flex h-11 min-w-[84px] shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-black text-[#0B1F3A] transition active:bg-blue-50">
          <Home className="h-4 w-4 text-[#3A0D7B]" />
          Inicio
        </button>
        {dashboardItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onDashboardAction(item.view)}
            className="inline-flex h-11 min-w-max shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-black text-[#0B1F3A] transition active:bg-blue-50"
          >
            <item.icon className="h-4 w-4 text-[#3A0D7B]" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
