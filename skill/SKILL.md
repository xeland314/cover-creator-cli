---
name: cover-creator-cli
description: >
  Genera carruseles de redes sociales (PNG/JPG) desde la terminal con Cover Creator CLI: escribe un proyecto
  JSON (portada + láminas markdown + cierre), lo valida y lo renderiza con los componentes React del portafolio
  de xeland314, con estilo pixel-art opcional y cualquiera de los 9 temas. También convierte el proyecto a
  Markdown para C-Slides (slides.c). Úsala cuando el usuario pida un carrusel, láminas para Instagram/Threads/
  Facebook/RedNote/TikTok, "cover creator", exportar un proyecto de Cover Creator a imágenes, o armar los
  carruseles del calendario de contenido (carpeta social-media/carruseles).
---

# Cover Creator CLI

Proyecto: `/home/xeland314/workspace/active/cover-creator-cli` (comando `node bin/cc.mjs`, alias `cc`).
Reutiliza `xeland314-portfolio/src/components/tools/covers/*`, así que el resultado es idéntico al del editor web.

## Flujo

1. **Entender el tema**: una idea por carrusel, 5–7 láminas (portada + 3–5 de contenido + cierre).
2. **Escribir `proyecto.json`** (formato en `reference/spec.md`).
3. **Validar**: `node bin/cc.mjs validate proyecto.json`
4. **Renderizar**: `node bin/cc.mjs render proyecto.json -o salida/ --pixel`
5. **Mirar las imágenes** (lee 2–3 PNG) antes de dar el trabajo por terminado: texto cortado, tablas anchas o código ilegible.

Si `dist/` no existe o cambió el código del portafolio: `npm run build` (en cover-creator-cli).

## Comandos

| Comando | Para qué |
| --- | --- |
| `cc render p.json -o dir [--size threads\|facebook\|tiktok\|WxH] [--format png\|jpg] [--theme t] [--accent c] [--pixel] [--slide n]` | Imágenes con Chrome (motor principal) |
| `cc validate p.json` | Comprueba tipos de lámina, tema y acento |
| `cc themes` | Temas, acentos y tamaños |
| `cc to-md p.json [-o x.md]` | Markdown de C-Slides |
| `cc slides p.json -o dir [--palette p] [--pixel] [--size WxH] [--format png\|pdf\|svg\|jpg]` | Imágenes con el binario `slides` (slides.c). `CC_SLIDES` apunta al binario |
| `cc install-fonts` | Instala las fuentes pixel para `--pixel` en C-Slides |

Tamaños: `threads` 1080×1350 (4:5, el predeterminado), `facebook` 1080×1080, `tiktok` 1080×1920.
Temas: light, dark, midnight, soft, catppuccin, **ambercat** (marca personal: paleta del gato), rose, blue, obsidian.
`--pixel` es independiente del tema: se puede combinar con cualquiera.

## Reglas de contenido (carruseles de xeland314)

- Español. Una idea por lámina; frases cortas. Primera línea de cada lámina markdown: `## Título` (aparece en la píldora de color).
- Código: bloques de **máx. 6 líneas** y ≤ 34 caracteres por línea; lenguaje en la cerca (```c, ```python, ```go, ```bash, ```text).
- Tablas: máx. 4 filas y 3 columnas; el texto de celda, corto.
- Usa `fontScale: 1.35` en las láminas markdown para llenar mejor el lienzo.
- Tema `ambercat` + acento `orange` por defecto (identidad del gato). Estilo `--pixel` por defecto en redes.
- Serie TI: solo datos ficticios (`example.com`, `203.0.113.0/24`, `evil.test`); nada de clientes, equipos o redes reales.
- Cierre (`end`): invita a guardar y seguir; sin hashtags en las imágenes (van en el texto de cada red).

## Con el calendario de social-media

`social-media/carruseles/NNN-slug/proyecto.json` ↔ `videos/NNN-slug`. Desde `social-media`: `npm run carousel -- NNN` (pixel) o `-- NNN --flat`.
Salida en `carruseles/NNN-slug/img/` (ignorada por git). El texto de cada red sale de `npm run captions -- NNN red`.

## Qué no hace

- No edita imágenes ni sube nada a redes.
- Emoji de portada: usa uno solo (`iconChar`); en `--pixel` se dibuja tal cual.
- C-Slides no soporta enlaces ni HTML; `cc to-md` los deja como texto.
