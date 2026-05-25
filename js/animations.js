/* ============================================
   LINDJAN — js/animations.js
   Animacions d'entrada amb IntersectionObserver
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     CSS d'animació injectat dinàmicament
     (pots moure-ho a un .css si prefereixes)
  ───────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `

    /* ── ESTATS INICIALS (elements ocults) ── */
    .anim-fade-up,
    .anim-fade-left,
    .anim-fade-right,
    .anim-scale-in,
    .anim-clip-up {
      will-change: transform, opacity;
    }

    .anim-fade-up    { opacity: 0; transform: translateY(48px); }
    .anim-fade-left  { opacity: 0; transform: translateX(-48px); }
    .anim-fade-right { opacity: 0; transform: translateX(48px); }
    .anim-scale-in   { opacity: 0; transform: scale(0.88); }
    .anim-clip-up    { opacity: 0; transform: translateY(32px) scaleY(0.96); transform-origin: bottom; }

    /* ── ESTAT VISIBLE ── */
    .anim-visible {
      opacity: 1 !important;
      transform: none !important;
    }

    /* ── TRANSICIONS PER TIPUS ── */
    .anim-fade-up.anim-visible,
    .anim-fade-up    { transition: opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1),
                                   transform 0.72s cubic-bezier(0.22, 1, 0.36, 1); }

    .anim-fade-left.anim-visible,
    .anim-fade-left  { transition: opacity 0.68s cubic-bezier(0.22, 1, 0.36, 1),
                                   transform 0.68s cubic-bezier(0.22, 1, 0.36, 1); }

    .anim-fade-right.anim-visible,
    .anim-fade-right { transition: opacity 0.68s cubic-bezier(0.22, 1, 0.36, 1),
                                   transform 0.68s cubic-bezier(0.22, 1, 0.36, 1); }

    .anim-scale-in.anim-visible,
    .anim-scale-in   { transition: opacity 0.65s cubic-bezier(0.34, 1.56, 0.64, 1),
                                   transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1); }

    .anim-clip-up.anim-visible,
    .anim-clip-up    { transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                                   transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }

    /* ── STAGGER: retard per fills ── */
    .anim-stagger > * { opacity: 0; transform: translateY(40px);
                        transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                                    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    .anim-stagger.anim-visible > *:nth-child(1)  { opacity:1; transform:none; transition-delay:0ms; }
    .anim-stagger.anim-visible > *:nth-child(2)  { opacity:1; transform:none; transition-delay:90ms; }
    .anim-stagger.anim-visible > *:nth-child(3)  { opacity:1; transform:none; transition-delay:180ms; }
    .anim-stagger.anim-visible > *:nth-child(4)  { opacity:1; transform:none; transition-delay:270ms; }
    .anim-stagger.anim-visible > *:nth-child(5)  { opacity:1; transform:none; transition-delay:360ms; }
    .anim-stagger.anim-visible > *:nth-child(6)  { opacity:1; transform:none; transition-delay:450ms; }

    /* ── DELAY HELPERS ── */
    .anim-d1 { transition-delay:  80ms !important; }
    .anim-d2 { transition-delay: 160ms !important; }
    .anim-d3 { transition-delay: 240ms !important; }
    .anim-d4 { transition-delay: 320ms !important; }
    .anim-d5 { transition-delay: 400ms !important; }

    /* ── NÚMERO DE SECCIÓ: comptador ── */
    .section-number { transition: color 1.2s ease, opacity 0.8s ease; }

    /* ── WEB-FRAME: puja suaument ── */
    .web-frame {
      opacity: 0;
      transform: translateY(60px);
      transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .web-frame.anim-visible {
      opacity: 1;
      transform: translateY(-10rem); /* manté el desplaçament original del CSS */
    }

    /* ── VEHICLE-MAIN: zoom-in suau ── */
    .vehicle-main {
      opacity: 0;
      transform: scale(0.97) translateY(20px);
      transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .vehicle-main.anim-visible {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    /* ── SOCIAL-POST: scale amb color ── */
    .social-post {
      opacity: 0;
      transform: scale(0.92);
      transition: opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                  transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .social-post.anim-visible {
      opacity: 1;
      transform: scale(1);
    }

    /* ── LOGO-VARIANT: slide up + fade ── */
    .logo-variant {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .logo-variant.anim-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── COMP-COL: slide des de cada costat ── */
    .comp-col:first-child  { opacity: 0; transform: translateX(-40px);
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.65s cubic-bezier(0.22, 1, 0.36, 1); }
    .comp-col:last-child   { opacity: 0; transform: translateX(40px);
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.65s cubic-bezier(0.22, 1, 0.36, 1); }
    .comp-col.anim-visible { opacity: 1; transform: translateX(0); }

    /* ── PILLAR: fade-up en cadena ── */
    .pillar {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .pillar.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── TYPE-COL ── */
    .type-col {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .type-col.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── MATERIAL-CARD ── */
    .material-card {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .material-card.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── IMPACT-COL ── */
    .impact-col {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .impact-col.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── SECTION-HEADER: el número apareix amb color ── */
    .section-header {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .section-header.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── HEADLINE-LG: lletres pugen ── */
    .headline-lg {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .headline-lg.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── BODY-LG ── */
    .body-lg {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .body-lg.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── CHALLENGE-QUOTE ── */
    .challenge-quote {
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                  border-left-color 0.5s ease;
    }
    .challenge-quote.anim-visible { opacity: 1; transform: translateX(0); }

    /* ── MOCKUP-ITEM ── */
    .mockup-item {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .mockup-item.anim-visible { opacity: 1; transform: translateY(0); }

    /* ── FINAL CTA ── */
    .final-title {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .final-title.anim-visible { opacity: 1; transform: translateY(0); }

  `;
  document.head.appendChild(style);


  /* ─────────────────────────────────────────
     FUNCIÓ GENÈRICA: observa un selector,
     quan entra al viewport afegeix .anim-visible
     amb un delay optatiu per cada element.
  ───────────────────────────────────────── */
  function observe(selector, { delay = 0, staggerMs = 0, threshold = 0.15 } = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = Array.from(document.querySelectorAll(selector)).indexOf(el);
        const d = delay + (staggerMs ? idx * staggerMs : 0);
        setTimeout(() => el.classList.add('anim-visible'), d);
        io.unobserve(el);
      });
    }, { threshold });

    els.forEach(el => io.observe(el));
  }

  /* ─────────────────────────────────────────
     STAGGER DE FILLS: observa el pare,
     quan entra activa els fills en cadena.
  ───────────────────────────────────────── */
  function observeParentStagger(parentSelector, childSelector, { baseDelay = 0, staggerMs = 100, threshold = 0.15 } = {}) {
    const parents = document.querySelectorAll(parentSelector);
    if (!parents.length) return;

    parents.forEach(function (parent) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const children = parent.querySelectorAll(childSelector);
          children.forEach(function (child, i) {
            setTimeout(() => child.classList.add('anim-visible'), baseDelay + i * staggerMs);
          });
          io.unobserve(parent);
        });
      }, { threshold });

      io.observe(parent);
    });
  }


  /* ─────────────────────────────────────────
     ASSIGNACIÓ D'ANIMACIONS
  ───────────────────────────────────────── */

  // Section headers (número + títol)
  observe('.section-header', { threshold: 0.2 });

  // Titulars
  observe('.headline-lg', { delay: 80, threshold: 0.2 });

  // Cossos de text
  observe('.body-lg', { delay: 140, threshold: 0.15 });

  // Quote
  observe('.challenge-quote', { delay: 200 });

  // Comparativa: cols simultànies (s'activen per IO propi)
  observe('.comp-col:first-child', { delay: 0 });
  observe('.comp-col:last-child',  { delay: 100 });

  // Pillars: stagger
  observeParentStagger('.strategy-pillars', '.pillar', { staggerMs: 120 });

  // Logo variants: stagger
  observeParentStagger('.logo-showcase', '.logo-variant', { staggerMs: 140 });

  // Type cols: stagger
  observeParentStagger('.type-showcase', '.type-col', { staggerMs: 150 });

  // Social posts: stagger ràpid
  observeParentStagger('.social-grid', '.social-post', { staggerMs: 80 });

  // Material cards: stagger
  observeParentStagger('.materials-grid', '.material-card', { staggerMs: 100 });

  // Impact cols
  observeParentStagger('.impact-split', '.impact-col', { staggerMs: 150 });

  // Vehicle main
  observe('.vehicle-main', { threshold: 0.1 });

  // Web frame
  observe('.web-frame', { threshold: 0.1 });

  // Mockup items: stagger per grid
  observeParentStagger('.mockup-grid-2', '.mockup-item', { staggerMs: 110 });
  observeParentStagger('.mockup-grid-3', '.mockup-item', { staggerMs: 100 });

  // Final CTA
  observe('.final-title', { delay: 0, threshold: 0.3 });

});