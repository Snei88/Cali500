
import React, { useState, useEffect, useRef } from 'react';
import { 
    ChevronRight, ChevronLeft, ArrowRight, 
    Users, Activity, Mail, MessageCircle, BarChart3, ExternalLink,
    Library, Map as MapIcon, Zap, Send, User, AtSign, Smartphone, Check,
    Search, Database
} from 'lucide-react';
import { Stats } from '@/types';

interface HomeViewProps {
    stats: Stats;
    onAction: (view: 'analitica' | 'ecosistema' | 'mapa' | 'datos') => void;
}

const HERO_SLIDES = [
    {
        tag: "VISIÓN DE CIUDAD 2050",
        title: "Cali, referente internacional en sostenibilidad",
        description: "Construimos una visión de largo plazo que cuida la biodiversidad y la interculturalidad como pilares del desarrollo territorial.",
        image: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Conocer la visión",
        cta2: "Hoja de ruta 2050",
        target1: 'ecosistema',
        target2: 'analitica'
    },
    {
        tag: "TERRITORIO ADAPTATIVO",
        title: "Cuidar la biodiversidad es planificar el futuro",
        description: "Gestionamos el territorio reconociendo sus ecosistemas y saberes comunitarios para una Cali resiliente.",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Mapa de instrumentos",
        cta2: "Ver análisis territorial",
        target1: 'mapa',
        target2: 'analitica'
    },
    {
        tag: "BIENESTAR E INTERCULTURALIDAD",
        title: "La ciudad que soñamos la construimos juntos",
        description: "Una visión construida desde la participación ciudadana, donde el bienestar y la equidad están en el centro.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Ver instrumentos",
        cta2: "Participación ciudadana",
        target1: 'ecosistema',
        target2: 'ecosistema'
    },
    {
        tag: "DATOS PARA DECIDIR",
        title: "Datos para decidir, visión para transformar",
        description: "Integramos información estratégica para orientar políticas públicas alineadas con la visión Cali 500+.",
        image: "https://images.unsplash.com/photo-1579546671170-4342823ed761?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Ir al dashboard",
        cta2: "Explorar datos",
        target1: 'analitica',
        target2: 'datos'
    }
];

