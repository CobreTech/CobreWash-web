import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Auth } from "firebase/auth";
import type { DataConnect } from "firebase/data-connect";
import type {
  ClientRegistrationInput,
  ManagedUserRegistrationInput,
} from "@/lib/auth-validation";

const mocks = vi.hoisted(() => ({
  createUser: vi.fn(),
  sendReset: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getProfile: vi.fn(),
  registerClient: vi.fn(),
  createAdminUser: vi.fn(),
  createAdminClient: vi.fn(),
  updateUser: vi.fn(),
  createSecondary: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: mocks.createUser,
  sendPasswordResetEmail: mocks.sendReset,
  signInWithEmailAndPassword: mocks.signIn,
  signOut: mocks.signOut,
}));

vi.mock("firebase/data-connect", () => ({
  QueryFetchPolicy: { SERVER_ONLY: "SERVER_ONLY" },
}));

vi.mock("@/src/dataconnect-generated", () => ({
  actualizarUsuario: mocks.updateUser,
  crearClienteAdministrado: mocks.createAdminClient,
  crearUsuarioAdministrado: mocks.createAdminUser,
  getMiPerfil: mocks.getProfile,
  registrarseComoCliente: mocks.registerClient,
}));

vi.mock("@/lib/firebase/secondary", () => ({
  createSecondaryFirebaseContext: mocks.createSecondary,
}));

import {
  createManagedUser,
  InactiveAccountError,
  loadActiveUserProfile,
  registerPublicClient,
  requestPasswordReset,
  signInAndResolveLanding,
  toggleManagedUserActive,
  updateManagedUser,
} from "@/lib/firebase/auth-flows";

const auth = {} as Auth;
const dataConnect = {} as DataConnect;
const clientInput: ClientRegistrationInput = {
  nombre: " Ana ",
  apellido: " Pérez ",
  rut: "123456785",
  telefono: " ",
  email: " ana@example.com ",
  direccion: " ",
  tipoCliente: "PARTICULAR" as ClientRegistrationInput["tipoCliente"],
  password: "clave1",
};
const managedInput: ManagedUserRegistrationInput = {
  ...clientInput,
  rolId: "rol-cliente",
};

describe("flujos de autenticación", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.signOut.mockResolvedValue(undefined);
  });

  it.each([
    ["admin", "/intranet"],
    ["recepcionista", "/intranet/comandas"],
    ["operario", "/intranet/seguimiento"],
    ["cliente", "/cuenta"],
  ])("inicia sesión y resuelve la vista del rol %s", async (role, landing) => {
    mocks.signIn.mockResolvedValue({});
    mocks.getProfile.mockResolvedValue({
      data: { usuario: { activo: true, rol: { nombre: role } } },
    });

    await expect(
      signInAndResolveLanding({ auth, dataConnect }, " ana@example.com ", "clave1"),
    ).resolves.toBe(landing);

    expect(mocks.signIn).toHaveBeenCalledWith(auth, "ana@example.com", "clave1");
    expect(mocks.getProfile).toHaveBeenCalledWith(dataConnect, {
      fetchPolicy: "SERVER_ONLY",
    });
  });

  it("usa la vista de cliente si el perfil no existe", async () => {
    mocks.signIn.mockResolvedValue({});
    mocks.getProfile.mockResolvedValue({ data: { usuario: null } });

    await expect(signInAndResolveLanding({ auth, dataConnect }, "a@b.cl", "clave1")).resolves.toBe(
      "/cuenta",
    );
  });

  it("cierra la sesión y rechaza una cuenta inactiva", async () => {
    mocks.getProfile.mockResolvedValue({
      data: { usuario: { activo: false, rol: { nombre: "admin" } } },
    });

    await expect(loadActiveUserProfile({ auth, dataConnect })).rejects.toBeInstanceOf(
      InactiveAccountError,
    );
    expect(mocks.signOut).toHaveBeenCalledWith(auth);
  });

  it("solicita recuperación con el correo normalizado", async () => {
    mocks.sendReset.mockResolvedValue(undefined);

    await requestPasswordReset(auth, " ana@example.com ");

    expect(mocks.sendReset).toHaveBeenCalledWith(auth, "ana@example.com");
  });
});

