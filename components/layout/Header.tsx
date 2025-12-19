
import React, { useRef } from 'react';
import { Search, LayoutDashboard, Grid3X3, Database, Download, Upload, Menu, Filter, Map as MapIcon } from 'lucide-react';
import { CALI, AXIS_ORDER } from '@/utils/constants';

interface HeaderProps {
    currentView: 'analitica' | 'ecosistema' | 'mapa' | 'datos';
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

    return (
        <header className="h-auto md:h-16 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-2 md:py-0 shrink-0 z-20 sticky top-0 no-print gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Alternar Menú"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        {currentView === 'analitica' && 'Analítica de Gestión'}
                        {currentView === 'ecosistema' && 'Instrumentos de Planeación'}
                        {currentView === 'mapa' && 'Mapa Circular de Instrumentos'}
                        {currentView === 'datos' && 'Base de Datos de Instrumentos'}
                    </span>
                </div>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <div className="relative group w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar instrumentos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full w-full text-xs outline-none focus:border-indigo-400 focus:bg-white transition-all"
                    />
                </div>

                <select 
                    className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded-lg px-3 py-1.5 outline-none hover:border-indigo-300 w-full md:w-auto cursor-pointer"
                    value={filterEje}
                    onChange={(e) => setFilterEje(e.target.value)}
                >
                    <option value="Todos">Todos los Ejes</option>
                    {AXIS_ORDER.map(e => <option key={e} value={e}>{e}</option>)}
                </select>

                <div className="flex items-center gap-2 w-full md:w-auto mb-2 md:mb-0">
                    {userRole === 'administrador' && (
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors" title="Importar Excel">
                            <Upload className="h-4 w-4" />
                            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={onImport} />
                        </button>
                    )}
                    <button onClick={onExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-black text-[10px] uppercase tracking-widest border border-indigo-100 shadow-sm transition-all active:scale-95">
                        <Download className="h-3.5 w-3.5" /> Exportar
                    </button>
                </div>
            </div>
        </header>
    );
};
