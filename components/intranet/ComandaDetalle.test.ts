// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ComandaDetalle, { ComprobanteModal } from "./ComandaDetalle";
import type { Comanda } from "@/lib/mock/comandas";

const comanda: Comanda = {
  id: "ELCOBRE-14r3", codigoQr: "12345678-1234-4234-8234-123456789abc",
  cliente: "Cliente de prueba", tipoCliente: "Particular", telefono: "", email: "",
  servicio: "Lavado", detalle: [{ tipoPrenda: "Polera", servicio: "Lavado", cantidad: 2, precioUnitario: 1000 }],
  fechaRecepcion: "04-10-2026", etapaActual: null, estado: "Pendiente",
};
afterEach(() => { cleanup(); window.dispatchEvent(new Event("afterprint")); vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("comprobante con QR persistido", () => {
  it("detalle y ticket comparten URL; el ticket está fuera del contenedor de intranet", async () => {
    vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
    const imprimir = vi.spyOn(window, "print").mockImplementation(() => {});
    const { container } = render(createElement(ComandaDetalle, { comanda, onClose: () => {} }));
    const enlace = screen.getByRole("link", { name: "Ver seguimiento público" }).getAttribute("href");
    fireEvent.click(screen.getByRole("button", { name: "Generar comprobante" }));
    const modal = document.querySelector(".comprobante-modal")!;
    expect(modal.parentElement).toBe(document.body);
    expect(container.contains(modal)).toBe(false);
    expect(modal.querySelector("a")?.getAttribute("href")).toBe(enlace);
    expect(modal.querySelector(".comprobante-qr svg")).not.toBeNull();
    Object.defineProperties(modal.querySelector(".comprobante-ticket")!, {
      offsetWidth: { value: 384 }, offsetHeight: { value: 640 }, scrollHeight: { value: 640 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));
    await waitFor(() => expect(imprimir).toHaveBeenCalledOnce());
    expect(document.querySelector("style[data-comprobante-impresion]")?.textContent).toContain("margin: 0");
    window.dispatchEvent(new Event("afterprint"));
    expect(document.querySelector("style[data-comprobante-impresion]")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Listo" }));
    await waitFor(() => expect(document.querySelector(".comprobante-modal")).toBeNull());
  });
  it.each(["", "https://example.com/preview"])("no permite emitir sin origen válido: %s", (base) => {
    vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", base);
    render(createElement(ComandaDetalle, { comanda, onClose: () => {} }));
    expect((screen.getByRole("button", { name: "Generar comprobante" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("alert").textContent).toMatch(/dominio/);
  });
  it("no reemplaza un UUID ausente por el número de comanda", () => {
    vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
    render(createElement(ComandaDetalle, { comanda: { ...comanda, codigoQr: undefined }, onClose: () => {} }));
    expect((screen.getByRole("button", { name: "Generar comprobante" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("alert").textContent).toMatch(/código QR/);
  });
  it("incluye fecha de generación dentro del ticket en hora de Chile y la conserva al reimprimir", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-04T18:00:00Z"));
    vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "https://lavanderia-elcobre.vercel.app");
    const { rerender } = render(createElement(ComprobanteModal, { comanda, onClose: () => {} }));
    const fecha = screen.getByText(/^Generado el /);
    expect(fecha.closest(".comprobante-ticket")).not.toBeNull();
    expect(fecha.textContent).toContain("15:00:00");
    const original = fecha.textContent;
    vi.setSystemTime(new Date("2026-10-04T19:00:00Z"));
    rerender(createElement(ComprobanteModal, { comanda, onClose: () => {} }));
    expect(screen.getByText(/^Generado el /).textContent).toBe(original);
    expect(screen.getByText("Recepción")).not.toBeNull();
  });
});
