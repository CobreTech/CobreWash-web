"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogIn, Package, CheckCircle2, Lock, Mail, User, IdCard, Phone, MapPin, AlertCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { QueryFetchPolicy } from "firebase/data-connect";
import { auth, dataConnect } from "@/lib/firebase/client";
import { getRoles, registrarseComoCliente, getMiPerfil, type GetRolesData } from "@/src/dataconnect-generated";
import { cleanRut, formatRut, isValidRut, validatePassword } from "@/lib/validators";
import { mapAuthError } from "@/lib/firebase/errors";
import { LANDING_POR_ROL, type Rol } from "@/lib/roles";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Seguimiento (tracking) modal — solo pide el código y redirige al portal
  // público de seguimiento, donde se muestra el estado real de la comanda.
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingError, setTrackingError] = useState("");

  const openTracking = () => {
    setIsOpen(false);
    setTrackingCode("");
    setTrackingError("");
    setIsTrackingOpen(true);
  };

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setTrackingError("Por favor ingresa un código de seguimiento.");
      return;
    }
    setIsTrackingOpen(false);
    router.push(`/seguimiento?codigo=${encodeURIComponent(trackingCode.trim())}`);
  };

  // Auth Form States
  const [authView, setAuthView] = useState<"login" | "register" | "forgot">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authConfirmPass, setAuthConfirmPass] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState("");

  // Register-only fields (Usuario / Cliente). El registro público siempre
  // crea cuentas de tipo "cliente" — el resto de roles se crean desde la intranet.
  const [authApellido, setAuthApellido] = useState("");
  const [authRut, setAuthRut] = useState("");
  const [authTelefono, setAuthTelefono] = useState("");
  const [authDireccion, setAuthDireccion] = useState("");
  const [roles, setRoles] = useState<GetRolesData["rols"]>([]);
  const clienteRolId = roles.find((r) => r.nombre === "cliente")?.id;

  const rutDigits = cleanRut(authRut);
  const rutTouched = rutDigits.length > 0;
  const rutValid = rutTouched && isValidRut(authRut);
  const passwordCheck = validatePassword(authPassword);

  const resetRegisterFields = () => {
    setAuthName("");
    setAuthApellido("");
    setAuthRut("");
    setAuthTelefono("");
    setAuthDireccion("");
    setAuthConfirmPass("");
    setAuthPassword("");
  };

  // Load role catalog once, solo para obtener el id del rol "cliente"
  useEffect(() => {
    getRoles(dataConnect)
      .then(({ data }) => setRoles(data.rols))
      .catch(() => setRoles([]));
  }, []);

  // Abrir el modal de acceso automáticamente cuando se llega con ?login=1
  // (usado por el portal público de seguimiento: "Crear cuenta / Iniciar sesión").
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      setIsLoginOpen(true);
      setAuthView(params.get("registro") === "1" ? "register" : "login");
    }
  }, []);

  // Lock body scroll when the modal is open
  useEffect(() => {
    if (isLoginOpen || isTrackingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoginOpen, isTrackingOpen]);

  // Handle scroll header background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth Submission (Firebase Auth + Data Connect)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (authView === "login") {
      if (!authEmail.trim() || !authPassword.trim()) {
        setAuthError("Por favor ingresa tu correo y contraseña.");
        return;
      }
      setAuthLoading(true);
      try {
        await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        // SERVER_ONLY: el perfil depende de auth.uid (no hay variables), así que
        // el caché por defecto del SDK devolvería el perfil de la sesión anterior.
        const { data } = await getMiPerfil(dataConnect, { fetchPolicy: QueryFetchPolicy.SERVER_ONLY });
        const rolNombre = (data.usuario?.rol?.nombre as Rol) ?? "cliente";

        setAuthLoading(false);
        setAuthSuccess(true);
        setTimeout(() => {
          setIsLoginOpen(false);
          setAuthSuccess(false);
          setAuthEmail("");
          setAuthPassword("");
          // Cada rol es redirigido automáticamente a su propia vista.
          router.push(LANDING_POR_ROL[rolNombre] ?? "/cuenta");
        }, 1200);
      } catch (err) {
        setAuthLoading(false);
        setAuthError(mapAuthError(err));
      }
    } else if (authView === "register") {
      if (
        !authName.trim() ||
        !authApellido.trim() ||
        !authRut.trim() ||
        !authEmail.trim() ||
        !authPassword.trim() ||
        !authConfirmPass.trim()
      ) {
        setAuthError("Todos los campos son obligatorios.");
        return;
      }
      if (!clienteRolId) {
        setAuthError("No se pudo cargar el catálogo de roles. Intenta nuevamente.");
        return;
      }
      if (!isValidRut(authRut)) {
        setAuthError("El RUT ingresado no es válido.");
        return;
      }
      if (!passwordCheck.valid) {
        setAuthError(passwordCheck.message);
        return;
      }
      if (authPassword !== authConfirmPass) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }

      setAuthLoading(true);
      let createdUserId: string | null = null;
      try {
        const credential = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        createdUserId = credential.user.uid;

        await registrarseComoCliente(dataConnect, {
          rolId: clienteRolId,
          rut: formatRut(authRut),
          nombre: authName.trim(),
          apellido: authApellido.trim(),
          telefono: authTelefono.trim() || null,
          email: authEmail.trim(),
          direccion: authDireccion.trim() || null,
        });

        setAuthLoading(false);
        setAuthSuccess(true);
        setTimeout(() => {
          setAuthView("login");
          setAuthSuccess(false);
          resetRegisterFields();
        }, 1550);
      } catch (err) {
        setAuthLoading(false);
        if (createdUserId && auth.currentUser) {
          await auth.currentUser.delete().catch(() => {});
        }
        setAuthError(mapAuthError(err));
      }
    } else if (authView === "forgot") {
      if (!authEmail.trim()) {
        setAuthError("Por favor ingresa tu correo electrónico.");
        return;
      }
      setAuthLoading(true);
      try {
        await sendPasswordResetEmail(auth, authEmail.trim());
        setAuthLoading(false);
        setAuthSuccess(true);
        setTimeout(() => {
          setAuthView("login");
          setAuthSuccess(false);
        }, 3000);
      } catch (err) {
        setAuthLoading(false);
        setAuthError(mapAuthError(err));
      }
    }
  };

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Servicios", href: "#servicios" },
    { name: "Maquinaria", href: "#maquinaria" },
    { name: "Recepción", href: "#recepcion" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled 
            ? "glass-nav border-brand-500/12 bg-white/60 backdrop-blur-2xl backdrop-saturate-150 py-3" 
            : "border-transparent bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Text */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="#inicio"
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo.webp"
                  alt="Logo Lavandería El Cobre"
                  width={48}
                  height={48}
                  className="h-11 w-auto object-contain"
                  priority
                />
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 font-display flex flex-col sm:flex-row sm:gap-1.5 leading-none">
                  <span>Lavandería</span>
                  <span className="text-brand-500">El Cobre</span>
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-baseline gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-stone-700 hover:text-brand-650 font-medium transition-colors duration-200 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full" />
                  </a>
                ))}
              </div>

              {/* CTAs Group */}
              <div className="flex items-center gap-3">
                {/* Seguimiento CTA → abre el modal de seguimiento */}
                <button
                  onClick={openTracking}
                  className="flex items-center justify-center gap-2 bg-white border border-stone-250 text-stone-700 hover:border-stone-400 hover:text-stone-900 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <Package className="w-4 h-4 text-stone-500" />
                  <span>Seguimiento</span>
                </button>

                {/* Iniciar Sesión CTA */}
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setAuthView("login");
                    setAuthError("");
                    setAuthSuccess(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-stone-750 hover:text-brand-600 focus:outline-none transition-colors"
              >
                <span className="sr-only">Abrir menú</span>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-nav bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-brand-500/12 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-semibold text-stone-850 hover:bg-brand-50 hover:text-brand-600 transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 px-3">
                  <button
                    onClick={openTracking}
                    className="flex items-center justify-center gap-2 bg-white border border-stone-250 text-stone-700 py-3 rounded-xl font-bold text-sm shadow-sm"
                  >
                    <Package className="w-4 h-4 text-stone-500" />
                    <span>Seguimiento</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginOpen(true);
                      setAuthView("login");
                      setAuthError("");
                      setAuthSuccess(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MODALS SECTION */}
      <AnimatePresence>
        {/* Tracking Modal — pide el código y lleva al portal de seguimiento */}
        {isTrackingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTrackingOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="glass-modal bg-white/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 sm:p-8 w-full max-w-md border border-white/60 relative z-10"
            >
              <button
                onClick={() => setIsTrackingOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-50 text-brand-650 rounded-2xl">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900">Seguimiento de Pedido</h3>
                    <p className="text-xs text-stone-500">Ingresa tu código para conocer el estado actual</p>
                  </div>
                </div>

                <form onSubmit={handleTrackingSearch} className="space-y-4">
                  {trackingError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                      {trackingError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Ej: COBRE-1234 o 1234"
                        value={trackingCode}
                        onChange={(e) => {
                          setTrackingCode(e.target.value);
                          if (trackingError) setTrackingError("");
                        }}
                        className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 font-bold placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm uppercase"
                      />
                      <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-brand text-white font-bold px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0"
                    >
                      Buscar
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400 text-center">
                    Serás dirigido al portal de seguimiento con el estado de tus prendas.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Login / Register / Forgot Password Modal */}
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="glass-modal bg-white/70 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 sm:p-8 w-full max-w-md border border-white/60 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Header Logo */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <Image
                    src="/logo.webp"
                    alt="Logo Lavandería El Cobre"
                    width={50}
                    height={50}
                    className="h-12 w-auto object-contain"
                  />
                  <h3 className="text-xl font-extrabold text-stone-900 font-display">
                    {authView === "login" && "Iniciar Sesión"}
                    {authView === "register" && "Crear una Cuenta"}
                    {authView === "forgot" && "Recuperar Contraseña"}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs leading-normal">
                    {authView === "login" && "Ingresa tus datos para acceder a tu intranet de lavandería."}
                    {authView === "register" && "Regístrate para solicitar retiros express y revisar tu historial."}
                    {authView === "forgot" && "Ingresa tu correo y te enviaremos un enlace de recuperación."}
                  </p>
                </div>

                {/* Form Logic */}
                <AnimatePresence mode="wait">
                  {authSuccess ? (
                    <motion.div
                      key="auth-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center space-y-4 flex flex-col items-center justify-center"
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                      <div>
                        <h4 className="text-lg font-bold text-stone-900">
                          {authView === "login" && "¡Acceso Exitoso!"}
                          {authView === "register" && "¡Registro Completado!"}
                          {authView === "forgot" && "¡Enlace Enviado!"}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 max-w-[240px] mx-auto">
                          {authView === "login" && "Redireccionando a tu intranet..."}
                          {authView === "register" && "Ya puedes iniciar sesión con tu cuenta."}
                          {authView === "forgot" && "Revisa tu bandeja de entrada o carpeta de spam."}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={authView}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleAuthSubmit}
                      className="space-y-4"
                      noValidate // Disable browser validation balloons
                    >
                      {authError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-755 text-xs font-semibold rounded-xl">
                          {authError}
                        </div>
                      )}

                      {/* Register-only fields */}
                      {authView === "register" && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Nombre</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Juan"
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                                />
                                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Apellido</label>
                              <input
                                type="text"
                                placeholder="Pérez"
                                value={authApellido}
                                onChange={(e) => setAuthApellido(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">RUT</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="12.345.678-9"
                                value={authRut}
                                onChange={(e) => setAuthRut(formatRut(e.target.value))}
                                className={`w-full pl-10 pr-9 py-3 rounded-xl border bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                                  rutTouched ? (rutValid ? "border-green-300 focus:border-green-500" : "border-red-300 focus:border-red-500") : "border-stone-200 focus:border-brand-500"
                                }`}
                              />
                              <IdCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                              {rutTouched && (
                                rutValid ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                                )
                              )}
                            </div>
                            {rutTouched && (
                              <p className={`text-[11px] font-semibold ${rutValid ? "text-green-600" : "text-red-500"}`}>
                                {rutValid ? "RUT válido" : "RUT inválido"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Teléfono</label>
                            <div className="relative">
                              <input
                                type="tel"
                                placeholder="+56 9 1234 5678"
                                value={authTelefono}
                                onChange={(e) => setAuthTelefono(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                              />
                              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Dirección</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Av. Siempre Viva 123, Calama"
                                value={authDireccion}
                                onChange={(e) => setAuthDireccion(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                              />
                              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Common Email Input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Correo Electrónico</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                          />
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Password input for Login / Register */}
                      {authView !== "forgot" && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Contraseña</label>
                            {authView === "login" && (
                              <button
                                type="button"
                                onClick={() => setAuthView("forgot")}
                                className="text-[10px] font-bold text-brand-650 hover:text-brand-700 transition-colors cursor-pointer"
                              >
                                ¿Olvidaste tu contraseña?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:bg-white transition-all text-sm font-medium ${
                                authView === "register" && authPassword
                                  ? (passwordCheck.valid ? "border-green-300 focus:border-green-500" : "border-red-300 focus:border-red-500")
                                  : "border-stone-200 focus:border-brand-500"
                              }`}
                            />
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                          {authView === "register" && authPassword && (
                            <p className={`text-[11px] font-semibold ${passwordCheck.valid ? "text-green-600" : "text-red-500"}`}>
                              {passwordCheck.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Confirm Password input for Register */}
                      {authView === "register" && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Confirmar Contraseña</label>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={authConfirmPass}
                              onChange={(e) => setAuthConfirmPass(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-850 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                            />
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                          {authConfirmPass && authConfirmPass !== authPassword && (
                            <p className="text-[11px] font-semibold text-red-500">Las contraseñas no coinciden</p>
                          )}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-brand text-white py-3 rounded-xl font-bold text-sm shadow-premium hover:shadow-lg disabled:opacity-50 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                      >
                        {authLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            {authView === "login" && "Ingresar"}
                            {authView === "register" && "Registrarse"}
                            {authView === "forgot" && "Enviar Instrucciones"}
                          </>
                        )}
                      </button>

                      {/* Footer Actions (Toggles) */}
                      <div className="pt-4 border-t border-stone-100 flex flex-col items-center gap-2 text-xs">
                        {authView === "login" && (
                          <p className="text-stone-500">
                            ¿No tienes cuenta?{" "}
                            <button
                              type="button"
                              onClick={() => {
                                setAuthView("register");
                                setAuthError("");
                              }}
                              className="text-brand-650 hover:underline font-bold cursor-pointer"
                            >
                              Regístrate
                            </button>
                          </p>
                        )}
                        {authView === "register" && (
                          <p className="text-stone-500">
                            ¿Ya tienes cuenta?{" "}
                            <button
                              type="button"
                              onClick={() => {
                                setAuthView("login");
                                setAuthError("");
                              }}
                              className="text-brand-650 hover:underline font-bold cursor-pointer"
                            >
                              Inicia Sesión
                            </button>
                          </p>
                        )}
                        {authView === "forgot" && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthView("login");
                              setAuthError("");
                            }}
                            className="text-brand-650 hover:underline font-bold cursor-pointer"
                          >
                            Volver al Login
                          </button>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
