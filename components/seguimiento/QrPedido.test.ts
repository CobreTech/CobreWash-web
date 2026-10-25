import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import sharp from "sharp";
import jsQR from "jsqr";
import QrPedido from "./QrPedido";
afterEach(() => vi.unstubAllEnvs());
it("el QR visible decodifica el código persistido de la comanda y el dominio oficial", async () => {
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
  const html = renderToStaticMarkup(createElement(QrPedido, { codigoQr: "12345678123442348234123456789abc", numeroComanda: "ELCOBRE-real" }));
  const svg = html.match(/<svg[^>]*><title>Escanea para seguir tu pedido<\/title>[\s\S]*?<\/svg>/)?.[0];
  expect(svg).toBeDefined();
  const { data, info } = await sharp(Buffer.from(svg!)).resize(360, 360).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const url = "https://lavanderia-elcobre.vercel.app/seguimiento?qr=12345678-1234-4234-8234-123456789abc";
  expect(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data).toBe(url);
  expect(html).toContain(`href="${url}"`);
});
it.each([undefined, "inválido"])("no inventa un QR cuando el código es %s", codigoQr => {
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
  const html = renderToStaticMarkup(createElement(QrPedido, { codigoQr, numeroComanda: "ELCOBRE-real" }));
  expect(html).not.toContain("Escanea para seguir tu pedido"); expect(html).toContain("no está disponible");
});
it("no usa el dominio de la vista previa cuando falta configurar el oficial", () => {
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "");
  const html = renderToStaticMarkup(createElement(QrPedido, { codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-real" }));
  expect(html).not.toContain("Escanea para seguir tu pedido"); expect(html).not.toContain("Abrir seguimiento");
});
