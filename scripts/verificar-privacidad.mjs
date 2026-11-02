import { readFile } from 'node:fs/promises';
const registro = JSON.parse(await readFile(new URL('../docs/cumplimiento-21719.json', import.meta.url), 'utf8'));
if (!Array.isArray(registro.controles) || registro.controles.length === 0) throw new Error('Registro de controles vacío o inválido');
const ids = new Set();
const pendientes = [];
const requeridos = ['responsable', 'inventario', 'bases', 'aviso', 'consentimiento', 'acceso', 'rectificacion', 'supresion', 'oposicion', 'bloqueo', 'portabilidad', 'procedimiento', 'confidencialidad', 'seguridad', 'continuidad', 'brechas', 'estandares', 'encargados', 'impacto', 'especiales', 'transferencias', 'retencion', 'prevencion', 'despliegue'];
for (const c of registro.controles) {
  if (typeof c.id !== 'string' || ids.has(c.id) || typeof c.obligatorio !== 'boolean') throw new Error('Control inválido o duplicado');
  ids.add(c.id);
  if (requeridos.includes(c.id) && c.obligatorio !== true) throw new Error(`No se puede omitir la revisión obligatoria: ${c.id}`);
  if (c.obligatorio && !(c.estado === 'verificado' && typeof c.evidencia === 'string' && c.evidencia.trim() && typeof c.responsable === 'string' && c.responsable.trim() && /^\d{4}-\d{2}-\d{2}$/.test(c.verificadoEn ?? ''))) pendientes.push(c.id);
}
for (const id of requeridos) if (!ids.has(id)) throw new Error(`Falta un control obligatorio: ${id}`);
console.log(JSON.stringify({ preparado: pendientes.length === 0, pendientes, alcance: 'Comprueba declaraciones y referencias del registro local. No verifica contratos, infraestructura ni certifica cumplimiento legal.' }, null, 2));
process.exitCode = pendientes.length ? 2 : 0;
