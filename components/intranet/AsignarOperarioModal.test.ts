// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AsignarOperarioModal, { type AsignacionOperario } from "./AsignarOperarioModal";
const valor: AsignacionOperario = { comandaId: "c1", numero: "ELCOBRE-1234", etapaId: "e2", operarioId: "", motivo: "", etapas: [
  { id: "e1", nombre: "Recepción", orden: 1, descripcion: null, estado: "COMPLETADA", tiempoEstimadoMin: 15, fechaInicio: null, fechaCompletado: null, responsable: null, asignadoA: null, asignadoAId: null },
  { id: "e2", nombre: "Lavado", orden: 2, descripcion: null, estado: "EN_PROCESO", tiempoEstimadoMin: 90, fechaInicio: null, fechaCompletado: null, responsable: null, asignadoA: "Ana Pérez", asignadoAId: "op1" },
] };
afterEach(cleanup);
describe("modal de asignación", () => {
  it("solicita una elección explícita, excluye etapas completadas y permite cerrar con Escape", () => {
    const cerrar = vi.fn();
    const { container } = render(createElement(AsignarOperarioModal, { valor, operarios: [{ id: "op1", nombre: "Ana", apellido: "Pérez" }], guardando: false, error: "", onChange: vi.fn(), onSubmit: vi.fn(), onCerrar: cerrar }));
    const dialogo = screen.getByRole("dialog");
    expect(container.contains(dialogo)).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Etapa" }));
    expect(screen.queryByRole("option", { name: /Recepción/ })).toBeNull();
    expect(screen.getByRole("option", { name: "2. Lavado" })).not.toBeNull();
    expect((screen.getByRole("button", { name: "Confirmar asignación" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(screen.getByRole("button", { name: "Etapa" }), { key: "Escape" });
    expect(cerrar).not.toHaveBeenCalled();
    fireEvent.keyDown(dialogo, { key: "Escape" });
    expect(cerrar).toHaveBeenCalledOnce();
  });
  it("bloquea cancelar y cerrar durante el guardado y muestra errores dentro del modal", () => {
    const cerrar = vi.fn();
    render(createElement(AsignarOperarioModal, { valor: { ...valor, operarioId: "op1" }, operarios: [{ id: "op1", nombre: "Ana" }], guardando: true, error: "La etapa fue completada", onChange: vi.fn(), onSubmit: vi.fn(), onCerrar: cerrar }));
    expect(screen.getByRole("dialog").contains(screen.getByRole("alert"))).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(cerrar).not.toHaveBeenCalled();
  });
});
