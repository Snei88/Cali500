
import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Search, Info, ShieldCheck, User, Mail, Smartphone, ChevronLeft, HelpCircle } from 'lucide-react';
import { CALI } from '@/utils/constants';

export const PQRSView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isSending, setIsSending] = useState(false);
    const [radicado, setRadicado] = useState('');

    const [formData, setFormData] = useState({
        tipo: 'Petición',
        nombre: '',
        email: '',
        tel: '',
        mensaje: '',
        anonimo: false
    });

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        
        // Simulación de envío y generación de radicado
        setTimeout(() => {
            const randomRad = 'PQRS-' + Math.floor(Math.random() * 900000 + 100000);
            setRadicado(randomRad);
            setIsSending(false);
            setStep('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-['Plus_Jakarta_Sans'] animate-in fade-in duration-500">
            {/* Header de la sección */}
            <div className="bg-slate-900 py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent"></div>
                <div className="container mx-auto max-w-4xl relative z-10">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-indigo-300 hover:text-white font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" /> Volver al Inicio
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        Sistema de <span className="text-indigo-400">PQRS</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        Peticiones, Quejas, Reclamos y Sugerencias. Tu participación es fundamental para la construcción de la Cali del futuro.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-6 -mt-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Panel Izquierdo: Información y Consulta */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4 text-indigo-600" /> Consultar Estado
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">¿Ya tienes un número de radicado? Ingrésalo para conocer el avance de tu solicitud.</p>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Ej: PQRS-123456" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
                                />
                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95">
                                    Consultar Trámite
                                </button>
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                            <HelpCircle className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10" />
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4">¿Qué es cada uno?</h3>
                            <ul className="space-y-4 text-xs font-medium">
                                <li className="flex gap-3">
                                    <span className="font-black text-indigo-200">P:</span>
                                    <p><strong className="text-white">Petición:</strong> Solicitud de información o servicios.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-black text-indigo-200">Q:</span>
                                    <p><strong className="text-white">Queja:</strong> Manifestación de inconformidad por una atención.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-black text-indigo-200">R:</span>
                                    <p><strong className="text-white">Reclamo:</strong> Exigencia por un servicio deficiente o no prestado.</p>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-black text-indigo-200">S:</span>
                                    <p><strong className="text-white">Sugerencia:</strong> Propuesta para mejorar la gestión pública.</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Panel Derecho: Formulario */}
                    <div className="lg:col-span-2">
                        {step === 'form' ? (
                            <form onSubmit={handleSend} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Solicitud</label>
                                        <select 
                                            value={formData.tipo}
                                            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                        >
                                            <option>Petición</option>
                                            <option>Queja</option>
                                            <option>Reclamo</option>
                                            <option>Sugerencia</option>
                                            <option>Denuncia (Corrupción)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identidad</label>
                                        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, anonimo: false})}
                                                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all ${!formData.anonimo ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Identificado
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, anonimo: true})}
                                                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all ${formData.anonimo ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Anónimo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {!formData.anonimo && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <input 
                                                required
                                                type="text" 
                                                placeholder="Nombre Completo" 
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="Correo Electrónico" 
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input 
                                            type="tel" 
                                            placeholder="Teléfono de Contacto (Opcional)" 
                                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                            value={formData.tel}
                                            onChange={(e) => setFormData({...formData, tel: e.target.value})}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <textarea 
                                            required
                                            placeholder="Describe tu solicitud detalladamente..." 
                                            rows={6}
                                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none"
                                            value={formData.mensaje}
                                            onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
                                        <p className="text-[10px] text-slate-500 leading-relaxed">
                                            Tus datos serán tratados bajo la Ley 1581 de 2012. La información aquí consignada será remitida directamente a la oficina de Planeación Distrital para su debida gestión.
                                        </p>
                                    </div>

                                    <button 
                                        disabled={isSending}
                                        type="submit"
                                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSending ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Procesando Solicitud...
                                            </>
                                        ) : (
                                            <>
                                                Radicar Solicitud <Send className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">¡Solicitud Radicada!</h2>
                                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">Tu {formData.tipo.toLowerCase()} ha sido ingresada correctamente en nuestro sistema macro de planeación.</p>
                                
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 inline-block px-12">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Número de Radicado</span>
                                    <span className="text-2xl font-black text-indigo-600 tracking-widest">{radicado}</span>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-slate-400">Recibirás una respuesta en tu correo electrónico en un plazo máximo de 15 días hábiles.</p>
                                    <button 
                                        onClick={() => setStep('form')}
                                        className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                                    >
                                        Radicar otra solicitud
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
