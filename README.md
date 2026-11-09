# cover-creator-cli

Carruseles desde la terminal reutilizando el código de **Cover Creator** del portafolio
(`xeland314-portfolio/src/components/tools/covers`). Mismo resultado que el editor web, sin abrirlo.

```bash
npm install && npm run build                      # una vez (y cuando cambie el código del portafolio)
node bin/cc.mjs render proyecto.json -o out --pixel
node bin/cc.mjs render proyecto.json -o out --theme catppuccin --accent purple --size tiktok
node bin/cc.mjs slides proyecto.json -o out --pixel      # motor C-Slides (slides.c)
node bin/cc.mjs themes
```

Cómo funciona: `vite build` empaqueta una mini-app React (`render-app/`) que importa los componentes del portafolio
(alias `@covers`, cambia el origen con `CC_SOURCE`). El CLI sirve `dist/`, abre Chrome sin interfaz con `puppeteer-core`
(`CC_CHROME` para elegir el binario) y fotografía cada lámina a tamaño real.

Estilo pixel-art: `src/components/tools/covers/pixel.css` (en el portafolio, compartido con el editor, donde hay un
interruptor «Estilo pixel-art»). Es ortogonal al tema.

Skill para agentes: `skill/SKILL.md`. Detalle de C-Slides: `docs/slides-c.md`.
