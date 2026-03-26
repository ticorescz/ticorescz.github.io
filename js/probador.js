(() => {
  'use strict';

  const params    = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);
  const imgSrc    = params.get('img') ? decodeURIComponent(params.get('img')) : '';

  const shell        = document.getElementById('probador-shell');
  const video        = document.getElementById('probador-video');
  const watchCanvas  = document.getElementById('watch-canvas');
  const btnBack      = document.getElementById('btn-back');
  const btnFlip      = document.getElementById('btn-flip');
  const btnCapture   = document.getElementById('btn-capture');
  const btnDownload  = document.getElementById('btn-download');
  const btnShare     = document.getElementById('btn-share');
  const btnRetake    = document.getElementById('btn-retake');
  const photoModal   = document.getElementById('photo-modal');
  const photoPreview = document.getElementById('photo-preview');
  const captureCanvas = document.getElementById('capture-canvas');
  const flash        = document.getElementById('capture-flash');
  const noCamera     = document.getElementById('no-camera');
  const noCameraBack = document.getElementById('btn-back-nocam');
  const titleEl      = document.getElementById('probador-title');
  const hintDot      = document.getElementById('probador-hint-dot');
  const hintText     = document.getElementById('probador-hint-text');

  const wCtx = watchCanvas.getContext('2d');

  // ─── State ────────────────────────────────────────────────────────────────
  let stream       = null;
  let facingMode   = 'environment';
  let handPresent  = false;
  let animFrameId  = null;
  let mpProcessing = false;
  let nonIdeal     = false;
  let mlReady      = false;

  // Smoothed values (lerp)
  let sX = null, sY = null, sSz = null, sAngle = null, sSkewX = null, sSkewY = null, sFS = null;
  const LERP       = 0.28;
  const LERP_ANGLE = 0.20;

  // ─── Watch image ──────────────────────────────────────────────────────────
  const watchImg = new Image();
  let watchImgLoaded = false;
  if (imgSrc) {
    watchImg.crossOrigin = 'anonymous';
    watchImg.src = imgSrc;
    watchImg.onload = () => { watchImgLoaded = true; };
  }

  // ─── Product data ─────────────────────────────────────────────────────────
  const products  = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const product   = products.find(p => p.id === productId);

  if (product && titleEl) titleEl.textContent = product.title;

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
    hintDot.className = 'hint-dot hint-dot--' + state;
    hintText.textContent = text;
  }

  // ─── Canvas sizing ────────────────────────────────────────────────────────
  function resizeCanvas() {
    watchCanvas.width  = shell.offsetWidth;
    watchCanvas.height = shell.offsetHeight;
  }

  // ─── Map normalised MediaPipe coords → shell CSS pixels ──────────────────
  function mpToShell(nx, ny) {
    const vW = video.videoWidth  || 1;
    const vH = video.videoHeight || 1;
    const sW = shell.offsetWidth;
    const sH = shell.offsetHeight;
    const vRatio = vW / vH;
    const sRatio = sW / sH;
    let scale, offX, offY;

    if (vRatio > sRatio) {
      scale = sH / vH; offX = (sW - vW * scale) / 2; offY = 0;
    } else {
      scale = sW / vW; offX = 0; offY = (sH - vH * scale) / 2;
    }

    let x = nx * vW * scale + offX;
    const y = ny * vH * scale + offY;
    if (facingMode === 'user') x = sW - x;
    return { x, y };
  }

  // ─── Non-ideal position detection ────────────────────────────────────────
  // Returns true when palm faces AWAY from camera (back of hand / fist visible)
  function detectNonIdeal(lms, handedness) {
    // Vectors from wrist to index MCP (5) and pinky MCP (17)
    const v1x = lms[5].x  - lms[0].x,  v1y = lms[5].y  - lms[0].y;
    const v2x = lms[17].x - lms[0].x,  v2y = lms[17].y - lms[0].y;
    // 2D cross product z-component (tells us palm orientation in image plane)
    const normalZ = v1x * v2y - v1y * v2x;

    // MediaPipe "Left"/"Right" is mirrored relative to the physical hand as seen by camera.
    // For a right hand with palm facing camera, normalZ < 0 (y-down screen coords).
    const isLeft = handedness === 'Left';
    return isLeft ? normalZ < 0 : normalZ > 0;
  }

  // ─── Angle lerp (handles ±π wraparound) ──────────────────────────────────
  function lerpAngle(current, target, t) {
    let diff = target - current;
    while (diff >  Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return current + diff * t;
  }

  // ─── Render watch onto canvas ─────────────────────────────────────────────
  function renderWatch() {
    const cW = watchCanvas.width;
    const cH = watchCanvas.height;
    wCtx.clearRect(0, 0, cW, cH);

    if (!handPresent || nonIdeal || !watchImgLoaded || !mlReady || sX === null) return;

    const half = sSz / 2;

    wCtx.save();

    // Move origin to wrist position
    wCtx.translate(sX, sY);

    // Rotate so watch 12-o'clock aligns toward fingers
    // (image top = -Y, which should point in wrist→MCP9 direction → offset +π/2)
    wCtx.rotate(sAngle);

    // 3D: lateral roll shear (wrist tilting left/right)
    const kx = Math.max(-0.45, Math.min(0.45, sSkewX || 0));
    wCtx.transform(1, 0, kx, 1, 0, 0);

    // 3D: foreshortening along arm axis (simulates arm pointing toward camera)
    // sFS ranges 0.5 (arm straight toward camera) → 1.0 (arm perpendicular / parallel to screen)
    const fs = Math.max(0.50, Math.min(1.0, sFS !== null ? sFS : 1.0));
    wCtx.scale(1, fs);

    // ── Draw watch, clipping out the bottom strap (goes behind wrist) ──────
    // Clip to the top ~78% of the image so the 6-o'clock strap is hidden
    // behind the wrist (the video shows through underneath).
    wCtx.save();
    wCtx.beginPath();
    wCtx.rect(-half, -half, sSz, sSz * 0.85);
    wCtx.clip();
    wCtx.drawImage(watchImg, -half, -half, sSz, sSz);
    wCtx.restore();

    wCtx.restore();
  }

  // ─── MediaPipe Hands setup ────────────────────────────────────────────────
  let handsModel = null;

  function initMediaPipe() {
    if (typeof Hands === 'undefined') {
      setHint('loading', 'Cargando renderizado de reloj...');
      return;
    }

    setHint('loading', 'Cargando renderizado de reloj...');

    handsModel = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsModel.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.70,
      minTrackingConfidence: 0.55
    });

    handsModel.onResults(onHandResults);

    handsModel.initialize().then(() => {
      mlReady = true;
      setHint('searching', 'Acerca tu muñeca · 30 cm');
      startProcessLoop();
    }).catch(() => {
      // ML failed — leave hint as "Cargando...", show nothing
      setHint('loading', 'Cargando renderizado de reloj...');
    });
  }

  // ─── Per-frame feed to MediaPipe ──────────────────────────────────────────
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
        nonIdeal    = false;
        sX = sY = sSz = sAngle = sSkewX = sSkewY = sFS = null;
        wCtx.clearRect(0, 0, watchCanvas.width, watchCanvas.height);
        setHint('searching', 'Acerca tu muñeca · 30 cm');
      }
      return;
    }

    handPresent = true;

    // ── Non-ideal position check ─────────────────────────────────────────────
    const handedness = results.multiHandedness?.[0]?.label;
    nonIdeal = detectNonIdeal(lms, handedness);

    if (nonIdeal) {
      wCtx.clearRect(0, 0, watchCanvas.width, watchCanvas.height);
      setHint('searching', 'Gira la muñeca · palma hacia arriba');
      return;
    }

    // ── Screen coords of key landmarks ───────────────────────────────────────
    const wrist = mpToShell(lms[0].x,  lms[0].y);
    const mcp9  = mpToShell(lms[9].x,  lms[9].y);   // middle MCP (arm axis)

    // ── Watch size ────────────────────────────────────────────────────────────
    // diameter ≈ 90% of wrist→MCP9 distance
    const handLen    = Math.hypot(mcp9.x - wrist.x, mcp9.y - wrist.y);
    const targetSize = handLen * 0.90;

    // ── Rotation: 12-o'clock toward fingers ─────────────────────────────────
    const dx = mcp9.x - wrist.x;
    const dy = mcp9.y - wrist.y;
    // Rotation: track arm direction; no extra offset (image strap is horizontal)
    const targetAngle = Math.atan2(dy, dx);

    // ── 3D from Z-depth of landmarks ─────────────────────────────────────────
    // Lateral roll: Z diff between index MCP (5) and pinky MCP (17)
    const targetSkewX = (lms[5].z - lms[17].z) * 2.0;
    // Foreshortening along arm axis: how much the arm points toward/away from camera
    // lms[9].z > 0 means MCP is farther than wrist → arm tilts toward camera
    const armDepth = Math.abs(lms[9].z - lms[0].z);
    const targetFS = Math.max(0.55, 1.0 - armDepth * 3.5);

    // ── Lerp smoothing ────────────────────────────────────────────────────────
    sX     = sX     === null ? wrist.x      : sX     + (wrist.x      - sX)     * LERP;
    sY     = sY     === null ? wrist.y      : sY     + (wrist.y      - sY)     * LERP;
    sSz    = sSz    === null ? targetSize   : sSz    + (targetSize   - sSz)    * LERP;
    sSkewX = sSkewX === null ? targetSkewX  : sSkewX + (targetSkewX  - sSkewX) * LERP;
    sFS    = sFS    === null ? targetFS     : sFS    + (targetFS     - sFS)    * LERP;
    sAngle = sAngle === null ? targetAngle  : lerpAngle(sAngle, targetAngle, LERP_ANGLE);

    renderWatch();
    setHint('found', `Muñeca detectada · ${caseSizeMm}mm`);
  }

  // ─── Camera ───────────────────────────────────────────────────────────────
  async function startCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
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
        resizeCanvas();
        if (handsModel && mlReady) startProcessLoop();
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
    sX = sY = sSz = sAngle = sSkewX = sSkewY = sFS = null;
    handPresent = false;
    startCamera();
  });

  // ─── Capture ──────────────────────────────────────────────────────────────
  btnCapture.addEventListener('click', () => {
    flash.classList.add('flash-active');
    setTimeout(() => flash.classList.remove('flash-active'), 350);

    const sw = shell.offsetWidth;
    const sh = shell.offsetHeight;
    captureCanvas.width  = sw;
    captureCanvas.height = sh;
    const cCtx = captureCanvas.getContext('2d');

    // Draw video frame (object-fit: cover)
    const vW = video.videoWidth, vH = video.videoHeight;
    if (vW && vH) {
      const vR = vW / vH, cR = sw / sh;
      let sx, sy, sW, sH;
      if (vR > cR) { sH = vH; sW = Math.round(sH * cR); sx = Math.round((vW - sW) / 2); sy = 0; }
      else         { sW = vW; sH = Math.round(sW / cR); sx = 0;           sy = Math.round((vH - sH) / 2); }

      if (facingMode === 'user') {
        cCtx.save(); cCtx.scale(-1, 1);
        cCtx.drawImage(video, sx, sy, sW, sH, -sw, 0, sw, sh);
        cCtx.restore();
      } else {
        cCtx.drawImage(video, sx, sy, sW, sH, 0, 0, sw, sh);
      }
    }

    // Composite watch canvas (with mask already applied) on top
    cCtx.drawImage(watchCanvas, 0, 0);

    photoPreview.src = captureCanvas.toDataURL('image/png');
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
    setHint('loading', 'Cargando renderizado de reloj...');
    resizeCanvas();
    await startCamera();
    initMediaPipe();
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    if (!handPresent) wCtx.clearRect(0, 0, watchCanvas.width, watchCanvas.height);
  });
})();
