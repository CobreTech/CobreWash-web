// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { imprimirComprobante } from "./imprimir";

afterEach(() => { window.dispatchEvent(new Event("afterprint")); });

function ticket(ancho: number, alto: number, altoContenido = alto) {
  const elemento = document.createElement("div");
  Object.defineProperties(elemento, {
    offsetWidth: { value: ancho }, offsetHeight: { value: alto }, scrollHeight: { value: altoContenido },
  });
  return elemento;
}

describe("papel del comprobante", () => {
  it("solicita solo el tamaño del rectángulo y márgenes cero; limpia al cerrar el diálogo", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    imprimirComprobante(ticket(384, 640));
    const estilo = document.querySelector("style[data-comprobante-impresion]")!;
    expect(estilo.textContent).toContain("size: 101.6mm 169.6mm; margin: 0");
    expect(estilo.textContent).toContain("width: 384px");
    expect(print).toHaveBeenCalledOnce();
    window.dispatchEvent(new Event("afterprint"));
    expect(document.querySelector("style[data-comprobante-impresion]")).toBeNull();
  });
  it("adapta altura a tickets largos y no acumula estilos al repetir", () => {
    vi.spyOn(window, "print").mockImplementation(() => {});
    imprimirComprobante(ticket(320, 640, 1200));
    expect(document.querySelector("style[data-comprobante-impresion]")?.textContent).toContain("size: 84.67mm 317.77mm");
    imprimirComprobante(ticket(384, 640));
    expect(document.querySelectorAll("style[data-comprobante-impresion]")).toHaveLength(1);
  });
  it("no abre impresión cuando el ticket no se puede medir", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    expect(() => imprimirComprobante(ticket(0, 0))).toThrow(/medir/);
    expect(print).not.toHaveBeenCalled();
  });
  it("restaura los estilos si el navegador falla al abrir impresión", () => {
    vi.spyOn(window, "print").mockImplementation(() => { throw new Error("print no disponible"); });
    expect(() => imprimirComprobante(ticket(384, 640))).toThrow("print no disponible");
    expect(document.querySelector("style[data-comprobante-impresion]")).toBeNull();
  });
});
