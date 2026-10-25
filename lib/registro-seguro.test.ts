import { expect, it, vi } from "vitest";
import { registrarError } from "./registro-seguro";
it("no registra mensajes, credenciales, variables ni códigos arbitrarios", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
  try {
    registrarError("Consulta fallida", { code: "data-connect/permission-denied", message: "persona@example.test", variables: { token: "SECRETO" } });
    registrarError("Consulta fallida", { code: "SECRETO", message: "persona@example.test" });
    expect(log.mock.calls).toEqual([["Consulta fallida", "permission-denied"], ["Consulta fallida", "sin-codigo-publico"]]);
  } finally { log.mockRestore(); }
});
