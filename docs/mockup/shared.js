// Shared behaviour for mockups B and C (A keeps its inline script).
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function show(view) {
  $$("[data-view]").forEach(v => v.classList.toggle("on", v.dataset.view === view));
  $$("[data-link]").forEach(a => a.classList.toggle("on", a.dataset.link === view));
  document.body.classList.remove("menu-open");
  window.scrollTo({top: 0, behavior: "instant"});
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}
addEventListener("hashchange", () => show(location.hash.slice(1) || "home"));

const header = $("#header");
addEventListener("scroll", () => header?.classList.toggle("compact", scrollY > 24), {passive: true});

$("#menuBtn")?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  $("#menuBtn").setAttribute("aria-expanded", open);
});

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), {rootMargin: "0px 0px -10% 0px"});

$$(".acc-item button").forEach(btn => btn.addEventListener("click", () => {
  const item = btn.parentElement, wasOpen = item.classList.contains("open");
  $$(".acc-item").forEach(i => { i.classList.remove("open"); $("button", i).setAttribute("aria-expanded", "false"); });
  if (!wasOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
}));

// Calculator: two real steps from the current site
const steps = [
  {n: 8, title: "¿Cuál es la condición corporal de Olga?", hint: "Selecciona la imagen que más se parezca a tu mascota", options: [
    {img: "pet-thin", label: "Delgado", desc: "Se notan las costillas y tiene poca grasa corporal"},
    {img: "pet-normal", label: "Normal", desc: "Peso ideal, costillas palpables con ligera capa de grasa"},
    {img: "pet-overweight", label: "Sobrepeso", desc: "Exceso de grasa corporal, costillas difíciles de palpar"}]},
  {n: 9, title: "¿Cuál es el nivel de actividad de Olga?", hint: "Selecciona la opción que mejor describa la actividad de tu mascota", options: [
    {img: "pet-activity-low", label: "Baja", desc: "Paseos cortos, poca actividad física"},
    {img: "pet-activity-medium", label: "Normal", desc: "Paseos regulares, actividad moderada"},
    {img: "pet-activity-high", label: "Alta", desc: "Ejercicio intenso, mucha actividad física"}]},
];
const answers = {};
let current = 0;
const stepEl = $("#step"), next = $("#next");
const check = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

function render() {
  if (current >= steps.length) {
    stepEl.innerHTML = `<div class="done"><span class="eyebrow">Fin del mockup</span><h2>Así se siente avanzar entre pasos</h2><p class="muted">En la versión real siguen dieta, suplementos, duración y el envío por WhatsApp.</p></div>`;
    next.disabled = true;
    $("#fill").style.width = "100%";
    return;
  }
  const s = steps[current];
  $("#stepLabel").textContent = `Paso ${s.n} de 14`;
  $("#fill").style.width = `${(s.n / 14) * 100}%`;
  stepEl.innerHTML = `<h2>${s.title}</h2><p class="hint">${s.hint}</p>
    <div class="options" role="radiogroup" aria-label="${s.title}">
      ${s.options.map((o, i) => `<button class="opt" role="radio" aria-checked="${answers[current] === i}" data-i="${i}">
        <span class="check">${check}</span>
        <div class="img"><img src="img/${o.img}.webp" alt=""></div>
        <div class="txt"><b>${o.label}</b><span>${o.desc}</span></div></button>`).join("")}
    </div>`;
  next.disabled = answers[current] === undefined;
  $$(".opt", stepEl).forEach(btn => btn.addEventListener("click", () => {
    answers[current] = +btn.dataset.i;
    $$(".opt", stepEl).forEach(b => b.setAttribute("aria-checked", b === btn));
    next.disabled = false;
  }));
}

function go(dir) {
  const target = current + dir;
  if (target < 0 || target > steps.length) return;
  stepEl.style.setProperty("--dir", dir);
  stepEl.classList.add("leave");
  setTimeout(() => {
    current = target;
    render();
    stepEl.classList.remove("leave");
    stepEl.classList.add("enter");
    requestAnimationFrame(() => requestAnimationFrame(() => stepEl.classList.remove("enter")));
  }, 260);
}
next?.addEventListener("click", () => go(1));
$("#back")?.addEventListener("click", () => go(-1));

if (stepEl) render();
show(location.hash.slice(1) || "home");
