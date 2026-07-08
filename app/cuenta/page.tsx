"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Loader2, Package, ChevronDown, CheckCircle2, Home } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useUsuarioActual } from "@/lib/firebase/useUsuarioActual";
import { esRolInterno, LANDING_POR_ROL, type Rol } from "@/lib/roles";
import {
  comandasDeCliente,
  CLIENTE_DEMO,
  ETAPAS,
  estadoConfig,
  prendasTotales,
  valorTotal,
  progreso,
} from "@/lib/mock/comandas";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

export default function CuentaPage() {
  const router = useRouter();
  const { usuario, loading } = useUsuarioActual();
  const [abierta, setAbierta] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!usuario) {
      router.push("/");
      return;
    }
    // Los roles internos tienen su propia intranet.
    if (esRolInterno(usuario.rol.nombre)) {
      router.push(LANDING_POR_ROL[(usuario.rol.nombre as Rol)] ?? "/intranet");
    }
  }, [loading, usuario, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || !usuario || esRolInterno(usuario.rol.nombre)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fdfcfb]">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </main>
    );
  }

  const cliente = usuario.clientes_on_usuario[0];
  // Historial de comandas del cliente (mock). En un cliente real vendría de
  // Data Connect filtrado por su id; aquí usamos el set de demostración.
  const misComandas = comandasDeCliente(CLIENTE_DEMO);
  const activas = misComandas.filter((c) => c.estado === "En proceso" || c.estado === "Pendiente").length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/60 to-[#fdfcfb]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-brand-500/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.webp" alt="Logo" width={36} height={36} className="h-9 w-auto object-contain" />
            <span className="font-display font-extrabold text-stone-900 leading-none text-sm">
              Lavandería <span className="text-brand-500">El Cobre</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors">
              <Home className="w-4 h-4" /> Inicio
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Greeting + profile */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass-card bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="space-y-1">
              <span className="inline-block bg-brand-50 text-brand-700 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                Cliente {cliente?.tipoCliente === "HOTEL" ? "· Empresa" : "· Particular"}
              </span>
              <h1 className="text-2xl font-extrabold text-stone-900 font-display">Hola, {usuario.nombre}</h1>
              <p className="text-sm text-stone-500">Aquí puedes seguir el estado de tus pedidos.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-stone-50 rounded-2xl px-4 py-3 text-center min-w-[84px]">
                <p className="text-2xl font-extrabold text-brand-600">{misComandas.length}</p>
                <p className="text-[10px] text-stone-500">pedidos</p>
              </div>
              <div className="bg-stone-50 rounded-2xl px-4 py-3 text-center min-w-[84px]">
                <p className="text-2xl font-extrabold text-amber-500">{activas}</p>
                <p className="text-[10px] text-stone-500">activos</p>
              </div>
            </div>
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-6 pt-6 border-t border-stone-100">
            <Row label="Correo" value={usuario.email} />
            <Row label="RUT" value={usuario.rut ?? "—"} />
            <Row label="Teléfono" value={usuario.telefono ?? "—"} />
            <Row label="Dirección" value={cliente?.direccion ?? "—"} />
          </dl>
        </motion.div>

        {/* Historial */}
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 font-display mb-3 px-1">Mis pedidos</h2>
          <div className="space-y-3">
            {misComandas.map((c, i) => {
              const sc = estadoConfig[c.estado];
              const abiertaEsta = abierta === c.id;
              const pct = progreso(c);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-stone-150 shadow-premium overflow-hidden"
                >
                  <button onClick={() => setAbierta(abiertaEsta ? null : c.id)} className="w-full flex items-center gap-4 p-5 text-left cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900 text-sm">{c.id}</span>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {c.estado}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs mt-0.5">{c.servicio} · {c.fechaRecepcion}</p>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="font-extrabold text-stone-900 text-sm">{clp(valorTotal(c))}</p>
                      <p className="text-[10px] text-stone-400">{prendasTotales(c)} prendas</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${abiertaEsta ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {abiertaEsta && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
                          {/* Progress stepper */}
                          {c.estado !== "Anulado" && (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Estado · {pct}%</p>
                              <div className="flex items-center gap-1">
                                {ETAPAS.map((etapa, si) => {
                                  const idx = c.etapaActual ?? -1;
                                  const done = c.estado === "Entregado" || idx > si;
                                  const active = c.estado === "En proceso" && idx === si;
                                  return (
                                    <div key={etapa} className="flex-1 text-center">
                                      <div className={`h-1.5 rounded-full ${done ? "bg-green-500" : active ? "bg-brand-500 animate-pulse" : "bg-stone-200"}`} />
                                      <span className={`block mt-1 text-[9px] font-semibold ${active ? "text-brand-600" : done ? "text-stone-600" : "text-stone-400"}`}>{etapa}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Prendas */}
                          <div className="rounded-xl border border-stone-150 overflow-hidden">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-stone-50 text-stone-400">
                                  <th className="text-left font-bold px-3 py-2">Prenda</th>
                                  <th className="text-left font-bold px-3 py-2">Servicio</th>
                                  <th className="text-center font-bold px-3 py-2">Cant.</th>
                                  <th className="text-right font-bold px-3 py-2">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {c.detalle.map((d, di) => (
                                  <tr key={di} className="border-t border-stone-100">
                                    <td className="px-3 py-2 font-semibold text-stone-700">{d.tipoPrenda}</td>
                                    <td className="px-3 py-2 text-stone-500">{d.servicio}</td>
                                    <td className="px-3 py-2 text-center text-stone-500">{d.cantidad}</td>
                                    <td className="px-3 py-2 text-right font-semibold text-stone-700">{clp(d.cantidad * d.precioUnitario)}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr className="bg-stone-50 border-t border-stone-200">
                                  <td colSpan={3} className="px-3 py-2 text-right font-bold text-stone-500">Total</td>
                                  <td className="px-3 py-2 text-right font-extrabold text-brand-600">{clp(valorTotal(c))}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>

                          {c.estado === "Listo" && (
                            <p className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 rounded-xl px-3 py-2">
                              <CheckCircle2 className="w-4 h-4" /> Tu pedido está listo para retiro / entrega.
                            </p>
                          )}
                          {c.motivoAnulacion && (
                            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{c.motivoAnulacion}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-stone-100 pb-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-semibold text-stone-800 text-right truncate ml-4">{value}</dd>
    </div>
  );
}
