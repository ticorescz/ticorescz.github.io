(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);
  const imgSrc = params.get('img') ? decodeURIComponent(params.get('img')) : '';

  const shell = document.getElementById('probador-shell');
  const video = document.getElementById('probador-video');
  const overlayWrap = document.getElementById('watch-overlay-wrap');
  const overlayImg = document.getElementById('watch-overlay-img');
  const sizeSlider = document.getElementById('size-slider');
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

  let stream = null;
  let facingMode = 'environment';
  let currentSize = 150;
  let initialized = false;

  // --- Watch image ---
  if (imgSrc) {
    overlayImg.src = imgSrc;
  }

  // --- Product title ---
  const products = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const product = products.find(p => p.id === productId);
  if (product && titleEl) {
    titleEl.textContent = product.title;
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

  // --- Default overlay position (center, lower 55% of screen) ---
  function setDefaultPosition() {
    if (initialized) return; // don't reset position after first load
    const sw = shell.offsetWidth;
    const sh = shell.offsetHeight;
    overlayWrap.style.width = currentSize + 'px';
    overlayWrap.style.height = currentSize + 'px';
    overlayWrap.style.left = Math.round((sw - currentSize) / 2) + 'px';
    overlayWrap.style.top = Math.round(sh * 0.52) + 'px';
    initialized = true;
  }

  // --- Size slider ---
  sizeSlider.addEventListener('input', () => {
    currentSize = parseInt(sizeSlider.value, 10);
    // Keep center position when resizing
    const cx = overlayWrap.offsetLeft + overlayWrap.offsetWidth / 2;
    const cy = overlayWrap.offsetTop + overlayWrap.offsetHeight / 2;
    overlayWrap.style.width = currentSize + 'px';
    overlayWrap.style.height = currentSize + 'px';
    overlayWrap.style.left = Math.round(cx - currentSize / 2) + 'px';
    overlayWrap.style.top = Math.round(cy - currentSize / 2) + 'px';
  });

  // --- Drag (touch + mouse) ---
  let dragging = false;
  let dragStartX = 0, dragStartY = 0;
  let overlayStartLeft = 0, overlayStartTop = 0;

  function getXY(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  overlayWrap.addEventListener('mousedown', startDrag);
  overlayWrap.addEventListener('touchstart', startDrag, { passive: true });

  function startDrag(e) {
    dragging = true;
    const { x, y } = getXY(e);
    dragStartX = x;
    dragStartY = y;
    overlayStartLeft = overlayWrap.offsetLeft;
    overlayStartTop = overlayWrap.offsetTop;
    overlayWrap.classList.add('dragging');
  }

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });

  function onDrag(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getXY(e);
    const newLeft = overlayStartLeft + (x - dragStartX);
    const newTop = overlayStartTop + (y - dragStartY);
    const maxLeft = shell.offsetWidth - overlayWrap.offsetWidth;
    const maxTop = shell.offsetHeight - overlayWrap.offsetHeight;
    overlayWrap.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
    overlayWrap.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
  }

  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);

  function stopDrag() {
    if (!dragging) return;
    dragging = false;
    overlayWrap.classList.remove('dragging');
  }

  // --- Back ---
  function goBack() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
      history.back();
    } else {
      window.location.href = productId ? `product-detail.html?id=${productId}` : 'index.html';
    }
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
    // Flash effect
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
        // Video wider than canvas: crop left/right
        sH = vH;
        sW = Math.round(sH * cRatio);
        sx = Math.round((vW - sW) / 2);
        sy = 0;
      } else {
        // Video taller than canvas: crop top/bottom
        sW = vW;
        sH = Math.round(sW / cRatio);
        sx = 0;
        sy = Math.round((vH - sH) / 2);
      }
      if (facingMode === 'user') {
        // Mirror front camera
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

  // --- Share (Web Share API, falls back to download) ---
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
    setDefaultPosition();
  });
})();
