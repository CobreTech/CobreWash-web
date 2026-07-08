"use client";

import Image from "next/image";
import { WashingMachine, Wind, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function Machinery() {
  const machineryItems = [
    {
      id: "washers",
      title: "Lavadoras Industriales",
      tagline: "Higiene y dosificación automatizada",
      description: "Equipos industriales de alta tecnología con control avanzado de ciclos. Regulan de forma exacta la temperatura, la velocidad de rotación y la dosificación de insumos, eliminando grasa y suciedad extrema sin comprometer la resistencia del tejido.",
      image: "/images/machinery/machinery-1.webp",
      icon: WashingMachine,
      details: [
        { label: "Dosificación Inteligente", text: "Regulación automática de detergente por peso." },
        { label: "Desinfección Térmica", text: "Ciclos de temperatura que aseguran eliminación patógena." }
      ],
      color: "from-amber-500/10 to-brand-500/10"
    },
    {
      id: "dryers",
      title: "Secadoras Eficientes",
      tagline: "Protección de fibras por humedad residual",
      description: "Sistemas de secado rápido y eficiente que controlan la humedad del tambor de forma constante. Evitan el sobrecalentamiento, reduciendo la fricción estática y prolongando la vida útil de uniformes y prendas del hogar.",
      image: "/images/machinery/machinery-2.webp",
      icon: Wind,
      details: [
        { label: "Secado Inteligente", text: "Apagado automático al alcanzar la humedad exacta." },
        { label: "Rotación Reversible", text: "Evita enredos y arrugas profundas durante el secado." }
      ],
      color: "from-orange-500/10 to-copper-600/10"
    },
    {
      id: "ironers",
      title: "Sistema de Planchado",
      tagline: "Acabado profesional a vapor",
      description: "Contamos con calandras de planchado industrial y prensas a vapor para un acabado liso y libre de arrugas. Ideal para mantelería fina de restaurantes, sábanas de hoteles, camisas y uniformes corporativos.",
      image: "/images/machinery/machinery-3.webp",
      icon: Layers,
      details: [
        { label: "Calandrado Industrial", text: "Planchado y secado simultáneo de textiles planos." },
        { label: "Termo-acabado", text: "Prensado de precisión para cuellos, puños y prendas de vestir." }
      ],
      color: "from-brand-500/10 to-amber-600/10"
    }
  ];

  return (
    <section id="maquinaria" className="py-20 bg-white relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-brand-50 blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-copper-50 blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-brand-650 font-bold">Nuestra Tecnología</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Equipamiento de <span className="text-brand-600">Última Generación</span>
          </h3>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full mt-2" />
          <p className="text-stone-600 text-base sm:text-lg">
            Garantizamos resultados óptimos mediante el uso de tecnología avanzada que optimiza el agua, la energía y el cuidado de los textiles.
          </p>
        </div>

        {/* Machinery Items Showcase (Alternating Layouts) */}
        <div className="space-y-24 md:space-y-32">
          {machineryItems.map((item, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                {/* Image side - Alternating left/right order */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="relative group">
                    {/* Shadow overlay and borders */}
                    <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-brand-400 to-amber-500 opacity-10 group-hover:opacity-15 blur-md transition-opacity duration-300" />
                    
                    <div className="overflow-hidden rounded-2xl border-4 border-stone-100 shadow-xl relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-w-768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Text content side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`lg:col-span-6 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs uppercase font-bold tracking-wider text-brand-700">
                      {item.tagline}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specs & Quality Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                    {item.details.map((detail, dIndex) => (
                      <div key={dIndex} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <h5 className="text-xs sm:text-sm font-bold text-stone-850">
                            {detail.label}
                          </h5>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed pl-3.5">
                          {detail.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
