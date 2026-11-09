import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { DIST, findChrome, serveDist } from "./browser.mjs";

export const SIZES = { threads: [1080, 1350], facebook: [1080, 1080], tiktok: [1080, 1920], instagram: [1080, 1350], square: [1080, 1080] };

export function parseSize(s = "threads") {
  if (SIZES[s]) return { width: SIZES[s][0], height: SIZES[s][1], label: s };
  const m = /^(\d+)x(\d+)$/.exec(s);
  if (!m) throw new Error(`Tamaño inválido "${s}". Usa threads|facebook|tiktok|instagram|square o WxH.`);
  return { width: +m[1], height: +m[2], label: s };
}

/** Renderiza todas las láminas (o solo `only`, 1-indexado) de un proyecto de Cover Creator. */
export async function renderProject(project, { out, size = "threads", format = "png", theme, accent, pixel = false, only, prefix = "slide" }) {
  if (!fs.existsSync(path.join(DIST, "index.html"))) throw new Error("Falta dist/. Ejecuta: npm run build");
  const sz = parseSize(size);
  fs.mkdirSync(out, { recursive: true });
  const { server, port } = await serveDist();
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ["--no-sandbox", "--force-color-profile=srgb"] });
  const files = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: sz.width, height: sz.height, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => console.error("  [página]", e.message));
    await page.evaluateOnNewDocument((input) => { window.__CC__ = input; }, { project, size: sz, theme, accent, pixel });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle0" });
    const info = await page.evaluate(() => window.__ccInfo());
    const idxs = only ? [only - 1] : [...Array(info.count).keys()];
    for (const i of idxs) {
      if (i < 0 || i >= info.count) throw new Error(`La lámina ${i + 1} no existe (hay ${info.count}).`);
      await page.evaluate((n) => window.__ccRender(n), i);
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 250));
      const ext = format === "jpg" || format === "jpeg" ? "jpg" : "png";
      const file = path.join(out, `${prefix}-${String(i + 1).padStart(2, "0")}-${info.types[i]}.${ext}`);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: sz.width, height: sz.height }, type: ext === "jpg" ? "jpeg" : "png", ...(ext === "jpg" ? { quality: 95 } : {}) });
      files.push(file);
    }
  } finally { await browser.close(); server.close(); }
  return files;
}