describe("registro público de clientes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("crea Auth y luego Usuario+Cliente con datos normalizados", async () => {
    const deleteUser = vi.fn();
    mocks.createUser.mockResolvedValue({ user: { delete: deleteUser } });
    mocks.registerClient.mockResolvedValue({});

    await registerPublicClient({ auth, dataConnect }, clientInput);

    expect(mocks.createUser).toHaveBeenCalledWith(auth, "ana@example.com", "clave1");
    expect(mocks.registerClient).toHaveBeenCalledWith(dataConnect, {
      rut: "12.345.678-5",
      nombre: "Ana",
      apellido: "Pérez",
      telefono: null,
      email: "ana@example.com",
      direccion: null,
      tipoCliente: "PARTICULAR",
    });
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("elimina la cuenta Auth si falla la transacción de Usuario+Cliente", async () => {
    const databaseError = new Error("Data Connect no disponible");
    const deleteUser = vi.fn().mockResolvedValue(undefined);
    mocks.createUser.mockResolvedValue({ user: { delete: deleteUser } });
    mocks.registerClient.mockRejectedValue(databaseError);

    await expect(registerPublicClient({ auth, dataConnect }, clientInput)).rejects.toBe(databaseError);
    expect(deleteUser).toHaveBeenCalledOnce();
  });

  it("conserva el error original aunque también falle el rollback", async () => {
    const databaseError = new Error("Data Connect no disponible");
    const deleteUser = vi.fn().mockRejectedValue(new Error("falló delete"));
    mocks.createUser.mockResolvedValue({ user: { delete: deleteUser } });
    mocks.registerClient.mockRejectedValue(databaseError);

    await expect(registerPublicClient({ auth, dataConnect }, clientInput)).rejects.toBe(databaseError);
  });
});

describe("creación de usuarios desde administración", () => {
  const secondaryAuth = {} as Auth;
  const cleanup = vi.fn();
  const deleteUser = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.createSecondary.mockReturnValue({
      auth: secondaryAuth,
      cleanup,
    });
    mocks.createUser.mockResolvedValue({ user: { uid: "nuevo-uid", delete: deleteUser } });
    mocks.createAdminUser.mockResolvedValue({});
    mocks.createAdminClient.mockResolvedValue({});
    cleanup.mockResolvedValue(undefined);
    deleteUser.mockResolvedValue(undefined);
  });

  it("usa Auth secundario y la sesión Data Connect principal para crear clientes", async () => {
    await createManagedUser(
      dataConnect,
      { ...managedInput, direccion: " Calle Uno 123 " },
      "cliente",
    );

    expect(mocks.createUser).toHaveBeenCalledWith(
      secondaryAuth,
      "ana@example.com",
      "clave1",
    );
    expect(mocks.createAdminClient).toHaveBeenCalledWith(
      dataConnect,
      expect.objectContaining({
        id: "nuevo-uid",
        direccion: "Calle Uno 123",
        tipoCliente: "PARTICULAR",
      }),
    );
    expect(mocks.createAdminUser).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("crea solo Usuario para un rol interno", async () => {
    await createManagedUser(
      dataConnect,
      { ...managedInput, rolId: "rol-operario", tipoCliente: "" },
      "operario",
    );

    expect(mocks.createAdminUser).toHaveBeenCalledWith(
      dataConnect,
      expect.objectContaining({
        id: "nuevo-uid",
        rolId: "rol-operario",
        email: "ana@example.com",
      }),
    );
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("elimina la cuenta Auth y el contexto secundario si falla Data Connect", async () => {
    const error = new Error("falló la creación");
    mocks.createAdminClient.mockRejectedValue(error);

    await expect(createManagedUser(dataConnect, managedInput, "cliente")).rejects.toBe(error);
    expect(deleteUser).toHaveBeenCalledOnce();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("no intenta rollback si Firebase Auth falla antes de crear la cuenta", async () => {
    const error = new Error("falló Auth");
    mocks.createUser.mockRejectedValue(error);

    await expect(createManagedUser(dataConnect, managedInput, "cliente")).rejects.toBe(error);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});

describe("edición y estado de usuarios", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.updateUser.mockResolvedValue({});
  });

  it("normaliza campos editables y conserva el estado actual", async () => {
    await updateManagedUser(dataConnect, {
      id: "usuario-1",
      rolId: "rol-cliente",
      nombre: " Ana ",
      apellido: " ",
      telefono: " +56912345678 ",
      activo: true,
    });

    expect(mocks.updateUser).toHaveBeenCalledWith(dataConnect, {
      id: "usuario-1",
      rolId: "rol-cliente",
      nombre: "Ana",
      apellido: null,
      telefono: "+56912345678",
      activo: true,
    });
  });

  it("invierte únicamente el estado activo", async () => {
    await toggleManagedUserActive(dataConnect, {
      id: "usuario-1",
      rolId: "rol-cliente",
      nombre: "Ana",
      apellido: null,
      telefono: null,
      activo: true,
    });

    expect(mocks.updateUser).toHaveBeenCalledWith(
      dataConnect,
      expect.objectContaining({ id: "usuario-1", activo: false }),
    );
  });
});
