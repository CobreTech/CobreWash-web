import { RegistrarseData, RegistrarseVariables, RegistrarseComoClienteData, RegistrarseComoClienteVariables, ActualizarUsuarioData, ActualizarUsuarioVariables, GetRolesData, GetMiPerfilData, GetUsuariosData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useRegistrarse(options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;
export function useRegistrarse(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;

export function useRegistrarseComoCliente(options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
export function useRegistrarseComoCliente(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

export function useActualizarUsuario(options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;
export function useActualizarUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;

export function useGetRoles(options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;
export function useGetRoles(dc: DataConnect, options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;

export function useGetMiPerfil(options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;
export function useGetMiPerfil(dc: DataConnect, options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;

export function useGetUsuarios(options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;
export function useGetUsuarios(dc: DataConnect, options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;
