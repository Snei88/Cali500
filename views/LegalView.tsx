
import React from 'react';
import { Shield, FileText, Database, ChevronLeft, Lock, Scale, Share2 } from 'lucide-react';
import { CALI } from '@/utils/constants';

interface LegalViewProps {
    type: 'privacy' | 'terms' | 'opendata';
    onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, onBack }) => {
    const content = {
        privacy: {
            icon: Shield,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            title: "Política de Privacidad",
            subtitle: "Tratamiento de Datos Personales",
            text: `
                En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, la Alcaldía de Santiago de Cali, a través del Sistema Macro de Planeación Cali 500+, informa que los datos recolectados en este portal serán tratados con absoluta confidencialidad.
                
                **Finalidad del Tratamiento:**
                Los datos se utilizarán para la gestión de solicitudes de información, envío de actualizaciones sobre planes de desarrollo y análisis estadístico interno para la mejora de las políticas públicas territoriales.
                
                **Derechos del Titular:**
                Usted tiene derecho a conocer, actualizar, rectificar y suprimir sus datos personales en cualquier momento a través de nuestros canales oficiales de contacto.
            `
        },
        terms: {
            icon: Scale,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            title: "Términos de Servicio",
            subtitle: "Condiciones de Uso del Dashboard",
            text: `
                El acceso y uso de este Dashboard Estratégico implica la aceptación de los siguientes términos:
                
                **Uso del Contenido:**
                Toda la información presentada es de carácter público y oficial. Se autoriza su uso para fines académicos, periodísticos y ciudadanos, siempre que se cite la fuente: "Sistema Cali 500+ - Planeación Distrital de Cali".
                
                **Restricciones:**
                Queda prohibida la alteración de los datos o el uso del portal para fines fraudulentos que atenten contra la integridad institucional del Distrito.
            `
        },
        opendata: {
            icon: Database,
            color: "text-amber-600",
            bg: "bg-amber-50",
            title: "Datos Abiertos",
            subtitle: "Transparencia y Acceso a la Información",
            text: `
                Cali 500+ se adhiere a la política nacional de Datos Abiertos de Colombia. Buscamos que la ciudadanía sea partícipe activa de la planeación territorial mediante el libre acceso a los datasets.
                
                **Disponibilidad:**
                Actualmente puede exportar los datos en formato .xlsx desde el módulo de "Base de Datos". Próximamente se habilitará un endpoint API para la integración directa con otros sistemas de información geográfica (SIG) y observatorios académicos.
            `
        }
    };

    const current = content[type];

    return (
        <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] animate-in fade-in duration-500">
            <div className="container mx-auto px-6 max-w-3xl py-20">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-12 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Volver al Inicio
                </button>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 ${current.bg} ${current.color} rounded-2xl shadow-sm`}>
                            <current.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">Legal & Transparencia</span>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{current.title}</h1>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full"></div>

                    <div className="prose prose-slate max-w-none">
                        <h4 className="text-lg font-bold text-slate-800 mb-4">{current.subtitle}</h4>
                        {current.text.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-slate-600 leading-relaxed mb-4 text-sm whitespace-pre-line">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 border-dashed text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Última actualización: Agosto 2025. Para más información, contacte a: 
                            <br/><span className="text-indigo-600 font-bold">gerenciacali500@gmail.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
