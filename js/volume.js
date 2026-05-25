    /* ============================================
    LINDJAN — js/volume.js
    Control de volum mínim: icona → slider en hover
    ============================================ */

    document.addEventListener('DOMContentLoaded', function () {

    const heroVideo    = document.querySelector('.hero-video');
    const heroControls = document.querySelector('.hero-controls');
    if (!heroVideo || !heroControls) return;

    const style = document.createElement('style');
    style.textContent = `
        .vol-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 52px;
        position: relative;
        }

        .vol-btn {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #219dbc6f;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 100%;
        color: white;
        cursor: pointer;
        transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;
        position: relative;
        z-index: 2;
        }
        .vol-btn:hover { background: var(--blaze); color: var(--deep); transform: translateY(-2px); }
        .vol-btn svg { width: 18px; height: 18px; display: block; }

        .vol-slider-track {
        position: absolute;
        right: 52px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        overflow: hidden;
        transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        pointer-events: none;
        }
        .vol-wrap:hover .vol-slider-track,
        .vol-wrap:focus-within .vol-slider-track {
        width: 90px;
        pointer-events: all;
        }

        .vol-slider-inner {
        display: flex;
        align-items: center;
        padding-right: 10px;
        height: 52px;
        }

        .vol-range {
        -webkit-appearance: none;
        appearance: none;
        width: 80px;
        height: 2px;
        background: rgba(255,255,255,0.2);
        border-radius: 100px;
        outline: none;
        cursor: pointer;
        }
        .vol-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        transition: background 0.15s, transform 0.15s;
        }
        .vol-range::-webkit-slider-thumb:hover {
        background: var(--blaze);
        transform: scale(1.3);
        }
        .vol-range::-moz-range-thumb {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: white;
        border: none;
        cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    /* ── SVG icones ── */
    const SVG_VOL_ON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>`;
    const SVG_VOL_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>`;

    /* ── Construeix l'element ── */
    const wrap = document.createElement('div');
    wrap.className = 'vol-wrap';

    const track = document.createElement('div');
    track.className = 'vol-slider-track';

    const inner = document.createElement('div');
    inner.className = 'vol-slider-inner';

    const range = document.createElement('input');
    range.type = 'range';
    range.min = '0'; range.max = '100'; range.step = '1'; range.value = '0';
    range.className = 'vol-range';
    range.setAttribute('aria-label', 'Volum');

    const btn = document.createElement('button');
    btn.className = 'vol-btn';
    btn.setAttribute('aria-label', 'Volum');
    btn.innerHTML = SVG_VOL_OFF;

    inner.appendChild(range);
    track.appendChild(inner);
    wrap.appendChild(track);
    wrap.appendChild(btn);

    /* Insereix al principi dels controls (esquerra del play) */
    heroControls.insertBefore(wrap, heroControls.firstChild);

    /* ── Estat ── */
    let lastVol = 0.7;

    function updateTrack(v) {
        range.style.background =
        `linear-gradient(to right, rgba(255,255,255,0.8) ${v*100}%, rgba(255,255,255,0.18) ${v*100}%)`;
    }

    function syncUI() {
        const v = heroVideo.muted ? 0 : heroVideo.volume;
        range.value = Math.round(v * 100);
        btn.innerHTML = v === 0 ? SVG_VOL_OFF : SVG_VOL_ON;
        updateTrack(v);
    }

    /* ── Slider ── */
    range.addEventListener('input', function () {
        const v = range.value / 100;
        heroVideo.volume = v;
        heroVideo.muted  = v === 0;
        if (v > 0) lastVol = v;
        const ov = document.getElementById('soundOverlay');
        if (ov && v > 0) ov.classList.add('hidden');
        syncUI();
    });

    /* ── Botó: toggle mute ── */
    btn.addEventListener('click', function () {
        if (heroVideo.muted || heroVideo.volume === 0) {
        heroVideo.muted  = false;
        heroVideo.volume = lastVol;
        const ov = document.getElementById('soundOverlay');
        if (ov) ov.classList.add('hidden');
        } else {
        lastVol = heroVideo.volume;
        heroVideo.muted = true;
        }
        syncUI();
    });

    /* ── Sincronitza si el video.js canvia l'estat ── */
    heroVideo.addEventListener('volumechange', syncUI);

    const ov = document.getElementById('soundOverlay');
    if (ov) {
        new MutationObserver(() => {
        if (ov.classList.contains('hidden')) syncUI();
        }).observe(ov, { attributes: true, attributeFilter: ['class'] });
    }

    syncUI();
    });