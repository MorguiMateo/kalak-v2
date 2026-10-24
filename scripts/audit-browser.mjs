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
const report = { routes: [], wizard: [], quickOrder: false, contact: false, menu: {} };
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function checkAccessibility(page, label) {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  assert.deepEqual(violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((n) => n.failureSummary) })), [], label);
}

async function newPage(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
  return { context, page: await context.newPage() };
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
      await main.getByRole("button", { name: /Agregar otra mascota/ }).click();
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
    await main.getByLabel("Nombre completo", { exact: true }).fill("Prueba Kalak");
    await main.getByLabel("Teléfono de contacto", { exact: true }).fill("2615555555");
    await next();

    const link = main.getByRole("link", { name: "Hacer pedido", exact: true });
    const href = await link.getAttribute("href");
    const url = new URL(href);
    const message = url.searchParams.get("text");
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/542615038820");
    for (const text of ["OLGA", "Prueba Kalak", "600 g/día", "Fórmula perros: 18 bolsa(s)", "a consultar"]) assert(message.includes(text), text);
    if (count === 2) for (const text of ["TINI", "120 g/día", "Fórmula gatos: 4 bolsa(s)"]) assert(message.includes(text), text);
    assert(!/undefined|NaN/.test(message));
    assert((await main.innerText()).includes("A consultar"));
    await checkAccessibility(page, `${count} pets summary`);
    await page.reload();
    await link.waitFor();
    assert.equal(await link.getAttribute("href"), href);
    assert.deepEqual(errors, []);
    report.wizard.push({ pets: count, dogGramsPerDay: 600, ...(count === 2 ? { catGramsPerDay: 120 } : {}), messageVerified: true, reloadRestoresSummary: true, axeViolations: 0, runtimeErrors: 0 });
    await context.close();
  }

  const { context: formsContext, page } = await newPage();
  await page.goto(base + "/hacer-pedido");
  let main = page.locator("main");
  await main.getByText("Sí, he pedido antes", { exact: true }).click();
  await main.getByRole("button", { name: "Continuar" }).click();
  await main.getByLabel("Bolsas fórmula perros", { exact: true }).fill("3");
  await main.getByLabel("Caldo de colágeno", { exact: true }).fill("2");
  await main.getByRole("button", { name: "Continuar" }).click();
  await main.getByLabel("Nombre completo", { exact: true }).fill("Pedido Prueba");
  const quickURL = new URL(await main.getByRole("link", { name: "Hacer pedido", exact: true }).getAttribute("href"));
  assert.equal(quickURL.origin, "https://wa.me");
  for (const text of ["Pedido Prueba", "3", "2"]) assert(quickURL.searchParams.get("text").includes(text));
  assert((await main.innerText()).includes("A consultar"));
  await checkAccessibility(page, "Quick order summary");
  report.quickOrder = true;

  await page.goto(base + "/contacto");
  main = page.locator("main");
  await main.getByLabel("Nombre completo", { exact: true }).fill("Contacto Prueba");
  await main.getByLabel("Email", { exact: true }).fill("prueba@example.com");
  await main.getByLabel("Teléfono (opcional)", { exact: true }).fill("2615555555");
  await main.getByLabel("Mensaje", { exact: true }).fill("Mensaje de prueba sin enviar");
  // Capture the generated destination instead of opening an external app or sending anything.
  await page.evaluate(() => { window.open = (url) => { window.__auditWhatsAppURL = String(url); return null; }; });
  await main.getByRole("button", { name: "Enviar Mensaje" }).click();
  const contactURL = new URL(await page.evaluate(() => window.__auditWhatsAppURL));
  assert.equal(contactURL.origin, "https://wa.me");
  assert(contactURL.searchParams.get("text").includes("Mensaje de prueba sin enviar"));
  report.contact = true;

  await page.goto(base + "/");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.style.overflow), "hidden");
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => !!document.activeElement.closest("header")));
  }
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Abrir menú", exact: true }).getAttribute("aria-expanded"), "false");
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Abrir menú");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: "Perros", exact: true }).click();
  await page.waitForURL("**/perros");
  assert.equal(await page.getByRole("button", { name: "Abrir menú", exact: true }).getAttribute("aria-expanded"), "false");
  assert.equal(await page.evaluate(() => document.documentElement.style.overflow), "");
  report.menu = { tabContained: true, escapeRestoresFocus: true, linkCloses: true, scrollRestored: true };
  await formsContext.close();

  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
