/**
 * Mínimos cuadrados no negativos (Lawson–Hanson) en forma de Gram:
 * minimiza ½·θᵀGθ − hᵀθ con θ ≥ 0, que equivale a min ||Xθ − y||² cuando
 * G = XᵀX y h = Xᵀy. Trabajar con G permite sumar la regularización sin
 * construir la matriz aumentada. Pensado para pocas variables (servicios).
 */

/** Resuelve A·x = b por eliminación gaussiana con pivoteo parcial. Null si es singular. */
export function resolverSistema(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((fila, i) => [...fila, b[i]]);
  const escala = Math.max(1e-300, ...A.map((fila) => Math.max(...fila.map(Math.abs))));
  for (let col = 0; col < n; col++) {
    let pivote = col;
    for (let f = col + 1; f < n; f++) if (Math.abs(M[f][col]) > Math.abs(M[pivote][col])) pivote = f;
    if (Math.abs(M[pivote][col]) <= 1e-12 * escala) return null;
    [M[col], M[pivote]] = [M[pivote], M[col]];
    for (let f = col + 1; f < n; f++) {
      const factor = M[f][col] / M[col][col];
      for (let c = col; c <= n; c++) M[f][c] -= factor * M[col][c];
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let f = n - 1; f >= 0; f--) {
    let suma = M[f][n];
    for (let c = f + 1; c < n; c++) suma -= M[f][c] * x[c];
    x[f] = suma / M[f][f];
  }
  return x;
}

/** Resuelve el subsistema de las variables libres; las demás quedan en cero. */
function resolverLibres(G: number[][], h: number[], libres: boolean[]): number[] {
  const idx = libres.flatMap((libre, i) => (libre ? [i] : []));
  const s = new Array<number>(h.length).fill(0);
  if (!idx.length) return s;
  const sub = idx.map((i) => idx.map((j) => G[i][j]));
  let x = resolverSistema(sub, idx.map((i) => h[i]));
  if (!x) {
    // Columnas colineales: un empujón mínimo en la diagonal elige la solución de menor norma.
    const traza = idx.reduce((t, i) => t + G[i][i], 0) / idx.length || 1;
    x = resolverSistema(sub.map((fila, a) => fila.map((v, b) => (a === b ? v + 1e-9 * traza : v))), idx.map((i) => h[i])) ?? idx.map(() => 0);
  }
  idx.forEach((i, k) => (s[i] = x![k]));
  return s;
}

export function nnlsGram(G: number[][], h: number[]): number[] {
  const n = h.length;
  const x = new Array<number>(n).fill(0);
  const libres = new Array<boolean>(n).fill(false);
  const tol = 1e-10 * Math.max(1, ...h.map(Math.abs));
  const gradiente = () => h.map((hi, i) => hi - G[i].reduce((s, g, j) => s + g * x[j], 0));
  let w = gradiente();
  let iter = 0;
  const maxIter = 30 * Math.max(1, n);

  while (iter++ < maxIter) {
    let j = -1;
    for (let i = 0; i < n; i++) if (!libres[i] && w[i] > tol && (j < 0 || w[i] > w[j])) j = i;
    if (j < 0) break;
    libres[j] = true;
    let s = resolverLibres(G, h, libres);
    if (s[j] <= 0) {
      // El candidato no mejora la solución por precisión numérica: se descarta.
      libres[j] = false;
      w[j] = 0;
      continue;
    }
    while (libres.some((libre, i) => libre && s[i] <= 0) && iter++ < maxIter) {
      let alfa = Infinity;
      for (let i = 0; i < n; i++) if (libres[i] && s[i] <= 0) alfa = Math.min(alfa, x[i] / (x[i] - s[i]));
      for (let i = 0; i < n; i++) {
        x[i] += alfa * (s[i] - x[i]);
        if (libres[i] && x[i] <= 1e-15) { libres[i] = false; x[i] = 0; }
      }
      s = resolverLibres(G, h, libres);
    }
    for (let i = 0; i < n; i++) x[i] = libres[i] ? s[i] : 0;
    w = gradiente();
  }
  return x.map((v) => Math.max(0, v));
}
