
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, BarChart, Users, Calendar, Map, CheckCircle2, TrendingUp, Info, Newspaper, ArrowRight, Twitter, Target, Zap, Activity } from 'lucide-react';
import { Stats } from '@/types';
import { CALI } from '@/utils/constants';

interface HomeViewProps {
    stats: Stats;
    onAction: (view: 'analitica' | 'ecosistema' | 'mapa') => void;
}

const HERO_SLIDES = [
    {
        tag: "Visión de Ciudad 2050",
        title: "Planificando la Cali de los Próximos 500 Años",
        description: "Un ecosistema integrado de planeación y gestión para transformar a Santiago de Cali en un territorio inteligente, intercultural y sostenible.",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        cta: "Analítica"
    },
    {
        tag: "Territorio Sostenible",
        title: "Compromiso con la Biodiversidad y el Futuro",
        description: "Aseguramos que el crecimiento de nuestra ciudad respete el entorno natural y mejore la calidad de vida de todos los caleños.",
        image: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        cta: "Mapa de Proyectos"
    },
    {
        tag: "Participación Ciudadana",
        title: "La Ciudad que Soñamos la Construimos Juntos",
        description: "Cali 500+ es un proceso abierto. Integramos las voces de la comunidad en el corazón de la planificación técnica.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        cta: "Ecosistema"
    },
    {
        tag: "Desarrollo Económico",
        title: "Potenciando la Competitividad Sostenible",
        description: "Creamos las condiciones para un progreso económico que beneficie a todos los sectores de la sociedad caleña.",
        image: "https://images.unsplash.com/photo-1579546671170-4342823ed761?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        cta: "Analítica"
    }
];

const NEWS = [
    {
        source: "El País Cali",
        title: "Cali 500+: El ambicioso plan para transformar la capital del Valle",
        date: "15 Mar 2024",
        type: "Prensa",
        icon: Newspaper
    },
    {
        source: "Alcaldía de Cali",
        title: "Se firma convenio internacional para el Ecosistema Digital Cali 500",
        date: "10 Mar 2024",
        type: "Oficial",
        icon: CheckCircle2
    },
    {
        source: "Twitter / X",
        title: "#Cali500: Ciudadanos participan en el primer foro de visión urbana",
        date: "05 Mar 2024",
        type: "Redes",
        icon: Twitter
    }
];

