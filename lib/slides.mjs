// Puente con C-Slides (slides.c): convierte un proyecto de Cover Creator a Markdown y lo exporta con el binario.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "./browser.mjs";

const SLIDES_BIN = process.env.CC_SLIDES ?? "slides"; // binario de C-Slides (en PATH o ruta en CC_SLIDES)
// tema de Cover Creator -> paleta de C-Slides
const PALETTE = { light: "light", dark: "dark", midnight: "tokyo-night", soft: "light", catppuccin: "catppuccin", ambercat: "ambercat", rose: "rose", blue: "blue", obsidian: "dark" };
const ACCENT_HEX = { blue: "#3b82f6", purple: "#a855f7", emerald: "#10b981", orange: "#f97316", rose: "#f43f5e", yellow: "#eab308", sky: "#0ea5e9", indigo: "#6366f1", cyan: "#06b6d4", teal: "#14b8a6", pink: "#ec4899", slate: "#64748b", violet: "#8b5cf6", lime: "#84cc16", red: "#ef4444", amber: "#f59e0b", fuchsia: "#d946ef" };
const PIXEL_FONT = "Silkscreen";

/** Markdown de C-Slides (parser lineal: ver la skill c-slides). */
export function toMarkdown(project) {
  const out = project.data.slides.map((s) => {
    if (s.type === "cover") return `# ${s.title}\n## ${s.subtitle ?? ""}\n\n${s.category ?? ""}`;
    if (s.type === "markdown") return s.content.replace(/\n{3,}/g, "\n\n");
    if (s.type === "image") return `# ${s.title ?? ""}\n\n${s.caption ?? ""}`;
    return `# ${s.firstText} ${s.secondText}\n\n${s.description ?? ""}\n\n${s.finalText ?? ""}`;
  });
  return out.join("\n\n---\n") + "\n";
}

export async function cmdSlides(cmd, o, loadProject) {
  if (cmd === "install-fonts") {
    const dest = path.join(os.homedir(), ".local/share/fonts/cover-creator-cli");
    fs.mkdirSync(dest, { recursive: true });
    for (const f of fs.readdirSync(path.join(ROOT, "public/fonts/pixel"))) fs.copyFileSync(path.join(ROOT, "public/fonts/pixel", f), path.join(dest, f));
    spawnSync("fc-cache", ["-f", dest], { stdio: "ignore" });
    console.log(`✓ fuentes pixel en ${dest} (Press Start 2P, Silkscreen, VT323)`);
    return;
  }
  const p = loadProject(o._[0]);
  const md = toMarkdown(p);
  if (cmd === "to-md") {
    if (o.out) { fs.writeFileSync(o.out, md); console.log("✓", o.out); } else process.stdout.write(md);
    return;
  }
  // cmd === "slides": exportar con C-Slides
  if (!o.out) throw new Error("Falta -o <carpeta>.");
  fs.mkdirSync(o.out, { recursive: true });
  const mdFile = path.join(o.out, "presentacion.md");
  fs.writeFileSync(mdFile, md);
  const theme = o.theme ?? p.data.mode ?? "dark";
  const palette = o.palette ?? PALETTE[theme] ?? "dark";
  const accent = o.accent ?? p.data.accent;
  const args = ["-p", palette, "-e", o.format ?? "png", "-er", o.size && /^\d+x\d+$/.test(o.size) ? o.size : "1080x1350"];
  if (o.pixel || p.data.pixel) {
    const has = spawnSync("fc-list", [PIXEL_FONT], { encoding: "utf8" }).stdout.trim();
    if (!has) console.error(`⚠ La fuente ${PIXEL_FONT} no está instalada: ejecuta "cc install-fonts" o el texto saldrá con la fuente por defecto.`);
    args.push("-f", PIXEL_FONT, "-s", o["font-scale"] ?? "0.95");
  }
  if (accent && ACCENT_HEX[accent]) args.push("--accent", ACCENT_HEX[accent]);
  const r = spawnSync(SLIDES_BIN, [...args, "presentacion.md"], { cwd: o.out, encoding: "utf8" });
  if (r.error) throw new Error(`No pude ejecutar "${SLIDES_BIN}": ${r.error.message}. Define CC_SLIDES=/ruta/a/slides`);
  process.stdout.write(r.stdout);
  if (r.status) throw new Error(r.stderr || `slides terminó con código ${r.status}`);
}
