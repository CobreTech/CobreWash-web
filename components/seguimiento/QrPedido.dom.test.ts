// @vitest-environment jsdom
import { createElement } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ exportar: vi.fn() }));
vi.mock("@/lib/seguimiento/exportar", () => ({ exportarComandaQr: mocks.exportar }));
import QrPedido from "./QrPedido";
const props = { codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-14r3" };
beforeEach(() => {
  mocks.exportar.mockReset().mockResolvedValue(undefined);
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });
it.each([['Descargar imagen', 'png'], ['Descargar PDF', 'pdf']])("%s exporta el QR visible y el número de la comanda", async (boton, formato) => {
  const { container } = render(createElement(QrPedido, props));
  fireEvent.click(screen.getByRole("button", { name: boton }));
  await waitFor(() => expect(mocks.exportar).toHaveBeenCalledWith(container.querySelector("svg title")?.parentElement, props.numeroComanda, formato));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("iniciada"));
  expect(screen.queryByRole("link", { name: "Abrir seguimiento" })).toBeNull();
});
it("evita descargas simultáneas y permite reintentar después de un fallo", async () => {
  let rechazar!: (error: Error) => void;
  mocks.exportar.mockImplementationOnce(() => new Promise((_, reject) => { rechazar = reject; }));
  render(createElement(QrPedido, props));
  fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
  await waitFor(() => expect(mocks.exportar).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("button", { name: "Preparando PDF…" }).hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Descargar imagen" }));
  expect(mocks.exportar).toHaveBeenCalledTimes(1);
  await act(async () => rechazar(new Error("Sin permiso")));
  expect(screen.getByRole("alert").textContent).toContain("No pudimos preparar");
  expect(screen.getByTitle("Escanea para seguir tu pedido")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Descargar PDF" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("PDF"));
});
