import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ComandaEstado {
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  FINALIZADA = "FINALIZADA",
  ENTREGADA = "ENTREGADA",
  ANULADA = "ANULADA",
};

export enum EstadoVehiculo {
  APTO = "APTO",
  CON_OBSERVACIONES = "CON_OBSERVACIONES",
  NO_APTO = "NO_APTO",
};

export enum SalidaVehiculoEstado {
  PROGRAMADA = "PROGRAMADA",
  EN_SERVICIO = "EN_SERVICIO",
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA",
};

export enum TipoCliente {
  HOTEL = "HOTEL",
  PARTICULAR = "PARTICULAR",
};



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

export interface ActualizarVehiculoData {
  vehiculo_update?: Vehiculo_Key | null;
}

export interface ActualizarVehiculoVariables {
  id: UUIDString;
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
  activo: boolean;
}

export interface AgregarFotoInspeccionVehiculoData {
  fotoInspeccionVehiculo_insert: FotoInspeccionVehiculo_Key;
}

export interface AgregarFotoInspeccionVehiculoVariables {
  inspeccionId: UUIDString;
  rutaStorage: string;
  descripcion?: string | null;
  orden: number;
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

export interface CrearClienteAdministradoData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}

export interface CrearClienteAdministradoVariables {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
  tipoCliente: TipoCliente;
}

export interface CrearSalidaVehiculoData {
  salidaVehiculo_insert: SalidaVehiculo_Key;
}

export interface CrearSalidaVehiculoVariables {
  vehiculoId: UUIDString;
  repartidorId: string;
  observaciones?: string | null;
}

export interface CrearUsuarioAdministradoData {
  usuario_insert: Usuario_Key;
}

export interface CrearUsuarioAdministradoVariables {
  id: string;
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}

export interface CrearVehiculoData {
  vehiculo_insert: Vehiculo_Key;
}

export interface CrearVehiculoVariables {
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
}

export interface EtapaProduccion_Key {
  id: UUIDString;
  __typename?: 'EtapaProduccion_Key';
}

export interface FotoInspeccionVehiculo_Key {
  id: UUIDString;
  __typename?: 'FotoInspeccionVehiculo_Key';
}

export interface GetComandaPorQrData {
  comanda?: {
    id: UUIDString;
    codigoQr: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    fechaEntregaReal?: TimestampString | null;
    actualizadoEn: TimestampString;
    comandaDetalles_on_comanda: ({
      cantidad: number;
      pesoKg?: number | null;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
  } & Comanda_Key;
}

export interface GetComandaPorQrVariables {
  codigoQr: UUIDString;
}

export interface GetInsumoPorQrData {
  insumo?: {
    id: UUIDString;
    codigoQr: UUIDString;
    nombre: string;
    unidadMedida: string;
    stockActual: number;
    stockMinimo: number;
    activo: boolean;
  } & Insumo_Key;
}

export interface GetInsumoPorQrVariables {
  codigoQr: UUIDString;
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

export interface GetMisSalidasVehiculoData {
  salidaVehiculos: ({
    id: UUIDString;
    estado: SalidaVehiculoEstado;
    fechaSalida?: TimestampString | null;
    fechaRetorno?: TimestampString | null;
    observaciones?: string | null;
    creadoEn: TimestampString;
    vehiculo: {
      id: UUIDString;
      patente: string;
      marca: string;
      modelo: string;
    } & Vehiculo_Key;
    inspeccionVehiculos_on_salida: ({
      id: UUIDString;
      momento: MomentoInspeccion;
      estadoVehiculo: EstadoVehiculo;
      kilometraje: number;
      observaciones?: string | null;
      registradoEn: TimestampString;
      fotoInspeccionVehiculos_on_inspeccion: ({
        id: UUIDString;
        rutaStorage: string;
        descripcion?: string | null;
        orden: number;
      } & FotoInspeccionVehiculo_Key)[];
    } & InspeccionVehiculo_Key)[];
  } & SalidaVehiculo_Key)[];
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

export interface GetVehiculosData {
  vehiculos: ({
    id: UUIDString;
    patente: string;
    marca: string;
    modelo: string;
    anio?: number | null;
    descripcion?: string | null;
    activo: boolean;
    creadoEn: TimestampString;
  } & Vehiculo_Key)[];
}

export interface IniciarSalidaVehiculoData {
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}

export interface IniciarSalidaVehiculoVariables {
  salidaId: UUIDString;
}

export interface InspeccionVehiculo_Key {
  id: UUIDString;
  __typename?: 'InspeccionVehiculo_Key';
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

export interface RegistrarInspeccionAntesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
}

export interface RegistrarInspeccionAntesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}

export interface RegistrarInspeccionDespuesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}

export interface RegistrarInspeccionDespuesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}

export interface RegistrarseComoClienteData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}

