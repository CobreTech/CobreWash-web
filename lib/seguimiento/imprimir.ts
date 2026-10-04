let limpiarImpresionAnterior: (() => void) | null = null;

/** El tamaño CSS es una solicitud; la impresora puede exigir su papel habitual. */
export function imprimirComprobante(ticket: HTMLElement) {
  const ancho = ticket.offsetWidth;
  const alto = Math.max(ticket.offsetHeight, ticket.scrollHeight) + 1;
  if (!ancho || alto <= 1) throw new Error("No se pudo medir el comprobante para imprimirlo.");

  limpiarImpresionAnterior?.();
  const estilo = document.createElement("style");
  estilo.dataset.comprobanteImpresion = "true";
  // CSS usa 96 px por pulgada. Un píxel extra evita otra página por redondeo.
  const mm = (px: number) => Math.ceil(px * 25.4 / 96 * 100) / 100;
  estilo.textContent = `
    @page { size: ${mm(ancho)}mm ${mm(alto)}mm; margin: 0; }
    @media print {
      .comprobante-contenedor { width: ${ancho}px !important; }
    }
  `;
  const limpiar = () => {
    estilo.remove();
    window.removeEventListener("afterprint", limpiar);
    if (limpiarImpresionAnterior === limpiar) limpiarImpresionAnterior = null;
  };
  limpiarImpresionAnterior = limpiar;
  window.addEventListener("afterprint", limpiar);
  document.head.append(estilo);
  try { window.print(); }
  catch (error) { limpiar(); throw error; }
}
