# Reportes administrativos

La ruta `/intranet/reportes` consulta Firebase Data Connect y requiere un administrador activo. La autorización se verifica también en cada operación del conector; no depende solo de la pantalla.

- **Cliente / empresa:** agrega por identificador de cliente y empresa; filtra por recepción, cliente y empresa. Incluye comandas sin líneas, con cero prendas.
- **Servicios:** agrega las líneas por servicio y suma cantidades y subtotales. Cuenta cada comanda una vez por servicio, y una vez en el total general. Una comanda con varios servicios puede aparecer en varios grupos.
- **Volumen:** usa el primer registro de FINALIZADA o ENTREGADA del historial; si falta el historial, utiliza `fechaEntregaReal`. La fecha de recepción no representa prendas procesadas. Se excluyen registros sin cierre verificable y comandas anuladas. Las prendas son la suma de las cantidades registradas por servicio; los kilos se muestran por separado en el detalle de servicios.

Las fechas incluyen ambos días seleccionados en `America/Santiago`, contemplando cambios de horario de verano. Las series distinguen el año, completan periodos sin actividad y permiten agrupar por día o mes. El promedio diario incluye todos los días del rango.

Las consultas recorren todas las páginas de 500 registros. La pantalla pagina el detalle de 20 en 20; PDF y XLSX incluyen el detalle completo, los filtros, los totales y los indicadores. Excel conserva números como valores numéricos y nombres como texto, incluso cuando empiezan por un signo de fórmula. Las librerías de exportación se cargan al solicitar una descarga.

## Publicación y validación

Las nuevas operaciones están en `dataconnect/example/reportes-queries.gql` y el SDK web está versionado. Al publicar esta versión, desplegar también el conector `example` en el entorno correspondiente: enviar la rama a Git no despliega operaciones en Firebase. No se requieren cambios de esquema ni migraciones.

```sh
pnpm dataconnect:compile:web
pnpm test:reportes
pnpm test
pnpm lint
pnpm build
pnpm audit --audit-level=high
```

`test:reportes` escribe únicamente fixtures sintéticos en el emulador aislado del proyecto `demo-production`. Comprueba filtros, agrupaciones, fechas límite, paginación, comandas mixtas, producción y restricciones para usuarios sin autorización. Las pruebas de exportación reabren los XLSX, comprueban la estructura PDF y verifican la descarga del navegador. También se revisaron visualmente muestras PDF de las tres vistas con nombres extensos, acentos y múltiples páginas.
