
import React from 'react';
import { LayoutDashboard, Grid3X3, Database, Info, LogOut, X, Map as MapIcon, Trash2, CloudOff, Cloud } from 'lucide-react';
import { CALI } from '@/utils/constants';

interface SidebarProps {
    currentView: 'analitica' | 'ecosistema' | 'mapa' | 'datos';
    setCurrentView: (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => void;
    instrumentsCount: number;
    userRole: 'usuario' | 'administrador';
    isAuthenticated: boolean;
    handleLogout: () => void;
    isOpen: boolean;
    closeSidebar: () => void;
    onPurge?: () => void;
    isLocal?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, setCurrentView, instrumentsCount, userRole, isAuthenticated, handleLogout,
    isOpen, closeSidebar, onPurge, isLocal
}) => {
    return (
        <>
            {isOpen && <div className="fixed inset-0 top-[73px] bg-slate-900/60 z-[45] md:hidden backdrop-blur-sm" onClick={closeSidebar}></div>}

            <aside 
                className={`fixed top-[73px] bottom-0 left-0 z-50 w-64 md:w-48 text-white flex flex-col shrink-0 shadow-2xl transition-transform duration-300 ease-in-out bg-[#1E1B4B] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4 border-b border-white/5 space-y-3">
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isLocal ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {isLocal ? <CloudOff className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                        {isLocal ? 'Modo Local' : 'Nube Activa'}
                    </div>
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'analitica', icon: LayoutDashboard, label: 'Analítica' },
                        { id: 'ecosistema', icon: Grid3X3, label: 'Seguimiento' },
                        { id: 'mapa', icon: MapIcon, label: 'Mapa Circular' },
                        { id: 'datos', icon: Database, label: 'Base de Datos' },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setCurrentView(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${currentView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-200 hover:bg-white/5'}`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-tighter">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto space-y-3 border-t border-white/5">
                    {userRole === 'administrador' && (
                        <button 
                            onClick={onPurge}
                            className="w-full flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 text-[9px] font-black uppercase transition-all"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Vaciar Nube
                        </button>
                    )}
                    
                    {isAuthenticated && (
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-2 py-2 text-[10px] bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors uppercase font-black">
                            <LogOut className="h-3 w-3" /> Salir
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};
