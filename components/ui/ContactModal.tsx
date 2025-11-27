
import React from 'react';
import { X, MessageCircle, Mail, FileText } from 'lucide-react';
import { CALI } from '@/utils/constants';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const whatsappNumber = "573173990220";
    const email = "paulajanetam@gmail.com";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20estoy%20interesado%20en%20la%20información%20completa%20del%20dashboard%20Visión%20Cali%20500+.`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in" 
                onClick={onClose}
            ></div>
            
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="h-32 relative flex items-center justify-center" style={{ backgroundColor: CALI.MORADO }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-[#1E1B4B] opacity-50"></div>
                    {/* Decorative elements */}
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute left-6 bottom-6 h-16 w-16 rounded-full bg-indigo-500/20 blur-lg"></div>

                    <div className="relative z-10 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 text-center mb-3">Acceso a Información Completa</h2>
                    <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                        Si deseas descargar la base de datos detallada, por favor contacta al equipo administrador:
                    </p>

                    <div className="space-y-3">
                        <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all group cursor-pointer"
                        >
                            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">WhatsApp</span>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">+57 317 399 0220</span>
                            </div>
                        </a>

                        <a 
                            href={`mailto:${email}`}
                            className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-all group cursor-pointer"
                        >
                            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-full group-hover:scale-110 transition-transform shadow-sm">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Correo Electrónico</span>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700 break-all">{email}</span>
                            </div>
                        </a>
                    </div>

                    <button 
                        onClick={onClose}
                        className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};
