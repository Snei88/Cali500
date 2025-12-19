
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
        tag: "VISIÓN DE CIUDAD 2050",
        title: "Cali, referente internacional en sostenibilidad",
        description: "Construimos una visión de largo plazo que cuida la biodiversidad y la interculturalidad como pilares del desarrollo territorial, social y económico.",
        image: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Conocer la visión",
        cta2: "Hoja de ruta 2050",
        target1: 'ecosistema',
        target2: 'analitica'
    },
    {
        tag: "TERRITORIO INTELIGENTE Y ADAPTATIVO",
        title: "Cuidar la biodiversidad es planificar el futuro",
        description: "Gestionamos el territorio reconociendo sus ecosistemas, saberes comunitarios y dinámicas urbanas y rurales para una Cali resiliente al cambio climático.",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Mapa de proyectos",
        cta2: "Ver análisis territorial",
        target1: 'mapa',
        target2: 'analitica'
    },
    {
        tag: "BIENESTAR E INTERCULTURALIDAD",
        title: "La ciudad que soñamos la construimos juntos",
        description: "Una visión construida desde la participación ciudadana, donde el bienestar, la equidad y la diversidad cultural están en el centro de las decisiones.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Conocer el ecosistema",
        cta2: "Participación ciudadana",
        target1: 'ecosistema',
        target2: 'ecosistema'
    },
    {
        tag: "COMPETITIVIDAD SOSTENIBLE",
        title: "Datos para decidir, visión para transformar",
        description: "Integramos información, indicadores y análisis para orientar políticas públicas, inversiones y acciones alineadas con la visión Cali 500+.",
        image: "https://images.unsplash.com/photo-1579546671170-4342823ed761?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Ir al dashboard",
        cta2: "Explorar datos",
        target1: 'analitica',
        target2: 'analitica'
    }
];

export const HomeView: React.FC<HomeViewProps> = ({ stats, onAction }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    return (
        <div className="bg-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
            {/* HERO SECTION - REDUCED HEIGHT */}
            <section className="relative h-[400px] md:h-[500px] bg-[#0F172A] overflow-hidden group">
                <div 
                    ref={slideContainerRef}
                    className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {HERO_SLIDES.map((slide, index) => (
                        <div key={index} className="w-full h-full shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear scale-110" 
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            ></div>
                            
                            <div className="container mx-auto px-6 relative z-20 h-full flex items-center max-w-6xl">
                                <div className={`max-w-2xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-0.5 w-8 bg-indigo-500 rounded-full"></div>
                                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] opacity-80">
                                            {slide.tag}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tighter">
                                        {slide.title}
                                    </h1>
                                    <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed font-medium max-w-lg opacity-90">
                                        {slide.description}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button 
                                            onClick={() => onAction(slide.target1 as any)}
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95"
                                        >
                                            {slide.cta1} 
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => onAction(slide.target2 as any)}
                                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-[10px] uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
                                        >
                                            {slide.cta2}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Minimalist Round Nav Buttons */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {HERO_SLIDES.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </section>

            {/* QUIENES SOMOS SECTION */}
            <section id="quienes-somos" className="py-20 bg-[#0F172A] text-white relative scroll-mt-20">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Nuestra Visión y Misión</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6 tracking-tighter">Planificando <br/><span className="text-slate-500 font-light italic">la Cali del Mañana</span></h2>
                            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-md font-medium">
                                Cali 500+ es el marco estratégico diseñado para asegurar que Santiago de Cali alcance su quinto centenario como referente de sostenibilidad, equidad social y desarrollo intercultural.
                            </p>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex gap-5 group">
                                    <div className="w-12 h-12 shrink-0 rounded-xl border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-lg group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg">01</div>
                                    <div>
                                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-1 text-white">Coordinación</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">Articulamos la planeación técnica con las necesidades reales del territorio.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group">
                                    <div className="w-12 h-12 shrink-0 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">02</div>
                                    <div>
                                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-1 text-white">Sostenibilidad</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">Garantizamos que los planes superen los periodos de gobierno con enfoque ambiental.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
                            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-transform hover:scale-[1.02] duration-700">
                                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90" alt="Cali" className="opacity-90 transition-opacity hover:opacity-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* KPI STATS SECTION */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div>
                            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Cifras de Gestión</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Estado de <span className="text-indigo-600">Avance</span></h2>
                        </div>
                        <button onClick={() => onAction('analitica')} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                            Explorar Analítica Completa
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <Activity className="h-8 w-8 mx-auto text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="block text-5xl font-black text-slate-900 tracking-tighter mb-1">{stats.cobertura}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cobertura de Seguimiento</span>
                        </div>
                        <div className="p-8 bg-indigo-600 rounded-3xl text-center text-white hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/10">
                            <Users className="h-8 w-8 mx-auto text-white/80 mb-4" />
                            <span className="block text-5xl font-black tracking-tighter mb-1">120</span>
                            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Entidades Vinculadas</span>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <Target className="h-8 w-8 mx-auto text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="block text-5xl font-black text-slate-900 tracking-tighter mb-1">{stats.total}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instrumentos Activos</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
