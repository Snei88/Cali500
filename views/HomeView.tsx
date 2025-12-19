
import React, { useState, useEffect, useRef } from 'react';
import { 
    ChevronRight, ChevronLeft, CheckCircle2, Newspaper, ArrowRight, 
    Twitter, Target, Users, Activity, Mail, MessageCircle, FileText, Globe, Info, 
    Send, User, AtSign, Smartphone, Check, Zap, Eye, BarChart3, ExternalLink
} from 'lucide-react';
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
        cta1: "Mapa de proyectos",
        cta2: "Ver análisis territorial",
        target1: 'mapa',
        target2: 'analitica'
    },
    {
        tag: "BIENESTAR E INTERCULTURALIDAD",
        title: "La ciudad que soñamos la construimos juntos",
        description: "Una visión construida desde la participación ciudadana, donde el bienestar y la equidad están en el centro.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cta1: "Conocer el ecosistema",
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
        target2: 'analitica'
    }
];

const NEWS = [
    {
        source: "Semana",
        title: "Más de 50 sectores productivos se sumaron a la iniciativa Cali500+",
        date: "17 Sep 2024",
        summary: "La iniciativa Cali500+ logró adhesión de gremios empresariales, sectores productivos y academia, destacando la cooperación intersectorial.",
        link: "https://www.semana.com",
        logo: "assets/semana.png"
    },
    {
        source: "Cali Stereo Online",
        title: "Cali avanza hacia la sostenibilidad con la implementación del Plan Cali 500+",
        date: "22 Abr 2025",
        summary: "El urbanista internacional Young-Hoon Kwaak visitó la ciudad para apoyar la visión sostenible del Plan Cali 500+.",
        link: "https://calistereofm.com",
        logo: "assets/cali_stereo_online.png"
    },
    {
        source: "El País",
        title: "Alcaldía presentó los avances del plan Cali 500+",
        date: "24 Jul 2025",
        summary: "La Administración Distrital rindió cuentas de los avances del plan Cali 500+, con participación de gremios, universidades y sociedad civil.",
        link: "https://www.elpais.com.co",
        logo: "assets/el_pais.png"
    },
    {
        source: "El País",
        title: "Cali 500+: una visión compartida para proyectar la ciudad hacia sus 500 años",
        date: "31 Jul 2025",
        summary: "Presentación pública de la visión Cali 500+, destacando la participación de diversos sectores para construir un futuro equitativo.",
        link: "https://www.elpais.com.co",
        logo: "assets/el_pais.png"
    },
    {
        source: "Diario del Cauca",
        title: "Visión Cali 500+ fue presentada a los periodistas de la ciudad",
        date: "01 Ago 2025",
        summary: "El plan fue socializado con medios de comunicación, resaltando el diálogo y el trabajo conjunto para impulsar la hoja de ruta.",
        link: "https://diariodelcauca.com.co",
        logo: "assets/diario.png"
    }
];

