import React, { useState, useEffect } from 'react';
import { X, Settings, Save, CheckCircle2, Activity, ExternalLink, FileText } from 'lucide-react';
import { Instrumento } from '@/types';
import { CALI, TYPES_ORDER, AXIS_ORDER, STATUS_ORDER, STATUS_COLORS } from '@/utils/constants';

interface InstrumentDrawerProps {
    instrument: Instrumento | null;
    onClose: () => void;
    role: string;
    onUpdate: (inst: Instrumento) => void;
    onCreate: (inst: Instrumento) => void;
    isCreating: boolean;
}

export const InstrumentDrawer: React.FC<InstrumentDrawerProps> = ({ instrument, onClose, role, onUpdate, onCreate, isCreating }) => {
    const [editData, setEditData] = useState<Instrumento | null>(null);

    useEffect(() => {
        setEditData(instrument);
    }, [instrument]);

    if (!editData) return null;

    const handleToggle = (field: keyof Instrumento, value: any) => {
        const newData = { ...editData, [field]: value };
        setEditData(newData);
    }
    
    const handleInputChange = (field: keyof Instrumento, value: any) => {
        setEditData({ ...editData, [field]: value });
    }

    const handleSave = () => {
        if (!editData.nombre) {
            alert("El nombre es obligatorio");
            return;
        }
        if (isCreating) {
            onCreate(editData);
        } else {
            onUpdate(editData);
        }
        onClose();
    }

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col slide-in-right">
                {/* Header */}
                <div className="h-44 relative shrink-0 overflow-hidden" style={{ backgroundColor: CALI.MORADO }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-[#1E1B4B] opacity-50"></div>
                    {/* Decorative circles */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute left-10 bottom-10 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl"></div>
                    
                    <div className="relative h-full p-6 flex flex-col justify-end text-white">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 border border-white/10 backdrop-blur-sm">
                                {isCreating ? 'NUEVO' : `ID: ${editData.id}`}
                            </span>
                            {!isCreating && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 backdrop-blur-sm">{editData.tipo}</span>}
                        </div>
                        {isCreating ? (
                            <input 
                                type="text" 
                                value={editData.nombre} 
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                placeholder="Nombre del Instrumento..."
                                className="text-xl font-bold leading-tight bg-transparent border-b border-white/30 outline-none w-full placeholder-white/50 focus:border-white transition-colors"
                            />
                        ) : (
                            <h2 className="text-xl font-bold leading-tight">{editData.nombre}</h2>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
                    
                    {role === 'administrador' && (
                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-indigo-800 font-bold text-sm border-b border-indigo-200 pb-2">
                                <Settings className="h-4 w-4" />
                                {isCreating ? 'Configuración Inicial' : 'Panel de Gestión (Administrador)'}
                            </div>
                            
                            {isCreating && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-600">Tipo de Instrumento</label>
                                        <select 
                                            value={editData.tipo} 
                                            onChange={(e) => handleInputChange('tipo', e.target.value)}
                                            className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            {TYPES_ORDER.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-600">Eje Estratégico</label>
                                        <select 
                                            value={editData.eje} 
                                            onChange={(e) => handleInputChange('eje', e.target.value)}
                                            className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            {AXIS_ORDER.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Año Inicio</label>
                                            <input type="number" value={editData.inicio} onChange={(e) => handleInputChange('inicio', parseInt(e.target.value))} className="w-full p-2 text-sm border border-slate-300 rounded-md" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">Año Fin</label>
                                            <input type="number" value={editData.fin === 'Permanente' ? 2050 : editData.fin} onChange={(e) => handleInputChange('fin', parseInt(e.target.value))} className="w-full p-2 text-sm border border-slate-300 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-600">Estado</label>
                                        <select 
                                            value={editData.estado} 
                                            onChange={(e) => handleInputChange('estado', e.target.value)}
                                            className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            {STATUS_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleToggle('seguimiento', editData.seguimiento === 'Si' ? 'No' : 'Si')}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${editData.seguimiento === 'Si' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                                >
                                    {editData.seguimiento === 'Si' ? '✔ Con Seguimiento' : '✖ Sin Seguimiento'}
                                </button>
                                <button 
                                    onClick={() => handleToggle('observatorio', editData.observatorio === 'Observatorio' || editData.observatorio === 'Si' ? '' : 'Observatorio')}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${editData.observatorio ? 'bg-violet-100 border-violet-300 text-violet-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                                >
                                    {editData.observatorio ? '✔ Con Observatorio' : '✖ Sin Observatorio'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">Enlace Documento (URL)</label>
                                <input 
                                    type="text" 
                                    value={editData.enlace || ''} 
                                    onChange={(e) => handleInputChange('enlace', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">Enlace PDF (URL)</label>
                                <input 
                                    type="text" 
                                    value={editData.pdf_informe || ''} 
                                    onChange={(e) => handleInputChange('pdf_informe', e.target.value)}
                                    className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <button onClick={handleSave} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                                <Save className="h-4 w-4" /> {isCreating ? 'Crear Instrumento' : 'Guardar Cambios'}
                            </button>
                        </div>
                    )}

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                             <span className="text-xs font-semibold text-slate-500 uppercase">Vigencia</span>
                             <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{editData.inicio} - {editData.fin}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">Estado</span>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${STATUS_COLORS[editData.estado]}`}>{editData.estado}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">Temporalidad</span>
                                <span className="text-sm font-medium text-slate-700">{editData.temporalidad}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <span className="text-xs text-slate-400 block mb-1">Eje Estratégico</span>
                            <div className="font-medium text-slate-800 text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">{editData.eje}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-500" />
                            Seguimiento y Monitoreo
                        </h4>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">¿Requiere seguimiento?</span>
                                {editData.seguimiento === 'Si' ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> SI
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                        No aplica
                                    </span>
                                )}
                            </div>
                            
                            {editData.observatorio && (
                                <div className="pt-3 border-t border-slate-100">
                                    <span className="text-xs text-slate-400 block mb-1">Mecanismo / Observatorio Asociado</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm font-medium text-slate-700">{editData.observatorio}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {editData.enlace && (
                        <a href={editData.enlace} target="_blank" rel="noreferrer" className="group flex items-center justify-center gap-2 w-full p-4 rounded-xl text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg transform hover:-translate-y-0.5" style={{ backgroundColor: CALI.TURQUESA }}>
                            Acceder al Instrumento / Observatorio
                            <ExternalLink className="h-4 w-4 group-hover:ml-1 transition-all" />
                        </a>
                    )}
                    
                    {editData.pdf_informe && (
                         <a href={editData.pdf_informe} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors hover:border-slate-300">
                            <FileText className="h-4 w-4 text-rose-500" /> Ver Documento PDF
                        </a>
                    )}

                </div>
            </div>
        </>
    );
};