# Avisos de la intranet

Administración publica desde `/intranet/comunicacion`, utilizando el modal
existente y los destinatarios **Todos los equipos**, **Solo Operarios** y
**Solo Recepción**. Los avisos se guardan en la tabla `aviso` de Data Connect;
el autor corresponde al perfil autenticado y la fecha se asigna en el servidor.

Operarios y recepcionistas acceden desde **Avisos** en la navegación. Reciben
únicamente los avisos activos dirigidos a todos o a su propio rol, con los más
recientes primero y páginas de 20 registros. La página consulta novedades cada
30 segundos mientras está visible y al recuperar el foco. No pueden publicar.

Los permisos se verifican contra `usuario` y `rol` en el servidor: solo un
administrador activo puede crear, y el rol solicitado en la consulta de equipo
debe coincidir con el del perfil activo. Clientes, cuentas inactivas y usuarios
sin perfil quedan excluidos.

## Verificación

- `pnpm test --maxWorkers=2`: pruebas unitarias y de actualización de la lista.
- `pnpm test:avisos`: creación, persistencia, destinatarios, paginación y permisos
  reales en el emulador aislado `demo-production`; no escribe en Cloud SQL.
- `pnpm lint` y `pnpm build`: validación del código y compilación de la aplicación.
- `pnpm dataconnect:compile:web`: valida las operaciones y regenera el SDK web.

## Backend

Las operaciones `CrearAviso`, `GetAvisosAdministracion` y `GetAvisosParaEquipo`
pertenecen al conector `example`. Deben desplegarse en Firebase junto con el
frontend que las utiliza. No requieren migrar el esquema existente.
