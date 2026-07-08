import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActualizarUsuarioData {
  usuario_update?: Usuario_Key | null;
}

export interface ActualizarUsuarioVariables {
  id: string;
  rolId: UUIDString;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  activo: boolean;
}

export interface AlertaInventario_Key {
  id: UUIDString;
  __typename?: 'AlertaInventario_Key';
}

export interface Aviso_Key {
  id: UUIDString;
  __typename?: 'Aviso_Key';
}

export interface Cliente_Key {
  id: UUIDString;
  __typename?: 'Cliente_Key';
}

export interface ComandaDetalle_Key {
  id: UUIDString;
  __typename?: 'ComandaDetalle_Key';
}

export interface ComandaEtapa_Key {
  comandaId: UUIDString;
  etapaId: UUIDString;
  __typename?: 'ComandaEtapa_Key';
}

export interface ComandaHistorialEstado_Key {
  id: UUIDString;
  __typename?: 'ComandaHistorialEstado_Key';
}

export interface Comanda_Key {
  id: UUIDString;
  __typename?: 'Comanda_Key';
}

export interface EtapaProduccion_Key {
  id: UUIDString;
  __typename?: 'EtapaProduccion_Key';
}

export interface GetMiPerfilData {
  usuario?: {
    id: string;
    rut?: string | null;
    nombre: string;
    apellido?: string | null;
    email: string;
    telefono?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
    rol: {
      id: UUIDString;
      nombre: string;
      descripcion?: string | null;
    } & Rol_Key;
    clientes_on_usuario: ({
      id: UUIDString;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key)[];
  } & Usuario_Key;
}

export interface GetRolesData {
  rols: ({
    id: UUIDString;
    nombre: string;
    descripcion?: string | null;
  } & Rol_Key)[];
}

export interface GetUsuariosData {
  usuarios: ({
    id: string;
    rut?: string | null;
    nombre: string;
    apellido?: string | null;
    email: string;
    telefono?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
    rol: {
      id: UUIDString;
      nombre: string;
    } & Rol_Key;
  } & Usuario_Key)[];
}

export interface Insumo_Key {
  id: UUIDString;
  __typename?: 'Insumo_Key';
}

export interface ModeloIa_Key {
  id: UUIDString;
  __typename?: 'ModeloIa_Key';
}

export interface MovimientoInventario_Key {
  id: UUIDString;
  __typename?: 'MovimientoInventario_Key';
}

export interface PatronConsumo_Key {
  tipoServicioId: UUIDString;
  tipoPrendaId: UUIDString;
  insumoId: UUIDString;
  __typename?: 'PatronConsumo_Key';
}

export interface PrediccionInsumo_Key {
  id: UUIDString;
  __typename?: 'PrediccionInsumo_Key';
}

export interface RegistrarseComoClienteData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}

export interface RegistrarseComoClienteVariables {
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
}

export interface RegistrarseData {
  usuario_insert: Usuario_Key;
}

export interface RegistrarseVariables {
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}

export interface Rol_Key {
  id: UUIDString;
  __typename?: 'Rol_Key';
}

export interface TipoPrenda_Key {
  id: UUIDString;
  __typename?: 'TipoPrenda_Key';
}

export interface TipoServicio_Key {
  id: UUIDString;
  __typename?: 'TipoServicio_Key';
}

export interface Usuario_Key {
  id: string;
  __typename?: 'Usuario_Key';
}

interface RegistrarseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
  operationName: string;
}
export const registrarseRef: RegistrarseRef;

export function registrarse(vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;
export function registrarse(dc: DataConnect, vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;

interface RegistrarseComoClienteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
  operationName: string;
}
export const registrarseComoClienteRef: RegistrarseComoClienteRef;

export function registrarseComoCliente(vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
export function registrarseComoCliente(dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

interface ActualizarUsuarioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
  operationName: string;
}
export const actualizarUsuarioRef: ActualizarUsuarioRef;

export function actualizarUsuario(vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;
export function actualizarUsuario(dc: DataConnect, vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;

interface GetRolesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
  operationName: string;
}
export const getRolesRef: GetRolesRef;

export function getRoles(options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;
export function getRoles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;

interface GetMiPerfilRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMiPerfilData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMiPerfilData, undefined>;
  operationName: string;
}
export const getMiPerfilRef: GetMiPerfilRef;

export function getMiPerfil(options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;
export function getMiPerfil(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;

interface GetUsuariosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsuariosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUsuariosData, undefined>;
  operationName: string;
}
export const getUsuariosRef: GetUsuariosRef;

export function getUsuarios(options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;
export function getUsuarios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;

