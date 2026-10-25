// @vitest-environment jsdom
import { createElement } from "react";
import { writeFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ hook: vi.fn(), ejecutar: vi.fn(), actualizar: vi.fn(), push: vi.fn(), params: new URLSearchParams() }));
vi.mock("next/navigation", () => ({ useSearchParams: () => m.params, useRouter: () => ({ push: m.push }) }));
vi.mock("@/lib/firebase/client", () => ({ auth: {}, dataConnect: {} }));
vi.mock("@/lib/seguimiento/useSeguimientoPublico", () => ({ useSeguimientoPublico: m.hook }));
import SeguimientoPage from "./page";
const pedido = {
  codigoQr: "12345678-1234-4234-8234-123456789abc", numeroComanda: "ELCOBRE-14r3", estado: "EN_PROCESO",
  fechaRecepcion: "2026-10-25T12:00:00Z", fechaEntregaEstimada: "2026-10-26T18:00:00Z", actualizadoEn: "2026-10-25T14:00:00Z",
  comandaDetalles_on_comanda: [{ tipoServicio: { nombre: "Lavado y planchado" } }],
  comandaEtapas_on_comanda: [
    { nombreEtapa: "Recepción", ordenEtapa: 1, estado: "COMPLETADA", fechaCompletado: "2026-10-25T12:00:00Z", etapa: { nombre: "Recepción", orden: 1 } },
    { nombreEtapa: "Lavado", ordenEtapa: 2, estado: "EN_PROCESO", etapa: { nombre: "Lavado", orden: 2 } },
    { nombreEtapa: "Planchado", ordenEtapa: 3, estado: "PENDIENTE", etapa: { nombre: "Planchado", orden: 3 } },
  ],
};
const estado = (extra = {}) => ({ pedido: null, error: "", buscando: false, consultado: false, consulta: null, ejecutar: m.ejecutar, actualizar: m.actualizar, ...extra });
beforeEach(() => {
  vi.clearAllMocks(); m.params = new URLSearchParams();
  vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ publicada: false }) }));
  m.hook.mockReturnValue(estado());
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it("busca por número y prioriza el QR al abrir un enlace de comprobante", async () => {
  const { rerender } = render(createElement(SeguimientoPage));
  fireEvent.change(screen.getByLabelText("Número de comanda"), { target: { value: "14r3" } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar pedido" }));
  expect(m.ejecutar).toHaveBeenCalledWith({ tipo: "numero", valor: "14r3" });
  m.params = new URLSearchParams({ qr: pedido.codigoQr, codigo: "otro" });
  await act(async () => rerender(createElement(SeguimientoPage)));
  expect(m.ejecutar).toHaveBeenLastCalledWith({ tipo: "qr", valor: pedido.codigoQr });
});
it("muestra el QR del pedido recibido, su avance real y ninguna identidad ni importe", async () => {
  m.hook.mockReturnValue(estado({ pedido: { ...pedido, email: "privado@example.test", valorTotal: 987654, cliente: { nombre: "Persona privada" } }, consultado: true }));
  const { container } = render(createElement(SeguimientoPage));
  expect(screen.getByRole("heading", { name: pedido.numeroComanda })).toBeTruthy();
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("33");
  expect(screen.getByRole("region", { name: `QR de la comanda ${pedido.numeroComanda}` })).toBeTruthy();
  expect(screen.getByTitle("Escanea para seguir tu pedido")).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Abrir seguimiento" })).toBeNull();
  for (const valor of ["privado@example.test", "987654", "Persona privada"]) expect(container.textContent).not.toContain(valor);
  if (process.env.COBRE_EXPORT_PREVIEW === "1") {
    await waitFor(() => expect(container.querySelector("[aria-label=\"Seguimiento de ELCOBRE-14r3\"]")?.parentElement?.style.opacity).toBe("1"));
    writeFileSync("scratch/portal-seguimiento-preview.html", container.innerHTML);
  }
});
it("los históricos sin etapas no muestran un porcentaje inventado", () => {
  m.hook.mockReturnValue(estado({ pedido: { ...pedido, estado: "FINALIZADA", comandaEtapas_on_comanda: [] }, consultado: true }));
  render(createElement(SeguimientoPage));
  expect(screen.getByText("Tu pedido está listo")).toBeTruthy();
  expect(screen.queryByRole("progressbar")).toBeNull(); expect(screen.getByText(/no tiene etapas registradas/)).toBeTruthy();
});
it("una actualización fallida mantiene el QR del pedido anterior y permite reintentar", () => {
  m.hook.mockReturnValue(estado({ pedido, error: "No se pudo consultar", consulta: { tipo: "numero", valor: pedido.numeroComanda } }));
  render(createElement(SeguimientoPage));
  expect(screen.getByText("Se muestra la última información recibida.")).toBeTruthy();
  expect(screen.getByTitle("Escanea para seguir tu pedido")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); expect(m.actualizar).toHaveBeenCalled();
});
