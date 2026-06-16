import React, { useRef, useState } from 'react';
import { ArrowRight, BarChart3, Bird, Download, Ear, History, Landmark, Leaf, Network, Pause, Play, Target, Telescope, UsersRound, Waves } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Stats } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeViewProps {
  stats: Stats;
  onAction: (view: 'analitica' | 'documentos' | 'datos') => void;
}

const axisIcons = [
  { src: 'assets/ejes/territorio.png', alt: 'Territorio inteligente y adaptativo' },
  { src: 'assets/ejes/bienestar.png', alt: 'Bienestar basado en la interculturalidad' },
  { src: 'assets/ejes/competitividad.png', alt: 'Competitividad sostenible' }
];

export const HomeView: React.FC<HomeViewProps> = ({ onAction }) => {
  const scope = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(true);

  const toggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsHeroVideoPlaying(true);
    } else {
      video.pause();
      setIsHeroVideoPlaying(false);
    }
  };

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.from('.hero-copy > *', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out'
    });

    gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
          once: true
        }
      });
    });
  }, { scope });

  return (
    <div ref={scope} className="overflow-hidden bg-white">
      <section className="relative min-h-[760px] overflow-hidden bg-[#A7DFFF] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_30%),linear-gradient(125deg,rgba(54,169,255,0.92),rgba(126,209,255,0.8)_48%,rgba(198,235,255,0.9))]" />
        <img
          src="assets/fondo.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-95"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#2A8FD8]/70 to-transparent" />
        <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-6 pb-20 pt-44 sm:pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:pt-36">
          <div className="hero-copy max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-sm backdrop-blur">
              <Landmark className="h-4 w-4" />
              Gestión pública y transparencia
            </div>
            <h1 className="mt-6 max-w-5xl text-white drop-shadow-[0_8px_28px_rgba(24,102,166,0.38)]">
              <img src="assets/logo-ilera.png" alt="Cali 500+" className="mr-4 inline h-14 w-auto max-w-[180px] align-middle sm:h-16 sm:max-w-[220px] lg:h-20 lg:max-w-[260px]" />
              <span className="font-anton align-middle text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">una visión de ciudad construida desde el territorio.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-white drop-shadow-[0_4px_18px_rgba(24,102,166,0.48)]">
              En 2050, Cali será referente internacional en sostenibilidad, a partir del cuidado de la biodiversidad y la interculturalidad como pilares del desarrollo territorial, social y económico.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="https://bit.ly/VisionCali500" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F46217] px-6 text-sm font-black text-white shadow-xl shadow-sky-950/20 transition hover:bg-white hover:text-[#1B78BE]">
                Conocer la visión
                <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={() => onAction('analitica')} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                Ver dashboard
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="reveal mt-6 lg:mt-14">
            <div className="relative mx-auto max-w-2xl rounded-[34px] border border-white/35 bg-white/20 p-3 shadow-[0_30px_80px_rgba(24,102,166,0.3)] backdrop-blur">
              <div className="relative aspect-video overflow-hidden rounded-[26px] bg-[#145A8C]">
                <video
                  ref={heroVideoRef}
                  className="absolute left-1/2 top-1/2 h-[177.78%] w-[56.25%] -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover"
                  src="assets/video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Video principal de Cali 500+"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <button
                  type="button"
                  onClick={toggleHeroVideo}
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/25 text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:bg-white/35 focus-visible:outline-white"
                  aria-label={isHeroVideoPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                  {isHeroVideoPlaying ? <Pause className="h-8 w-8" fill="currentColor" /> : <Play className="ml-1 h-9 w-9" fill="currentColor" />}
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-[#A7DFFF]" />
                  Cali 500+
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
                {axisIcons.map((icon) => (
                  <div key={icon.src} className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                    <img src={icon.src} alt={icon.alt} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal relative overflow-hidden bg-white py-16 font-editorial">
        <img
          src="assets/rey.png"
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 z-0 w-72 translate-x-10 translate-y-4 opacity-90 sm:w-96 lg:w-[540px]"
          aria-hidden="true"
        />
        <div className="relative z-10 mr-auto grid max-w-[1440px] gap-14 px-6 lg:grid-cols-[560px_minmax(0,1fr)] lg:pl-10 lg:pr-8 xl:pl-16">
          <div className="max-w-[560px]">
            <p className="text-xl font-extrabold uppercase tracking-[0.59em] text-[#F46217] mb-4">
              Quiénes somos
            </p>
            <div className="mt-3 h-1 w-12 bg-[#F46217] mb-9" />
            <h2 className="font-anton mt-5 text-[38px] leading-[0.94] tracking-tight text-[#24115A] sm:text-[46px] lg:text-[50px]">
              Una visión territorial,<br />
              no de gobierno<span className="ml-1 inline-block h-3 w-3 rounded-full bg-[#F46217] align-baseline sm:h-4 sm:w-4" aria-hidden="true" />
            </h2>
            <div className="mt-6 max-w-lg space-y-4 text-base leading-7 text-slate-700">
              <p>
                Cali 500+ nace como una apuesta de largo plazo para construir una visión compartida, técnica y participativa. Escuchar, reconocer y agradecer fue la brújula de un proceso moldeado por conversaciones con ciudadanía, academia, sector público, sector privado y organizaciones sociales.
              </p>
              <p>
                La iniciativa busca que la visión no quede como una aspiración aislada, sino que se vincule a instrumentos de planificación, pol?tica p?blica, seguimiento e institucionalidad.
              </p>
            </div>

            <div className="mt-7 flex items-center gap-5 rounded-[22px] border border-white bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.09)]">
              <div className="relative h-16 w-16 shrink-0 text-[#8E44AD]">
                <div className="absolute left-1/2 top-1 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-current bg-violet-50" />
                <div className="absolute left-2 top-5 h-5 w-5 rounded-full border-2 border-current bg-violet-50" />
                <div className="absolute right-2 top-5 h-5 w-5 rounded-full border-2 border-current bg-violet-50" />
                <div className="absolute bottom-1 left-1/2 h-7 w-10 -translate-x-1/2 rounded-t-full border-2 border-current bg-violet-50" />
                <div className="absolute bottom-0 left-0 h-6 w-8 rounded-t-full border-2 border-current bg-violet-50" />
                <div className="absolute bottom-0 right-0 h-6 w-8 rounded-t-full border-2 border-current bg-violet-50" />
              </div>
              <div className="h-14 w-1 shrink-0 bg-[#F46217]" />
              <div>
                <h3 className="font-editorial text-xl font-semibold leading-tight text-[#3A0D7B]">Construida con la ciudad, para la ciudad.</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Un proceso colectivo que convierte ideas en acuerdos y acuerdos en acción.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:translate-x-6 xl:translate-x-12">
            {[
              { number: '01', icon: History, title: 'El pasado para entendernos', text: 'Reconocer aprendizajes, procesos previos y capacidades territoriales.', color: '#1E88E5', ring: 'border-[#1E88E5]/18', bg: 'bg-[#1E88E5]', bar: 'bg-[#1E88E5]' },
              { number: '02', icon: Ear, title: 'El presente para escucharnos', text: 'Indagar por información técnica, pero también por dolores, expectativas y sentimientos ciudadanos.', color: '#7CB342', ring: 'border-[#7CB342]/20', bg: 'bg-[#7CB342]', bar: 'bg-[#7CB342]' },
              { number: '03', icon: Telescope, title: 'El futuro para encontrarnos', text: 'Llegar a acuerdos mínimos donde distintos actores puedan actuar con corresponsabilidad.', color: '#8E44AD', ring: 'border-[#8E44AD]/20', bg: 'bg-[#8E44AD]', bar: 'bg-[#8E44AD]' },
              { number: '04', icon: Target, title: 'Continuidad institucional', text: 'Conectar visión de largo plazo con decisiones, recursos e instrumentos de seguimiento.', color: '#EC407A', ring: 'border-[#EC407A]/20', bg: 'bg-[#EC407A]', bar: 'bg-[#EC407A]' }
            ].map((item) => (
              <article key={item.title} className={`group relative min-h-[198px] overflow-hidden rounded-[20px] border ${item.ring} bg-white p-5 pl-7 shadow-[0_16px_46px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_62px_rgba(15,23,42,0.14)]`}>
                <span className={`absolute left-0 top-0 h-full w-2.5 ${item.bar}`} />
                <span className="font-anton pointer-events-none absolute right-4 top-2 text-[76px] leading-none text-slate-900/[0.045]">{item.number}</span>
                <div className="relative z-10 h-16 w-16">
                  <span className="absolute inset-0 rounded-full opacity-25 blur-lg" style={{ backgroundColor: item.color }} />
                  <span className="absolute inset-1 rounded-full bg-white/70" />
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${item.bg} text-white shadow-xl ring-4 ring-white/80`}>
                    <item.icon className="h-8 w-8" strokeWidth={2.4} />
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-white shadow-sm" style={{ boxShadow: `0 0 0 3px ${item.color}33` }} />
                  </div>
                </div>
                <div className="relative z-10 mt-4">
                  <h3 className="font-anton max-w-[12rem] text-lg leading-tight" style={{ color: item.color }}>{item.title}</h3>
                  <div className="mt-3 h-1 w-10" style={{ backgroundColor: item.color }} />
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quienes-somos" className="reveal relative overflow-hidden py-20">
        <img src="assets/fondo-2.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-100" aria-hidden="true" />
        <div className="absolute inset-0 bg-white/58" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="flex justify-center lg:pr-4">
            <div className="w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
              <a
                href="https://www.instagram.com/p/DYBD7dgxXCP/"
                target="_blank"
                rel="noreferrer"
                className="block cursor-pointer transition hover:opacity-90"
              >
                <img src="assets/instagram/superior.png" alt="Encabezado publicación Instagram" className="w-full" />
              </a>

              <div className="relative aspect-[9/16] overflow-hidden bg-black">
                <video
                  className="h-full w-full object-cover"
                  src="assets/video_ig.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              <a
                href="https://www.instagram.com/p/DYBD7dgxXCP/"
                target="_blank"
                rel="noreferrer"
                className="block cursor-pointer transition hover:opacity-90"
              >
                <img src="assets/instagram/inferior.png" alt="Pie publicación Instagram" className="w-full" />
              </a>
            </div>
          </div>

          <div className="justify-self-end lg:max-w-[680px]">
            <div className="inline-block mb-6">
              <p className="font-anton text-sm uppercase tracking-[0.08em] text-[#F52789]">
                Potencialidades
              </p>

              <div className="mt-1 h-[2px] w-10 rounded-full bg-[#F52789]"></div>
            </div>
            <h2 className="font-bebas mt-4 text-4xl font-bold leading-[0.98] text-[#3B0764] sm:text-5xl lg:text-6xl">
              Biodiversidad, interculturalidad y <span className="text-[#F52789]">cuidado</span> como punto de partida<span className="ml-1 inline-block h-3 w-3 rounded-full bg-[#F52789] align-baseline sm:h-4 sm:w-4" aria-hidden="true" />
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
              La visión reconoce a Cali desde sus atributos esenciales: cultura vibrante, comunidad acogedora y entorno natural privilegiado. La biodiversidad y la interculturalidad se entienden como potencialidades centrales para proyectar un modelo de desarrollo más justo, regenerativo y sostenible.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Leaf, value: '71,16%', label: 'Estructura ecológica municipal del territorio distrital.', color: '#00A7C8', bg: 'bg-[#00A7C8]' },
                { icon: Waves, value: '7 ríos', label: 'atraviesan la zona urbana de Cali.', color: '#7CB342', bg: 'bg-[#7CB342]' },
                { icon: Bird, value: '980+', label: 'especies de aves registradas en el territorio.', color: '#F52789', bg: 'bg-[#F52789]' }
              ].map((item) => (
                <article key={item.value} className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/90 px-6 py-4 shadow-[0_22px_70px_rgba(15,23,42,0.12)] backdrop-blur">
                  <span className="absolute left-5 right-5 top-0 h-1 rounded-b-full" style={{ backgroundColor: item.color }} />
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.bg} text-white shadow-md`}>
                      <item.icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div>
                      <strong className="font-anton block text-2xl leading-none" style={{ color: item.color }}>{item.value}</strong>
                      <span className="mt-1 block text-[10px] font-black uppercase leading-4 tracking-[0.08em] text-slate-700">{item.label}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal relative overflow-hidden bg-[#2bffc7]">
        <div className="grid min-h-[480px] lg:grid-cols-2">
          <div className="relative self-stretch">
            <img src="assets/ion/vision.png" alt="Visión Cali 2050" className="absolute inset-0 h-full w-full object-contain object-bottom" />
          </div>
          <div className="flex items-center py-16 pr-10 pl-10 lg:pl-12 lg:pr-16" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div>
              <p className="text-3xl font-semibold leading-snug text-[#3A0D7B]">
                En el año <strong className="font-bold">2050</strong>, Cali será un referente internacional en sostenibilidad, a partir del cuidado de la biodiversidad y la interculturalidad, como pilares para el desarrollo territorial, social y económico.
              </p>
              <p className="mt-6 text-3xl font-semibold leading-snug text-[#3A0D7B]">
                Su planificación inteligente, garantizará un territorio adaptativo, el bienestar de sus habitantes y la competitividad sostenible en un contexto regional, nacional y global.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-center">

            {/* Left: title block */}
            <div>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#F52789]">Ejes estratégicos</span>
              <h2 className="font-anton mt-4 text-5xl leading-[0.92] text-[#3A0D7B] sm:text-6xl">
                Tres rutas para convertir la visión en{' '}
                <span className="text-[#F52789]">acción.</span>
              </h2>
              <div className="mt-6 flex gap-2">
                <span className="h-1 w-8 rounded-full bg-[#F52789]" />
                <span className="h-1 w-3 rounded-full bg-[#F46217]" />
                <span className="h-1 w-3 rounded-full bg-[#00A7C8]" />
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                Los ejes estratégicos organizan las transformaciones necesarias para cuidar las potencialidades de Cali y pasar de los acuerdos a{' '}
                <strong className="font-bold text-[#3A0D7B]">acciones sostenibles</strong>{' '}en el tiempo.
              </p>
            </div>

            {/* Right: stacked cards */}
            <div className="flex flex-col gap-5">
              {([
                {
                  number: '01',
                  img: 'assets/ejes/territorio.png',
                  title: 'Territorio inteligente y adaptativo',
                  text: 'Gestiona la biodiversidad como base del desarrollo urbano y rural, integra saberes comunitarios y fortalece la innovación institucional para tomar decisiones acordes con la diversidad del territorio.',
                  color: '#00A7C8',
                },
                {
                  number: '02',
                  img: 'assets/ejes/bienestar.png',
                  title: 'Bienestar basado en la interculturalidad',
                  text: 'Busca condiciones de vida dignas y equitativas: agua potable, aire limpio, soberanía alimentaria, salud física y mental, cultura ciudadana y convivencia.',
                  color: '#7CB342',
                },
                {
                  number: '03',
                  img: 'assets/ejes/competitividad.png',
                  title: 'Competitividad sostenible',
                  text: 'Impulsa economía circular, bioeconomía, crecimiento verde, talento humano e innovación para generar valor desde la biodiversidad y la interculturalidad.',
                  color: '#F52789',
                },
              ] as const).map((eje) => (
                <article
                  key={eje.title}
                  className="group flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(15,23,42,0.13)] hover:-translate-y-1"
                >
                  {/* Colored circle icon */}
                  <div
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-full"
                    style={{ border: `2px solid ${eje.color}66` }}
                  >
                    <img src={eje.img} alt={eje.title} className="h-full w-full object-cover" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-[#3A0D7B]">{eje.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{eje.text}</p>
                  </div>

                  {/* Number */}
                  <span className="font-anton shrink-0 text-5xl leading-none text-slate-100 transition-colors duration-300 group-hover:text-slate-200">
                    {eje.number}
                  </span>
                </article>
              ))}
            </div>

          </div>
        </div>
      </section>



      <section id="contacto" className="reveal bg-[#3A0D7B] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Datos abiertos</p>
            <h2 className="mt-3 text-3xl font-black">Consulte documentos habilitados y descargue archivos oficiales.</h2>
          </div>
          <button onClick={() => onAction('datos')} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-[#3A0D7B] transition hover:bg-orange-50">
            Ir a base documental
            <Download className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
