@AGENTS.md

# Kalak v2

Rehacer de la web de Kalak (comida natural para mascotas, Mendoza). El plan por fases y las notas entre sesiones están en `docs/PLAN.md`; el sistema de diseño en `docs/design.md` (variante B, mockup en `docs/mockup/b.html`).

Para empezar una fase: leer este archivo y `docs/PLAN.md`, y de la web vieja (`~/Desktop/Programacion/Kalak`) solo lo que la fase indique.

## Comandos
- `pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` (`next typegen && tsc --noEmit`)
- `pnpm test` (Vitest, desde la fase 3)
- Cierre de fase: `pnpm lint && pnpm typecheck && pnpm build` en verde, actualizar `docs/PLAN.md`, commit y push.

## Stack
- Next.js 16.4 (App Router, `cacheComponents` + `partialPrefetching` activados), React 19.3, TypeScript strict, pnpm.
- Tailwind v4 vía `@tailwindcss/turbopack` (no hay `postcss.config`). Tokens en `@theme` de `src/app/globals.css`; la paleta por defecto de Tailwind está desactivada (`--color-*: initial`), solo existen los colores de marca.
- Fuentes con `next/font/google`: Inter (`font-sans`) y Fraunces con eje `opsz` (`font-display`).
- `motion` solo en componentes cliente puntuales. Radix solo para accordion y select. Vitest para lógica pura.

## Estructura
- `src/app`: rutas (mismas que la web vieja: `/dieta-kalak`, `/perros`, `/gatos`, `/suplementos`, `/mini-cursos`, `/transicion`, `/calcula-racion`, `/hacer-pedido`, `/contacto`).
- `src/content`: textos literales por página (`home.ts`, …).
- `src/config`: `site.ts` (WhatsApp, email, redes, puntos de retiro, navegación), `prices.ts`, `breeds.ts`.
- `src/features/ration`: lógica pura de la calculadora + tests. `src/features/ration-wizard`: UI. `src/features/order`.
- `src/components/layout`: Header, Footer, WhatsAppFab. `src/components/ui`: Button/ButtonLink, Card, Section, Reveal. `src/components/brand`: Logo, Guarda, WhatsAppIcon.
- `src/hooks`, `src/lib` (`whatsapp.ts`, `cn.ts`).
- `public/images`: solo las imágenes que se usan, en webp.

## Convenciones
- Server Components por defecto; `"use client"` solo donde hay estado o eventos.
- Datos de contacto y links solo desde `config/site.ts`; URLs de WhatsApp solo con `lib/whatsapp.ts`.
- Precios solo desde `config/prices.ts`. `0` = sin cargar → `formatPrice` muestra "Consultar" (`TODO(precios)`).
- Textos de la web vieja se copian literales a `src/content/*`.
- Código e identificadores en inglés; textos de UI en español rioplatense.
- Títulos: la palabra clave va en `<em>` (itálica naranja; `on-dark` en fondos oscuros).
- Contraste: nunca texto blanco sobre `orange`; el botón primario usa `text-ink`.
- Animaciones: `Reveal` (`variant="up" | "zoom"`, `index` para escalonar) para entradas al hacer scroll. Todo respeta `prefers-reduced-motion` (global en `globals.css`).
- Imágenes con `next/image` y `sizes` correctos; `preload` solo para la imagen LCP.
- `cacheComponents`: no usar `new Date()`/`Math.random()` en Server Components sin `"use cache"` (ver `CopyrightYear` en Footer).
- Header: transparente sobre fotos a sangre solo en las rutas de `OVERLAY_ROUTES` (`components/layout/Header.tsx`); el resto es sólido. Las páginas sin foto arriba dejan ~144px de padding superior.

## Deploy
- Repo `MorguiMateo/kalak-v2` (privado). Vercel proyecto `kalak-v2` (staging): cada push despliega un preview.
