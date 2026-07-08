"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Mail,
  Phone,
  X,
  IdCard,
  Lock,
  UserCog,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { dataConnect } from "@/lib/firebase/client";
import { createSecondaryFirebaseContext } from "@/lib/firebase/secondary";
import {
  getUsuarios,
  getRoles,
  registrarse,
  registrarseComoCliente,
  actualizarUsuario,
  type GetUsuariosData,
  type GetRolesData,
} from "@/src/dataconnect-generated";
import { cleanRut, formatRut, isValidRut, validatePassword } from "@/lib/validators";
import { mapAuthError } from "@/lib/firebase/errors";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { useRoleGuard } from "@/components/intranet/useRoleGuard";
import GlassSelect from "@/components/ui/GlassSelect";

type Usuario = GetUsuariosData["usuarios"][number];
type RolOpcion = GetRolesData["rols"][number];
type TabFilter = "Todos" | "Activos" | "Inactivos";

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: "bg-brand-500/15", text: "text-brand-600 dark:text-brand-400" },
  recepcionista: { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-400" },
  operario: { bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-400" },
  cliente: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400" },
};

const defaultRoleColor = { bg: "bg-stone-500/15", text: "text-stone-600 dark:text-stone-400" };

const tabs: TabFilter[] = ["Todos", "Activos", "Inactivos"];

const emptyForm = {
  rolId: "",
  nombre: "",
  apellido: "",
  rut: "",
  telefono: "",
  email: "",
  direccion: "",
  password: "",
};

type Modal = { mode: "crear" } | { mode: "editar"; usuario: Usuario } | null;

export default function UsuariosPage() {
  const permitido = useRoleGuard(["admin"]);
  const yo = useUsuarioActualContext();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<RolOpcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("Todos");

  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const rutDigits = cleanRut(form.rut);
  const rutTouched = rutDigits.length > 0;
  const rutValid = rutTouched && isValidRut(form.rut);
  const passwordCheck = validatePassword(form.password);
  const selectedRole = roles.find((r) => r.id === form.rolId);

  const cargarUsuarios = async () => {
    const { data } = await getUsuarios(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
    setUsuarios(data.usuarios);
  };

  useEffect(() => {
    Promise.all([cargarUsuarios(), getRoles(dataConnect).then(({ data }) => setRoles(data.rols))])
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = usuarios.filter((u) => {
    const matchTab = tab === "Todos" || (tab === "Activos" && u.activo) || (tab === "Inactivos" && !u.activo);
    const term = search.toLowerCase();
    const matchSearch =
      u.nombre.toLowerCase().includes(term) ||
      (u.apellido ?? "").toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term);
    return matchTab && matchSearch;
  });

  const activeCount = usuarios.filter((u) => u.activo).length;
  const inactiveCount = usuarios.filter((u) => !u.activo).length;

  const openCrear = () => {
    setForm(emptyForm);
    setFormError("");
    setModal({ mode: "crear" });
  };

  const openEditar = (usuario: Usuario) => {
    setForm({
      rolId: usuario.rol.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido ?? "",
      rut: usuario.rut ?? "",
      telefono: usuario.telefono ?? "",
      email: usuario.email,
      direccion: "",
      password: "",
    });
    setFormError("");
    setModal({ mode: "editar", usuario });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
  };

  const handleCrear = async () => {
    if (!form.rolId || !form.nombre.trim() || !form.apellido.trim() || !form.rut.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }
    if (!isValidRut(form.rut)) {
      setFormError("El RUT ingresado no es válido.");
      return;
    }
    if (!passwordCheck.valid) {
      setFormError(passwordCheck.message);
      return;
    }

    setSaving(true);
    const { auth: secAuth, dataConnect: secDC, cleanup } = createSecondaryFirebaseContext();
    try {
      await createUserWithEmailAndPassword(secAuth, form.email.trim(), form.password);

      const vars = {
        rolId: form.rolId,
        rut: formatRut(form.rut),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        telefono: form.telefono.trim() || null,
        email: form.email.trim(),
      };

      if (selectedRole?.nombre === "cliente") {
        await registrarseComoCliente(secDC, { ...vars, direccion: form.direccion.trim() || null });
      } else {
        await registrarse(secDC, vars);
      }

      await cargarUsuarios();
      setModal(null);
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      await cleanup();
      setSaving(false);
    }
  };

  const handleEditar = async () => {
    if (modal?.mode !== "editar") return;
    if (!form.rolId || !form.nombre.trim()) {
      setFormError("El rol y el nombre son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      await actualizarUsuario(dataConnect, {
        id: modal.usuario.id,
        rolId: form.rolId,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim() || null,
        telefono: form.telefono.trim() || null,
        activo: modal.usuario.activo,
      });
      await cargarUsuarios();
      setModal(null);
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleActivo = async (usuario: Usuario) => {
    await actualizarUsuario(dataConnect, {
      id: usuario.id,
      rolId: usuario.rol.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido ?? null,
      telefono: usuario.telefono ?? null,
      activo: !usuario.activo,
    });
    await cargarUsuarios();
  };

  if (!permitido) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-900 dark:text-stone-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-extrabold text-stone-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {usuarios.length} cuentas registradas · {activeCount} activas
          </p>
        </div>
        <button
          onClick={openCrear}
          className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg hover:scale-[1.02] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {roles.map((rol, i) => {
              const rc = roleColors[rol.nombre] ?? defaultRoleColor;
              const count = usuarios.filter((u) => u.rol.id === rol.id).length;
              return (
                <motion.div
                  key={rol.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="glass-panel rounded-2xl p-4"
                >
                  <p className={`text-2xl font-display font-extrabold ${rc.text}`}>{count}</p>
                  <p className="text-stone-500 dark:text-stone-500 text-xs mt-1 capitalize">{rol.nombre}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex gap-2">
              {tabs.map((t) => {
                const count = t === "Todos" ? usuarios.length : t === "Activos" ? activeCount : inactiveCount;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      tab === t
                        ? "bg-brand-500 text-white"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200"
                    }`}
                  >
                    {t}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tab === t ? "bg-white/20" : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl text-sm text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          {/* Users Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((usuario, i) => {
                const rc = roleColors[usuario.rol.nombre] ?? defaultRoleColor;
                const esUnoMismo = usuario.id === yo?.id;
                return (
                  <motion.div
                    key={usuario.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="glass-panel rounded-2xl p-5 hover:border-brand-500/30 dark:hover:border-brand-500/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-stone-900 dark:text-white font-bold text-sm">
                            {usuario.nombre} {usuario.apellido}
                          </p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 capitalize ${rc.bg} ${rc.text}`}>
                            {usuario.rol.nombre}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                          usuario.activo ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${usuario.activo ? "bg-green-500 dark:bg-green-400 animate-pulse" : "bg-stone-400 dark:bg-stone-500"}`} />
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{usuario.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-500">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{usuario.telefono ?? "—"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-white/5">
                      <p className="text-[10px] text-stone-400 dark:text-stone-600">
                        RUT: <span className="text-stone-500 dark:text-stone-500">{usuario.rut ?? "—"}</span>
                      </p>
                      {!esUnoMismo && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditar(usuario)}
                            className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleActivo(usuario)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              usuario.activo
                                ? "text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10"
                                : "text-stone-400 dark:text-stone-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10"
                            }`}
                            title={usuario.activo ? "Desactivar" : "Activar"}
                          >
                            {usuario.activo ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-stone-400 dark:text-stone-600 text-sm">
                No se encontraron usuarios.
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Crear / Editar Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-6 sm:p-8 w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-extrabold text-stone-900 dark:text-white font-display mb-6">
                {modal.mode === "crear" ? "Nuevo Usuario" : "Editar Usuario"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  modal.mode === "crear" ? handleCrear() : handleEditar();
                }}
                className="space-y-4"
                noValidate
              >
                {formError && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl">
                    {formError}
                  </div>
                )}

                <Field label="Tipo de Usuario">
                  <GlassSelect
                    value={form.rolId}
                    onChange={(v) => setForm({ ...form, rolId: v })}
                    icon={UserCog}
                    ariaLabel="Tipo de usuario"
                    placeholder="Selecciona un rol"
                    options={roles.map((r) => ({
                      value: r.id,
                      label: r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1),
                    }))}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre">
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 transition-all text-sm font-medium"
                    />
                  </Field>
                  <Field label="Apellido">
                    <input
                      type="text"
                      value={form.apellido}
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 transition-all text-sm font-medium"
                    />
                  </Field>
                </div>

                <Field label="RUT">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="12.345.678-9"
                      value={form.rut}
                      disabled={modal.mode === "editar"}
                      onChange={(e) => setForm({ ...form, rut: formatRut(e.target.value) })}
                      className={`w-full pl-10 pr-9 py-3 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none transition-all text-sm font-medium disabled:opacity-50 ${
                        modal.mode === "crear" && rutTouched
                          ? rutValid
                            ? "border-green-300 dark:border-green-500/40 focus:border-green-500"
                            : "border-red-300 dark:border-red-500/40 focus:border-red-500"
                          : "border-stone-200 dark:border-white/10 focus:border-brand-500"
                      }`}
                    />
                    <IdCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    {modal.mode === "crear" && rutTouched && (
                      rutValid ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      )
                    )}
                  </div>
                  {modal.mode === "crear" && rutTouched && (
                    <p className={`text-[11px] font-semibold ${rutValid ? "text-green-600" : "text-red-500"}`}>
                      {rutValid ? "RUT válido" : "RUT inválido"}
                    </p>
                  )}
                </Field>

                <Field label="Teléfono">
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 transition-all text-sm font-medium"
                  />
                </Field>

                {selectedRole?.nombre === "cliente" && modal.mode === "crear" && (
                  <Field label="Dirección">
                    <div className="relative">
                      <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 transition-all text-sm font-medium"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </Field>
                )}

                <Field label="Correo Electrónico">
                  <input
                    type="email"
                    value={form.email}
                    disabled={modal.mode === "editar"}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-brand-500 transition-all text-sm font-medium disabled:opacity-50"
                  />
                </Field>

                {modal.mode === "crear" && (
                  <Field label="Contraseña">
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none transition-all text-sm font-medium ${
                          form.password
                            ? passwordCheck.valid
                              ? "border-green-300 dark:border-green-500/40 focus:border-green-500"
                              : "border-red-300 dark:border-red-500/40 focus:border-red-500"
                            : "border-stone-200 dark:border-white/10 focus:border-brand-500"
                        }`}
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {form.password && (
                      <p className={`text-[11px] font-semibold ${passwordCheck.valid ? "text-green-600" : "text-red-500"}`}>
                        {passwordCheck.message}
                      </p>
                    )}
                  </Field>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : modal.mode === "crear" ? (
                    "Crear Usuario"
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{label}</label>
      {children}
    </div>
  );
}
