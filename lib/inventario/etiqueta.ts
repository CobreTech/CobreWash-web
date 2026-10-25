export async function exportarEtiquetaInsumo(svg: SVGSVGElement, insumo: { nombre: string; codigoQr: string; unidadMedida: string }, formato: "png" | "pdf") {
  await document.fonts?.ready;
  const copia = svg.cloneNode(true) as SVGSVGElement;
  copia.setAttribute("width", "800"); copia.setAttribute("height", "800");
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copia)], { type: "image/svg+xml;charset=utf-8" }));
  const imagen = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => { imagen.onload = imagen.onerror = null; reject(new Error("No se pudo preparar el QR")); }, 15000);
      imagen.onload = () => { window.clearTimeout(timer); resolve(); };
      imagen.onerror = () => { window.clearTimeout(timer); reject(new Error("No se pudo preparar el QR")); };
      imagen.src = url;
    });
  } finally { URL.revokeObjectURL(url); }
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la etiqueta");
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1200, 1440);
  ctx.fillStyle = "#ea580c"; ctx.fillRect(0, 0, 1200, 16);
  ctx.textAlign = "center"; ctx.fillStyle = "#c2410c"; ctx.font = "700 32px sans-serif";
  ctx.fillText("LAVANDERÍA EL COBRE", 600, 108);
  ctx.fillStyle = "#78716c"; ctx.font = "600 23px sans-serif"; ctx.fillText("INVENTARIO · ETIQUETA DE INSUMO", 600, 164);
  ctx.fillStyle = "#1c1917"; ctx.font = "700 48px sans-serif";
  const palabras = insumo.nombre.split(/\s+/); const lineas: string[] = []; let linea = "";
  for (const palabra of palabras) {
    if (linea && ctx.measureText(`${linea} ${palabra}`).width > 1000) { lineas.push(linea); linea = palabra; }
    else linea = linea ? `${linea} ${palabra}` : palabra;
  }
  if (linea) lineas.push(linea);
  lineas.slice(0, 3).forEach((l, i) => ctx.fillText(l, 600, 246 + i * 57, 1050));
  ctx.drawImage(imagen, 200, 405, 800, 800);
  ctx.fillStyle = "#1c1917"; ctx.font = "600 27px sans-serif"; ctx.fillText("Escanea desde el inventario de la app", 600, 1254);
  ctx.fillStyle = "#78716c"; ctx.font = "24px monospace"; ctx.fillText(insumo.codigoQr, 600, 1312);
  ctx.font = "23px sans-serif"; ctx.fillText(`Unidad: ${insumo.unidadMedida}`, 600, 1366);
  let archivo: Blob;
  if (formato === "pdf") {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: [100, 120], compress: true });
    pdf.setProperties({ title: `Insumo ${insumo.nombre}`, author: "Lavandería El Cobre" });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 100, 120);
    archivo = pdf.output("blob");
  } else archivo = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("No se pudo preparar la imagen")), "image/png"));
  const descarga = URL.createObjectURL(archivo);
  const enlace = document.createElement("a"); enlace.href = descarga;
  enlace.download = `insumo-${insumo.codigoQr}.${formato}`;
  document.body.appendChild(enlace); enlace.click(); enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(descarga), 1000);
}
