import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ESLint } from "eslint";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("compatibilidad de las dependencias de ESLint", () => {
  let fixture: string;

  beforeAll(() => {
    fixture = mkdtempSync(join(tmpdir(), "cobrewash-eslint-"));
    const pages = join(fixture, "apps", "web", "pages");
    mkdirSync(pages, { recursive: true });
    writeFileSync(join(pages, "about.tsx"), "export default function About() {}");
  });

  afterAll(() => {
    rmSync(fixture, { recursive: true, force: true });
  });

  it.each(["glob", "lista"])(
    "mantiene la regla de enlaces internos al buscar raíces con %s",
    async (kind) => {
      const pattern = join(fixture, "apps", "{web,admin}");
      const eslint = new ESLint({
        overrideConfig: {
          settings: {
            next: { rootDir: kind === "glob" ? pattern : [pattern] },
          },
        },
      });

      // Exercise Next's globSync dependency and React rules with the real config.
      const [internal] = await eslint.lintText(
        'export default function Card() { return <a href="/about">About</a>; }',
        { filePath: "components/DependencyCheck.tsx" },
      );
      expect(internal.fatalErrorCount).toBe(0);
      expect(internal.messages.map(({ ruleId }) => ruleId)).toEqual([
        "@next/next/no-html-link-for-pages",
      ]);

      const [external] = await eslint.lintText(
        'export default function Card() { return <a href="https://example.com">About</a>; }',
        { filePath: "components/DependencyCheck.tsx" },
      );
      expect(external.messages).toEqual([]);
    },
    15_000,
  );
});
