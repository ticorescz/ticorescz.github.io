const normalizeRoutePath = (path) => {
  if (!path) {
    return '/index.html';
  }
  let normalized = path.replace(/\/+/g, '/');
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (normalized === '/' || normalized === '') {
    return '/index.html';
  }
  if (normalized.endsWith('/')) {
    return `${normalized}index.html`;
  }
  return normalized;
};

window.initCatalogNav = function initCatalogNav(navEl) {
  if (!navEl || navEl.dataset.catalogNavReady === 'true') {
    return navEl?.catalogNavApi;
  }
  navEl.dataset.catalogNavReady = 'true';
  document.body.classList.add('catalog-nav-visible');

  const links = Array.from(navEl.querySelectorAll('.catalog-dock__link'));

  const getLinkPath = (link) => {
    if (!link) {
      return null;
    }
    const targetValue = link.dataset.target || link.getAttribute('href');
    if (!targetValue) {
      return null;
    }
    try {
      return normalizeRoutePath(new URL(targetValue, window.location.href).pathname);
    } catch (error) {
      return normalizeRoutePath(targetValue);
    }
  };

  const setActiveByPath = (path) => {
    const normalized = normalizeRoutePath(path);
    const currentHash = window.location.hash.replace('#', '').trim();
    let matched = false;

    links.forEach(link => {
      const linkPath = getLinkPath(link);
      if (!linkPath) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
        return;
      }

      const panel = link.dataset.panel || '';
      const isPanelMatch = panel && currentHash && panel === currentHash;
      const isActive = linkPath === normalized && (!panel || !currentHash || isPanelMatch);

      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
        matched = true;
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (!matched) {
      links.forEach(link => link.classList.remove('is-active'));
    }
  };

  setActiveByPath(window.location.pathname);

  navEl.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const current = document.activeElement;
    const index = links.indexOf(current);
    let nextIndex = index;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % links.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + links.length) % links.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = links.length - 1;
    }
    links[nextIndex]?.focus();
  });

  const api = {
    setActiveByPath,
    setActiveByHref: (href) => {
      try {
        const normalized = normalizeRoutePath(new URL(href, window.location.href).pathname);
        setActiveByPath(normalized);
      } catch (error) {
        // ignore invalid hrefs
      }
    }
  };

  navEl.catalogNavApi = api;
  return api;
};

function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuPanel = document.getElementById('menu');
  const overlay = document.getElementById('overlay');

  if (!menuToggle || !menuPanel) {
    return;
  }

  const setMenuState = (isOpen) => {
    menuPanel.classList.toggle('show', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (overlay) {
      overlay.classList.toggle('show', isOpen);
    }
    document.body.classList.toggle('nav-open', isOpen);
  };

  const toggleMenu = () => {
    const isOpen = !menuPanel.classList.contains('show');
    setMenuState(isOpen);
  };

  menuToggle.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', () => setMenuState(false));
}

document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
});

window.initMenuToggle = initMenuToggle;

document.addEventListener('headerIncluded', () => {
  initMenuToggle();
});
