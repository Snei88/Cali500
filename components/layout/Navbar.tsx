
import React from 'react';
import { Menu, X, MessageSquare } from 'lucide-react';
import { CALI, VISION_IMAGE_URL } from '@/utils/constants';

interface NavbarProps {
    activeSection: 'home' | 'dashboard';
    setActiveSection: (section: 'home' | 'dashboard') => void;
    onDashboardAction: (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinks = [
        { id: 'home', label: 'Inicio' },
        { id: 'about', label: 'Quiénes Somos' },
        { id: 'dashboard', label: 'Dashboard' }
    ];

    const handleContactScroll = () => {
        if (activeSection !== 'home') {
            setActiveSection('home');
            setTimeout(() => {
                const element = document.getElementById('contacto');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById('contacto');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMenuOpen(false);
    };

    const handleNav = (id: string) => {
        if (id === 'about') {
            if (activeSection !== 'home') {
                setActiveSection('home');
                setTimeout(() => {
                    const element = document.getElementById('quienes-somos');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.getElementById('quienes-somos');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (id === 'home') {
            setActiveSection('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'dashboard') {
            onDashboardAction('analitica');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="h-[73px] bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('home')}>
                <img src={VISION_IMAGE_URL} alt="Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
                <div className="hidden md:block">
                    <span className="font-bold text-slate-800 text-lg leading-tight block">Cali 500+</span>
                    <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Planeación Distrital</span>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
                {navLinks.map(link => (
                    <button 
                        key={link.id}
                        onClick={() => handleNav(link.id)}
                        className={`text-[12px] font-extrabold uppercase tracking-widest transition-all relative py-1 ${
                            (link.id === 'about' && activeSection === 'home') || activeSection === (link.id as any) 
                            ? 'text-indigo-600' 
                            : 'text-slate-400 hover:text-indigo-500'
                        }`}
                    >
                        {link.label}
                        {(activeSection === (link.id as any) && link.id !== 'about') && (
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600 rounded-full animate-in fade-in duration-500"></span>
                        )}
                    </button>
                ))}
                <button 
                    onClick={handleContactScroll}
                    className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2 active:scale-95"
                >
                    Contáctanos <MessageSquare className="h-3.5 w-3.5" />
                </button>
            </div>

            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
            </button>

            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-4 shadow-2xl">
                    {navLinks.map(link => (
                        <button 
                            key={link.id}
                            onClick={() => handleNav(link.id)}
                            className={`text-left font-black uppercase tracking-widest text-sm ${activeSection === (link.id as any) ? 'text-indigo-600' : 'text-slate-400'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <button 
                        onClick={handleContactScroll}
                        className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center shadow-xl shadow-indigo-600/20"
                    >
                        Contáctanos
                    </button>
                </div>
            )}
        </nav>
    );
};
