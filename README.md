# Nagamohr S.A. — sitio web (rediseño)

Reconstrucción completa del sitio [nagamohr.com](http://nagamohr.com) (Drupal 7, 2015) como
sitio estático multipágina: mismo contenido, misma marca, diseño y código nuevos.

## Contenido y assets

Todo el texto, las imágenes, los PDF y la paleta proceden del dominio original, rastreado
página por página en su versión española:

| Original | Nuevo |
|---|---|
| `/es` | `index.html` |
| `/es/empresa` | `empresa.html` |
| `/es/productos` | `productos.html` |
| `/es/productos/posibilidades-de-produccion` | `posibilidades.html` |
| `/es/maquinaria/medios-productivos` | `medios-productivos.html` |
| `/es/maquinaria/galeria-de-fotos` | `galeria.html` |
| `/es/calidad/certificados-de-calidad` | `certificados.html` |
| `/es/calidad/equipos-de-metrologia` | `metrologia.html` |
| `/es/noticias` | `noticias.html` |
| `/es/contacto` | `contacto.html` |

- `assets/img/` — 34 imágenes descargadas del dominio en su resolución original
  (slider, productos, maquinaria, laboratorio, sellos de certificación, logotipo).
- `assets/docs/` — 7 PDF originales (folleto, catálogo, IATF 16949, ISO 9001, ISO 14001,
  política SGI y política ambiental).

## Marca

| Token | Valor | Origen |
|---|---|---|
| `--c-burgundy` | `#7D1229` | color corporativo del tema Drupal original (cabecera y pie) |
| `--c-crimson` | `#C8103E` | carmín del degradado del isotipo |
| `--c-burgundy-deep` | `#3D0713` | derivado, fondo del pie |
| Neutros | escala «acero» `#101216` → `#F7F8FA` | derivados de los grises del original |

Tipografías (Google Fonts): **Archivo** (titulares), **Inter** (texto),
**IBM Plex Mono** (etiquetas técnicas, cifras y referencias).

## Estructura

```
index.html … contacto.html   páginas finales (generadas)
assets/css/main.css          tokens, reset, cabecera y menú
assets/css/ui.css            componentes, secciones y pie
assets/js/main.js            interacción (sin dependencias)
assets/img/  assets/docs/    material del dominio original
_src/                        parciales + generador
robots.txt  sitemap.xml
```

Las páginas se generan concatenando `_src/head.html` + `_src/body-*.html` + `_src/foot.html`.
Tras editar cualquier parcial:

```bash
bash _src/build.sh
```

Para editar solo el texto de una página basta con tocar su `.html` final, pero entonces
conviene reflejar el cambio también en el parcial correspondiente.

## Previsualización local

```bash
node _src/serve.js 5177
```

## Menú

- **Escritorio**: cabecera fija que se oculta al bajar y reaparece al subir, transparente
  sobre la portada y sólida (fondo translúcido con desenfoque) al hacer scroll, con barra
  de progreso de lectura. Tres desplegables *mega* (productos, maquinaria, calidad) con
  descripción por enlace y vista previa de imagen que cambia al pasar el cursor.
- **Móvil**: panel a pantalla completa, entrada escalonada de los ítems, acordeones para
  los submenús, hamburguesa que se transforma en aspa, datos de contacto y selector de idioma.
- Accesible con teclado (`Tab`, `Esc`, `aria-expanded`, `aria-current`) y respeta
  `prefers-reduced-motion`.

## Compatibilidad

Probado sin desbordamiento horizontal en 10 páginas × 6 anchuras (320 – 1920 px).
CSS escrito para Safari 15+, Chrome, Edge y Firefox: prefijos `-webkit-` en
`backdrop-filter` y `mask-image`, fallback `100vh` antes de `100svh`, `matchMedia`
con `addListener` de reserva y JavaScript ES5 sin dependencias externas.

## Pendiente

- Solo está construida la versión **española**. El selector de idioma enlaza de momento a
  `/en`, `/de` y `/fr` del sitio actual; replicar las tres es mecánico (mismo `head/foot`
  y mismos parciales traducidos).
- El formulario de contacto abre el gestor de correo del visitante (`mailto:`) porque el
  hosting estático no procesa envíos. Con un endpoint de servidor se cambia el `submit`
  en `assets/js/main.js`.
- El dominio original solo responde por **HTTP**: el certificado TLS instalado es de
  `*.dinaserver.com` y `https://nagamohr.com` devuelve 404. Conviene emitir un certificado
  para el dominio antes de publicar.
