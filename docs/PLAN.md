# Kalak v2 · PLAN

## Contexto
La web actual (`~/Desktop/Programacion/Kalak`, repo `MorguiMateo/Kalak`, Vercel `kalak` → kalak-morguimateos-projects.vercel.app) es de abril 2025. Problemas:
- La calculadora está en un solo archivo de 2.922 líneas.
- Hay logs y código muerto.
- Los precios están duplicados y no coinciden (`config/prices.ts` 3800 vs `hacer-pedido/page.tsx` 5000).
- El número de WhatsApp está repetido en 5 sitios.
- Las fuentes se declaran pero nunca se cargan.

Se rehace en `~/Desktop/Programacion/kalak-v2` con código limpio, buen rendimiento y un diseño más minimal con mejores animaciones, conservando la esencia: textos, fotos, paleta, la guarda y el flujo calculadora → pedido por WhatsApp. Al final se reemplaza la web vieja.

Decisiones tomadas:
- Diseño e implementación los hago yo.
- Repo nuevo y después reasignar.
- Precios como placeholder.
- Fuentes libres.

**Trabajo por fases**: cada fase es **una sesión nueva** de Claude Code. Cada una lee solo lo que necesita y termina con un commit.

## Cómo se trabaja cada fase (para ahorrar tokens)
- En la fase 2 se crean dos archivos que hacen de memoria entre sesiones:
  - `kalak-v2/CLAUDE.md`: stack, convenciones, estructura de carpetas y comandos.
  - `kalak-v2/docs/PLAN.md`: este plan con checkboxes y una sección "Notas para la próxima fase".
- Para empezar una fase: abrir una sesión nueva en `kalak-v2` y escribir **"Fase N del PLAN.md"**. Claude lee `CLAUDE.md` y `docs/PLAN.md` y solo los archivos viejos que esa fase indica.
- Al cerrar cada fase:
  1. Pasan `lint`, `typecheck` y `build` (y `test` si aplica).
  2. Se marca el checkbox y se anotan las decisiones en PLAN.md.
  3. Commit y push. Vercel despliega el preview solo.
- Regla: no releer la web vieja completa. Cada fase abre solo las páginas viejas que va a migrar.

## Stack (fijo para todas las fases)
- Next.js (última estable, App Router), TypeScript strict y pnpm.
- Tailwind v4 con tokens en `@theme`. `motion` solo en componentes cliente puntuales.
- Server Components por defecto. `next/font/google`: Inter o Geist para el cuerpo y Fraunces para los títulos.
- Radix solo para accordion y select. Vitest. Mismas rutas que hoy.

Estructura:
- `src/app`: rutas.
- `src/content`: textos.
- `src/config`: site, prices, breeds.
- `src/features/ration`: lógica pura y tests.
- `src/features/ration-wizard`: UI de la calculadora.
- `src/features/order`
- `src/components/{layout,ui,brand}`
- `src/lib/whatsapp.ts`

---

## Fases

### [x] Fase 1: Dirección de diseño (sin código del proyecto todavía)
- Leer: `Kalak/src/app/page.tsx`, `tailwind.config.js` y `globals.css`, y mirar `public/images`.
- Hacer: un mockup HTML de la Home y de un paso de la calculadora, en móvil y desktop.
  - Paleta reducida: blanco, beige `#D8CDB1`, navy `#21445B`, naranja `#F27830` y verde `#5DBA66`.
  - Se mantiene la guarda.
  - Animaciones: reveal al hacer scroll, transición entre pasos y hover/press, respetando reduced-motion.
- Entregable: el mockup para que lo apruebes, y `kalak-v2/docs/design.md` con los tokens (colores, tipografía, espaciado, radios y animaciones).
- Listo cuando: apruebas el diseño.

### [x] Fase 2: Base del proyecto, repo y staging
- Hacer: `create-next-app` en `kalak-v2` con Tailwind v4 y los tokens de `design.md`, fuentes y layout.
  - Componentes: Header (se compacta al hacer scroll), menú móvil, Footer, Guarda y botón flotante de WhatsApp.
  - Primitivas UI: Button, Card, Section y Reveal.
  - `config/site.ts` (WhatsApp `542615038820` y redes) y `config/prices.ts` con `0` y `TODO(precios)`. La UI muestra "Consultar".
  - Copiar solo las imágenes usadas (las PNG pasan a webp).