export interface RegistrarseComoClienteVariables {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
  tipoCliente: TipoCliente;
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

export interface SalidaVehiculo_Key {
  id: UUIDString;
  __typename?: 'SalidaVehiculo_Key';
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

export interface Vehiculo_Key {
  id: UUIDString;
  __typename?: 'Vehiculo_Key';
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

interface CrearUsuarioAdministradoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
  operationName: string;
}
export const crearUsuarioAdministradoRef: CrearUsuarioAdministradoRef;

export function crearUsuarioAdministrado(vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
export function crearUsuarioAdministrado(dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

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

interface CrearClienteAdministradoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
  operationName: string;
}
export const crearClienteAdministradoRef: CrearClienteAdministradoRef;

export function crearClienteAdministrado(vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
export function crearClienteAdministrado(dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

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

interface CrearVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
  operationName: string;
}
export const crearVehiculoRef: CrearVehiculoRef;

export function crearVehiculo(vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;
export function crearVehiculo(dc: DataConnect, vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;

interface ActualizarVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
  operationName: string;
}
export const actualizarVehiculoRef: ActualizarVehiculoRef;

export function actualizarVehiculo(vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;
export function actualizarVehiculo(dc: DataConnect, vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;

interface CrearSalidaVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
  operationName: string;
}
export const crearSalidaVehiculoRef: CrearSalidaVehiculoRef;

export function crearSalidaVehiculo(vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
export function crearSalidaVehiculo(dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

interface RegistrarInspeccionAntesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
  operationName: string;
}
export const registrarInspeccionAntesRef: RegistrarInspeccionAntesRef;

export function registrarInspeccionAntes(vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
export function registrarInspeccionAntes(dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

interface IniciarSalidaVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
  operationName: string;
}
export const iniciarSalidaVehiculoRef: IniciarSalidaVehiculoRef;

export function iniciarSalidaVehiculo(vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
export function iniciarSalidaVehiculo(dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

interface RegistrarInspeccionDespuesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
  operationName: string;
}
export const registrarInspeccionDespuesRef: RegistrarInspeccionDespuesRef;

export function registrarInspeccionDespues(vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
export function registrarInspeccionDespues(dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

interface AgregarFotoInspeccionVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
  operationName: string;
}
export const agregarFotoInspeccionVehiculoRef: AgregarFotoInspeccionVehiculoRef;

export function agregarFotoInspeccionVehiculo(vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
export function agregarFotoInspeccionVehiculo(dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

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

interface GetComandaPorQrRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
  operationName: string;
}
export const getComandaPorQrRef: GetComandaPorQrRef;

export function getComandaPorQr(vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;
export function getComandaPorQr(dc: DataConnect, vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;

interface GetInsumoPorQrRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
  operationName: string;
}
export const getInsumoPorQrRef: GetInsumoPorQrRef;

export function getInsumoPorQr(vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;
export function getInsumoPorQr(dc: DataConnect, vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;

interface GetVehiculosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVehiculosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetVehiculosData, undefined>;
  operationName: string;
}
export const getVehiculosRef: GetVehiculosRef;

export function getVehiculos(options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;
export function getVehiculos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;

interface GetMisSalidasVehiculoRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMisSalidasVehiculoData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMisSalidasVehiculoData, undefined>;
  operationName: string;
}
export const getMisSalidasVehiculoRef: GetMisSalidasVehiculoRef;

export function getMisSalidasVehiculo(options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;
export function getMisSalidasVehiculo(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;

