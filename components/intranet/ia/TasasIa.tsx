"use client";

import { useMemo, useState } from "react";
import { Info, Plus, SlidersHorizontal, Table2, Trash2 } from "lucide-react";
import GlassSelect from "@/components/ui/GlassSelect";
import { dataConnect } from "@/lib/firebase/client";
import { registrarError } from "@/lib/registro-seguro";
import { convertirTasa } from "@/lib/ia/tasas";
import { esInsumoModelable, unidadesTasaPara, unidadTasaSugerida } from "@/lib/ia/unidades";
import { eliminarTasaConsumo, guardarConfiguracionIa, guardarTasaConsumo, type GetPanelIaData } from "@/src/dataconnect-generated";
import {
  BotonGuardar, claseBotonSecundario, claseCampo, claseEtiqueta, formatoNumero, leerNumero, mensajeErrorIa, Modal, Tarjeta, type Avisar,
} from "./ui";

type Tasa = GetPanelIaData["tasaConsumos"][number];
type Insumo = GetPanelIaData["insumos"][number];
type Servicio = GetPanelIaData["tipoServicios"][number];
type Edicion = { insumo: Insumo; servicio: Servicio; tasa?: Tasa; valor: string; unidad: string; fuente: string; reiniciar: boolean; confirmarBorrado: boolean };

const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();
export const claveTasa = (servicioId: string, insumoId: string) => `${uuid(servicioId)}|${uuid(insumoId)}`;

export const MARGEN_INICIAL = 0.15;
export const LAMBDA_INICIAL = 1;

