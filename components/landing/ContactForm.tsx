"use client";

import { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, Clock, ShieldCheck, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSelect from "@/components/ui/GlassSelect";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    servicio: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.telefono || !formData.servicio || !formData.mensaje) {
      setError("Por favor, completa todos los campos del formulario.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        servicio: "",
        mensaje: "",
      });
    }, 1500);
  };

  const serviceOptions = [
    { value: "industrial", label: "Lavandería Industrial y Corporativa" },
    { value: "domestica", label: "Lavandería Doméstica y Particular" },
    { value: "retiro-entrega", label: "Servicio de Retiro y Entrega" },
    { value: "otro", label: "Otro / Consulta General" },
  ];

  return (
    <section id="contacto" className="py-20 bg-stone-50/50 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-brand-50 blur-3xl opacity-50" />
      <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-copper-50 blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-brand-650 font-bold">Contacto</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Cotiza tu Servicio <span className="text-brand-600">Hoy Mismo</span>
          </h3>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full mt-2" />
          <p className="text-stone-600 text-base sm:text-lg">
            Completa el formulario y nos pondremos en contacto contigo a la brevedad para entregarte una propuesta a tu medida.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Info Cards (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-extrabold text-stone-900">¿Listo para comenzar o tienes alguna duda?</h4>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Responderemos tu solicitud a la brevedad. Brindamos servicios rápidos y profesionales adaptados a las exigencias operativas de tu empresa o la comodidad de tu hogar.
              </p>
            </div>

            {/* Information Grid Cards */}
            <div className="space-y-4 pt-4">
              {/* Rapid response time */}
              <div className="flex items-start gap-4 p-5 glass-card bg-white/55 backdrop-blur-lg rounded-2xl shadow-premium">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900">Respuesta Rápida</h5>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Respondemos en menos de 2 días hábiles para cotizaciones corporativas y solicitudes del hogar.
                  </p>
                </div>
              </div>

              {/* Hoteles support */}
              <div className="flex items-start gap-4 p-5 glass-card bg-white/55 backdrop-blur-lg rounded-2xl shadow-premium">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900">Convenios y Contratos Hoteleros</h5>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Especialistas en lavado industrial y corporativo, con experiencia en convenios para hoteles, restaurantes y empresas mineras.
                  </p>
                </div>
              </div>

              {/* Direct channels */}
              <div className="flex items-start gap-4 p-5 glass-card bg-white/55 backdrop-blur-lg rounded-2xl shadow-premium">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900">Canales Directos de Comunicación</h5>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Llámanos o escríbenos directamente a <a href="tel:+56959594156" className="text-brand-700 font-bold hover:underline">+56 9 5959 4156</a> o al correo <a href="mailto:ventas@lavanderiaelcobrespa.com" className="text-brand-700 font-bold hover:underline break-all">ventas@lavanderiaelcobrespa.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container (7 columns) */}
          <div className="lg:col-span-7">
            <div className="glass-card bg-white/55 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-premium">
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Error Box */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label htmlFor="nombre" className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Juan Pérez"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 font-medium placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label htmlFor="telefono" className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="+56 9 1234 5678"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 font-medium placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Email input */}
                      <div className="space-y-2">
                        <label htmlFor="correo" className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          id="correo"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="juan.perez@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 font-medium placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm"
                        />
                      </div>

                      {/* Service Dropdown */}
                      <div className="space-y-2">
                        <label htmlFor="servicio" className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                          Tipo de Servicio
                        </label>
                        <GlassSelect
                          value={formData.servicio}
                          onChange={(v) => setFormData({ ...formData, servicio: v })}
                          ariaLabel="Tipo de servicio"
                          placeholder="Selecciona una opción"
                          options={serviceOptions}
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                      <label htmlFor="mensaje" className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                        Mensaje o Detalles del Requerimiento
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows={6}
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Escribe aquí los detalles, volumen de prendas, o consultas sobre nuestros convenios corporativos..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 font-medium placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white py-4 rounded-xl font-bold text-base shadow-premium hover:shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-[1.01]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Mensaje</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 space-y-6 flex flex-col items-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                    <div className="space-y-2">
                      <h4 className="text-2xl font-extrabold text-stone-900">¡Mensaje Enviado con Éxito!</h4>
                      <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto">
                        Gracias por ponerte en contacto. Hemos recibido tu solicitud de cotización y un ejecutivo se comunicará contigo a la brevedad.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
