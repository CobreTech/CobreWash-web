import { RegistrarseData, RegistrarseVariables, CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables, RegistrarseComoClienteData, RegistrarseComoClienteVariables, CrearClienteAdministradoData, CrearClienteAdministradoVariables, ActualizarUsuarioData, ActualizarUsuarioVariables, CrearVehiculoData, CrearVehiculoVariables, ActualizarVehiculoData, ActualizarVehiculoVariables, CrearSalidaVehiculoData, CrearSalidaVehiculoVariables, RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables, IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables, RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables, AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables, CrearComandaData, CrearComandaVariables, AgregarComandaDetalleData, AgregarComandaDetalleVariables, AnularComandaData, AnularComandaVariables, EntregarComandaData, EntregarComandaVariables, GetRolesData, GetMiPerfilData, GetUsuariosData, GetComandaPorQrData, GetComandaPorQrVariables, GetInsumoPorQrData, GetInsumoPorQrVariables, GetVehiculosData, GetMisSalidasVehiculoData, GetComandasData, GetComandaDetalleData, GetComandaDetalleVariables, GetCatalogosComandaData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useRegistrarse(options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;
export function useRegistrarse(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;

export function useCrearUsuarioAdministrado(options?: useDataConnectMutationOptions<CrearUsuarioAdministradoData, FirebaseError, CrearUsuarioAdministradoVariables>): UseDataConnectMutationResult<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
export function useCrearUsuarioAdministrado(dc: DataConnect, options?: useDataConnectMutationOptions<CrearUsuarioAdministradoData, FirebaseError, CrearUsuarioAdministradoVariables>): UseDataConnectMutationResult<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

export function useRegistrarseComoCliente(options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
export function useRegistrarseComoCliente(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

export function useCrearClienteAdministrado(options?: useDataConnectMutationOptions<CrearClienteAdministradoData, FirebaseError, CrearClienteAdministradoVariables>): UseDataConnectMutationResult<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
export function useCrearClienteAdministrado(dc: DataConnect, options?: useDataConnectMutationOptions<CrearClienteAdministradoData, FirebaseError, CrearClienteAdministradoVariables>): UseDataConnectMutationResult<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

export function useActualizarUsuario(options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;
export function useActualizarUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;

export function useCrearVehiculo(options?: useDataConnectMutationOptions<CrearVehiculoData, FirebaseError, CrearVehiculoVariables>): UseDataConnectMutationResult<CrearVehiculoData, CrearVehiculoVariables>;
export function useCrearVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<CrearVehiculoData, FirebaseError, CrearVehiculoVariables>): UseDataConnectMutationResult<CrearVehiculoData, CrearVehiculoVariables>;

export function useActualizarVehiculo(options?: useDataConnectMutationOptions<ActualizarVehiculoData, FirebaseError, ActualizarVehiculoVariables>): UseDataConnectMutationResult<ActualizarVehiculoData, ActualizarVehiculoVariables>;
export function useActualizarVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<ActualizarVehiculoData, FirebaseError, ActualizarVehiculoVariables>): UseDataConnectMutationResult<ActualizarVehiculoData, ActualizarVehiculoVariables>;

export function useCrearSalidaVehiculo(options?: useDataConnectMutationOptions<CrearSalidaVehiculoData, FirebaseError, CrearSalidaVehiculoVariables>): UseDataConnectMutationResult<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
export function useCrearSalidaVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<CrearSalidaVehiculoData, FirebaseError, CrearSalidaVehiculoVariables>): UseDataConnectMutationResult<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

export function useRegistrarInspeccionAntes(options?: useDataConnectMutationOptions<RegistrarInspeccionAntesData, FirebaseError, RegistrarInspeccionAntesVariables>): UseDataConnectMutationResult<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
export function useRegistrarInspeccionAntes(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarInspeccionAntesData, FirebaseError, RegistrarInspeccionAntesVariables>): UseDataConnectMutationResult<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

export function useIniciarSalidaVehiculo(options?: useDataConnectMutationOptions<IniciarSalidaVehiculoData, FirebaseError, IniciarSalidaVehiculoVariables>): UseDataConnectMutationResult<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
export function useIniciarSalidaVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<IniciarSalidaVehiculoData, FirebaseError, IniciarSalidaVehiculoVariables>): UseDataConnectMutationResult<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

export function useRegistrarInspeccionDespues(options?: useDataConnectMutationOptions<RegistrarInspeccionDespuesData, FirebaseError, RegistrarInspeccionDespuesVariables>): UseDataConnectMutationResult<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
export function useRegistrarInspeccionDespues(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarInspeccionDespuesData, FirebaseError, RegistrarInspeccionDespuesVariables>): UseDataConnectMutationResult<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

export function useAgregarFotoInspeccionVehiculo(options?: useDataConnectMutationOptions<AgregarFotoInspeccionVehiculoData, FirebaseError, AgregarFotoInspeccionVehiculoVariables>): UseDataConnectMutationResult<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
export function useAgregarFotoInspeccionVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<AgregarFotoInspeccionVehiculoData, FirebaseError, AgregarFotoInspeccionVehiculoVariables>): UseDataConnectMutationResult<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

export function useCrearComanda(options?: useDataConnectMutationOptions<CrearComandaData, FirebaseError, CrearComandaVariables>): UseDataConnectMutationResult<CrearComandaData, CrearComandaVariables>;
export function useCrearComanda(dc: DataConnect, options?: useDataConnectMutationOptions<CrearComandaData, FirebaseError, CrearComandaVariables>): UseDataConnectMutationResult<CrearComandaData, CrearComandaVariables>;

export function useAgregarComandaDetalle(options?: useDataConnectMutationOptions<AgregarComandaDetalleData, FirebaseError, AgregarComandaDetalleVariables>): UseDataConnectMutationResult<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;
export function useAgregarComandaDetalle(dc: DataConnect, options?: useDataConnectMutationOptions<AgregarComandaDetalleData, FirebaseError, AgregarComandaDetalleVariables>): UseDataConnectMutationResult<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;

export function useAnularComanda(options?: useDataConnectMutationOptions<AnularComandaData, FirebaseError, AnularComandaVariables>): UseDataConnectMutationResult<AnularComandaData, AnularComandaVariables>;
export function useAnularComanda(dc: DataConnect, options?: useDataConnectMutationOptions<AnularComandaData, FirebaseError, AnularComandaVariables>): UseDataConnectMutationResult<AnularComandaData, AnularComandaVariables>;

export function useEntregarComanda(options?: useDataConnectMutationOptions<EntregarComandaData, FirebaseError, EntregarComandaVariables>): UseDataConnectMutationResult<EntregarComandaData, EntregarComandaVariables>;
export function useEntregarComanda(dc: DataConnect, options?: useDataConnectMutationOptions<EntregarComandaData, FirebaseError, EntregarComandaVariables>): UseDataConnectMutationResult<EntregarComandaData, EntregarComandaVariables>;

export function useGetRoles(options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;
export function useGetRoles(dc: DataConnect, options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;

export function useGetMiPerfil(options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;
export function useGetMiPerfil(dc: DataConnect, options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;

export function useGetUsuarios(options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;
export function useGetUsuarios(dc: DataConnect, options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;

export function useGetComandaPorQr(vars: GetComandaPorQrVariables, options?: useDataConnectQueryOptions<GetComandaPorQrData>): UseDataConnectQueryResult<GetComandaPorQrData, GetComandaPorQrVariables>;
export function useGetComandaPorQr(dc: DataConnect, vars: GetComandaPorQrVariables, options?: useDataConnectQueryOptions<GetComandaPorQrData>): UseDataConnectQueryResult<GetComandaPorQrData, GetComandaPorQrVariables>;

export function useGetInsumoPorQr(vars: GetInsumoPorQrVariables, options?: useDataConnectQueryOptions<GetInsumoPorQrData>): UseDataConnectQueryResult<GetInsumoPorQrData, GetInsumoPorQrVariables>;
export function useGetInsumoPorQr(dc: DataConnect, vars: GetInsumoPorQrVariables, options?: useDataConnectQueryOptions<GetInsumoPorQrData>): UseDataConnectQueryResult<GetInsumoPorQrData, GetInsumoPorQrVariables>;

export function useGetVehiculos(options?: useDataConnectQueryOptions<GetVehiculosData>): UseDataConnectQueryResult<GetVehiculosData, undefined>;
export function useGetVehiculos(dc: DataConnect, options?: useDataConnectQueryOptions<GetVehiculosData>): UseDataConnectQueryResult<GetVehiculosData, undefined>;

export function useGetMisSalidasVehiculo(options?: useDataConnectQueryOptions<GetMisSalidasVehiculoData>): UseDataConnectQueryResult<GetMisSalidasVehiculoData, undefined>;
export function useGetMisSalidasVehiculo(dc: DataConnect, options?: useDataConnectQueryOptions<GetMisSalidasVehiculoData>): UseDataConnectQueryResult<GetMisSalidasVehiculoData, undefined>;

export function useGetComandas(options?: useDataConnectQueryOptions<GetComandasData>): UseDataConnectQueryResult<GetComandasData, undefined>;
export function useGetComandas(dc: DataConnect, options?: useDataConnectQueryOptions<GetComandasData>): UseDataConnectQueryResult<GetComandasData, undefined>;

export function useGetComandaDetalle(vars: GetComandaDetalleVariables, options?: useDataConnectQueryOptions<GetComandaDetalleData>): UseDataConnectQueryResult<GetComandaDetalleData, GetComandaDetalleVariables>;
export function useGetComandaDetalle(dc: DataConnect, vars: GetComandaDetalleVariables, options?: useDataConnectQueryOptions<GetComandaDetalleData>): UseDataConnectQueryResult<GetComandaDetalleData, GetComandaDetalleVariables>;

export function useGetCatalogosComanda(options?: useDataConnectQueryOptions<GetCatalogosComandaData>): UseDataConnectQueryResult<GetCatalogosComandaData, undefined>;
export function useGetCatalogosComanda(dc: DataConnect, options?: useDataConnectQueryOptions<GetCatalogosComandaData>): UseDataConnectQueryResult<GetCatalogosComandaData, undefined>;
