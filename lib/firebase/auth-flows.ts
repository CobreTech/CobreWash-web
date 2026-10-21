import type { Auth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { QueryFetchPolicy, type DataConnect } from "firebase/data-connect";
import {
  actualizarUsuario,
  crearClienteAdministrado,
  crearUsuarioAdministrado,
  getMiPerfil,
  registrarseComoCliente,
  vincularMiFichaVerificada,
  type GetMiPerfilData,
  type TipoCliente,
} from "@/src/dataconnect-generated";
import type {
  ClientRegistrationInput,
  ManagedUserRegistrationInput,
} from "@/lib/auth-validation";
import { formatRut } from "@/lib/validators";
import { isPublicClientType } from "@/lib/auth-validation";
import { LANDING_POR_ROL, type Rol } from "@/lib/roles";
import { createSecondaryFirebaseContext } from "@/lib/firebase/secondary";

interface FirebaseContext {
  auth: Auth;
  dataConnect: DataConnect;
}

export type ActiveUserProfile = NonNullable<GetMiPerfilData["usuario"]>;

export class InactiveAccountError extends Error {
  readonly code = "auth/user-disabled";

  constructor() {
    super("La cuenta está inactiva");
    this.name = "InactiveAccountError";
  }
}

export interface ManagedUserUpdateInput {
  id: string;
  rolId: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  activo: boolean;
}

function registrationVariables(input: ClientRegistrationInput) {
  return {
    rut: formatRut(input.rut),
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    telefono: input.telefono.trim() || null,
    email: input.email.trim(),
  };
}

export async function loadActiveUserProfile(
  context: FirebaseContext,
): Promise<ActiveUserProfile | null> {
  let { data } = await getMiPerfil(context.dataConnect, {
    fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
  });
  let profile = data.usuario ?? null;
  if (profile?.rol.nombre === "cliente" && context.auth.currentUser?.emailVerified && profile.clientes_on_usuario.length === 0) {
    try {
      await vincularMiFichaVerificada(context.dataConnect);
      data = (await getMiPerfil(context.dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY })).data;
      profile = data.usuario ?? null;
    } catch { /* La ficha permanece sin asociar si no coincide el correo verificado. */ }
  }

  if (profile && !profile.activo) {
    if (!context.auth.currentUser || context.auth.currentUser.uid === profile.id) await signOut(context.auth).catch(() => undefined);
    throw new InactiveAccountError();
  }

  return profile;
}

export async function signInAndResolveLanding(
  context: FirebaseContext,
  email: string,
  password: string,
): Promise<string> {
  await signInWithEmailAndPassword(context.auth, email.trim(), password);
  const profile = await loadActiveUserProfile(context);
  const role = (profile?.rol?.nombre as Rol) ?? "cliente";
  return LANDING_POR_ROL[role] ?? "/cuenta";
}

export async function registerPublicClient(
  context: FirebaseContext,
  input: ClientRegistrationInput,
): Promise<void> {
  if (!isPublicClientType(input.tipoCliente)) {
    throw new Error("Selecciona el tipo de cliente.");
  }
  const credential = await createUserWithEmailAndPassword(
    context.auth,
    input.email.trim(),
    input.password,
  );

  try {
    const variables = {
      ...registrationVariables(input), direccion: input.direccion.trim() || null, tipoCliente: input.tipoCliente as TipoCliente,
    };
    try { await registrarseComoCliente(context.dataConnect, variables); }
    catch (error) {
      if (!String(error).includes("FICHA_RUT_EXISTENTE")) throw error;
      await registrarseComoCliente(context.dataConnect, { ...variables, crearFicha: false });
    }
  } catch (error) {
    await credential.user.delete().catch(() => undefined);
    throw error;
  }
}

export async function requestPasswordReset(auth: Auth, email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function createManagedUser(
  dataConnect: DataConnect,
  input: ManagedUserRegistrationInput,
  roleName: string,
): Promise<void> {
  const context = createSecondaryFirebaseContext();
  let credential: Awaited<ReturnType<typeof createUserWithEmailAndPassword>> | null = null;
  try {
    credential = await createUserWithEmailAndPassword(
      context.auth,
      input.email.trim(),
      input.password,
    );
    const variables = registrationVariables(input);

    if (roleName === "cliente") {
      const datos = { ...variables, id: credential.user.uid, direccion: input.direccion.trim() || null, tipoCliente: input.tipoCliente as TipoCliente };
      try { await crearClienteAdministrado(dataConnect, datos); }
      catch (error) {
        if (!String(error).includes("FICHA_RUT_EXISTENTE")) throw error;
        await crearClienteAdministrado(dataConnect, { ...datos, crearFicha: false });
      }
    } else {
      await crearUsuarioAdministrado(dataConnect, {
        ...variables,
        id: credential.user.uid,
        rolId: input.rolId,
      });
    }
  } catch (error) {
    if (credential) {
      await credential.user.delete().catch(() => undefined);
    }
    throw error;
  } finally {
    await context.cleanup().catch(() => undefined);
  }
}

export async function updateManagedUser(
  dataConnect: DataConnect,
  input: ManagedUserUpdateInput,
): Promise<void> {
  await actualizarUsuario(dataConnect, {
    ...input,
    nombre: input.nombre.trim(),
    apellido: input.apellido?.trim() || null,
    telefono: input.telefono?.trim() || null,
  });
}

export async function toggleManagedUserActive(
  dataConnect: DataConnect,
  input: ManagedUserUpdateInput,
): Promise<void> {
  await updateManagedUser(dataConnect, { ...input, activo: !input.activo });
}
