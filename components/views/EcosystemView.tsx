
import React from 'react';
import { Plus, User, Shield, Check, Link as LinkIcon, Edit3, Trash2 } from 'lucide-react';
import { Instrumento } from '@/types';
import { CALI, AXIS_ORDER, STATUS_BORDER_COLORS } from '@/utils/constants';
import { calculateProgress } from '@/utils/helpers';

interface EcosystemViewProps {
    groupedData: Record<string, Instrumento[]>;
    userRole: 'usuario' | 'administrador';
    openCreateModal: () => void;
    setUserRole: (role: 'usuario' | 'administrador') => void;
    setSelectedInstrument: (inst: Instrumento) => void;
    handleDeleteInstrument: (id: number, e: React.MouseEvent) => void;
    onAdminRequest: () => void; // New callback
}

export const EcosystemView: React.FC<EcosystemViewProps> = ({ 
    groupedData, userRole, openCreateModal, setUserRole, 
    setSelectedInstrument, handleDeleteInstrument, onAdminRequest
}) => {
    return (
        <div className="space-y-6 fade-in pb-20">
            <div className="flex justify-between items-center mb-8 no-print px-2">
                {userRole === 'administrador' ? (
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 font-bold text-sm transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5" />
                        Agregar Instrumento
                    </button>
                ) : <div />}

                <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex relative ml-auto">
                    <button onClick={() => setUserRole('usuario')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${userRole === 'usuario' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <User className="h-4 w-4" />
                        Vista Ciudadana
                    </button>
                    <button onClick={onAdminRequest} className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${userRole === 'administrador' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <Shield className="h-4 w-4" />
                        Gestión (Admin)
                    </button>
                </div>
            </div>
            
            {AXIS_ORDER.map((axis) => {
                const items = groupedData[axis];
                if (!items || items.length === 0) return null;
                
                return (
                    <div key={axis} className="space-y-4">
                        <div className="text-white px-5 py-3 rounded-lg flex items-center justify-between shadow-md" style={{ backgroundColor: '#312E81' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-white/20 ring-2 ring-white/10"></div>
                                <h2 className="font-bold text-lg tracking-wide">{axis}</h2>
                            </div>
                            <span className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: CALI.TURQUESA }}>
                                {items.length} instrumentos
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {items.map(item => {
                                const progress = calculateProgress(item.inicio, item.fin);
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => setSelectedInstrument(item)}
                                        className={`
                                            bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer 
                                            flex flex-col p-4 relative overflow-hidden group
                                            ${STATUS_BORDER_COLORS[item.estado] || 'border-l-slate-300'} border-l-4
                                        `}
                                    >
                                        {userRole === 'administrador' && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button 
                                                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteInstrument(item.id, e)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                        <h3 className="font-bold text-sm mb-3 line-clamp-2 h-10 leading-tight pr-6" style={{ color: '#312E81' }} title={item.nombre}>{item.nombre}</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: CALI.TURQUESA }}>
                                                {item.tipo.split(' ')[0]}
                                            </span>
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                                                {item.inicio} - {item.fin}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 mb-5">
                                            {item.seguimiento === 'Si' ? (
                                                <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm" style={{ backgroundColor: '#84CC16' }}>
                                                    <Check className="h-3 w-3" /> Seg.
                                                </span>
                                            ) : (
                                                <span className="bg-slate-200 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-60">
                                                    Seg.
                                                </span>
                                            )}
                                            {item.observatorio ? (
                                                <span className="text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm" style={{ backgroundColor: '#4C1D95' }}>
                                                    Obs. <LinkIcon className="h-3 w-3" />
                                                </span>
                                            ) : (
                                                <span className="bg-slate-200 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-60">
                                                    Obs.
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="flex justify-between items-end text-xs text-slate-400 mb-1">
                                                <span className="font-medium">{item.estado}</span>
                                                <span className="font-mono">{progress}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-300 transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: CALI.VERDE }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
