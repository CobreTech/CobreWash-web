import type { TasaServicio } from "./modelo";

/**
 * Generador de datos simulados para demostrar cómo el modelo aprende.
 *
 * Se eligen tasas "verdaderas" ocultas cerca de las iniciales, se simula la
 * producción diaria y el consumo con ruido, se repone stock cuando baja y se
 * registra un conteo físico al cierre de cada semana. Todo es reproducible
 * con la misma semilla.
 */

export interface ParametrosSimulacion {
  semanas: number;
  kgSemanalMin: number;
  kgSemanalMax: number;
  /** Ruido relativo del consumo diario (0.1 = ±10% típico). */
  ruido: number;
  /** Cuánto se alejan las tasas verdaderas de las iniciales (0.3 = hasta ±30%). */
  desvioTasas: number;
  semilla: number;
  /** Instante del primer conteo (ISO). */
  inicio: string;
}

export const LIMITES_SIMULACION = {
  semanas: [1, 52],
  kgSemanal: [6000, 9000],
  ruido: [0, 0.5],
  desvioTasas: [0, 0.5],
} as const;

export const PARAMETROS_SIMULACION_INICIALES: Omit<ParametrosSimulacion, "inicio" | "semilla"> = {
  semanas: 12,
  kgSemanalMin: 6000,
  kgSemanalMax: 9000,
  ruido: 0.1,
  desvioTasas: 0.3,
};

export function validarParametrosSimulacion(p: ParametrosSimulacion): string | null {
  const entre = (v: number, [a, b]: readonly [number, number]) => Number.isFinite(v) && v >= a && v <= b;
  if (!Number.isInteger(p.semanas) || !entre(p.semanas, LIMITES_SIMULACION.semanas)) return "Las semanas deben ser un número entero entre 1 y 52.";
  if (!entre(p.kgSemanalMin, LIMITES_SIMULACION.kgSemanal) || !entre(p.kgSemanalMax, LIMITES_SIMULACION.kgSemanal)) return "Los kg semanales deben estar entre 6.000 y 9.000.";
  if (p.kgSemanalMin > p.kgSemanalMax) return "El mínimo de kg semanales no puede superar al máximo.";
  if (!entre(p.ruido, LIMITES_SIMULACION.ruido)) return "El ruido debe estar entre 0% y 50%.";
  if (!entre(p.desvioTasas, LIMITES_SIMULACION.desvioTasas)) return "La desviación de las tasas verdaderas debe estar entre 0% y 50%.";
  if (!Number.isSafeInteger(p.semilla)) return "La semilla debe ser un número entero.";
  if (!Number.isFinite(Date.parse(p.inicio))) return "La fecha de inicio no es válida.";
  return null;
}

/** Números pseudoaleatorios reproducibles (mulberry32) con normal por Box-Muller. */
export function crearAzar(semilla: number) {
  let estado = semilla >>> 0;
  const u = () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  return { u, normal };
}

export interface ResultadoSimulacion {
  /** Tasas ocultas por insumo y servicio, en unidad del insumo por kg. */
  tasasVerdaderas: Record<string, Record<string, number>>;
  produccion: { servicioId: string; fecha: string; kg: number }[];
  conteos: { insumoId: string; fecha: string; cantidad: number }[];
  compras: { insumoId: string; fecha: string; cantidad: number }[];
}

const DIA = 86_400_000;
const redondear = (v: number, decimales = 2) => Math.round(v * 10 ** decimales) / 10 ** decimales;

export function generarSimulacion(entrada: { parametros: ParametrosSimulacion; tasas: Record<string, TasaServicio[]> }): ResultadoSimulacion {
  const error = validarParametrosSimulacion(entrada.parametros);
  if (error) throw new Error(error);
  const p = entrada.parametros;
  const azar = crearAzar(p.semilla);
  const insumos = Object.keys(entrada.tasas).filter((id) => entrada.tasas[id].length > 0).sort();
  const servicios = [...new Set(insumos.flatMap((id) => entrada.tasas[id].map((t) => t.servicioId)))].sort();
  if (!servicios.length) throw new Error("Define al menos una tasa antes de simular.");

  const tasasVerdaderas: ResultadoSimulacion["tasasVerdaderas"] = {};
  for (const id of insumos) {
    tasasVerdaderas[id] = {};
    for (const t of entrada.tasas[id]) tasasVerdaderas[id][t.servicioId] = Math.max(0, t.tasaInicial * (1 + p.desvioTasas * (2 * azar.u() - 1)));
  }
  // Participación de cada servicio en la producción, fija para toda la simulación.
  const pesos = servicios.map(() => 0.3 + azar.u());
  const sumaPesos = pesos.reduce((s, v) => s + v, 0);
  const kgMedio = (p.kgSemanalMin + p.kgSemanalMax) / 2;
  const consumoSemanal = Object.fromEntries(insumos.map((id) => [id, servicios.reduce((s, sv, k) => s + (kgMedio * pesos[k] / sumaPesos) * (tasasVerdaderas[id][sv] ?? 0), 0)]));

  const inicio = Date.parse(p.inicio);
  const fecha = (dias: number) => new Date(inicio + dias * DIA).toISOString();
  const stock: Record<string, number> = Object.fromEntries(insumos.map((id) => [id, Math.ceil(3 * consumoSemanal[id])]));
  const resultado: ResultadoSimulacion = { tasasVerdaderas, produccion: [], conteos: [], compras: [] };
  for (const id of insumos) resultado.conteos.push({ insumoId: id, fecha: fecha(0), cantidad: stock[id] });

  for (let semana = 0; semana < p.semanas; semana++) {
    const kgSemana = p.kgSemanalMin + (p.kgSemanalMax - p.kgSemanalMin) * azar.u();
    const reparto = Array.from({ length: 7 }, () => 0.6 + 0.8 * azar.u());
    const sumaReparto = reparto.reduce((s, v) => s + v, 0);
    // La mezcla de servicios cambia cada semana (más hoteles, más desmanchado…).
    // Sin esa variación el modelo solo podría aprender el consumo total.
    const pesosSemana = pesos.map((v) => v * (0.4 + 1.2 * azar.u()));
    const sumaSemana = pesosSemana.reduce((s, v) => s + v, 0);
    for (let d = 0; d < 7; d++) {
      const diaSim = semana * 7 + d;
      const kgDia = kgSemana * reparto[d] / sumaReparto;
      const kgServicio = servicios.map((_, k) => kgDia * (pesosSemana[k] / sumaSemana) * (0.8 + 0.4 * azar.u()));
      servicios.forEach((servicioId, k) => resultado.produccion.push({ servicioId, fecha: fecha(diaSim + 0.5), kg: redondear(kgServicio[k]) }));
      for (const id of insumos) {
        const esperado = servicios.reduce((s, sv, k) => s + redondear(kgServicio[k]) * (tasasVerdaderas[id][sv] ?? 0), 0);
        const consumo = esperado * Math.max(0, 1 + p.ruido * azar.normal());
        // Reposición por la mañana si el stock no cubre el día o baja de semana y media.
        if (stock[id] < consumo || stock[id] < 1.5 * consumoSemanal[id]) {
          const cantidad = Math.ceil(Math.max(3 * consumoSemanal[id], consumo));
          stock[id] += cantidad;
          resultado.compras.push({ insumoId: id, fecha: fecha(diaSim + 0.25), cantidad });
        }
        stock[id] -= consumo;
      }
    }
    for (const id of insumos) resultado.conteos.push({ insumoId: id, fecha: fecha((semana + 1) * 7), cantidad: redondear(stock[id]) });
  }
  return resultado;
}