export default function TasasIa({ panel, recargar, avisar }: { panel: GetPanelIaData; recargar: () => Promise<void>; avisar: Avisar }) {
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [guardando, setGuardando] = useState(false);
  const config = panel.configuracionIa;
  const [margen, setMargen] = useState(String(Math.round((config?.margenSeguridad ?? MARGEN_INICIAL) * 1000) / 10));
  const [lambda, setLambda] = useState(String(config?.lambda ?? LAMBDA_INICIAL));
  const [incluirSimulado, setIncluirSimulado] = useState(config?.incluirSimulado ?? false);
  const [guardandoConfig, setGuardandoConfig] = useState(false);

  const modelables = panel.insumos.filter((i) => esInsumoModelable(i.unidadMedida));
  const excluidos = panel.insumos.filter((i) => !esInsumoModelable(i.unidadMedida));
  const tasas = useMemo(() => new Map(panel.tasaConsumos.map((t) => [claveTasa(t.tipoServicioId, t.insumoId), t])), [panel.tasaConsumos]);

  const abrir = (insumo: Insumo, servicio: Servicio) => {
    const tasa = tasas.get(claveTasa(servicio.id, insumo.id));
    setEdicion({
      insumo, servicio, tasa,
      valor: tasa ? String(tasa.tasaInicial).replace(".", ",") : "",
      unidad: tasa?.unidad ?? unidadTasaSugerida(insumo.unidadMedida) ?? "ml",
      fuente: tasa?.fuente ?? "",
      reiniciar: false,
      confirmarBorrado: false,
    });
  };

  const guardarTasa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edicion) return;
    const tasaInicial = leerNumero(edicion.valor);
    if (tasaInicial === null || tasaInicial < 0 || tasaInicial > 100_000) { avisar("Ingresa una tasa entre 0 y 100.000.", "error"); return; }
    if (edicion.fuente.length > 300) { avisar("La fuente admite hasta 300 caracteres.", "error"); return; }
    // Una tasa nueva parte igual a la inicial. Si cambia la unidad, la actual se convierte.
    const actual = edicion.tasa && !edicion.reiniciar ? convertirTasa(edicion.tasa.tasaActual, edicion.tasa.unidad, edicion.unidad) : null;
    setGuardando(true);
    try {
      await guardarTasaConsumo(dataConnect, {
        tipoServicioId: edicion.servicio.id, insumoId: edicion.insumo.id,
        tasaInicial, tasaActual: actual ?? tasaInicial, unidad: edicion.unidad, fuente: edicion.fuente.trim() || null,
      });
      await recargar();
      setEdicion(null);
      avisar(`Tasa de ${edicion.insumo.nombre} para ${edicion.servicio.nombre} guardada.`, "success");
    } catch (error) {
      registrarError("No se pudo guardar la tasa", error);
      avisar(mensajeErrorIa(error), "error");
    } finally { setGuardando(false); }
  };

  const eliminar = async () => {
    if (!edicion?.tasa) return;
    if (!edicion.confirmarBorrado) { setEdicion({ ...edicion, confirmarBorrado: true }); return; }
    setGuardando(true);
    try {
      await eliminarTasaConsumo(dataConnect, { tipoServicioId: edicion.servicio.id, insumoId: edicion.insumo.id });
      await recargar();
      setEdicion(null);
      avisar("Tasa eliminada. Ese servicio ya no consume este insumo en el modelo.", "success");
    } catch (error) {
      registrarError("No se pudo eliminar la tasa", error);
      avisar(mensajeErrorIa(error), "error");
    } finally { setGuardando(false); }
  };

  const guardarParametros = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = leerNumero(margen), l = leerNumero(lambda);
    if (m === null || m < 0 || m > 100) { avisar("El margen debe estar entre 0% y 100%.", "error"); return; }
    if (l === null || l < 0 || l > 10_000) { avisar("λ debe estar entre 0 y 10.000.", "error"); return; }
    setGuardandoConfig(true);
    try {
      await guardarConfiguracionIa(dataConnect, { margenSeguridad: m / 100, lambda: l, incluirSimulado });
      await recargar();
      avisar("Parámetros del modelo guardados. Se aplican en el próximo recálculo.", "success");
    } catch (error) {
      registrarError("No se pudo guardar la configuración IA", error);
      avisar(mensajeErrorIa(error), "error");
    } finally { setGuardandoConfig(false); }
  };

  return (
    <div className="space-y-6">
      <Tarjeta icono={Table2} titulo="Tasas de consumo por servicio" descripcion="Cantidad de insumo por kg de ropa. La tasa inicial la defines tú; la actual la recalcula el modelo con cada conteo físico.">
        {!modelables.length || !panel.tipoServicios.length ? (
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500 dark:bg-white/5">
            {!panel.tipoServicios.length ? "No hay servicios activos." : "No hay insumos medidos en volumen o masa."} Créalos primero en {panel.tipoServicios.length ? "Inventario" : "Comandas"}.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-100 dark:border-white/5">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-stone-50/80 text-xs uppercase text-stone-400 dark:bg-white/5">
                <tr>
                  <th scope="col" className="sticky left-0 bg-stone-50 px-4 py-3 dark:bg-stone-900">Insumo</th>
                  {panel.tipoServicios.map((s) => <th key={s.id} scope="col" className="px-4 py-3">{s.nombre}</th>)}
                </tr>
              </thead>
              <tbody>
                {modelables.map((insumo) => (
                  <tr key={insumo.id} className="border-t border-stone-100 dark:border-white/5">
                    <th scope="row" className="sticky left-0 bg-white/90 px-4 py-3 font-bold dark:bg-stone-900/90">
                      {insumo.nombre}
                      <span className="block text-[11px] font-normal text-stone-400">en {insumo.unidadMedida}</span>
                    </th>
                    {panel.tipoServicios.map((servicio) => {
                      const tasa = tasas.get(claveTasa(servicio.id, insumo.id));
                      return (
                        <td key={servicio.id} className="px-2 py-2">
                          <button
                            type="button" onClick={() => abrir(insumo, servicio)}
                            aria-label={`${tasa ? "Editar" : "Definir"} tasa de ${insumo.nombre} para ${servicio.nombre}`}
                            title={tasa?.fuente ? `Fuente: ${tasa.fuente}` : undefined}
                            className={`w-full rounded-xl px-3 py-2 text-left transition ${tasa ? "bg-brand-500/5 hover:bg-brand-500/10" : "text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5"}`}
                          >
                            {tasa ? (
                              <>
                                <span className="block font-extrabold text-stone-800 dark:text-stone-100">{formatoNumero(tasa.tasaInicial, 4)} <span className="text-xs font-semibold text-stone-400">{tasa.unidad}/kg</span></span>
                                <span className={`block text-[11px] ${Math.abs(tasa.tasaActual - tasa.tasaInicial) > 1e-9 ? "font-bold text-brand-600 dark:text-brand-400" : "text-stone-400"}`}>actual {formatoNumero(tasa.tasaActual, 4)}</span>
                                {tasa.fuente && <span className="mt-0.5 block truncate text-[11px] text-stone-400">{tasa.fuente}</span>}
                              </>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-semibold"><Plus className="h-3 w-3" />Definir</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Deja vacía la celda si el servicio no usa ese insumo. Las tasas solo se ingresan en ml o L para insumos líquidos y en g o kg para insumos en polvo.
        </p>
        {excluidos.length > 0 && (
          <p className="mt-2 text-xs text-stone-400">No entran al modelo por su unidad: {excluidos.map((i) => `${i.nombre} (${i.unidadMedida})`).join(", ")}.</p>
        )}
      </Tarjeta>

      <Tarjeta icono={SlidersHorizontal} titulo="Parámetros del modelo" descripcion="Se aplican en el próximo recálculo y en las estimaciones de las comandas.">
        <form onSubmit={guardarParametros} className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1.5">
            <span className={claseEtiqueta}>Margen de seguridad (%)</span>
            <input inputMode="decimal" value={margen} onChange={(e) => setMargen(e.target.value)} className={claseCampo} />
            <span className="block text-[11px] text-stone-400">Se suma a cada estimación al revisar si el stock alcanza.</span>
          </label>
          <label className="space-y-1.5">
            <span className={claseEtiqueta}>Regularización λ</span>
            <input inputMode="decimal" value={lambda} onChange={(e) => setLambda(e.target.value)} className={claseCampo} />
            <span className="block text-[11px] text-stone-400">Cuánto se respetan las tasas iniciales. 1 equivale a un período de datos.</span>
          </label>
          <div className="space-y-1.5">
            <span className={claseEtiqueta}>Datos de entrenamiento</span>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200/80 bg-stone-50/70 px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-stone-800/80">
              <input type="checkbox" checked={incluirSimulado} onChange={(e) => setIncluirSimulado(e.target.checked)} className="h-4 w-4 rounded accent-brand-500" />
              Incluir datos simulados
            </label>
            <span className="block text-[11px] text-stone-400">Úsalo solo para demostraciones.</span>
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <BotonGuardar guardando={guardandoConfig}>Guardar parámetros</BotonGuardar>
          </div>
        </form>
      </Tarjeta>

      <Modal
        abierto={!!edicion} alCerrar={() => setEdicion(null)} bloqueado={guardando} icono={Table2}
        titulo={edicion?.tasa ? "Editar tasa" : "Definir tasa"}
        subtitulo={edicion ? `${edicion.insumo.nombre} · ${edicion.servicio.nombre}` : undefined}
      >
        {edicion && (
          <form onSubmit={guardarTasa} className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <label className="space-y-1.5">
                <span className={claseEtiqueta}>Tasa inicial por kg</span>
                <input autoFocus inputMode="decimal" required value={edicion.valor} onChange={(e) => setEdicion({ ...edicion, valor: e.target.value })} placeholder="Ej: 12" className={claseCampo} />
              </label>
              <div className="w-28 space-y-1.5">
                <span className={claseEtiqueta}>Unidad</span>
                <GlassSelect
                  ariaLabel="Unidad de la tasa" value={edicion.unidad}
                  onChange={(unidad) => setEdicion({ ...edicion, unidad })}
                  options={unidadesTasaPara(edicion.insumo.unidadMedida).map((u) => ({ value: u, label: `${u}/kg` }))}
                />
              </div>
            </div>
            <label className="block space-y-1.5">
              <span className={claseEtiqueta}>Fuente</span>
              <input value={edicion.fuente} maxLength={300} onChange={(e) => setEdicion({ ...edicion, fuente: e.target.value })} placeholder="Ej: ficha técnica del fabricante, dosificador de la lavadora" className={claseCampo} />
            </label>
            {edicion.tasa && (
              <div className="rounded-xl bg-stone-50 p-3 text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Tasa actual del modelo: <strong>{formatoNumero(edicion.tasa.tasaActual, 4)} {edicion.tasa.unidad}/kg</strong>
                <label className="mt-2 flex cursor-pointer items-center gap-2 font-semibold">
                  <input type="checkbox" checked={edicion.reiniciar} onChange={(e) => setEdicion({ ...edicion, reiniciar: e.target.checked })} className="h-4 w-4 rounded accent-brand-500" />
                  Reiniciar la tasa actual a la inicial
                </label>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {edicion.tasa && (
                <button type="button" onClick={eliminar} disabled={guardando} className={`${claseBotonSecundario} ${edicion.confirmarBorrado ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300" : "hover:text-red-600"}`}>
                  <Trash2 className="h-4 w-4" />{edicion.confirmarBorrado ? "Confirmar eliminación" : "Eliminar"}
                </button>
              )}
              <button type="button" onClick={() => setEdicion(null)} disabled={guardando} className={`${claseBotonSecundario} ml-auto`}>Cancelar</button>
              <BotonGuardar guardando={guardando}>Guardar tasa</BotonGuardar>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
