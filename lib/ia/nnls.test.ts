import { describe, expect, it } from "vitest";
import { nnlsGram, resolverSistema } from "./nnls";

const objetivo = (G: number[][], h: number[], x: number[]) =>
  0.5 * x.reduce((s, xi, i) => s + xi * G[i].reduce((t, g, j) => t + g * x[j], 0), 0) - h.reduce((s, hi, i) => s + hi * x[i], 0);

/** Solución de referencia: prueba todos los subconjuntos de variables libres. */
function porFuerzaBruta(G: number[][], h: number[]) {
  const n = h.length;
  let mejor = new Array(n).fill(0), valor = 0;
  for (let mascara = 1; mascara < 1 << n; mascara++) {
    const idx = [...Array(n).keys()].filter((i) => mascara & (1 << i));
    const s = resolverSistema(idx.map((i) => idx.map((j) => G[i][j])), idx.map((i) => h[i]));
    if (!s || s.some((v) => v < 0)) continue;
    const x = new Array(n).fill(0);
    idx.forEach((i, k) => (x[i] = s[k]));
    if (objetivo(G, h, x) < valor) { valor = objetivo(G, h, x); mejor = x; }
  }
  return mejor;
}

function aleatorio(semilla: number) {
  return () => { semilla = (semilla * 1664525 + 1013904223) % 2 ** 32; return semilla / 2 ** 32; };
}

describe("resolución de sistemas lineales", () => {
  it("resuelve con pivoteo cuando el primer pivote es cero", () => {
    expect(resolverSistema([[0, 1], [1, 0]], [2, 3])).toEqual([3, 2]);
  });
  it("informa sistemas singulares", () => {
    expect(resolverSistema([[1, 2], [2, 4]], [1, 2])).toBeNull();
  });
});

describe("mínimos cuadrados no negativos", () => {
  it("coincide con mínimos cuadrados cuando la solución ya es positiva", () => {
    const x = nnlsGram([[2, 0], [0, 4]], [2, 8]);
    expect(x[0]).toBeCloseTo(1); expect(x[1]).toBeCloseTo(2);
  });
  it("lleva a cero las variables que serían negativas y reajusta las demás", () => {
    // Sin restricción la solución sería [-1, 3].
    const x = nnlsGram([[2, 1], [1, 1]], [1, 2]);
    expect(x[0]).toBe(0); expect(x[1]).toBeCloseTo(2);
  });
  it("devuelve ceros si ninguna variable ayuda", () => {
    expect(nnlsGram([[1, 0], [0, 1]], [-1, -2])).toEqual([0, 0]);
    expect(nnlsGram([], [])).toEqual([]);
  });
  it("tolera columnas idénticas sin romperse", () => {
    const x = nnlsGram([[1, 1], [1, 1]], [1, 1]);
    expect(x.every((v) => v >= 0)).toBe(true);
    expect(x[0] + x[1]).toBeCloseTo(1);
  });
  it("encuentra el óptimo en problemas aleatorios igual que la búsqueda exhaustiva", () => {
    const azar = aleatorio(7);
    for (let caso = 0; caso < 200; caso++) {
      const n = 1 + Math.floor(azar() * 4), filas = n + 2;
      const X = Array.from({ length: filas }, () => Array.from({ length: n }, () => azar() * 10 - 3));
      const y = Array.from({ length: filas }, () => azar() * 10 - 5);
      const G = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (__, j) => X.reduce((s, f) => s + f[i] * f[j], 0)));
      const h = Array.from({ length: n }, (_, i) => X.reduce((s, f, p) => s + f[i] * y[p], 0));
      const x = nnlsGram(G, h);
      expect(x.every((v) => v >= 0)).toBe(true);
      expect(objetivo(G, h, x)).toBeCloseTo(objetivo(G, h, porFuerzaBruta(G, h)), 6);
    }
  });
});
