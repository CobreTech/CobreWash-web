"use client";

/**
 * Código QR de maqueta (placeholder visual). No codifica datos reales: genera
 * un patrón determinista a partir del texto para que cada comanda tenga su
 * "QR" estable y reconocible. Es SVG puro, sin dependencias externas.
 */

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID = 25; // módulos por lado

function enFinder(row: number, col: number): boolean {
  const inBox = (r0: number, c0: number) =>
    row >= r0 && row < r0 + 7 && col >= c0 && col < c0 + 7;
  // Zona reservada (finder + separador) en las 3 esquinas.
  const inZone = (r0: number, c0: number) =>
    row >= r0 - 1 && row < r0 + 8 && col >= c0 - 1 && col < c0 + 8;
  return (
    inZone(0, 0) ||
    inZone(0, GRID - 7) ||
    inZone(GRID - 7, 0) ||
    inBox(0, 0) ||
    inBox(0, GRID - 7) ||
    inBox(GRID - 7, 0)
  );
}

function moduloFinder(row: number, col: number): boolean {
  // Dibuja el patrón de posición 7x7 (marco + centro 3x3).
  const dibujar = (r0: number, c0: number): boolean | null => {
    if (row < r0 || row >= r0 + 7 || col < c0 || col >= c0 + 7) return null;
    const r = row - r0;
    const c = col - c0;
    const borde = r === 0 || r === 6 || c === 0 || c === 6;
    const centro = r >= 2 && r <= 4 && c >= 2 && c <= 4;
    return borde || centro;
  };
  return (
    dibujar(0, 0) ??
    dibujar(0, GRID - 7) ??
    dibujar(GRID - 7, 0) ??
    false
  );
}

export default function QrCode({
  value,
  size = 140,
  className = "",
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const rand = mulberry32(hashString(value));
  const cells: { r: number; c: number }[] = [];

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (enFinder(r, c)) {
        if (moduloFinder(r, c)) cells.push({ r, c });
      } else if (rand() > 0.5) {
        cells.push({ r, c });
      }
    }
  }

  const cell = size / GRID;

  return (
    <div
      className={`inline-block rounded-xl bg-white p-2 ${className}`}
      role="img"
      aria-label={`Código QR de ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="crispEdges"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map(({ r, c }) => (
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill="#1c1917"
          />
        ))}
      </svg>
    </div>
  );
}