export const HomeView: React.FC<HomeViewProps> = ({ stats, onAction }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsIndex, setNewsIndex] = useState(0);
    const slideContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    const handleCtaClick = (cta: string) => {
        const ctaLower = cta.toLowerCase();
        if (ctaLower.includes('analitica') || ctaLower.includes('dashboard') || ctaLower.includes('analítica')) onAction('analitica');
        else if (ctaLower.includes('mapa')) onAction('mapa');
        else if (ctaLower.includes('ecosistema')) onAction('ecosistema');
    };

    return (
        <div className="bg-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
            {/* HERO SECTION - REDUCED HEIGHT */}
            <section className="relative h-[400px] md:h-[450px] bg-[#0F172A] overflow-hidden group/hero">
                <div 
                    ref={slideContainerRef}
                    className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {HERO_SLIDES.map((slide, index) => (
                        <div key={index} className="w-full h-full shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-105" 
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            ></div>
                            
                            <div className="container mx-auto px-6 relative z-20 h-full flex items-center max-w-6xl">
                                <div className={`max-w-2xl transition-all duration-700 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-0.5 w-8 bg-indigo-500 rounded-full"></div>
                                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
                                            {slide.tag}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                                        {slide.title.split(' ').map((word, i) => 
                                            word.toLowerCase() === '500' || word.toLowerCase() === 'años' ? 
                                            <span key={i} className="text-indigo-400">{word} </span> : word + ' '
                                        )}
                                    </h1>
                                    <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed font-medium max-w-lg opacity-90">
                                        {slide.description}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button 
                                            onClick={() => handleCtaClick(slide.cta)}
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                                        >
                                            {slide.cta} 
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => onAction('analitica')}
                                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-[11px] uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
                                        >
                                            Hoja de Ruta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                    {HERO_SLIDES.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </section>

            {/* KPI SECTION - BALANCED PROPORTIONS */}
            <section className="py-16 bg-slate-50 relative border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-indigo-700 text-[9px] font-bold uppercase tracking-widest shadow-sm border border-slate-100">
                                <Activity className="h-3 w-3" /> Estado de Avance
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                Indicadores de <span className="text-indigo-600">Gestión Distrital</span>
                            </h2>
                        </div>
                        <button 
                            onClick={() => onAction('analitica')} 
                            className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-md active:scale-95"
                        >
                            Ver Analytics completo
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* KPI 1 */}
                        <div className="group relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div className="text-right">
                                    <span className="block text-emerald-600 text-[10px] font-black uppercase tracking-widest">+2.5%</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase">Seguimiento</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter block leading-none">
                                    {stats.cobertura}<span className="text-lg font-bold text-slate-300 ml-0.5">%</span>
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Cobertura de Gestión</span>
                            </div>
                            <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.cobertura}%` }}></div>
                            </div>
                        </div>

                        {/* KPI 2 */}
                        <div className="group relative p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="px-2.5 py-0.5 bg-white/15 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Activas</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-4xl font-black text-white tracking-tighter block leading-none">
                                    120
                                </span>
                                <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-[0.2em] block">Entidades Vinculadas</span>
                            </div>
                            <p className="mt-6 text-[11px] text-indigo-100 font-medium leading-relaxed opacity-80">
                                Organismos distritales articulados activamente en la Visión 2050.
                            </p>
                        </div>

                        {/* KPI 3 */}
                        <div className="group relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full uppercase tracking-widest">Fase II</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter block leading-none">
                                    05
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Hitos Críticos</span>
                            </div>
                            <div className="mt-6 flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className="flex-1 h-1.5 bg-amber-500 rounded-full"></div>)}
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK ACCESS - BALANCED SIZE */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Recursos Digitales</span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Acceso a la Información</h2>
                        <div className="w-12 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dash */}
                        <div className="p-8 flex flex-col items-center text-center bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <BarChart className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wider">Analítica</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8 min-h-[40px] max-w-[180px]">Control estadístico detallado de la planeación distrital.</p>
                            <button 
                                onClick={() => onAction('analitica')} 
                                className="w-full py-3 bg-indigo-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                            >
                                Ingresar al Dashboard
                            </button>
                        </div>

                        {/* Eco */}
                        <div className="p-8 flex flex-col items-center text-center bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wider">Ecosistema</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8 min-h-[40px] max-w-[180px]">Relacionamiento institucional y red de actores clave.</p>
                            <button 
                                onClick={() => onAction('ecosistema')} 
                                className="w-full py-3 bg-cyan-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-md active:scale-95"
                            >
                                Explorar la Red
                            </button>
                        </div>

                        {/* Map */}
                        <div className="p-8 flex flex-col items-center text-center bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Map className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wider">Territorio</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-8 min-h-[40px] max-w-[180px]">Georreferenciación de proyectos y planes de la Visión 2050.</p>
                            <button 
                                onClick={() => onAction('mapa')} 
                                className="w-full py-3 bg-emerald-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                            >
                                Ver Mapa Circular
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO WE ARE - BALANCED PROPORTIONS */}
            <section className="py-20 bg-[#0F172A] text-white relative">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Nuestra Misión</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6 tracking-tighter">Planificando <br/><span className="text-slate-500 font-light italic">la Cali del Mañana</span></h2>
                            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md font-medium opacity-90">
                                Cali 500+ es el marco estratégico diseñado para asegurar que Santiago de Cali alcance su quinto centenario como referente de sostenibilidad y equidad social.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-5 group">
                                    <div className="w-10 h-10 shrink-0 rounded-2xl border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-base group-hover:bg-cyan-500 group-hover:text-white transition-all">01</div>
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase tracking-[0.3em] mb-1 text-white">Coordinación</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Articulamos la planeación técnica con las necesidades reales del territorio.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group">
                                    <div className="w-10 h-10 shrink-0 rounded-2xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-base group-hover:bg-indigo-500 group-hover:text-white transition-all">02</div>
                                    <div>
                                        <h4 className="font-black text-[9px] uppercase tracking-[0.3em] mb-1 text-white">Trascendencia</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Garantizamos que los planes superen los periodos de gobierno.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
                            <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
                                <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90" alt="Cali" className="opacity-90 transition-opacity hover:opacity-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWS - COMPACT CARDS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">Sala de Prensa</h2>
                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">Actualidad del Proyecto</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setNewsIndex((prev) => (prev - 1 + NEWS.length) % NEWS.length)}
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-900 text-slate-900 transition-all shadow-sm"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => setNewsIndex((prev) => (prev + 1) % NEWS.length)}
                                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-900 text-slate-900 transition-all shadow-sm"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {NEWS.map((item, i) => {
                            const isVisible = i === newsIndex || (i === (newsIndex + 1) % NEWS.length) || (i === (newsIndex + 2) % NEWS.length);
                            return (
                                <div 
                                    key={i}
                                    className={`p-6 border border-slate-100 hover:border-indigo-600 transition-all duration-500 group ${!isVisible ? 'hidden md:flex' : 'flex'} flex-col bg-slate-50/20 rounded-2xl`}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <item.icon className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">{item.type}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-base mb-8 leading-snug min-h-[60px] tracking-tight group-hover:text-indigo-600 transition-colors">
                                        "{item.title}"
                                    </h4>
                                    <div className="mt-auto flex items-center justify-between text-[9px] font-extrabold uppercase text-slate-400 tracking-widest border-t border-slate-100 pt-5">
                                        <span>{item.source}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CONTACT - BALANCED FORM */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Canal Oficial</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-12 tracking-tighter">Hablemos del Futuro</h2>
                    
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre</label>
                            <input type="text" className="w-full p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xs font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                            <input type="email" className="w-full p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xs font-bold" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Consulta</label>
                            <textarea className="w-full p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xs font-bold h-32 resize-none"></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="md:col-span-2 mt-2 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-[0.3em] transition-all rounded-full shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            Enviar Comunicación Técnica
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};
