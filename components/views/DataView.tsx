
import React from 'react';
import { ExternalLink, Check, X, FileText, Globe, Activity } from 'lucide-react';
import { Instrumento } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';
import { calculateProgress, getSemaforoStatus } from '@/utils/helpers';

interface DataViewProps {
    instruments: Instrumento[];
    onSelect: (inst: Instrumento) => void;
}

const TableSemaforo = ({ status }: { status: 'critico' | 'intermedio' | 'optimo' }) => (
    <div className="flex gap-1 justify-center">
        <div className={`w-2 h-2 rounded-full ${status === 'critico' ? 'bg-red-500 shadow-sm shadow-red-200' : 'bg-slate-200'}`}></div>
        <div className={`w-2 h-2 rounded-full ${status === 'intermedio' ? 'bg-amber-500 shadow-sm shadow-amber-200' : 'bg-slate-200'}`}></div>
        <div className={`w-2 h-2 rounded-full ${status === 'optimo' ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-200'}`}></div>
    </div>
);

export const DataView: React.FC<DataViewProps> = ({ instruments, onSelect }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden fade-in h-full flex flex-col">
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-900 text-white">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Instrumento</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Tipo</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Eje Estratégico</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Inicio</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Fin</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Semáforo</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Estado</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Seg.</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Monitoreo</th>
                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {instruments.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-20 text-center text-slate-400 text-sm font-medium italic bg-slate-50">
                                    No se encontraron instrumentos con los criterios de búsqueda.
                                </td>
                            </tr>
                        ) : (
                            instruments.map((inst) => {
                                const progress = calculateProgress(inst.inicio, inst.fin);
                                const status = getSemaforoStatus(progress);
                                
                                return (
                                    <tr 
                                        key={inst.id} 
                                        className="hover:bg-indigo-50/50 transition-all cursor-pointer group border-b border-slate-50"
                                        onClick={() => onSelect(inst)}
                                    >
                                        <td className="px-6 py-4 border-r border-slate-100">
                                            <div className="font-black text-slate-800 text-[11px] leading-tight group-hover:text-indigo-600 transition-colors uppercase">{inst.nombre}</div>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100">
                                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-tighter border border-slate-200">{inst.tipo}</span>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100">
                                            <span className="text-[10px] font-bold text-indigo-600/80 uppercase tracking-tighter">{inst.eje}</span>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100 text-center font-mono text-xs font-bold text-slate-600">
                                            {inst.inicio}
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100 text-center font-mono text-xs font-bold text-slate-600">
                                            {inst.fin}
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100 text-center">
                                            <TableSemaforo status={status} />
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100 text-center">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black uppercase border shadow-sm ${STATUS_COLORS[inst.estado] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                {inst.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100 text-center">
                                            {inst.seguimiento === 'Si' ? (
                                                <div className="flex justify-center"><Check className="h-4 w-4 text-emerald-500 stroke-[3px]" /></div>
                                            ) : (
                                                <div className="flex justify-center"><X className="h-4 w-4 text-slate-200" /></div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase italic truncate max-w-[150px] block">
                                                {inst.observatorio && inst.observatorio !== 'No' ? inst.observatorio : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {inst.enlace ? (
                                                    <a 
                                                        href={inst.enlace} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2 bg-cyan-50 text-cyan-600 rounded-xl hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                                                        title="Ver Enlace Oficial"
                                                    >
                                                        <Globe className="h-4 w-4" />
                                                    </a>
                                                ) : (
                                                    <div className="p-2 opacity-10 bg-slate-100 rounded-xl"><Globe className="h-4 w-4" /></div>
                                                )}
                                                <button 
                                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    title="Ver Detalles"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-900 border-t border-slate-800 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-6">
                    <span>Total Instrumentos: <span className="text-white">{instruments.length}</span></span>
                    <span className="h-4 w-px bg-white/10 hidden md:block"></span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Seguimiento OK</div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div> Sin Seguimiento</div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Crítico</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Intermedio</div>
                    <div className={`flex items-center gap-2`}><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Óptimo</div>
                </div>
            </div>
        </div>
    );
};
