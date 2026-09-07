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

const UnidadCobro = {
  PRENDA: "PRENDA",
  KILO: "KILO",
}
exports.UnidadCobro = UnidadCobro;

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

const crearClienteComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearClienteComanda', inputVars);
}
crearClienteComandaRef.operationName = 'CrearClienteComanda';
exports.crearClienteComandaRef = crearClienteComandaRef;

exports.crearClienteComanda = function crearClienteComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearClienteComandaRef(dcInstance, inputVars));
}
;

const editarFichaClienteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EditarFichaCliente', inputVars);
}
editarFichaClienteRef.operationName = 'EditarFichaCliente';
exports.editarFichaClienteRef = editarFichaClienteRef;

exports.editarFichaCliente = function editarFichaCliente(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(editarFichaClienteRef(dcInstance, inputVars));
}
;

const crearComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearComanda', inputVars);
}
crearComandaRef.operationName = 'CrearComanda';
exports.crearComandaRef = crearComandaRef;

exports.crearComanda = function crearComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearComandaRef(dcInstance, inputVars));
}
;

const agregarComandaDetalleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AgregarComandaDetalle', inputVars);
}
agregarComandaDetalleRef.operationName = 'AgregarComandaDetalle';
exports.agregarComandaDetalleRef = agregarComandaDetalleRef;

exports.agregarComandaDetalle = function agregarComandaDetalle(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(agregarComandaDetalleRef(dcInstance, inputVars));
}
;

const anularComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AnularComanda', inputVars);
}
anularComandaRef.operationName = 'AnularComanda';
exports.anularComandaRef = anularComandaRef;

exports.anularComanda = function anularComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(anularComandaRef(dcInstance, inputVars));
}
;

const entregarComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EntregarComanda', inputVars);
}
entregarComandaRef.operationName = 'EntregarComanda';
exports.entregarComandaRef = entregarComandaRef;

exports.entregarComanda = function entregarComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(entregarComandaRef(dcInstance, inputVars));
}
;

const editarComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EditarComanda', inputVars);
}
editarComandaRef.operationName = 'EditarComanda';
exports.editarComandaRef = editarComandaRef;

exports.editarComanda = function editarComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(editarComandaRef(dcInstance, inputVars));
}
;

const eliminarDetallesComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'EliminarDetallesComanda', inputVars);
}
eliminarDetallesComandaRef.operationName = 'EliminarDetallesComanda';
exports.eliminarDetallesComandaRef = eliminarDetallesComandaRef;

exports.eliminarDetallesComanda = function eliminarDetallesComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(eliminarDetallesComandaRef(dcInstance, inputVars));
}
;

const crearTipoPrendaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearTipoPrenda', inputVars);
}
crearTipoPrendaRef.operationName = 'CrearTipoPrenda';
exports.crearTipoPrendaRef = crearTipoPrendaRef;

exports.crearTipoPrenda = function crearTipoPrenda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearTipoPrendaRef(dcInstance, inputVars));
}
;

const crearTipoServicioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CrearTipoServicio', inputVars);
}
crearTipoServicioRef.operationName = 'CrearTipoServicio';
exports.crearTipoServicioRef = crearTipoServicioRef;

exports.crearTipoServicio = function crearTipoServicio(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(crearTipoServicioRef(dcInstance, inputVars));
}
;

const asociarFlujoComandaPendienteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AsociarFlujoComandaPendiente', inputVars);
}
asociarFlujoComandaPendienteRef.operationName = 'AsociarFlujoComandaPendiente';
exports.asociarFlujoComandaPendienteRef = asociarFlujoComandaPendienteRef;

exports.asociarFlujoComandaPendiente = function asociarFlujoComandaPendiente(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(asociarFlujoComandaPendienteRef(dcInstance, inputVars));
}
;

const configurarEtapaProduccionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ConfigurarEtapaProduccion', inputVars);
}
configurarEtapaProduccionRef.operationName = 'ConfigurarEtapaProduccion';
exports.configurarEtapaProduccionRef = configurarEtapaProduccionRef;

exports.configurarEtapaProduccion = function configurarEtapaProduccion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(configurarEtapaProduccionRef(dcInstance, inputVars));
}
;

const completarEtapaComandaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompletarEtapaComanda', inputVars);
}
completarEtapaComandaRef.operationName = 'CompletarEtapaComanda';
exports.completarEtapaComandaRef = completarEtapaComandaRef;

exports.completarEtapaComanda = function completarEtapaComanda(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completarEtapaComandaRef(dcInstance, inputVars));
}
;

const getEtapasProduccionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEtapasProduccion');
}
getEtapasProduccionRef.operationName = 'GetEtapasProduccion';
exports.getEtapasProduccionRef = getEtapasProduccionRef;

exports.getEtapasProduccion = function getEtapasProduccion(dcOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getEtapasProduccionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getSeguimientoProduccionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSeguimientoProduccion', inputVars);
}
getSeguimientoProduccionRef.operationName = 'GetSeguimientoProduccion';
exports.getSeguimientoProduccionRef = getSeguimientoProduccionRef;

exports.getSeguimientoProduccion = function getSeguimientoProduccion(dcOrVars, varsOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(getSeguimientoProduccionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMiComandaGuardadaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMiComandaGuardada', inputVars);
}
getMiComandaGuardadaRef.operationName = 'GetMiComandaGuardada';
exports.getMiComandaGuardadaRef = getMiComandaGuardadaRef;

exports.getMiComandaGuardada = function getMiComandaGuardada(dcOrVars, varsOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMiComandaGuardadaRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
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

const getComandasPaginadasRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComandasPaginadas', inputVars);
}
getComandasPaginadasRef.operationName = 'GetComandasPaginadas';
exports.getComandasPaginadasRef = getComandasPaginadasRef;

exports.getComandasPaginadas = function getComandasPaginadas(dcOrVars, varsOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(getComandasPaginadasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getComandasActivasCountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComandasActivasCount');
}
getComandasActivasCountRef.operationName = 'GetComandasActivasCount';
exports.getComandasActivasCountRef = getComandasActivasCountRef;

exports.getComandasActivasCount = function getComandasActivasCount(dcOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getComandasActivasCountRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getComandaDetalleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetComandaDetalle', inputVars);
}
getComandaDetalleRef.operationName = 'GetComandaDetalle';
exports.getComandaDetalleRef = getComandaDetalleRef;

exports.getComandaDetalle = function getComandaDetalle(dcOrVars, varsOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getComandaDetalleRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCatalogosComandaRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCatalogosComanda');
}
getCatalogosComandaRef.operationName = 'GetCatalogosComanda';
exports.getCatalogosComandaRef = getCatalogosComandaRef;

exports.getCatalogosComanda = function getCatalogosComanda(dcOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getCatalogosComandaRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const diagnosticoComandasRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DiagnosticoComandas');
}
diagnosticoComandasRef.operationName = 'DiagnosticoComandas';
exports.diagnosticoComandasRef = diagnosticoComandasRef;

exports.diagnosticoComandas = function diagnosticoComandas(dcOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(diagnosticoComandasRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getFichasClientesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFichasClientes');
}
getFichasClientesRef.operationName = 'GetFichasClientes';
exports.getFichasClientesRef = getFichasClientesRef;

exports.getFichasClientes = function getFichasClientes(dcOrOptions, options) {

  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getFichasClientesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
