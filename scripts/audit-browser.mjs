/**
 * Repeatable local production audit; never sends a WhatsApp message.
 * Install tools outside the app: npm install --prefix /tmp/kalak-audit playwright @axe-core/playwright
 * Run: KALAK_AUDIT_TOOLS=/tmp/kalak-audit CHROME_PATH=/path/to/chrome node scripts/audit-browser.mjs
 * Set AUDIT_BASE_URL to override http://localhost:4402. Start a fresh production server after building.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(resolve(process.env.KALAK_AUDIT_TOOLS ?? ".", "package.json"));
const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const base = process.env.AUDIT_BASE_URL ?? "http://localhost:4402";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH });
const report = { routes: [], wizard: [], quickOrder: {}, contact: false, menu: {}, resilience: {}, styles: {}, accessibilityChecks: 0 };
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function checkAccessibility(page, label) {
  report.accessibilityChecks++;
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  assert.deepEqual(violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((n) => n.failureSummary) })), [], label);
}

async function newPage(width = 390, reducedMotion = "reduce") {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion });
  // Capture every external-app request before hydration; no real popup/message can be sent.
  await context.addInitScript(() => {
    window.__auditWhatsAppURLs = [];
    window.open = (url) => { window.__auditWhatsAppURLs.push(String(url)); return null; };
  });
  return { context, page: await context.newPage() };
}

async function capturedOrderURL(page, button) {
  assert.equal(await button.evaluate((node) => node.tagName), "BUTTON");
  assert.equal(await button.getAttribute("href"), null);
  assert.equal(await button.isEnabled(), true);
  await page.evaluate(() => { window.__auditWhatsAppURLs = []; });
  await button.click();
  const destinations = await page.evaluate(() => window.__auditWhatsAppURLs);
  assert.equal(destinations.length, 1, "exactly one captured destination");
  const url = new URL(destinations[0]);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/542615038820");
  return url;
}

async function assertDisabledOrder(page, button) {
  assert.equal(await button.evaluate((node) => node.tagName), "BUTTON");
  assert.equal(await button.getAttribute("href"), null);
  assert.equal(await button.isDisabled(), true);
  await page.evaluate(() => { window.__auditWhatsAppURLs = []; });
  await button.evaluate((node) => node.click());
  assert.deepEqual(await page.evaluate(() => window.__auditWhatsAppURLs), []);
}

async function waitForCheck(check, label) {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await check()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  assert.fail(label);
}

async function scrollLocked(page) {
  return page.evaluate(() => [document.body, document.documentElement].some((node) =>
    ["hidden", "clip"].includes(getComputedStyle(node).overflowY)));
}

try {
  {
    const { context, page } = await newPage();
    for (const route of ["/", "/calcula-racion", "/hacer-pedido", "/contacto", "/dieta-kalak", "/perros", "/gatos", "/suplementos", "/mini-cursos", "/transicion"]) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.locator("h1").waitFor();
      assert.equal(await page.locator("h1").count(), 1, route);
      assert(await page.title(), route);
      assert(await page.locator('meta[name="description"]').getAttribute("content"), route);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
      await checkAccessibility(page, route);
      report.routes.push({ route, status: 200, mobileOverflow: false, axeViolations: 0 });
    }
    await context.close();
  }

  for (const count of [1, 2]) {
    const { context, page } = await newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "/calcula-racion");
    const main = page.locator("main");
    const next = async () => {
      await checkAccessibility(page, `${count} pets: ${await main.locator('fieldset legend, h2, label[for]').first().innerText()}`);
      await main.getByRole("button", { name: "Continuar" }).click();
    };
    const choose = (value, index = 0) => main.locator("label")
      .filter({ has: page.locator(`input[value=${JSON.stringify(value)}]`) }).nth(index).click();

    assert(await main.getByRole("button", { name: "Continuar" }).isDisabled());
    await choose(count === 1 ? "one" : "many");
    await next();
    if (count === 2) {
      const addPet = main.getByRole("button", { name: /Agregar otra mascota/ });
      const addStyle = await addPet.evaluate((node) => {
        const style = getComputedStyle(node);
        return { color: style.color, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight };
      });
      assert.deepEqual(addStyle, { color: "rgb(47, 122, 58)", paddingLeft: "0px", paddingRight: "0px" });
      report.styles.successTextButton = addStyle;
      await addPet.click();
      assert.equal(await main.getByRole("button", { name: /Quitar/ }).count(), 2);
      await next();
    }
    await choose("dog");
    if (count === 2) await choose("cat", 1);
    await next();
    for (let i = 0; i < count; i++) await choose("female", i);
    await next();
    for (let i = 0; i < count; i++) await main.locator('input[id^="name-"]').nth(i).fill(i === 0 ? "Olga" : "Tini");
    await next();
    for (let i = 0; i < count; i++) {
      await main.getByRole("combobox").nth(i).click();
      await page.getByRole("option").first().click();
    }
    await next();
    for (let i = 0; i < count; i++) {
      await choose("1-6 años", i);
      await main.locator('input[name^="sterilized-"][value="yes"]').nth(i).locator("..").click();
    }
    await next();
    for (let i = 0; i < count; i++) await main.locator('input[id^="weight-"]').nth(i).fill(i === 0 ? "20" : "4");
    await next();
    for (let i = 0; i < count; i++) await choose("normal", i);
    await next();
    for (let i = 0; i < count; i++) await choose("normal", i);
    await next();
    await choose("1_month");
    await next();
    for (let i = 0; i < count; i++) await choose("raw", i);
    await next();
    await next();
    await main.getByLabel(/^Nombre completo/).fill("Prueba Kalak");
    const phone = main.getByLabel(/^Teléfono de contacto/);
    await phone.fill("12345");
    assert.equal(await phone.getAttribute("aria-invalid"), "true");
    assert.equal(await main.getByText(/El teléfono debe tener al menos 6 dígitos/).isVisible(), true);
    assert.equal(await main.getByRole("button", { name: "Continuar" }).isDisabled(), true);
    await phone.fill("123456");
    assert.equal(await phone.getAttribute("aria-invalid"), null);
    assert.equal(await main.getByRole("button", { name: "Continuar" }).isEnabled(), true);
    await phone.fill("2615555555");
    await next();

    const send = main.getByRole("button", { name: "Hacer pedido", exact: true });
    const url = await capturedOrderURL(page, send);
    const message = url.searchParams.get("text");
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/542615038820");
    for (const text of ["OLGA", "Prueba Kalak", "600 g/día", "Fórmula perros: 18 bolsa(s)", "a consultar"]) assert(message.includes(text), text);
    if (count === 2) for (const text of ["TINI", "120 g/día", "Fórmula gatos: 4 bolsa(s)"]) assert(message.includes(text), text);
    assert(!/undefined|NaN/.test(message));
    assert((await main.innerText()).includes("A consultar"));
    await checkAccessibility(page, `${count} pets summary`);
    await page.reload();
    await send.waitFor();
    assert.equal((await capturedOrderURL(page, send)).href, url.href);

    if (count === 1) {
      // Revisit real completed answers instead of seeding internal storage.
      const back = () => main.getByRole("button", { name: /← Volver/ }).click();
      await back(); // Contact
      await back(); // Supplements
      await back(); // Diet
      await choose("supplements");
      await next();
      await next();
      await next();
      await assertDisabledOrder(page, send);
      assert.equal(await main.getByText(/Tu selección no incluye productos para pedir/).isVisible(), true);
      await back();
      await back();
      const caldo = main.getByRole("checkbox", { name: /^Caldo/ });
      await main.locator("label").filter({ has: page.getByRole("checkbox", { name: /^Caldo/ }) }).click();
      assert.equal(await caldo.isChecked(), true);
      await next();
      await next();
      const supplementsURL = await capturedOrderURL(page, send);
      assert(supplementsURL.searchParams.get("text").includes("Caldo"));
      assert(!supplementsURL.searchParams.get("text").includes("Fórmula perros:"));
    }
    assert.deepEqual(errors, []);
    report.wizard.push({ pets: count, dogGramsPerDay: 600, ...(count === 2 ? { catGramsPerDay: 120 } : {}), messageVerified: true, nativeOrderButton: true, phoneFiveRejectedSixAccepted: true, ...(count === 1 ? { emptySupplementsOrderDisabled: true, realSupplementsReenable: true } : {}), reloadRestoresSummary: true, axeViolations: 0, runtimeErrors: 0 });
    await context.close();
  }

  const { context: formsContext, page } = await newPage();
  await page.goto(base + "/hacer-pedido");
  let main = page.locator("main");
  await main.getByText("Sí, he pedido antes", { exact: true }).click();
  await main.getByRole("button", { name: "Continuar" }).click();
  const detailsGroup = main.getByRole("group", { name: "Detalles de tu pedido" });
  await waitForCheck(() => detailsGroup.evaluate((node) => node === document.activeElement), "details step must receive focus before fields");
  await page.keyboard.press("Tab");
  assert.equal(await main.getByLabel("Bolsas fórmula perros", { exact: true }).evaluate((node) => node === document.activeElement), true);
  const ghostStyle = await main.getByRole("button", { name: /← Volver/ }).evaluate((node) => {
    const style = getComputedStyle(node);
    return { color: style.color, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight };
  });
  assert.deepEqual(ghostStyle, { color: "rgb(98, 97, 86)", paddingLeft: "12px", paddingRight: "12px" });
  report.styles.ghostButton = ghostStyle;
  await main.getByLabel("Bolsas fórmula perros", { exact: true }).fill("3");
  await main.getByLabel("Caldo de colágeno", { exact: true }).fill("2");
  await main.getByRole("button", { name: "Continuar" }).click();
  const summaryGroup = main.getByRole("group", { name: "Resumen de tu pedido" });
  await waitForCheck(() => summaryGroup.evaluate((node) => node === document.activeElement), "summary step must receive focus before fields");
  await page.keyboard.press("Tab");
  const quickName = main.getByLabel("Nombre completo", { exact: true });
  assert.equal(await quickName.evaluate((node) => node === document.activeElement), true);
  const quickSend = main.getByRole("button", { name: "Hacer pedido", exact: true });
  await assertDisabledOrder(page, quickSend);
  await quickName.fill("   ");
  await assertDisabledOrder(page, quickSend);
  await quickName.fill("Pedido Prueba");
  const quickURL = await capturedOrderURL(page, quickSend);
  assert.equal(quickURL.origin, "https://wa.me");
  for (const text of ["Pedido Prueba", "3", "2"]) assert(quickURL.searchParams.get("text").includes(text));
  assert((await main.innerText()).includes("A consultar"));
  await checkAccessibility(page, "Quick order summary");
  report.quickOrder = { nativeOrderButton: true, emptyAndWhitespaceNameDisabled: true, stepFocusBeforeFields: true, tabEntersFields: true, messageVerified: true };

  await page.goto(base + "/contacto");
  main = page.locator("main");
  await main.getByLabel("Nombre completo", { exact: true }).fill("Contacto Prueba");
  await main.getByLabel("Email", { exact: true }).fill("prueba@example.com");
  await main.getByLabel("Teléfono (opcional)", { exact: true }).fill("2615555555");
  await main.getByLabel("Mensaje", { exact: true }).fill("Mensaje de prueba sin enviar");
  await page.evaluate(() => { window.__auditWhatsAppURLs = []; });
  await main.getByRole("button", { name: "Enviar Mensaje" }).click();
  const contactURL = new URL(await page.evaluate(() => window.__auditWhatsAppURLs[0]));
  assert.equal(contactURL.origin, "https://wa.me");
  assert(contactURL.searchParams.get("text").includes("Mensaje de prueba sin enviar"));
  report.contact = true;

  await page.goto(base + "/");
  const menuTrigger = page.getByRole("button", { name: "Abrir menú", exact: true });
  const dialog = page.getByRole("dialog", { name: "Menú de navegación" });
  await menuTrigger.click();
  await dialog.waitFor();
  await waitForCheck(() => scrollLocked(page), "open dialog must lock scrolling");
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
    assert(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')));
  }
  // Also traverse past both ends of the menu, not just alternate adjacent controls.
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')));
  }
  await checkAccessibility(page, "mobile menu dialog");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await waitForCheck(() => menuTrigger.evaluate((node) => node === document.activeElement), "Escape restores trigger focus");
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "false");
  await waitForCheck(async () => !(await scrollLocked(page)), "Escape restores scrolling");
  await menuTrigger.click();
  await dialog.getByRole("link", { name: "Perros", exact: true }).click();
  await page.waitForURL("**/perros");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "false");
  await waitForCheck(async () => !(await scrollLocked(page)), "navigation restores scrolling");
  await menuTrigger.click();
  await dialog.waitFor();
  await page.setViewportSize({ width: 1280, height: 844 });
  await dialog.waitFor({ state: "hidden" });
  await waitForCheck(async () => !(await scrollLocked(page)), "desktop resize restores scrolling");
  assert.equal(await menuTrigger.isVisible(), false);
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Abrir menú"), false, "desktop must not focus a hidden trigger");
  report.menu = { tabContainedInPortalDialog: true, escapeRestoresFocus: true, linkCloses: true, desktopResizeCloses: true, scrollRestored: true };

  await page.goto(base + "/dieta-kalak");
  const twoColumnGrid = page.getByRole("list").filter({ has: page.getByRole("heading", { name: "La Realidad", exact: true }) });
  const columns = await twoColumnGrid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  assert.equal(columns, 2, "two-column FeatureGrid at desktop");
  report.styles.featureGridDesktopColumns = columns;
  await formsContext.close();

  {
    const { context, page: failedHydrationPage } = await newPage(1280, "no-preference");
    let blockedChunks = 0;
    await failedHydrationPage.route("**/_next/static/**/*.js*", (route) => { blockedChunks++; return route.abort(); });
    const response = await failedHydrationPage.goto(base + "/dieta-kalak");
    assert.equal(response.status(), 200);
    assert.equal(await failedHydrationPage.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), false);
    const reveals = failedHydrationPage.locator("[data-reveal]");
    assert((await reveals.count()) > 0);
    const invisible = await reveals.evaluateAll((nodes) => nodes.filter((node) => {
      const style = getComputedStyle(node);
      return style.opacity !== "1" || style.visibility !== "visible" || style.display === "none" || node.hasAttribute("data-reveal-ready");
    }).map((node) => node.textContent?.slice(0, 80)));
    assert.deepEqual(invisible, [], "failed hydration leaves all SSR Reveal content visible");
    assert(blockedChunks > 0, "must actually block hydration chunks");
    report.resilience = { hydrationChunksBlocked: blockedChunks, normalMotionSSRRevealsVisible: await reveals.count() };
    await context.close();
  }

  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
