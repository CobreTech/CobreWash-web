# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useRegistrarse, useRegistrarseComoCliente, useActualizarUsuario, useGetRoles, useGetMiPerfil, useGetUsuarios } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useRegistrarse(registrarseVars);

const { data, isPending, isSuccess, isError, error } = useRegistrarseComoCliente(registrarseComoClienteVars);

const { data, isPending, isSuccess, isError, error } = useActualizarUsuario(actualizarUsuarioVars);

const { data, isPending, isSuccess, isError, error } = useGetRoles();

const { data, isPending, isSuccess, isError, error } = useGetMiPerfil();

const { data, isPending, isSuccess, isError, error } = useGetUsuarios();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { registrarse, registrarseComoCliente, actualizarUsuario, getRoles, getMiPerfil, getUsuarios } from '@dataconnect/generated';


// Operation Registrarse:  For variables, look at type RegistrarseVars in ../index.d.ts
const { data } = await Registrarse(dataConnect, registrarseVars);

// Operation RegistrarseComoCliente:  For variables, look at type RegistrarseComoClienteVars in ../index.d.ts
const { data } = await RegistrarseComoCliente(dataConnect, registrarseComoClienteVars);

// Operation ActualizarUsuario:  For variables, look at type ActualizarUsuarioVars in ../index.d.ts
const { data } = await ActualizarUsuario(dataConnect, actualizarUsuarioVars);

// Operation GetRoles: 
const { data } = await GetRoles(dataConnect);

// Operation GetMiPerfil: 
const { data } = await GetMiPerfil(dataConnect);

// Operation GetUsuarios: 
const { data } = await GetUsuarios(dataConnect);


```