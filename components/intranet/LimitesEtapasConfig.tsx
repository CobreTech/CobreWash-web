"use client";

import { useEffect, useState } from "react";
import { Clock3, Loader2, RotateCcw, Save } from "lucide-react";
import { dataConnect } from "@/lib/firebase/client";
import { configurarLimitesEtapas, getEtapasProduccion } from "@/src/dataconnect-generated";
import { convertirLimiteMin, limiteEtapaMin, LIMITES_ETAPAS } from "@/lib/produccion/limites";
import GlassSelect from "@/components/ui/GlassSelect";

type Limite = { nombre: string; valor: string; unidad: "minutos" | "horas" };
function presentar(nombre: string, minutos: number): Limite {
  return { nombre, valor: String(minutos >= 120 && minutos % 60 === 0 ? minutos / 60 : minutos), unidad: minutos >= 120 && minutos % 60 === 0 ? "horas" : "minutos" };
}
const iniciales = () => LIMITES_ETAPAS.map((e) => presentar(e.nombre, e.minutos));

export default function LimitesEtapasConfig() {
  const [limites, setLimites] = useState<Limite[]>(iniciales);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [disponible, setDisponible] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let vigente = true;
    const cargar = async () => {
      setCargando(true); setDisponible(false); setError("");
      try {
        const res = await getEtapasProduccion(dataConnect, { fetchPolicy: "SERVER_ONLY" });
        const etapas = res.data.etapaProduccions;
        if (etapas.length !== 5 || etapas.some((e, i) => e.orden !== i + 1)) throw new Error("Catálogo incompleto");
        if (vigente) {
          setLimites(etapas.map((e) => presentar(e.nombre, limiteEtapaMin(e.orden, e.tiempoEstimadoMin)!)));
          setDisponible(true);
        }
      } catch {
        if (vigente) setError("No se pudieron cargar los límites. Comprueba la conexión y que existan las cinco etapas de producción.");
      } finally { if (vigente) setCargando(false); }
    };
    void cargar();
    return () => { vigente = false; };
  }, [revision]);

  const minutos = limites.map((l) => convertirLimiteMin(l.valor, l.unidad));
  const valido = minutos.every((m) => m != null);
  function modificar(index: number, cambios: Partial<Limite>) {
    setLimites((prev) => prev.map((l, i) => i === index ? { ...l, ...cambios } : l)); setNotice("");
  }
  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    if (guardando || !disponible || !valido) return;
    setGuardando(true); setError(""); setNotice("");
    try {
      await configurarLimitesEtapas(dataConnect, { recepcion: minutos[0]!, lavado: minutos[1]!, secado: minutos[2]!, planchado: minutos[3]!, entrega: minutos[4]! });
      setNotice("Límites guardados. Se aplicarán a los nuevos flujos; las comandas existentes conservan sus tiempos.");
    } catch { setError("No se pudieron guardar los límites. Reintenta; no se guardan cambios parciales."); }
    finally { setGuardando(false); }
  }
  return <form onSubmit={guardar} className="glass-panel space-y-5 rounded-2xl p-5 sm:p-6">
    <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400"><Clock3 className="h-5 w-5" /></span><div><h2 className="font-bold">Límites automáticos por etapa</h2><p className="mt-1 text-sm text-stone-500">Al superar el tiempo esperado, administración verá una alerta en cualquier sección de la intranet.</p></div></div>
    {error && <div role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{error}{!disponible && <button type="button" onClick={() => setRevision((r) => r + 1)} className="ml-2 font-bold underline">Reintentar</button>}</div>}
    {notice && <p role="status" className="rounded-xl bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-300">{notice}</p>}
    {cargando ? <p role="status" className="flex gap-2 py-6 text-sm"><Loader2 className="h-5 w-5 animate-spin" />Cargando límites…</p> : <fieldset disabled={guardando || !disponible} className="space-y-3 disabled:opacity-60">
      {limites.map((l, i) => <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-50 p-4 dark:bg-white/5">
        <label htmlFor={`limite-${i}`} className="text-sm font-semibold">{i + 1}. {l.nombre}</label>
        <div className="flex items-center gap-2"><input id={`limite-${i}`} required type="number" min={l.unidad === "horas" ? 1 / 60 : 1} max={l.unidad === "horas" ? 720 : 43_200} step={l.unidad === "horas" ? "any" : 1} value={l.valor} onChange={(e) => modificar(i, { valor: e.target.value })} className="w-24 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-white/10 dark:bg-stone-900" /><div className="w-32"><GlassSelect ariaLabel={`Unidad de ${l.nombre}`} value={l.unidad} disabled={guardando || !disponible} options={[{ value: "minutos", label: "Minutos" }, { value: "horas", label: "Horas" }]} onChange={(v) => { const unidad = v as Limite["unidad"]; const m = convertirLimiteMin(l.valor, l.unidad); modificar(i, { unidad, valor: m == null ? l.valor : String(unidad === "horas" ? m / 60 : m) }); }} /></div></div>
      </div>)}
    </fieldset>}
    <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-xs leading-relaxed text-stone-600 dark:border-brand-500/20 dark:bg-brand-500/5 dark:text-stone-400">Recepción se cuenta desde el ingreso de la comanda. Las demás etapas comienzan al completar la anterior. Se cuentan horas continuas, incluidas noches y fines de semana. Entrega incluye la espera de retiro del cliente. Las alertas se actualizan cada 30 segundos mientras la intranet esté visible.</div>
    {!valido && !cargando && <p role="alert" className="text-xs text-red-600">Usa tiempos equivalentes a minutos enteros, entre 1 minuto y 30 días.</p>}
    <div className="flex flex-wrap justify-end gap-2"><button type="button" disabled={guardando || cargando || !disponible} onClick={() => { setLimites(limites.map((l, i) => presentar(l.nombre, LIMITES_ETAPAS[i].minutos))); setNotice(""); }} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-500 hover:bg-stone-100 disabled:opacity-50 dark:hover:bg-white/5"><RotateCcw className="h-4 w-4" />Usar valores iniciales</button><button disabled={guardando || cargando || !disponible || !valido} className="flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium disabled:opacity-50">{guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{guardando ? "Guardando…" : "Guardar límites"}</button></div>
  </form>;
}
