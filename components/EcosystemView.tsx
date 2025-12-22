
import React from 'react';
// Fix: Added missing 'X' icon import from lucide-react.
import { Plus, User, Shield, Check, X, Link as LinkIcon, Edit3, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Instrumento } from '@/types';
import { AXIS_ORDER, STATUS_BORDER_COLORS } from '@/utils/constants';
import { calculateProgress, getSemaforoStatus } from '@/utils/helpers';

interface EcosystemViewProps {
    groupedData: Record<string, Instrumento[]>;
    userRole: 'usuario' | 'administrador';
    openCreateModal: () => void;
    setUserRole: (role: 'usuario' | 'administrador') => void;
    setSelectedInstrument: (inst: Instrumento) => void;
    handleDeleteInstrument: (id: number, e: React.MouseEvent) => void;
    onAdminRequest: () => void;
}

const SemaforoComponent = ({ status }: { status: 'critico' | 'intermedio' | 'optimo' }) => (
    <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1.5 rounded-full border border-slate-200">
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${status === 'critico' ? 'bg-red-500 shadow-red-200 animate-pulse' : 'bg-slate-300'}`}></div>
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${status === 'intermedio' ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-300'}`}></div>
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${status === 'optimo' ? 'bg-green-500 shadow-green-200' : 'bg-slate-300'}`}></div>
    </div>
);

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
                        <div className="text-white px-5 py-4 rounded-2xl flex items-center justify-between shadow-lg" style={{ backgroundColor: '#1E1B4B' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-indigo-400 animate-pulse"></div>
                                <h2 className="font-black text-lg tracking-tight uppercase">{axis}</h2>
                            </div>
                            <span className="text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                                {items.length} Instrumentos
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {items.map(item => {
                                const progress = calculateProgress(item.inicio, item.fin);
                                const status = getSemaforoStatus(progress);
                                
                                return (
                                    <div 
                                        key={item.id}
                                        onClick={() => setSelectedInstrument(item)}
                                        className={`
                                            bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all cursor-pointer 
                                            flex flex-col p-6 relative overflow-hidden group hover:-translate-y-1
                                            ${STATUS_BORDER_COLORS[item.estado] || 'border-l-slate-300'} border-l-8
                                        `}
                                    >
                                        {userRole === 'administrador' && (
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                                <button className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteInstrument(item.id, e)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="mb-4">
                                            <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-1 rounded-md border border-slate-200 uppercase tracking-widest mb-2 inline-block">
                                                {item.tipo}
                                            </span>
                                            <h3 className="font-black text-slate-900 text-sm leading-tight line-clamp-2 h-10 group-hover:text-indigo-600 transition-colors" title={item.nombre}>
                                                {item.nombre}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-bold">{item.inicio} — {item.fin}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${item.seguimiento === 'Si' ? 'text-emerald-600' : 'text-slate-300'}`}>
                                                {item.seguimiento === 'Si' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                Seguimiento
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Estado Ejecución</span>
                                                <span className={`text-[10px] font-black uppercase ${status === 'critico' ? 'text-red-600' : status === 'intermedio' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {status === 'critico' ? 'Iniciando' : status === 'intermedio' ? 'En Curso' : 'Avanzado'}
                                                </span>
                                            </div>
                                            <SemaforoComponent status={status} />
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
