(() => {
  'use strict';

  const products = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  const mainImage = document.getElementById('detail-main');
  const thumbs = document.getElementById('detail-thumbs');
  const title = document.getElementById('detail-title');
  const price = document.getElementById('detail-price');
  const category = document.getElementById('detail-category');
  const stock = document.getElementById('detail-stock');
  const description = document.getElementById('detail-description');
  const features = document.getElementById('detail-features');
  const specs = document.getElementById('detail-specs');
  const colors = document.getElementById('detail-colors');
  const whatsapp = document.getElementById('detail-whatsapp');
  const apedidoNotice = document.getElementById('detail-apedido-notice');
  const btnProbador = document.getElementById('btn-probador');
  let selectedColor = null;
  let currentImgSrc = '';

  function setMainImage(src, alt) {
    if (!mainImage) return;
    mainImage.src = src;
    mainImage.alt = alt || 'Reloj';
    currentImgSrc = src;
    if (btnProbador) {
      btnProbador.onclick = () => {
        window.location.href = `probador.html?id=${id}&img=${encodeURIComponent(currentImgSrc)}`;
      };
    }
  }

  function renderThumbs(images, alt) {
    if (!thumbs) return;
    thumbs.innerHTML = images.map((img, index) => `
      <button class="detail-thumb${index === 0 ? ' is-active' : ''}" type="button" data-src="${img}">
        <img src="${img}" alt="${alt}">
      </button>
    `).join('');

    thumbs.addEventListener('click', event => {
      const button = event.target.closest('.detail-thumb');
      if (!button) return;
      const src = button.getAttribute('data-src');
      if (!src) return;
      thumbs.querySelectorAll('.detail-thumb').forEach(el => el.classList.remove('is-active'));
      button.classList.add('is-active');
      setMainImage(src, alt);
    });
  }

  function renderFeatures(list) {
    if (!features) return;
    features.innerHTML = (list || []).map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('');
  }

  function renderSpecs(product) {
    if (!specs) return;
    const entries = [
      { label: 'Codigo', value: product.code || 'N/A' },
      { label: 'Categoria', value: product.category || 'N/A' },
      { label: 'Genero', value: product.gender || 'N/A' },
      { label: 'Marca', value: product.brandLabel || product.brand || 'N/A' },
      { label: 'Stock', value: product.inStock === false ? 'Fuera de stock' : (product.aPedido === true ? 'A Pedido' : 'Disponible') }
    ];

    specs.innerHTML = entries.map(entry => `
      <div class="detail-spec">
        <span>${entry.label}</span>
        <strong>${entry.value}</strong>
      </div>
    `).join('');
  }

  function renderColors(list) {
    if (!colors) return;
    if (!Array.isArray(list) || list.length === 0) {
      colors.innerHTML = '';
      return;
    }

    const hasUnavailable = list.some(color => color && color.available === false);
    const hasAPedido = list.some(color => color && color.aPedido === true);
    let helperText = 'Selecciona un color';
    if (hasUnavailable && hasAPedido) {
      helperText = 'Selecciona un color (los agotados y a pedido estan indicados).';
    } else if (hasUnavailable) {
      helperText = 'Selecciona un color disponible (los agotados estan indicados).';
    } else if (hasAPedido) {
      helperText = 'Selecciona un color (algunos son a pedido).';
    }

    const options = list.map(color => {
      const backgroundStyle = color.hex2
        ? `linear-gradient(90deg, ${color.hex} 50%, ${color.hex2} 50%)`
        : color.hex;
      const isAvailable = color.available !== false;
      const isAPedido = color.aPedido === true;
      return `
        <div class="color-option ${isAvailable ? '' : 'color-option-disabled'}"
             style="background: ${backgroundStyle};"
             data-color-name="${color.name || ''}"
             data-color-hex="${color.hex || ''}"
             data-a-pedido="${isAPedido ? 'true' : 'false'}"
             ${isAvailable ? `data-selectable=\"true\"` : 'aria-disabled=\"true\"'}>
          ${!isAvailable ? '<span class="color-status-tag">Agotado</span>' : ''}
          ${isAvailable && isAPedido ? '<span class="color-status-tag color-status-tag--apedido">A Pedido</span>' : ''}
        </div>
      `;
    }).join('');

    colors.innerHTML = `
      <div class="color-selector">
        <label><i class="fas fa-palette"></i> Color</label>
        <div class="color-options-grid">${options}</div>
        <p id="selected-color" class="color-helper-text">${helperText}</p>
      </div>
    `;

    const optionEls = Array.from(colors.querySelectorAll('.color-option'));
    optionEls.forEach(option => {
      option.addEventListener('click', () => {
        const selectable = option.dataset.selectable === 'true';
        const colorName = option.dataset.colorName || 'Color';
        const colorHex = option.dataset.colorHex || '';
        if (!selectable) {
          alert('Ese color esta agotado. Por favor elige otro tono.');
          return;
        }
        const isColorAPedido = option.dataset.aPedido === 'true';
        selectedColor = { name: colorName, hex: colorHex, aPedido: isColorAPedido };
        optionEls.forEach(el => el.classList.toggle('selected', el === option));
        const selectedEl = document.getElementById('selected-color');
        if (selectedEl) {
          const apedidoNote = isColorAPedido ? ' <span style="color:#FFB347;">(A Pedido)</span>' : '';
          selectedEl.innerHTML = `<strong style=\"color: #D4AF37;\">Color seleccionado:</strong> ${colorName}${apedidoNote}`;
        }
        if (stock) {
          const product = products.find(item => item.id === id) || products[0];
          if (product.inStock === false) {
            stock.textContent = 'Fuera de stock';
          } else if (isColorAPedido || product.aPedido === true) {
            stock.textContent = 'A Pedido';
          } else {
            stock.textContent = 'Disponible para entrega inmediata';
          }
        }

        const product = products.find(item => item.id === id) || products[0];
        const colorObj = product?.colors?.find(c => c.name === colorName);
        if (colorObj && typeof colorObj.imageIndex === 'number' && product.images?.[colorObj.imageIndex]) {
          setMainImage(product.images[colorObj.imageIndex], product.title);
        }
      });
    });

    const initial = list.find(color => color && color.available !== false) || list[0];
    if (initial) {
      const initialOption = optionEls.find(el => el.dataset.colorName === (initial.name || ''));
      if (initialOption) {
        initialOption.click();
      }
    }
  }

  function render() {
    const product = products.find(item => item.id === id) || products[0];
    if (!product) {
      if (title) title.textContent = 'Producto no encontrado';
      return;
    }

    const name = product.title || 'Reloj';
    if (title) title.textContent = name;
    if (price) price.textContent = `Bs. ${product.price}`;
    if (category) category.textContent = product.category ? product.category.toUpperCase() : 'Categoria';
    if (stock) {
      if (product.inStock === false) {
        stock.textContent = 'Fuera de stock';
      } else if (product.aPedido === true) {
        stock.textContent = 'A Pedido';
      } else {
        stock.textContent = 'Disponible para entrega inmediata';
      }
    }
    const isAPedido = product.aPedido === true ||
      (Array.isArray(product.colors) && product.colors.some(c => c && c.aPedido === true));
    if (apedidoNotice) {
      if (isAPedido) {
        apedidoNotice.innerHTML = '<i class="fas fa-clock"></i> Sólo a pedido, no disponibles para entrega inmediata';
        apedidoNotice.removeAttribute('hidden');
      } else {
        apedidoNotice.setAttribute('hidden', '');
      }
    }

    if (description) description.textContent = product.description || '';

    setMainImage(product.images?.[0] || '', name);
    renderThumbs(product.images || [], name);
    renderFeatures(product.features || []);
    renderSpecs(product);
    renderColors(product.colors || []);

    if (whatsapp) {
      const number = '59162893192';
      const message = encodeURIComponent(`Hola! Quiero consultar por el reloj ${name} (${product.code}).`);
      whatsapp.href = `https://wa.me/${number}?text=${message}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
