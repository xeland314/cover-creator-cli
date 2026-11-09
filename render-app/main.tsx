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
  showLogo: input.project.data.showLogo ?? false,
  logoImage: input.project.data.logoImage ?? "",
  username: input.project.data.username ?? "@xeland314",
};
const { width: W, height: H } = input.size;

function Slide({ index }: { index: number }) {
  const s: any = slides[index];
  const props = { ...s, theme, previewWidth: W, previewHeight: H };
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
