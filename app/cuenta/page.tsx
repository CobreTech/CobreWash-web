"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sendEmailVerification, signOut } from "firebase/auth";
import { Loader2, LogOut, Package, QrCode, ShieldCheck, UserRound, Link2, RefreshCw, History, Layers3, CircleDot, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, ArrowUpRight, MailCheck } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useUsuarioActual } from "@/lib/firebase/useUsuarioActual";
import { esRolInterno, LANDING_POR_ROL, type Rol } from "@/lib/roles";
import { ComandaEstado } from "@/src/dataconnect-generated";
import { usePedidosCliente } from "@/lib/portal/usePedidosCliente";
import { TAMANO_PAGINA, vincularPedido } from "@/lib/portal/consultar";
import { ESTADOS_POR_VISTA, type VistaPedidos } from "@/lib/portal/vistas";
import { ESTADOS_PUBLICOS } from "@/lib/seguimiento/publico";
import GlassSelect from "@/components/ui/GlassSelect";
import DetallePedido from "@/components/portal/DetallePedido";

const campo = "w-full rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm font-medium text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10";
const boton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 text-sm font-bold text-white shadow-premium transition-shadow hover:shadow-lg disabled:opacity-50";
const vistas = [{ id: "todos", label: "Todos", icon: Layers3 }, { id: "activos", label: "Activos", icon: CircleDot }, { id: "historial", label: "Historial", icon: History }] as const;

