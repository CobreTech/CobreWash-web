"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Archive, ShieldCheck, Clock, MapPinHouse, Shirt } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const waveOpacity = useTransform(scrollY, [0, 320], [1, 0]);
  const waveY = useTransform(scrollY, [0, 320], [0, 80]);
  const waveScrollX = useTransform(scrollY, [0, 320], [0, 60]);

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-light min-h-screen lg:h-screen lg:min-h-0 lg:max-h-screen lg:overflow-hidden flex items-start lg:items-center pt-28 pb-16 sm:pt-32 lg:pt-0 lg:pb-0"
    >
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-60" />
      <div className="absolute top-20 right-10 -z-10 w-72 h-72 rounded-full bg-brand-100/50 blur-3xl" />
      <div className="absolute bottom-20 left-10 -z-10 w-96 h-96 rounded-full bg-copper-100/40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text content (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200/60 px-4 py-2 rounded-full text-brand-700 text-xs sm:text-sm font-semibold shadow-sm"
            >
              <Shirt className="w-4 h-4 text-brand-500 animate-pulse" />
              <span>El mejor servicio de lavandería en Calama</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]"
              >
                Cuidado Impecable para <br />
                <span className="text-gradient">Tus Prendas y Textiles</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-stone-600 max-w-xl font-normal leading-relaxed"
              >
                En <strong className="text-stone-850 font-semibold">Lavandería El Cobre</strong> combinamos tecnología industrial avanzada con un trato delicado para ofrecerte resultados excepcionales. Nos encargamos de todo, desde tu ropa diaria hasta mantas, uniformes y mantelería corporativa.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <a
                href="#contacto"
                className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-8 py-4 rounded-xl font-bold text-base shadow-premium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              >
                <span>Cotizar Servicio</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#servicios"
                className="flex items-center justify-center gap-2 bg-white border border-stone-250 text-stone-700 hover:border-stone-400 hover:text-stone-900 px-8 py-4 rounded-xl font-bold text-base shadow-sm transition-all duration-300"
              >
                <span>Ver Servicios</span>
              </a>
            </motion.div>

            {/* Trust highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/85"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="p-2 bg-white/65 backdrop-blur-md border border-white/70 rounded-lg text-brand-650 w-fit shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-850">Garantía</p>
                  <p className="text-[10px] sm:text-xs text-stone-500">Cuidado Certificado</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="p-2 bg-white/65 backdrop-blur-md border border-white/70 rounded-lg text-brand-650 w-fit shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-850">Eficiencia</p>
                  <p className="text-[10px] sm:text-xs text-stone-500">Entregas a tiempo</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="p-2 bg-white/65 backdrop-blur-md border border-white/70 rounded-lg text-brand-650 w-fit shadow-sm">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-stone-850">Retiro y Entrega</p>
                  <p className="text-[10px] sm:text-xs text-stone-500">A tu puerta</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Image Frame - HIDDEN ON MOBILE (5 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex lg:col-span-5 relative items-center justify-center"
          >
            <div className="relative w-full max-w-sm lg:max-w-md aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[38vh] lg:max-h-[50vh] flex items-center justify-center">
              
              {/* Floating Badge 1 (Top-Left): 100% Calameño */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 bg-gradient-brand text-white p-3.5 rounded-xl shadow-lg border border-brand-600/50 flex items-center gap-2.5 max-w-[180px] z-20 hero-badge-left"
              >
                <MapPinHouse className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold leading-none">100% Calameño</p>
                  <p className="text-[9px] text-brand-100 mt-1 font-semibold leading-none">Orgullosamente Local</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 (Bottom-Right): Seguro & Confiable */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-6 glass-card bg-white/55 backdrop-blur-lg p-3.5 rounded-xl shadow-lg flex items-center gap-2.5 max-w-[190px] z-20 hero-badge-right"
              >
                <ShieldCheck className="w-5 h-5 text-brand-650 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-stone-900 leading-none">Seguro & Confiable</p>
                  <p className="text-[9px] text-stone-500 mt-1 font-semibold leading-none">Cuidado Garantizado</p>
                </div>
              </motion.div>

              {/* Float wrapper for transparent machine/clothes image */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full flex items-center justify-center z-10"
              >
                <div className="relative w-[95%] h-[95%]">
                  <Image
                    src="/images/hero/lavanderia-principal.webp"
                    alt="Maquinaria y servicio de Lavandería El Cobre"
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Layered scroll-animated & infinite-moving SVG waves - HIDDEN ON MOBILE */}
      <motion.div
        style={{ opacity: waveOpacity, y: waveY, x: waveScrollX }}
        className="hidden lg:block absolute bottom-0 left-0 right-0 z-20 pointer-events-none w-full overflow-hidden h-[165px] xl:h-[185px] hero-waves"
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute inset-0 w-[200%] h-full"
        >
          <svg
            viewBox="0 0 2880 185"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              opacity="0.72"
              d="M0 72 C240 48 480 98 720 74 C960 50 1200 96 1440 72 C1680 48 1920 98 2160 74 C2400 50 2640 94 2880 70 V185 H0 Z"
              fill="#ffedd5"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="absolute inset-0 w-[200%] h-full"
        >
          <svg
            viewBox="0 0 2880 185"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              opacity="0.96"
              d="M0 112 C240 92 480 138 720 116 C960 94 1200 136 1440 112 C1680 90 1920 138 2160 116 C2400 94 2640 132 2880 108 V185 H0 Z"
              fill="#fed7aa"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
