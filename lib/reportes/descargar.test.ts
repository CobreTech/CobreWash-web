// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { descargarArchivo } from "./exportar";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("descarga en navegador", () => {
  it("descarga con nombre y extensión correctos y libera el enlace y el objeto temporal", () => {
    vi.useFakeTimers();
    const crear = vi.fn().mockReturnValue("blob:reporte");
    const revocar = vi.fn();
    vi.stubGlobal("URL", { createObjectURL: crear, revokeObjectURL: revocar });
    let nombre = "";
    let destino = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      nombre = this.download;
      destino = this.href;
      expect(document.body.contains(this)).toBe(true);
    });
    const contenido = new Blob(["reporte"], { type: "application/pdf" });
    descargarArchivo(contenido, "reporte-cliente-2026-10-01-2026-10-05.pdf");
    expect(crear).toHaveBeenCalledWith(contenido);
    expect(nombre).toBe("reporte-cliente-2026-10-01-2026-10-05.pdf");
    expect(destino).toBe("blob:reporte");
    expect(document.querySelector("a")).toBeNull();
    expect(revocar).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60_000);
    expect(revocar).toHaveBeenCalledWith("blob:reporte");
  });
});
