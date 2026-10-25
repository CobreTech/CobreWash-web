import { ShieldCheck, FileText, UserRoundCheck } from "lucide-react";
import PaginaLegal from "@/components/privacidad/PaginaLegal";
import FormularioDerechos from "@/components/privacidad/FormularioDerechos";
export const metadata = { title: "Mis datos personales | Lavandería El Cobre", robots: { index: false, follow: false } };
export default function DerechosPage() {
  return <PaginaLegal titulo="Solicitudes sobre tus datos personales" descripcion="Un canal para consultar y gestionar tu información, tengas o no una cuenta en el portal." actual="/privacidad/derechos">
    <div className="grid gap-3 sm:grid-cols-3">{[
      { icon: FileText, titulo: "Presenta tu solicitud", texto: "Indica qué necesitas y cómo podemos responderte." },
      { icon: ShieldCheck, titulo: "Conserva tu comprobante", texto: "Tu código privado te permite consultar el estado." },
      { icon: UserRoundCheck, titulo: "Verificamos tu identidad", texto: "Antes de comunicar datos o realizar cambios." },
    ].map(({ icon: Icon, titulo, texto }) => <div key={titulo} className="glass-card flex items-start gap-3 rounded-2xl bg-white/55 p-5 shadow-premium"><span className="rounded-xl bg-brand-50 p-2.5 text-brand-600"><Icon className="h-5 w-5" /></span><div><h2 className="text-sm font-extrabold text-stone-900">{titulo}</h2><p className="mt-1 text-xs leading-relaxed text-stone-500">{texto}</p></div></div>)}</div>
    <FormularioDerechos />
  </PaginaLegal>;
}
