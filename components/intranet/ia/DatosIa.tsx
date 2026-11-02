"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Download, FileSpreadsheet, ShoppingCart, Upload } from "lucide-react";
import GlassSelect from "@/components/ui/GlassSelect";
import { auth, dataConnect } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";
import { leerCsv, type ErrorCsv, type TipoCsv } from "@/lib/ia/csv";
import { registrarConteoFisicoIa, registrarEntradaInventario, type GetPanelIaData } from "@/src/dataconnect-generated";
import { BotonGuardar, claseBotonSecundario, claseCampo, claseEtiqueta, formatoNumero, leerNumero, mensajeErrorIa, Tarjeta, type Avisar } from "./ui";

type Insumo = GetPanelIaData["insumos"][number];
const LIMITE_ARCHIVO = 350_000;
const PLANTILLA: Record<TipoCsv, string> = {
  conteos: "insumo;cantidad;fecha\nDetergente;82,5;2026-10-04\nDetergente;61;2026-10-11 18:30\n",
  compras: "insumo;cantidad;fecha\nDetergente;40;2026-10-07\n",
};

function SelectorInsumo({ insumos, value, onChange }: { insumos: Insumo[]; value: string; onChange: (id: string) => void }) {
  return (
    <GlassSelect
      ariaLabel="Insumo" searchable searchPlaceholder="Buscar insumo…" placeholder="Selecciona un insumo"
      value={value} onChange={onChange}
      options={insumos.map((i) => ({ value: i.id, label: `${i.nombre} (${i.unidadMedida})` }))}
    />
  );
}

function ConteoFisico({ insumos, recargar, avisar }: { insumos: Insumo[]; recargar: () => Promise<void>; avisar: Avisar }) {
  const [insumoId, setInsumoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);
  const insumo = insumos.find((i) => i.id === insumoId);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = leerNumero(cantidad);
    if (!insumo) { avisar("Selecciona el insumo contado.", "error"); return; }
    if (valor === null || valor < 0) { avisar("Ingresa la cantidad contada (0 o más).", "error"); return; }
    setGuardando(true);
    try {
      await registrarConteoFisicoIa(dataConnect, { id: crypto.randomUUID(), insumoId: insumo.id, cantidad: valor, revisionStock: insumo.revisionStock });
      setCantidad("");
      avisar(`Conteo de ${insumo.nombre} registrado: el stock quedó en ${formatoNumero(valor)} ${insumo.unidadMedida}.`, "success");
    } catch (error) {
      registrarError("No se pudo registrar el conteo físico", error);
      avisar(mensajeErrorIa(error), "error");
    } finally {
      setGuardando(false);
      await recargar();
    }
  };

  return (
    <Tarjeta icono={ClipboardCheck} titulo="Conteo físico" descripcion="Lo medido en bodega. Reemplaza el stock del insumo y queda aprobado.">
      <form onSubmit={guardar} className="space-y-4">
        <div className="space-y-1.5"><span className={claseEtiqueta}>Insumo</span><SelectorInsumo insumos={insumos} value={insumoId} onChange={setInsumoId} /></div>
        <label className="block space-y-1.5">
          <span className={claseEtiqueta}>Cantidad contada {insumo ? `(${insumo.unidadMedida})` : ""}</span>
          <input inputMode="decimal" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Ej: 82,5" className={claseCampo} />
          {insumo && <span className="block text-[11px] text-stone-400">Stock en el sistema: {formatoNumero(insumo.stockActual)} {insumo.unidadMedida}</span>}
        </label>
        <BotonGuardar guardando={guardando} className="w-full">Registrar conteo</BotonGuardar>
      </form>
    </Tarjeta>
  );
}

