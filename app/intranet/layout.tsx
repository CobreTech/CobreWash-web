import IntranetSidebar from "@/components/intranet/Sidebar";
import IntranetTopbar from "@/components/intranet/Topbar";
import AuthGuard from "@/components/intranet/AuthGuard";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata = {
  title: "Intranet | Lavandería El Cobre",
  description: "Panel de administración interno",
};

const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("intranet-theme") || "system";
    var isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function IntranetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Rendered by this Server Component (outside the client ThemeProvider tree)
          so the browser actually executes it and we avoid the theme flash. */}
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      <ThemeProvider>
        <AuthGuard>
          <div className="relative flex h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-amber-50/60 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 right-0 -z-10 w-[28rem] h-[28rem] rounded-full bg-brand-200/50 dark:bg-brand-500/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/4 -z-10 w-[32rem] h-[32rem] rounded-full bg-copper-200/40 dark:bg-copper-500/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 left-0 -z-10 w-80 h-80 rounded-full bg-sky-200/30 dark:bg-sky-500/5 blur-3xl" />

            <IntranetSidebar />
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden lg:pt-0 pt-14">
              <IntranetTopbar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </AuthGuard>
      </ThemeProvider>
    </>
  );
}
