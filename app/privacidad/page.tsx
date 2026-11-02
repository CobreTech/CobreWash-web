import Link from "next/link";
import { AlertCircle, UserRound, Database, FileCheck2, Building2, MessageSquareText, LockKeyhole, ArrowUpRight } from "lucide-react";
import PaginaLegal, { SeccionLegal } from "@/components/privacidad/PaginaLegal";
import { configuracionLegal } from "@/lib/privacidad/configuracion";

export const dynamic = "force-dynamic";
export const metadata = { title: "Privacidad y Tratamiento de Datos | Lavandería El Cobre", robots: { index: false, follow: true } };

export default function PrivacidadPage() {
  const c = configuracionLegal();
  const razonSocial = c.razonSocial || "Lavandería El Cobre SpA";
  const rut = c.rut || "77.654.321-7";
  const domicilio = c.domicilio || "Avenida Balmaceda 1276 - 1364, Calama, Región de Antofagasta, Chile";
  const representante = c.representante || "Administración General / Oficial de Cumplimiento";
  const email = c.email || "privacidad@lavanderiaelcobre.cl";

  return (
    <PaginaLegal
      titulo="Aviso de Privacidad y Protección de Datos"
      descripcion="Información clara y transparente sobre cómo recopilamos, utilizamos y protegemos tus datos personales, tus derechos y los canales formales para ejercerlos."
      actual="/privacidad"
      detalle={`Versión ${c.version} · Lavandería El Cobre`}
    >
      {!c.publicada && (
        <p role="status" className="flex items-start gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 p-5 text-sm leading-relaxed text-copper-900">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            <strong>Borrador técnico pendiente de publicación formal.</strong> Este texto describe los controles operativos y tecnológicos implementados en la plataforma. Para su publicación oficial en producción se requiere la aprobación legal definitiva de los representantes de la empresa.
          </span>
        </p>
      )}

      {/* 1. Responsable del Tratamiento */}
      <SeccionLegal titulo="1. Responsable del Tratamiento y Datos de Contacto" icon={UserRound}>
        <p>
          El responsable del tratamiento de los datos personales tratados a través de este portal y en el marco de la prestación de nuestros servicios de lavandería es <strong>{razonSocial}</strong>, RUT <strong>{rut}</strong>, con domicilio legal en <strong>{domicilio}</strong>. Representante legal: <strong>{representante}</strong>.
        </p>
        <p>
          Para cualquier consulta, solicitud o ejercicio de tus derechos respecto de tus datos personales, puedes contactar a nuestro canal oficial de privacidad en el correo <a className="underline" href={`mailto:${email}`}>{email}</a> o ingresar directamente una petición formal y gratuita a través de nuestro <Link className="underline text-brand-700" href="/privacidad/derechos">Canal Digital de Derechos ARCO+</Link>, disponible para cualquier persona, cuente o no con una cuenta de usuario en el portal.
        </p>
        <p className="text-xs text-stone-500">
          De conformidad con el Artículo 50 inciso tercero de la Ley N° 21.719, la coordinación interna del modelo de protección de datos personales y la atención a titulares es coordinada por la Administración General de la empresa.
        </p>
      </SeccionLegal>

      {/* 2. Categorías de Datos Recopilados */}
      <SeccionLegal titulo="2. Datos Personales que Tratamos y Obligatoriedad de su Entrega" icon={Database}>
        <p>
          En estricta observancia del principio de minimización (Artículo 3° letra c de la Ley N° 21.719), solo solicitamos y tratamos los datos estrictamente pertinentes y necesarios para la adecuada atención y prestación del servicio:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-stone-600">
          <li>
            <strong>Cuentas de clientes y acceso al portal:</strong> Nombre completo, correo electrónico, RUT, credenciales de acceso seguras gestionadas criptográficamente y, si el usuario decide registrarlos para facilitar el servicio, número de teléfono y dirección de retiro/entrega. El suministro del nombre, correo y RUT es obligatorio para la contratación formal del servicio y la emisión obligatoria de la boleta o factura respectiva; los datos de teléfono o domicilio son facultativos.
          </li>
          <li>
            <strong>Formularios de cotización y contacto:</strong> Nombre, correo electrónico, requerimiento o consulta sobre el servicio textil, y opcionalmente número telefónico de contacto. Estos datos se usan exclusivamente para elaborar y remitir la cotización solicitada.
          </li>
          <li>
            <strong>Datos operacionales y de trazabilidad:</strong> Número correlativo de comanda u orden de trabajo, detalle de prendas, tipo de proceso de lavado/desinfección, fecha y hora de recepción/despacho, incidencias operacionales y registro del operario responsable de cada etapa.
          </li>
          <li>
            <strong>Fotografías de inspección física (App móvil):</strong> Imágenes capturadas por el personal de reparto para constatar el estado exterior del vehículo de transporte previo y posterior a la ruta. Se encuentra terminantemente prohibido fotografiar rostros de personas, cédulas de identidad, patentes ajenas o documentos privados.
          </li>
          <li>
            <strong>Canal de ejercicio de derechos:</strong> Nombre del titular o de su representante facultado, correo electrónico para notificaciones, derecho invocado, antecedentes fundamentatorios y constancia criptográfica de verificación.
          </li>
        </ul>
        <p className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-xs leading-relaxed text-amber-900">
          <strong>Aviso de exclusión de datos sensibles:</strong> Nuestra plataforma no recopila ni trata datos personales sensibles (datos biométricos, de salud, convicciones religiosas o políticas, afiliación sindical) ni datos de menores de edad. Te solicitamos no incorporar información sensible en los campos libres de texto.
        </p>
      </SeccionLegal>

      {/* 3. Finalidades y Bases de Licitud */}
      <SeccionLegal titulo="3. Finalidades Específicas y Bases de Licitud" icon={FileCheck2}>
        <p>
          Todo tratamiento de datos personales realizado por Lavandería El Cobre se encuentra legitimado por una base legal específica conforme al Artículo 13 de la Ley N° 21.719:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-stone-600">
          <li>
            <strong>Ejecución del contrato de servicio (Art. 13 letra b):</strong> Procesamiento de las órdenes de lavado industrial y doméstico, seguimiento en línea del avance de prendas, coordinación de entrega y gestión de la cuenta del usuario.
          </li>
          <li>
            <strong>Cumplimiento de obligaciones legales y tributarias (Art. 13 letra c):</strong> Emisión de boletas y facturas electrónicas exigidas por el Servicio de Impuestos Internos (SII) y conservación contable según el Código de Comercio y Código Tributario.
          </li>
          <li>
            <strong>Consentimiento del titular (Art. 12):</strong> Elaboración y respuesta a solicitudes de cotización o consultas comerciales iniciadas voluntariamente por el usuario. El titular puede revocar este consentimiento en cualquier momento sin efectos retroactivos.
          </li>
          <li>
            <strong>Interés legítimo en seguridad técnica (Art. 13 letra e):</strong> Prevención de fraude, protección contra ataques de fuerza bruta cibernética y rate-limiting de nuestros servidores mediante el uso de contadores seudonimizados y códigos hash temporales.
          </li>
        </ul>
        <p>
          <strong>Decisiones automatizadas:</strong> Declaramos expresamente que Lavandería El Cobre no adopta decisiones basadas exclusivamente en tratamientos automatizados de datos personales ni realiza elaboración de perfiles (profiling) que produzcan efectos jurídicos o afecten significativamente a los usuarios (Artículo 14 ter letra j).
        </p>
      </SeccionLegal>

      {/* 4. Plazos y Criterios de Conservación */}
      <SeccionLegal titulo="4. Plazos y Criterios de Conservación de Datos" icon={Building2}>
        <p>
          En aplicación del principio de limitación del plazo de conservación (Artículo 3° letra c), los datos personales se mantienen únicamente durante el tiempo estrictamente necesario para cumplir las finalidades que motivaron su recolección o para responder a requerimientos legales:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-stone-600">
          <li>
            <strong>Fotografías operacionales en dispositivos móviles:</strong> Se almacenan temporalmente en la aplicación móvil y se eliminan automáticamente tras confirmarse su transmisión al servidor, realizándose una purga definitiva e irreversible en el dispositivo si superan las <strong>48 horas</strong> de antigüedad.
          </li>
          <li>
            <strong>Cuentas y perfiles de usuarios:</strong> Se conservan activos mientras se mantenga la relación comercial o hasta que el titular solicite voluntariamente el cierre de su cuenta o la supresión de sus datos.
          </li>
          <li>
            <strong>Documentación tributaria y comercial (facturación):</strong> Se conservan obligatoriamente durante el plazo legal de <strong>6 años</strong> establecido en el Artículo 17 del Código Tributario y la normativa del SII.
          </li>
          <li>
            <strong>Expedientes de solicitudes de derechos:</strong> Se conservan por un plazo de <strong>3 años</strong> con el único fin de acreditar el cumplimiento legal y la debida diligencia ante la Agencia de Protección de Datos Personales.
          </li>
          <li>
            <strong>Registros técnicos de conexión y auditoría (logs):</strong> Se mantienen por un plazo máximo de <strong>6 meses</strong> como salvaguarda de seguridad y trazabilidad.
          </li>
        </ul>
        <p className="text-xs text-stone-500">
          {c.conservacion || "Cumplidos los plazos indicados o acogida una solicitud de supresión, se procederá al borrado seguro o a la anonimización irreversible de los datos personales, salvo que exista un deber legal o judicial de conservación."}
        </p>
      </SeccionLegal>

      {/* 5. Destinatarios, Servidores y Transferencias Internacionales */}
      <SeccionLegal titulo="5. Destinatarios, Regiones de Servidores y Transferencias Internacionales" icon={Building2}>
        <p>
          Tus datos personales no son comercializados, arrendados ni cedidos a terceros con fines publicitarios. El acceso interno a la información se restringe estrictamente a nuestro personal operativo y administrativo en razón de sus funciones, bajo obligación contractual de secreto y confidencialidad permanente (Artículo 14 bis de la Ley N° 21.719), deber que subsiste indefinidamente incluso tras la extinción de la relación laboral.
        </p>
        <p>
          Para brindar un servicio tecnológico seguro y de alta disponibilidad, recurrimos a proveedores de infraestructura tecnológica de primer nivel que actúan en calidad de <strong>encargados del tratamiento</strong> (Artículo 15):
        </p>
        <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-2.5 text-xs">
          <p className="font-bold text-stone-900">Topología de infraestructura y servidores:</p>
          <ul className="space-y-1.5 list-disc pl-5 text-stone-700">
            <li>
              <strong>Base de datos transaccional (Data Connect / Cloud SQL):</strong> Alojada en <strong>Google Cloud Platform</strong> en la región de <strong>Santiago de Chile (<code>southamerica-west1</code>)</strong>.
            </li>
            <li>
              <strong>Almacenamiento de evidencias e imágenes (Cloud Storage):</strong> Alojado en <strong>Google Cloud Platform</strong> en la región de <strong>Santiago de Chile (<code>southamerica-west1</code>)</strong>.
            </li>
            <li>
              <strong>Portal web y procesamiento serverless:</strong> Alojado en <strong>Vercel Inc.</strong> en la región de <strong>São Paulo, Brasil (<code>gru1</code>)</strong>, fijado contractualmente mediante configuración técnica.
            </li>
            <li>
              <strong>Gestión criptográfica de identidades y accesos:</strong> Proveída por <strong>Firebase Authentication (Google LLC)</strong> con procesamiento de validación en <strong>Estados Unidos (<code>us-central1 / global</code>)</strong>.
            </li>
          </ul>
        </div>
        <p>
          Las transferencias internacionales de datos hacia Brasil y Estados Unidos se efectúan conforme a los Artículos 27 a 29 de la Ley N° 21.719, encontrándose amparadas en <strong>Cláusulas Contractuales Tipo (SCC)</strong> y Acuerdos de Procesamiento de Datos (DPA) que aseguran estándares de protección, confidencialidad y seguridad equivalentes a la legislación chilena.
        </p>
      </SeccionLegal>

      {/* 6. Derechos del Titular y Reclamación ante la Agencia */}
      <SeccionLegal titulo="6. Tus Derechos Legales y Plazos de Atención" icon={MessageSquareText}>
        <p>
          La Ley N° 21.719 reconoce a toda persona los siguientes derechos sobre sus datos personales (Derechos ARCO+):
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-stone-600">
          <li><strong>Derecho de Acceso (Art. 5°):</strong> Solicitar confirmación de si tratamos tus datos, qué categorías conservamos, el origen de los mismos, las finalidades y sus destinatarios.</li>
          <li><strong>Derecho de Rectificación (Art. 6°):</strong> Modificar, actualizar o corregir datos inexactos, desactualizados o incompletos, acompañando los antecedentes sustentatorios.</li>
          <li><strong>Derecho de Supresión (Art. 7°):</strong> Solicitar el borrado o anonimización de tus datos si ya no son necesarios para los fines del servicio, si revocaste el consentimiento o si carecen de base legal.</li>
          <li><strong>Derecho de Oposición (Art. 8°):</strong> Oponerte al tratamiento de tus datos fundado en interés legítimo por una situación particular, o al envío de cualquier comunicación comercial directa.</li>
          <li><strong>Derecho de Bloqueo Temporal (Art. 8° ter):</strong> Medida cautelar para suspender temporalmente el uso o cesión de tus datos mientras se tramita una rectificación, supresión u oposición, o para resguardo probatorio.</li>
          <li><strong>Derecho a la Portabilidad (Art. 9°):</strong> Obtener una copia estructurada de tus datos provistos en formato electrónico genérico e interoperable (JSON) para transferirlos a ti o a otro prestador.</li>
          <li><strong>Revocación del Consentimiento (Art. 12):</strong> Revocar en cualquier momento las autorizaciones otorgadas para fines no esenciales, sin efectos retroactivos.</li>
        </ul>

        <div className="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4 space-y-2">
          <h3 className="font-bold text-brand-900 text-sm">Plazos Legales de Atención y Respuesta (Artículo 11):</h3>
          <p className="text-xs text-stone-700 leading-relaxed">
            Las solicitudes de acceso, rectificación, supresión, oposición, portabilidad y revocación serán respondidas en un plazo máximo de <strong>30 días corridos</strong> contados desde su recepción, prorrogables fundadamente por una sola vez por otros <strong>30 días corridos</strong> bajo las causales del Artículo 11. Las solicitudes de <strong>Bloqueo Temporal</strong> cautelar cuentan con tramitación prioritaria urgente y deben resolverse en un plazo máximo de <strong>2 días hábiles</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-2">
          <h3 className="font-bold text-red-900 text-sm">Derecho de Reclamación ante la Agencia de Protección de Datos Personales (Artículo 41):</h3>
          <p className="text-xs text-red-800 leading-relaxed">
            Si tu solicitud es denegada, no es respondida dentro del plazo legal fijado, o la respuesta resulta insatisfactoria, tienes el derecho expreso de formular una <strong>Reclamación de Tutela de Derechos ante la Agencia de Protección de Datos Personales</strong> dentro del plazo perentorio de <strong>30 días hábiles</strong> contados desde la notificación de la negativa o desde el vencimiento del plazo de respuesta respectivo.
          </p>
        </div>

        <p className="text-xs text-stone-500">
          El ejercicio de tus derechos es completamente gratuito. Puedes ingresar tu solicitud en cualquier momento mediante nuestro <Link className="underline text-brand-700 font-bold" href="/privacidad/derechos">formulario de derechos</Link>, donde recibirás un comprobante digital privado con código identificador único y secreto criptográfico para consultar el estado del trámite en línea.
        </p>
      </SeccionLegal>

      {/* 7. Medidas de Seguridad de la Información */}
      <SeccionLegal titulo="7. Medidas de Seguridad y Protección de la Información" icon={LockKeyhole}>
        <p>
          En conformidad con el Artículo 14 quinquies de la Ley N° 21.719, aplicamos medidas técnicas, humanas y organizativas de seguridad proporcionales a los riesgos del tratamiento para garantizar la confidencialidad, integridad, disponibilidad y resiliencia de los datos:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-600">
          <li><strong>Cifrado en tránsito y reposo:</strong> Toda comunicación entre el usuario y nuestros servidores viaja cifrada mediante HTTPS/TLS con directiva <code>Strict-Transport-Security</code> (HSTS) forzada y cabeceras de seguridad <code>Content-Security-Policy</code> (CSP).</li>
          <li><strong>Control de acceso estricto (IAM):</strong> Separación de roles de usuario y personal (RBAC), impidiendo que personal operativo acceda a datos financieros o pedidos ajenos a su turno.</li>
          <li><strong>Contraseñas robustas:</strong> Exigencia obligatoria de contraseñas de al menos 8 caracteres con combinación de letras y números, almacenadas con hash criptográfico unidireccional y salting.</li>
          <li><strong>Protección de binarios móviles:</strong> Reducción de superficie de ataque y ofuscación de código mediante R8/ProGuard en la app Android para evitar ingeniería inversa.</li>
          <li><strong>Trazabilidad y contramedidas:</strong> Limitadores de tasa (rate-limiting) para neutralizar ataques de fuerza bruta o escaneos automáticos.</li>
          <li><strong>Gestión de incidentes de seguridad (Art. 14 sexies):</strong> Protocolo formal para la evaluación y reporte de cualquier brecha de seguridad a la Agencia de Protección de Datos Personales y a los titulares afectados dentro de las 72 horas corridas de detectada la vulneración.</li>
        </ul>
      </SeccionLegal>

      <nav aria-label="Canales y fuentes oficiales" className="glass-card flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl bg-white/60 px-6 py-5 text-sm font-semibold text-brand-700">
        <Link className="underline text-brand-700" href="/privacidad/derechos">Ejercer mis derechos</Link>
        <Link className="underline" href="/terminos">Términos y condiciones del servicio</Link>
        <a className="underline" href="https://www.bcn.cl/leychile/navegar?idNorma=141599" target="_blank" rel="noopener noreferrer">Ley 19.628</a>
        <a className="underline" href="https://www.bcn.cl/leychile/navegar?idNorma=1209272" target="_blank" rel="noopener noreferrer">Ley 21.719 Oficial<ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></a>
      </nav>
    </PaginaLegal>
  );
}
