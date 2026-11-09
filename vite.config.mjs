import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// Código base reutilizado del portafolio (componentes de Cover Creator). Cambiar con CC_SOURCE.
const covers = path.resolve(process.env.CC_SOURCE ?? path.join(here, "../xeland314-portfolio/src/components/tools/covers"));
// Tailwind necesita una ruta real en @source: se genera según CC_SOURCE
fs.writeFileSync(path.join(here, "render-app/_sources.css"), `@source "${covers}";\n`);
const mod = (n) => path.join(here, "node_modules", n);

export default defineConfig({
  root: path.join(here, "render-app"),
  publicDir: path.join(here, "public"),
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@covers": covers,
      // una sola copia de cada dependencia, aunque el código viva en otro repo
      react: mod("react"), "react-dom": mod("react-dom"), "react-markdown": mod("react-markdown"),
      "remark-gfm": mod("remark-gfm"), "prism-react-renderer": mod("prism-react-renderer"),
    },
  },
  server: { fs: { allow: [here, covers, path.join(covers, "../../..")] } },
  build: { outDir: path.join(here, "dist"), emptyOutDir: true, chunkSizeWarningLimit: 2000 },
});
