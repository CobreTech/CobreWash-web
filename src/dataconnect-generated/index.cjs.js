const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const ComandaEstado = {
  PENDIENTE: "PENDIENTE",
  EN_PROCESO: "EN_PROCESO",
  FINALIZADA: "FINALIZADA",
  ENTREGADA: "ENTREGADA",
  ANULADA: "ANULADA",
}
exports.ComandaEstado = ComandaEstado;

const EstadoVehiculo = {
  APTO: "APTO",
  CON_OBSERVACIONES: "CON_OBSERVACIONES",
  NO_APTO: "NO_APTO",
}
exports.EstadoVehiculo = EstadoVehiculo;

const SalidaVehiculoEstado = {
  PROGRAMADA: "PROGRAMADA",
  EN_SERVICIO: "EN_SERVICIO",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
}
exports.SalidaVehiculoEstado = SalidaVehiculoEstado;

const TipoCliente = {
  HOTEL: "HOTEL",
  PARTICULAR: "PARTICULAR",
}
exports.TipoCliente = TipoCliente;

const connectorConfig = {
  connector: 'example',
  service: 'lavanderia-el-cobre',
  location: 'southamerica-west1'
};
exports.connectorConfig = connectorConfig;

const registrarseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'Registrarse', inputVars);
}
registrarseRef.operationName = 'Registrarse';
exports.registrarseRef = registrarseRef;

exports.registrarse = function registrarse(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarseRef(dcInstance, inputVars));
}
;

const crearUsuarioAdministradoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearUsuarioAdministrado', inputVars);
}
crearUsuarioAdministradoRef.operationName = 'CrearUsuarioAdministrado';
exports.crearUsuarioAdministradoRef = crearUsuarioAdministradoRef;

exports.crearUsuarioAdministrado = function crearUsuarioAdministrado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearUsuarioAdministradoRef(dcInstance, inputVars));
}
;

const registrarseComoClienteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarseComoCliente', inputVars);
}
registrarseComoClienteRef.operationName = 'RegistrarseComoCliente';
exports.registrarseComoClienteRef = registrarseComoClienteRef;

exports.registrarseComoCliente = function registrarseComoCliente(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarseComoClienteRef(dcInstance, inputVars));
}
;

const crearClienteAdministradoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearClienteAdministrado', inputVars);
}
crearClienteAdministradoRef.operationName = 'CrearClienteAdministrado';
exports.crearClienteAdministradoRef = crearClienteAdministradoRef;

exports.crearClienteAdministrado = function crearClienteAdministrado(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearClienteAdministradoRef(dcInstance, inputVars));
}
;

const actualizarUsuarioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActualizarUsuario', inputVars);
}
actualizarUsuarioRef.operationName = 'ActualizarUsuario';
exports.actualizarUsuarioRef = actualizarUsuarioRef;

exports.actualizarUsuario = function actualizarUsuario(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(actualizarUsuarioRef(dcInstance, inputVars));
}
;

const crearVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearVehiculo', inputVars);
}
crearVehiculoRef.operationName = 'CrearVehiculo';
exports.crearVehiculoRef = crearVehiculoRef;

exports.crearVehiculo = function crearVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearVehiculoRef(dcInstance, inputVars));
}
;

const actualizarVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ActualizarVehiculo', inputVars);
}
actualizarVehiculoRef.operationName = 'ActualizarVehiculo';
exports.actualizarVehiculoRef = actualizarVehiculoRef;

exports.actualizarVehiculo = function actualizarVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(actualizarVehiculoRef(dcInstance, inputVars));
}
;

const crearSalidaVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearSalidaVehiculo', inputVars);
}
crearSalidaVehiculoRef.operationName = 'CrearSalidaVehiculo';
exports.crearSalidaVehiculoRef = crearSalidaVehiculoRef;

exports.crearSalidaVehiculo = function crearSalidaVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearSalidaVehiculoRef(dcInstance, inputVars));
}
;

const registrarInspeccionAntesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarInspeccionAntes', inputVars);
}
registrarInspeccionAntesRef.operationName = 'RegistrarInspeccionAntes';
exports.registrarInspeccionAntesRef = registrarInspeccionAntesRef;

exports.registrarInspeccionAntes = function registrarInspeccionAntes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarInspeccionAntesRef(dcInstance, inputVars));
}
;

const iniciarSalidaVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IniciarSalidaVehiculo', inputVars);
}
iniciarSalidaVehiculoRef.operationName = 'IniciarSalidaVehiculo';
exports.iniciarSalidaVehiculoRef = iniciarSalidaVehiculoRef;

exports.iniciarSalidaVehiculo = function iniciarSalidaVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(iniciarSalidaVehiculoRef(dcInstance, inputVars));
}
;

const registrarInspeccionDespuesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegistrarInspeccionDespues', inputVars);
}
registrarInspeccionDespuesRef.operationName = 'RegistrarInspeccionDespues';
exports.registrarInspeccionDespuesRef = registrarInspeccionDespuesRef;

exports.registrarInspeccionDespues = function registrarInspeccionDespues(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registrarInspeccionDespuesRef(dcInstance, inputVars));
}
;

const agregarFotoInspeccionVehiculoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AgregarFotoInspeccionVehiculo', inputVars);
}
agregarFotoInspeccionVehiculoRef.operationName = 'AgregarFotoInspeccionVehiculo';
exports.agregarFotoInspeccionVehiculoRef = agregarFotoInspeccionVehiculoRef;

exports.agregarFotoInspeccionVehiculo = function agregarFotoInspeccionVehiculo(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(agregarFotoInspeccionVehiculoRef(dcInstance, inputVars));
}
;

const getRolesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoles');
}
getRolesRef.operationName = 'GetRoles';
exports.getRolesRef = getRolesRef;

exports.getRoles = function getRoles(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getRolesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMiPerfilRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMiPerfil');
}
getMiPerfilRef.operationName = 'GetMiPerfil';
exports.getMiPerfilRef = getMiPerfilRef;

exports.getMiPerfil = function getMiPerfil(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMiPerfilRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getUsuariosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsuarios');
}
getUsuariosRef.operationName = 'GetUsuarios';
exports.getUsuariosRef = getUsuariosRef;

exports.getUsuarios = function getUsuarios(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getUsuariosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getComandaPorQrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComandaPorQr', inputVars);
}
getComandaPorQrRef.operationName = 'GetComandaPorQr';
exports.getComandaPorQrRef = getComandaPorQrRef;

exports.getComandaPorQr = function getComandaPorQr(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getComandaPorQrRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getInsumoPorQrRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInsumoPorQr', inputVars);
}
getInsumoPorQrRef.operationName = 'GetInsumoPorQr';
exports.getInsumoPorQrRef = getInsumoPorQrRef;

exports.getInsumoPorQr = function getInsumoPorQr(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getInsumoPorQrRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getVehiculosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehiculos');
}
getVehiculosRef.operationName = 'GetVehiculos';
exports.getVehiculosRef = getVehiculosRef;

exports.getVehiculos = function getVehiculos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getVehiculosRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMisSalidasVehiculoRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMisSalidasVehiculo');
}
getMisSalidasVehiculoRef.operationName = 'GetMisSalidasVehiculo';
exports.getMisSalidasVehiculoRef = getMisSalidasVehiculoRef;

exports.getMisSalidasVehiculo = function getMisSalidasVehiculo(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMisSalidasVehiculoRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
