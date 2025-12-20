
import React from 'react';
import { Trees, Heart, Zap, ChevronRight, Lightbulb, Globe, Users, TrendingUp } from 'lucide-react';

export const EjesView: React.FC = () => {
    return (
        <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] animate-in fade-in duration-700">
            {/* Hero de Sección */}
            <section className="relative py-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449156059344-232116839705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900"></div>
                </div>
                
                <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        Marco Conceptual
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
                        Ejes Estratégicos <br/>
                        <span className="text-indigo-400 font-light italic lowercase">de la visión Cali 500+</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Cali 500+ se fundamenta en tres pilares esenciales que definen el horizonte hacia el año 2050, 
                        equilibrando la protección del territorio, el bienestar social y el desarrollo económico sostenible.
                    </p>
                </div>
            </section>

            {/* Contenido de los Ejes */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-6xl space-y-32">
                    
                    {/* EJE 1: TERRITORIO Y BIODIVERSIDAD */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Trees className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Territorio y Biodiversidad</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">¿Qué dice el documento?</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Reconoce que la biodiversidad y el territorio son la base del desarrollo de Cali. La ciudad se proyecta como un territorio que protege sus ecosistemas, gestiona responsablemente el suelo y se adapta al cambio climático. La biodiversidad es un <strong>activo estratégico</strong> para la sostenibilidad.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Uso del suelo', 'Relación urbano–rural', 'Protección de ecosistemas', 'Resiliencia climática', 'Infraestructura verde'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-100 p-3 rounded-xl">
                                            <ChevronRight className="h-3 w-3 text-emerald-500" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="h-4 w-4 text-emerald-200" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Idea Clave</span>
                                    </div>
                                    <p className="text-sm font-bold leading-snug">
                                        El futuro de Cali depende de su capacidad para planificar el territorio reconociendo sus límites ecológicos y su riqueza natural.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Biodiversidad" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
                        </div>
                    </div>

                    {/* EJE 2: BIENESTAR E INTERCULTURALIDAD */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Bienestar" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <Heart className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Bienestar e Interculturalidad</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-indigo-500">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-700 mb-2">¿Qué dice el documento?</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Este eje plantea que el desarrollo solo es posible si mejora la calidad de vida de las personas, reconociendo la diversidad cultural, social y étnica de Cali. La <strong>interculturalidad</strong> es un valor estructural y una condición para la equidad.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Calidad de vida', 'Inclusión social', 'Diversidad cultural', 'Acceso a servicios', 'Participación'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-100 p-3 rounded-xl">
                                            <ChevronRight className="h-3 w-3 text-indigo-500" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="h-4 w-4 text-indigo-200" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Idea Clave</span>
                                    </div>
                                    <p className="text-sm font-bold leading-snug">
                                        Cali se proyecta como una ciudad donde el bienestar y la diversidad cultural son el centro de la planeación y las decisiones públicas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EJE 3: COMPETITIVIDAD SOSTENIBLE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Competitividad Sostenible</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">¿Qué dice el documento?</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Define que el crecimiento económico debe ser sostenible e inclusivo. La competitividad se mide en la capacidad de generar <strong>empleo de calidad</strong> e innovación sin comprometer la biodiversidad ni profundizar desigualdades.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Productividad', 'Empleo y capacidades', 'Innovación', 'Articulación productiva', 'Sostenibilidad'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-100 p-3 rounded-xl">
                                            <ChevronRight className="h-3 w-3 text-amber-500" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-5 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="h-4 w-4 text-amber-100" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Idea Clave</span>
                                    </div>
                                    <p className="text-sm font-bold leading-snug">
                                        La competitividad de Cali debe construirse sin comprometer su biodiversidad ni profundizar desigualdades sociales.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Competitividad" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent"></div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Resumen Final */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Resumen de Pilares</h2>
                        <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Territorio", desc: "Dónde y cómo se habita el territorio", color: "emerald", icon: Globe },
                            { title: "Bienestar", desc: "Cómo viven las personas", color: "indigo", icon: Users },
                            { title: "Competitividad", desc: "Cómo se genera desarrollo económico", color: "amber", icon: Zap },
                        ].map((card, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center group">
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                                    <card.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-base font-black uppercase tracking-widest mb-3 text-slate-900">{card.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-10 bg-indigo-900 rounded-[2.5rem] text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xl font-black uppercase tracking-tighter mb-4">La Planeación es un proceso vivo</h4>
                            <p className="text-sm text-indigo-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Estos tres ejes no compiten, se complementan para asegurar que Cali 500+ sea una realidad tangible, 
                                sostenida por una gobernanza eficiente y decisiones basadas en datos.
                            </p>
                            <button 
                                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                                className="px-10 py-4 bg-white text-indigo-900 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                            >
                                Volver al Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
