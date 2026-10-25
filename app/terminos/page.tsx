import Link from "next/link";
import { AlertCircle, Store, FileText, Package, LockKeyhole, Scale, Building2 } from "lucide-react";
import PaginaLegal, { SeccionLegal } from "@/components/privacidad/PaginaLegal";
import { configuracionLegal } from "@/lib/privacidad/configuracion";
export const dynamic = "force-dynamic";
export const metadata = { title: "Información del portal | Lavandería El Cobre" };
export default function TerminosPage() {
  const c = configuracionLegal();
  return <PaginaLegal titulo="Información y uso del portal" descripcion="Consulta el alcance del portal, sus canales de atención y las condiciones para utilizar tu cuenta." actual="/terminos">
    {!c.publicada && <p role="status" className="flex items-start gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 p-5 text-sm leading-relaxed text-copper-900"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><span><strong>Borrador pendiente de aprobación.</strong> Falta confirmar la identificación del proveedor y aprobar los avisos antes de su publicación definitiva.</span></p>}
    <SeccionLegal titulo="Qué puedes hacer en el portal" icon={Store}><p>Lavandería El Cobre utiliza este portal para informar servicios, recibir consultas y cotizaciones, y permitir el seguimiento de pedidos. Esta versión no incluye un proceso de contratación ni un cobro en línea a clientes.</p></SeccionLegal>
    <SeccionLegal titulo="Consultas y cotizaciones" icon={FileText}><p>El envío de una consulta no confirma una reserva ni un contrato. El alcance, precio total, impuestos, entrega y condiciones del servicio deben informarse y acordarse por el canal de atención correspondiente antes de contratar. No se presume que una cotización aceptada por otro medio quede exenta de la normativa de consumo.</p></SeccionLegal>
    <SeccionLegal titulo="Pedidos y comprobantes" icon={Package}><p>Conserva los comprobantes del servicio. La información de seguimiento es operativa; para consultas o reclamos utiliza los canales de atención de la lavandería. La cuenta muestra los pedidos asociados y no sustituye los documentos tributarios.</p></SeccionLegal>
    <SeccionLegal titulo="Cuida el acceso a tu información" icon={LockKeyhole}><p>Mantén privada tu contraseña y los códigos de seguimiento. Informa cualquier acceso que no reconozcas. Solo puedes consultar información propia o para la que tengas autorización.</p></SeccionLegal>
    <SeccionLegal titulo="Tus derechos como consumidor" icon={Scale}><p>Estas condiciones no limitan los derechos irrenunciables del consumidor ni excluyen responsabilidades que la ley impone al proveedor. Antes de incorporar compras o pagos en línea se deben completar las condiciones de contratación, confirmación escrita, precios, entrega y retracto según corresponda.</p></SeccionLegal>
    <SeccionLegal titulo="Identificación del proveedor" icon={Building2}><p>Proveedor: {c.razonSocial || "identificación pendiente de confirmar"}. RUT: {c.rut || "pendiente"}. Domicilio: {c.domicilio || "pendiente"}.</p></SeccionLegal>
    <Link className="inline-flex min-h-11 items-center rounded-xl bg-gradient-brand px-5 py-3 text-sm font-bold text-white shadow-premium transition-shadow hover:shadow-lg" href="/privacidad">Privacidad y canal de derechos</Link>
  </PaginaLegal>;
}
