
import React from 'react';
import { MessageSquare, LayoutDashboard, Home, Info, Twitter, Globe, MessageCircle, Map as MapIcon, Database, BarChart3 } from 'lucide-react';
import { CALI, VISION_IMAGE_URL } from '@/utils/constants';

interface FooterProps {
    activeSection: 'home' | 'dashboard';
    setActiveSection: (section: 'home' | 'dashboard') => void;
    onDashboardAction: (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => void;
}

// Fix: The previous version of this file incorrectly contained HomeView code.
// Implementing the Footer component as expected by App.tsx to resolve the import error on line 10.
export const Footer: React.FC<FooterProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
    const handleNav = (id: string) => {
        if (id === 'about') {
            if (activeSection !== 'home') {
                setActiveSection('home');
            }
            setTimeout(() => {
                const element = document.getElementById('quienes-somos');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else if (id === 'home') {
            if (activeSection !== 'home') {
                setActiveSection('home');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'dashboard') {
            onDashboardAction('analitica');
        }
    };

    return (
        <footer className="bg-[#0F172A] text-white pt-16 pb-8 px-6 no-print">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('home')}>
                            <img src={VISION_IMAGE_URL} alt="Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
                            <div>
                                <span className="font-bold text-white text-lg leading-tight block">Cali 500+</span>
                                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Planeación Distrital</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                            Instrumento de planificación estratégica para el desarrollo integral de Santiago de Cali hacia su quinto centenario.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Twitter className="h-4 w-4" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Globe className="h-4 w-4" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><MessageCircle className="h-4 w-4" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Navegación</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => handleNav('home')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><Home className="h-3.5 w-3.5" /> Inicio</button></li>
                            <li><button onClick={() => handleNav('about')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><Info className="h-3.5 w-3.5" /> Quiénes Somos</button></li>
                            <li><button onClick={() => handleNav('dashboard')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><LayoutDashboard className="h-3.5 w-3.5" /> Dashboard</button></li>
                            <li><button onClick={() => { if (activeSection !== 'home') setActiveSection('home'); setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Contacto</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Módulos Dashboard</h4>
                        <ul className="space-y-4">
                            <li><button onClick={() => onDashboardAction('analitica')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5" /> Analítica</button></li>
                            <li><button onClick={() => onDashboardAction('ecosistema')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><Database className="h-3.5 w-3.5" /> Instrumentos</button></li>
                            <li><button onClick={() => onDashboardAction('mapa')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><MapIcon className="h-3.5 w-3.5" /> Mapa Circular</button></li>
                            <li><button onClick={() => onDashboardAction('datos')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><Database className="h-3.5 w-3.5" /> Base de Datos</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Información</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Globe className="h-4 w-4 text-indigo-400 shrink-0" />
                                <span>www.cali.gov.co</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <Info className="h-4 w-4 text-indigo-400 shrink-0" />
                                <span>Planeación Distrital</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400 text-sm">
                                <MessageCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                                <span>PQRSD - Alcaldía de Cali</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <p>© 2025 Alcaldía de Santiago de Cali - Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Datos Abiertos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