function Compra({ insumos, recargar, avisar }: { insumos: Insumo[]; recargar: () => Promise<void>; avisar: Avisar }) {
  const [insumoId, setInsumoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [referencia, setReferencia] = useState("");
  const [guardando, setGuardando] = useState(false);
  const insumo = insumos.find((i) => i.id === insumoId);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = leerNumero(cantidad);
    if (!insumo) { avisar("Selecciona el insumo comprado.", "error"); return; }
    if (valor === null || valor <= 0) { avisar("La cantidad comprada debe ser mayor que cero.", "error"); return; }
    setGuardando(true);
    try {
      await registrarEntradaInventario(dataConnect, { insumoId: insumo.id, cantidad: valor, motivo: referencia.trim() ? `Compra: ${referencia.trim()}` : "Compra" });
      setCantidad(""); setReferencia("");
      avisar(`Compra de ${formatoNumero(valor)} ${insumo.unidadMedida} de ${insumo.nombre} registrada.`, "success");
      await recargar();
    } catch (error) {
      registrarError("No se pudo registrar la compra", error);
      avisar(mensajeErrorIa(error), "error");
    } finally { setGuardando(false); }
  };

  return (
    <Tarjeta icono={ShoppingCart} titulo="Compra o reposición" descripcion="Suma la cantidad al stock actual del insumo.">
      <form onSubmit={guardar} className="space-y-4">
        <div className="space-y-1.5"><span className={claseEtiqueta}>Insumo</span><SelectorInsumo insumos={insumos} value={insumoId} onChange={setInsumoId} /></div>
        <label className="block space-y-1.5">
          <span className={claseEtiqueta}>Cantidad {insumo ? `(${insumo.unidadMedida})` : ""}</span>
          <input inputMode="decimal" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Ej: 40" className={claseCampo} />
        </label>
        <label className="block space-y-1.5">
          <span className={claseEtiqueta}>Referencia (opcional)</span>
          <input value={referencia} maxLength={150} onChange={(e) => setReferencia(e.target.value)} placeholder="Ej: factura 1234, proveedor" className={claseCampo} />
        </label>
        <BotonGuardar guardando={guardando} className="w-full">Registrar compra</BotonGuardar>
      </form>
    </Tarjeta>
  );
}