export const HomeView: React.FC<HomeViewProps> = ({ stats, onAction }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [formSent, setFormSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const slideContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setFormSent(true);
            setTimeout(() => setFormSent(false), 5000);
        }, 1500);
    };

    return (
        <div className="bg-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
            
            {/* 1. CARRUSEL HERO */}
            <section className="relative h-[400px] md:h-[500px] bg-[#0F172A] overflow-hidden group">
                <div 
                    ref={slideContainerRef}
                    className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {HERO_SLIDES.map((slide, index) => (
                        <div key={index} className="w-full h-full shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/50 to-transparent"></div>
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear scale-110" 
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            ></div>
                            
                            <div className="container mx-auto px-6 relative z-20 h-full flex items-center max-w-6xl">
                                <div className={`max-w-2xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
                                        <span className="text-white text-xs font-black uppercase tracking-[0.4em] opacity-80">{slide.tag}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter uppercase">
                                        {slide.title}
                                    </h1>
                                    <p className="text-slate-300 text-sm md:text-lg mb-8 leading-relaxed font-medium max-w-lg">
                                        {slide.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button 
                                            onClick={() => onAction(slide.target1 as any)}
                                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95"
                                        >
                                            {slide.cta1} <ArrowRight className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => onAction(slide.target2 as any)}
                                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
                                        >
                                            {slide.cta2}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"><ChevronLeft /></button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"><ChevronRight /></button>
            </section>

            {/* 2. SISTEMA MACRO DE PLANEACIÓN EFICIENTE */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Estrategia Territorial</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-6 uppercase">Sistema Macro de Planeación Eficiente</h2>
                        <div className="h-1.5 w-16 bg-indigo-600 mx-auto rounded-full mb-8"></div>
                        <p className="text-base text-slate-500 leading-relaxed font-medium">
                            En esta herramienta encontrarás el seguimiento y análisis de todos los documentos de planeación de Cali de mediano y de largo plazo, y su incidencia en la toma de decisiones en el presente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Analítica */}
                        <div onClick={() => onAction('analitica')} className="group p-10 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-indigo-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-600/20">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                <BarChart3 className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-4 transition-colors uppercase tracking-tight">Analítica</h3>
                            <p className="text-sm text-slate-500 group-hover:text-indigo-100 leading-relaxed transition-colors">
                                Análisis de los instrumentos de planeación de mediano y de largo plazo.
                            </p>
                        </div>

                        {/* Seguimiento y Biblioteca */}
                        <div onClick={() => onAction('ecosistema')} className="group p-10 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-emerald-600 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-600/20">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                <Library className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-4 transition-colors uppercase tracking-tight">Seguimiento y Biblioteca</h3>
                            <p className="text-sm text-slate-500 group-hover:text-emerald-50 leading-relaxed transition-colors">
                                Seguimiento al cumplimiento de los instrumentos de planeación y acceso al documento oficial y observatorios.
                            </p>
                        </div>

                        {/* Mapa Circular */}
                        <div onClick={() => onAction('mapa')} className="group p-10 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-amber-500 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-amber-500/20">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                <MapIcon className="h-8 w-8 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-4 transition-colors uppercase tracking-tight">Mapa Circular</h3>
                            <p className="text-sm text-slate-500 group-hover:text-amber-50 leading-relaxed transition-colors">
                                Distribución temporal de los instrumentos en el territorio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ESTADO DE AVANCE (KPIs DINÁMICOS) */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 text-center md:text-left">
                        <div>
                            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Cifras Reales</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Estado de Avance</h2>
                        </div>
                        <button onClick={() => onAction('analitica')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                            Ver Dashboard de Datos <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all group">
                            <Activity className="h-10 w-10 mx-auto text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
                            <span className="block text-6xl font-black text-slate-900 tracking-tighter mb-2">{stats.cobertura}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cobertura de Seguimiento</span>
                        </div>
                        <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-center text-white hover:shadow-2xl transition-all shadow-xl shadow-indigo-600/20">
                            <Zap className="h-10 w-10 mx-auto text-white/80 mb-6" />
                            <span className="block text-6xl font-black tracking-tighter mb-2">{stats.estadosMap['En Ejecución']}</span>
                            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em]">Instrumentos en Ejecución Activa</span>
                        </div>
                        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all group">
                            <Library className="h-10 w-10 mx-auto text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                            <span className="block text-6xl font-black text-slate-900 tracking-tighter mb-2">{stats.total}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Biblioteca Estratégica</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. QUIÉNES SOMOS */}
            <section id="quienes-somos" className="py-24 bg-[#0F172A] text-white relative scroll-mt-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div>
                                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Nuestra Misión y Visión</span>
                                <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6 tracking-tighter uppercase">
                                    Planeando <br/><span className="text-slate-500 font-light italic lowercase">el futuro de Cali</span>
                                </h2>
                                <p className="text-slate-400 text-base leading-relaxed max-w-md font-medium">
                                    Cali 500+ es el marco estratégico que orienta el desarrollo integral de Santiago de Cali hacia su quinto centenario.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">01</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white">Planeación con visión de futuro</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Orientamos las decisiones del territorio mediante una visión compartida, que trasciende los periodos de gobierno.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xl">02</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white">Gobernanza y corresponsabilidad</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Construimos esta visión con la participación activa de ciudadanía, academia y sector privado.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">03</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white">Datos para planificar mejor</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Integramos información e indicadores territoriales para hacer seguimiento a la visión.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute -inset-4 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full"></div>
                            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                                <img 
                                    src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90" 
                                    alt="Cali Ciudad" 
                                    className="w-full aspect-[4/5] object-cover opacity-90 transition-transform duration-[10s] group-hover:scale-110" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FORMULARIO DE CONTACTO */}
            <section id="contacto" className="py-24 bg-slate-50 relative scroll-mt-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">¿Tienes dudas?</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Contáctanos</h2>
                        <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex gap-4 cursor-pointer group" onClick={() => window.open("https://wa.me/573178055480", "_blank")}>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">WhatsApp Oficial</h4>
                                    <p className="text-sm text-slate-500">+57 317 805 5480</p>
                                    <span className="text-indigo-600 text-xs font-bold hover:underline mt-1 inline-block">Hablar ahora</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">Correo Electrónico</h4>
                                    <p className="text-sm text-slate-500">gerenciacali500@gmail.com</p>
                                    <p className="text-sm text-slate-500">info@cali500.gov.co</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <h4 className="font-black text-[10px] uppercase tracking-widest text-indigo-600 mb-3">Atención Directa</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    Si eres un organismo internacional o academia buscando datasets específicos, solicita una llave de acceso API.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <form className="space-y-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden" onSubmit={handleFormSubmit}>
                                {formSent ? (
                                    <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                            <Check className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">¡Mensaje Enviado!</h3>
                                        <p className="text-slate-500 text-center text-sm mb-6">Gracias por contactarnos. Nuestro equipo te responderá a la brevedad posible.</p>
                                        <button type="button" onClick={() => setFormSent(false)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Enviar otro mensaje</button>
                                    </div>
                                ) : null}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Nombre Completo" 
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="Correo Electrónico" 
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="tel" 
                                        placeholder="Teléfono / WhatsApp" 
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        required
                                        placeholder="¿En qué podemos ayudarte?" 
                                        rows={4}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={isSending}
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending ? "Enviando..." : "Enviar Mensaje"} <Send className="h-4 w-4" />
                                </button>
                                <p className="text-[9px] text-slate-400 text-center font-medium">Al enviar este formulario aceptas nuestra política de tratamiento de datos personales.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
