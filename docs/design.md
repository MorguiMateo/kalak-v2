# Kalak v2 · Sistema de diseño (variante B · Inmersivo)

Fuente de verdad visual. La referencia de marca provista por el usuario prevalece sobre la paleta y tipografía del mockup original. Referencia de estructura: `docs/mockup/b.html` (servir con `cd docs/mockup && python3 -m http.server 4321` y abrir `localhost:4321/b.html`). `index.html` (A) y `c.html` (C) son variantes descartadas; solo de referencia.

## Principios
- **Las fotos mandan**: imágenes grandes, a sangre o casi (márgenes de 8px), poco espacio en blanco entre bloques.
- **Esencia Kalak**: zorro en cápsula y lettering original intactos, guarda andina beige bajo el hero, naranja cálido, beige y negro carbón. Sin azul petróleo ni títulos serif; textos literales. La textura artesanal pertenece al logo y la guarda, no a los párrafos o controles.
- **Movimiento con propósito**: entra al aparecer, responde al tocar, nunca en bucle. Sin patitas ni círculos flotantes.

## Color
| Token | Valor | Uso |
|---|---|---|
| `cream` | `#FAF7F0` | Fondo de página, header sólido (90% + blur) |
| `sand-100` | `#EFE9DA` | Placeholders de imagen, pista de progreso |
| `sand` | `#D5CEB2` | Beige de marca (guarda) |
| `line` | `#E4DCC8` | Bordes y divisores |
| `charcoal` | `#20221D` | Texto principal, títulos, footer |
| `ink` | `#20221D` | Texto sobre naranja (5.7:1), switcher |
| `muted` | `#626156` | Texto secundario (5.8:1 sobre crema) |
| `orange` | `#EF792C` | Botón primario, barra de progreso |
| `orange-600` | `#B74712` | Texto destacado sobre fondo claro; contraste AA incluso en texto pequeño |
| `orange-300` | `#F7A06C` | Palabra destacada sobre foto/fondo oscuro |
| `green-700` | `#2F7A3A` | Mensajes positivos y datos de resultados (uso semántico, no decorativo) |
| `overlay` | `rgb(32 34 29 / .55–.78)` | Degradados sobre fotos para legibilidad |
| `whatsapp` | `#25D366` | Solo botón flotante |

Contraste: nunca texto blanco sobre `orange` (2.8:1); el primario usa `ink`. Todo texto sobre foto lleva degradado oscuro debajo.

## Tipografía
- **Display**: Oswald variable 600, alta y condensada para acompañar el carácter del logotipo, sin intentar recrearlo. H1–H3 en mayúsculas, `letter-spacing: .01em`, `line-height: 1.1`. `<em>` = énfasis cromático sin itálica, con peso heredado, en `orange-600` (o `orange-300` sobre oscuro). El logotipo conserva su lettering original como imagen, sin redibujarlo ni sustituirlo por una fuente web.
- **Texto**: Inter 400/500/600, base 17px, `line-height: 1.6`.
- **Eyebrow**: Inter 600, 12px, mayúsculas, `letter-spacing: .12em`.

| Rol | Tamaño |
|---|---|
| H1 hero | `clamp(52px, 8vw, 112px)`, máx. 11ch |
| H1 calculadora (banner) | `clamp(34px, 4.6vw, 56px)` |
| H2 sección | `clamp(32px, 4vw, 54px)` |
| H2 CTA final | `clamp(36px, 5vw, 68px)` |
| H2 paso calculadora | `clamp(28px, 3.2vw, 40px)` |
| Caption sobre foto (bento) | Oswald 500 `clamp(20px, 2vw, 28px)` (18px móvil) |
| H3 ingrediente | 24px |
| Pregunta FAQ | Oswald 500, 20px |

## Layout y espaciado
- Contenedor `1240px`, gutter 20px. Calculadora `900px`.
- `--gap: 8px`: separación entre fotos/tiles y margen lateral de bloques a sangre (bento, FAQ, CTA).
- Ritmo vertical: 72px antes de bento/statement, 96px entre secciones (64px en móvil).
- Breakpoint principal `960px`: menú hamburguesa, una columna, botones a ancho completo.

## Radios y sombras
- `radius 14px` (tiles, cards, CTA, opciones) · `pill 999px` (botones, flechas).
- Sombras casi nulas: las fotos dan la profundidad. Bordes con `inset 0 0 0 1.5px line`.