function CargaCsv({ insumos, recargar, avisar }: { insumos: Insumo[]; recargar: () => Promise<void>; avisar: Avisar }) {
  const [tipo, setTipo] = useState<TipoCsv>("conteos");
  const [archivo, setArchivo] = useState<{ nombre: string; texto: string } | null>(null);
  const [erroresServidor, setErroresServidor] = useState<ErrorCsv[] | null>(null);
  const [guardando, setGuardando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);
  const vista = useMemo(() => (archivo ? leerCsv(archivo.texto, tipo, insumos) : null), [archivo, tipo, insumos]);
  const errores = erroresServidor ?? vista?.errores ?? [];

  const limpiar = () => { setArchivo(null); setErroresServidor(null); if (entrada.current) entrada.current.value = ""; };

  const elegir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setErroresServidor(null);
    if (!f) return;
    if (f.size > LIMITE_ARCHIVO) { avisar("El archivo supera los 350 KB. Divídelo en partes.", "error"); limpiar(); return; }
    setArchivo({ nombre: f.name, texto: await f.text() });
  };

  const descargarPlantilla = () => {
    const url = URL.createObjectURL(new Blob(["﻿" + PLANTILLA[tipo]], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `plantilla-${tipo}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const importar = async () => {
    const usuario = auth.currentUser;
    if (!archivo || !vista || !usuario) return;
    setGuardando(true);
    try {
      const r = await fetch("/api/ia/importar", {
        method: "POST", cache: "no-store",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await usuario.getIdToken()}` },
        body: JSON.stringify({ tipo, texto: archivo.texto }),
      });
      const datos = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (Array.isArray(datos.errores)) setErroresServidor(datos.errores);
        avisar(datos.error ?? "No se pudo importar el archivo.", "error");
        return;
      }
      avisar(`Se importaron ${datos.guardadas} ${tipo === "conteos" ? "conteos" : "compras"}.`, "success");
      limpiar();
      await recargar();
    } catch (error) {
      registrarError("No se pudo importar el CSV", error);
      avisar("No se pudo importar el archivo. Revisa tu conexión e intenta nuevamente.", "error");
    } finally { setGuardando(false); }
  };

  return (
    <Tarjeta
      icono={FileSpreadsheet} titulo="Carga desde CSV"
      descripcion="Conteos o compras pasados. Se revisa el archivo completo antes de guardar y no cambia el stock actual."
      accion={<button type="button" onClick={descargarPlantilla} className={claseBotonSecundario}><Download className="h-4 w-4" />Plantilla</button>}
    >
      <div className="space-y-4">
        <div role="radiogroup" aria-label="Tipo de datos" className="flex gap-2">
          {(["conteos", "compras"] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={tipo === t} onClick={() => { setTipo(t); setErroresServidor(null); }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${tipo === t ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400"}`}>
              {t === "conteos" ? "Conteos físicos" : "Compras"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 p-6 text-center text-sm text-stone-500 transition hover:border-brand-400 hover:bg-brand-500/5 dark:border-white/10">
          <Upload className="h-6 w-6 text-brand-500" />
          <span className="font-bold text-stone-700 dark:text-stone-200">{archivo ? archivo.nombre : "Elige un archivo .csv"}</span>
          <span className="text-xs">Columnas: insumo, cantidad, fecha (AAAA-MM-DD o DD-MM-AAAA, hora opcional). Separador ; o ,</span>
          <input ref={entrada} type="file" accept=".csv,text/csv" onChange={elegir} className="sr-only" />
        </label>

        {vista && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-green-700 dark:text-green-400"><CheckCircle2 className="h-3.5 w-3.5" />{vista.filas.length} filas válidas</span>
              {errores.length > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-red-700 dark:text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{errores.length} con errores</span>}
            </div>
            {errores.length > 0 && (
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {errores.map((e) => <li key={`${e.linea}-${e.mensaje}`}><strong>Línea {e.linea}:</strong> {e.mensaje}</li>)}
              </ul>
            )}
            {vista.filas.length > 0 && (
              <div className="max-h-64 overflow-auto rounded-xl border border-stone-100 dark:border-white/5">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-stone-50 text-stone-400 dark:bg-stone-900"><tr><th className="px-3 py-2">Línea</th><th className="px-3 py-2">Insumo</th><th className="px-3 py-2">Cantidad</th><th className="px-3 py-2">Fecha</th></tr></thead>
                  <tbody>
                    {vista.filas.slice(0, 100).map((f) => (
                      <tr key={f.linea} className="border-t border-stone-100 dark:border-white/5">
                        <td className="px-3 py-1.5 text-stone-400">{f.linea}</td>
                        <td className="px-3 py-1.5 font-semibold">{f.insumoNombre}</td>
                        <td className="px-3 py-1.5">{formatoNumero(f.cantidad)} {insumos.find((i) => i.id === f.insumoId)?.unidadMedida}</td>
                        <td className="px-3 py-1.5">{new Date(f.fecha).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {vista.filas.length > 100 && <p className="p-2 text-center text-[11px] text-stone-400">Se muestran 100 de {vista.filas.length} filas.</p>}
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={limpiar} disabled={guardando} className={claseBotonSecundario}>Quitar archivo</button>
              <button type="button" onClick={importar} disabled={guardando || errores.length > 0 || !vista.filas.length} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
                {guardando ? "Importando…" : `Importar ${vista.filas.length} filas`}
              </button>
            </div>
            {errores.length > 0 && <p className="text-right text-[11px] text-stone-400">Corrige las filas con error y vuelve a cargar el archivo.</p>}
          </div>
        )}
      </div>
    </Tarjeta>
  );
}

export default function DatosIa({ panel, recargar, avisar }: { panel: GetPanelIaData; recargar: () => Promise<void>; avisar: Avisar }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ConteoFisico insumos={panel.insumos} recargar={recargar} avisar={avisar} />
        <Compra insumos={panel.insumos} recargar={recargar} avisar={avisar} />
      </div>
      <CargaCsv insumos={panel.insumos} recargar={recargar} avisar={avisar} />
    </div>
  );
}
