/* ============================================
   LINDJAN — js/video.js
   Control del vídeo hero: autoplay, so, scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const heroVideo    = document.querySelector('.hero-video');
  const playBtn      = document.querySelector('.hero-play-btn');
  const restartBtn   = document.querySelector('.hero-restart-btn');
  const soundOverlay = document.getElementById('soundOverlay');
  const heroSection  = document.querySelector('.hero');

  if (!heroVideo) return;

  const SVG_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l15-9L5 3z"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

  function updateIcon() {
    if (playBtn) playBtn.innerHTML = heroVideo.paused ? SVG_PLAY : SVG_PAUSE;
  }

  function enableSound() {
    heroVideo.muted = false;
    heroVideo.play().catch(function () { heroVideo.muted = true; });
    if (soundOverlay) soundOverlay.classList.add('hidden');
    updateIcon();
  }

  /* ── Autoplay en silenci (sempre funciona) ── */
  heroVideo.muted = true;
  heroVideo.play().then(updateIcon).catch(updateIcon);

  /* ── Para/reprèn quan la secció entra o surt del viewport ── */
  if (heroSection) {
    const visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          heroVideo.play().catch(function () {}).finally(updateIcon);
        } else {
          heroVideo.pause();
          heroVideo.muted = true;
          if (soundOverlay) soundOverlay.classList.remove('hidden');
          updateIcon();
        }
      });
    }, { threshold: 0.15 });

    visibilityObserver.observe(heroSection);
  }

  /* ── Overlay de so: clic activa l'àudio ── */
  if (soundOverlay) {
    soundOverlay.addEventListener('click', enableSound);
  }

  /* ── Botó play / pausa ── */
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (heroVideo.paused) {
        heroVideo.muted = false;
        heroVideo.play()
          .catch(function () { heroVideo.muted = true; })
          .finally(updateIcon);
        if (soundOverlay) soundOverlay.classList.add('hidden');
      } else {
        heroVideo.pause();
        updateIcon();
      }
    });
  }

  /* ── Botó reiniciar ── */
  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      heroVideo.currentTime = 0;
      heroVideo.muted = false;
      heroVideo.play()
        .catch(function () { heroVideo.muted = true; })
        .finally(updateIcon);
      if (soundOverlay) soundOverlay.classList.add('hidden');
    });
  }

  heroVideo.addEventListener('play', updateIcon);
  heroVideo.addEventListener('pause', updateIcon);
});

document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', e => e.preventDefault());
