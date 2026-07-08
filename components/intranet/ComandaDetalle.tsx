"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Receipt,
  Printer,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Pencil,
  Ban,
  CheckCircle2,
} from "lucide-react";
import QrCode from "@/components/intranet/QrCode";
import {
  ETAPAS,
  estadoConfig,
  prendasTotales,
  valorTotal,
  progreso,
  type Comanda,
} from "@/lib/mock/comandas";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

/* ─────────────────────────  DETALLE  ───────────────────────── */
export default function ComandaDetalle({
  comanda,
  onClose,
  onEditar,
  onAnular,
}: {
  comanda: Comanda;
  onClose: () => void;
  onEditar?: (c: Comanda) => void;
  onAnular?: (c: Comanda) => void;
}) {
  const [comprobante, setComprobante] = useState(false);
  const sc = estadoConfig[comanda.estado];
  const total = valorTotal(comanda);
  const etapaIdx = comanda.etapaActual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
              {comanda.id}
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${sc.bg} ${sc.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {comanda.estado}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-6">
          {/* Left: client + detail */}
          <div className="space-y-5 min-w-0">
            {/* Client */}
            <div className="bg-stone-50 dark:bg-white/5 rounded-2xl p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600">
                Cliente
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                <User className="w-4 h-4 text-stone-400" />
                {comanda.cliente}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {comanda.tipoCliente}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1 text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{comanda.telefono}</span>
                <span className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5 shrink-0" />{comanda.email}</span>
                {comanda.direccion && (
                  <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" />{comanda.direccion}</span>
                )}
              </div>
            </div>

            {/* Detail table */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">
                Detalle de prendas
              </p>
              <div className="rounded-2xl border border-stone-200 dark:border-white/5 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-white/5 text-stone-500 dark:text-stone-500">
                      <th className="text-left font-bold px-3 py-2">Prenda</th>
                      <th className="text-left font-bold px-3 py-2">Servicio</th>
                      <th className="text-center font-bold px-3 py-2">Cant.</th>
                      <th className="text-right font-bold px-3 py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comanda.detalle.map((d, i) => (
                      <tr key={i} className="border-t border-stone-100 dark:border-white/5">
                        <td className="px-3 py-2 font-semibold text-stone-700 dark:text-stone-200">{d.tipoPrenda}</td>
                        <td className="px-3 py-2 text-stone-500 dark:text-stone-400">{d.servicio}</td>
                        <td className="px-3 py-2 text-center text-stone-500 dark:text-stone-400">{d.cantidad}</td>
                        <td className="px-3 py-2 text-right font-semibold text-stone-700 dark:text-stone-200">
                          {clp(d.cantidad * d.precioUnitario)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5">
                      <td colSpan={2} className="px-3 py-2 text-stone-500 dark:text-stone-400">
                        {prendasTotales(comanda)} prendas
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-stone-500 dark:text-stone-400">Total</td>
                      <td className="px-3 py-2 text-right font-extrabold text-brand-600 dark:text-brand-400">{clp(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Progress */}
            {comanda.estado !== "Anulado" && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-600 mb-2">
                  Producción · {progreso(comanda)}%
                </p>
                <div className="flex items-center gap-1">
                  {ETAPAS.map((etapa, i) => {
                    const done = etapaIdx !== null && (etapaIdx > i || comanda.estado === "Entregado");
                    const active = etapaIdx === i && comanda.estado === "En proceso";
                    return (
                      <div key={etapa} className="flex-1 text-center">
                        <div
                          className={`h-1.5 rounded-full ${
                            done ? "bg-green-500" : active ? "bg-brand-500 animate-pulse" : "bg-stone-200 dark:bg-stone-700"
                          }`}
                        />
                        <span
                          className={`block mt-1 text-[9px] font-semibold ${
                            active ? "text-brand-600 dark:text-brand-400" : done ? "text-stone-600 dark:text-stone-300" : "text-stone-400 dark:text-stone-600"
                          }`}
                        >
                          {etapa}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {comanda.motivoAnulacion && (
              <div className="text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl p-3">
                <span className="font-bold">Anulada:</span> {comanda.motivoAnulacion}
              </div>
            )}
          </div>

          {/* Right: QR + meta */}
          <div className="flex sm:flex-col items-center gap-4 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <QrCode value={comanda.id} size={132} className="shadow-premium" />
              <p className="text-[10px] text-stone-400 dark:text-stone-600 font-semibold">Escanear comanda</p>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1.5">
              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{comanda.fechaRecepcion}</span>
              {comanda.recepcionista && (
                <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" />Rec.: {comanda.recepcionista}</span>
              )}
              {comanda.operario && (
                <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" />Op.: {comanda.operario}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-stone-100 dark:border-white/5">
          <button
            onClick={() => setComprobante(true)}
            className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            Generar comprobante
          </button>
          {onEditar && comanda.estado !== "Anulado" && (
            <button
              onClick={() => onEditar(comanda)}
              className="flex items-center gap-2 bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          )}
          {onAnular && comanda.estado !== "Anulado" && comanda.estado !== "Entregado" && (
            <button
              onClick={() => onAnular(comanda)}
              className="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <Ban className="w-4 h-4" />
              Anular
            </button>
          )}
        </div>
      </motion.div>

      {/* Comprobante */}
      <AnimatePresence>
        {comprobante && <ComprobanteModal comanda={comanda} onClose={() => setComprobante(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────  COMPROBANTE  ───────────────────────── */
export function ComprobanteModal({ comanda, onClose }: { comanda: Comanda; onClose: () => void }) {
  const total = valorTotal(comanda);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 24 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Ticket — siempre en blanco, como un comprobante impreso */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-stone-900">
          <div className="bg-gradient-brand text-white px-5 py-4 text-center">
            <p className="font-display font-extrabold tracking-tight text-lg leading-none">Lavandería El Cobre</p>
            <p className="text-[11px] text-white/80 mt-1">Comprobante de recepción · Calama, Chile</p>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div className="flex justify-between items-start text-xs border-b border-dashed border-stone-300 pb-3">
              <div>
                <p className="text-stone-400">Comanda</p>
                <p className="font-extrabold text-base">{comanda.id}</p>
              </div>
              <div className="text-right">
                <p className="text-stone-400">Fecha</p>
                <p className="font-semibold">{comanda.fechaRecepcion}</p>
              </div>
            </div>

            <div className="text-xs space-y-0.5">
              <p className="text-stone-400">Cliente</p>
              <p className="font-bold">{comanda.cliente} · {comanda.tipoCliente}</p>
              <p className="text-stone-500">{comanda.telefono}</p>
            </div>

            <div className="text-xs">
              <div className="flex justify-between text-stone-400 font-semibold border-b border-stone-200 pb-1">
                <span>Detalle</span>
                <span>Subtotal</span>
              </div>
              {comanda.detalle.map((d, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-dashed border-stone-100">
                  <span className="text-stone-700">{d.cantidad}× {d.tipoPrenda} <span className="text-stone-400">· {d.servicio}</span></span>
                  <span className="font-semibold shrink-0 ml-2">{clp(d.cantidad * d.precioUnitario)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-sm">TOTAL</span>
              <span className="font-extrabold text-lg text-brand-600">{clp(total)}</span>
            </div>

            <div className="flex flex-col items-center gap-1 pt-2 border-t border-dashed border-stone-300">
              <QrCode value={comanda.id} size={110} />
              <p className="text-[10px] text-stone-400">Escanea para seguir tu pedido</p>
              <p className="text-[10px] text-stone-400 text-center leading-snug mt-1">
                ¡Gracias por preferirnos! Conserva este comprobante para retirar tus prendas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-stone-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-stone-50 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Listo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