- Crear `CLAUDE.md` y `docs/PLAN.md`.
- Repo privado `MorguiMateo/kalak-v2` y proyecto Vercel `kalak-v2` para staging. **Te pido confirmación antes de crearlos.**
- Listo cuando: el build pasa y hay un preview con el layout y la Home vacía.

### [x] Fase 3: Lógica de la calculadora con tests
- Leer: `Kalak/src/app/calcula-racion/page.tsx`, solo las líneas 34-50 (tipos) y 300-620 y 757-930 (fórmulas y mensaje). También `config/breeds.ts`.
- Hacer: funciones puras en `features/ration/`: `portion`, `supplements`, `pricing` y `order-message`, con las mismas fórmulas.
- Golden tests: una copia literal de las funciones viejas como fixture. Una matriz de casos tiene que dar los mismos gramos y el mismo mensaje de WhatsApp.
- Bug del calcio: depende de un estado global y no de la mascota. Te lo consulto antes de corregirlo.
- Listo cuando: `pnpm test` pasa en verde.

### [x] Fase 4: Calculadora UI, parte 1 (pasos 0-7)
- Leer: `calcula-racion/page.tsx` líneas 60-280 (navegación) y 960-1720 (pasos 0-7).
- Hacer: un wizard con `useReducer` y los pasos en un array de config, un componente por paso.
  - Agregar la barra de progreso animada, la transición entre pasos, la validación por paso y el soporte para varias mascotas.
  - Guardar el progreso en `sessionStorage`.
- Listo cuando: los pasos 0-7 funcionan en el preview, en móvil y desktop.

### [x] Fase 5: Calculadora UI, parte 2 (pasos 8-14, resumen y envío)
- Leer: `calcula-racion/page.tsx` líneas 1720-2922.
- Hacer: los pasos restantes (dieta, suplementos, duración, contacto y "¿ya pediste antes?"), el resumen y el envío a WhatsApp con `order-message`.
- Listo cuando: un recorrido completo con 1 y 2 mascotas genera la URL `wa.me` correcta.

### [x] Fase 6: Home
- Leer: `Kalak/src/app/page.tsx`.
- Hacer: `content/home.ts` con los textos literales y la Home nueva (hero, secciones y FAQ con accordion).
- Listo cuando: no falta ningún texto ni imagen respecto a la Home vieja.

### [ ] Fase 7: Perros, Gatos y Dieta Kalak
- Leer: `perros/`, `gatos/` y `dieta-kalak/page.tsx`.
- Hacer: `content/*.ts` y las tres páginas como Server Components, reutilizando Section y Card.

### [ ] Fase 8: Transición, Suplementos y Mini-cursos
- Leer: `transicion/`, `suplementos/` y `mini-cursos/page.tsx`.
- Hacer: lo mismo que en la fase 7. Suplementos lee los precios de `config/prices.ts`.

### [ ] Fase 9: Hacer pedido y Contacto
- Leer: `hacer-pedido/` y `contacto/page.tsx`.
- Hacer: el formulario de pedido, reutilizando `pricing` y `lib/whatsapp` (sin precios duplicados), y la página de contacto con `config/site.ts`.

### [ ] Fase 10: Pulido (SEO, rendimiento y accesibilidad)
- Hacer:
  - `metadata` por página, `sitemap`, `robots` y OG image.
  - Revisar `sizes` y `priority` de las imágenes.
  - Auditar el bundle y sacar dependencias muertas.
  - Foco visible, labels y contraste AA.
- Listo cuando: Lighthouse en móvil da ≥ 95 en las 4 categorías, en Home y Calculadora.

### [ ] Fase 11: Validación y swap (cada paso con tu confirmación)
1. Recorrer staging página por página contra la web vieja y hacer un pedido de prueba real a WhatsApp.
2. Cargar los precios reales que me pases.
3. Poner el tag `legacy-v1` en el repo viejo.
4. En Vercel, en el proyecto `kalak`, ir a Settings → Git, desconectar `Kalak` y conectar `kalak-v2`. Desplegar a producción. Se mantiene la URL.
5. Comprobar producción. Borrar el proyecto Vercel `kalak-v2` y archivar el repo viejo en GitHub.
6. Rollback: volver a conectar el repo viejo o hacer "Promote" del último deployment viejo.

---

## Verificación (en cada fase)
- `pnpm lint && pnpm typecheck && pnpm build`, y `pnpm test` desde la fase 3.
- Revisión en el navegador del preview en móvil y desktop, solo de lo que se tocó en esa fase.
- En las fases 6-9: comparar contra la página vieja que no falte ningún texto ni imagen.

---

