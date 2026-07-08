"use client";

import Image from "next/image";
import { Clock, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function Reception() {
  const contactDetails = [
    {
      id: "schedule",
      title: "Horario de Atención",
      icon: Clock,
      content: (
        <div className="space-y-1 text-stone-750">
          <p className="text-sm font-semibold flex justify-between">
            <span>Lunes a Viernes:</span>
            <span className="text-brand-650">8:00 - 20:00</span>
          </p>
          <p className="text-sm font-semibold flex justify-between">
            <span>Sábados:</span>
            <span className="text-brand-650">9:00 - 14:00</span>
          </p>
          <p className="text-xs text-stone-500 italic pt-1">
            *Domingos y festivos cerrado.
          </p>
        </div>
      ),
    },
    {
      id: "location",
      title: "Nuestra Ubicación",
      icon: MapPin,
      content: (
        <div className="space-y-2 text-stone-750">
          <p className="text-sm font-semibold">Avenida Balmaceda N°1276</p>
          <p className="text-xs text-stone-550">Calama, Región de Antofagasta</p>
          <a
            href="https://maps.google.com/?q=Avenida+Balmaceda+1276,+Calama"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand-650 hover:text-brand-700 font-bold transition-colors mt-1"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Ver en Google Maps</span>
          </a>
        </div>
      ),
    },
    {
      id: "channels",
      title: "Canales de Contacto",
      icon: Phone,
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-stone-100 rounded-lg text-stone-700 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">Teléfono / WhatsApp</p>
              <a
                href="tel:+56959594156"
                className="text-sm font-bold text-stone-850 hover:text-brand-600 transition-colors"
              >
                +56 9 5959 4156
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1 border-t border-stone-100">
            <div className="p-1.5 bg-stone-100 rounded-lg text-stone-700 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">Correo Electrónico</p>
              <a
                href="mailto:ventas@lavanderiaelcobrespa.com"
                className="text-sm font-bold text-stone-850 hover:text-brand-600 transition-colors break-all"
              >
                ventas@lavanderiaelcobrespa.com
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="recepcion" className="py-20 bg-gradient-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Details (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-650 font-bold">Atención Presencial</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                Punto de Recepción <span className="text-brand-600">en Calama</span>
              </h3>
              <div className="h-1 w-20 bg-brand-500 rounded-full mt-2" />
              <p className="text-stone-600 text-base max-w-xl leading-relaxed">
                Visítanos en nuestra sucursal central para entregar tus prendas personalmente. Contamos con una recepción rápida pensada en tu comodidad.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactDetails.map((detail, index) => {
                const IconComponent = detail.icon;
                return (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card bg-white/55 backdrop-blur-lg rounded-2xl p-6 shadow-premium flex gap-5 items-start"
                  >
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h4 className="text-base font-extrabold text-stone-900">
                        {detail.title}
                      </h4>
                      <div>{detail.content}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reception Mockup/Image (5 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft visual wrapper */}
              <div className="absolute -inset-3 bg-gradient-to-br from-brand-300 to-copper-600 opacity-15 rounded-3xl blur-md -z-10" />

              <div className="overflow-hidden rounded-2xl border-4 border-white shadow-2xl relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4]">
                <Image
                  src="/images/reception.webp"
                  alt="Recepción de Lavandería El Cobre"
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover transform hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Floating Address Badge */}
              <div className="absolute -top-4 -right-4 bg-brand-600 text-white px-5 py-3 rounded-xl shadow-lg border border-brand-500 max-w-[200px]">
                <p className="text-[10px] text-brand-100 font-bold uppercase tracking-wider">¿Dónde estamos?</p>
                <p className="text-xs font-bold mt-0.5 leading-snug">Av. Balmaceda 1276, Calama</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
