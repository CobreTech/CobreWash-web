# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetRoles*](#getroles)
  - [*GetMiPerfil*](#getmiperfil)
  - [*GetUsuarios*](#getusuarios)
  - [*GetComandaPorQr*](#getcomandaporqr)
  - [*GetInsumoPorQr*](#getinsumoporqr)
  - [*GetVehiculos*](#getvehiculos)
  - [*GetMisSalidasVehiculo*](#getmissalidasvehiculo)
  - [*GetComandas*](#getcomandas)
  - [*GetComandaDetalle*](#getcomandadetalle)
  - [*GetCatalogosComanda*](#getcatalogoscomanda)
- [**Mutations**](#mutations)
  - [*Registrarse*](#registrarse)
  - [*CrearUsuarioAdministrado*](#crearusuarioadministrado)
  - [*RegistrarseComoCliente*](#registrarsecomocliente)
  - [*CrearClienteAdministrado*](#crearclienteadministrado)
  - [*ActualizarUsuario*](#actualizarusuario)
  - [*CrearVehiculo*](#crearvehiculo)
  - [*ActualizarVehiculo*](#actualizarvehiculo)
  - [*CrearSalidaVehiculo*](#crearsalidavehiculo)
  - [*RegistrarInspeccionAntes*](#registrarinspeccionantes)
  - [*IniciarSalidaVehiculo*](#iniciarsalidavehiculo)
  - [*RegistrarInspeccionDespues*](#registrarinspecciondespues)
  - [*AgregarFotoInspeccionVehiculo*](#agregarfotoinspeccionvehiculo)
  - [*CrearComanda*](#crearcomanda)
  - [*AgregarComandaDetalle*](#agregarcomandadetalle)
  - [*AnularComanda*](#anularcomanda)
  - [*EntregarComanda*](#entregarcomanda)
  - [*EditarComanda*](#editarcomanda)
  - [*EliminarDetallesComanda*](#eliminardetallescomanda)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetRoles
You can execute the `GetRoles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRoles(options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetRolesData, undefined>;

interface GetRolesRef {
  ...
  (dc: DataConnect): QueryRef<GetRolesData, undefined>;
}
export const getRolesRef: GetRolesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRolesRef:
```typescript
const name = getRolesRef.operationName;
console.log(name);
```

### Variables
The `GetRoles` query has no variables.
### Return Type
Recall that executing the `GetRoles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRolesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetRolesData {
  rols: ({
    id: UUIDString;
    nombre: string;
    descripcion?: string | null;
  } & Rol_Key)[];
}
```
### Using `GetRoles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoles } from '@dataconnect/generated';


// Call the `getRoles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoles(dataConnect);

console.log(data.rols);

// Or, you can use the `Promise` API.
getRoles().then((response) => {
  const data = response.data;
  console.log(data.rols);
});
```

### Using `GetRoles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRolesRef } from '@dataconnect/generated';


// Call the `getRolesRef()` function to get a reference to the query.
const ref = getRolesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRolesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rols);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rols);
});
```

## GetMiPerfil
You can execute the `GetMiPerfil` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMiPerfil(options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;

interface GetMiPerfilRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMiPerfilData, undefined>;
}
export const getMiPerfilRef: GetMiPerfilRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMiPerfil(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMiPerfilData, undefined>;

interface GetMiPerfilRef {
  ...
  (dc: DataConnect): QueryRef<GetMiPerfilData, undefined>;
}
export const getMiPerfilRef: GetMiPerfilRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMiPerfilRef:
```typescript
const name = getMiPerfilRef.operationName;
console.log(name);
```

### Variables
The `GetMiPerfil` query has no variables.
### Return Type
Recall that executing the `GetMiPerfil` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMiPerfilData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMiPerfil`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMiPerfil } from '@dataconnect/generated';


// Call the `getMiPerfil()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMiPerfil();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMiPerfil(dataConnect);

console.log(data.usuario);

// Or, you can use the `Promise` API.
getMiPerfil().then((response) => {
  const data = response.data;
  console.log(data.usuario);
});
```

### Using `GetMiPerfil`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMiPerfilRef } from '@dataconnect/generated';


// Call the `getMiPerfilRef()` function to get a reference to the query.
const ref = getMiPerfilRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMiPerfilRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuario);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario);
});
```

## GetUsuarios
You can execute the `GetUsuarios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUsuarios(options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;

interface GetUsuariosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUsuariosData, undefined>;
}
export const getUsuariosRef: GetUsuariosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUsuarios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUsuariosData, undefined>;

interface GetUsuariosRef {
  ...
  (dc: DataConnect): QueryRef<GetUsuariosData, undefined>;
}
export const getUsuariosRef: GetUsuariosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUsuariosRef:
```typescript
const name = getUsuariosRef.operationName;
console.log(name);
```

### Variables
The `GetUsuarios` query has no variables.
### Return Type
Recall that executing the `GetUsuarios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUsuariosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUsuarios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUsuarios } from '@dataconnect/generated';


// Call the `getUsuarios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUsuarios();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUsuarios(dataConnect);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
getUsuarios().then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

### Using `GetUsuarios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUsuariosRef } from '@dataconnect/generated';


// Call the `getUsuariosRef()` function to get a reference to the query.
const ref = getUsuariosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUsuariosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.usuarios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.usuarios);
});
```

## GetComandaPorQr
You can execute the `GetComandaPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaPorQr(vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;

interface GetComandaPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
}
export const getComandaPorQrRef: GetComandaPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaPorQr(dc: DataConnect, vars: GetComandaPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaPorQrData, GetComandaPorQrVariables>;

interface GetComandaPorQrRef {
  ...
  (dc: DataConnect, vars: GetComandaPorQrVariables): QueryRef<GetComandaPorQrData, GetComandaPorQrVariables>;
}
export const getComandaPorQrRef: GetComandaPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaPorQrRef:
```typescript
const name = getComandaPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetComandaPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaPorQr, GetComandaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`:
const getComandaPorQrVars: GetComandaPorQrVariables = {
  codigoQr: ..., 
};

// Call the `getComandaPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaPorQr(getComandaPorQrVars);
// Variables can be defined inline as well.
const { data } = await getComandaPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaPorQr(dataConnect, getComandaPorQrVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaPorQr(getComandaPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaPorQrRef, GetComandaPorQrVariables } from '@dataconnect/generated';

// The `GetComandaPorQr` query requires an argument of type `GetComandaPorQrVariables`:
const getComandaPorQrVars: GetComandaPorQrVariables = {
  codigoQr: ..., 
};

// Call the `getComandaPorQrRef()` function to get a reference to the query.
const ref = getComandaPorQrRef(getComandaPorQrVars);
// Variables can be defined inline as well.
const ref = getComandaPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaPorQrRef(dataConnect, getComandaPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetInsumoPorQr
You can execute the `GetInsumoPorQr` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getInsumoPorQr(vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;

interface GetInsumoPorQrRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
}
export const getInsumoPorQrRef: GetInsumoPorQrRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInsumoPorQr(dc: DataConnect, vars: GetInsumoPorQrVariables, options?: ExecuteQueryOptions): QueryPromise<GetInsumoPorQrData, GetInsumoPorQrVariables>;

interface GetInsumoPorQrRef {
  ...
  (dc: DataConnect, vars: GetInsumoPorQrVariables): QueryRef<GetInsumoPorQrData, GetInsumoPorQrVariables>;
}
export const getInsumoPorQrRef: GetInsumoPorQrRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInsumoPorQrRef:
```typescript
const name = getInsumoPorQrRef.operationName;
console.log(name);
```

### Variables
The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInsumoPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that executing the `GetInsumoPorQr` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInsumoPorQrData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetInsumoPorQr`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInsumoPorQr, GetInsumoPorQrVariables } from '@dataconnect/generated';

// The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`:
const getInsumoPorQrVars: GetInsumoPorQrVariables = {
  codigoQr: ..., 
};

// Call the `getInsumoPorQr()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInsumoPorQr(getInsumoPorQrVars);
// Variables can be defined inline as well.
const { data } = await getInsumoPorQr({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInsumoPorQr(dataConnect, getInsumoPorQrVars);

console.log(data.insumo);

// Or, you can use the `Promise` API.
getInsumoPorQr(getInsumoPorQrVars).then((response) => {
  const data = response.data;
  console.log(data.insumo);
});
```

### Using `GetInsumoPorQr`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInsumoPorQrRef, GetInsumoPorQrVariables } from '@dataconnect/generated';

// The `GetInsumoPorQr` query requires an argument of type `GetInsumoPorQrVariables`:
const getInsumoPorQrVars: GetInsumoPorQrVariables = {
  codigoQr: ..., 
};

// Call the `getInsumoPorQrRef()` function to get a reference to the query.
const ref = getInsumoPorQrRef(getInsumoPorQrVars);
// Variables can be defined inline as well.
const ref = getInsumoPorQrRef({ codigoQr: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInsumoPorQrRef(dataConnect, getInsumoPorQrVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.insumo);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.insumo);
});
```

## GetVehiculos
You can execute the `GetVehiculos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVehiculos(options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;

interface GetVehiculosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetVehiculosData, undefined>;
}
export const getVehiculosRef: GetVehiculosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVehiculos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetVehiculosData, undefined>;

interface GetVehiculosRef {
  ...
  (dc: DataConnect): QueryRef<GetVehiculosData, undefined>;
}
export const getVehiculosRef: GetVehiculosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVehiculosRef:
```typescript
const name = getVehiculosRef.operationName;
console.log(name);
```

### Variables
The `GetVehiculos` query has no variables.
### Return Type
Recall that executing the `GetVehiculos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVehiculosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetVehiculos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVehiculos } from '@dataconnect/generated';


// Call the `getVehiculos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVehiculos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVehiculos(dataConnect);

console.log(data.vehiculos);

// Or, you can use the `Promise` API.
getVehiculos().then((response) => {
  const data = response.data;
  console.log(data.vehiculos);
});
```

### Using `GetVehiculos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVehiculosRef } from '@dataconnect/generated';


// Call the `getVehiculosRef()` function to get a reference to the query.
const ref = getVehiculosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVehiculosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehiculos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculos);
});
```

## GetMisSalidasVehiculo
You can execute the `GetMisSalidasVehiculo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMisSalidasVehiculo(options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;

interface GetMisSalidasVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMisSalidasVehiculoData, undefined>;
}
export const getMisSalidasVehiculoRef: GetMisSalidasVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMisSalidasVehiculo(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMisSalidasVehiculoData, undefined>;

interface GetMisSalidasVehiculoRef {
  ...
  (dc: DataConnect): QueryRef<GetMisSalidasVehiculoData, undefined>;
}
export const getMisSalidasVehiculoRef: GetMisSalidasVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMisSalidasVehiculoRef:
```typescript
const name = getMisSalidasVehiculoRef.operationName;
console.log(name);
```

### Variables
The `GetMisSalidasVehiculo` query has no variables.
### Return Type
Recall that executing the `GetMisSalidasVehiculo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMisSalidasVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMisSalidasVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMisSalidasVehiculo } from '@dataconnect/generated';


// Call the `getMisSalidasVehiculo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMisSalidasVehiculo();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMisSalidasVehiculo(dataConnect);

console.log(data.salidaVehiculos);

// Or, you can use the `Promise` API.
getMisSalidasVehiculo().then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculos);
});
```

### Using `GetMisSalidasVehiculo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMisSalidasVehiculoRef } from '@dataconnect/generated';


// Call the `getMisSalidasVehiculoRef()` function to get a reference to the query.
const ref = getMisSalidasVehiculoRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMisSalidasVehiculoRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.salidaVehiculos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculos);
});
```

## GetComandas
You can execute the `GetComandas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandas(options?: ExecuteQueryOptions): QueryPromise<GetComandasData, undefined>;

interface GetComandasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetComandasData, undefined>;
}
export const getComandasRef: GetComandasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetComandasData, undefined>;

interface GetComandasRef {
  ...
  (dc: DataConnect): QueryRef<GetComandasData, undefined>;
}
export const getComandasRef: GetComandasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandasRef:
```typescript
const name = getComandasRef.operationName;
console.log(name);
```

### Variables
The `GetComandas` query has no variables.
### Return Type
Recall that executing the `GetComandas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandasData {
  comandas: ({
    id: UUIDString;
    numeroComanda: string;
    codigoQr: UUIDString;
    estado: ComandaEstado;
    valorTotal: number;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    observaciones?: string | null;
    motivoAnulacion?: string | null;
    cliente: {
      id: UUIDString;
      nombre: string;
      telefono?: string | null;
      email?: string | null;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key;
    comandaDetalles_on_comanda: ({
      cantidad: number;
      precioUnitario: number;
      tipoPrenda: {
        nombre: string;
      };
      tipoServicio: {
        nombre: string;
      };
    })[];
  } & Comanda_Key)[];
}
```
### Using `GetComandas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandas } from '@dataconnect/generated';


// Call the `getComandas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandas(dataConnect);

console.log(data.comandas);

// Or, you can use the `Promise` API.
getComandas().then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

### Using `GetComandas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandasRef } from '@dataconnect/generated';


// Call the `getComandasRef()` function to get a reference to the query.
const ref = getComandasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comandas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comandas);
});
```

## GetComandaDetalle
You can execute the `GetComandaDetalle` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getComandaDetalle(vars: GetComandaDetalleVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleData, GetComandaDetalleVariables>;

interface GetComandaDetalleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetComandaDetalleVariables): QueryRef<GetComandaDetalleData, GetComandaDetalleVariables>;
}
export const getComandaDetalleRef: GetComandaDetalleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getComandaDetalle(dc: DataConnect, vars: GetComandaDetalleVariables, options?: ExecuteQueryOptions): QueryPromise<GetComandaDetalleData, GetComandaDetalleVariables>;

interface GetComandaDetalleRef {
  ...
  (dc: DataConnect, vars: GetComandaDetalleVariables): QueryRef<GetComandaDetalleData, GetComandaDetalleVariables>;
}
export const getComandaDetalleRef: GetComandaDetalleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getComandaDetalleRef:
```typescript
const name = getComandaDetalleRef.operationName;
console.log(name);
```

### Variables
The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetComandaDetalleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetComandaDetalle` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetComandaDetalleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetComandaDetalleData {
  comanda?: {
    id: UUIDString;
    numeroComanda: string;
    estado: ComandaEstado;
    valorTotal: number;
    observaciones?: string | null;
    motivoAnulacion?: string | null;
    fechaRecepcion: TimestampString;
    fechaEntregaEstimada?: TimestampString | null;
    cliente: {
      id: UUIDString;
      nombre: string;
      telefono?: string | null;
      email?: string | null;
      tipoCliente: TipoCliente;
      direccion?: string | null;
    } & Cliente_Key;
    comandaDetalles_on_comanda: ({
      id: UUIDString;
      cantidad: number;
      pesoKg?: number | null;
      precioUnitario: number;
      subtotal: number;
      tipoPrenda: {
        id: UUIDString;
        nombre: string;
      } & TipoPrenda_Key;
      tipoServicio: {
        id: UUIDString;
        nombre: string;
      } & TipoServicio_Key;
    } & ComandaDetalle_Key)[];
    comandaHistorialEstados_on_comanda: ({
      id: UUIDString;
      estadoAnterior?: ComandaEstado | null;
      estadoNuevo: ComandaEstado;
      fecha: TimestampString;
      motivo?: string | null;
      usuario?: {
        nombre: string;
      };
    } & ComandaHistorialEstado_Key)[];
  } & Comanda_Key;
}
```
### Using `GetComandaDetalle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalle, GetComandaDetalleVariables } from '@dataconnect/generated';

// The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`:
const getComandaDetalleVars: GetComandaDetalleVariables = {
  id: ..., 
};

// Call the `getComandaDetalle()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getComandaDetalle(getComandaDetalleVars);
// Variables can be defined inline as well.
const { data } = await getComandaDetalle({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getComandaDetalle(dataConnect, getComandaDetalleVars);

console.log(data.comanda);

// Or, you can use the `Promise` API.
getComandaDetalle(getComandaDetalleVars).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

### Using `GetComandaDetalle`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getComandaDetalleRef, GetComandaDetalleVariables } from '@dataconnect/generated';

// The `GetComandaDetalle` query requires an argument of type `GetComandaDetalleVariables`:
const getComandaDetalleVars: GetComandaDetalleVariables = {
  id: ..., 
};

// Call the `getComandaDetalleRef()` function to get a reference to the query.
const ref = getComandaDetalleRef(getComandaDetalleVars);
// Variables can be defined inline as well.
const ref = getComandaDetalleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getComandaDetalleRef(dataConnect, getComandaDetalleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.comanda);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda);
});
```

## GetCatalogosComanda
You can execute the `GetCatalogosComanda` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCatalogosComanda(options?: ExecuteQueryOptions): QueryPromise<GetCatalogosComandaData, undefined>;

interface GetCatalogosComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCatalogosComandaData, undefined>;
}
export const getCatalogosComandaRef: GetCatalogosComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCatalogosComanda(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCatalogosComandaData, undefined>;

interface GetCatalogosComandaRef {
  ...
  (dc: DataConnect): QueryRef<GetCatalogosComandaData, undefined>;
}
export const getCatalogosComandaRef: GetCatalogosComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCatalogosComandaRef:
```typescript
const name = getCatalogosComandaRef.operationName;
console.log(name);
```

### Variables
The `GetCatalogosComanda` query has no variables.
### Return Type
Recall that executing the `GetCatalogosComanda` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCatalogosComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCatalogosComandaData {
  tipoServicios: ({
    id: UUIDString;
    nombre: string;
    precioBase: number;
    unidadCobro: UnidadCobro;
  } & TipoServicio_Key)[];
  tipoPrendas: ({
    id: UUIDString;
    nombre: string;
  } & TipoPrenda_Key)[];
  clientes: ({
    id: UUIDString;
    nombre: string;
    tipoCliente: TipoCliente;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
  } & Cliente_Key)[];
}
```
### Using `GetCatalogosComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCatalogosComanda } from '@dataconnect/generated';


// Call the `getCatalogosComanda()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCatalogosComanda();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCatalogosComanda(dataConnect);

console.log(data.tipoServicios);
console.log(data.tipoPrendas);
console.log(data.clientes);

// Or, you can use the `Promise` API.
getCatalogosComanda().then((response) => {
  const data = response.data;
  console.log(data.tipoServicios);
  console.log(data.tipoPrendas);
  console.log(data.clientes);
});
```

### Using `GetCatalogosComanda`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCatalogosComandaRef } from '@dataconnect/generated';


// Call the `getCatalogosComandaRef()` function to get a reference to the query.
const ref = getCatalogosComandaRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCatalogosComandaRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tipoServicios);
console.log(data.tipoPrendas);
console.log(data.clientes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tipoServicios);
  console.log(data.tipoPrendas);
  console.log(data.clientes);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## Registrarse
You can execute the `Registrarse` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarse(vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;

interface RegistrarseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
}
export const registrarseRef: RegistrarseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarse(dc: DataConnect, vars: RegistrarseVariables): MutationPromise<RegistrarseData, RegistrarseVariables>;

interface RegistrarseRef {
  ...
  (dc: DataConnect, vars: RegistrarseVariables): MutationRef<RegistrarseData, RegistrarseVariables>;
}
export const registrarseRef: RegistrarseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarseRef:
```typescript
const name = registrarseRef.operationName;
console.log(name);
```

### Variables
The `Registrarse` mutation requires an argument of type `RegistrarseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarseVariables {
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}
```
### Return Type
Recall that executing the `Registrarse` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarseData {
  usuario_insert: Usuario_Key;
}
```
### Using `Registrarse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarse, RegistrarseVariables } from '@dataconnect/generated';

// The `Registrarse` mutation requires an argument of type `RegistrarseVariables`:
const registrarseVars: RegistrarseVariables = {
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
};

// Call the `registrarse()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarse(registrarseVars);
// Variables can be defined inline as well.
const { data } = await registrarse({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarse(dataConnect, registrarseVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
registrarse(registrarseVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `Registrarse`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarseRef, RegistrarseVariables } from '@dataconnect/generated';

// The `Registrarse` mutation requires an argument of type `RegistrarseVariables`:
const registrarseVars: RegistrarseVariables = {
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
};

// Call the `registrarseRef()` function to get a reference to the mutation.
const ref = registrarseRef(registrarseVars);
// Variables can be defined inline as well.
const ref = registrarseRef({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarseRef(dataConnect, registrarseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## CrearUsuarioAdministrado
You can execute the `CrearUsuarioAdministrado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearUsuarioAdministrado(vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

interface CrearUsuarioAdministradoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
}
export const crearUsuarioAdministradoRef: CrearUsuarioAdministradoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearUsuarioAdministrado(dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationPromise<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;

interface CrearUsuarioAdministradoRef {
  ...
  (dc: DataConnect, vars: CrearUsuarioAdministradoVariables): MutationRef<CrearUsuarioAdministradoData, CrearUsuarioAdministradoVariables>;
}
export const crearUsuarioAdministradoRef: CrearUsuarioAdministradoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearUsuarioAdministradoRef:
```typescript
const name = crearUsuarioAdministradoRef.operationName;
console.log(name);
```

### Variables
The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearUsuarioAdministradoVariables {
  id: string;
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
}
```
### Return Type
Recall that executing the `CrearUsuarioAdministrado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearUsuarioAdministradoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearUsuarioAdministradoData {
  usuario_insert: Usuario_Key;
}
```
### Using `CrearUsuarioAdministrado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearUsuarioAdministrado, CrearUsuarioAdministradoVariables } from '@dataconnect/generated';

// The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`:
const crearUsuarioAdministradoVars: CrearUsuarioAdministradoVariables = {
  id: ..., 
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
};

// Call the `crearUsuarioAdministrado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearUsuarioAdministrado(crearUsuarioAdministradoVars);
// Variables can be defined inline as well.
const { data } = await crearUsuarioAdministrado({ id: ..., rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearUsuarioAdministrado(dataConnect, crearUsuarioAdministradoVars);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
crearUsuarioAdministrado(crearUsuarioAdministradoVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

### Using `CrearUsuarioAdministrado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearUsuarioAdministradoRef, CrearUsuarioAdministradoVariables } from '@dataconnect/generated';

// The `CrearUsuarioAdministrado` mutation requires an argument of type `CrearUsuarioAdministradoVariables`:
const crearUsuarioAdministradoVars: CrearUsuarioAdministradoVariables = {
  id: ..., 
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
};

// Call the `crearUsuarioAdministradoRef()` function to get a reference to the mutation.
const ref = crearUsuarioAdministradoRef(crearUsuarioAdministradoVars);
// Variables can be defined inline as well.
const ref = crearUsuarioAdministradoRef({ id: ..., rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearUsuarioAdministradoRef(dataConnect, crearUsuarioAdministradoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
});
```

## RegistrarseComoCliente
You can execute the `RegistrarseComoCliente` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarseComoCliente(vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

interface RegistrarseComoClienteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
}
export const registrarseComoClienteRef: RegistrarseComoClienteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarseComoCliente(dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationPromise<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;

interface RegistrarseComoClienteRef {
  ...
  (dc: DataConnect, vars: RegistrarseComoClienteVariables): MutationRef<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
}
export const registrarseComoClienteRef: RegistrarseComoClienteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarseComoClienteRef:
```typescript
const name = registrarseComoClienteRef.operationName;
console.log(name);
```

### Variables
The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarseComoClienteVariables {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
  tipoCliente: TipoCliente;
}
```
### Return Type
Recall that executing the `RegistrarseComoCliente` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarseComoClienteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarseComoClienteData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}
```
### Using `RegistrarseComoCliente`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarseComoCliente, RegistrarseComoClienteVariables } from '@dataconnect/generated';

// The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`:
const registrarseComoClienteVars: RegistrarseComoClienteVariables = {
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
  tipoCliente: ..., 
};

// Call the `registrarseComoCliente()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarseComoCliente(registrarseComoClienteVars);
// Variables can be defined inline as well.
const { data } = await registrarseComoCliente({ rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarseComoCliente(dataConnect, registrarseComoClienteVars);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
registrarseComoCliente(registrarseComoClienteVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

### Using `RegistrarseComoCliente`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarseComoClienteRef, RegistrarseComoClienteVariables } from '@dataconnect/generated';

// The `RegistrarseComoCliente` mutation requires an argument of type `RegistrarseComoClienteVariables`:
const registrarseComoClienteVars: RegistrarseComoClienteVariables = {
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
  tipoCliente: ..., 
};

// Call the `registrarseComoClienteRef()` function to get a reference to the mutation.
const ref = registrarseComoClienteRef(registrarseComoClienteVars);
// Variables can be defined inline as well.
const ref = registrarseComoClienteRef({ rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarseComoClienteRef(dataConnect, registrarseComoClienteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

## CrearClienteAdministrado
You can execute the `CrearClienteAdministrado` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearClienteAdministrado(vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

interface CrearClienteAdministradoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
}
export const crearClienteAdministradoRef: CrearClienteAdministradoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearClienteAdministrado(dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationPromise<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;

interface CrearClienteAdministradoRef {
  ...
  (dc: DataConnect, vars: CrearClienteAdministradoVariables): MutationRef<CrearClienteAdministradoData, CrearClienteAdministradoVariables>;
}
export const crearClienteAdministradoRef: CrearClienteAdministradoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearClienteAdministradoRef:
```typescript
const name = crearClienteAdministradoRef.operationName;
console.log(name);
```

### Variables
The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CrearClienteAdministrado` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearClienteAdministradoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearClienteAdministradoData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}
```
### Using `CrearClienteAdministrado`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearClienteAdministrado, CrearClienteAdministradoVariables } from '@dataconnect/generated';

// The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`:
const crearClienteAdministradoVars: CrearClienteAdministradoVariables = {
  id: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
  tipoCliente: ..., 
};

// Call the `crearClienteAdministrado()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearClienteAdministrado(crearClienteAdministradoVars);
// Variables can be defined inline as well.
const { data } = await crearClienteAdministrado({ id: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearClienteAdministrado(dataConnect, crearClienteAdministradoVars);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
crearClienteAdministrado(crearClienteAdministradoVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

### Using `CrearClienteAdministrado`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearClienteAdministradoRef, CrearClienteAdministradoVariables } from '@dataconnect/generated';

// The `CrearClienteAdministrado` mutation requires an argument of type `CrearClienteAdministradoVariables`:
const crearClienteAdministradoVars: CrearClienteAdministradoVariables = {
  id: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
  tipoCliente: ..., 
};

// Call the `crearClienteAdministradoRef()` function to get a reference to the mutation.
const ref = crearClienteAdministradoRef(crearClienteAdministradoVars);
// Variables can be defined inline as well.
const ref = crearClienteAdministradoRef({ id: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearClienteAdministradoRef(dataConnect, crearClienteAdministradoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_insert);
console.log(data.cliente_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_insert);
  console.log(data.cliente_insert);
});
```

## ActualizarUsuario
You can execute the `ActualizarUsuario` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarUsuario(vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;

interface ActualizarUsuarioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
}
export const actualizarUsuarioRef: ActualizarUsuarioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarUsuario(dc: DataConnect, vars: ActualizarUsuarioVariables): MutationPromise<ActualizarUsuarioData, ActualizarUsuarioVariables>;

interface ActualizarUsuarioRef {
  ...
  (dc: DataConnect, vars: ActualizarUsuarioVariables): MutationRef<ActualizarUsuarioData, ActualizarUsuarioVariables>;
}
export const actualizarUsuarioRef: ActualizarUsuarioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarUsuarioRef:
```typescript
const name = actualizarUsuarioRef.operationName;
console.log(name);
```

### Variables
The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarUsuarioVariables {
  id: string;
  rolId: UUIDString;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  activo: boolean;
}
```
### Return Type
Recall that executing the `ActualizarUsuario` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarUsuarioData {
  usuario_update?: Usuario_Key | null;
}
```
### Using `ActualizarUsuario`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarUsuario, ActualizarUsuarioVariables } from '@dataconnect/generated';

// The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`:
const actualizarUsuarioVars: ActualizarUsuarioVariables = {
  id: ..., 
  rolId: ..., 
  nombre: ..., 
  apellido: ..., // optional
  telefono: ..., // optional
  activo: ..., 
};

// Call the `actualizarUsuario()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarUsuario(actualizarUsuarioVars);
// Variables can be defined inline as well.
const { data } = await actualizarUsuario({ id: ..., rolId: ..., nombre: ..., apellido: ..., telefono: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarUsuario(dataConnect, actualizarUsuarioVars);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
actualizarUsuario(actualizarUsuarioVars).then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

### Using `ActualizarUsuario`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarUsuarioRef, ActualizarUsuarioVariables } from '@dataconnect/generated';

// The `ActualizarUsuario` mutation requires an argument of type `ActualizarUsuarioVariables`:
const actualizarUsuarioVars: ActualizarUsuarioVariables = {
  id: ..., 
  rolId: ..., 
  nombre: ..., 
  apellido: ..., // optional
  telefono: ..., // optional
  activo: ..., 
};

// Call the `actualizarUsuarioRef()` function to get a reference to the mutation.
const ref = actualizarUsuarioRef(actualizarUsuarioVars);
// Variables can be defined inline as well.
const ref = actualizarUsuarioRef({ id: ..., rolId: ..., nombre: ..., apellido: ..., telefono: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarUsuarioRef(dataConnect, actualizarUsuarioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.usuario_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.usuario_update);
});
```

## CrearVehiculo
You can execute the `CrearVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearVehiculo(vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;

interface CrearVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
}
export const crearVehiculoRef: CrearVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearVehiculo(dc: DataConnect, vars: CrearVehiculoVariables): MutationPromise<CrearVehiculoData, CrearVehiculoVariables>;

interface CrearVehiculoRef {
  ...
  (dc: DataConnect, vars: CrearVehiculoVariables): MutationRef<CrearVehiculoData, CrearVehiculoVariables>;
}
export const crearVehiculoRef: CrearVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearVehiculoRef:
```typescript
const name = crearVehiculoRef.operationName;
console.log(name);
```

### Variables
The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearVehiculoVariables {
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
}
```
### Return Type
Recall that executing the `CrearVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearVehiculoData {
  vehiculo_insert: Vehiculo_Key;
}
```
### Using `CrearVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearVehiculo, CrearVehiculoVariables } from '@dataconnect/generated';

// The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`:
const crearVehiculoVars: CrearVehiculoVariables = {
  patente: ..., 
  marca: ..., 
  modelo: ..., 
  anio: ..., // optional
  descripcion: ..., // optional
};

// Call the `crearVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearVehiculo(crearVehiculoVars);
// Variables can be defined inline as well.
const { data } = await crearVehiculo({ patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearVehiculo(dataConnect, crearVehiculoVars);

console.log(data.vehiculo_insert);

// Or, you can use the `Promise` API.
crearVehiculo(crearVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_insert);
});
```

### Using `CrearVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearVehiculoRef, CrearVehiculoVariables } from '@dataconnect/generated';

// The `CrearVehiculo` mutation requires an argument of type `CrearVehiculoVariables`:
const crearVehiculoVars: CrearVehiculoVariables = {
  patente: ..., 
  marca: ..., 
  modelo: ..., 
  anio: ..., // optional
  descripcion: ..., // optional
};

// Call the `crearVehiculoRef()` function to get a reference to the mutation.
const ref = crearVehiculoRef(crearVehiculoVars);
// Variables can be defined inline as well.
const ref = crearVehiculoRef({ patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearVehiculoRef(dataConnect, crearVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_insert);
});
```

## ActualizarVehiculo
You can execute the `ActualizarVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
actualizarVehiculo(vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;

interface ActualizarVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
}
export const actualizarVehiculoRef: ActualizarVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
actualizarVehiculo(dc: DataConnect, vars: ActualizarVehiculoVariables): MutationPromise<ActualizarVehiculoData, ActualizarVehiculoVariables>;

interface ActualizarVehiculoRef {
  ...
  (dc: DataConnect, vars: ActualizarVehiculoVariables): MutationRef<ActualizarVehiculoData, ActualizarVehiculoVariables>;
}
export const actualizarVehiculoRef: ActualizarVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the actualizarVehiculoRef:
```typescript
const name = actualizarVehiculoRef.operationName;
console.log(name);
```

### Variables
The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ActualizarVehiculoVariables {
  id: UUIDString;
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
  activo: boolean;
}
```
### Return Type
Recall that executing the `ActualizarVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ActualizarVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ActualizarVehiculoData {
  vehiculo_update?: Vehiculo_Key | null;
}
```
### Using `ActualizarVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, actualizarVehiculo, ActualizarVehiculoVariables } from '@dataconnect/generated';

// The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`:
const actualizarVehiculoVars: ActualizarVehiculoVariables = {
  id: ..., 
  patente: ..., 
  marca: ..., 
  modelo: ..., 
  anio: ..., // optional
  descripcion: ..., // optional
  activo: ..., 
};

// Call the `actualizarVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await actualizarVehiculo(actualizarVehiculoVars);
// Variables can be defined inline as well.
const { data } = await actualizarVehiculo({ id: ..., patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await actualizarVehiculo(dataConnect, actualizarVehiculoVars);

console.log(data.vehiculo_update);

// Or, you can use the `Promise` API.
actualizarVehiculo(actualizarVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_update);
});
```

### Using `ActualizarVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, actualizarVehiculoRef, ActualizarVehiculoVariables } from '@dataconnect/generated';

// The `ActualizarVehiculo` mutation requires an argument of type `ActualizarVehiculoVariables`:
const actualizarVehiculoVars: ActualizarVehiculoVariables = {
  id: ..., 
  patente: ..., 
  marca: ..., 
  modelo: ..., 
  anio: ..., // optional
  descripcion: ..., // optional
  activo: ..., 
};

// Call the `actualizarVehiculoRef()` function to get a reference to the mutation.
const ref = actualizarVehiculoRef(actualizarVehiculoVars);
// Variables can be defined inline as well.
const ref = actualizarVehiculoRef({ id: ..., patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., activo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = actualizarVehiculoRef(dataConnect, actualizarVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehiculo_update);
});
```

## CrearSalidaVehiculo
You can execute the `CrearSalidaVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearSalidaVehiculo(vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

interface CrearSalidaVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
}
export const crearSalidaVehiculoRef: CrearSalidaVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearSalidaVehiculo(dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationPromise<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;

interface CrearSalidaVehiculoRef {
  ...
  (dc: DataConnect, vars: CrearSalidaVehiculoVariables): MutationRef<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
}
export const crearSalidaVehiculoRef: CrearSalidaVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearSalidaVehiculoRef:
```typescript
const name = crearSalidaVehiculoRef.operationName;
console.log(name);
```

### Variables
The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearSalidaVehiculoVariables {
  vehiculoId: UUIDString;
  repartidorId: string;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `CrearSalidaVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearSalidaVehiculoData {
  salidaVehiculo_insert: SalidaVehiculo_Key;
}
```
### Using `CrearSalidaVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearSalidaVehiculo, CrearSalidaVehiculoVariables } from '@dataconnect/generated';

// The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`:
const crearSalidaVehiculoVars: CrearSalidaVehiculoVariables = {
  vehiculoId: ..., 
  repartidorId: ..., 
  observaciones: ..., // optional
};

// Call the `crearSalidaVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearSalidaVehiculo(crearSalidaVehiculoVars);
// Variables can be defined inline as well.
const { data } = await crearSalidaVehiculo({ vehiculoId: ..., repartidorId: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearSalidaVehiculo(dataConnect, crearSalidaVehiculoVars);

console.log(data.salidaVehiculo_insert);

// Or, you can use the `Promise` API.
crearSalidaVehiculo(crearSalidaVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_insert);
});
```

### Using `CrearSalidaVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearSalidaVehiculoRef, CrearSalidaVehiculoVariables } from '@dataconnect/generated';

// The `CrearSalidaVehiculo` mutation requires an argument of type `CrearSalidaVehiculoVariables`:
const crearSalidaVehiculoVars: CrearSalidaVehiculoVariables = {
  vehiculoId: ..., 
  repartidorId: ..., 
  observaciones: ..., // optional
};

// Call the `crearSalidaVehiculoRef()` function to get a reference to the mutation.
const ref = crearSalidaVehiculoRef(crearSalidaVehiculoVars);
// Variables can be defined inline as well.
const ref = crearSalidaVehiculoRef({ vehiculoId: ..., repartidorId: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearSalidaVehiculoRef(dataConnect, crearSalidaVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.salidaVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_insert);
});
```

## RegistrarInspeccionAntes
You can execute the `RegistrarInspeccionAntes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarInspeccionAntes(vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

interface RegistrarInspeccionAntesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
}
export const registrarInspeccionAntesRef: RegistrarInspeccionAntesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarInspeccionAntes(dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationPromise<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;

interface RegistrarInspeccionAntesRef {
  ...
  (dc: DataConnect, vars: RegistrarInspeccionAntesVariables): MutationRef<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
}
export const registrarInspeccionAntesRef: RegistrarInspeccionAntesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarInspeccionAntesRef:
```typescript
const name = registrarInspeccionAntesRef.operationName;
console.log(name);
```

### Variables
The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarInspeccionAntesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarInspeccionAntes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarInspeccionAntesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarInspeccionAntesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
}
```
### Using `RegistrarInspeccionAntes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionAntes, RegistrarInspeccionAntesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`:
const registrarInspeccionAntesVars: RegistrarInspeccionAntesVariables = {
  salidaId: ..., 
  estadoVehiculo: ..., 
  kilometraje: ..., 
  observaciones: ..., // optional
};

// Call the `registrarInspeccionAntes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarInspeccionAntes(registrarInspeccionAntesVars);
// Variables can be defined inline as well.
const { data } = await registrarInspeccionAntes({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarInspeccionAntes(dataConnect, registrarInspeccionAntesVars);

console.log(data.inspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
registrarInspeccionAntes(registrarInspeccionAntesVars).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
});
```

### Using `RegistrarInspeccionAntes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionAntesRef, RegistrarInspeccionAntesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionAntes` mutation requires an argument of type `RegistrarInspeccionAntesVariables`:
const registrarInspeccionAntesVars: RegistrarInspeccionAntesVariables = {
  salidaId: ..., 
  estadoVehiculo: ..., 
  kilometraje: ..., 
  observaciones: ..., // optional
};

// Call the `registrarInspeccionAntesRef()` function to get a reference to the mutation.
const ref = registrarInspeccionAntesRef(registrarInspeccionAntesVars);
// Variables can be defined inline as well.
const ref = registrarInspeccionAntesRef({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarInspeccionAntesRef(dataConnect, registrarInspeccionAntesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
});
```

## IniciarSalidaVehiculo
You can execute the `IniciarSalidaVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
iniciarSalidaVehiculo(vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

interface IniciarSalidaVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
}
export const iniciarSalidaVehiculoRef: IniciarSalidaVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
iniciarSalidaVehiculo(dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationPromise<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;

interface IniciarSalidaVehiculoRef {
  ...
  (dc: DataConnect, vars: IniciarSalidaVehiculoVariables): MutationRef<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
}
export const iniciarSalidaVehiculoRef: IniciarSalidaVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the iniciarSalidaVehiculoRef:
```typescript
const name = iniciarSalidaVehiculoRef.operationName;
console.log(name);
```

### Variables
The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface IniciarSalidaVehiculoVariables {
  salidaId: UUIDString;
}
```
### Return Type
Recall that executing the `IniciarSalidaVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `IniciarSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface IniciarSalidaVehiculoData {
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```
### Using `IniciarSalidaVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, iniciarSalidaVehiculo, IniciarSalidaVehiculoVariables } from '@dataconnect/generated';

// The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`:
const iniciarSalidaVehiculoVars: IniciarSalidaVehiculoVariables = {
  salidaId: ..., 
};

// Call the `iniciarSalidaVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await iniciarSalidaVehiculo(iniciarSalidaVehiculoVars);
// Variables can be defined inline as well.
const { data } = await iniciarSalidaVehiculo({ salidaId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await iniciarSalidaVehiculo(dataConnect, iniciarSalidaVehiculoVars);

console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
iniciarSalidaVehiculo(iniciarSalidaVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_update);
});
```

### Using `IniciarSalidaVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, iniciarSalidaVehiculoRef, IniciarSalidaVehiculoVariables } from '@dataconnect/generated';

// The `IniciarSalidaVehiculo` mutation requires an argument of type `IniciarSalidaVehiculoVariables`:
const iniciarSalidaVehiculoVars: IniciarSalidaVehiculoVariables = {
  salidaId: ..., 
};

// Call the `iniciarSalidaVehiculoRef()` function to get a reference to the mutation.
const ref = iniciarSalidaVehiculoRef(iniciarSalidaVehiculoVars);
// Variables can be defined inline as well.
const ref = iniciarSalidaVehiculoRef({ salidaId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = iniciarSalidaVehiculoRef(dataConnect, iniciarSalidaVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.salidaVehiculo_update);
});
```

## RegistrarInspeccionDespues
You can execute the `RegistrarInspeccionDespues` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registrarInspeccionDespues(vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

interface RegistrarInspeccionDespuesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
}
export const registrarInspeccionDespuesRef: RegistrarInspeccionDespuesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registrarInspeccionDespues(dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationPromise<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;

interface RegistrarInspeccionDespuesRef {
  ...
  (dc: DataConnect, vars: RegistrarInspeccionDespuesVariables): MutationRef<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
}
export const registrarInspeccionDespuesRef: RegistrarInspeccionDespuesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registrarInspeccionDespuesRef:
```typescript
const name = registrarInspeccionDespuesRef.operationName;
console.log(name);
```

### Variables
The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegistrarInspeccionDespuesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `RegistrarInspeccionDespues` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegistrarInspeccionDespuesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegistrarInspeccionDespuesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```
### Using `RegistrarInspeccionDespues`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionDespues, RegistrarInspeccionDespuesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`:
const registrarInspeccionDespuesVars: RegistrarInspeccionDespuesVariables = {
  salidaId: ..., 
  estadoVehiculo: ..., 
  kilometraje: ..., 
  observaciones: ..., // optional
};

// Call the `registrarInspeccionDespues()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarInspeccionDespues(registrarInspeccionDespuesVars);
// Variables can be defined inline as well.
const { data } = await registrarInspeccionDespues({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registrarInspeccionDespues(dataConnect, registrarInspeccionDespuesVars);

console.log(data.inspeccionVehiculo_insert);
console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
registrarInspeccionDespues(registrarInspeccionDespuesVars).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
  console.log(data.salidaVehiculo_update);
});
```

### Using `RegistrarInspeccionDespues`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registrarInspeccionDespuesRef, RegistrarInspeccionDespuesVariables } from '@dataconnect/generated';

// The `RegistrarInspeccionDespues` mutation requires an argument of type `RegistrarInspeccionDespuesVariables`:
const registrarInspeccionDespuesVars: RegistrarInspeccionDespuesVariables = {
  salidaId: ..., 
  estadoVehiculo: ..., 
  kilometraje: ..., 
  observaciones: ..., // optional
};

// Call the `registrarInspeccionDespuesRef()` function to get a reference to the mutation.
const ref = registrarInspeccionDespuesRef(registrarInspeccionDespuesVars);
// Variables can be defined inline as well.
const ref = registrarInspeccionDespuesRef({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registrarInspeccionDespuesRef(dataConnect, registrarInspeccionDespuesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inspeccionVehiculo_insert);
console.log(data.salidaVehiculo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inspeccionVehiculo_insert);
  console.log(data.salidaVehiculo_update);
});
```

## AgregarFotoInspeccionVehiculo
You can execute the `AgregarFotoInspeccionVehiculo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agregarFotoInspeccionVehiculo(vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

interface AgregarFotoInspeccionVehiculoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
}
export const agregarFotoInspeccionVehiculoRef: AgregarFotoInspeccionVehiculoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agregarFotoInspeccionVehiculo(dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationPromise<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;

interface AgregarFotoInspeccionVehiculoRef {
  ...
  (dc: DataConnect, vars: AgregarFotoInspeccionVehiculoVariables): MutationRef<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
}
export const agregarFotoInspeccionVehiculoRef: AgregarFotoInspeccionVehiculoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agregarFotoInspeccionVehiculoRef:
```typescript
const name = agregarFotoInspeccionVehiculoRef.operationName;
console.log(name);
```

### Variables
The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgregarFotoInspeccionVehiculoVariables {
  inspeccionId: UUIDString;
  rutaStorage: string;
  descripcion?: string | null;
  orden: number;
}
```
### Return Type
Recall that executing the `AgregarFotoInspeccionVehiculo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgregarFotoInspeccionVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgregarFotoInspeccionVehiculoData {
  fotoInspeccionVehiculo_insert: FotoInspeccionVehiculo_Key;
}
```
### Using `AgregarFotoInspeccionVehiculo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agregarFotoInspeccionVehiculo, AgregarFotoInspeccionVehiculoVariables } from '@dataconnect/generated';

// The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`:
const agregarFotoInspeccionVehiculoVars: AgregarFotoInspeccionVehiculoVariables = {
  inspeccionId: ..., 
  rutaStorage: ..., 
  descripcion: ..., // optional
  orden: ..., 
};

// Call the `agregarFotoInspeccionVehiculo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agregarFotoInspeccionVehiculo(agregarFotoInspeccionVehiculoVars);
// Variables can be defined inline as well.
const { data } = await agregarFotoInspeccionVehiculo({ inspeccionId: ..., rutaStorage: ..., descripcion: ..., orden: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agregarFotoInspeccionVehiculo(dataConnect, agregarFotoInspeccionVehiculoVars);

console.log(data.fotoInspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
agregarFotoInspeccionVehiculo(agregarFotoInspeccionVehiculoVars).then((response) => {
  const data = response.data;
  console.log(data.fotoInspeccionVehiculo_insert);
});
```

### Using `AgregarFotoInspeccionVehiculo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agregarFotoInspeccionVehiculoRef, AgregarFotoInspeccionVehiculoVariables } from '@dataconnect/generated';

// The `AgregarFotoInspeccionVehiculo` mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`:
const agregarFotoInspeccionVehiculoVars: AgregarFotoInspeccionVehiculoVariables = {
  inspeccionId: ..., 
  rutaStorage: ..., 
  descripcion: ..., // optional
  orden: ..., 
};

// Call the `agregarFotoInspeccionVehiculoRef()` function to get a reference to the mutation.
const ref = agregarFotoInspeccionVehiculoRef(agregarFotoInspeccionVehiculoVars);
// Variables can be defined inline as well.
const ref = agregarFotoInspeccionVehiculoRef({ inspeccionId: ..., rutaStorage: ..., descripcion: ..., orden: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agregarFotoInspeccionVehiculoRef(dataConnect, agregarFotoInspeccionVehiculoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.fotoInspeccionVehiculo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.fotoInspeccionVehiculo_insert);
});
```

## CrearComanda
You can execute the `CrearComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
crearComanda(vars: CrearComandaVariables): MutationPromise<CrearComandaData, CrearComandaVariables>;

interface CrearComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CrearComandaVariables): MutationRef<CrearComandaData, CrearComandaVariables>;
}
export const crearComandaRef: CrearComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
crearComanda(dc: DataConnect, vars: CrearComandaVariables): MutationPromise<CrearComandaData, CrearComandaVariables>;

interface CrearComandaRef {
  ...
  (dc: DataConnect, vars: CrearComandaVariables): MutationRef<CrearComandaData, CrearComandaVariables>;
}
export const crearComandaRef: CrearComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the crearComandaRef:
```typescript
const name = crearComandaRef.operationName;
console.log(name);
```

### Variables
The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CrearComandaVariables {
  numeroComanda: string;
  clienteId: UUIDString;
  valorTotal: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `CrearComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CrearComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CrearComandaData {
  comanda_insert: Comanda_Key;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `CrearComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, crearComanda, CrearComandaVariables } from '@dataconnect/generated';

// The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`:
const crearComandaVars: CrearComandaVariables = {
  numeroComanda: ..., 
  clienteId: ..., 
  valorTotal: ..., 
  observaciones: ..., // optional
};

// Call the `crearComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await crearComanda(crearComandaVars);
// Variables can be defined inline as well.
const { data } = await crearComanda({ numeroComanda: ..., clienteId: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await crearComanda(dataConnect, crearComandaVars);

console.log(data.comanda_insert);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
crearComanda(crearComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_insert);
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `CrearComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, crearComandaRef, CrearComandaVariables } from '@dataconnect/generated';

// The `CrearComanda` mutation requires an argument of type `CrearComandaVariables`:
const crearComandaVars: CrearComandaVariables = {
  numeroComanda: ..., 
  clienteId: ..., 
  valorTotal: ..., 
  observaciones: ..., // optional
};

// Call the `crearComandaRef()` function to get a reference to the mutation.
const ref = crearComandaRef(crearComandaVars);
// Variables can be defined inline as well.
const ref = crearComandaRef({ numeroComanda: ..., clienteId: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = crearComandaRef(dataConnect, crearComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_insert);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_insert);
  console.log(data.comandaHistorialEstado_insert);
});
```

## AgregarComandaDetalle
You can execute the `AgregarComandaDetalle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
agregarComandaDetalle(vars: AgregarComandaDetalleVariables): MutationPromise<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;

interface AgregarComandaDetalleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AgregarComandaDetalleVariables): MutationRef<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;
}
export const agregarComandaDetalleRef: AgregarComandaDetalleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
agregarComandaDetalle(dc: DataConnect, vars: AgregarComandaDetalleVariables): MutationPromise<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;

interface AgregarComandaDetalleRef {
  ...
  (dc: DataConnect, vars: AgregarComandaDetalleVariables): MutationRef<AgregarComandaDetalleData, AgregarComandaDetalleVariables>;
}
export const agregarComandaDetalleRef: AgregarComandaDetalleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the agregarComandaDetalleRef:
```typescript
const name = agregarComandaDetalleRef.operationName;
console.log(name);
```

### Variables
The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AgregarComandaDetalleVariables {
  comandaId: UUIDString;
  tipoPrendaId: UUIDString;
  tipoServicioId: UUIDString;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
```
### Return Type
Recall that executing the `AgregarComandaDetalle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AgregarComandaDetalleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AgregarComandaDetalleData {
  comandaDetalle_insert: ComandaDetalle_Key;
}
```
### Using `AgregarComandaDetalle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, agregarComandaDetalle, AgregarComandaDetalleVariables } from '@dataconnect/generated';

// The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`:
const agregarComandaDetalleVars: AgregarComandaDetalleVariables = {
  comandaId: ..., 
  tipoPrendaId: ..., 
  tipoServicioId: ..., 
  cantidad: ..., 
  precioUnitario: ..., 
  subtotal: ..., 
};

// Call the `agregarComandaDetalle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await agregarComandaDetalle(agregarComandaDetalleVars);
// Variables can be defined inline as well.
const { data } = await agregarComandaDetalle({ comandaId: ..., tipoPrendaId: ..., tipoServicioId: ..., cantidad: ..., precioUnitario: ..., subtotal: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await agregarComandaDetalle(dataConnect, agregarComandaDetalleVars);

console.log(data.comandaDetalle_insert);

// Or, you can use the `Promise` API.
agregarComandaDetalle(agregarComandaDetalleVars).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_insert);
});
```

### Using `AgregarComandaDetalle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, agregarComandaDetalleRef, AgregarComandaDetalleVariables } from '@dataconnect/generated';

// The `AgregarComandaDetalle` mutation requires an argument of type `AgregarComandaDetalleVariables`:
const agregarComandaDetalleVars: AgregarComandaDetalleVariables = {
  comandaId: ..., 
  tipoPrendaId: ..., 
  tipoServicioId: ..., 
  cantidad: ..., 
  precioUnitario: ..., 
  subtotal: ..., 
};

// Call the `agregarComandaDetalleRef()` function to get a reference to the mutation.
const ref = agregarComandaDetalleRef(agregarComandaDetalleVars);
// Variables can be defined inline as well.
const ref = agregarComandaDetalleRef({ comandaId: ..., tipoPrendaId: ..., tipoServicioId: ..., cantidad: ..., precioUnitario: ..., subtotal: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = agregarComandaDetalleRef(dataConnect, agregarComandaDetalleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaDetalle_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_insert);
});
```

## AnularComanda
You can execute the `AnularComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
anularComanda(vars: AnularComandaVariables): MutationPromise<AnularComandaData, AnularComandaVariables>;

interface AnularComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AnularComandaVariables): MutationRef<AnularComandaData, AnularComandaVariables>;
}
export const anularComandaRef: AnularComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
anularComanda(dc: DataConnect, vars: AnularComandaVariables): MutationPromise<AnularComandaData, AnularComandaVariables>;

interface AnularComandaRef {
  ...
  (dc: DataConnect, vars: AnularComandaVariables): MutationRef<AnularComandaData, AnularComandaVariables>;
}
export const anularComandaRef: AnularComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the anularComandaRef:
```typescript
const name = anularComandaRef.operationName;
console.log(name);
```

### Variables
The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AnularComandaVariables {
  id: UUIDString;
  motivoAnulacion: string;
}
```
### Return Type
Recall that executing the `AnularComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AnularComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AnularComandaData {
  comanda_update?: Comanda_Key | null;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `AnularComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, anularComanda, AnularComandaVariables } from '@dataconnect/generated';

// The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`:
const anularComandaVars: AnularComandaVariables = {
  id: ..., 
  motivoAnulacion: ..., 
};

// Call the `anularComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await anularComanda(anularComandaVars);
// Variables can be defined inline as well.
const { data } = await anularComanda({ id: ..., motivoAnulacion: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await anularComanda(dataConnect, anularComandaVars);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
anularComanda(anularComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `AnularComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, anularComandaRef, AnularComandaVariables } from '@dataconnect/generated';

// The `AnularComanda` mutation requires an argument of type `AnularComandaVariables`:
const anularComandaVars: AnularComandaVariables = {
  id: ..., 
  motivoAnulacion: ..., 
};

// Call the `anularComandaRef()` function to get a reference to the mutation.
const ref = anularComandaRef(anularComandaVars);
// Variables can be defined inline as well.
const ref = anularComandaRef({ id: ..., motivoAnulacion: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = anularComandaRef(dataConnect, anularComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

## EntregarComanda
You can execute the `EntregarComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
entregarComanda(vars: EntregarComandaVariables): MutationPromise<EntregarComandaData, EntregarComandaVariables>;

interface EntregarComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EntregarComandaVariables): MutationRef<EntregarComandaData, EntregarComandaVariables>;
}
export const entregarComandaRef: EntregarComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
entregarComanda(dc: DataConnect, vars: EntregarComandaVariables): MutationPromise<EntregarComandaData, EntregarComandaVariables>;

interface EntregarComandaRef {
  ...
  (dc: DataConnect, vars: EntregarComandaVariables): MutationRef<EntregarComandaData, EntregarComandaVariables>;
}
export const entregarComandaRef: EntregarComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the entregarComandaRef:
```typescript
const name = entregarComandaRef.operationName;
console.log(name);
```

### Variables
The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EntregarComandaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `EntregarComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EntregarComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EntregarComandaData {
  comanda_update?: Comanda_Key | null;
  comandaHistorialEstado_insert: ComandaHistorialEstado_Key;
}
```
### Using `EntregarComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, entregarComanda, EntregarComandaVariables } from '@dataconnect/generated';

// The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`:
const entregarComandaVars: EntregarComandaVariables = {
  id: ..., 
};

// Call the `entregarComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await entregarComanda(entregarComandaVars);
// Variables can be defined inline as well.
const { data } = await entregarComanda({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await entregarComanda(dataConnect, entregarComandaVars);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
entregarComanda(entregarComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

### Using `EntregarComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, entregarComandaRef, EntregarComandaVariables } from '@dataconnect/generated';

// The `EntregarComanda` mutation requires an argument of type `EntregarComandaVariables`:
const entregarComandaVars: EntregarComandaVariables = {
  id: ..., 
};

// Call the `entregarComandaRef()` function to get a reference to the mutation.
const ref = entregarComandaRef(entregarComandaVars);
// Variables can be defined inline as well.
const ref = entregarComandaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = entregarComandaRef(dataConnect, entregarComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);
console.log(data.comandaHistorialEstado_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
  console.log(data.comandaHistorialEstado_insert);
});
```

## EditarComanda
You can execute the `EditarComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
editarComanda(vars: EditarComandaVariables): MutationPromise<EditarComandaData, EditarComandaVariables>;

interface EditarComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EditarComandaVariables): MutationRef<EditarComandaData, EditarComandaVariables>;
}
export const editarComandaRef: EditarComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
editarComanda(dc: DataConnect, vars: EditarComandaVariables): MutationPromise<EditarComandaData, EditarComandaVariables>;

interface EditarComandaRef {
  ...
  (dc: DataConnect, vars: EditarComandaVariables): MutationRef<EditarComandaData, EditarComandaVariables>;
}
export const editarComandaRef: EditarComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the editarComandaRef:
```typescript
const name = editarComandaRef.operationName;
console.log(name);
```

### Variables
The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EditarComandaVariables {
  id: UUIDString;
  valorTotal: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that executing the `EditarComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EditarComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EditarComandaData {
  comanda_update?: Comanda_Key | null;
}
```
### Using `EditarComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, editarComanda, EditarComandaVariables } from '@dataconnect/generated';

// The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`:
const editarComandaVars: EditarComandaVariables = {
  id: ..., 
  valorTotal: ..., 
  observaciones: ..., // optional
};

// Call the `editarComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await editarComanda(editarComandaVars);
// Variables can be defined inline as well.
const { data } = await editarComanda({ id: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await editarComanda(dataConnect, editarComandaVars);

console.log(data.comanda_update);

// Or, you can use the `Promise` API.
editarComanda(editarComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
});
```

### Using `EditarComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, editarComandaRef, EditarComandaVariables } from '@dataconnect/generated';

// The `EditarComanda` mutation requires an argument of type `EditarComandaVariables`:
const editarComandaVars: EditarComandaVariables = {
  id: ..., 
  valorTotal: ..., 
  observaciones: ..., // optional
};

// Call the `editarComandaRef()` function to get a reference to the mutation.
const ref = editarComandaRef(editarComandaVars);
// Variables can be defined inline as well.
const ref = editarComandaRef({ id: ..., valorTotal: ..., observaciones: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = editarComandaRef(dataConnect, editarComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comanda_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comanda_update);
});
```

## EliminarDetallesComanda
You can execute the `EliminarDetallesComanda` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
eliminarDetallesComanda(vars: EliminarDetallesComandaVariables): MutationPromise<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;

interface EliminarDetallesComandaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: EliminarDetallesComandaVariables): MutationRef<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;
}
export const eliminarDetallesComandaRef: EliminarDetallesComandaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
eliminarDetallesComanda(dc: DataConnect, vars: EliminarDetallesComandaVariables): MutationPromise<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;

interface EliminarDetallesComandaRef {
  ...
  (dc: DataConnect, vars: EliminarDetallesComandaVariables): MutationRef<EliminarDetallesComandaData, EliminarDetallesComandaVariables>;
}
export const eliminarDetallesComandaRef: EliminarDetallesComandaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the eliminarDetallesComandaRef:
```typescript
const name = eliminarDetallesComandaRef.operationName;
console.log(name);
```

### Variables
The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface EliminarDetallesComandaVariables {
  comandaId: UUIDString;
}
```
### Return Type
Recall that executing the `EliminarDetallesComanda` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `EliminarDetallesComandaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface EliminarDetallesComandaData {
  comandaDetalle_deleteMany: number;
}
```
### Using `EliminarDetallesComanda`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, eliminarDetallesComanda, EliminarDetallesComandaVariables } from '@dataconnect/generated';

// The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`:
const eliminarDetallesComandaVars: EliminarDetallesComandaVariables = {
  comandaId: ..., 
};

// Call the `eliminarDetallesComanda()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await eliminarDetallesComanda(eliminarDetallesComandaVars);
// Variables can be defined inline as well.
const { data } = await eliminarDetallesComanda({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await eliminarDetallesComanda(dataConnect, eliminarDetallesComandaVars);

console.log(data.comandaDetalle_deleteMany);

// Or, you can use the `Promise` API.
eliminarDetallesComanda(eliminarDetallesComandaVars).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_deleteMany);
});
```

### Using `EliminarDetallesComanda`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, eliminarDetallesComandaRef, EliminarDetallesComandaVariables } from '@dataconnect/generated';

// The `EliminarDetallesComanda` mutation requires an argument of type `EliminarDetallesComandaVariables`:
const eliminarDetallesComandaVars: EliminarDetallesComandaVariables = {
  comandaId: ..., 
};

// Call the `eliminarDetallesComandaRef()` function to get a reference to the mutation.
const ref = eliminarDetallesComandaRef(eliminarDetallesComandaVars);
// Variables can be defined inline as well.
const ref = eliminarDetallesComandaRef({ comandaId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = eliminarDetallesComandaRef(dataConnect, eliminarDetallesComandaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comandaDetalle_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comandaDetalle_deleteMany);
});
```