## Estado
- `[ ]` pendiente · `[~]` en curso / esperando aprobación · `[x]` hecha

## Notas para la próxima fase
### Fase 1 (2026-10-22)
- Mockup: `docs/mockup/index.html` (Home + pasos 8 y 9 de la calculadora, desktop y móvil). Servir con `cd docs/mockup && python3 -m http.server 4321`.
- Tokens y reglas en `docs/design.md`. Decisiones clave: botón primario naranja con texto `ink` (blanco sobre naranja no pasa AA); itálica naranja para la palabra clave de cada título; formas de cápsula del logo en botones, fotos y hero.
- Imágenes del mockup copiadas a `docs/mockup/img/` (originales en `~/Desktop/Programacion/Kalak/public/images`).
- Datos de contacto (para `config/site.ts`): WhatsApp `542615038820`, `contacto.kalak@gmail.com`, Instagram `https://www.instagram.com/kalak.comidarealparamascotas/`. Puntos de retiro en `Kalak/src/components/layout/Footer.tsx`.
- Variantes agregadas a pedido del usuario: `mockup/b.html` (inmersivo: hero a pantalla completa, bento de fotos, carrusel de ingredientes, FAQ con foto, CTA con foto) y `mockup/c.html` (bloques de color y tipografía Bricolage Grotesque, inspirado en The Farmer's Dog / Butternut Box: barra de anuncio, sticker giratorio, marquesina, "Así de simple" en 3 pasos, calculadora tipo onboarding con barra inferior fija). B y C comparten `mockup/shared.js`. `design.md` describe la variante A; actualizarlo según la variante elegida.
- **Decisión (2026-10-22): se elige la variante B (inmersiva).** `design.md` ya describe B. Construir siguiendo `mockup/b.html`.

### Para la Fase 2
- Leer solo `CLAUDE.md` (crearlo), `docs/design.md` y este archivo. No hace falta abrir la web vieja salvo `Kalak/src/components/layout/Footer.tsx` para los links.
- Imágenes a copiar de `~/Desktop/Programacion/Kalak/public/images`: las listadas en `design.md` § Imágenes + `guardabeige.webp`, `favicon.webp`.
- Pedir confirmación al usuario antes de crear el repo `MorguiMateo/kalak-v2` y el proyecto Vercel.

### Fase 2 (2026-10-22)
- Scaffold con `create-next-app` → **Next 16.4.2**, React 19.3, Tailwind v4 vía `@tailwindcss/turbopack` (sin PostCSS), `cacheComponents` + `partialPrefetching` activos. Leer `node_modules/next/dist/docs/` ante dudas de API (ver `AGENTS.md`).
- Tokens de `design.md` en `@theme` (`src/app/globals.css`). Paleta default de Tailwind desactivada. Breakpoint `lg` = 960px. Utilidades propias: `container-site`, `eyebrow`, `guarda`.
- Componentes: `Header` (transparente solo en `OVERLAY_ROUTES`, hoy vacío → **en la fase 6 agregar `"/"`**; compacta 76→60px con scroll > 24px), menú móvil a pantalla completa (Esc, bloquea scroll, se cierra al navegar), `Footer` (año con `"use cache"` + `cacheLife("max")`), `WhatsAppFab`, `Guarda`, `Logo` (`LogoMark`/`LogoFull`).
- Primitivas: `Button`/`ButtonLink` (`primary | light | ghost`, `md | sm`, `arrow`), `Card`, `Section` (`width: site | calc | bleed`, eyebrow/title/intro), `Reveal` (IntersectionObserver compartido, `data-reveal` + `data-shown`; sin JS el contenido queda visible por `@media (scripting: enabled)`).
- Ojo: `cn` no resuelve conflictos de Tailwind; para ocultar un `ButtonLink` por breakpoint envolverlo en un `div` (`hidden lg:block`).
- `config/site.ts` (WhatsApp, email, Instagram, puntos de retiro con links a Maps, `mainNav`, `ctaLinks`), `config/prices.ts` (todo en `0`, `formatPrice` → "Consultar"; claves: `formula.dog/cat`, `supplements.caldo/curcuma/calcio/colageno`), `lib/whatsapp.ts`.
- Imágenes en `public/images`: las de `design.md` + `cat-*.webp`, `guardabeige.webp` (reducida a 60px de alto), `favicon.webp`. `logofooter.png` → `logo-zorro.webp`.
- Home = placeholder (`src/app/page.tsx`) y `not-found.tsx` con estilo de marca. El resto de rutas da 404 hasta su fase.
- Repo privado `MorguiMateo/kalak-v2` (rama `main`) y proyecto Vercel `kalak-v2` (scope `morguimateos-projects`) conectado al repo: cada push despliega.

### Para la Fase 3
- Leer solo lo que indica la fase (líneas de `calcula-racion/page.tsx` y `config/breeds.ts`). Instalar Vitest (`pnpm add -D vitest`) y agregar el script `test`.
- Precios: usar `prices.formula.dog/cat` y `prices.supplements.*` de `config/prices.ts` (hoy en 0); el golden test debe inyectar los precios viejos (3800/4300/2300/1000/1100/1300) para comparar.

### Fase 3 (2026-10-22)
- `src/features/ration/`: `types.ts`, `portion.ts` (`dailyPercentage`, `dailyKalakGrams`, `resolveDuration`, `kalakBags`, `AGE_PERCENTAGE`), `supplements.ts` (`caldoDosage`, `curcumaDosage`, `calcioPots`, `calcioIncluded`), `order.ts` (`petOrder`, `orderTotals`), `pricing.ts` (`orderPrice`, lee `config/prices.ts`), `order-message.ts` (`orderMessage`). Todo se importa desde `@/features/ration`. URL: `whatsappUrl(orderMessage(...))`.
- Tipos nuevos: `Pet.weight` es número (kg); suplementos son ids `caldo | curcuma | calcio` (antes "Caldo", "Curcuma activada", "Calcio"); el porcentaje por edad se deriva de `age` (ya no se guarda en la mascota).
- Golden tests: `__fixtures__/legacy.ts` es copia literal de las funciones viejas (sin `console.log`, estado → parámetros). `golden.test.ts` compara gramos, dosis, mensaje y URL `wa.me` en una matriz de 2.496 mascotas, todas las duraciones, y pedidos de 2 y 3 mascotas, con los precios viejos inyectados. Verificado con mutaciones que los tests fallan ante cambios.
- **Bug del calcio**: la versión vieja leía `commercialFoodPercentage`, un estado global que nunca cambiaba (siempre 40). Ahora depende de la dieta de cada mascota (`COMMERCIAL_SHARE`). El resultado es idéntico (1 pote solo en dieta cruda/cocida), así que no cambia ningún pedido.
- Precios en 0: `orderPrice(...).complete === false` y el mensaje dice `*PRECIO TOTAL: a consultar*` sin líneas en ARS. Con precios cargados el formato es el viejo.
- Rarezas que se mantienen a propósito (consultar antes de cambiar): el nivel de actividad no afecta la ración; caldo y cúrcuma siempre calculan potes para 30 días y calcio es 1 pote aunque la duración sea 1 semana o 45 días; `customDays` se usa tal cual en el texto ("45 días").
- `config/breeds.ts` copiado (`breedsBySpecies`). Vitest 5 (`pnpm test`, config en `vitest.config.mts`).

### Para la Fase 4
- El wizard guarda strings en los inputs y convierte a `Pet` (peso con `parseFloat`) al usar la lógica.
- Al elegir dieta (paso 10 viejo): agregar `calcio` si `calcioIncluded(pet)` y quitarlo si no (ver `afterDietStep` en `golden.test.ts`).

### Fase 4 (2026-10-22)
- `/calcula-racion` → `features/ration-wizard/Wizard.tsx` (cliente). Estado con `useReducer` en `state.ts` (`WizardState`, `PetDraft`, acciones `setMultiple | addPet | removePet | updatePet | set | goTo | hydrate | reset`, `toPet`, `parseWeight`, `sanitizeName`). Tests en `wizard.test.ts`.
- Pasos en `steps/index.ts` (array de `StepDef`: `id`, `visible?`, `complete`, `Component`), un componente por paso en `steps/`: `count`, `pets` (solo con varias mascotas), `species`, `gender`, `name`, `breed`, `age` (edad + esterilizado), `weight`, `body`, (el placeholder `pending` ya se borró en la fase 5). `navigation.ts` calcula pasos visibles, anterior/siguiente y `firstReachableStep`.
- Varias mascotas: cada paso muestra una pregunta por mascota (`PetStack`), "Continuar" se habilita cuando todas respondieron.
- UI: `ui/ChoiceCards` (tarjetas con imagen, radios nativos), `ui/ChoicePills` (opciones de texto), `ui/BreedSelect` (Radix Select), `ui/Question` (`QuestionGroup` con fieldset/legend flotado, `QuestionField` con label), `ui/Progress` ("Paso N de T" + barra + nombres). `components/ui/PhotoBanner`.
- Transición: salida 260ms (fade + 40px hacia atrás) y entrada `animate-step-in` desde el lado de avance; sin animación con reduced-motion. Al cambiar de paso se enfoca el paso y se hace scroll si el wizard quedó arriba. Enter en un input = Continuar.
- Progreso en `sessionStorage` (`kalak:ration-wizard:v1`); al restaurar vuelve al primer paso incompleto. "Empezar de nuevo" borra todo.
- Razas: `config/breeds.ts` ahora tiene la lista que mostraba de verdad el selector viejo (`components/shared/breed-selector.tsx`: 62 perros, 12 gatos); la de `Kalak/src/config/breeds.ts` no se usaba.
- Cambios menores respecto a la web vieja: el nombre ya no se fuerza a mayúsculas (el mensaje igual lo pasa a mayúsculas); el peso acepta coma y valida 0,1–60 kg (antes "0" pasaba); con una sola mascota no se antepone "Mascota 1:" a las preguntas; con varias se antepone también en el paso del nombre; el paso de especie usa las imágenes `pet-normal`/`cat-normal`.

### Para la Fase 5
- Agregar en `steps/` los pasos `activity` (imágenes `pet-activity-*`/`cat-activity-*`, textos ya en el mockup), `duration`, `diet` (al continuar, aplicar `calcioIncluded`), `supplements`, `contact`, resumen y "¿ya pediste antes?". Los campos ya existen en `WizardState` (`duration`, `customDays`, `customerName`, `customerPhone`, `orderedBefore`) y en `PetDraft` (`activity`, `diet`, `supplements`).
- Envío: `whatsappUrl(orderMessage({ pets: state.pets.map(toPet), duration, customDays, customer }))`.

### Fase 5 (2026-10-22)
- Pasos nuevos: `activity`, `duration` (1 semana / 1 quincena / 1 mes / Personalizado 1–90 días), `diet` (tarjetas de texto: las imágenes `diet-*.webp` de la web vieja no existían), `supplements` (checkboxes; calcio bloqueado: marcado en dieta cruda/cocida, deshabilitado con comercial), `contact` (nombre + teléfono, mínimo 6 dígitos), `summary`. Total: 14 pasos (15 con varias mascotas).
- El calcio se ajusta en el reducer al elegir la dieta (`updatePet` con `diet`), igual que el paso 10 viejo.
- Resumen: tarjeta por mascota (g/día, bolsas, suplementos), "Detalle del pedido" con totales y precio (o "Consultar"/"A consultar" mientras los precios estén en 0) y botón "Hacer pedido" = link `wa.me` (`target=_blank`, sin `window.open`). "Editar datos de contacto" vuelve al paso de contacto.
- `flow.test.ts`: recorre el wizard completo con 1 y 2 mascotas y compara la URL `wa.me` con la de la web vieja.
- Un paso guardado que ya no existe retoma en el primer paso incompleto.
- **No migrado**: el paso viejo "¿Ha realizado un pedido antes?" (paso 14) era inalcanzable (ningún botón llevaba ahí). Si se quiere, agregarlo como primer paso.
- Corregido respecto a la web vieja: el resumen viejo usaba 14 días para la quincena y el mensaje 15; ahora ambos usan 15.

### Fase 6 (2026-10-22)
- `src/content/home.ts` con todos los textos literales de la Home vieja (hero, statement, 4 beneficios, 7 ingredientes, 5 FAQ completas, CTA). Texto enriquecido con `content/rich.ts` (`Inline`: string | `{b}` | `{accent}`; `Block`: `{p}` | `{ul}` | `{ol}`) y `components/ui/RichText.tsx`.
- Fotos por nombre desde `lib/images.ts` (imports estáticos → `width/height` y blur automáticos). Agregar ahí las fotos nuevas.
- Secciones en `components/home/`: `Hero` (art direction con `getImageProps` + `<picture>`: `background` desktop / `fondoOlga1` móvil; `fetchPriority=high`), `Statement`, `Benefits` (bento), `Ingredients` (carrusel scroll-snap + `CarouselArrows` cliente), `Faq` (foto sticky + `components/ui/Accordion` Radix con animación por `grid-template-rows`), `FinalCta`.
- Header transparente sobre el hero (`OVERLAY_ROUTES = ["/"]`).
- Cambio de jerarquía: el H1 ahora es "Comida real para mascotas" (antes era H2 y el H1 era el subtítulo). Mismos textos.
