# RF17 · Flujo de producción

Una comanda se considera aprobada cuando se guarda correctamente. La web usa
`CrearComandaConFlujo` para insertar cabecera, prendas, cinco etapas e historial
en una transacción; el total se calcula en el servidor desde las prendas.
Todas las etapas comienzan pendientes. RF18 permite que administración y operarios
completen, en orden, Recepción, Lavado, Secado, Planchado y Entrega. RF19 y RF24
incorporarán las fechas de finalización y el operario que registra cada avance.

El catálogo vive en `EtapaProduccion`. La asociación `ComandaEtapa` conserva
nombre, orden, descripción y tiempo estimado al crear el flujo. La configuración
administrativa se aplica a asociaciones futuras; no cambia las existentes.
La secuencia inicial es Recepción → Lavado → Secado → Planchado → Entrega.

## Conectores y compatibilidad

- `example` mantiene los contratos existentes de web y Android. La operación
  anterior `CrearComanda` también asocia las cinco etapas, aunque los clientes
  antiguos siguen enviando sus prendas por separado.
- `produccion` contiene el guardado web con input de lote restringido mediante
  `@allow`. Comparte servicio, esquema y base de datos con `example`.
- Firebase CLI admite el input `_Data` en el servidor, pero todavía no genera su
  SDK. `lib/produccion/guardar.ts` declara el contrato acotado y usa `mutationRef`.
- El UUID de creación se conserva durante los reintentos. Si se pierde la respuesta,
  se consulta la comanda del mismo creador antes de presentar el guardado como fallido.
- El estado global de una comanda y el estado de sus etapas son conceptos distintos.

## RF18 · Avance por etapa

La primera etapa no completada es la etapa actual. La operación
`CompletarEtapaComanda` valida la secuencia dentro de una transacción: rechaza
saltos, repeticiones, etapas ajenas, flujos incompletos y comandas cerradas. Tras
cada avance activa la etapa siguiente. Al completar Planchado deja la comanda
`FINALIZADA`, lista para entregar; al completar Entrega la cierra como `ENTREGADA`.

La acción está disponible para perfiles activos `admin` y `operario`. Recepción
puede consultar el flujo, pero no reportar avances. La interfaz reutiliza el
lenguaje visual de Comandas, con las cinco tarjetas horizontales, estados,
animaciones y botón principal con gradiente.

## Indicadores y filtros de comandas

El badge de Comandas en el sidebar consulta la base de datos y suma únicamente
comandas `PENDIENTE` y `EN_PROCESO`. Los indicadores del módulo Comandas permiten
seleccionar uno o varios estados; un segundo clic deselecciona cada estado y, sin
selecciones, la tabla vuelve a mostrar todos. La consulta pagina y filtra la
selección completa en el servidor y mantiene compatible la variable individual
usada por clientes anteriores.

Admin y recepción crean y asocian comandas. El personal activo consulta producción;
solo admin configura el catálogo. Las operaciones comprueban la existencia del
perfil, su estado activo y su rol en SQL Connect.

## Datos anteriores

Las comandas pendientes sin flujo pueden asociarse desde Seguimiento, una sola vez.
Las comandas anteriores en proceso, finalizadas, entregadas o anuladas mantienen
su estado sin reconstruir etapas o fechas ficticias.

El diagnóstico previo al despliegue encontró el catálogo vacío, ninguna asociación
de etapas y una única comanda anulada. No fue necesaria una migración de comandas.
La migración de esquema añade cuatro columnas opcionales a `comanda_etapa`.

El 6 de septiembre de 2026 se desplegaron el esquema y los conectores `example`
y `produccion` en `lavanderia-el-cobre-16fd5`, y se inicializó el catálogo.
La verificación posterior por SDK confirmó cinco etapas, cero comandas activas
y la misma comanda anulada. Las consultas desplegadas se verificaron con
impersonación de un administrador activo, sin crear comandas de prueba en producción.
La ruta experimental de migración de Firebase CLI devolvió 404; se utilizó su
ruta estándar IAM, sin cambiar preferencias permanentes.

## Verificación

```sh
pnpm test
pnpm lint
pnpm build
pnpm test:production
pnpm dataconnect:compile:web
```

La prueba de integración usa exclusivamente el proyecto `demo-production` y el
emulador local del puerto 9499. Sus fixtures están en `dataconnect/seed_data.gql`
y no se despliegan. No ejecutar simultáneamente los dos últimos comandos:
comparten la copia temporal de configuración en `scratch/production-test`.

Validación acumulada: 51 pruebas unitarias, 24 escenarios de integración,
ESLint y build de Next.js aprobados. El navegador local confirmó la redirección
sin sesión; la comprobación manual autenticada queda disponible para el usuario.

La compilación web genera el SDK de JavaScript sin escribir en el proyecto Android.
Se conserva la configuración original de Kotlin en `dataconnect/example/connector.yaml`.

Para inicializar el catálogo en otro entorno con credenciales administrativas,
definir `GCLOUD_PROJECT` y ejecutar `node scripts/init-production.mjs` primero.
Agregar `--apply` crea las cinco etapas si el catálogo está vacío. Si ya existe un
catálogo completo, el script no sobrescribe su configuración; si está incompleto,
requiere revisión.

## Comprobación manual

1. Ingresar como admin o recepción y guardar una comanda con prendas.
2. Abrir su detalle y verificar las cinco etapas pendientes, con progreso 0%.
3. Abrir Seguimiento y buscarla por número o cliente; recargar y comprobar persistencia.
4. Como admin, cambiar descripción o tiempo estimado de una etapa.
5. Verificar que la comanda anterior conserva su configuración y una nueva toma los cambios.
6. Como operario, comprobar que se puede consultar producción sin configurar etapas
   ni asociar manualmente comandas.
