
import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, type, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in" 
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={`h-24 relative flex items-center justify-center ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    <div className="absolute inset-0 bg-white/10 opacity-50 pattern-dots"></div>
                    <div className="relative z-10 p-3 bg-white/20 rounded-full backdrop-blur-md border border-white/30 shadow-lg animate-in zoom-in duration-300">
                        {type === 'success' ? (
                            <CheckCircle className="h-8 w-8 text-white" />
                        ) : (
                            <AlertCircle className="h-8 w-8 text-white" />
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    <h2 className={`text-xl font-bold mb-3 ${type === 'success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {message}
                    </p>

                    <button 
                        onClick={onClose}
                        className={`mt-6 w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-transform active:scale-95 ${
                            type === 'success' 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                        }`}
                    >
                        {type === 'success' ? 'Aceptar' : 'Entendido'}
                    </button>
                </div>
            </div>
        </div>
    );
};
