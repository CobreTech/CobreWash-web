import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const ComandaEstado = {
  PENDIENTE: "PENDIENTE",
  EN_PROCESO: "EN_PROCESO",
  FINALIZADA: "FINALIZADA",
  ENTREGADA: "ENTREGADA",
  ANULADA: "ANULADA",
}

export const EstadoVehiculo = {
  APTO: "APTO",
  CON_OBSERVACIONES: "CON_OBSERVACIONES",
  NO_APTO: "NO_APTO",
}

export const SalidaVehiculoEstado = {
  PROGRAMADA: "PROGRAMADA",
  EN_SERVICIO: "EN_SERVICIO",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
}

export const TipoCliente = {
  HOTEL: "HOTEL",
  PARTICULAR: "PARTICULAR",
}

export const connectorConfig = {
  connector: 'example',
  service: 'lavanderia-el-cobre',
  location: 'southamerica-west1'
};
export const registrarseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'Registrarse', inputVars);
}
registrarseRef.operationName = 'Registrarse';

export function registrarse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarseRef(dcInstance, inputVars));
}

export const crearUsuarioAdministradoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearUsuarioAdministrado', inputVars);
}
crearUsuarioAdministradoRef.operationName = 'CrearUsuarioAdministrado';

export function crearUsuarioAdministrado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearUsuarioAdministradoRef(dcInstance, inputVars));
}

export const registrarseComoClienteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarseComoCliente', inputVars);
}
registrarseComoClienteRef.operationName = 'RegistrarseComoCliente';

export function registrarseComoCliente(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarseComoClienteRef(dcInstance, inputVars));
}

export const crearClienteAdministradoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearClienteAdministrado', inputVars);
}
crearClienteAdministradoRef.operationName = 'CrearClienteAdministrado';

export function crearClienteAdministrado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearClienteAdministradoRef(dcInstance, inputVars));
}

export const actualizarUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActualizarUsuario', inputVars);
}
actualizarUsuarioRef.operationName = 'ActualizarUsuario';

export function actualizarUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(actualizarUsuarioRef(dcInstance, inputVars));
}

export const crearVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearVehiculo', inputVars);
}
crearVehiculoRef.operationName = 'CrearVehiculo';

export function crearVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearVehiculoRef(dcInstance, inputVars));
}

export const actualizarVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActualizarVehiculo', inputVars);
}
actualizarVehiculoRef.operationName = 'ActualizarVehiculo';

export function actualizarVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(actualizarVehiculoRef(dcInstance, inputVars));
}

export const crearSalidaVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearSalidaVehiculo', inputVars);
}
crearSalidaVehiculoRef.operationName = 'CrearSalidaVehiculo';

export function crearSalidaVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearSalidaVehiculoRef(dcInstance, inputVars));
}

export const registrarInspeccionAntesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarInspeccionAntes', inputVars);
}
registrarInspeccionAntesRef.operationName = 'RegistrarInspeccionAntes';

export function registrarInspeccionAntes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarInspeccionAntesRef(dcInstance, inputVars));
}

export const iniciarSalidaVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IniciarSalidaVehiculo', inputVars);
}
iniciarSalidaVehiculoRef.operationName = 'IniciarSalidaVehiculo';

export function iniciarSalidaVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(iniciarSalidaVehiculoRef(dcInstance, inputVars));
}

export const registrarInspeccionDespuesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarInspeccionDespues', inputVars);
}
registrarInspeccionDespuesRef.operationName = 'RegistrarInspeccionDespues';

export function registrarInspeccionDespues(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarInspeccionDespuesRef(dcInstance, inputVars));
}

export const agregarFotoInspeccionVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AgregarFotoInspeccionVehiculo', inputVars);
}
agregarFotoInspeccionVehiculoRef.operationName = 'AgregarFotoInspeccionVehiculo';

export function agregarFotoInspeccionVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(agregarFotoInspeccionVehiculoRef(dcInstance, inputVars));
}

export const getRolesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoles');
}
getRolesRef.operationName = 'GetRoles';

export function getRoles(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getRolesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMiPerfilRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMiPerfil');
}
getMiPerfilRef.operationName = 'GetMiPerfil';

export function getMiPerfil(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMiPerfilRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getUsuariosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsuarios');
}
getUsuariosRef.operationName = 'GetUsuarios';

export function getUsuarios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getUsuariosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getComandaPorQrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComandaPorQr', inputVars);
}
getComandaPorQrRef.operationName = 'GetComandaPorQr';

export function getComandaPorQr(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getComandaPorQrRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getInsumoPorQrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInsumoPorQr', inputVars);
}
getInsumoPorQrRef.operationName = 'GetInsumoPorQr';

export function getInsumoPorQr(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInsumoPorQrRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getVehiculosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehiculos');
}
getVehiculosRef.operationName = 'GetVehiculos';

export function getVehiculos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getVehiculosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMisSalidasVehiculoRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMisSalidasVehiculo');
}
getMisSalidasVehiculoRef.operationName = 'GetMisSalidasVehiculo';

export function getMisSalidasVehiculo(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMisSalidasVehiculoRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

