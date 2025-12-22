
import React from 'react';
import { Plus, User, Shield, Check, Link as LinkIcon, Edit3, Trash2, Calendar } from 'lucide-react';
import { Instrumento } from '@/types';
import { AXIS_ORDER, STATUS_BORDER_COLORS } from '@/utils/constants';
import { calculateProgress, getSemaforoClass } from '@/utils/helpers';

interface EcosystemViewProps {
    groupedData: Record<string, Instrumento[]>;
    userRole: 'usuario' | 'administrador';
    openCreateModal: () => void;
    setUserRole: (role: 'usuario' | 'administrador') => void;
    setSelectedInstrument: (inst: Instrumento) => void;
    handleDeleteInstrument: (id: number, e: React.MouseEvent) => void;
    onAdminRequest: () => void;
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
                            <span className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm bg-indigo-500/30 border border-white/10">
                                {items.length} instrumentos
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {items.map(item => {
                                const progress = calculateProgress(item.inicio, item.fin);
                                const semaforoClass = getSemaforoClass(progress);
                                
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
                                                <button className="p-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteInstrument(item.id, e)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <h3 className="font-bold text-sm mb-3 line-clamp-2 h-10 leading-tight pr-6 text-slate-800" title={item.nombre}>
                                            {item.nombre}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-200 uppercase">
                                                {item.tipo}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-[10px] font-bold">{item.inicio} - {item.fin}</span>
                                            </div>
                                            {item.seguimiento === 'Si' && (
                                                <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                                                    <Check className="h-3 w-3" /> Seg.
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="mt-auto space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${progress <= 35 ? 'text-red-600' : progress <= 70 ? 'text-amber-600' : 'text-green-600'}`}>
                                                    Ejecución: {progress <= 35 ? 'Inicial' : progress <= 70 ? 'En curso' : 'Avanzado'}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                                                {/* Semáforo Visual */}
                                                <div className={`h-full flex-1 transition-all duration-500 ${progress > 0 ? semaforoClass : 'bg-slate-200 opacity-30'}`}></div>
                                                <div className={`h-full flex-1 transition-all duration-500 ${progress > 35 ? semaforoClass : 'bg-slate-200 opacity-30'}`}></div>
                                                <div className={`h-full flex-1 transition-all duration-500 ${progress > 70 ? semaforoClass : 'bg-slate-200 opacity-30'}`}></div>
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
