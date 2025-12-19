
import React from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { CALI, VISION_IMAGE_URL } from '@/utils/constants';

interface NavbarProps {
    activeSection: 'home' | 'about' | 'dashboard';
    setActiveSection: (section: 'home' | 'about' | 'dashboard') => void;
    onDashboardAction: (view: 'analitica' | 'ecosistema' | 'mapa') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection, onDashboardAction }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinks = [
        { id: 'home', label: 'Inicio' },
        { id: 'about', label: 'Quiénes Somos' },
        { id: 'dashboard', label: 'Dashboard' }
    ];

    const handleNav = (id: any) => {
        setActiveSection(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
                <img src={VISION_IMAGE_URL} alt="Logo" className="h-10 w-auto" />
                <div className="hidden md:block">
                    <span className="font-bold text-slate-800 text-lg leading-tight block">Cali 500+</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Planeación Distrital</span>
                </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map(link => (
                    <button 
                        key={link.id}
                        onClick={() => handleNav(link.id)}
                        className={`text-sm font-bold transition-colors relative py-1 ${activeSection === link.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
                    >
                        {link.label}
                        {activeSection === link.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>}
                    </button>
                ))}
                <button 
                    onClick={() => onDashboardAction('analitica')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                    Explorar Datos <ChevronRight className="h-3 w-3" />
                </button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
                    {navLinks.map(link => (
                        <button 
                            key={link.id}
                            onClick={() => handleNav(link.id)}
                            className={`text-left font-bold py-2 ${activeSection === link.id ? 'text-indigo-600' : 'text-slate-500'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};
