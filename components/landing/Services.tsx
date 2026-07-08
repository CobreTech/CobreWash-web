"use client";

import Image from "next/image";
import { Building2, Shirt, Truck, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      id: "industrial",
      title: "Lavandería Industrial y Corporativa",
      description: "Lavado y sanitización a gran escala para minería, hotelería, gastronomía e industrias. Especialistas en ropa térmica, overoles, uniformes y mantelería de alta resistencia.",
      image: "/images/services/lavanderia-services-1.webp",
      icon: Building2,
      features: [
        "Capacidad de alto volumen diario",
        "Sanitización bajo normas de higiene",
        "Control de calidad en prendas técnicas",
      ],
      badge: "Corporativo",
    },
    {
      id: "domestica",
      title: "Lavandería Doméstica y Particular",
      description: "Cuidado premium para tu ropa de uso diario, prendas delicadas, plumones, sábanas y cortinas. Recuperamos la frescura y suavidad natural de tus textiles.",
      image: "/images/services/lavanderia-services-2.webp",
      icon: Shirt,
      features: [
        "Lavado con detergentes hipoalergénicos",
        "Cuidado especial de lana y seda",
        "Planchado a vapor profesional",
      ],
      badge: "Particular",
    },
    {
      id: "retiro-entrega",
      title: "Servicio de Retiro y Entrega",
      description: "Hacemos tu vida más cómoda y eficiente. Retiramos tus prendas directamente en tu domicilio, oficina o faena en Calama y las regresamos impecables.",
      image: "/images/services/lavanderia-services-3.webp",
      icon: Truck,
      features: [
        "Coordinación flexible de horarios",
        "Transporte seguro y protegido",
        "Cobertura total en radio urbano de Calama",
      ],
      badge: "Logística",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="servicios" className="py-20 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-brand-650 font-bold">Nuestra Especialidad</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Servicios Diseñados para <span className="text-brand-600">Cada Necesidad</span>
          </h3>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full mt-2" />
          <p className="text-stone-600 text-base sm:text-lg">
            Ofrecemos soluciones textiles eficientes y confiables, tanto para particulares como para empresas e instituciones.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="glass-card bg-white/55 backdrop-blur-lg rounded-2xl overflow-hidden shadow-premium shadow-premium-hover flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-60 w-full overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {service.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Header with Icon */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-brand-50 text-brand-650 rounded-xl">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-stone-900 leading-tight">
                        {service.title}
                      </h4>
                    </div>

                    <p className="text-stone-600 text-sm sm:text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2.5 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2.5 text-stone-750 text-sm">
                          <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA inside card */}
                  <div className="pt-4 border-t border-stone-100">
                    <a
                      href="#contacto"
                      className="inline-flex items-center gap-2 text-brand-650 hover:text-brand-700 font-bold text-sm transition-colors group"
                    >
                      <span>Cotizar este servicio</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-250">→</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
