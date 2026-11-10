import React from "react";
import { createRoot } from "react-dom/client";
import "./render.css";
import { BlogCover } from "@covers/BlogCover";
import { BlogMarkdownSlide } from "@covers/BlogMarkdownSlide";
import { BlogImage } from "@covers/BlogImage";
import { BlogEnd } from "@covers/BlogEnd";
import { migrateSlides } from "@covers/migrate";
import { THEME_STYLES, ACCENT_COLORS } from "@covers/types";

// Color del acento (hex) para el estilo pixel: paleta de Tailwind
const ACCENT_HEX: Record<string, string> = {
  blue: "#3b82f6", purple: "#a855f7", emerald: "#10b981", orange: "#f97316", rose: "#f43f5e", yellow: "#eab308", sky: "#0ea5e9",
  indigo: "#6366f1", cyan: "#06b6d4", teal: "#14b8a6", pink: "#ec4899", slate: "#64748b", violet: "#8b5cf6", lime: "#84cc16",
  red: "#ef4444", amber: "#f59e0b", fuchsia: "#d946ef",
};

declare global { interface Window { __CC__: any; __ccRender: (i: number) => void; __ccInfo: () => any; } }

const input = window.__CC__;
const slides = migrateSlides(input.project.data.slides);
const theme = {
  mode: input.theme ?? input.project.data.mode,
  accent: input.accent ?? input.project.data.accent,
  // en modo pixel, sin logo propio se usa el gato pixel-art incluido (public/logo-gato.png)
  showLogo: input.project.data.showLogo || (input.pixel && !input.project.data.logoImage) || false,
  logoImage: input.project.data.logoImage || (input.pixel ? "./logo-gato.png" : ""),
  username: input.project.data.username ?? "@xeland314",
};
const { width: W, height: H } = input.size;

// En modo pixel el emoji de la portada se "pixeliza": se dibuja en una cuadrícula de 20×20,
// se reduce la paleta y se amplía sin suavizado, para que no rompa el estilo.
function pixelEmoji(ch: string, grid = 20): React.ReactNode {
  const c = document.createElement("canvas");
  c.width = c.height = grid;
  const g = c.getContext("2d")!;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `${grid * 0.85}px "Noto Color Emoji", "Apple Color Emoji", sans-serif`;
  g.fillText(ch, grid / 2, grid / 2 + 1);
  const d = g.getImageData(0, 0, grid, grid);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i + 3] = d.data[i + 3] > 110 ? 255 : 0; // sin semitransparencias
    for (let k = 0; k < 3; k++) d.data[i + k] = Math.round(d.data[i + k] / 64) * 64 > 255 ? 255 : Math.round(d.data[i + k] / 64) * 64;
  }
  g.putImageData(d, 0, 0);
  return <img src={c.toDataURL()} alt="" style={{ width: "1em", height: "1em", imageRendering: "pixelated", display: "block" }} />;
}

function Slide({ index }: { index: number }) {
  const s: any = slides[index];
  const props = { ...s, ...(input.pixel && s.type === "cover" && s.iconChar ? { iconChar: pixelEmoji(s.iconChar) } : {}), theme, previewWidth: W, previewHeight: H };
  const el = s.type === "cover" ? <BlogCover {...props} /> : s.type === "markdown" ? <BlogMarkdownSlide {...props} /> : s.type === "image" ? <BlogImage {...props} /> : <BlogEnd {...props} />;
  return (
    <div className="cc-stage" data-pixel={input.pixel ? "true" : "false"} style={{ width: W, height: H, ["--cc-w" as any]: `${W}px`, ["--cc-h" as any]: `${H}px`, ["--cc-accent" as any]: ACCENT_HEX[theme.accent] ?? "#f97316" }}>
      {el}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
window.__ccRender = (i: number) => root.render(<Slide key={i} index={i} />);
window.__ccInfo = () => ({ count: slides.length, types: slides.map((s: any) => s.type), themes: Object.keys(THEME_STYLES), accents: Object.keys(ACCENT_COLORS) });
window.__ccRender(0);
