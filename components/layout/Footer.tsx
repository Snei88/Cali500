
import React from 'react';
import { Mail, Phone, MapPin, Globe, AtSign, Database, ChevronRight } from 'lucide-react';
import { VISION_IMAGE_URL } from '@/utils/constants';

interface FooterProps {
    activeSection?: 'home' | 'dashboard';
    setActiveSection?: (section: 'home' | 'dashboard') => void;
    onDashboardAction?: (view: 'analitica' | 'ecosistema' | 'mapa') => void;
}

export const Footer: React.FC<FooterProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
    
    const handleNav = (id: string, targetView?: 'analitica' | 'ecosistema' | 'mapa') => {
        if (id === 'home') {
            if (setActiveSection) setActiveSection('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'about' || id === 'prensa' || id === 'contacto') {
            const targetId = id === 'about' ? 'quienes-somos' : id === 'prensa' ? 'sala-prensa' : 'contacto';
            if (activeSection !== 'home' && setActiveSection) {
                setActiveSection('home');
                setTimeout(() => {
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (id === 'dashboard') {
            if (onDashboardAction) onDashboardAction(targetView || 'analitica');
        }
    };

    return (
        <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 px-6 md:px-12 border-t border-white/5 font-['Plus_Jakarta_Sans']">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('home')}>
                        <img src={VISION_IMAGE_URL} alt="Cali 500+" className="h-10 brightness-0 invert group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold text-white tracking-tight">Cali 500+</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                        Uniendo esfuerzos para planificar y construir el futuro de nuestra ciudad hacia sus 500 años con datos y visión estratégica.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.cali.gov.co" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"><Globe className="h-5 w-5" /></a>
                        <a href="https://twitter.com/alcaldiadecali" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"><AtSign className="h-5 w-5" /></a>
                    </div>
                </div>

                {/* Platform Column */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Plataforma</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><button onClick={() => handleNav('home')} className="hover:text-indigo-400 transition-colors">Inicio</button></li>
                        <li><button onClick={() => handleNav('dashboard', 'analitica')} className="hover:text-indigo-400 transition-colors">Dashboard de Indicadores</button></li>
                        <li><button onClick={() => handleNav('dashboard', 'mapa')} className="hover:text-indigo-400 transition-colors">Mapa de Proyectos</button></li>
                        <li><button onClick={() => handleNav('dashboard', 'ecosistema')} className="hover:text-indigo-400 transition-colors">Ecosistema Digital</button></li>
                    </ul>
                </div>

                {/* Institutional Column */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Institucional</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><button onClick={() => handleNav('about')} className="hover:text-indigo-400 transition-colors">Quiénes somos</button></li>
                        <li><button onClick={() => alert('Próximamente: Listado de Aliados Estratégicos')} className="hover:text-indigo-400 transition-colors">Aliados Estratégicos</button></li>
                        <li><button onClick={() => alert('Acceso a la sección de Transparencia de la Alcaldía')} className="hover:text-indigo-400 transition-colors">Transparencia</button></li>
                        <li><button onClick={() => handleNav('prensa')} className="hover:text-indigo-400 transition-colors">Sala de Prensa</button></li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contacto</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-400" /> paulajanetam@gmail.com</li>
                        <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-400" /> +57 317 399 0220</li>
                        <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-indigo-400" /> CAM Torre Alcaldía, Cali</li>
                    </ul>
                    <div className="mt-8">
                        <button 
                            onClick={() => onDashboardAction?.('analitica')}
                            className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-600/5 active:scale-95"
                        >
                            <Database className="h-3 w-3" /> Datos Abiertos / API
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <p>© 2024 Cali 500+. Todos los derechos reservados • Planeación Distrital de Cali.</p>
                <div className="flex gap-6">
                    <button onClick={() => alert('Política de Privacidad - Cali 500+')} className="hover:text-white transition-colors">Privacidad</button>
                    <button onClick={() => alert('Términos de Uso - Cali 500+')} className="hover:text-white transition-colors">Términos</button>
                    <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Mapa del Sitio</button>
                </div>
            </div>
        </footer>
    );
};
