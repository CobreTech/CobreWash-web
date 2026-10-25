"use client";
import { useEffect, useRef, useState } from "react";
import { FileDown, ImageDown, Loader2, QrCode as QrIcon, X } from "lucide-react";
import QrCode from "@/components/ui/QrCode";

export default function QrInsumo({ insumo, cerrar }: {
  insumo: { nombre: string; codigoQr: string; unidadMedida: string }; cerrar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const codigo = useRef<HTMLDivElement>(null);
  const [preparando, setPreparando] = useState<"png" | "pdf" | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  useEffect(() => { dialogo.current?.showModal(); }, []);
  async function descargar(formato: "png" | "pdf") {
    const svg = codigo.current?.querySelector("svg");
    if (!svg || preparando) return;
    setPreparando(formato); setError(""); setMensaje("");
    try {
      const { exportarEtiquetaInsumo } = await import("@/lib/inventario/etiqueta");
      await exportarEtiquetaInsumo(svg, insumo, formato);
      setMensaje("Descarga iniciada. Puedes imprimir la etiqueta desde el PDF.");
    } catch { setError("No se pudo descargar la etiqueta. Intenta nuevamente."); }
    finally { setPreparando(null); }
  }
  return <dialog ref={dialogo} onCancel={e => { e.preventDefault(); if (!preparando) cerrar(); }} onClick={e => { if (e.target === e.currentTarget && !preparando) cerrar(); }} aria-labelledby="titulo-qr-insumo" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-stone-200 bg-stone-50 p-6 text-stone-900 shadow-2xl backdrop:bg-stone-900/60 backdrop:backdrop-blur-sm dark:border-white/10 dark:bg-stone-900 dark:text-stone-100">
    <button type="button" aria-label="Cerrar etiqueta" disabled={!!preparando} onClick={cerrar} className="absolute right-4 top-4 rounded-xl p-2 text-stone-500 hover:bg-stone-200 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
    <div className="space-y-5 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-600"><QrIcon /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-brand-600">Etiqueta de inventario</p><h2 id="titulo-qr-insumo" className="mt-2 break-words font-display text-xl font-extrabold">{insumo.nombre}</h2><p className="mt-2 text-xs text-stone-500">Escanea este código desde el inventario de la app.</p></div>
      <div ref={codigo} className="mx-auto w-fit rounded-2xl border border-stone-100 bg-white p-2"><QrCode value={insumo.codigoQr} size={220} title={`QR del insumo ${insumo.nombre}`} /></div>
      <p className="break-all font-mono text-[10px] text-stone-500">{insumo.codigoQr}</p>
      <div className="grid gap-2"><button onClick={() => void descargar("pdf")} disabled={!!preparando} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{preparando === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}Descargar PDF para imprimir</button><button onClick={() => void descargar("png")} disabled={!!preparando} className="flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-500/5 px-4 py-3 text-sm font-bold text-brand-700 disabled:opacity-40 dark:border-brand-500/20 dark:text-brand-300">{preparando === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}Descargar imagen</button></div>
      {error && <p role="alert" className="text-xs text-red-600 dark:text-red-300">{error}</p>}{mensaje && <p role="status" className="text-xs text-brand-700 dark:text-brand-300">{mensaje}</p>}
    </div>
  </dialog>;
}
