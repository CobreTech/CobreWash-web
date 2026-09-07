import { readdir, readFile, writeFile } from "node:fs/promises";
async function normalize(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + entry.name;
    if (entry.isDirectory()) await normalize(path);
    else if (/\.(js|ts|md)$/.test(entry.name)) {
      const text = await readFile(path, "utf8");
      await writeFile(path, text.replace(/[ \t]+$/gm, "").trimEnd() + "\n");
    }
  }
}
await normalize("src/dataconnect-generated");
