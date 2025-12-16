// ============================================
// BASE DE DATOS DE PRODUCTOS - TICORÉ
// ============================================

const products = [
  {
    id: 1,
    title: "Poedagar PD 986",
    code: "PD-986",
    category: "elegante",
    price: 250,
    images: [
      "images/pd986-1.png",
      "images/pd986-2.png",
    ],
    description: "Elegancia clásica con correa de cuero genuino. Diseño refinado con fecha automática y acabados premium.",
    shortDescription: "Elegancia clásica en cuero",
    features: [
      "Caja de 41mm - Tamaño versátil",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM",
      "Correa de cuero genuino",
      "Cristal mineral resistente",
      "Fecha automática",
      "Manecillas luminosas"
    ],
    colors: [
      { name: "Blanco/Café", hex: "#F5F5DC" },
      { name: "Blanco/Negro", hex: "#FFFFFF" }
    ],
    badge: "NUEVO"
  },
  {
    id: 2,
    title: "Poedagar PD 921 Cuero",
    code: "PD-921-CUERO",
    category: "elegante",
    price: 370,
    images: [
      "images/pd921-cuero-1.png",
      "images/pd921-cuero-2.png",
      "images/pd921-cuero-3.png"
    ],
    description: "Sofisticación moderna con cronógrafo funcional y correa de cuero premium.",
    shortDescription: "Cronógrafo elegante en cuero",
    features: [
      "Caja de 41mm",
      "Movimiento MIYOTA",
      "Resistente al agua 5ATM",
      "Cronógrafo funcional",
      "Calendario integrado"
    ],
    colors: [
      { name: "Negro/Plata", hex: "#000000" },
      { name: "Azul/Plata", hex: "#1e3a8a" },
      { name: "Full Black", hex: "#1a1a1a" }
    ],
    badge: "CRONÓGRAFO"
  },
  {
    id: 3,
    title: "Poedagar PD 921 Acero",
    code: "PD-921-ACERO",
    category: "minimalista",
    price: 370,
    images: [
      "images/pd921-acero-1.png",
      "images/pd921-acero-2.png",
      "images/pd921-acero-3.png"
    ],
    description: "Elegancia contemporánea con correa de acero inoxidable.",
    shortDescription: "Cronógrafo premium en acero",
    features: [
      "Caja de 42mm",
      "Acero inoxidable",
      "Cronógrafo completo",
      "Día y fecha",
      "Peso: 130g"
    ],
    colors: [
      { name: "Full Black", hex: "#1a1a1a" },
      { name: "Azul/Plata", hex: "#1e3a8a" }
    ],
    badge: "PREMIUM"
  },
  {
    id: 4,
    title: "Poedagar PD 829",
    code: "PD-829",
    category: "minimalista",
    price: 230,
    images: [
      "images/pd829-1.png",
      "images/pd829-2.png"
    ],
    description: "Diseño versátil y moderno con opciones de correa intercambiable.",
    shortDescription: "Versatilidad elegante",
    features: [
      "Caja de 41mm",
      "Ultra delgado: 10mm",
      "Correa intercambiable",
      "Fecha automática"
    ],
    colors: [
      { name: "Full Black", hex: "#1a1a1a" },
      { name: "Negro/Plata", hex: "#000000" }
    ],
    badge: "VERSÁTIL"
  },
  {
    id: 5,
    title: "Poedagar PD 708 M",
    code: "PD-708-M",
    category: "elegante",
    price: 250,
    images: [
      "images/pd708m-1.png",
      "images/pd708m-2.png"
    ],
    description: "Diseño femenino elegante en acero inoxidable con caja cuadrada.",
    shortDescription: "Estilo delicado y luminoso",
    features: [
      "Caja de 31mm",
      "Movimiento CHENLONG japonés",
      "Día/Fecha",
      "Manecillas luminosas"
    ],
    colors: [
      { name: "Rosa", hex: "#FFC0CB" },
      { name: "Turquesa", hex: "#40E0D0" }
    ],
    badge: "FEMENINO"
  },
  {
    id: 6,
    title: "Poedagar PD 930",
    code: "PD-930",
    category: "minimalista",
    price: 290,
    images: [
      "images/pd930-1.png",
      "images/pd930-2.png"
    ],
    description: "Estilo casual contemporáneo con múltiples opciones de color.",
    shortDescription: "Casual contemporáneo",
    features: [
      "Caja de 41mm",
      "Movimiento japonés",
      "Peso ligero: 80g",
      "4 colores disponibles"
    ],
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Azul", hex: "#0066CC" },
      { name: "Verde", hex: "#28a745" }
    ],
    badge: "POPULAR"
  },
  {
    id: 7,
    title: "Poedagar PD 786 M",
    code: "PD-786-M",
    category: "elegante",
    price: 260,
    images: [
      "images/pd786m-1.png",
      "images/pd786m-2.png"
    ],
    description: "Reloj femenino elegante con calendario completo.",
    shortDescription: "Sofisticación femenina",
    features: [
      "Caja de 35mm",
      "Calendario completo",
      "Manecillas luminosas",
      "Batería: 18 meses"
    ],
    colors: [
      { name: "Dorado", hex: "#D4AF37" },
      { name: "Blanca", hex: "#FFFFFF" },
      { name: "Negra", hex: "#000000" },
      { name: "Bronce", hex: "#F5F5DC" }
    ],
    badge: "ELEGANTE"
  },
  {
    id: 8,
    title: "Poedagar PD 629 Silicona",
    code: "PD-629-SILICONA",
    category: "deportivo",
    price: 330,
    images: [
      "images/pd629-silicona-1.png",
      "images/pd629-silicona-2.png"
    ],
    description: "Diseño deportivo versátil con correa de silicona cómoda.",
    shortDescription: "Deportivo y versátil",
    features: [
      "Caja de 42mm",
      "Silicona premium",
      "Ultra delgado: 10mm",
      "Peso: 50g"
    ],
    colors: [
      { name: "Negra", hex: "#000000" },
      { name: "Blanca", hex: "#FFFFFF" }
    ],
    badge: "DEPORTIVO"
  },
  {
    id: 9,
    title: "Poedagar PD 629 Acero",
    code: "PD-629-ACERO",
    category: "minimalista",
    price: 330,
    images: [
      "images/pd629-acero-1.png",
      "images/pd629-acero-2.png"
    ],
    description: "Elegancia minimalista con correa de acero inoxidable.",
    shortDescription: "Minimalismo en acero",
    features: [
      "Caja de 42mm",
      "Acero inoxidable",
      "Ultra delgado: 10mm",
      "Diseño unisex"
    ],
    colors: [
      { name: "Negra", hex: "#000000" },
      { name: "Blanca", hex: "#FFFFFF" }
    ],
    badge: "VERSÁTIL"
  },
  {
    id: 10,
    title: "Poedagar PD 808",
    code: "PD-808",
    category: "deportivo",
    price: 260,
    images: [
      "images/pd808-1.png",
      "images/pd808-2.png"
    ],
    description: "Reloj deportivo con correa de nylon y fecha automática.",
    shortDescription: "Deportivo robusto",
    features: [
      "Caja de 41mm",
      "Correa de nylon",
      "Fecha automática",
      "Luminoso"
    ],
    colors: [
      { name: "Azul Oscuro", hex: "#001f3f" },
      { name: "Negro", hex: "#000000" },
      { name: "Blanco", hex: "#FFFFFF" }
    ],
    badge: "SPORT"
  },
  {
    id: 11,
    title: "Poedagar PD 821",
    code: "PD-821",
    category: "minimalista",
    price: 310,
    images: [
      "images/pd821-1.png",
      "images/pd821-2.png"
    ],
    description: "Diseño elegante casual con movimiento japonés.",
    shortDescription: "Elegancia casual",
    features: [
      "Caja de 41mm",
      "Movimiento japonés",
      "Peso: 80g",
      "Edición limitada"
    ],
    colors: [
      { name: "Celeste", hex: "#87CEEB" },
      { name: "Azul Marino", hex: "#000080" },
      { name: "Negro", hex: "#000000" }
    ],
    badge: "PREMIUM"
  },
  {
    id: 12,
    title: "Poedagar PD 928",
    code: "PD-928",
    category: "deportivo",
    price: 390,
    images: [
      "images/pd928-1.png",
      "images/pd928-2.png"
    ],
    description: "Cronógrafo deportivo de alto rendimiento.",
    shortDescription: "Cronógrafo deportivo",
    features: [
      "Caja de 42mm",
      "Cronógrafo completo",
      "Día y fecha",
      "Peso: 145g"
    ],
    colors: [
      { name: "Full Black", hex: "#1a1a1a" },
      { name: "Negra", hex: "#000000" }
    ],
    badge: "CRONÓGRAFO"
  },
  {
    id: 13,
    title: "Poedagar PD 815",
    code: "PD-815",
    category: "bold",
    inStock: false,
    price: 390,
    images: [
      "images/pd815-1.png",
      "images/pd815-2.png"
    ],
    description: "Reloj multifunción de gran tamaño con cronómetro.",
    shortDescription: "Multifunción grande",
    features: [
      "Caja de 44.5mm",
      "Cronómetro",
      "Día/Fecha/Semana",
      "Peso: 120g"
    ],
    colors: [
      { name: "Negra", hex: "#000000" }
    ],
    badge: "MULTIFUNCIÓN"
  },
  {
    id: 14,
    title: "Poedagar PD 365 M",
    code: "PD-365-M",
    category: "elegante",
    price: 250,
    images: [
      "images/pd365m-1.png",
      "images/pd365m-2.png"
    ],
    description: "Reloj femenino elegante con diseño vintage-moderno.",
    shortDescription: "Vintage-moderno",
    features: [
      "Caja de 31mm",
      "Movimiento japonés",
      "Diseño vintage",
      "Peso: 90g"
    ],
    colors: [
      { name: "Bronce", hex: "#CD7F32" },
      { name: "Blanca", hex: "#FFFFFF" }
    ],
    badge: "VINTAGE"
  },
  {
    id: 16,
    title: "Poedagar PD 613 Acero",
    code: "PD-613-ACERO",
    category: "minimalista",
    price: 280,
    images: [
      "images/pd613-acero-1.png",
      "images/pd613-acero-2.png"
    ],
    description: "Diseño cuadrado moderno con correa de acero.",
    shortDescription: "Cuadrado moderno",
    features: [
      "Caja cuadrada 41mm",
      "Movimiento SL28",
      "Fecha automática",
      "Peso: 120g"
    ],
    colors: [
      { name: "Azul Marino", hex: "#000080" },
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Verde", hex: "#28a745" }
    ],
    badge: "MODERNO"
  },
  {
    id: 17,
    title: "Poedagar PD 613 Cuero",
    code: "PD-613-CUERO",
    category: "elegante",
    inStock: false,
    price: 280,
    images: [
      "images/pd613-cuero-1.png",
      "images/pd613-cuero-2.png"
    ],
    description: "Versión elegante con correa de cuero genuino.",
    shortDescription: "Elegancia en cuero",
    features: [
      "Caja de 41mm",
      "Cuero genuino",
      "Manecillas luminosas",
      "Peso: 100g"
    ],
    colors: [
      { name: "Blanco", hex: "#FFFFFF" }
    ],
    badge: "CLÁSICO"
  },
  {
    id: 18,
    title: "Poedagar PD 814",
    code: "PD-814",
    category: "deportivo",
    inStock: false,
    price: 330,
    images: [
      "images/pd814-1.png",
      "images/pd814-2.png"
    ],
    description: "Reloj deportivo versátil con caja de acero completa.",
    shortDescription: "Deportivo versátil",
    features: [
      "Caja de 41mm",
      "Acero completo",
      "Fecha automática",
      "Luminoso"
    ],
    colors: [
      { name: "Azul Marino", hex: "#000080" }
    ],
    badge: "VERSÁTIL"
  }
];

