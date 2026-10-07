// Genera dist/panka-demo.html: toda la app en un solo archivo (JS, CSS e imágenes
// incluidos). Sirve para compartir la demo como un único archivo o publicarla
// en servicios que no aceptan varios archivos.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../dist");
const assets = readdirSync(path.join(dist, "assets"));
const js = assets.find((f) => f.endsWith(".js"));
const css = assets.find((f) => f.endsWith(".css"));
if (!js || !css) throw new Error("Primero corré `npm run build`.");

const dataUri = (file) => `data:image/png;base64,${readFileSync(path.join(dist, file)).toString("base64")}`;
let code = readFileSync(path.join(dist, "assets", js), "utf8");
for (const img of ["panka-logo.png", "panka-symbol.png"]) code = code.replaceAll(`./${img}`, dataUri(img));
// Evita que "</script>" dentro del código cierre la etiqueta antes de tiempo.
code = code.replaceAll("</script", "<\\/script");
const style = readFileSync(path.join(dist, "assets", css), "utf8");

const html = `<title>Panka</title>
<link rel="icon" type="image/png" href="${dataUri("panka-symbol.png")}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Andika:wght@400;700&display=swap">
<style>:root{color-scheme:light}html,body{background:#fffaf3;color:#1b2a5c}${style}</style>
<div id="root"></div>
<script type="module">${code}</script>
`;
writeFileSync(path.join(dist, "panka-demo.html"), html);
console.log(`dist/panka-demo.html (${(html.length / 1024).toFixed(0)} KB)`);
