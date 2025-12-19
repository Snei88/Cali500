
import React from 'react';
import { Mail, Phone, MapPin, Globe, AtSign, Database } from 'lucide-react';
import { VISION_IMAGE_URL } from '@/utils/constants';

export const Footer = () => {
    return (
        <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <img src={VISION_IMAGE_URL} alt="Cali 500+" className="h-10 brightness-0 invert" />
                        <span className="text-2xl font-bold text-white tracking-tight">Cali 500+</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                        Uniendo esfuerzos para planificar y construir el futuro de nuestra ciudad hacia sus 500 años.
                    </p>
                    <div className="flex gap-4">
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Globe className="h-5 w-5" /></button>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><AtSign className="h-5 w-5" /></button>
                    </div>
                </div>

                {/* Platform Column */}
                <div>
                    <h4 className="text-white font-bold mb-6">Plataforma</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Inicio</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Dashboard de Indicadores</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Mapa de Proyectos</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Recursos Descargables</a></li>
                    </ul>
                </div>

                {/* Institutional Column */}
                <div>
                    <h4 className="text-white font-bold mb-6">Institucional</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Quiénes somos</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Aliados Estratégicos</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Transparencia</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition-colors">Prensa</a></li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div>
                    <h4 className="text-white font-bold mb-6">Contacto</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-500" /> info@cali500.gov.co</li>
                        <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-500" /> +57 (602) 555-5555</li>
                        <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-slate-500" /> CAM Torre Alcaldía, Cali</li>
                    </ul>
                    <div className="mt-8">
                        <button className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded text-xs font-bold hover:bg-slate-800 transition-all">
                            <Database className="h-3 w-3" /> Datos Abiertos / API
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                <p>© 2024 Cali 500+. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
                    <a href="#" className="hover:text-white transition-colors">Mapa del Sitio</a>
                </div>
            </div>
        </footer>
    );
};
