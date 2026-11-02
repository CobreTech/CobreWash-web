"use client";

import { useState } from "react";

/**
 * Gráfico de líneas con un solo eje Y (todas las series en la misma unidad).
 * Crosshair con tooltip que lista todas las series en el punto, leyenda con
 * clave de línea, etiqueta directa en el último valor y vista de tabla.
 * Colores validados para contraste y daltonismo en modo claro y oscuro.
 */

export interface Serie {
  nombre: string;
  /** Clases de color de texto (el trazo usa currentColor). */
  color: string;
}

export const COLORES_SERIE = {
  naranja: "text-[#ea580c]",
  azul: "text-[#0369a1] dark:text-[#0284c7]",
} as const;

const ANCHO = 640, ALTO = 220, IZQ = 44, DER = 64, ARR = 12, ABA = 30;

function tope(maximo: number) {
  if (maximo <= 0) return 1;
  const paso = 10 ** Math.floor(Math.log10(maximo));
  return Math.ceil(maximo / paso) * paso;
}

export default function GraficoLineas({ titulo, etiquetaX, puntos, series, formato }: {
  titulo: string;
  etiquetaX: string;
  puntos: { x: string; valores: (number | null)[] }[];
  series: Serie[];
  formato: (v: number) => string;
}) {
  const [activo, setActivo] = useState<number | null>(null);
  if (!puntos.length) return null;
  const maximo = tope(Math.max(0, ...puntos.flatMap((p) => p.valores.filter((v): v is number => v !== null))));
  const ancho = ANCHO - IZQ - DER, alto = ALTO - ARR - ABA;
  const x = (i: number) => IZQ + (puntos.length === 1 ? ancho / 2 : (i / (puntos.length - 1)) * ancho);
  const y = (v: number) => ARR + alto - (v / maximo) * alto;
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maximo);
  const pasoEtiquetaX = Math.max(1, Math.ceil(puntos.length / 8));

  const trazo = (s: number) => {
    let d = "", abierto = false;
    puntos.forEach((p, i) => {
      const v = p.valores[s];
      if (v === null) { abierto = false; return; }
      d += `${abierto ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      abierto = true;
    });
    return d;
  };
  const ultimo = (s: number) => {
    for (let i = puntos.length - 1; i >= 0; i--) if (puntos[i].valores[s] !== null) return i;
    return -1;
  };

  const mover = (e: React.PointerEvent<SVGRectElement>) => {
    const caja = e.currentTarget.getBoundingClientRect();
    const relativo = ((e.clientX - caja.left) / caja.width) * ancho;
    setActivo(Math.max(0, Math.min(puntos.length - 1, Math.round((relativo / ancho) * (puntos.length - 1)))));
  };
  const teclado = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setActivo((a) => Math.max(0, Math.min(puntos.length - 1, (a ?? 0) + (e.key === "ArrowRight" ? 1 : -1))));
  };

  return (
    <figure className="space-y-2">
      {series.length > 1 && (
        <figcaption className="flex flex-wrap gap-4 text-xs text-stone-600 dark:text-stone-300">
          {series.map((s) => (
            <span key={s.nombre} className="inline-flex items-center gap-2">
              <svg width="18" height="4" aria-hidden className={s.color}><line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {s.nombre}
            </span>
          ))}
        </figcaption>
      )}
      <div className="relative">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label={titulo} tabIndex={0} onKeyDown={teclado}
          onBlur={() => setActivo(null)} className="w-full overflow-visible rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {marcas.map((m) => (
            <g key={m}>
              <line x1={IZQ} x2={ANCHO - DER} y1={y(m)} y2={y(m)} className="stroke-stone-200 dark:stroke-white/10" strokeWidth="1" />
              <text x={IZQ - 8} y={y(m)} dy="0.32em" textAnchor="end" className="fill-stone-400 text-[11px]">{formato(m)}</text>
            </g>
          ))}
          {puntos.map((p, i) => (i % pasoEtiquetaX === 0 || i === puntos.length - 1) && (
            <text key={p.x} x={x(i)} y={ALTO - ABA + 16} textAnchor="middle" className="fill-stone-400 text-[11px]">{p.x}</text>
          ))}
          <text x={IZQ + ancho / 2} y={ALTO - 2} textAnchor="middle" className="fill-stone-500 text-[11px] font-semibold">{etiquetaX}</text>
          {activo !== null && <line x1={x(activo)} x2={x(activo)} y1={ARR} y2={ARR + alto} className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="1" />}
          {series.map((s, k) => {
            const u = ultimo(k);
            return (
              <g key={s.nombre} className={s.color}>
                <path d={trazo(k)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {u >= 0 && (
                  <>
                    <circle cx={x(u)} cy={y(puntos[u].valores[k]!)} r="4" fill="currentColor" className="stroke-white dark:stroke-stone-900" strokeWidth="2" />
                    <text x={x(u) + 8} y={y(puntos[u].valores[k]!)} dy="0.32em" className="fill-stone-700 text-[11px] font-bold dark:fill-stone-200">{formato(puntos[u].valores[k]!)}</text>
                  </>
                )}
                {activo !== null && puntos[activo].valores[k] !== null && (
                  <circle cx={x(activo)} cy={y(puntos[activo].valores[k]!)} r="5" fill="currentColor" className="stroke-white dark:stroke-stone-900" strokeWidth="2" />
                )}
              </g>
            );
          })}
          <rect x={IZQ} y={ARR} width={ancho} height={alto} fill="transparent" onPointerMove={mover} onPointerLeave={() => setActivo(null)} />
        </svg>
        {activo !== null && (
          <div
            role="status"
            className="pointer-events-none absolute top-1 z-10 min-w-36 -translate-x-1/2 rounded-xl border border-stone-200 bg-white/95 px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-stone-900/95"
            style={{ left: `${(x(activo) / ANCHO) * 100}%` }}
          >
            <p className="mb-1 text-[11px] text-stone-400">{etiquetaX}: {puntos[activo].x}</p>
            {series.map((s, k) => (
              <p key={s.nombre} className="flex items-center gap-2">
                <svg width="12" height="4" aria-hidden className={s.color}><line x1="0" y1="2" x2="12" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <strong className="text-stone-900 dark:text-white">{puntos[activo].valores[k] === null ? "—" : formato(puntos[activo].valores[k]!)}</strong>
                <span className="text-stone-500 dark:text-stone-400">{s.nombre}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <details className="text-xs text-stone-500">
        <summary className="cursor-pointer font-semibold">Ver como tabla</summary>
        <table className="mt-2 w-full text-left">
          <thead className="text-stone-400"><tr><th className="py-1 pr-3">{etiquetaX}</th>{series.map((s) => <th key={s.nombre} className="py-1 pr-3">{s.nombre}</th>)}</tr></thead>
          <tbody>
            {puntos.map((p) => (
              <tr key={p.x} className="border-t border-stone-100 dark:border-white/5">
                <td className="py-1 pr-3">{p.x}</td>
                {p.valores.map((v, k) => <td key={k} className="py-1 pr-3">{v === null ? "—" : formato(v)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
