"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, CheckCircle2, LogIn, ArrowLeft, Clock, AlertCircle } from "lucide-react";

const ETAPAS = [
  { nombre: "Recepción", desc: "Recibimos y registramos tus prendas" },
  { nombre: "Lavado", desc: "Lavado y sanitizado" },
  { nombre: "Secado", desc: "Secado a temperatura controlada" },
  { nombre: "Planchado", desc: "Planchado y terminación" },
  { nombre: "Entrega", desc: "Listo para retiro / entrega" },
];

interface Resultado {
  codigo: string;
  servicio: string;
  fechaIngreso: string;
  etapaActual: number; // 0-4
}

// Mock: cualquier número devuelve una comanda de ejemplo. La etapa mostrada
// varía según el último dígito para que se sienta más real.
function consultarMock(codigo: string): Resultado {
  const limpio = codigo.trim().toUpperCase();
  const digitos = limpio.replace(/\D/g, "");
  const ultimo = digitos.length ? parseInt(digitos[digitos.length - 1], 10) : 2;
  return {
    codigo: limpio.startsWith("COBRE-") ? limpio : `COBRE-${limpio || "0000"}`,
    servicio: "Lavandería · Servicio estándar",
    fechaIngreso: "01/06/2026",
    etapaActual: ultimo % ETAPAS.length,
  };
}

function SeguimientoContent() {
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState<"idle" | "buscando" | "resultado">("idle");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const yaAutobuscado = useRef(false);

  const ejecutarBusqueda = (valor: string) => {
    setError("");
    if (!valor.trim()) {
      setError("Ingresa un número de comanda");
      setEstado("idle");
      setResultado(null);
      return;
    }
    setEstado("buscando");
    setTimeout(() => {
      setResultado(consultarMock(valor));
      setEstado("resultado");
    }, 900);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    ejecutarBusqueda(codigo);
  };

  // Si se llega desde el modal de la landing con ?codigo=..., autobuscar.
  useEffect(() => {
    const c = searchParams.get("codigo");
    if (c && !yaAutobuscado.current) {
      yaAutobuscado.current = true;
      setCodigo(c);
      ejecutarBusqueda(c);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/70 via-[#fdfcfb] to-[#fdfcfb]">
      {/* Header público (sin sidebar de intranet) */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-brand-500/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="Logo" width={36} height={36} className="h-9 w-auto object-contain" />
            <span className="font-display font-extrabold text-stone-900 leading-none text-sm">
              Lavandería <span className="text-brand-500">El Cobre</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
            <Link href="/?login=1" className="flex items-center gap-1.5 bg-gradient-brand text-white text-sm font-bold px-4 py-2 rounded-xl shadow-premium hover:shadow-lg transition-all">
              <LogIn className="w-4 h-4" /> Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-8">
        {/* Hero + search */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-1">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-stone-900">Seguimiento de pedido</h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            Ingresa tu número de comanda para ver el estado de tus prendas. No necesitas iniciar sesión.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={buscar}
          className="glass-card bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: COBRE-2848 o 2848"
                className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 font-bold placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm uppercase"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={estado === "buscando"}
              className="bg-gradient-brand text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 disabled:opacity-60"
            >
              {estado === "buscando" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Buscar"
              )}
            </button>
          </div>
          {error && (
            <p className="flex items-center gap-2 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </motion.form>

        {/* Resultado */}
        <AnimatePresence mode="wait">
          {estado === "resultado" && resultado && (
            <motion.div
              key={resultado.codigo}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="glass-card bg-white/80 backdrop-blur-xl rounded-2xl p-6 space-y-6"
            >
              {/* Encabezado del resultado — sin datos internos del negocio */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-150">
                <div>
                  <p className="font-display font-extrabold text-stone-900 text-lg">{resultado.codigo}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{resultado.servicio}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Ingreso</p>
                  <p className="flex items-center gap-1.5 text-stone-700 text-sm font-semibold justify-end">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {resultado.fechaIngreso}
                  </p>
                </div>
              </div>

              {/* Stepper de las 5 etapas */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-brand-700">Estado de tus prendas</h3>
                  <span className="text-xs font-bold text-brand-600">
                    {Math.round((resultado.etapaActual / (ETAPAS.length - 1)) * 100)}%
                  </span>
                </div>

                <div className="space-y-5 relative pl-7 before:absolute before:left-[10px] before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
                  {ETAPAS.map((etapa, i) => {
                    const done = i < resultado.etapaActual;
                    const active = i === resultado.etapaActual;
                    const esEntregaFinal = active && i === ETAPAS.length - 1;
                    return (
                      <motion.div
                        key={etapa.nombre}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative flex items-start justify-between gap-3"
                      >
                        <div
                          className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            done
                              ? "bg-green-500 border-green-500"
                              : active
                              ? "bg-brand-500 border-brand-500 scale-110"
                              : "bg-white border-stone-300"
                          }`}
                        >
                          {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                          {active && <div className="w-2 h-2 rounded-full bg-white animate-ping absolute" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${active ? "text-brand-650" : done ? "text-stone-900" : "text-stone-400"}`}>
                            {etapa.nombre}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">{etapa.desc}</p>
                        </div>
                        {active && (
                          <span className="bg-brand-50 border border-brand-200 text-brand-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full animate-pulse shrink-0">
                            {esEntregaFinal ? "Listo" : "En curso"}
                          </span>
                        )}
                        {done && <span className="text-[10px] text-green-600 font-bold shrink-0">Completado</span>}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CTA a registro/login */}
              <div className="pt-4 border-t border-stone-150 text-center space-y-2">
                <p className="text-xs text-stone-500">¿Quieres ver el historial completo de tus pedidos?</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/?login=1&registro=1" className="flex items-center justify-center gap-2 bg-gradient-brand text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-premium hover:shadow-lg transition-all">
                    Crear cuenta
                  </Link>
                  <Link href="/?login=1" className="flex items-center justify-center gap-2 bg-white border border-stone-250 text-stone-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:border-stone-400 transition-all">
                    <LogIn className="w-4 h-4" /> Iniciar sesión
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function SeguimientoPublicoPage() {
  return (
    <Suspense fallback={null}>
      <SeguimientoContent />
    </Suspense>
  );
}
