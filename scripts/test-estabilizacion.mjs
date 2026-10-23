import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const host=(process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST??'127.0.0.1:9499').replace(/^http:\/\//,'');
assert.match(host,/^(127\.0\.0\.1|localhost):9499$/);
const endpoint=`http://${host}/v1/projects/demo-production/locations/southamerica-west1/services/lavanderia-el-cobre:executeGraphql`;
async function execute(query,operationName,variables={},user){
 const impersonate=user===null?{unauthenticated:true}:user?{authClaims:{sub:user.uid??user,email:user.email??'fixture@example.test',email_verified:user.verified??false,firebase:{sign_in_provider:'password'}}}:undefined;
 const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,operationName,variables,extensions:{impersonate}})});
 const b=await r.json();if(!r.ok||b.errors?.length)throw new Error(JSON.stringify(b));return b.data;
}
let count=0;async function check(name,fn){await fn();count++;console.log('OK '+name);}
const contactos=await readFile('dataconnect/example/contacto.gql','utf8');
const flota=await readFile('dataconnect/example/vehiculos-mutations.gql','utf8');
const evidencias=await readFile('dataconnect/example/evidencias.gql','utf8');
const registro=await readFile('dataconnect/example/mutations.gql','utf8');
const ficha=await readFile('dataconnect/example/ficha-verificada.gql','utf8');
await execute(await readFile('dataconnect/seed_data.gql','utf8'),'SeedProduccion');
const vehiculoId=randomUUID(),salidaId=randomUUID(),inspeccionId=randomUUID();
await execute('mutation Fixture($id:UUID!){vehiculo_insert(data:{id:$id,patente:"FIXT-24",marca:"Test",modelo:"Test"})}','Fixture',{id:vehiculoId});
const salida=await execute(flota,'RegistrarSalidaFlota',{vehiculoId,salidaId,inspeccionId,repartidorId:'test-conductor',kilometraje:1000,estadoVehiculo:'APTO',observaciones:null,observacionesInspeccion:null},'test-admin');
await check('la respuesta perdida se confirma por el ID estable sin crear otro movimiento',async()=>{
 const d=await execute(evidencias,'GetMovimientoFlotaPorInspeccion',{id:inspeccionId},'test-admin');assert.equal(d.inspeccionVehiculo.salidaId.replaceAll('-',''),salidaId.replaceAll('-',''));
});
await check('solo administración y el conductor de la inspección acceden a evidencia',async()=>{
 for(const user of ['test-admin','test-conductor']) await execute(evidencias,'GetInspeccionParaEvidencias',{id:inspeccionId},user);
 for(const user of [null,'sin-perfil','test-inactivo','test-cliente','test-repartidor']) await assert.rejects(execute(evidencias,'GetInspeccionParaEvidencias',{id:inspeccionId},user));
});
await check('ningún cliente puede insertar una ruta que no pasó por la API',async()=>{
 const args={id:randomUUID(),inspeccionId,rutaStorage:'vehiculos/inspecciones/ficticio.jpg',orden:1,descripcion:null};
 for(const user of ['test-admin','test-conductor','test-repartidor',null]) await assert.rejects(execute(evidencias,'RegistrarEvidenciaGuardada',args,user));
 await assert.rejects(execute(flota,'AdjuntarFotoInspeccionFlota',{inspeccionId,rutaStorage:'no-existe.jpg',orden:1,descripcion:null},'test-admin'));
});
await check('los adjuntos de la API son idempotentes y un ID no se reasigna a otra inspección',async()=>{
 const args={id:randomUUID(),inspeccionId,rutaStorage:`vehiculos/inspecciones/${inspeccionId}/${randomUUID()}.jpg`,orden:1,descripcion:null};
 await execute(evidencias,'RegistrarEvidenciaGuardada',args);await execute(evidencias,'RegistrarEvidenciaGuardada',args);
 await assert.rejects(execute(evidencias,'RegistrarEvidenciaGuardada',{...args,inspeccionId:randomUUID()}));
});
await execute(flota,'RegistrarRetornoFlota',{salidaId:salida.salida.id,kilometraje:1200,estadoVehiculo:'APTO',observacionesRetorno:null,observacionesInspeccion:null},'test-admin');
await check('el servidor rechaza retroceder el odómetro entre viajes',async()=>{
 await assert.rejects(execute(flota,'RegistrarSalidaFlota',{vehiculoId,repartidorId:'test-conductor',kilometraje:10,estadoVehiculo:'APTO',observaciones:null,observacionesInspeccion:null},'test-admin'));
});
await check('solo se confirma una salida concurrente para un vehículo',async()=>{
 const args={vehiculoId,repartidorId:'test-conductor',kilometraje:1300,estadoVehiculo:'APTO',observaciones:null,observacionesInspeccion:null};
 const result=await Promise.allSettled([execute(flota,'RegistrarSalidaFlota',args,'test-admin'),execute(flota,'RegistrarSalidaFlota',args,'test-admin')]);
 assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
});
await check('la bandeja es privada, limita solicitudes y preserva estados',async()=>{
 const base={nombre:'Prueba',email:'prueba@example.test',telefono:'+56912345678',servicio:'otro',mensaje:'Cotización',hashContenido:'a'.repeat(64),limiteId:'test-'+randomUUID()};
 await execute(contactos,'PrepararLimiteContacto',{id:base.limiteId});
 let id;
 for(let i=0;i<5;i++){id=randomUUID();await execute(contactos,'RegistrarSolicitudContacto',{...base,id});}
 await assert.rejects(execute(contactos,'RegistrarSolicitudContacto',{...base,id:randomUUID()}));
 await execute(contactos,'ActualizarEstadoSolicitudContacto',{id,estado:'ATENDIDA'},'test-recepcion');
 const d=await execute(contactos,'GetSolicitudesContacto',{estado:'ATENDIDA'},'test-admin');assert(d.solicitudContactos.some(s=>s.id.replaceAll("-","")===id.replaceAll("-","")));
 for(const user of [null,'test-cliente','test-operario','sin-perfil','test-inactivo'])await assert.rejects(execute(contactos,'GetSolicitudesContacto',{},user));
 for(const user of [null,'test-admin'])await assert.rejects(execute(contactos,'RegistrarSolicitudContacto',{...base,id:randomUUID()},user));
});
await check('el contador de contactos también limita peticiones simultáneas',async()=>{
 const base={nombre:'Prueba',email:'prueba@example.test',telefono:'+56912345678',servicio:'otro',mensaje:'Cotización',hashContenido:'b'.repeat(64),limiteId:'concurrente-'+randomUUID()};
 await execute(contactos,'PrepararLimiteContacto',{id:base.limiteId});
 const resultados=await Promise.allSettled(Array.from({length:8},()=>execute(contactos,'RegistrarSolicitudContacto',{...base,id:randomUUID()})));
 assert.equal(resultados.filter(r=>r.status==='fulfilled').length,5);
});
await check('registro conserva RUT y ficha anterior solo se vincula con correo verificado coincidente',async()=>{
 const cliente=randomUUID(); const rut='11.111.111-1';
 await execute('mutation Cliente($id:UUID!,$rut:String!){cliente_insert(data:{id:$id,rut:$rut,nombre:"Anterior",email:"anterior@example.test"})}','Cliente',{id:cliente,rut});
 const args={rut,nombre:'Registro',apellido:'Prueba',email:'anterior@example.test',tipoCliente:'PARTICULAR',crearFicha:false};
 await execute(registro,'RegistrarseComoCliente',args,'nuevo-con-anterior');
 const usuario={uid:'nuevo-con-anterior',email:'anterior@example.test',verified:false};
 await assert.rejects(execute(ficha,'VincularMiFichaVerificada',{},usuario));
 await assert.rejects(execute(ficha,'VincularMiFichaVerificada',{},{...usuario,verified:true,email:'otra@example.test'}));
 await execute(ficha,'VincularMiFichaVerificada',{},{...usuario,verified:true});
 const d=await execute('query Cliente($rut:String!){clientes(where:{rut:{eq:$rut}}){id usuarioId}}','Cliente',{rut});assert.equal(d.clientes.length,1);assert.equal(d.clientes[0].usuarioId,usuario.uid);
 await execute(registro,'RegistrarseComoCliente',{...args,rut:'12.345.678-5',email:'nuevo@example.test',crearFicha:true},'cliente-nuevo-rut');
 const nueva=await execute('query Ficha($rut:String!){cliente(first:{where:{rut:{eq:$rut}}}){usuarioId}}','Ficha',{rut:'12.345.678-5'});assert.equal(nueva.cliente.usuarioId,'cliente-nuevo-rut');
});
console.log(`${count} escenarios de estabilización aprobados.`);
