
import React, { useRef } from 'react';
import { Search, LayoutDashboard, Grid3X3, Disc, Download, Upload, Menu } from 'lucide-react';
import { CALI, AXIS_ORDER } from '@/utils/constants';

interface HeaderProps {
    currentView: 'analitica' | 'ecosistema' | 'mapa';
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterEje: string;
    setFilterEje: (eje: string) => void;
    onExport: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    userRole: string;
    toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    currentView, searchTerm, setSearchTerm, filterEje, setFilterEje, 
    onExport, onImport, userRole, toggleSidebar
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="h-auto md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-0 shrink-0 z-10 sticky top-0 print:h-auto print:border-none print:static gap-3">
            <div className="w-full md:w-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleSidebar}
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2.5">
                            {/* Icons hidden on mobile to save space */}
                            {currentView === 'analitica' && <div className="hidden md:block p-2 bg-indigo-100 rounded-lg no-print"><LayoutDashboard className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                            {currentView === 'ecosistema' && <div className="hidden md:block p-2 bg-indigo-100 rounded-lg no-print"><Grid3X3 className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                            {currentView === 'mapa' && <div className="hidden md:block p-2 bg-indigo-100 rounded-lg no-print"><Disc className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                            <span className="line-clamp-1">
                                {currentView === 'analitica' && 'Analítica de Gestión'}
                                {currentView === 'ecosistema' && 'Ecosistema'}
                                {currentView === 'mapa' && 'Mapa de Horizontes'}
                            </span>
                        </h2>
                        <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:ml-12 no-print hidden md:block">Sistema de Planeación Distrital de Santiago de Cali</p>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3 md:gap-4 no-print">
                <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2 md:gap-3 fade-in">
                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full w-full md:w-64 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="hidden md:block h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            className="bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg px-3 py-2 outline-none hover:border-indigo-300 focus:border-indigo-500 shadow-sm cursor-pointer w-full md:w-auto"
                            value={filterEje}
                            onChange={(e) => setFilterEje(e.target.value)}
                        >
                            <option value="Todos">Todos los Ejes</option>
                            {AXIS_ORDER.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex w-full md:w-auto justify-end items-center gap-2">
                    {/* Botón de Importar (Solo Admin) */}
                    {userRole === 'administrador' && (
                        <>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".xlsx, .xls"
                                onChange={onImport}
                            />
                            <button 
                                onClick={triggerFileInput}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-sm border border-emerald-200 w-full md:w-auto"
                                title="Importar desde Excel"
                            >
                                <Upload className="h-4 w-4" />
                                <span className="md:hidden lg:inline">Importar</span>
                            </button>
                        </>
                    )}

                    {/* Botón de Exportar (Todos) */}
                    <button 
                        onClick={onExport}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors font-medium text-sm border border-indigo-200 w-full md:w-auto"
                        title="Exportar a Excel"
                    >
                        <Download className="h-4 w-4" />
                        <span className="md:hidden lg:inline">Exportar</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
