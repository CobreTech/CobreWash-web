import { describe, expect, it } from "vitest";
import { ComandaEstado } from "@/src/dataconnect-generated";
import { fechaSeguimiento, presentarPedido, type PedidoPublico } from "./publico";

const pedido: PedidoPublico = {
  numeroComanda: "ELCOBRE-14r3", estado: ComandaEstado.PENDIENTE,
  fechaRecepcion: "2026-10-04T12:00:00Z", actualizadoEn: "2026-10-04T12:00:00Z",
  comandaDetalles_on_comanda: [{ tipoServicio: { nombre: "Lavado" } }, { tipoServicio: { nombre: "Lavado" } }],
  comandaEtapas_on_comanda: [],
};

describe("presentación pública", () => {
  it.each([ComandaEstado.PENDIENTE, ComandaEstado.EN_PROCESO, ComandaEstado.FINALIZADA, ComandaEstado.ENTREGADA, ComandaEstado.ANULADA])("no inventa etapas ni porcentaje para históricos %s", (estado) => {
    const vista = presentarPedido({ ...pedido, estado });
    expect(vista.etapas).toEqual([]); expect(vista.progreso).toBeNull();
  });
  it("distingue listo para retiro, entregado y anulado", () => {
    expect(presentarPedido({ ...pedido, estado: ComandaEstado.FINALIZADA }).estado).toBe("Listo para retirar");
    expect(presentarPedido({ ...pedido, estado: ComandaEstado.ENTREGADA }).estado).toBe("Entregado");
    expect(presentarPedido({ ...pedido, estado: ComandaEstado.ANULADA }).estado).toBe("Anulado");
  });
  it("ordena las etapas, conserva el snapshot y calcula solo las completadas", () => {
    const vista = presentarPedido({ ...pedido, comandaEtapas_on_comanda: [
      { nombreEtapa: "Lavado original", ordenEtapa: 2, estado: "EN_PROCESO", etapa: { nombre: "Lavado modificado", orden: 2 } },
      { estado: "COMPLETADA", etapa: { nombre: "Recepción", orden: 1 }, fechaCompletado: pedido.fechaRecepcion },
    ] });
    expect(vista.etapas.map((e) => e.nombre)).toEqual(["Recepción", "Lavado original"]);
    expect(vista.progreso).toBe(50); expect(vista.servicios).toBe("Lavado");
  });
  it("usa la zona de Chile y maneja fechas ausentes", () => {
    expect(fechaSeguimiento(pedido.fechaRecepcion)).toContain("09:00");
    expect(fechaSeguimiento(null)).toBe("Sin registro");
    expect(fechaSeguimiento("inválida")).toBe("Sin registro");
  });
});
