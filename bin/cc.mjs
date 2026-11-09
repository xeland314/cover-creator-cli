#!/usr/bin/env node
// cover-creator-cli · uso: cc <comando> [opciones]
import fs from "node:fs";
import path from "node:path";
import { renderProject, SIZES } from "../lib/render.mjs";

const THEMES = ["light", "dark", "midnight", "soft", "catppuccin", "ambercat", "rose", "blue", "obsidian"];
const ACCENTS = ["blue", "purple", "emerald", "orange", "rose", "yellow", "sky", "indigo", "cyan", "teal", "pink", "slate", "violet", "lime", "red", "amber", "fuchsia"];

const HELP = `cover-creator-cli — carruseles desde la terminal, con los componentes de Cover Creator

  cc render <proyecto.json> -o <carpeta> [opciones]
      --size threads|facebook|tiktok|instagram|square|WxH   (por defecto threads 1080x1350)
      --format png|jpg                                      (por defecto png)
      --theme <tema>    ${THEMES.join(" | ")}
      --accent <color>  ${ACCENTS.join(" | ")}
      --pixel           estilo pixel-art (funciona con cualquier tema)
      --slide <n>       solo la lámina n (1-indexado)
  cc themes             lista temas, acentos y tamaños
  cc validate <proyecto.json>   comprueba el formato del proyecto
  cc slides <proyecto.json> -o <carpeta> [--palette p] [--pixel] [--size WxH] [--format png|pdf|svg|jpg]
      renderiza con C-Slides (slides.c) en vez de Chrome; ver docs/slides-c.md
  cc to-md <proyecto.json> [-o archivo.md]   convierte el proyecto a Markdown de C-Slides
  cc install-fonts      copia las fuentes pixel a ~/.local/share/fonts (necesario para --pixel en C-Slides)
`;

function parse(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-o" || a === "--out") o.out = argv[++i];
    else if (a === "--pixel") o.pixel = true;
    else if (a.startsWith("--")) o[a.slice(2)] = argv[++i];
    else o._.push(a);
  }
  return o;
}
const loadProject = (f) => {
  if (!f) throw new Error("Falta el archivo de proyecto (.json).");
  const p = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!p?.data || !Array.isArray(p.data.slides) || !p.data.slides.length) throw new Error("Proyecto inválido: falta data.slides.");
  return p;
};

const [cmd, ...rest] = process.argv.slice(2);
const o = parse(rest);
try {
  if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") console.log(HELP);
  else if (cmd === "themes") {
    console.log("Temas:   ", THEMES.join(", "));
    console.log("Acentos: ", ACCENTS.join(", "));
    console.log("Tamaños: ", Object.entries(SIZES).map(([k, v]) => `${k}=${v[0]}x${v[1]}`).join(", "), "o WxH");
    console.log("Estilo:   --pixel (combinable con cualquier tema)");
  } else if (cmd === "validate") {
    const p = loadProject(o._[0]);
    const bad = [];
    if (p.data.mode && !THEMES.includes(p.data.mode)) bad.push(`tema desconocido: ${p.data.mode}`);
    if (p.data.accent && !ACCENTS.includes(p.data.accent)) bad.push(`acento desconocido: ${p.data.accent}`);
    p.data.slides.forEach((s, i) => { if (!["cover", "markdown", "image", "end"].includes(s.type)) bad.push(`lámina ${i + 1}: tipo "${s.type}"`); });
    if (bad.length) { console.error("✗ " + bad.join("\n✗ ")); process.exit(1); }
    console.log(`✓ ${p.name ?? o._[0]}: ${p.data.slides.length} láminas (${p.data.slides.map((s) => s.type).join(", ")})`);
  } else if (cmd === "render") {
    const p = loadProject(o._[0]);
    if (!o.out) throw new Error("Falta -o <carpeta>.");
    if (o.theme && !THEMES.includes(o.theme)) throw new Error(`Tema inválido: ${o.theme}`);
    if (o.accent && !ACCENTS.includes(o.accent)) throw new Error(`Acento inválido: ${o.accent}`);
    const files = await renderProject(p, { out: o.out, size: o.size, format: o.format, theme: o.theme, accent: o.accent, pixel: !!o.pixel || !!p.data.pixel, only: o.slide ? +o.slide : undefined });
    files.forEach((f) => console.log("✓", f));
  } else if (cmd === "to-md" || cmd === "slides" || cmd === "install-fonts") {
    const { cmdSlides } = await import("../lib/slides.mjs");
    await cmdSlides(cmd, o, loadProject);
  } else { console.error(`Comando desconocido: ${cmd}\n`); console.log(HELP); process.exit(1); }
} catch (e) { console.error("✗", e.message); process.exit(1); }
