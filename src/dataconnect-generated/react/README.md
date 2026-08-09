# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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
- [**Mutations**](#mutations)
  - [*Registrarse*](#registrarse)
  - [*RegistrarseComoCliente*](#registrarsecomocliente)
  - [*ActualizarUsuario*](#actualizarusuario)
  - [*CrearVehiculo*](#crearvehiculo)
  - [*ActualizarVehiculo*](#actualizarvehiculo)
  - [*CrearSalidaVehiculo*](#crearsalidavehiculo)
  - [*RegistrarInspeccionAntes*](#registrarinspeccionantes)
  - [*IniciarSalidaVehiculo*](#iniciarsalidavehiculo)
  - [*RegistrarInspeccionDespues*](#registrarinspecciondespues)
  - [*AgregarFotoInspeccionVehiculo*](#agregarfotoinspeccionvehiculo)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetRoles
You can execute the `GetRoles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetRoles(dc: DataConnect, options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetRoles(options?: useDataConnectQueryOptions<GetRolesData>): UseDataConnectQueryResult<GetRolesData, undefined>;
```

### Variables
The `GetRoles` Query has no variables.
### Return Type
Recall that calling the `GetRoles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetRoles` Query is of type `GetRolesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetRolesData {
  rols: ({
    id: UUIDString;
    nombre: string;
    descripcion?: string | null;
  } & Rol_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetRoles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetRoles } from '@dataconnect/generated/react'

export default function GetRolesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetRoles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetRoles(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetRoles(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetRoles(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.rols);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMiPerfil
You can execute the `GetMiPerfil` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMiPerfil(dc: DataConnect, options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMiPerfil(options?: useDataConnectQueryOptions<GetMiPerfilData>): UseDataConnectQueryResult<GetMiPerfilData, undefined>;
```

### Variables
The `GetMiPerfil` Query has no variables.
### Return Type
Recall that calling the `GetMiPerfil` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMiPerfil` Query is of type `GetMiPerfilData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMiPerfil`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetMiPerfil } from '@dataconnect/generated/react'

export default function GetMiPerfilComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMiPerfil();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMiPerfil(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMiPerfil(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMiPerfil(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.usuario);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUsuarios
You can execute the `GetUsuarios` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUsuarios(dc: DataConnect, options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUsuarios(options?: useDataConnectQueryOptions<GetUsuariosData>): UseDataConnectQueryResult<GetUsuariosData, undefined>;
```

### Variables
The `GetUsuarios` Query has no variables.
### Return Type
Recall that calling the `GetUsuarios` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUsuarios` Query is of type `GetUsuariosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUsuarios`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetUsuarios } from '@dataconnect/generated/react'

export default function GetUsuariosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUsuarios();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUsuarios(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsuarios(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUsuarios(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.usuarios);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetComandaPorQr
You can execute the `GetComandaPorQr` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetComandaPorQr(dc: DataConnect, vars: GetComandaPorQrVariables, options?: useDataConnectQueryOptions<GetComandaPorQrData>): UseDataConnectQueryResult<GetComandaPorQrData, GetComandaPorQrVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetComandaPorQr(vars: GetComandaPorQrVariables, options?: useDataConnectQueryOptions<GetComandaPorQrData>): UseDataConnectQueryResult<GetComandaPorQrData, GetComandaPorQrVariables>;
```

### Variables
The `GetComandaPorQr` Query requires an argument of type `GetComandaPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetComandaPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that calling the `GetComandaPorQr` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetComandaPorQr` Query is of type `GetComandaPorQrData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetComandaPorQr`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetComandaPorQrVariables } from '@dataconnect/generated';
import { useGetComandaPorQr } from '@dataconnect/generated/react'

export default function GetComandaPorQrComponent() {
  // The `useGetComandaPorQr` Query hook requires an argument of type `GetComandaPorQrVariables`:
  const getComandaPorQrVars: GetComandaPorQrVariables = {
    codigoQr: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetComandaPorQr(getComandaPorQrVars);
  // Variables can be defined inline as well.
  const query = useGetComandaPorQr({ codigoQr: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetComandaPorQr(dataConnect, getComandaPorQrVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetComandaPorQr(getComandaPorQrVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetComandaPorQr(dataConnect, getComandaPorQrVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.comanda);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetInsumoPorQr
You can execute the `GetInsumoPorQr` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetInsumoPorQr(dc: DataConnect, vars: GetInsumoPorQrVariables, options?: useDataConnectQueryOptions<GetInsumoPorQrData>): UseDataConnectQueryResult<GetInsumoPorQrData, GetInsumoPorQrVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetInsumoPorQr(vars: GetInsumoPorQrVariables, options?: useDataConnectQueryOptions<GetInsumoPorQrData>): UseDataConnectQueryResult<GetInsumoPorQrData, GetInsumoPorQrVariables>;
```

### Variables
The `GetInsumoPorQr` Query requires an argument of type `GetInsumoPorQrVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetInsumoPorQrVariables {
  codigoQr: UUIDString;
}
```
### Return Type
Recall that calling the `GetInsumoPorQr` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetInsumoPorQr` Query is of type `GetInsumoPorQrData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetInsumoPorQr`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetInsumoPorQrVariables } from '@dataconnect/generated';
import { useGetInsumoPorQr } from '@dataconnect/generated/react'

export default function GetInsumoPorQrComponent() {
  // The `useGetInsumoPorQr` Query hook requires an argument of type `GetInsumoPorQrVariables`:
  const getInsumoPorQrVars: GetInsumoPorQrVariables = {
    codigoQr: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetInsumoPorQr(getInsumoPorQrVars);
  // Variables can be defined inline as well.
  const query = useGetInsumoPorQr({ codigoQr: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetInsumoPorQr(dataConnect, getInsumoPorQrVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetInsumoPorQr(getInsumoPorQrVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetInsumoPorQr(dataConnect, getInsumoPorQrVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.insumo);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetVehiculos
You can execute the `GetVehiculos` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetVehiculos(dc: DataConnect, options?: useDataConnectQueryOptions<GetVehiculosData>): UseDataConnectQueryResult<GetVehiculosData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetVehiculos(options?: useDataConnectQueryOptions<GetVehiculosData>): UseDataConnectQueryResult<GetVehiculosData, undefined>;
```

### Variables
The `GetVehiculos` Query has no variables.
### Return Type
Recall that calling the `GetVehiculos` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetVehiculos` Query is of type `GetVehiculosData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetVehiculos`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetVehiculos } from '@dataconnect/generated/react'

export default function GetVehiculosComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetVehiculos();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetVehiculos(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehiculos(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehiculos(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.vehiculos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMisSalidasVehiculo
You can execute the `GetMisSalidasVehiculo` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMisSalidasVehiculo(dc: DataConnect, options?: useDataConnectQueryOptions<GetMisSalidasVehiculoData>): UseDataConnectQueryResult<GetMisSalidasVehiculoData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMisSalidasVehiculo(options?: useDataConnectQueryOptions<GetMisSalidasVehiculoData>): UseDataConnectQueryResult<GetMisSalidasVehiculoData, undefined>;
```

### Variables
The `GetMisSalidasVehiculo` Query has no variables.
### Return Type
Recall that calling the `GetMisSalidasVehiculo` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMisSalidasVehiculo` Query is of type `GetMisSalidasVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMisSalidasVehiculo`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetMisSalidasVehiculo } from '@dataconnect/generated/react'

export default function GetMisSalidasVehiculoComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMisSalidasVehiculo();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMisSalidasVehiculo(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMisSalidasVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMisSalidasVehiculo(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.salidaVehiculos);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## Registrarse
You can execute the `Registrarse` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRegistrarse(options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRegistrarse(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseData, FirebaseError, RegistrarseVariables>): UseDataConnectMutationResult<RegistrarseData, RegistrarseVariables>;
```

### Variables
The `Registrarse` Mutation requires an argument of type `RegistrarseVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `Registrarse` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `Registrarse` Mutation is of type `RegistrarseData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RegistrarseData {
  usuario_insert: Usuario_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `Registrarse`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RegistrarseVariables } from '@dataconnect/generated';
import { useRegistrarse } from '@dataconnect/generated/react'

export default function RegistrarseComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRegistrarse();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRegistrarse(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarse(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarse(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRegistrarse` Mutation requires an argument of type `RegistrarseVariables`:
  const registrarseVars: RegistrarseVariables = {
    rolId: ..., 
    rut: ..., 
    nombre: ..., 
    apellido: ..., 
    telefono: ..., // optional
    email: ..., 
  };
  mutation.mutate(registrarseVars);
  // Variables can be defined inline as well.
  mutation.mutate({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(registrarseVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usuario_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RegistrarseComoCliente
You can execute the `RegistrarseComoCliente` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRegistrarseComoCliente(options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRegistrarseComoCliente(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarseComoClienteData, FirebaseError, RegistrarseComoClienteVariables>): UseDataConnectMutationResult<RegistrarseComoClienteData, RegistrarseComoClienteVariables>;
```

### Variables
The `RegistrarseComoCliente` Mutation requires an argument of type `RegistrarseComoClienteVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface RegistrarseComoClienteVariables {
  rolId: UUIDString;
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
Recall that calling the `RegistrarseComoCliente` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RegistrarseComoCliente` Mutation is of type `RegistrarseComoClienteData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RegistrarseComoClienteData {
  usuario_insert: Usuario_Key;
  cliente_insert: Cliente_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RegistrarseComoCliente`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RegistrarseComoClienteVariables } from '@dataconnect/generated';
import { useRegistrarseComoCliente } from '@dataconnect/generated/react'

export default function RegistrarseComoClienteComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRegistrarseComoCliente();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRegistrarseComoCliente(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarseComoCliente(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarseComoCliente(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRegistrarseComoCliente` Mutation requires an argument of type `RegistrarseComoClienteVariables`:
  const registrarseComoClienteVars: RegistrarseComoClienteVariables = {
    rolId: ..., 
    rut: ..., 
    nombre: ..., 
    apellido: ..., 
    telefono: ..., // optional
    email: ..., 
    direccion: ..., // optional
    tipoCliente: ..., 
  };
  mutation.mutate(registrarseComoClienteVars);
  // Variables can be defined inline as well.
  mutation.mutate({ rolId: ..., rut: ..., nombre: ..., apellido: ..., telefono: ..., email: ..., direccion: ..., tipoCliente: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(registrarseComoClienteVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usuario_insert);
    console.log(mutation.data.cliente_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ActualizarUsuario
You can execute the `ActualizarUsuario` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useActualizarUsuario(options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useActualizarUsuario(dc: DataConnect, options?: useDataConnectMutationOptions<ActualizarUsuarioData, FirebaseError, ActualizarUsuarioVariables>): UseDataConnectMutationResult<ActualizarUsuarioData, ActualizarUsuarioVariables>;
```

### Variables
The `ActualizarUsuario` Mutation requires an argument of type `ActualizarUsuarioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `ActualizarUsuario` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ActualizarUsuario` Mutation is of type `ActualizarUsuarioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ActualizarUsuarioData {
  usuario_update?: Usuario_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ActualizarUsuario`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ActualizarUsuarioVariables } from '@dataconnect/generated';
import { useActualizarUsuario } from '@dataconnect/generated/react'

export default function ActualizarUsuarioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useActualizarUsuario();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useActualizarUsuario(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActualizarUsuario(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActualizarUsuario(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useActualizarUsuario` Mutation requires an argument of type `ActualizarUsuarioVariables`:
  const actualizarUsuarioVars: ActualizarUsuarioVariables = {
    id: ..., 
    rolId: ..., 
    nombre: ..., 
    apellido: ..., // optional
    telefono: ..., // optional
    activo: ..., 
  };
  mutation.mutate(actualizarUsuarioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., rolId: ..., nombre: ..., apellido: ..., telefono: ..., activo: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(actualizarUsuarioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.usuario_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CrearVehiculo
You can execute the `CrearVehiculo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCrearVehiculo(options?: useDataConnectMutationOptions<CrearVehiculoData, FirebaseError, CrearVehiculoVariables>): UseDataConnectMutationResult<CrearVehiculoData, CrearVehiculoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCrearVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<CrearVehiculoData, FirebaseError, CrearVehiculoVariables>): UseDataConnectMutationResult<CrearVehiculoData, CrearVehiculoVariables>;
```

### Variables
The `CrearVehiculo` Mutation requires an argument of type `CrearVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CrearVehiculoVariables {
  patente: string;
  marca: string;
  modelo: string;
  anio?: number | null;
  descripcion?: string | null;
}
```
### Return Type
Recall that calling the `CrearVehiculo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CrearVehiculo` Mutation is of type `CrearVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CrearVehiculoData {
  vehiculo_insert: Vehiculo_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CrearVehiculo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CrearVehiculoVariables } from '@dataconnect/generated';
import { useCrearVehiculo } from '@dataconnect/generated/react'

export default function CrearVehiculoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCrearVehiculo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCrearVehiculo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCrearVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCrearVehiculo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCrearVehiculo` Mutation requires an argument of type `CrearVehiculoVariables`:
  const crearVehiculoVars: CrearVehiculoVariables = {
    patente: ..., 
    marca: ..., 
    modelo: ..., 
    anio: ..., // optional
    descripcion: ..., // optional
  };
  mutation.mutate(crearVehiculoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(crearVehiculoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehiculo_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ActualizarVehiculo
You can execute the `ActualizarVehiculo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useActualizarVehiculo(options?: useDataConnectMutationOptions<ActualizarVehiculoData, FirebaseError, ActualizarVehiculoVariables>): UseDataConnectMutationResult<ActualizarVehiculoData, ActualizarVehiculoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useActualizarVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<ActualizarVehiculoData, FirebaseError, ActualizarVehiculoVariables>): UseDataConnectMutationResult<ActualizarVehiculoData, ActualizarVehiculoVariables>;
```

### Variables
The `ActualizarVehiculo` Mutation requires an argument of type `ActualizarVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `ActualizarVehiculo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ActualizarVehiculo` Mutation is of type `ActualizarVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ActualizarVehiculoData {
  vehiculo_update?: Vehiculo_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ActualizarVehiculo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ActualizarVehiculoVariables } from '@dataconnect/generated';
import { useActualizarVehiculo } from '@dataconnect/generated/react'

export default function ActualizarVehiculoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useActualizarVehiculo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useActualizarVehiculo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActualizarVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useActualizarVehiculo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useActualizarVehiculo` Mutation requires an argument of type `ActualizarVehiculoVariables`:
  const actualizarVehiculoVars: ActualizarVehiculoVariables = {
    id: ..., 
    patente: ..., 
    marca: ..., 
    modelo: ..., 
    anio: ..., // optional
    descripcion: ..., // optional
    activo: ..., 
  };
  mutation.mutate(actualizarVehiculoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., patente: ..., marca: ..., modelo: ..., anio: ..., descripcion: ..., activo: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(actualizarVehiculoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehiculo_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CrearSalidaVehiculo
You can execute the `CrearSalidaVehiculo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCrearSalidaVehiculo(options?: useDataConnectMutationOptions<CrearSalidaVehiculoData, FirebaseError, CrearSalidaVehiculoVariables>): UseDataConnectMutationResult<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCrearSalidaVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<CrearSalidaVehiculoData, FirebaseError, CrearSalidaVehiculoVariables>): UseDataConnectMutationResult<CrearSalidaVehiculoData, CrearSalidaVehiculoVariables>;
```

### Variables
The `CrearSalidaVehiculo` Mutation requires an argument of type `CrearSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CrearSalidaVehiculoVariables {
  vehiculoId: UUIDString;
  repartidorId: string;
  observaciones?: string | null;
}
```
### Return Type
Recall that calling the `CrearSalidaVehiculo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CrearSalidaVehiculo` Mutation is of type `CrearSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CrearSalidaVehiculoData {
  salidaVehiculo_insert: SalidaVehiculo_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CrearSalidaVehiculo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CrearSalidaVehiculoVariables } from '@dataconnect/generated';
import { useCrearSalidaVehiculo } from '@dataconnect/generated/react'

export default function CrearSalidaVehiculoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCrearSalidaVehiculo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCrearSalidaVehiculo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCrearSalidaVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCrearSalidaVehiculo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCrearSalidaVehiculo` Mutation requires an argument of type `CrearSalidaVehiculoVariables`:
  const crearSalidaVehiculoVars: CrearSalidaVehiculoVariables = {
    vehiculoId: ..., 
    repartidorId: ..., 
    observaciones: ..., // optional
  };
  mutation.mutate(crearSalidaVehiculoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ vehiculoId: ..., repartidorId: ..., observaciones: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(crearSalidaVehiculoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.salidaVehiculo_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RegistrarInspeccionAntes
You can execute the `RegistrarInspeccionAntes` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRegistrarInspeccionAntes(options?: useDataConnectMutationOptions<RegistrarInspeccionAntesData, FirebaseError, RegistrarInspeccionAntesVariables>): UseDataConnectMutationResult<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRegistrarInspeccionAntes(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarInspeccionAntesData, FirebaseError, RegistrarInspeccionAntesVariables>): UseDataConnectMutationResult<RegistrarInspeccionAntesData, RegistrarInspeccionAntesVariables>;
```

### Variables
The `RegistrarInspeccionAntes` Mutation requires an argument of type `RegistrarInspeccionAntesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface RegistrarInspeccionAntesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that calling the `RegistrarInspeccionAntes` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RegistrarInspeccionAntes` Mutation is of type `RegistrarInspeccionAntesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RegistrarInspeccionAntesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RegistrarInspeccionAntes`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RegistrarInspeccionAntesVariables } from '@dataconnect/generated';
import { useRegistrarInspeccionAntes } from '@dataconnect/generated/react'

export default function RegistrarInspeccionAntesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRegistrarInspeccionAntes();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRegistrarInspeccionAntes(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarInspeccionAntes(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarInspeccionAntes(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRegistrarInspeccionAntes` Mutation requires an argument of type `RegistrarInspeccionAntesVariables`:
  const registrarInspeccionAntesVars: RegistrarInspeccionAntesVariables = {
    salidaId: ..., 
    estadoVehiculo: ..., 
    kilometraje: ..., 
    observaciones: ..., // optional
  };
  mutation.mutate(registrarInspeccionAntesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(registrarInspeccionAntesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.inspeccionVehiculo_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## IniciarSalidaVehiculo
You can execute the `IniciarSalidaVehiculo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useIniciarSalidaVehiculo(options?: useDataConnectMutationOptions<IniciarSalidaVehiculoData, FirebaseError, IniciarSalidaVehiculoVariables>): UseDataConnectMutationResult<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useIniciarSalidaVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<IniciarSalidaVehiculoData, FirebaseError, IniciarSalidaVehiculoVariables>): UseDataConnectMutationResult<IniciarSalidaVehiculoData, IniciarSalidaVehiculoVariables>;
```

### Variables
The `IniciarSalidaVehiculo` Mutation requires an argument of type `IniciarSalidaVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface IniciarSalidaVehiculoVariables {
  salidaId: UUIDString;
}
```
### Return Type
Recall that calling the `IniciarSalidaVehiculo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `IniciarSalidaVehiculo` Mutation is of type `IniciarSalidaVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface IniciarSalidaVehiculoData {
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `IniciarSalidaVehiculo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, IniciarSalidaVehiculoVariables } from '@dataconnect/generated';
import { useIniciarSalidaVehiculo } from '@dataconnect/generated/react'

export default function IniciarSalidaVehiculoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useIniciarSalidaVehiculo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useIniciarSalidaVehiculo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useIniciarSalidaVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useIniciarSalidaVehiculo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useIniciarSalidaVehiculo` Mutation requires an argument of type `IniciarSalidaVehiculoVariables`:
  const iniciarSalidaVehiculoVars: IniciarSalidaVehiculoVariables = {
    salidaId: ..., 
  };
  mutation.mutate(iniciarSalidaVehiculoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ salidaId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(iniciarSalidaVehiculoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.salidaVehiculo_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RegistrarInspeccionDespues
You can execute the `RegistrarInspeccionDespues` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRegistrarInspeccionDespues(options?: useDataConnectMutationOptions<RegistrarInspeccionDespuesData, FirebaseError, RegistrarInspeccionDespuesVariables>): UseDataConnectMutationResult<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRegistrarInspeccionDespues(dc: DataConnect, options?: useDataConnectMutationOptions<RegistrarInspeccionDespuesData, FirebaseError, RegistrarInspeccionDespuesVariables>): UseDataConnectMutationResult<RegistrarInspeccionDespuesData, RegistrarInspeccionDespuesVariables>;
```

### Variables
The `RegistrarInspeccionDespues` Mutation requires an argument of type `RegistrarInspeccionDespuesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface RegistrarInspeccionDespuesVariables {
  salidaId: UUIDString;
  estadoVehiculo: EstadoVehiculo;
  kilometraje: number;
  observaciones?: string | null;
}
```
### Return Type
Recall that calling the `RegistrarInspeccionDespues` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RegistrarInspeccionDespues` Mutation is of type `RegistrarInspeccionDespuesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RegistrarInspeccionDespuesData {
  inspeccionVehiculo_insert: InspeccionVehiculo_Key;
  salidaVehiculo_update?: SalidaVehiculo_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RegistrarInspeccionDespues`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RegistrarInspeccionDespuesVariables } from '@dataconnect/generated';
import { useRegistrarInspeccionDespues } from '@dataconnect/generated/react'

export default function RegistrarInspeccionDespuesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRegistrarInspeccionDespues();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRegistrarInspeccionDespues(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarInspeccionDespues(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegistrarInspeccionDespues(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRegistrarInspeccionDespues` Mutation requires an argument of type `RegistrarInspeccionDespuesVariables`:
  const registrarInspeccionDespuesVars: RegistrarInspeccionDespuesVariables = {
    salidaId: ..., 
    estadoVehiculo: ..., 
    kilometraje: ..., 
    observaciones: ..., // optional
  };
  mutation.mutate(registrarInspeccionDespuesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ salidaId: ..., estadoVehiculo: ..., kilometraje: ..., observaciones: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(registrarInspeccionDespuesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.inspeccionVehiculo_insert);
    console.log(mutation.data.salidaVehiculo_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AgregarFotoInspeccionVehiculo
You can execute the `AgregarFotoInspeccionVehiculo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAgregarFotoInspeccionVehiculo(options?: useDataConnectMutationOptions<AgregarFotoInspeccionVehiculoData, FirebaseError, AgregarFotoInspeccionVehiculoVariables>): UseDataConnectMutationResult<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAgregarFotoInspeccionVehiculo(dc: DataConnect, options?: useDataConnectMutationOptions<AgregarFotoInspeccionVehiculoData, FirebaseError, AgregarFotoInspeccionVehiculoVariables>): UseDataConnectMutationResult<AgregarFotoInspeccionVehiculoData, AgregarFotoInspeccionVehiculoVariables>;
```

### Variables
The `AgregarFotoInspeccionVehiculo` Mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AgregarFotoInspeccionVehiculoVariables {
  inspeccionId: UUIDString;
  rutaStorage: string;
  descripcion?: string | null;
  orden: number;
}
```
### Return Type
Recall that calling the `AgregarFotoInspeccionVehiculo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AgregarFotoInspeccionVehiculo` Mutation is of type `AgregarFotoInspeccionVehiculoData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AgregarFotoInspeccionVehiculoData {
  fotoInspeccionVehiculo_insert: FotoInspeccionVehiculo_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AgregarFotoInspeccionVehiculo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AgregarFotoInspeccionVehiculoVariables } from '@dataconnect/generated';
import { useAgregarFotoInspeccionVehiculo } from '@dataconnect/generated/react'

export default function AgregarFotoInspeccionVehiculoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAgregarFotoInspeccionVehiculo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAgregarFotoInspeccionVehiculo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAgregarFotoInspeccionVehiculo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAgregarFotoInspeccionVehiculo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAgregarFotoInspeccionVehiculo` Mutation requires an argument of type `AgregarFotoInspeccionVehiculoVariables`:
  const agregarFotoInspeccionVehiculoVars: AgregarFotoInspeccionVehiculoVariables = {
    inspeccionId: ..., 
    rutaStorage: ..., 
    descripcion: ..., // optional
    orden: ..., 
  };
  mutation.mutate(agregarFotoInspeccionVehiculoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ inspeccionId: ..., rutaStorage: ..., descripcion: ..., orden: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(agregarFotoInspeccionVehiculoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.fotoInspeccionVehiculo_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

