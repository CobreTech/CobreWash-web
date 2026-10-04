/** Data Connect puede serializar UUID sin guiones; el contrato impreso usa UUID canónico. */
export function normalizarCodigoQr(value?: string | null): string {
  const limpio = value?.trim().toLowerCase() ?? "";
  if (/^[0-9a-f]{32}$/.test(limpio)) return limpio.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(limpio)) {
    throw new Error("El código QR de la comanda es inválido o no está disponible.");
  }
  return limpio;
}

export function crearUrlSeguimiento(codigoQr?: string | null, baseUrl = process.env.NEXT_PUBLIC_SEGUIMIENTO_BASE_URL): string {
  if (!baseUrl?.trim()) throw new Error("Falta configurar el dominio de seguimiento para emitir el QR.");
  let base: URL;
  try { base = new URL(baseUrl.trim()); }
  catch { throw new Error("El dominio de seguimiento debe ser un origen HTTPS válido."); }
  if (base.protocol !== "https:" || base.username || base.password || base.pathname !== "/" || base.search || base.hash) {
    throw new Error("El dominio de seguimiento debe ser un origen HTTPS sin ruta, parámetros ni credenciales.");
  }
  const url = new URL("/seguimiento", base.origin);
  url.searchParams.set("qr", normalizarCodigoQr(codigoQr));
  return url.toString();
}

export function obtenerEnlaceSeguimiento(codigoQr?: string | null) {
  try { return { url: crearUrlSeguimiento(codigoQr), error: null }; }
  catch (error) { return { url: null, error: error instanceof Error ? error.message : "No se pudo generar el QR." }; }
}

export function normalizarNumeroComanda(value: string): string {
  const sufijo = value.trim().replace(/^(?:ELCOBRE|COBRE)-/i, "").toLowerCase();
  if (!/^[a-z0-9]{4}$/.test(sufijo)) throw new Error("Ingresa el número de comanda completo o su código de cuatro caracteres.");
  return `ELCOBRE-${sufijo}`;
}
