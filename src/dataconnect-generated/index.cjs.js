const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

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
