
import React from 'react';
import { LayoutDashboard, Grid3X3, Disc, Info, RefreshCw, LogOut } from 'lucide-react';
import { CALI, VISION_IMAGE_URL } from '@/utils/constants';

interface SidebarProps {
    currentView: 'analitica' | 'ecosistema' | 'mapa';
    setCurrentView: (view: 'analitica' | 'ecosistema' | 'mapa') => void;
    instrumentsCount: number;
    userRole: 'usuario' | 'administrador';
    handleResetData: () => void;
    isAuthenticated: boolean;
    handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, setCurrentView, instrumentsCount, userRole, handleResetData, isAuthenticated, handleLogout 
}) => {
    return (
        <aside className="w-48 text-white flex flex-col shrink-0 z-20 shadow-2xl transition-all no-print" style={{ backgroundColor: '#1E1B4B' }}>
            <div className="p-4 pb-2 flex flex-col items-center">
                <img src={VISION_IMAGE_URL} alt="Visión Cali 500+" className="w-full h-auto object-contain rounded-xl mb-2 hover:scale-105 transition-transform duration-300" />
            </div>
            
            <nav className="flex-1 px-2 py-2 space-y-1">
                {[
                    { id: 'analitica', icon: LayoutDashboard, label: 'Analítica' },
                    { id: 'ecosistema', icon: Grid3X3, label: 'Ecosistema' },
                    { id: 'mapa', icon: Disc, label: 'Mapa Circular' },
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setCurrentView(item.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden ${
                            currentView === item.id 
                            ? 'text-white shadow-lg' 
                            : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                        }`}
                        style={currentView === item.id ? { backgroundColor: CALI.MORADO } : {}}
                    >
                        <item.icon className={`h-4 w-4 ${currentView === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-white transition-colors'}`} />
                        <span className="font-medium text-xs relative z-10">{item.label}</span>
                        {currentView === item.id && <div className="absolute right-0 top-0 bottom-0 w-1" style={{ backgroundColor: CALI.TURQUESA }}></div>}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto space-y-2">
                <div className="rounded-lg p-3 border border-indigo-500/20 backdrop-blur-sm bg-indigo-900/40 space-y-2">
                    <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 shrink-0 mt-0.5" style={{ color: CALI.TURQUESA }} />
                        <p className="text-[9px] text-indigo-200 leading-relaxed font-medium">
                            <strong className="text-white">{instrumentsCount} instrumentos</strong>.
                        </p>
                    </div>
                </div>
                
                {isAuthenticated && (
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-2 py-2 text-[10px] bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors">
                        <LogOut className="h-3 w-3" /> Cerrar Sesión
                    </button>
                )}

                {userRole === 'administrador' && (
                    <button onClick={handleResetData} className="w-full flex items-center justify-center gap-2 px-2 py-1.5 text-[9px] bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded border border-red-500/30 transition-colors">
                        <RefreshCw className="h-3 w-3" /> Restaurar Datos
                    </button>
                )}
            </div>
        </aside>
    );
};
