"use client";
import { useRef, useState } from "react";
import { FileDown, ImageDown, Loader2, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import QrCode from "@/components/ui/QrCode";
import { obtenerEnlaceSeguimiento } from "@/lib/seguimiento/qr";
import type { FormatoComanda } from "@/lib/seguimiento/exportar";

export default function QrPedido({ codigoQr, numeroComanda }: { codigoQr?: string | null; numeroComanda: string }) {
  const { url } = obtenerEnlaceSeguimiento(codigoQr);
  const contenedor = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [preparando, setPreparando] = useState<FormatoComanda | null>(null);
  const [mensaje, setMensaje] = useState("");
  async function descargar(formato: FormatoComanda) {
    const svg = contenedor.current?.querySelector("svg");
    if (!svg || preparando) return;
    setPreparando(formato); setError(""); setMensaje("");
    try {
      const { exportarComandaQr } = await import("@/lib/seguimiento/exportar");
      await exportarComandaQr(svg, numeroComanda, formato);
      setMensaje(`Descarga de ${formato === "png" ? "imagen" : "PDF"} iniciada.`);
    } catch { setError("No pudimos preparar la descarga. Vuelve a intentarlo."); }
    finally { setPreparando(null); }
  }
  return <section aria-label={`QR de la comanda ${numeroComanda}`} className="glass-card space-y-5 rounded-3xl bg-white/75 p-5 text-center shadow-premium sm:p-6">
    <div><h3 className="flex items-center justify-center gap-2 font-display text-lg font-extrabold text-stone-900"><QrIcon className="h-5 w-5 text-brand-600" />QR de tu comanda</h3><p className="mt-2 text-xs leading-relaxed text-stone-500">Escanéalo para volver al estado de este pedido.</p></div>
    {url ? <>
      <div ref={contenedor} className="mx-auto w-fit rounded-2xl border border-stone-100 bg-white p-3"><QrCode value={url} size={176} /></div>
      <p className="break-words text-xs font-bold tracking-wide text-stone-700">{numeroComanda}</p>
      <div className="space-y-3"><p className="text-xs text-stone-500">Guarda tu comanda como imagen o PDF.</p><div className="grid gap-2">
        <button type="button" disabled={preparando !== null} onClick={() => void descargar("png")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-xs font-bold text-white shadow-premium transition-shadow hover:shadow-lg disabled:opacity-50">{preparando === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}{preparando === "png" ? "Preparando imagen…" : "Descargar imagen"}</button>
        <button type="button" disabled={preparando !== null} onClick={() => void descargar("pdf")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50">{preparando === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}{preparando === "pdf" ? "Preparando PDF…" : "Descargar PDF"}</button>
      </div></div>
    </> : <p role="status" className="rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-500">El QR de este pedido no está disponible. Puedes seguir consultándolo con el número de comanda.</p>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    {mensaje && <p role="status" className="text-xs text-brand-700">{mensaje}</p>}
    <p className="flex items-start gap-2 rounded-xl bg-brand-50/50 p-3 text-left text-[11px] leading-relaxed text-stone-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />Comparte este QR solo con personas autorizadas. Permite ver el seguimiento público del pedido.</p>
  </section>;
}