let currentFilter = 'todos';
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  updateCartCount();
  setupFilters();
});

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn-premium');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      displayProducts();
    });
  });
}

function displayProducts() {
  const grid = document.getElementById('products-grid');
  
  const filteredProducts = currentFilter === 'todos' 
    ? products 
    : products.filter(p => p.category === currentFilter);
  
  grid.innerHTML = filteredProducts.map(product => {
    const isOutOfStock = product.inStock === false;
    return `
    <div class="product-card-premium${isOutOfStock ? ' out-of-stock' : ''}" onclick="goToProduct(${product.id})">
      <div class="product-image-container">
        <img src="${product.images[0]}" 
             alt="${product.title}" 
             class="product-image-premium"
             onerror="this.src='https://via.placeholder.com/350x350/1a1a1a/D4AF37?text=TICORE+${product.code}'">
        ${isOutOfStock ? '<div class="product-stock-overlay">AGOTADO</div>' : ''}
        <span class="product-badge">${product.badge}</span>
      </div>
      
      <div class="product-info-premium">
        <span class="product-category-badge">
          <i class="fas fa-${getCategoryIcon(product.category)}"></i> 
          ${getCategoryName(product.category)}
        </span>
        
        <h3 class="product-name-premium">${product.title}</h3>
        <p class="product-description-short">${product.shortDescription}</p>
        
        <div class="product-price-container">
          <span class="product-price-premium">Bs. ${product.price}</span>
        </div>

        ${isOutOfStock ? '<p class="stock-status-text">Producto agotado</p>' : ''}
        
        <div class="product-features-mini">
          ${product.features.slice(0, 2).map(f => `
            <span class="feature-mini"><i class="fas fa-check-circle"></i> ${f}</span>
          `).join('')}
        </div>
        
        <button class="product-action-btn" onclick="event.stopPropagation(); goToProduct(${product.id})">
          <i class="fas fa-eye"></i> Ver Detalles
        </button>
      </div>
    </div>
  `;
  }).join('');
}

function getCategoryIcon(category) {
  const icons = {
    'elegante': 'gem',
    'bold': 'bolt',
    'deportivo': 'running',
    'minimalista': 'circle'
  };
  return icons[category] || 'clock';
}

function getCategoryName(category) {
  const names = {
    'elegante': 'ELEGANTE',
    'bold': 'BOLD',
    'deportivo': 'SPORT',
    'minimalista': 'MINIMALISTA'
  };
  return names[category] || category.toUpperCase();
}

function goToProduct(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

function toggleCatalogMenu() {
  const navCenter = document.getElementById('nav-center-catalog');
  const hamburger = document.getElementById('hamburger-catalog');
  
  navCenter.classList.toggle('active');
  hamburger.classList.toggle('active');
}

document.addEventListener('click', (e) => {
  const navCenter = document.getElementById('nav-center-catalog');
  const hamburger = document.getElementById('hamburger-catalog');
  const navContainer = document.querySelector('.nav-container-catalog');
  
  if (navCenter && navCenter.classList.contains('active') && !navContainer.contains(e.target)) {
    navCenter.classList.remove('active');
    hamburger.classList.remove('active');
  }
});
