"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VERSION_PRIVACIDAD } from "@/lib/privacidad/modelo";
import { ShieldCheck, Clock3, ArrowUpRight } from "lucide-react";
export function useAvisoPublicado() {
  const [publicado, setPublicado] = useState(false);
  useEffect(() => {
    let vigente = true;
    fetch("/api/privacidad/configuracion", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => {
      if (vigente) setPublicado(d?.publicada === true && d.version === VERSION_PRIVACIDAD);
    }).catch(() => { if (vigente) setPublicado(false); });
    return () => { vigente = false; };
  }, []);
  return publicado;
}
export default function AutorizacionDatos({ finalidad, aceptada, onChange, publicada }: { finalidad: "cuenta" | "cotizacion"; aceptada: boolean; onChange: (valor: boolean) => void; publicada: boolean }) {
  return <div className="space-y-3 rounded-2xl border border-brand-100/80 bg-brand-50/40 p-4 text-xs leading-relaxed text-stone-600 sm:p-5">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-700"><ShieldCheck className="h-4 w-4" />Tus datos personales</div>
    <p>{finalidad === "cuenta" ? "Usaremos tus datos para crear y administrar tu cuenta, identificar tu ficha y mostrar tus pedidos. Teléfono y dirección son opcionales. El RUT permite identificar la ficha; no es una contraseña." : "Usaremos tu nombre, correo y mensaje para responder esta cotización. El teléfono es opcional. No incluyas información sensible ni datos de otras personas."}</p>
    <p className="flex flex-wrap gap-x-4 gap-y-2"><Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-brand-700 underline decoration-brand-200 underline-offset-4">Leer aviso de privacidad<ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/privacidad/derechos" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4">Ejercer mis derechos</Link></p>
    {publicada ? <label className="flex cursor-pointer items-start gap-3 border-t border-brand-100 pt-3"><input type="checkbox" required checked={aceptada} onChange={e => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600" /><span>Autorizo expresamente el uso de mis datos para {finalidad === "cuenta" ? "crear y administrar mi cuenta y consultar mis pedidos" : "atender esta solicitud de cotización"}, según el aviso versión {VERSION_PRIVACIDAD}. Esta autorización no incluye publicidad y puedo solicitar su revocación.</span></label> : <p role="status" className="flex items-start gap-2.5 rounded-xl border border-copper-200/60 bg-copper-50/80 p-3 text-copper-900"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" /><span>Estamos completando los datos legales del aviso. La {finalidad === "cuenta" ? "creación de nuevas cuentas" : "recepción de nuevas cotizaciones por este formulario"} se habilitará al publicar el aviso aprobado.</span></p>}
  </div>;
}
