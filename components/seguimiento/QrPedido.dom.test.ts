// @vitest-environment jsdom
import { Blob as NodeBlob } from "node:buffer";
import { createElement } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QrPedido from "./QrPedido";
const crear = vi.fn(), revocar = vi.fn();
beforeEach(() => {
  vi.useFakeTimers(); crear.mockReset(); revocar.mockReset();
  const OriginalURL = globalThis.URL;
  class URLPrueba extends OriginalURL { static createObjectURL = crear; static revokeObjectURL = revocar; }
  vi.stubGlobal("URL", URLPrueba); vi.stubGlobal("Blob", NodeBlob);
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
it("descarga un SVG del QR mostrado, con nombre de comanda y liberación del archivo temporal", async () => {
  crear.mockReturnValue("blob:qr-de-prueba");
  let nombre = "";
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) { nombre = this.download; });
  render(createElement(QrPedido, { codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-14r3" }));
  fireEvent.click(screen.getByRole("button", { name: "Descargar QR" }));
  expect(nombre).toBe("qr-ELCOBRE-14r3.svg");
  const svg = await (crear.mock.calls[0][0] as NodeBlob).text();
  expect(svg).toContain("<svg"); expect(svg).toContain("Escanea para seguir tu pedido");
  await act(() => vi.advanceTimersByTimeAsync(1000)); expect(revocar).toHaveBeenCalledWith("blob:qr-de-prueba");
});
it("si falla la descarga mantiene el enlace de seguimiento y muestra un error real", () => {
  crear.mockImplementation(() => { throw new Error("Sin permiso"); });
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  render(createElement(QrPedido, { codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-14r3" }));
  fireEvent.click(screen.getByRole("button", { name: "Descargar QR" }));
  expect(screen.getByRole("alert").textContent).toContain("No pudimos descargar");
  expect(screen.getByRole("link", { name: "Abrir seguimiento" }).getAttribute("href")).toContain("qr=12345678");
  expect(click).not.toHaveBeenCalled();
});
