import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import sharp from "sharp";
import jsQR from "jsqr";
import QrCode from "./QrCode";
import { crearUrlSeguimiento } from "@/lib/seguimiento/qr";

it("un lector independiente decodifica el SVG usado en detalle e impresión", async () => {
  const url = crearUrlSeguimiento("12345678-1234-4234-8234-123456789abc", "https://lavanderia-elcobre.vercel.app");
  const markup = renderToStaticMarkup(createElement(QrCode, { value: url, size: 160 }));
  const svg = markup.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  expect(svg).toBeDefined();
  // 35 mm a 203 dpi (impresora térmica común), incluido el margen blanco.
  const { data, info } = await sharp(Buffer.from(svg!)).resize(280, 280).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data).toBe(url);
});
