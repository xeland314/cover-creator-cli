# C-Slides (slides.c)

- Binario: `/home/xeland314/workspace/tools/bin/slides` (X11 + Cairo + Pango). El código **nuevo** no está en este equipo
  (`lateral-panel/slides.c` es una versión vieja de 860 líneas sin paletas ni exportación): usa el binario.
- Paletas: dark, rose, monokai, nord, light, blue, **ambercat**, dracula, gruvbox, catppuccin, tokyo-night.
- Exporta a png/pdf/svg/gif/jpg (`-e`, `-er WxH`, `-sl n`), fuente (`-f`), escala (`-s`) y colores sueltos (`--bg --title --accent …`).
- No tiene modo pixel-art propio: `cc slides --pixel` lo emula con la fuente **Silkscreen** (`cc install-fonts`) y la paleta elegida.
  Para un pixel-art real en slides.c haría falta añadir en su código: fuente bitmap, sin antialiasing (`CAIRO_ANTIALIAS_NONE`),
  bordes de 1 px escalados y sombras duras; el CLI ya deja el contrato (`-f`, `-p`).
- Correspondencia de temas Cover Creator → paleta: light→light, dark→dark, midnight→tokyo-night, soft→light,
  catppuccin→catppuccin, ambercat→ambercat, rose→rose, blue→blue, obsidian→dark.
- Parser lineal (no CommonMark): ver la skill `c-slides`. `cc to-md` genera el Markdown compatible.