## Secciones de la Home (orden)
1. **Hero a pantalla completa** (`100svh`, 88svh móvil): `<picture>` con `background.webp` (desktop) / `fondoOlga1.webp` (móvil), degradado de abajo, texto blanco abajo a la izquierda (eyebrow, H1, lead, 2 botones). Indicador vertical "Deslizá ↓" (solo desktop).
2. **Guarda** de 20px.
3. **Statement** en 2 columnas (título | párrafo), 1 columna en móvil.
4. **Bento de beneficios** a sangre: 3 columnas `1.4fr 1fr 1fr`, 2 filas `minmax(240px, 27vw)`; tile 1 ocupa 2 filas, tile 4 ocupa 2 columnas. Móvil: 2 columnas, primera fila 320px a ancho completo, resto 230px. Caption sobre degradado.
5. **Ingredientes**: encabezado + flechas; carrusel horizontal con scroll-snap, cards de `clamp(240px, 24vw, 320px)`, foto cuadrada arriba y texto abajo. Alineado al contenedor con `scroll-padding-inline`.
6. **FAQ partida**: foto grande (`gatoComiendo.webp`, min 560px) | acordeón. Móvil: foto 300px arriba.
7. **CTA final** con foto de fondo (`perroComiendo.webp`) y overlay, H2 centrado + 2 botones.
8. **Footer** carbón: logo completo en cápsula blanca, navegación, atención al cliente, puntos de retiro.

## Componentes
- **Button**: 52px, pill, Inter 600 15px. `primary` (naranja + ink), `light` (blanco 14% + blur + borde blanco 50%, para sobre fotos; hover → blanco con texto carbón), `ghost`. Flecha `→` se mueve 4px en hover.
- **Header**: fijo. Sobre el hero: transparente, texto blanco. Con scroll > 24px (o en páginas sin hero a sangre): crema 90% + blur, texto carbón, 76px → 60px, logo 46px → 38px.
- **Menú móvil**: pantalla completa carbón, links Oswald 30px blancos, fade.
- **Tile / BentoTile**: foto `object-fit: cover`, degradado inferior, caption; hover zoom 1.06 (1.4s).
- **IngredientCard**: card blanca, foto 1:1, nombre + descripción; hover zoom de la foto.
- **Accordion**: un ítem abierto; ícono + que rota 45°; altura con `grid-template-rows 0fr → 1fr`.
- **PhotoBanner** (calculadora y páginas internas): foto 340px (240px móvil) con degradado y título blanco.
- **Calculadora**: progreso "Paso N de 14" con barra naranja de 4px y nombres de mascotas; opciones en grilla de 3 como tarjetas con imagen grande arriba (4:3.4) y texto abajo; check en la esquina que se pone naranja con tilde carbón al elegir; seleccionada con borde `orange` de 3px. Los pills seleccionados usan naranja con texto carbón. En móvil siguen 3 columnas compactas (solo imagen + título). Volver (ghost) / Continuar (primary, deshabilitado hasta elegir).
- **WhatsAppFab**: 56px, verde WhatsApp, abajo a la derecha.

## Movimiento
| Token | Valor |
|---|---|
| `ease` | `cubic-bezier(.2,.7,.2,1)` |
| `fast` | 150ms (press) |
| `base` | 300ms (hover, header, acordeón, pasos) |
| `reveal` | 800ms |

- **Hero**: foto hace zoom 1.15 → 1 en 2.2s; textos en cascada desde 0.3s (+0.1s cada uno).
- **Reveal on scroll**: `translateY(28px)` + fade, 800ms, escalonado 90ms (`--i`). Variante `zoom` para fotos/tiles: `scale(.96) → 1`. IntersectionObserver, una sola vez.
- **Hover en fotos**: zoom lento (1–1.4s).
- **Pasos de la calculadora**: salida 300ms (fade + 40px), entrada desde el lado de avance; se invierte al volver. Barra de progreso 600ms.
- **Press**: `scale(.97)` botones, `.98` opciones.
- **`prefers-reduced-motion`**: duraciones ~0, sin desplazamientos ni zoom.

En Next: reveal con un componente `Reveal` (IntersectionObserver + CSS), header con un hook de scroll; `motion` solo si la transición de pasos lo necesita.

## Imágenes
- Hero: `background.webp` (desktop), `fondoOlga1.webp` (móvil).
- Bento: `olgaApetito`, `caquita`, `muchosGatos`, `tiniBrillante` (object-position 50% 30%).
- Ingredientes: `polloFondoBlanco`, `carne`, `higadoVacuno`, `sesos`, `acelga`, `calabaza`, `corazonDePollo`.
- FAQ: `gatoComiendo.webp`. CTA y banner de calculadora: `perroComiendo.webp`.
- Logo: `logo-zorro.webp` (zorro, header) y `logo.webp` (completo, footer). Pendiente: logo en SVG.
- Calculadora: `pet-*.webp` / `cat-*.webp` sobre fondo `#F3F3F3`.
- Fotos grandes (>2000px) se sirven con `next/image` y `sizes` correctos; nunca el original.
