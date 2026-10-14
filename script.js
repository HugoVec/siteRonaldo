/*
  Souza Júnior Advocacia: comportamento do site.
  Os dados (número, e-mail, mensagens) vêm de config.js.
*/
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("config.js não foi carregado: os links do WhatsApp usam o endereço padrão do HTML.");
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- WhatsApp: uma função só para todos os botões ---------- */
  function waLink(key) {
    const base = "https://wa.me/" + cfg.whatsapp.number;
    const message = cfg.messages[key];
    // encodeURIComponent cuida de acentos, espaços e pontuação. A mensagem NÃO é enviada sozinha:
    // ela só aparece escrita na conversa para a pessoa revisar e apertar enviar.
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  $$("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    const hint = document.createElement("span");
    hint.className = "sr-only";
    hint.textContent = " (abre o WhatsApp em uma nova aba)";
    el.appendChild(hint);
  });

  /* ---------- Outros links vindos da configuração ---------- */
  const links = {
    email: "mailto:" + cfg.email,
    maps: cfg.mapsUrl,
    "instagram-office": cfg.instagram.office,
    "instagram-lawyer": cfg.instagram.lawyer,
  };
  $$("[data-link]").forEach((el) => {
    const href = links[el.dataset.link];
    if (href) el.href = href;
  });

  /* ---------- Ano do rodapé ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Cabeçalho + menu mobile ---------- */
  const header = $("#header");
  const toggle = $(".menu-toggle");
  const nav = $("#menu");
  const desktopQuery = window.matchMedia("(min-width: 900px)");

  const isMenuOpen = () => !!toggle && toggle.getAttribute("aria-expanded") === "true";

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    updateFloat();
  }

  // A página de política de privacidade tem cabeçalho simples, sem menu.
  if (header && toggle && nav) {
    toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (isMenuOpen() && !header.contains(e.target)) setMenu(false);
    });
    desktopQuery.addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Link ativo no menu conforme a seção na tela ---------- */
  if ("IntersectionObserver" in window) {
    const navLinks = $$(".nav__list a");
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.removeAttribute("aria-current"));
          const link = byId.get(entry.target.id);
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- FAQ (accordion) ---------- */
  $$("[data-accordion]").forEach((acc) => {
    const buttons = $$(".accordion__btn", acc);

    function setOpen(btn, open) {
      btn.setAttribute("aria-expanded", String(open));
      document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
    }

    // Sem JavaScript tudo fica aberto (conteúdo acessível); aqui fechamos todos.
    buttons.forEach((btn) => setOpen(btn, false));

    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => setOpen(btn, btn.getAttribute("aria-expanded") !== "true"));
      // Setas, Home e End movem o foco entre as perguntas.
      btn.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowDown") next = buttons[(i + 1) % buttons.length];
        else if (e.key === "ArrowUp") next = buttons[(i - 1 + buttons.length) % buttons.length];
        else if (e.key === "Home") next = buttons[0];
        else if (e.key === "End") next = buttons[buttons.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  });

  /* ---------- Carrossel de fotos do escritório ---------- */
  $$("[data-carousel]").forEach((root) => {
    const track = $(".carousel__track", root);
    const prev = $("[data-carousel-prev]", root);
    const next = $("[data-carousel-next]", root);
    const count = $("[data-carousel-count]", root);
    const total = $$(".carousel__slide", root).length;

    const current = () => Math.round(track.scrollLeft / track.clientWidth);
    function update() {
      const i = Math.min(Math.max(current(), 0), total - 1);
      count.textContent = i + 1 + " / " + total;
      prev.disabled = i === 0;
      next.disabled = i === total - 1;
    }
    function go(step) {
      track.scrollBy({ left: step * track.clientWidth });
    }
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Botão flutuante do WhatsApp (celular) ---------- */
  const float = $(".wa-float");
  const hideZones = $$("#contato, #cta-final, .footer");
  const visibleZones = new Set();

  function updateFloat() {
    if (!float) return;
    const show = window.scrollY > window.innerHeight * 0.6 && visibleZones.size === 0 && !isMenuOpen();
    float.classList.toggle("is-visible", show);
  }
  if ("IntersectionObserver" in window) {
    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visibleZones.add(e.target) : visibleZones.delete(e.target)));
      updateFloat();
    });
    hideZones.forEach((z) => zoneObserver.observe(z));
  }
  window.addEventListener("scroll", updateFloat, { passive: true });
  updateFloat();

  /* ---------- Entrada suave dos blocos ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("reveal-ready");
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => revealer.observe(el));
  }
})();
