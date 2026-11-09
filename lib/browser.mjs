import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DIST = path.join(ROOT, "dist");

/** Busca Chrome/Chromium: CC_CHROME, caché de puppeteer o el del sistema. */
export function findChrome() {
  if (process.env.CC_CHROME) return process.env.CC_CHROME;
  const cache = path.join(os.homedir(), ".cache/puppeteer/chrome");
  if (fs.existsSync(cache)) {
    for (const v of fs.readdirSync(cache).sort().reverse()) {
      const p = path.join(cache, v, "chrome-linux64/chrome");
      if (fs.existsSync(p)) return p;
    }
  }
  for (const p of ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"]) if (fs.existsSync(p)) return p;
  throw new Error("No encontré Chrome. Define CC_CHROME=/ruta/a/chrome o instala chromium.");
}

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };

/** Servidor estático mínimo para dist/ (los módulos ES no cargan desde file://). */
export function serveDist() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const file = path.join(DIST, url === "/" ? "index.html" : url);
    if (!file.startsWith(DIST) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port })));
}
