
import React from 'react';
import { ExternalLink, Check, X, FileText, Globe } from 'lucide-react';
import { Instrumento } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';

interface DataViewProps {
    instruments: Instrumento[];
    onSelect: (inst: Instrumento) => void;
}

export const DataView: React.FC<DataViewProps> = ({ instruments, onSelect }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden fade-in h-full flex flex-col">
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-900 text-white">
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Nombre</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Tipo de Documento</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Eje Estratégico</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Año Inicio</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Año Final</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Vigencia (Años)</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Estado</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800 text-center">Seguimiento</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Entidad de Monitoreo</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {instruments.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-10 text-center text-slate-400 text-sm font-medium italic bg-slate-50">
                                    No se encontraron instrumentos con los filtros seleccionados.
                                </td>
                            </tr>
                        ) : (
                            instruments.map((inst) => (
                                <tr 
                                    key={inst.id} 
                                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                                    onClick={() => onSelect(inst)}
                                >
                                    <td className="px-4 py-3 border-r border-slate-100">
                                        <div className="font-bold text-slate-800 text-xs leading-tight group-hover:text-indigo-600 transition-colors">{inst.nombre}</div>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">{inst.tipo}</span>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100">
                                        <span className="text-[10px] font-semibold text-indigo-700/70">{inst.eje}</span>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-center font-mono text-xs text-slate-600">
                                        {inst.inicio}
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-center font-mono text-xs text-slate-600">
                                        {inst.fin}
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-center font-mono text-xs text-slate-600">
                                        {inst.temporalidad}
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border ${STATUS_COLORS[inst.estado] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {inst.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100 text-center">
                                        {inst.seguimiento === 'Si' ? (
                                            <div className="flex justify-center"><Check className="h-4 w-4 text-emerald-500" /></div>
                                        ) : (
                                            <div className="flex justify-center"><X className="h-4 w-4 text-rose-300" /></div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-r border-slate-100">
                                        <span className="text-[10px] font-medium text-slate-600 italic">
                                            {inst.observatorio && inst.observatorio !== 'No' ? inst.observatorio : '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            {inst.enlace ? (
                                                <a 
                                                    href={inst.enlace} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-600 hover:text-white transition-all"
                                                    title="Ver Enlace Oficial"
                                                >
                                                    <Globe className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <div className="p-1.5 opacity-10"><Globe className="h-3.5 w-3.5" /></div>
                                            )}
                                            <button 
                                                className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                                title="Ver Detalles"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Total Instrumentos: {instruments.length}</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Seguimiento Activo</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-300"></div> Sin Seguimiento</div>
                </div>
            </div>
        </div>
    );
};
