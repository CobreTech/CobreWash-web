import { beforeEach, expect, it, vi } from "vitest";
import type { Auth } from "firebase/auth";
const m = vi.hoisted(() => ({ reautenticar: vi.fn(), actualizar: vi.fn(), credencial: vi.fn() }));
vi.mock("firebase/auth", () => ({ EmailAuthProvider: { credential: m.credencial }, reauthenticateWithCredential: m.reautenticar, updatePassword: m.actualizar }));
import { cambiarContrasena } from "./seguridad-cuenta";
const user = { email: "ana@example.test" };
const auth = { currentUser: user } as Auth;
beforeEach(() => { vi.resetAllMocks(); m.credencial.mockReturnValue("credencial"); m.reautenticar.mockResolvedValue({}); m.actualizar.mockResolvedValue(undefined); });
it("solo actualiza después de reautenticar la contraseña actual", async () => {
  await cambiarContrasena(auth, "Anterior123!", "NuevaSegura123!", "NuevaSegura123!");
  expect(m.credencial).toHaveBeenCalledWith(user.email, "Anterior123!");
  expect(m.reautenticar).toHaveBeenCalledWith(user, "credencial");
  expect(m.actualizar).toHaveBeenCalledWith(user, "NuevaSegura123!");
  expect(m.reautenticar.mock.invocationCallOrder[0]).toBeLessThan(m.actualizar.mock.invocationCallOrder[0]);
});
it("rechaza confirmación o contraseña inválida antes de llamar a Firebase", async () => {
  await expect(cambiarContrasena(auth, "Anterior123!", "NuevaSegura123!", "Otra123!")).rejects.toThrow(/coinciden/);
  await expect(cambiarContrasena(auth, "Anterior123!", "1", "1")).rejects.toThrow();
  expect(m.reautenticar).not.toHaveBeenCalled(); expect(m.actualizar).not.toHaveBeenCalled();
});
it("si la reautenticación falla no cambia la contraseña", async () => {
  m.reautenticar.mockRejectedValue(new Error("credencial inválida"));
  await expect(cambiarContrasena(auth, "Mal123!", "NuevaSegura123!", "NuevaSegura123!")).rejects.toThrow();
  expect(m.actualizar).not.toHaveBeenCalled();
});
