(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);
  const imgSrc = params.get('img') ? decodeURIComponent(params.get('img')) : '';

  const shell = document.getElementById('probador-shell');
  const video = document.getElementById('probador-video');
  const overlayWrap = document.getElementById('watch-overlay-wrap');
  const overlayImg = document.getElementById('watch-overlay-img');
  const btnBack = document.getElementById('btn-back');
  const btnFlip = document.getElementById('btn-flip');
  const btnCapture = document.getElementById('btn-capture');
  const btnDownload = document.getElementById('btn-download');
  const btnShare = document.getElementById('btn-share');
  const btnRetake = document.getElementById('btn-retake');
  const photoModal = document.getElementById('photo-modal');
  const photoPreview = document.getElementById('photo-preview');
  const canvas = document.getElementById('capture-canvas');
  const flash = document.getElementById('capture-flash');
  const noCamera = document.getElementById('no-camera');
  const noCameraBack = document.getElementById('btn-back-nocam');
  const titleEl = document.getElementById('probador-title');
  const hintText = document.getElementById('probador-hint-text');

  let stream = null;
  let facingMode = 'environment';

  // --- Product data ---
  const products = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const product = products.find(p => p.id === productId);

  if (product && titleEl) {
    titleEl.textContent = product.title;
  }

  // --- Watch image ---
  if (imgSrc) {
    overlayImg.src = imgSrc;
  }

  // --- Extract case size in mm from product features ---
  function getCaseSizeMm(prod) {
    if (!prod) return 42;
    const features = prod.features || [];
    for (const f of features) {
      // Match "Caja de 41mm", "Caja cuadrada 41mm", "44.5mm", etc.
      const m = f.match(/caja[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
      if (m) return parseFloat(m[1]);
    }
    // Fallback: scan description
    const descMatch = (prod.description || '').match(/caja[^0-9]*(\d+(?:\.\d+)?)\s*mm/i);
    if (descMatch) return parseFloat(descMatch[1]);
    return 42; // sensible default
  }

  const caseSizeMm = getCaseSizeMm(product);

  // Update hint with actual mm
  if (hintText) {
    hintText.textContent = `Reloj a tamaño real (${caseSizeMm}mm) · Acerca tu muñeca a la cámara`;
  }

  // --- Position overlay at center-horizontal, lower portion of screen ---
  function placeOverlay() {
    // Apply real-world size via CSS mm units
    overlayWrap.style.width = caseSizeMm + 'mm';
    overlayWrap.style.height = caseSizeMm + 'mm';

    // Center horizontally, ~55% down vertically
    const sw = shell.offsetWidth;
    const sh = shell.offsetHeight;
    const wPx = overlayWrap.offsetWidth;
    const hPx = overlayWrap.offsetHeight;
    overlayWrap.style.left = Math.round((sw - wPx) / 2) + 'px';
    overlayWrap.style.top = Math.round(sh * 0.52 - hPx / 2) + 'px';
  }

  // --- Camera ---
  async function startCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = stream;
      video.style.display = '';
    } catch (err) {
      console.error('Camera error:', err);
      if (noCamera) noCamera.removeAttribute('hidden');
      if (video) video.style.display = 'none';
    }
  }

  // --- Back ---
  function goBack() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    const nav = window.top || window;
    nav.location.href = productId ? `product-detail.html?id=${productId}` : 'index.html';
  }

  btnBack.addEventListener('click', goBack);
  if (noCameraBack) noCameraBack.addEventListener('click', goBack);

  // --- Flip camera ---
  btnFlip.addEventListener('click', () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera();
  });

  // --- Capture photo ---
  btnCapture.addEventListener('click', capturePhoto);

  function capturePhoto() {
    flash.classList.add('flash-active');
    setTimeout(() => flash.classList.remove('flash-active'), 350);

    const sw = shell.offsetWidth;
    const sh = shell.offsetHeight;
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');

    // Draw video frame (replicates CSS object-fit: cover)
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    if (vW && vH) {
      const vRatio = vW / vH;
      const cRatio = sw / sh;
      let sx, sy, sW, sH;
      if (vRatio > cRatio) {
        sH = vH;
        sW = Math.round(sH * cRatio);
        sx = Math.round((vW - sW) / 2);
        sy = 0;
      } else {
        sW = vW;
        sH = Math.round(sW / cRatio);
        sx = 0;
        sy = Math.round((vH - sH) / 2);
      }
      if (facingMode === 'user') {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sW, sH, -sw, 0, sw, sh);
        ctx.restore();
      } else {
        ctx.drawImage(video, sx, sy, sW, sH, 0, 0, sw, sh);
      }
    }

    // Draw watch overlay at its current screen position
    const wRect = overlayWrap.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    ctx.drawImage(
      overlayImg,
      wRect.left - shellRect.left,
      wRect.top - shellRect.top,
      wRect.width,
      wRect.height
    );

    photoPreview.src = canvas.toDataURL('image/png');
    photoModal.removeAttribute('hidden');
  }

  // --- Download ---
  btnDownload.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = photoPreview.src;
    const name = product ? product.title.replace(/\s+/g, '_') : 'reloj';
    a.download = `ticore_${name}.png`;
    a.click();
  });

  // --- Share ---
  btnShare.addEventListener('click', async () => {
    if (!navigator.share || !navigator.canShare) {
      btnDownload.click();
      return;
    }
    try {
      const blob = await (await fetch(photoPreview.src)).blob();
      const file = new File([blob], 'ticore_reloj.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: product ? product.title : 'Mi reloj Ticore',
          text: '¡Mirá cómo me queda este reloj Ticore!'
        });
      } else {
        btnDownload.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') btnDownload.click();
    }
  });

  // --- Retake ---
  btnRetake.addEventListener('click', () => {
    photoModal.setAttribute('hidden', '');
    photoPreview.src = '';
  });

  // --- Init ---
  window.addEventListener('load', async () => {
    await startCamera();
    placeOverlay();
  });

  window.addEventListener('resize', placeOverlay);
})();
