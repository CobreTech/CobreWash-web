import { readFile } from 'node:fs/promises';
import { evaluarNotificacionIncidente } from '../lib/privacidad/incidentes.ts';
const archivo = process.argv[2];
if (!archivo) throw new Error('Uso: node scripts/evaluar-incidente.mjs <indicadores.json>');
const entrada = JSON.parse(await readFile(archivo, 'utf8'));
for (const clave of ['datosSensibles', 'menoresDe14', 'obligacionesEconomicasFinancierasBancariasComerciales']) if (typeof entrada[clave] !== 'boolean') throw new Error(`Indicador inválido: ${clave}`);
for (const clave of ['vulneracionDatosPersonales', 'riesgoRazonable']) if (![true, false, null].includes(entrada[clave])) throw new Error(`Indicador inválido: ${clave}`);
console.log(JSON.stringify({ orientacion: evaluarNotificacionIncidente(entrada), advertencia: 'Requiere actuación humana documentada. No envía ni acredita notificaciones. No existe una espera autorizada de 72 horas.' }, null, 2));
