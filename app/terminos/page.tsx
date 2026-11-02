import Link from "next/link";
import { AlertCircle, Store, FileText, Package, LockKeyhole, Scale, Building2, ShieldCheck, HelpCircle } from "lucide-react";
import PaginaLegal, { SeccionLegal } from "@/components/privacidad/PaginaLegal";
import { configuracionLegal } from "@/lib/privacidad/configuracion";

export const dynamic = "force-dynamic";
export const metadata = { title: "Términos y Condiciones del Servicio | Lavandería El Cobre" };

export default function TerminosPage() {
  const c = configuracionLegal();
  const razonSocial = c.razonSocial || "Lavandería El Cobre SpA";
  const rut = c.rut || "77.654.321-7";
  const domicilio = c.domicilio || "Avenida Balmaceda 1276 - 1364, Calama, Región de Antofagasta, Chile";
  const representante = c.representante || "Administración General / Representación Legal";
  const email = c.email || "contacto@lavanderiaelcobre.cl";

  return (
    <PaginaLegal
      titulo="Términos y Condiciones del Portal y del Servicio"
      descripcion="Condiciones generales de uso del portal web, proceso de cotización, atención operativa y resguardo de tus derechos como cliente y consumidor."
      actual="/terminos"
      detalle={`Versión ${c.version} · Lavandería El Cobre`}
    >
      {!c.publicada && (
        <p role="status" className="flex items-start gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 p-5 text-sm leading-relaxed text-copper-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            <strong>Borrador técnico en revisión.</strong> Este documento refleja las condiciones operacionales y legales del portal. Su versión definitiva se encuentra formalizada en los canales de atención comercial de la empresa.
          </span>
        </p>
      )}

      {/* 1. Identificación del Proveedor */}
      <SeccionLegal titulo="1. Identificación del Proveedor y Ámbito de Aplicación" icon={Building2}>
        <p>
          El presente portal web es operado y de propiedad de <strong>{razonSocial}</strong>, Rol Único Tributario (RUT) N° <strong>{rut}</strong>, con domicilio legal en <strong>{domicilio}</strong>, correo electrónico de atención <strong>{email}</strong>. Representante legal: <strong>{representante}</strong>.
        </p>
        <p>
          El acceso, navegación y uso de las funcionalidades del portal web disponible en este dominio implican el conocimiento y aceptación expresa de las presentes Condiciones Generales de Uso, así como de nuestro <Link className="underline font-semibold text-brand-700" href="/privacidad">Aviso de Privacidad</Link>. Si el usuario no está de acuerdo con estos términos, deberá abstenerse de utilizar el portal.
        </p>
      </SeccionLegal>

      {/* 2. Objeto y Alcance del Portal */}
      <SeccionLegal titulo="2. Naturaleza y Alcance de las Funcionalidades del Portal" icon={Store}>
        <p>
          Lavandería El Cobre pone a disposición este portal con el objetivo primordial de:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-600">
          <li>Informar al público sobre el catálogo de servicios de lavandería textil, lavado industrial, desinfección y planchado para particulares y empresas.</li>
          <li>Facilitar el envío y recepción de solicitudes de cotización preliminares.</li>
          <li>Permitir a los clientes consultar en tiempo real el estado de avance de sus prendas u órdenes de trabajo mediante código de seguimiento o código QR.</li>
          <li>Proveer a los clientes registrados un panel de autogestión de su cuenta e historial de servicios.</li>
        </ul>
        <p className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 text-xs leading-relaxed text-blue-900">
          <strong>Aclaración sobre transacciones económicas:</strong> El portal web <strong>no opera como pasarela de pago en línea ni procesa compras electrónicas directas con tarjetas</strong>. La contratación formal del servicio, el pago del precio convenido y la emisión de las boletas o facturas electrónicas se perfeccionan presencialmente en nuestro establecimiento o mediante transferencia bancaria y canales comerciales acordados directamente.
        </p>
      </SeccionLegal>

      {/* 3. Cotizaciones y Contratación */}
      <SeccionLegal titulo="3. Solicitud de Cotizaciones y Condiciones Comerciales" icon={FileText}>
        <p>
          El envío de un formulario de cotización a través del sitio web no constituye una reserva vinculante ni perfecciona un contrato de prestación de servicios. Corresponde a una solicitud de presupuesto sin costo alguno para el interesado.
        </p>
        <p>
          Nuestros ejecutivos responderán a la brevedad con una propuesta comercial detallada que indicará:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-stone-600">
          <li>Descripción específica del servicio textil o industrial a realizar.</li>
          <li>Precio neto desglosado y valor total con el Impuesto al Valor Agregado (IVA) aplicable (19%).</li>
          <li>Plazos estimados de recepción, procesamiento y despacho/retiro.</li>
          <li>Condiciones específicas de pago y entrega.</li>
        </ul>
        <p>
          El contrato se entenderá perfeccionado una vez que el cliente confirme la aceptación de la cotización y haga entrega material de las prendas en nuestra planta o a nuestro personal de retiro en ruta autorizado.
        </p>
      </SeccionLegal>

      {/* 4. Cuidado de Prendas y Responsabilidades */}
      <SeccionLegal titulo="4. Recepción, Cuidado de las Prendas y Deber del Cliente" icon={Package}>
        <p>
          Lavandería El Cobre se compromete a tratar cada prenda con la máxima diligencia, utilizando productos industriales biodegradables certificados y maquinarias de alta tecnología adaptadas a cada tipo de tejido.
        </p>
        <p>
          <strong>Deber de revisión y declaración del cliente:</strong>
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-600">
          <li>El cliente debe revisar exhaustivamente los bolsillos de sus prendas antes de entregarlas, retirando dinero, joyas, objetos punzantes, encendedores, lápices o cualquier elemento que pudiera dañar las prendas o las máquinas de lavado. Lavandería El Cobre no responde por la pérdida o deterioro de objetos olvidados en las prendas.</li>
          <li>El cliente debe advertir de forma previa y expresa en el momento de la recepción si alguna prenda requiere lavado en seco, si presenta tintes inestables que puedan desteñir, o si posee rasgaduras, botones sueltos o desgastes previos derivados del uso.</li>
          <li>En caso de prendas de alta sensibilidad sin etiqueta del fabricante con instrucciones de lavado, el tratamiento se efectuará bajo las técnicas estándar de la industria textil.</li>
        </ul>
      </SeccionLegal>

      {/* 5. Comprobantes, Seguimiento y Retiro */}
      <SeccionLegal titulo="5. Comprobantes Oficiales, Seguimiento y Retiro de Prendas" icon={ShieldCheck}>
        <p>
          Al recepcionar las prendas, se emitirá una orden de trabajo (comanda) que contiene el número de pedido, detalle de unidades y un código QR de seguimiento.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-600">
          <li>
            <strong>Comprobante para retiro:</strong> La presentación de la comanda física o del código digital respectivo es el medio exclusivo para retirar las prendas procesadas. Es responsabilidad exclusiva del cliente mantener la debida custodia y confidencialidad de su comprobante o código QR.
          </li>
          <li>
            <strong>Información de seguimiento:</strong> Los estados visualizados en la página de seguimiento son de carácter netamente operacional e informativo respecto a las etapas del proceso (Recepción, Lavado, Secado, Planchado, Listo para Retiro).
          </li>
          <li>
            <strong>Plazo de retiro y bodegaje:</strong> Notificada la disponibilidad para retiro, el cliente dispondrá de un plazo prudencial de 30 días corridos para retirar sus prendas. Transcurrido dicho plazo, se podrán aplicar cargos por bodegaje y custodia conforme a las disposiciones legales aplicables del Código Civil y Código de Comercio.
          </li>
        </ul>
      </SeccionLegal>

      {/* 6. Cuentas de Usuario y Seguridad */}
      <SeccionLegal titulo="6. Seguridad y Custodia de Cuentas de Usuario" icon={LockKeyhole}>
        <p>
          Si creas una cuenta de cliente en el portal, eres el único responsable de mantener la confidencialidad de tu contraseña de acceso y de cualquier actividad efectuada desde tu cuenta.
        </p>
        <p>
          Nuestra plataforma exige el uso de contraseñas seguras con un estándar mínimo de 8 caracteres alfanuméricos. Te comprometes a no ceder, compartir ni divulgar tus credenciales a terceros y a notificar de inmediato a <a className="underline" href={`mailto:${email}`}>{email}</a> cualquier sospecha fundada de acceso no autorizado o incidente que vulnere la seguridad de tu cuenta.
        </p>
      </SeccionLegal>

      {/* 7. Derechos del Consumidor */}
      <SeccionLegal titulo="7. Derechos del Consumidor y Garantía Legal (Ley N° 19.496)" icon={Scale}>
        <p>
          Lavandería El Cobre garantiza el estricto apego y respeto irrenunciable a los derechos de los consumidores consagrados en la <strong>Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</strong> y en el Decreto N° 6/2021 del Ministerio de Economía (Reglamento de Comercio Electrónico).
        </p>
        <p>
          En particular, el cliente tiene derecho a:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-stone-600">
          <li>Recibir información veraz, transparente, oportuna y oportuna sobre el alcance, precio y condiciones del servicio textil prestado.</li>
          <li>La garantía legal por la correcta prestación del servicio contratado. Si el servicio de lavandería no fuere ejecutado conforme a los estándares acordados, el consumidor podrá exigir la reiteración del servicio sin costo adicional o la devolución de la suma pagada.</li>
          <li>La indemnización adecuada y oportuna de los perjuicios ocasionados en caso de deterioro o pérdida comprobable de prendas bajo nuestra custodia directa imputables a culpa de la lavandería, de conformidad a las tablas de depreciación y valoración vigentes.</li>
        </ul>
        <p className="text-xs text-stone-500">
          Para canalizar cualquier reclamo o disconformidad, el cliente dispone de nuestro canal directo de atención en <strong>{email}</strong>, sin perjuicio de su derecho inalienable de acudir ante el Servicio Nacional del Consumidor (SERNAC) o ante los Juzgados de Policía Local competentes.
        </p>
      </SeccionLegal>

      {/* 8. Protección de Datos y Privacidad */}
      <SeccionLegal titulo="8. Protección de Datos Personales (Ley N° 21.719)" icon={HelpCircle}>
        <p>
          El tratamiento de los datos personales suministrados por el cliente se encuentra rigurosamente protegido y se rige por las disposiciones de la Ley N° 21.719 y las políticas contenidas en nuestro <Link className="underline font-bold text-brand-700" href="/privacidad">Aviso de Privacidad</Link>.
        </p>
        <p>
          Todo usuario o cliente puede en cualquier momento y de forma 100% gratuita ejercer sus derechos de acceso, rectificación, supresión, oposición, bloqueo temporal, portabilidad o revocación de consentimientos a través de nuestro <Link className="underline font-bold text-brand-700" href="/privacidad/derechos">Canal Digital de Derechos ARCO+</Link>.
        </p>
      </SeccionLegal>

      {/* 9. Legislación Aplicable y Jurisdicción */}
      <SeccionLegal titulo="9. Legislación Aplicable y Resolución de Controversias" icon={Building2}>
        <p>
          Las presentes Condiciones de Uso y toda relación contractual nacida de la prestación de nuestros servicios se regirán e interpretarán exclusivamente conforme a las leyes de la República de Chile.
        </p>
        <p>
          Cualquier dificultad, diferendo o controversia que se suscite entre las partes con motivo de la validez, interpretación, cumplimiento o extinción de estos términos será sometida a la jurisdicción de los tribunales ordinarios de justicia o juzgados de policía local competentes de la comuna y ciudad de Calama, renunciando las partes a cualquier otro fuero que pudiere corresponderles.
        </p>
      </SeccionLegal>

      <div className="flex flex-wrap items-center gap-4 pt-4">
        <Link
          className="inline-flex min-h-11 items-center rounded-xl bg-gradient-brand px-6 py-3 text-sm font-bold text-white shadow-premium transition-shadow hover:shadow-lg"
          href="/privacidad"
        >
          Consultar Aviso de Privacidad
        </Link>
        <Link
          className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          href="/privacidad/derechos"
        >
          Canal de Derechos ARCO+
        </Link>
      </div>
    </PaginaLegal>
  );
}
