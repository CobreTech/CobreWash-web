import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve("scratch/production-test");
const generarSdk = process.argv.includes("--sdk");
for (const dir of ["schema", "example", "produccion"]) {
  await mkdir(root + "/dataconnect/" + dir, {recursive:true});
  for (const file of await readdir("dataconnect/" + dir)) {
    if (file.endsWith(".gql")) await writeFile(root + "/dataconnect/" + dir + "/" + file, await readFile("dataconnect/" + dir + "/" + file));
  }
  if (dir !== "schema") {
    const config = dir === "example" && generarSdk
      ? "connectorId: example\ngenerate:\n  javascriptSdk:\n    - outputDir: " + JSON.stringify(resolve("src/dataconnect-generated")) + "\n      package: \"@dataconnect/generated\"\n      packageJsonDir: " + JSON.stringify(resolve(".")) + "\n      react: true\n      angular: false\n"
      : "connectorId: " + dir + "\n";
    await writeFile(root + "/dataconnect/" + dir + "/connector.yaml", config);
  }
}
await writeFile(root + "/dataconnect/dataconnect.yaml", await readFile("dataconnect/dataconnect.yaml"));
await writeFile(root + "/firebase.json", JSON.stringify({dataconnect:{source:"dataconnect"},emulators:{dataconnect:{port:9499},hub:{port:4501},logging:{port:4601},ui:{enabled:false},singleProjectMode:true}},null,2));
console.log("Emulador aislado preparado en " + root);
