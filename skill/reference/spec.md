# Formato del proyecto (Cover Creator)

```json
{
  "id": "p005",
  "name": "005 Bash: && vs ||",
  "lastModified": 1760000000000,
  "data": {
    "mode": "ambercat",
    "accent": "orange",
    "showLogo": false,
    "logoImage": "",
    "pixel": false,
    "username": "@xeland314",
    "selectedSlideId": "1",
    "slides": [ ... ]
  }
}
```

`pixel` es opcional; la bandera `--pixel` del CLI lo activa sin tocar el archivo.

## Láminas

| type | campos |
| --- | --- |
| `cover` | `id`, `title`, `subtitle`, `category`, `iconChar`, `imageUrl?`, `imageFit?` |
| `markdown` | `id`, `content` (Markdown con GFM: títulos, listas, tablas, código), `fontScale?` (1.35 recomendado) |
| `image` | `id`, `title`, `imageUrl`, `caption`, `imageFit` (`contain`\|`cover`), `fontScale?` |
| `end` | `id`, `firstText`, `secondText`, `description`, `likeText`, `commentText`, `saveText`, `finalText` |

`id` único por lámina (cadena). Temas: light, dark, midnight, soft, catppuccin, ambercat, rose, blue, obsidian.
Acentos: blue, purple, emerald, orange, rose, yellow, sky, indigo, cyan, teal, pink, slate, violet, lime, red, amber, fuchsia.

El proyecto es importable en el editor web (`/cover-creator` → Proyectos → Importar JSON).
