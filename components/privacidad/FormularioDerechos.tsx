"use client";
import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileText, Loader2, Search, Send, ShieldCheck } from "lucide-react";
import GlassSelect from "@/components/ui/GlassSelect";
import { DERECHOS, ETIQUETAS_DERECHOS, type Derecho } from "@/lib/privacidad/modelo";
const campo = "w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-stone-900 placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10";
const etiqueta = "block space-y-2 text-xs font-bold uppercase tracking-wider text-stone-600";
const boton = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:opacity-50";
type Recibo = { id: string; secreto: string; recibidoEn: string; estado: string; objetivoAtencion: string };
export default function FormularioDerechos() {
  const [nombre, setNombre] = useState(""); const [email, setEmail] = useState("");
  const [derecho, setDerecho] = useState<Derecho>("ACCESO"); const [detalle, setDetalle] = useState("");
  const [recibo, setRecibo] = useState<Recibo | null>(null); const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false); const enCurso = useRef(false);
  const pendiente = useRef<{ id: string; secreto: string } | null>(null);
  const [comprobante, setComprobante] = useState(""); const [estadoConsulta, setEstadoConsulta] = useState("");
  async function enviar(e: React.FormEvent) {
    e.preventDefault(); if (enCurso.current) return;
    enCurso.current = true; setOcupado(true); setError("");
    pendiente.current ??= { id: crypto.randomUUID(), secreto: Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("") };
    try {
      const r = await fetch("/api/privacidad/solicitudes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...pendiente.current, nombre, email, derecho, detalle }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || "No se pudo confirmar la recepción.");
      setRecibo({ ...d, secreto: pendiente.current.secreto }); pendiente.current = null;
      setNombre(""); setEmail(""); setDetalle("");
    } catch (e) { setError((e as Error).message); }
    finally { enCurso.current = false; setOcupado(false); }
  }
  function descargar() {
    if (!recibo) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(recibo, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `comprobante-datos-${recibo.id}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="space-y-5">
    {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" /><p>{error}</p></div>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section className="glass-card min-w-0 rounded-3xl bg-white/65 p-5 shadow-premium backdrop-blur-lg sm:p-8">
        {recibo ? <div className="space-y-5" aria-live="polite">
          <span className="inline-flex rounded-2xl bg-green-50 p-4 text-green-600"><CheckCircle2 className="h-8 w-8" /></span>
          <div><h2 className="font-display text-2xl font-extrabold text-stone-900">Solicitud recibida</h2><p className="mt-2 break-all text-xs font-semibold text-stone-500">Referencia: {recibo.id}</p></div>
          <p className="text-sm leading-relaxed text-stone-600">Conserva este comprobante en un lugar privado. No se guarda automáticamente en este navegador. La respuesta se coordinará con el correo indicado, previa verificación de identidad.</p>
          <button onClick={descargar} className={boton}><Download className="h-4 w-4" />Descargar comprobante</button>
          <details className="rounded-xl border border-stone-200 bg-stone-50/70 p-4"><summary className="cursor-pointer text-sm font-semibold text-stone-700">Ver código de consulta</summary><p className="mt-3 break-all font-mono text-xs leading-relaxed text-stone-500">{recibo.id}:{recibo.secreto}</p></details>
        </div> : <>
          <div className="mb-6 flex items-start gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-600"><FileText className="h-5 w-5" /></span><div><h2 className="font-display text-xl font-extrabold text-stone-900">Presentar una solicitud</h2><p className="mt-1 text-xs leading-relaxed text-stone-500">Cuéntanos qué necesitas respecto de tus datos.</p></div></div>
          <form onSubmit={enviar} className="space-y-5">
            <label className={etiqueta}><span>Nombre del titular o representante</span><input className={campo} required maxLength={160} autoComplete="name" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} /></label>
            <label className={etiqueta}><span>Correo para coordinar la respuesta</span><input className={campo} required type="email" maxLength={120} autoComplete="email" placeholder="nombre@correo.cl" value={email} onChange={e => setEmail(e.target.value)} /></label>
            <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-stone-600">Solicitud</p><GlassSelect ariaLabel="Solicitud sobre tus datos personales" value={derecho} onChange={value => setDerecho(value as Derecho)} options={DERECHOS.map(d => ({ value: d, label: ETIQUETAS_DERECHOS[d] }))} /></div>
            <label className={etiqueta}><span>Detalle {derecho === "ACCESO" ? "(opcional)" : "y fundamento"}</span><textarea className={campo} rows={5} required={derecho !== "ACCESO"} maxLength={3000} placeholder="Describe tu solicitud. Si representas a otra persona, indícalo aquí." value={detalle} onChange={e => setDetalle(e.target.value)} /></label>
            <p className="rounded-xl bg-stone-50/80 p-3 text-xs leading-relaxed text-stone-500">Utilizamos estos datos para tramitar tu petición, verificar identidad y responderte. No adjuntes documentos, claves, datos bancarios ni información sensible.</p>
            <button disabled={ocupado} className={boton}>{ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{ocupado ? "Enviando…" : "Presentar solicitud"}</button>
          </form>
        </>}
      </section>
      <aside className="min-w-0 space-y-5">
        <form className="glass-card space-y-5 rounded-3xl bg-white/65 p-5 shadow-premium backdrop-blur-lg sm:p-7" onSubmit={async e => {
      e.preventDefault(); setError(""); setEstadoConsulta(""); setOcupado(true);
      try {
        let datos: { id?: string; secreto?: string };
        try { datos = JSON.parse(comprobante); } catch { const [id, secreto] = comprobante.trim().split(":"); datos = { id, secreto }; }
        const r = await fetch("/api/privacidad/seguimiento", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: datos.id, secreto: datos.secreto }) });
        const d = await r.json(); if (!r.ok) throw new Error(d.error || "No se pudo consultar.");
        const estados: Record<string, string> = { RECIBIDA: "Recibida", VERIFICACION: "Verificando identidad", EN_GESTION: "En gestión", RESPONDIDA: "Respuesta registrada por administración" };
        setEstadoConsulta(estados[d.estado] || d.estado);
      } catch (e) { setError((e as Error).message); } finally { setOcupado(false); }
    }}>
          <div className="flex items-start gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-600"><Search className="h-5 w-5" /></span><div><h2 className="font-display text-lg font-extrabold text-stone-900">Consultar una solicitud</h2><p className="mt-1 text-xs leading-relaxed text-stone-500">Usa el comprobante que recibiste al enviarla.</p></div></div>
          <label className={etiqueta}><span>Comprobante o código de consulta</span><textarea className={campo + " font-mono text-xs"} rows={4} required placeholder="Pega aquí el contenido de tu comprobante" value={comprobante} onChange={e => setComprobante(e.target.value)} autoComplete="off" spellCheck={false} /></label>
          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50" disabled={ocupado}><Search className="h-4 w-4" />Consultar estado</button>
          <p role="status" className={estadoConsulta ? "flex items-center gap-2 rounded-xl bg-brand-50 p-4 text-sm font-semibold text-brand-800" : "sr-only"}>{estadoConsulta && <CheckCircle2 className="h-4 w-4 shrink-0" />}{estadoConsulta}</p>
        </form>
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5"><ShieldCheck className="mb-3 h-5 w-5 text-brand-600" /><h3 className="text-sm font-bold text-stone-900">Tu comprobante es privado</h3><p className="mt-2 text-xs leading-relaxed text-stone-600">Permite consultar el estado; no acredita identidad ni da acceso a datos personales. Las peticiones de supresión, revocación o bloqueo se evalúan antes de ejecutarse.</p></div>
      </aside>
    </div>
  </div>;
}
