import { limitesFechasConsulta } from "@/lib/reportes/fechas";

/**
 * Lectura y validación de CSV de conteos físicos o compras antes de guardar.
 *
 * Columnas requeridas (en cualquier orden): insumo, cantidad, fecha.
 * - Separador ";" (Excel en español), "," o tabulación.
 * - Cantidad con coma decimal ("12,5") o punto ("12.5"); "1.234" se lee como mil.
 * - Fecha AAAA-MM-DD o DD-MM-AAAA / DD/MM/AAAA, con hora HH:MM opcional, en
 *   hora de Chile. Sin hora, un conteo se asume al cierre del día y una
 *   compra a mediodía, para que la compra quede antes del conteo de ese día.
 */

export type TipoCsv = "conteos" | "compras";

export interface FilaCsv {
  linea: number;
  insumoId: string;
  insumoNombre: string;
  cantidad: number;
  fecha: string;
}

export interface ErrorCsv {
  linea: number;
  mensaje: string;
}

export const MAXIMO_FILAS_CSV = 2000;
const MAXIMO_CANTIDAD = 9_999_999_999.99;

export const normalizarTexto = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase().replace(/\s+/g, " ");

/** Separa una línea respetando comillas dobles ("" es una comilla literal). */
export function separarLinea(linea: string, separador: string): string[] {
  const campos: string[] = [];
  let actual = "", comillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i++; }
      else if (c === '"') comillas = false;
      else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === separador) { campos.push(actual); actual = ""; }
    else actual += c;
  }
  campos.push(actual);
  return campos.map((v) => v.trim());
}

export function leerCantidad(valor: string): number | null {
  let v = valor.replace(/\s/g, "");
  if (!/^-?[\d.,]+$/.test(v)) return null;
  if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
  const n = Number(v);
  return Number.isFinite(n) && v.split(".").length <= 2 ? n : null;
}

/** Convierte una fecha del CSV (hora de Chile) a ISO UTC. */
export function leerFecha(valor: string, tipo: TipoCsv): string | null {
  const m = valor.trim().match(/^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})[-/](\d{2})[-/](\d{4}))(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) return null;
  const dia = m[1] ? `${m[1]}-${m[2]}-${m[3]}` : `${m[6]}-${m[5]}-${m[4]}`;
  let inicio: string | undefined;
  try { inicio = limitesFechasConsulta(dia, dia).fechaDesde; } catch { return null; }
  const [h, min, s] = m[7] !== undefined
    ? [Number(m[7]), Number(m[8]), Number(m[9] ?? 0)]
    : tipo === "conteos" ? [23, 59, 59] : [12, 0, 0];
  if (h > 23 || min > 59 || s > 59) return null;
  return new Date(Date.parse(inicio!) + ((h * 60 + min) * 60 + s) * 1000).toISOString();
}

export function leerCsv(texto: string, tipo: TipoCsv, insumos: { id: string; nombre: string }[], ahora = new Date()) {
  const filas: FilaCsv[] = [];
  const errores: ErrorCsv[] = [];
  const lineas = texto.replace(/^﻿/, "").split(/\r?\n/).map((contenido, i) => ({ contenido, linea: i + 1 })).filter((l) => l.contenido.trim());
  if (!lineas.length) return { filas, errores: [{ linea: 1, mensaje: "El archivo está vacío." }] };

  const encabezado = lineas[0].contenido;
  const separador = encabezado.includes(";") ? ";" : encabezado.includes("\t") ? "\t" : ",";
  const columnas = separarLinea(encabezado, separador).map(normalizarTexto);
  const indice = { insumo: columnas.indexOf("insumo"), cantidad: columnas.indexOf("cantidad"), fecha: columnas.indexOf("fecha") };
  const faltantes = Object.entries(indice).filter(([, i]) => i < 0).map(([nombre]) => nombre);
  if (faltantes.length) return { filas, errores: [{ linea: lineas[0].linea, mensaje: `Faltan columnas: ${faltantes.join(", ")}. El encabezado debe incluir insumo, cantidad y fecha.` }] };
  if (lineas.length - 1 > MAXIMO_FILAS_CSV) return { filas, errores: [{ linea: 1, mensaje: `El archivo supera el máximo de ${MAXIMO_FILAS_CSV.toLocaleString("es-CL")} filas.` }] };

  const porNombre = new Map(insumos.map((i) => [normalizarTexto(i.nombre), i]));
  const vistos = new Set<string>();
  for (const { contenido, linea } of lineas.slice(1)) {
    const campos = separarLinea(contenido, separador);
    const problemas: string[] = [];
    const insumo = porNombre.get(normalizarTexto(campos[indice.insumo] ?? ""));
    if (!insumo) problemas.push(`Insumo "${campos[indice.insumo] ?? ""}" no existe o está inactivo`);
    const cantidad = leerCantidad(campos[indice.cantidad] ?? "");
    if (cantidad === null) problemas.push("Cantidad inválida");
    else if (tipo === "compras" ? cantidad <= 0 : cantidad < 0) problemas.push(tipo === "compras" ? "La cantidad comprada debe ser mayor que cero" : "La cantidad contada no puede ser negativa");
    else if (cantidad > MAXIMO_CANTIDAD) problemas.push("Cantidad demasiado grande");
    const fecha = leerFecha(campos[indice.fecha] ?? "", tipo);
    if (!fecha) problemas.push("Fecha inválida (usa AAAA-MM-DD o DD-MM-AAAA, con hora HH:MM opcional)");
    else if (Date.parse(fecha) > ahora.getTime()) problemas.push("La fecha está en el futuro");
    if (!problemas.length) {
      const clave = `${insumo!.id}|${fecha}`;
      if (vistos.has(clave)) problemas.push(`Fila repetida: ya hay ${tipo === "conteos" ? "un conteo" : "una compra"} de ese insumo en la misma fecha y hora`);
      vistos.add(clave);
    }
    if (problemas.length) errores.push({ linea, mensaje: problemas.join(". ") + "." });
    else filas.push({ linea, insumoId: insumo!.id, insumoNombre: insumo!.nombre, cantidad: cantidad!, fecha: fecha! });
  }
  return { filas, errores };
}
