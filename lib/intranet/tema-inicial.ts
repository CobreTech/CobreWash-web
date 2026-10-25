// beforeInteractive se ejecuta desde el layout raíz; el tema solo corresponde a la intranet.
export const INICIALIZAR_TEMA_INTRANET = `
(function () {
  if (window.location.pathname !== "/intranet" && !window.location.pathname.startsWith("/intranet/")) return;
  try {
    var theme = localStorage.getItem("intranet-theme") || "system";
    var isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;
