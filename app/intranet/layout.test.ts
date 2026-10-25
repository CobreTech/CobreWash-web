// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime";
vi.mock("@/components/intranet/Sidebar", () => ({ default: () => null }));
vi.mock("@/components/intranet/Topbar", () => ({ default: () => null }));
vi.mock("@/components/intranet/AuthGuard", () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("@/components/providers/ThemeProvider", () => ({ ThemeProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("@/components/intranet/AlertasRetraso", () => ({ default: () => null, AlertasRetrasoProvider: ({ children }: { children: React.ReactNode }) => children }));
import IntranetLayout from "./layout";
afterEach(cleanup);
it("entrar a la intranet mediante navegación cliente no intenta renderizar un script", () => {
  const errores = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const { container } = render(createElement(HeadManagerContext.Provider, { value: { appDir: true } }, createElement(IntranetLayout, null, "Contenido interno")));
  expect(container.querySelector("script")).toBeNull();
  expect(container.textContent).toContain("Contenido interno");
  expect(errores.mock.calls.flat().join(" ")).not.toContain("Encountered a script tag");
});
