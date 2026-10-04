// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LimitesEtapasConfig from "./LimitesEtapasConfig";
const mocks = vi.hoisted(() => ({ leer: vi.fn(), guardar: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {} }));
vi.mock("@/src/dataconnect-generated", () => ({ getEtapasProduccion: mocks.leer, configurarLimitesEtapas: mocks.guardar }));
const etapas = ["Recepción", "Lavado", "Secado", "Planchado", "Entrega"].map((nombre, i) => ({ id: String(i), nombre, orden: i + 1, tiempoEstimadoMin: null }));
beforeEach(() => { mocks.leer.mockReset().mockResolvedValue({ data: { etapaProduccions: etapas } }); mocks.guardar.mockReset().mockResolvedValue({}); });
afterEach(cleanup);
describe("configuración persistida de límites", () => {
  it("muestra valores iniciales y guarda horas y minutos juntos", async () => {
    render(createElement(LimitesEtapasConfig));
    const entrega = await screen.findByLabelText("5. Entrega");
    expect((entrega as HTMLInputElement).value).toBe("24");
    expect(screen.getByRole("button", { name: "Unidad de Entrega" }).textContent).toBe("Horas");
    expect((screen.getByLabelText("1. Recepción") as HTMLInputElement).value).toBe("15");
    fireEvent.click(screen.getByRole("button", { name: "Unidad de Lavado" }));
    fireEvent.click(screen.getByRole("button", { name: "Horas" }));
    expect((screen.getByLabelText("2. Lavado") as HTMLInputElement).value).toBe("1.5");
    fireEvent.change(entrega, { target: { value: "48" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar límites" }));
    await waitFor(() => expect(mocks.guardar).toHaveBeenCalledWith({}, { recepcion: 15, lavado: 90, secado: 60, planchado: 60, entrega: 2880 }));
    expect((await screen.findByRole("status")).textContent).toMatch(/Límites guardados/);
  });
  it("recupera valores guardados y no permite tiempos inválidos", async () => {
    mocks.leer.mockResolvedValue({ data: { etapaProduccions: etapas.map((e, i) => ({ ...e, tiempoEstimadoMin: i === 1 ? 42 : null })) } });
    render(createElement(LimitesEtapasConfig));
    const lavado = await screen.findByLabelText("2. Lavado");
    expect((lavado as HTMLInputElement).value).toBe("42");
    fireEvent.change(lavado, { target: { value: "0" } });
    expect((screen.getByRole("button", { name: "Guardar límites" }) as HTMLButtonElement).disabled).toBe(true);
    expect(mocks.guardar).not.toHaveBeenCalled();
  });
  it("informa errores de guardado y permite reintentar", async () => {
    mocks.guardar.mockRejectedValueOnce(new Error("sin conexión"));
    render(createElement(LimitesEtapasConfig));
    await screen.findByLabelText("2. Lavado");
    fireEvent.click(screen.getByRole("button", { name: "Guardar límites" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/No se pudieron guardar/);
    fireEvent.click(screen.getByRole("button", { name: "Guardar límites" }));
    expect((await screen.findByRole("status")).textContent).toMatch(/Límites guardados/);
  });
});
