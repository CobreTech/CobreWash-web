export type FormatoComanda = "png" | "pdf";

const ANCHO = 1200, ALTO = 1600;

async function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    const timer = window.setTimeout(() => terminar(new Error("La imagen tardó demasiado en cargar")), 15_000);
    function terminar(error?: Error) {
      window.clearTimeout(timer);
      imagen.onload = imagen.onerror = null;
      if (error) reject(error); else resolve(imagen);
    }
    imagen.onload = () => terminar();
    imagen.onerror = () => terminar(new Error("No se pudo preparar la imagen"));
    imagen.src = src;
  });
}

/** Render propio: usa únicamente el QR visible y el número, nunca datos privados del cliente. */
export async function crearTarjetaComanda(svg: SVGSVGElement, numeroComanda: string): Promise<HTMLCanvasElement> {
  await document.fonts?.ready;
  const estilos = getComputedStyle(document.documentElement);
  const titulo = estilos.getPropertyValue("--font-outfit").trim() || "sans-serif";
  const cuerpo = estilos.getPropertyValue("--font-inter").trim() || "sans-serif";
  await Promise.all([document.fonts?.load(`800 58px ${titulo}`), document.fonts?.load(`400 24px ${cuerpo}`)]);
  const qrExportado = svg.cloneNode(true) as SVGSVGElement;
  qrExportado.setAttribute("width", "600"); qrExportado.setAttribute("height", "600");
  const archivoQr = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(qrExportado)], { type: "image/svg+xml;charset=utf-8" }));
  let logo: HTMLImageElement, qr: HTMLImageElement;
  try { [logo, qr] = await Promise.all([cargarImagen("/logo.webp"), cargarImagen(archivoQr)]); }
  finally { URL.revokeObjectURL(archivoQr); }

  const lienzo = document.createElement("canvas");
  lienzo.width = ANCHO; lienzo.height = ALTO;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la descarga");
  const fondo = ctx.createLinearGradient(0, 0, ANCHO, ALTO);
  fondo.addColorStop(0, "#fff7ed"); fondo.addColorStop(0.48, "#fdfcfb"); fondo.addColorStop(1, "#fdf8f5");
  ctx.fillStyle = fondo; ctx.fillRect(0, 0, ANCHO, ALTO);
  const brillo = ctx.createRadialGradient(1080, 60, 0, 1080, 60, 680);
  brillo.addColorStop(0, "#fed7aa70"); brillo.addColorStop(1, "#fed7aa00");
  ctx.fillStyle = brillo; ctx.fillRect(0, 0, ANCHO, ALTO);
  function texto(valor: string, x: number, y: number, tamano: number, color = "#1c1917", peso = 400, fuente = cuerpo, ancho?: number) {
    ctx!.fillStyle = color; ctx!.font = `${peso} ${tamano}px ${fuente}`;
    ctx!.fillText(valor, x, y, ancho);
  }
  function caja(x: number, y: number, ancho: number, alto: number, radio: number, color: string) {
    ctx!.fillStyle = color; ctx!.beginPath(); ctx!.roundRect(x, y, ancho, alto, radio); ctx!.fill();
  }
  ctx.drawImage(logo, 96, 88, 94, 94);
  texto("Lavandería", 214, 123, 31, "#1c1917", 700, titulo);
  texto("El Cobre", 214, 172, 47, "#ea580c", 800, titulo);
  ctx.textAlign = "right"; texto("CALAMA · CHILE", 1104, 142, 18, "#9a3412", 600); ctx.textAlign = "left";
  const cobre = ctx.createLinearGradient(96, 0, 260, 0);
  cobre.addColorStop(0, "#f97316"); cobre.addColorStop(1, "#cc4114");
  ctx.fillStyle = cobre; ctx.fillRect(96, 235, 140, 7);
  texto("SEGUIMIENTO DE TU PEDIDO", 96, 310, 20, "#c2410c", 700);
  texto(numeroComanda, 96, 388, 64, "#1c1917", 800, titulo, 1008);
  texto("Conserva tu comanda y consulta su recorrido.", 96, 440, 25, "#78716c");

  ctx.shadowColor = "#9a341218"; ctx.shadowBlur = 48; ctx.shadowOffsetY = 12;
  caja(80, 500, 1040, 820, 44, "#ffffff");
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.textAlign = "center";
  texto("TU COMANDA, SIEMPRE A MANO", 600, 565, 19, "#a8a29e", 600);
  // El SVG original conserva su margen blanco y contraste; no se coloca el logo sobre el código.
  ctx.drawImage(qr, 300, 600, 600, 600);
  texto("Escanea para seguir tu pedido", 600, 1246, 31, "#1c1917", 700, titulo);
  texto("El mismo seguimiento, cuando lo necesites.", 600, 1288, 21, "#78716c");
  texto("Comparte este QR solo con personas autorizadas.", 600, 1410, 21, "#78716c");
  texto("Permite consultar el seguimiento público de tu pedido.", 600, 1446, 21, "#78716c");
  texto("Gracias por confiar en Lavandería El Cobre", 600, 1520, 24, "#c2410c", 600, titulo);
  ctx.fillStyle = cobre; ctx.fillRect(0, 1576, ANCHO, 24);
  return lienzo;
}

export async function exportarComandaQr(svg: SVGSVGElement, numeroComanda: string, formato: FormatoComanda): Promise<void> {
  const lienzo = await crearTarjetaComanda(svg, numeroComanda);
  let contenido: Blob;
  if (formato === "pdf") {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: [148, 148 * ALTO / ANCHO], compress: true });
    doc.setProperties({ title: `Seguimiento ${numeroComanda}`, author: "Lavandería El Cobre", subject: "Comanda de seguimiento" });
    doc.addImage(lienzo.toDataURL("image/png"), "PNG", 0, 0, 148, 148 * ALTO / ANCHO);
    contenido = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
  } else {
    contenido = await new Promise<Blob>((resolve, reject) => lienzo.toBlob(blob => blob ? resolve(blob) : reject(new Error("No se pudo crear la imagen")), "image/png"));
  }
  const url = URL.createObjectURL(contenido);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `comanda-${numeroComanda.replace(/[^a-z0-9_-]/gi, "").slice(0, 64) || "pedido"}.${formato}`;
  document.body.appendChild(enlace);
  try { enlace.click(); }
  finally { enlace.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 60_000); }
}
