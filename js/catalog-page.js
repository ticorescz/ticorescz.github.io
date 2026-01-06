(() => {
  'use strict';

  const products = Array.isArray(window.TICORE_PRODUCTS) ? window.TICORE_PRODUCTS : [];
  const gender = document.body.dataset.gender || 'all';

  const state = {
    category: 'all',
    brand: 'all',
    search: '',
    hideOutOfStock: true,
    onlyNew: false,
    page: 1,
    pageSize: 12
  };

  const grid = document.getElementById('watch-grid');
  const searchInput = document.getElementById('watch-search');
  const categorySelect = document.getElementById('watch-category');
  const brandSelect = document.getElementById('watch-brand');
  const stockToggle = document.getElementById('stock-filter');
  const newToggle = document.getElementById('new-filter');
  const emptyState = document.getElementById('no-results-message');

  const pageSizeInputs = [
    document.getElementById('page-size-input'),
    document.getElementById('page-size-input-bottom')
  ].filter(Boolean);

  const pagePrevButtons = [
    document.getElementById('page-prev'),
    document.getElementById('page-prev-bottom')
  ].filter(Boolean);

  const pageNextButtons = [
    document.getElementById('page-next'),
    document.getElementById('page-next-bottom')
  ].filter(Boolean);

  const pageStatus = [
    document.getElementById('page-status'),
    document.getElementById('page-status-bottom')
  ].filter(Boolean);

  function getStockThumbnail(product) {
    if (!product || !Array.isArray(product.images) || product.images.length === 0) {
      return '';
    }

    if (product.inStock === false) {
      return product.images[0];
    }

    if (Array.isArray(product.colors)) {
      const availableColor = product.colors.find(color => (
        color &&
        color.available !== false &&
        Number.isInteger(color.imageIndex) &&
        product.images[color.imageIndex]
      ));

      if (availableColor) {
        return product.images[availableColor.imageIndex];
      }
    }

    return product.images[0];
  }

  function formatName(product) {
    if (!product || !product.title) return '';
    return product.title.replace(/^Poedagar\s+/i, '').trim();
  }

  function buildCard(product) {
    const name = formatName(product);
    const dataName = [product.title, product.code].filter(Boolean).join(' ');
    const tags = [product.category, product.gender, product.brand].filter(Boolean).join(' ');
    const outOfStock = product.inStock === false;
    const isNew = typeof product.badge === 'string' && product.badge.toLowerCase() === 'nuevo';
    const badges = [];

    if (product.badge && !isNew) {
      badges.push(`<span class="etiqueta destacado">${product.badge}</span>`);
    }
    if (isNew) {
      badges.push('<span class="etiqueta novedad">Nuevo</span>');
    }
    if (outOfStock) {
      badges.push('<span class="etiqueta fuera-de-stock">Fuera de stock</span>');
    }

    return `
      <article class="decant${outOfStock ? ' sin-stock' : ''}" data-id="${product.id}" data-name="${dataName}" data-tags="${tags}"${outOfStock ? ' data-stock="out"' : ''}${isNew ? ' data-new="true"' : ''} tabindex="0" role="button" aria-label="Ver detalles de ${product.title}">
        <img src="${getStockThumbnail(product)}" alt="${product.title}" loading="lazy" decoding="async">
        <h3><strong>${product.brandLabel || 'Poedagar'}</strong></h3>
        <p>${name}</p>
        <p>${product.shortDescription}</p>
        <p><span class="price-label">Precio</span> Bs. ${product.price}</p>
        ${badges.length ? `<div class="etiquetas">${badges.join('')}</div>` : ''}
      </article>
    `;
  }

  function renderCards() {
    if (!grid) return [];
    const filteredByGender = gender === 'all'
      ? products
      : products.filter(item => item.gender === gender);
    grid.innerHTML = filteredByGender.map(buildCard).join('');
    return Array.from(grid.querySelectorAll('.decant'));
  }

  function updatePageSize(value) {
    const parsed = parseInt(value, 10);
    state.pageSize = Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
    pageSizeInputs.forEach(input => {
      if (input && input.value !== String(state.pageSize)) {
        input.value = String(state.pageSize);
      }
    });
  }

  function applyFilters(cards) {
    const query = (state.search || '').trim().toLowerCase();
    const category = state.category;
    const brand = state.brand;

    return cards.filter(card => {
      const tags = (card.dataset.tags || '').toLowerCase();
      const name = (card.dataset.name || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      const isOut = card.dataset.stock === 'out' || card.classList.contains('sin-stock') || card.querySelector('.etiqueta.fuera-de-stock');
      const isNew = card.dataset.new === 'true' || card.querySelector('.etiqueta.novedad');

      if (query && !(name.includes(query) || tags.includes(query) || text.includes(query))) {
        return false;
      }

      if (category !== 'all' && !tags.includes(category)) {
        return false;
      }

      if (brand !== 'all' && !tags.includes(brand)) {
        return false;
      }

      if (state.hideOutOfStock && isOut) {
        return false;
      }

      if (state.onlyNew && !isNew) {
        return false;
      }

      return true;
    });
  }

  function renderPage(cards, filtered) {
    if (!grid) return;
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(Math.max(1, state.page), totalPages);

    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    grid.classList.add('is-paging');
    cards.forEach(card => card.classList.add('pag-hidden'));
    pageItems.forEach(card => card.classList.remove('pag-hidden'));

    pageStatus.forEach(status => {
      if (status) status.textContent = `Pagina ${state.page} de ${totalPages}`;
    });

    pagePrevButtons.forEach(btn => {
      if (btn) btn.disabled = state.page <= 1;
    });

    pageNextButtons.forEach(btn => {
      if (btn) btn.disabled = state.page >= totalPages;
    });

    if (emptyState) {
      emptyState.classList.toggle('show', filtered.length === 0);
    }

    requestAnimationFrame(() => {
      setTimeout(() => grid.classList.remove('is-paging'), 160);
    });
  }

  function refresh(cards) {
    const filtered = applyFilters(cards);
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    renderPage(cards, filtered);
  }

  function handleCardNavigation(event) {
    const card = event.target.closest('.decant');
    if (!card) return;
    const id = card.getAttribute('data-id');
    if (!id) return;
    window.location.href = `product-detail.html?id=${id}`;
  }

  function initCardActions() {
    if (!grid) return;
    grid.addEventListener('click', handleCardNavigation);
    grid.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCardNavigation(event);
      }
    });
  }

  function initFilters(cards) {
    searchInput?.addEventListener('input', event => {
      state.search = event.target.value || '';
      state.page = 1;
      refresh(cards);
    });

    categorySelect?.addEventListener('change', event => {
      state.category = event.target.value || 'all';
      state.page = 1;
      refresh(cards);
    });

    brandSelect?.addEventListener('change', event => {
      state.brand = event.target.value || 'all';
      state.page = 1;
      refresh(cards);
    });

    stockToggle?.addEventListener('change', event => {
      state.hideOutOfStock = event.target.checked;
      state.page = 1;
      refresh(cards);
    });

    newToggle?.addEventListener('change', event => {
      state.onlyNew = event.target.checked;
      state.page = 1;
      refresh(cards);
    });

    pageSizeInputs.forEach(input => {
      input.addEventListener('change', event => {
        updatePageSize(event.target.value);
        state.page = 1;
        refresh(cards);
      });
    });

    pagePrevButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.page -= 1;
        refresh(cards);
      });
    });

    pageNextButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.page += 1;
        refresh(cards);
      });
    });
  }

  function init() {
    const cards = renderCards();
    if (!cards.length) return;
    initFilters(cards);
    initCardActions();
    updatePageSize(state.pageSize);
    refresh(cards);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
