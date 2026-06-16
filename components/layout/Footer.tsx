import React from 'react';
import { BarChart3, Database, FileStack, Globe, Home, Info, MessageSquare } from 'lucide-react';
import { VISION_IMAGE_URL } from '@/utils/constants';

interface FooterProps {
  activeSection: 'home' | 'dashboard';
  setActiveSection: (section: 'home' | 'dashboard') => void;
  onDashboardAction: (view: 'analitica' | 'documentos' | 'datos') => void;
}

export const Footer: React.FC<FooterProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
  const scrollTo = (id: string) => {
    if (activeSection !== 'home') setActiveSection('home');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <footer className="bg-[#07182F] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={VISION_IMAGE_URL} alt="Cali 500+" className="h-10 w-auto" />
            <div>
              <strong className="block text-lg">Cali 500+</strong>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">Sistema documental</span>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">Plataforma de consulta, trazabilidad y gestion documental para la vision estrategica de Santiago de Cali.</p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Navegación</h4>
          <div className="mt-5 space-y-3">
            <button onClick={() => setActiveSection('home')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Home className="h-4 w-4" /> Inicio</button>
            <button onClick={() => scrollTo('quienes-somos')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Info className="h-4 w-4" /> Institucional</button>
            <button onClick={() => scrollTo('contacto')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><MessageSquare className="h-4 w-4" /> Contacto</button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Módulos</h4>
          <div className="mt-5 space-y-3">
            <button onClick={() => onDashboardAction('analitica')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><BarChart3 className="h-4 w-4" /> Gobernanza</button>
            <button onClick={() => onDashboardAction('documentos')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><FileStack className="h-4 w-4" /> Proyecto LP</button>
            <button onClick={() => onDashboardAction('datos')} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><Database className="h-4 w-4" /> Planeacion LP</button>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Entidad</h4>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Globe className="h-4 w-4" /> www.cali.gov.co</p>
            <p>Departamento Administrativo de Planeación Distrital</p>
            <p>Datos abiertos, transparencia y gestion documental.</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs font-semibold text-slate-400 md:flex-row">
        <p>© 2026 Alcaldia de Santiago de Cali. Todos los derechos reservados.</p>
        <p>Accesibilidad · Privacidad · Transparencia</p>
      </div>
    </footer>
  );
};
