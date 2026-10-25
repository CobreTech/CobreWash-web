import Link from "next/link";
import { AlertCircle, UserRound, Database, FileCheck2, Building2, MessageSquareText, LockKeyhole, ArrowUpRight } from "lucide-react";
import PaginaLegal, { SeccionLegal } from "@/components/privacidad/PaginaLegal";
import { configuracionLegal } from "@/lib/privacidad/configuracion";
export const dynamic = "force-dynamic";
export const metadata = { title: "Privacidad | Lavandería El Cobre", robots: { index: false, follow: true } };
export default function PrivacidadPage() {
  const c = configuracionLegal();
  return <PaginaLegal titulo="Privacidad y datos personales" descripcion="Conoce cómo utilizamos tu información y los canales disponibles para gestionar tus datos." actual="/privacidad" detalle={`Versión ${c.version} · Lavandería El Cobre`}>
    {!c.publicada && <p role="status" className="flex items-start gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 p-5 text-sm leading-relaxed text-copper-900"><AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /><span><strong>Borrador pendiente de aprobación.</strong> Aún falta confirmar la identificación del responsable y las condiciones de conservación y proveedores. El canal de derechos está disponible abajo; este borrador no habilita nuevas autorizaciones para registro o cotizaciones.</span></p>}
    <SeccionLegal titulo="Responsable y contacto" icon={UserRound}>
      <p>{c.razonSocial || "Razón social pendiente de confirmar"}{c.rut ? ` · RUT ${c.rut}` : " · RUT pendiente de confirmar"}.</p>
      <p>Domicilio: {c.domicilio || "pendiente de confirmar"}. Representante: {c.representante || "pendiente de confirmar"}.</p>
      {c.email && <p>Solicitudes de datos personales: <a className="underline" href={`mailto:${c.email}`}>{c.email}</a>.</p>}
      <p>Puedes presentar una solicitud en el <Link className="underline text-brand-700" href="/privacidad/derechos">canal de derechos</Link>, incluso sin cuenta.</p>
    </SeccionLegal>
    <SeccionLegal titulo="Datos y finalidades" icon={Database}>
      <p>En el portal se tratan nombre, apellido, correo, RUT, credenciales de acceso administradas por Firebase y, si los proporcionas, teléfono y dirección. Permiten crear tu cuenta, identificar la ficha y mostrar los pedidos que te corresponden. El RUT no es una contraseña y conocerlo no permite acceder a tus pedidos.</p>
      <p>Las cotizaciones contienen nombre, correo, servicio solicitado, mensaje y teléfono si decides proporcionarlo. Se utilizan para responder la consulta y preparar la propuesta, sin suscribirte a campañas. Evita incluir datos de salud, documentos de identidad, datos bancarios o información de otras personas.</p>
      <p>La operación interna registra fichas, pedidos, prendas, importes, entregas, incidencias, responsables de las operaciones e inspecciones de vehículos. Las fotografías se destinan a documentar el estado del vehículo. El personal debe evitar rostros, documentos y objetos personales ajenos a la inspección.</p>
      <p>El canal de derechos conserva identificación y correo de respuesta, petición, fechas, actuaciones, verificación de identidad y evidencia de respuesta. El comprobante permite consultar el estado; no acredita identidad ni da acceso a datos personales.</p>
      <p>Los controles contra abuso usan contadores temporales asociados a un código derivado del origen de la petición. Es un dato seudonimizado, no una garantía de anonimato.</p>
    </SeccionLegal>
    <SeccionLegal titulo="Autorizaciones y régimen aplicable" icon={FileCheck2}>
      <p>El registro y la cotización incorporan una autorización expresa para sus finalidades específicas, con versión y fecha registradas. No autorizan publicidad ni reutilización para entrenar modelos. Puedes solicitar la revocación sin efectos retroactivos; se evaluará cualquier conservación exigida o autorizada por la ley.</p>
      <p>La gestión del ejercicio de derechos y las obligaciones legales se atienden según su fundamento aplicable, sin exigir una autorización para publicidad. Este aviso no reemplaza la identificación de la base jurídica de los datos que se obtengan por otros medios.</p>
      <p>La Ley 19.628 regula actualmente el tratamiento. La reforma de la Ley 21.719 tiene vigencia diferida al 1 de diciembre de 2026 según el texto legal consultado. Su entrada en vigor y las instrucciones aplicables deben revisarse antes de publicar una nueva versión.</p>
    </SeccionLegal>
    <SeccionLegal titulo="Proveedores, destinatarios y conservación" icon={Building2}>
      <p>Accede personal autorizado según sus funciones. El sistema utiliza Firebase/Google para autenticación, datos y archivos, y Vercel para alojar la web. Pagar un plan no determina por sí mismo las garantías contractuales ni el lugar de tratamiento.</p>
      <p>{c.transferencias || "Está pendiente confirmar regiones, subencargados, contratos y mecanismos de transferencia internacional de cada servicio. No se afirma que todos los datos permanezcan en Chile."}</p>
      <p>{c.conservacion || "La política de conservación por categoría está pendiente de aprobación. Debe cubrir cuentas, cotizaciones, pedidos, fotografías, solicitudes de derechos, registros técnicos y respaldos, con excepciones justificadas. No se declara que exista eliminación automática de estas categorías."}</p>
      <p>El cierre de una cuenta o una solicitud de supresión no elimina automáticamente documentos que deban conservarse por una obligación legal o para resolver una reclamación. Se debe informar el fundamento y alcance de cualquier excepción.</p>
    </SeccionLegal>
    <SeccionLegal titulo="Derechos y respuesta" icon={MessageSquareText}>
      <p>Puedes pedir acceso, rectificación, supresión, oposición, bloqueo, revocación y, cuando corresponda, portabilidad. Describe el tratamiento o los cambios solicitados; para acceso basta tu identificación y el medio de respuesta. No adjuntes una copia de tu cédula en el formulario. Si actúas por otra persona, indícalo para verificar la representación por un medio proporcional.</p>
      <p>Recibirás un comprobante al guardarse la petición. La persona encargada verificará tu identidad antes de comunicar datos o aplicar cambios. La solicitud de bloqueo requiere atención urgente; el comprobante no confirma que el bloqueo ya se haya ejecutado.</p>
      <p>La aplicación utiliza objetivos internos de atención de 24 horas para bloqueo y 48 horas para las demás solicitudes. Estos objetivos no amplían los plazos legales. Actualmente el artículo 16 de la Ley 19.628 contempla reclamación judicial ante falta de pronunciamiento en dos días hábiles; no se aplica anticipadamente el plazo futuro de treinta días.</p>
      <p>Una vez vigente la reforma, su procedimiento contempla treinta días corridos para responder, prórroga fundada bajo sus condiciones y dos días hábiles para resolver el bloqueo temporal. La portabilidad tiene requisitos específicos. Las negativas deben fundarse e indicar la vía de reclamación aplicable.</p>
    </SeccionLegal>
    <SeccionLegal titulo="Sesión, seguimiento y seguridad" icon={LockKeyhole}>
      <p>La autenticación conserva información de sesión en el navegador o dispositivo. La preferencia de apariencia también puede almacenarse localmente. El código de esta versión no activa Google Analytics ni publicidad. Los proveedores pueden generar registros operativos; su conservación debe incluirse en la revisión contractual.</p>
      <p>Quien tenga un código de seguimiento puede ver información operativa del pedido. No publiques el código o QR y comparte solo con personas autorizadas. El seguimiento público omite identificación y montos; el detalle privado requiere iniciar sesión.</p>
      <p>La app solicita cámara al usar el lector QR o capturar evidencia y no solicita ubicación para estas funciones. Las fotografías se envían por una API autenticada y se procesan para eliminar metadatos. La protección requiere también gestión de accesos, respaldo, conservación y atención de incidentes.</p>
    </SeccionLegal>
    <nav aria-label="Canales y fuentes oficiales" className="glass-card flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl bg-white/60 px-6 py-5 text-sm font-semibold text-brand-700"><Link className="underline text-brand-700" href="/privacidad/derechos">Ejercer mis derechos</Link><Link className="underline" href="/terminos">Información del portal</Link><a className="underline" href="https://www.bcn.cl/leychile/navegar?idNorma=141599">Ley 19.628</a><a className="underline" href="https://www.bcn.cl/leychile/navegar?idNorma=1209272">Ley 21.719<ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></a></nav>
  </PaginaLegal>;
}
