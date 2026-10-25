import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import sharp from "sharp";
import jsQR from "jsqr";
import QrInsumo from "./QrInsumo";
it("la etiqueta contiene el UUID original que acepta el escáner de insumos de Android", async () => {
  const codigoQr = "12345678-1234-4234-8234-123456789abc";
  const html = renderToStaticMarkup(createElement(QrInsumo, { insumo: { codigoQr, nombre: "Detergente industrial", unidadMedida: "L" }, cerrar() {} }));
  const svg = html.match(/<svg[^>]*><title>QR del insumo[\s\S]*?<\/svg>/)?.[0];
  expect(svg).toBeDefined();
  const { data, info } = await sharp(Buffer.from(svg!)).resize(360, 360).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data).toBe(codigoQr);
  expect(html).toContain("Descargar PDF para imprimir");
});