export const HomeView: React.FC<HomeViewProps> = ({ stats, onAction }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsIndex, setNewsIndex] = useState(0);
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

    const nextNews = () => setNewsIndex((prev) => (prev + 1) % NEWS.length);
    const prevNews = () => setNewsIndex((prev) => (prev - 1 + NEWS.length) % NEWS.length);

    return (
        <div className="bg-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
            
            {/* 1. CARRUSEL */}
            <section className="relative h-[300px] md:h-[400px] bg-[#0F172A] overflow-hidden group">
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
                                <div className={`max-w-xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-0.5 w-6 bg-indigo-500 rounded-full"></div>
                                        <span className="text-white text-[9px] font-black uppercase tracking-[0.4em] opacity-80">
                                            {slide.tag}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight tracking-tighter uppercase">
                                        {slide.title}
                                    </h1>
                                    <p className="text-slate-300 text-xs md:text-sm mb-6 leading-relaxed font-medium max-w-md opacity-90">
                                        {slide.description}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button 
                                            onClick={() => onAction(slide.target1 as any)}
                                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95"
                                        >
                                            {slide.cta1} 
                                            <ArrowRight className="h-3 w-3" />
                                        </button>
                                        <button 
                                            onClick={() => onAction(slide.target2 as any)}
                                            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-[9px] uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
                                        >
                                            {slide.cta2}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                    {HERO_SLIDES.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1 rounded-full transition-all duration-700 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </section>

            {/* 2. ESTADO DE AVANCE */}
            <section className="py-20 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 text-center md:text-left">
                        <div>
                            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Cifras de Gestión</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Estado de <span className="text-indigo-600">Avance</span></h2>
                        </div>
                        <button onClick={() => onAction('analitica')} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 w-full md:w-auto">
                            Explorar Analítica Completa
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <Activity className="h-8 w-8 mx-auto text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="block text-5xl font-black text-slate-900 tracking-tighter mb-1">{stats.cobertura}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cobertura de Seguimiento</span>
                        </div>
                        <div className="p-8 bg-indigo-600 rounded-3xl text-center text-white hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg shadow-indigo-600/10">
                            <Users className="h-8 w-8 mx-auto text-white/80 mb-4" />
                            <span className="block text-5xl font-black tracking-tighter mb-1">120</span>
                            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Entidades Vinculadas</span>
                        </div>
                        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <Target className="h-8 w-8 mx-auto text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="block text-5xl font-black text-slate-900 tracking-tighter mb-1">{stats.total}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instrumentos Activos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. QUIÉNES SOMOS (VISIÓN CALI 500+) */}
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
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-indigo-600/40">01</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white flex items-center gap-2">
                                            Planeación de largo plazo <Zap className="h-3 w-3 text-indigo-400" />
                                        </h4>
                                        <p className="text-[11px] font-bold text-indigo-300/60 uppercase tracking-wide">Planeación con visión de futuro</p>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Orientamos las decisiones del territorio mediante una visión compartida, que trasciende los periodos de gobierno y se articula con la política pública.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-cyan-600/40">02</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white flex items-center gap-2">
                                            Gobernanza colaborativa <Users className="h-3 w-3 text-cyan-400" />
                                        </h4>
                                        <p className="text-[11px] font-bold text-cyan-300/60 uppercase tracking-wide">Gobernanza y corresponsabilidad</p>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Construimos esta visión con la participación activa de ciudadanía, academia y sector privado, promoviendo responsabilidades compartidas.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-emerald-600/40">03</div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-white flex items-center gap-2">
                                            Decisiones basadas en evidencia <BarChart3 className="h-3 w-3 text-emerald-400" />
                                        </h4>
                                        <p className="text-[11px] font-bold text-emerald-300/60 uppercase tracking-wide">Datos para planificar mejor</p>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">Integramos información e indicadores territoriales para hacer seguimiento a la visión y apoyar decisiones informadas sobre el futuro de la ciudad.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative lg:pl-10">
                            <div className="absolute -inset-4 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full"></div>
                            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group transition-all duration-700 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60 z-10"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90" 
                                    alt="Cali Ciudad y Naturaleza" 
                                    className="w-full aspect-[4/5] object-cover opacity-90 transition-transform duration-[10s] group-hover:scale-110" 
                                />
                                <div className="absolute bottom-10 left-10 z-20">
                                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Cali: Corazón del Pacífico</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SALA DE PRENSA - REDESIGNED CAROUSEL */}
            <section id="sala-prensa" className="py-24 bg-white scroll-mt-20 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Cali 500+ en los Medios</span>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Sala de Prensa</h2>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={prevNews}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={nextNews}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div 
                            className="flex transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]"
                            style={{ transform: `translateX(-${(newsIndex * 100) / (window.innerWidth < 768 ? 1 : 3)}%)` }}
                        >
                            {NEWS.map((item, i) => (
                                <div key={i} className="w-full md:w-1/3 shrink-0 px-3">
                                    <div 
                                        onClick={() => window.open(item.link, '_blank')}
                                        className="h-full bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 cursor-pointer group flex flex-col relative"
                                    >
                                        {/* Logo Centered on Top - Using local assets */}
                                        <div className="h-16 flex items-center justify-center mb-8">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500 h-full aspect-video flex items-center justify-center overflow-hidden">
                                                <img src={item.logo} alt={item.source} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                        
                                        <div className="text-center mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block mb-3">{item.source}</span>
                                            <h4 className="font-black text-slate-900 text-lg leading-tight mb-4 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-3 min-h-[5.25rem]">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                {item.summary}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                                            <span className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Leer Nota <ExternalLink className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            <div className="flex gap-4 cursor-pointer group" onClick={() => window.open("https://wa.me/573173990220", "_blank")}>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">WhatsApp Oficial</h4>
                                    <p className="text-sm text-slate-500">+57 317 399 0220</p>
                                    <span className="text-indigo-600 text-xs font-bold hover:underline mt-1 inline-block">Hablar ahora</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">Correo Electrónico</h4>
                                    <p className="text-sm text-slate-500">paulajanetam@gmail.com</p>
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
                                        <button onClick={() => setFormSent(false)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Enviar otro mensaje</button>
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
