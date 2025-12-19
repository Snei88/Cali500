
import React from 'react';
import { LayoutDashboard, Grid3X3, Database, Info, RefreshCw, LogOut, X, Map as MapIcon } from 'lucide-react';
import { CALI, VISION_IMAGE_URL } from '@/utils/constants';

interface SidebarProps {
    currentView: 'analitica' | 'ecosistema' | 'mapa' | 'datos';
    setCurrentView: (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => void;
    instrumentsCount: number;
    userRole: 'usuario' | 'administrador';
    handleResetData: () => void;
    isAuthenticated: boolean;
    handleLogout: () => void;
    isOpen: boolean;
    closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, setCurrentView, instrumentsCount, userRole, handleResetData, isAuthenticated, handleLogout,
    isOpen, closeSidebar
}) => {
    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 top-[73px] bg-slate-900/60 z-[45] md:hidden backdrop-blur-sm transition-opacity animate-in fade-in"
                    onClick={closeSidebar}
                ></div>
            )}

            <aside 
                className={`
                    fixed top-[73px] bottom-0 left-0 z-50 w-64 md:w-48 text-white flex flex-col shrink-0 shadow-2xl transition-transform duration-300 ease-in-out no-print
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{ backgroundColor: '#1E1B4B' }}
            >
                <div className="p-4 pb-2 flex flex-col items-center relative border-b border-white/5">
                    <button 
                        onClick={closeSidebar}
                        className="absolute top-2 right-2 p-2 text-white/50 hover:text-white transition-colors md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Logo pequeño de soporte dentro del menú */}
                    <div className="py-4 px-2 w-full">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col items-center">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Módulo de</span>
                            <span className="text-xs font-bold text-white uppercase text-center leading-tight">Gestión Territorial</span>
                        </div>
                    </div>
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { id: 'analitica', icon: LayoutDashboard, label: 'Analítica' },
                        { id: 'ecosistema', icon: Grid3X3, label: 'Inst. Planeación' },
                        { id: 'mapa', icon: MapIcon, label: 'Mapa Circular' },
                        { id: 'datos', icon: Database, label: 'Base de Datos' },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setCurrentView(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all group relative overflow-hidden ${
                                currentView === item.id 
                                ? 'text-white shadow-lg' 
                                : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                            }`}
                            style={currentView === item.id ? { backgroundColor: CALI.MORADO } : {}}
                        >
                            <item.icon className={`h-5 w-5 md:h-4 md:w-4 ${currentView === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-white transition-colors'}`} />
                            <span className="font-bold text-sm md:text-xs relative z-10 uppercase tracking-tighter">{item.label}</span>
                            {currentView === item.id && <div className="absolute right-0 top-0 bottom-0 w-1" style={{ backgroundColor: CALI.TURQUESA }}></div>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto space-y-2 border-t border-white/5 bg-[#1E1B4B]">
                    <div className="rounded-lg p-3 border border-indigo-500/20 backdrop-blur-sm bg-indigo-900/40 space-y-2">
                        <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 md:h-3 md:w-3 shrink-0 mt-0.5" style={{ color: CALI.TURQUESA }} />
                            <p className="text-xs md:text-[9px] text-indigo-200 leading-relaxed font-medium">
                                <strong className="text-white">{instrumentsCount} instrumentos</strong> registrados.
                            </p>
                        </div>
                    </div>
                    
                    {isAuthenticated && (
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-2 py-2.5 md:py-2 text-xs md:text-[10px] bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors">
                            <LogOut className="h-4 w-4 md:h-3 md:w-3" /> Salir
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};