export default function CuentaPage() {
  const router = useRouter();
  const { usuario, loading } = useUsuarioActual();
  const clienteActivo = usuario?.rol.nombre === "cliente" && usuario.activo;
  const [estado, setEstado] = useState<ComandaEstado | null>(null);
  const [vista, setVista] = useState<VistaPedidos>("todos");
  const [pagina, setPagina] = useState(0);
  const [numero, setNumero] = useState("");
  const [vinculando, setVinculando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const { pedidos, total, cargando, error, actualizar } = usePedidosCliente(clienteActivo ? usuario.id : null, estado, pagina, vista);

  useEffect(() => {
    if (loading) return;
    if (!usuario) router.replace("/?login=1");
    else if (esRolInterno(usuario.rol.nombre)) router.replace(LANDING_POR_ROL[usuario.rol.nombre as Rol] ?? "/intranet");
  }, [loading, usuario, router]);

  async function vincular(event: React.FormEvent) {
    event.preventDefault(); setVinculando(true); setMensaje(""); setErrorAccion("");
    try {
      await vincularPedido(numero);
      setNumero(""); setMensaje("Comanda vinculada a tu cuenta.");
      if (estado !== null || pagina !== 0 || vista !== "todos") { setEstado(null); setPagina(0); setVista("todos"); }
      else await actualizar();
    } catch (error) {
      setErrorAccion(error instanceof Error && error.message.startsWith("Ingresa") ? error.message : "No se pudo vincular. Revisa el número y verifica que el correo de tu cuenta coincida con el del comprobante. Si no coincide, contacta a recepción.");
    } finally { setVinculando(false); }
  }

  async function verificarCorreo() {
    setEnviando(true); setErrorAccion(""); setMensaje("");
    try {
      if (!auth.currentUser) throw new Error("Sin sesión");
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      window.dispatchEvent(new Event("cobre:perfil-actualizado"));
      if (!auth.currentUser.emailVerified) await sendEmailVerification(auth.currentUser);
      setMensaje(auth.currentUser.emailVerified ? "Tu correo ya está verificado. Puedes vincular tu pedido." : "Te enviamos un enlace de verificación. Ábrelo y luego vuelve a vincular tu pedido.");
    } catch { setErrorAccion("No pudimos enviar la verificación. Espera un momento y vuelve a intentarlo."); }
    finally { setEnviando(false); }
  }

  if (loading || !usuario || !clienteActivo) return <main className="flex min-h-screen items-center justify-center gap-3 text-sm text-stone-500"><Loader2 aria-label="Cargando cuenta" className="h-5 w-5 animate-spin text-brand-600" />Preparando tu cuenta…</main>;
  const perfil = usuario.clientes_on_usuario[0];
  return <main className="relative isolate min-h-screen overflow-hidden pb-16 text-stone-900">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] bg-gradient-to-b from-brand-50/80 via-copper-50/40 to-transparent" />
    <header className="glass-nav sticky top-0 z-30 border-b border-brand-500/10 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5"><Image src="/logo.webp" alt="Logo Lavandería El Cobre" width={40} height={40} className="h-10 w-auto" /><span className="font-display text-sm font-extrabold">Lavandería <span className="text-brand-600">El Cobre</span></span></Link>
        <nav aria-label="Mi cuenta" className="flex flex-wrap items-center gap-2 text-xs font-semibold"><Link href="/seguimiento" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/60 px-3 text-stone-600 hover:bg-brand-50"><QrCode className="h-4 w-4 text-brand-600" />Seguimiento público</Link><Link href="/privacidad/derechos" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-stone-600 hover:bg-brand-50"><ShieldCheck className="h-4 w-4 text-brand-600" />Mis datos personales</Link><button onClick={async () => { try { await signOut(auth); router.replace("/"); } catch { setErrorAccion("No pudimos cerrar la sesión. Intenta nuevamente."); } }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white/60 px-3 text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"><LogOut className="h-4 w-4" />Salir</button></nav>
      </div>
    </header>
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="flex flex-wrap items-center justify-between gap-5"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-brand-700">Tu portal de cliente</p><h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Hola, <span className="text-brand-600">{usuario.nombre}</span></h1><p className="mt-3 text-sm text-stone-500">Tus prendas, tus pedidos y todo su recorrido, en un mismo lugar.</p></div><span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/65 px-4 py-2 text-xs font-semibold text-brand-700"><ShieldCheck className="h-4 w-4" />Cuenta privada</span></section>
      <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-5">
          <section className="glass-card rounded-3xl bg-white/65 p-6 shadow-premium backdrop-blur-lg"><span className="mb-4 inline-flex rounded-2xl bg-gradient-brand p-3 text-white shadow-premium"><UserRound className="h-6 w-6" /></span><h2 className="font-display text-lg font-extrabold">Mi perfil</h2><p className="mt-1 text-[11px] font-bold text-brand-700">Cliente · {perfil ? (perfil.tipoCliente === "HOTEL" ? "Empresa" : "Particular") : "Ficha pendiente de validación"}</p><p className="mt-3 break-all text-xs text-stone-500">{usuario.email}</p><dl className="mt-5 space-y-3 border-t border-stone-100 pt-4 text-xs">{[["RUT", usuario.rut], ["Teléfono", usuario.telefono], ["Dirección", perfil?.direccion]].map(([label, value]) => <div key={label}><dt className="text-stone-400">{label}</dt><dd className="mt-1 break-words font-semibold text-stone-700">{value || "Sin registrar"}</dd></div>)}</dl></section>
          <section className="glass-card space-y-4 rounded-3xl bg-white/65 p-6 shadow-premium backdrop-blur-lg"><span className="inline-flex rounded-xl bg-brand-50 p-2.5 text-brand-600"><Link2 className="h-5 w-5" /></span><h2 className="font-display text-base font-extrabold">Vincular una comanda anterior</h2><p className="text-xs leading-relaxed text-stone-500">Ingresa el número de tu comprobante. El correo registrado en recepción debe coincidir con el de tu cuenta y estar verificado.</p><form onSubmit={vincular} className="space-y-3"><label className="block text-xs font-bold text-stone-600">Número de comanda<input required maxLength={20} value={numero} onChange={e => setNumero(e.target.value)} placeholder="ELCOBRE-14r3 o 14r3" className={`${campo} mt-2`} /></label><button disabled={vinculando} className={`${boton} w-full`}>{vinculando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}{vinculando ? "Vinculando…" : "Vincular pedido"}</button></form><button disabled={enviando} onClick={() => void verificarCorreo()} className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-brand-700 underline underline-offset-4 disabled:opacity-50"><MailCheck className="h-4 w-4" />{enviando ? "Enviando…" : "Verificar mi correo"}</button>{mensaje && <p role="status" className="flex items-start gap-2 rounded-xl bg-green-50 p-3 text-xs leading-relaxed text-green-700"><CheckCircle2 className="h-4 w-4 shrink-0" />{mensaje}</p>}</section>
          <Link href="/privacidad/derechos" className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-xs leading-relaxed text-stone-600"><ShieldCheck className="h-5 w-5 shrink-0 text-brand-600" /><span>¿Necesitas gestionar tus datos personales?<span className="mt-1 block font-bold text-brand-700">Ir al canal de derechos <ArrowUpRight className="inline h-3.5 w-3.5" /></span></span></Link>
        </aside>
        <section className="min-w-0 space-y-5" aria-busy={cargando} aria-label="Mis pedidos">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-extrabold">Mis pedidos</h2><p className="mt-1 text-xs text-stone-500">Abre una comanda para ver sus prendas, montos, etapas y QR.</p></div><button disabled={cargando} onClick={() => void actualizar()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white/60 px-4 text-xs font-bold text-stone-600 hover:bg-brand-50 disabled:opacity-50"><RefreshCw className={cargando ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Actualizar pedidos</button></div>
          <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/65 p-3 shadow-premium"><nav aria-label="Vistas de pedidos" className="flex flex-wrap gap-1">{vistas.map(v => { const Icon = v.icon; return <button key={v.id} type="button" aria-pressed={vista === v.id} onClick={() => { setVista(v.id); setEstado(null); setPagina(0); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${vista === v.id ? "bg-gradient-brand text-white shadow-premium" : "text-stone-500 hover:bg-brand-50 hover:text-brand-700"}`}><Icon className="h-4 w-4" />{v.label}</button>; })}</nav><div className="w-full sm:w-56"><GlassSelect ariaLabel="Filtrar por estado" disabled={vinculando} value={estado ?? ""} onChange={value => { setEstado((value || null) as ComandaEstado | null); setPagina(0); }} options={[{ value: "", label: "Todos los estados" }, ...ESTADOS_POR_VISTA[vista].map(value => ({ value, label: ESTADOS_PUBLICOS[value] }))]} /></div></div>
          <p className="text-xs text-stone-500">Más recientes primero · {total} pedidos{estado ? " en este estado" : vista === "activos" ? " activos" : vista === "historial" ? " en el historial" : " en tu cuenta"}</p>
          {errorAccion && <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" />{errorAccion}</p>}
          {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button onClick={() => void actualizar()} disabled={cargando} className="font-bold underline">Reintentar</button></div>}
          {cargando && <p role="status" className="flex items-center gap-2 rounded-xl bg-white/60 p-4 text-sm text-stone-500"><Loader2 className="h-4 w-4 animate-spin text-brand-600" />Cargando pedidos…</p>}
          {!cargando && !error && pedidos.length === 0 && <div className="glass-card rounded-3xl bg-white/65 p-8 text-center shadow-premium"><Package className="mx-auto mb-4 h-10 w-10 text-brand-400" /><h3 className="font-display text-lg font-bold">{estado || vista !== "todos" ? "No hay pedidos en esta vista" : "Tus próximos pedidos aparecerán aquí"}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-500">{estado || vista !== "todos" ? "Prueba otro estado o consulta todos tus pedidos." : "Todavía no tienes pedidos en tu cuenta. Puedes vincular uno con el número de tu comprobante."}</p></div>}
          {pedidos.map(pedido => <DetallePedido key={pedido.id} pedido={pedido} />)}
          <nav aria-label="Páginas de mis pedidos" className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-500"><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-stone-200 bg-white/60 px-3 disabled:opacity-40" disabled={cargando || pagina === 0} onClick={() => setPagina(p => p - 1)}><ChevronLeft className="h-4 w-4" />Anterior</button><span>Página {pagina + 1} de {Math.max(1, Math.ceil(total / TAMANO_PAGINA))}</span><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-stone-200 bg-white/60 px-3 disabled:opacity-40" disabled={cargando || (pagina + 1) * TAMANO_PAGINA >= total} onClick={() => setPagina(p => p + 1)}>Siguiente<ChevronRight className="h-4 w-4" /></button></nav>
        </section>
      </div>
    </div>
  </main>;
}
