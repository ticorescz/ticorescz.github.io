(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);
  const imgSrc = params.get('img') ? decodeURIComponent(params.get('img')) : '';

  const shell        = document.getElementById('probador-shell');
  const video        = document.getElementById('probador-video');
  const overlayWrap  = document.getElementById('watch-overlay-wrap');
  const overlayImg   = document.getElementById('watch-overlay-img');
  const btnBack      = document.getElementById('btn-back');
  const btnFlip      = document.getElementById('btn-flip');
  const btnCapture   = document.getElementById('btn-capture');
  const btnDownload  = document.getElementById('btn-download');
  const btnShare     = document.getElementById('btn-share');
  const btnRetake    = document.getElementById('btn-retake');
  const photoModal   = document.getElementById('photo-modal');
  const photoPreview = document.getElementById('photo-preview');
  const canvas       = document.getElementById('capture-canvas');
  const flash        = document.getElementById('capture-flash');
  const noCamera     = document.getElementById('no-camera');
  const noCameraBack = document.getElementById('btn-back-nocam');
  const titleEl      = document.getElementById('probador-title');
  const hintDot      = document.getElementById('probador-hint-dot');
  const hintText     = document.getElementById('probador-hint-text');

  // ─── State ────────────────────────────────────────────────────────────────
  let stream        = null;
  let facingMode    = 'environment';
  let handPresent   = false;
  let animFrameId   = null;
  let mpProcessing  = false;

  // Smoothed overlay values (lerp to avoid jitter)
  let sX = null, sY = null, sSz = null;
  const LERP = 0.35;

  // ─── Product / watch data ─────────────────────────────────────────────────
  const products = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const product  = products.find(p => p.id === productId);

  if (product && titleEl) titleEl.textContent = product.title;
  if (imgSrc) overlayImg.src = imgSrc;

  function getCaseSizeMm(prod) {
    if (!prod) return 42;
    for (const f of (prod.features || [])) {
      const m = f.match(/caja[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
      if (m) return parseFloat(m[1]);
    }
    const d = (prod.description || '').match(/caja[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
    return d ? parseFloat(d[1]) : 42;
  }

  const caseSizeMm = getCaseSizeMm(product);

  // ─── Hint helpers ─────────────────────────────────────────────────────────
  function setHint(state, text) {
    // state: 'loading' | 'searching' | 'found'
    hintDot.className = 'hint-dot hint-dot--' + state;
    hintText.textContent = text;
  }

  // ─── Fixed fallback position (CSS mm = physical mm) ───────────────────────
  function placeFixed() {
    overlayWrap.style.width  = caseSizeMm + 'mm';
    overlayWrap.style.height = caseSizeMm + 'mm';
    overlayWrap.style.transform = '';
    const sw  = shell.offsetWidth;
    const sh  = shell.offsetHeight;
    const wPx = overlayWrap.offsetWidth;
    const hPx = overlayWrap.offsetHeight;
    overlayWrap.style.left = Math.round((sw - wPx) / 2) + 'px';
    overlayWrap.style.top  = Math.round(sh * 0.52 - hPx / 2) + 'px';
    // Reset smooth state so next detection starts fresh
    sX = null; sY = null; sSz = null;
  }

  // ─── Map normalised MediaPipe coords → shell CSS pixels ──────────────────
  // (accounts for object-fit: cover scaling and front-camera mirror)
  function mpToShell(nx, ny) {
    const vW = video.videoWidth  || 1;
    const vH = video.videoHeight || 1;
    const sW = shell.offsetWidth;
    const sH = shell.offsetHeight;

    const vRatio = vW / vH;
    const sRatio = sW / sH;
    let scale, offX, offY;

    if (vRatio > sRatio) {
      scale = sH / vH;
      offX  = (sW - vW * scale) / 2;
      offY  = 0;
    } else {
      scale = sW / vW;
      offX  = 0;
      offY  = (sH - vH * scale) / 2;
    }

    let x = nx * vW * scale + offX;
    const y = ny * vH * scale + offY;

    // Front camera is mirrored by the browser; flip X to match
    if (facingMode === 'user') x = sW - x;

    return { x, y };
  }

  // ─── MediaPipe Hands setup ────────────────────────────────────────────────
  let handsModel = null;

  function initMediaPipe() {
    if (typeof Hands === 'undefined') {
      // Script not loaded yet — skip ML, use fixed mode
      setHint('searching', `Mantén el teléfono a 30 cm · ${caseSizeMm}mm`);
      return;
    }

    handsModel = new Hands({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsModel.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.55
    });

    handsModel.onResults(onHandResults);

    handsModel.initialize().then(() => {
      setHint('searching', 'Acerca tu muñeca a la cámara · 30 cm');
      startProcessLoop();
    }).catch(() => {
      setHint('searching', `Mantén el teléfono a 30 cm · ${caseSizeMm}mm`);
    });
  }

  // ─── Per-frame send ───────────────────────────────────────────────────────
  function startProcessLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    function loop() {
      animFrameId = requestAnimationFrame(loop);
      if (mpProcessing || !handsModel) return;
      if (!video || video.readyState < 2 || video.paused || video.ended) return;
      mpProcessing = true;
      handsModel.send({ image: video }).finally(() => { mpProcessing = false; });
    }

    loop();
  }

  // ─── Hand results callback ────────────────────────────────────────────────
  function onHandResults(results) {
    const lms = results.multiHandLandmarks?.[0];

    if (!lms) {
      if (handPresent) {
        handPresent = false;
        placeFixed();
        setHint('searching', 'Acerca tu muñeca a la cámara · 30 cm');
      }
      return;
    }

    handPresent = true;

    // Landmark 0 = wrist, landmark 9 = middle-finger MCP
    const wrist = mpToShell(lms[0].x, lms[0].y);
    const mcp9  = mpToShell(lms[9].x, lms[9].y);

    // Watch size: ~45% of wrist→MCP distance (calibrated to real proportions)
    const handLen    = Math.hypot(mcp9.x - wrist.x, mcp9.y - wrist.y);
    const targetSize = handLen * 0.45 * 2; // diameter ≈ 0.9 × handLen

    // Smooth position + size (lerp)
    sX  = sX  === null ? wrist.x    : sX  + (wrist.x    - sX)  * LERP;
    sY  = sY  === null ? wrist.y    : sY  + (wrist.y    - sY)  * LERP;
    sSz = sSz === null ? targetSize : sSz + (targetSize - sSz) * LERP;

    overlayWrap.style.width     = sSz + 'px';
    overlayWrap.style.height    = sSz + 'px';
    overlayWrap.style.left      = Math.round(sX - sSz / 2) + 'px';
    overlayWrap.style.top       = Math.round(sY - sSz / 2) + 'px';
    overlayWrap.style.transform = '';

    setHint('found', `Muñeca detectada · Mantén el teléfono a 30 cm`);
  }

  // ─── Camera ───────────────────────────────────────────────────────────────
  async function startCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    mpProcessing = false;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = stream;
      video.style.display = '';
      video.addEventListener('loadeddata', () => {
        placeFixed();
        if (handsModel) startProcessLoop();
      }, { once: true });
    } catch (err) {
      console.error('Camera error:', err);
      if (noCamera) noCamera.removeAttribute('hidden');
      if (video) video.style.display = 'none';
    }
  }

  // ─── Controls ─────────────────────────────────────────────────────────────
  function goBack() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (stream) stream.getTracks().forEach(t => t.stop());
    (window.top || window).location.href =
      productId ? `product-detail.html?id=${productId}` : 'index.html';
  }

  btnBack.addEventListener('click', goBack);
  if (noCameraBack) noCameraBack.addEventListener('click', goBack);

  btnFlip.addEventListener('click', () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera();
  });

  // ─── Capture ──────────────────────────────────────────────────────────────
  btnCapture.addEventListener('click', () => {
    flash.classList.add('flash-active');
    setTimeout(() => flash.classList.remove('flash-active'), 350);

    const sw = shell.offsetWidth;
    const sh = shell.offsetHeight;
    canvas.width  = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');

    // Draw video frame (object-fit: cover)
    const vW = video.videoWidth, vH = video.videoHeight;
    if (vW && vH) {
      const vR = vW / vH, cR = sw / sh;
      let sx, sy, sW, sH;
      if (vR > cR) { sH = vH; sW = Math.round(sH * cR); sx = Math.round((vW - sW) / 2); sy = 0; }
      else         { sW = vW; sH = Math.round(sW / cR); sx = 0; sy = Math.round((vH - sH) / 2); }

      if (facingMode === 'user') {
        ctx.save(); ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sW, sH, -sw, 0, sw, sh);
        ctx.restore();
      } else {
        ctx.drawImage(video, sx, sy, sW, sH, 0, 0, sw, sh);
      }
    }

    // Draw watch at its current visual position
    const wRect    = overlayWrap.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    ctx.drawImage(overlayImg,
      wRect.left - shellRect.left, wRect.top - shellRect.top,
      wRect.width, wRect.height);

    photoPreview.src = canvas.toDataURL('image/png');
    photoModal.removeAttribute('hidden');
  });

  btnDownload.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = photoPreview.src;
    a.download = `ticore_${(product?.title || 'reloj').replace(/\s+/g, '_')}.png`;
    a.click();
  });

  btnShare.addEventListener('click', async () => {
    if (!navigator.share || !navigator.canShare) { btnDownload.click(); return; }
    try {
      const blob = await (await fetch(photoPreview.src)).blob();
      const file = new File([blob], 'ticore_reloj.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: product?.title ?? 'Mi reloj Ticore',
          text: '¡Mirá cómo me queda este reloj Ticore!'
        });
      } else { btnDownload.click(); }
    } catch (err) { if (err.name !== 'AbortError') btnDownload.click(); }
  });

  btnRetake.addEventListener('click', () => {
    photoModal.setAttribute('hidden', '');
    photoPreview.src = '';
  });

  // ─── Init ─────────────────────────────────────────────────────────────────
  window.addEventListener('load', async () => {
    setHint('loading', 'Cargando modelo...');
    await startCamera();
    initMediaPipe();
  });

  window.addEventListener('resize', () => {
    if (!handPresent) placeFixed();
  });
})();
