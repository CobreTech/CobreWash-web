"use client";
import { useRef, useState } from "react";
import { Download, ExternalLink, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import QrCode from "@/components/ui/QrCode";
import { obtenerEnlaceSeguimiento } from "@/lib/seguimiento/qr";

export default function QrPedido({ codigoQr, numeroComanda }: { codigoQr?: string | null; numeroComanda: string }) {
  const { url } = obtenerEnlaceSeguimiento(codigoQr);
  const contenedor = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  function descargar() {
    const svg = contenedor.current?.querySelector("svg");
    if (!svg) return;
    try {
      const contenido = new XMLSerializer().serializeToString(svg);
      const archivo = URL.createObjectURL(new Blob([contenido], { type: "image/svg+xml;charset=utf-8" }));
      const enlace = document.createElement("a"); enlace.href = archivo;
      enlace.download = `qr-${numeroComanda.replace(/[^a-z0-9_-]/gi, "")}.svg`; enlace.click();
      setTimeout(() => URL.revokeObjectURL(archivo), 1000);
      setError("");
    } catch { setError("No pudimos descargar el QR. Puedes abrir el seguimiento desde el enlace."); }
  }
  return <section aria-label={`QR de la comanda ${numeroComanda}`} className="glass-card space-y-5 rounded-3xl bg-white/75 p-5 text-center shadow-premium sm:p-6">
    <div><h3 className="flex items-center justify-center gap-2 font-display text-lg font-extrabold text-stone-900"><QrIcon className="h-5 w-5 text-brand-600" />QR de tu comanda</h3><p className="mt-2 text-xs leading-relaxed text-stone-500">Escanéalo para volver al estado de este pedido.</p></div>
    {url ? <>
      <div ref={contenedor} className="mx-auto w-fit rounded-2xl border border-stone-100 bg-white p-3"><QrCode value={url} size={176} /></div>
      <p className="break-words text-xs font-bold tracking-wide text-stone-700">{numeroComanda}</p>
      <div className="grid gap-2"><button type="button" onClick={descargar} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-xs font-bold text-white shadow-premium transition-shadow hover:shadow-lg"><Download className="h-4 w-4" />Descargar QR</button><a href={url} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"><ExternalLink className="h-4 w-4" />Abrir seguimiento</a></div>
    </> : <p role="status" className="rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-500">El QR de este pedido no está disponible. Puedes seguir consultándolo con el número de comanda.</p>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    <p className="flex items-start gap-2 rounded-xl bg-brand-50/50 p-3 text-left text-[11px] leading-relaxed text-stone-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />Comparte este QR solo con personas autorizadas. Permite ver el seguimiento público del pedido.</p>
  </section>;
}
