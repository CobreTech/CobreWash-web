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
- [**Mutations**](#mutations)
  - [*Registrarse*](#registrarse)
  - [*RegistrarseComoCliente*](#registrarsecomocliente)
  - [*ActualizarUsuario*](#actualizarusuario)

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
  rolId: UUIDString;
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  email: string;
  direccion?: string | null;
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
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
};

// Call the `registrarseComoCliente()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registrarseComoCliente(registrarseComoClienteVars);
// Variables can be defined inline as well.
const { data } = await registrarseComoCliente({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., });

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
  rolId: ..., 
  rut: ..., 
  nombre: ..., 
  apellido: ..., 
  telefono: ..., // optional
  email: ..., 
  direccion: ..., // optional
};

// Call the `registrarseComoClienteRef()` function to get a reference to the mutation.
const ref = registrarseComoClienteRef(registrarseComoClienteVars);
// Variables can be defined inline as well.
const ref = registrarseComoClienteRef({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., });

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

