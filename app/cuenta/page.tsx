"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendEmailVerification, signOut } from "firebase/auth";
import { Loader2, LogOut, Package } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useUsuarioActual } from "@/lib/firebase/useUsuarioActual";
import { esRolInterno, LANDING_POR_ROL, type Rol } from "@/lib/roles";
import { ComandaEstado } from "@/src/dataconnect-generated";
import { usePedidosCliente } from "@/lib/portal/usePedidosCliente";
import { TAMANO_PAGINA, vincularPedido, type PedidoCliente } from "@/lib/portal/consultar";
import { ESTADOS_PUBLICOS, fechaSeguimiento, presentarPedido } from "@/lib/seguimiento/publico";

const clp = (valor: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(valor);
const campo = "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900";
const boton = "rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50";

export default function CuentaPage() {
  const router = useRouter();
  const { usuario, loading } = useUsuarioActual();
  const clienteActivo = usuario?.rol.nombre === "cliente" && usuario.activo;
  const [estado, setEstado] = useState<ComandaEstado | null>(null);
  const [pagina, setPagina] = useState(0);
  const [numero, setNumero] = useState("");
  const [vinculando, setVinculando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const { pedidos, total, cargando, error, actualizar } = usePedidosCliente(clienteActivo ? usuario.id : null, estado, pagina);

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
      if (estado !== null || pagina !== 0) { setEstado(null); setPagina(0); }
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

  if (loading || !usuario || !clienteActivo) return <main className="flex min-h-screen items-center justify-center"><Loader2 aria-label="Cargando cuenta" className="animate-spin text-brand-600" /></main>;
  const perfil = usuario.clientes_on_usuario[0];
  return <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white text-stone-900">
    <header className="border-b border-stone-200 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-display font-extrabold">Lavandería <span className="text-brand-600">El Cobre</span></Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm"><Link href="/seguimiento">Seguimiento público</Link><Link href="/privacidad/derechos">Mis datos personales</Link><button onClick={async () => { try { await signOut(auth); router.replace("/"); } catch { setErrorAccion("No pudimos cerrar la sesión. Intenta nuevamente."); } }} className="flex items-center gap-2 text-red-600"><LogOut size={16} />Salir</button></nav>
      </div>
    </header>
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <section className="rounded-3xl border border-stone-200 bg-white p-6">
        <p className="text-xs font-bold text-brand-700">Cliente · {perfil ? (perfil.tipoCliente === "HOTEL" ? "Empresa" : "Particular") : "Ficha pendiente de validación"}</p>
        <h1 className="mt-2 text-2xl font-extrabold">Hola, {usuario.nombre}</h1>
        <p className="mt-2 break-all text-sm text-stone-600">{usuario.email}</p>
        <p className="mt-1 text-sm text-stone-500">Aquí puedes consultar tus pedidos actuales y anteriores.</p>
        <dl className="mt-4 grid gap-3 border-t border-stone-100 pt-4 text-sm sm:grid-cols-2">
          <div><dt className="text-stone-500">RUT</dt><dd>{usuario.rut ?? "Sin registrar"}</dd></div>
          <div><dt className="text-stone-500">Teléfono</dt><dd>{usuario.telefono ?? "Sin registrar"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-stone-500">Dirección</dt><dd>{perfil?.direccion ?? "Sin registrar"}</dd></div>
        </dl>
      </section>
      <section className="space-y-3 rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold">Vincular una comanda anterior</h2>
        <p className="text-sm text-stone-600">Ingresa el número de tu comprobante. Para proteger el detalle de tus pedidos, el correo registrado en recepción debe coincidir con el de tu cuenta y estar verificado.</p>
        <form onSubmit={vincular} className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1 text-sm font-semibold">Número de comanda<input required maxLength={20} value={numero} onChange={e => setNumero(e.target.value)} placeholder="ELCOBRE-14r3 o 14r3" className={`${campo} mt-1`} /></label>
          <button disabled={vinculando} className={`${boton} self-end`}>{vinculando ? "Vinculando…" : "Vincular pedido"}</button>
        </form>
        <button disabled={enviando} onClick={() => void verificarCorreo()} className="text-sm font-bold text-brand-700 underline disabled:opacity-50">{enviando ? "Enviando…" : "Verificar mi correo"}</button>
        {mensaje && <p role="status" className="text-sm text-green-700">{mensaje}</p>}
      </section>
      {errorAccion && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{errorAccion}</p>}
      <section className="space-y-4" aria-busy={cargando}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-bold">Mis pedidos</h2>
          <button disabled={cargando} onClick={() => void actualizar()} className="text-sm font-bold text-brand-700 underline disabled:opacity-50">Actualizar pedidos</button>
          <label className="text-sm font-semibold">Filtrar por estado<select value={estado ?? ""} disabled={vinculando} onChange={e => { setEstado((e.target.value || null) as ComandaEstado | null); setPagina(0); }} className={`${campo} mt-1`}><option value="">Todos los estados</option>{Object.values(ComandaEstado).map(value => <option key={value} value={value}>{ESTADOS_PUBLICOS[value]}</option>)}</select></label>
        </div>
        <p className="text-sm text-stone-500">Más recientes primero · {total} pedidos{estado ? " en este estado" : ""}</p>
        {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error} <button onClick={() => void actualizar()} disabled={cargando} className="font-bold underline">Reintentar</button></div>}
        {cargando && <p role="status" className="text-sm text-stone-500">Cargando pedidos…</p>}
        {!cargando && !error && pedidos.length === 0 && <p className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">{estado ? "No tienes pedidos en este estado." : "Todavía no tienes pedidos en tu cuenta. Puedes vincular uno con el número de tu comprobante."}</p>}
        {pedidos.map(pedido => <DetallePedido key={pedido.id} pedido={pedido} />)}
        <div className="flex items-center justify-between gap-3 text-sm">
          <button className={boton} disabled={cargando || pagina === 0} onClick={() => setPagina(p => p - 1)}>Anterior</button>
          <span>Página {pagina + 1} de {Math.max(1, Math.ceil(total / TAMANO_PAGINA))}</span>
          <button className={boton} disabled={cargando || (pagina + 1) * TAMANO_PAGINA >= total} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
        </div>
      </section>
    </div>
  </main>;
}

function DetallePedido({ pedido }: { pedido: PedidoCliente }) {
  const vista = presentarPedido(pedido);
  return <details className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <summary className="cursor-pointer space-y-2">
      <span className="inline-flex items-center gap-2 font-bold"><Package size={18} className="text-brand-600" />{pedido.numeroComanda}</span>
      <span className="ml-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{vista.estado}</span>
      <span className="block text-sm text-stone-600">{fechaSeguimiento(pedido.fechaRecepcion)} · {clp(pedido.valorTotal)}</span>
    </summary>
    <div className="mt-5 space-y-5 border-t border-stone-100 pt-5">
      <p className="text-sm">Servicios: {vista.servicios}</p>
      {pedido.fechaEntregaEstimada && <p className="text-sm">Entrega estimada: {fechaSeguimiento(pedido.fechaEntregaEstimada)}</p>}
      {pedido.fechaEntregaReal && <p className="text-sm">Entregado el: {fechaSeguimiento(pedido.fechaEntregaReal)}</p>}
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <caption className="sr-only">Detalle de prendas y servicios de {pedido.numeroComanda}</caption>
        <thead><tr className="border-b border-stone-200 text-stone-500"><th className="p-2">Prenda</th><th className="p-2">Servicio</th><th className="p-2">Cantidad / peso</th><th className="p-2 text-right">Subtotal</th></tr></thead>
        <tbody>{pedido.comandaDetalles_on_comanda.map(d => <tr key={d.id} className="border-b border-stone-100"><td className="p-2">{d.tipoPrenda.nombre}</td><td className="p-2">{d.tipoServicio.nombre}</td><td className="p-2">{d.cantidad}{d.pesoKg != null ? ` / ${d.pesoKg} kg` : ""}</td><td className="p-2 text-right">{clp(d.subtotal)}</td></tr>)}</tbody>
        <tfoot><tr><th colSpan={3} className="p-2">Total</th><td className="p-2 text-right font-bold">{clp(pedido.valorTotal)}</td></tr></tfoot>
      </table></div>
      {vista.etapas.length > 0 ? <div><h3 className="mb-3 font-bold">Avance · {vista.progreso}%</h3><ol className="space-y-2">{vista.etapas.map(e => <li key={e.orden} className="flex justify-between gap-3 text-sm"><span>{e.nombre}</span><span className={e.estado === "COMPLETADA" ? "text-green-700" : "text-stone-500"}>{e.estado === "COMPLETADA" ? "Completada" : e.estado === "EN_PROCESO" ? (pedido.estado === "ANULADA" ? "Interrumpida" : "En curso") : "Pendiente"}</span></li>)}</ol></div> : <p className="text-sm text-stone-500">Sin etapas registradas.</p>}
      <p className="text-xs text-stone-500">Último cambio: {fechaSeguimiento(pedido.actualizadoEn)}</p>
    </div>
  </details>;
}
