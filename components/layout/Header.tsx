
import React, { useRef } from 'react';
import { Search, LayoutDashboard, Grid3X3, Disc, Download, Upload } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({ 
    currentView, searchTerm, setSearchTerm, filterEje, setFilterEje, 
    onExport, onImport, userRole
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0 print:h-auto print:border-none print:static">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                    {currentView === 'analitica' && <div className="p-2 bg-indigo-100 rounded-lg no-print"><LayoutDashboard className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                    {currentView === 'ecosistema' && <div className="p-2 bg-indigo-100 rounded-lg no-print"><Grid3X3 className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                    {currentView === 'mapa' && <div className="p-2 bg-indigo-100 rounded-lg no-print"><Disc className="h-5 w-5" style={{ color: CALI.MORADO }} /></div>}
                    <span>
                        {currentView === 'analitica' && 'Diagnóstico y Analítica de Gestión'}
                        {currentView === 'ecosistema' && 'Ecosistema de Planificación'}
                        {currentView === 'mapa' && 'Mapa Circular de Horizontes'}
                    </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 ml-12 no-print">Sistema de Planeación Distrital de Santiago de Cali</p>
            </div>

            <div className="flex items-center gap-4 no-print">
                <div className="flex items-center gap-3 fade-in">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar instrumento..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full w-64 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <div className="flex gap-2">
                        <select 
                            className="bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg px-3 py-2 outline-none hover:border-indigo-300 focus:border-indigo-500 shadow-sm cursor-pointer"
                            value={filterEje}
                            onChange={(e) => setFilterEje(e.target.value)}
                        >
                            <option value="Todos">Todos los Ejes</option>
                            {AXIS_ORDER.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors font-medium text-sm border border-emerald-200"
                                title="Importar desde Excel"
                            >
                                <Upload className="h-4 w-4" />
                                Importar
                            </button>
                        </>
                    )}

                    {/* Botón de Exportar (Todos) */}
                    <button 
                        onClick={onExport}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors font-medium text-sm border border-indigo-200"
                        title="Exportar a Excel"
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>
        </header>
    );
};
