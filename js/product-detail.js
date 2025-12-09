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
      "images/pd986-2.png"
    ],
    description: "Elegancia clásica con correa de cuero genuino. Diseño refinado con fecha automática y acabados premium.",
    shortDescription: "Elegancia clásica en cuero",
    features: [
      "Caja de 41mm - Tamaño versátil",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de cuero genuino",
      "Cristal mineral resistente",
      "Fecha automática",
      "Manecillas luminosas"
    ],
    colors: [
      { name: "Blanco con café", hex: "#F5F5DC", hex2: "#8B4513", imageIndex: 0 },
      { name: "Blanco con negro", hex: "#FFFFFF", hex2: "#000000", imageIndex: 1 }
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
    description: "Sofisticación moderna con cronógrafo funcional y correa de cuero premium. Diseño elegante con detalles refinados.",
    shortDescription: "Cronógrafo elegante en cuero",
    features: [
      "Caja de 41mm - Diseño refinado",
      "Movimiento de cuarzo MIYOTA",
      "Resistente al agua 5ATM (50 metros)",
      "Correa de cuero genuino 21mm",
      "Cristal mineral resistente",
      "Cronógrafo funcional",
      "Calendario integrado",
      "Manecillas luminosas",
      "Grosor de caja: 12mm"
    ],
    colors: [
      { name: "Azul con café", hex: "#1e3a8a", hex2: "#8B4513", imageIndex: 0 },
      { name: "Negro con café", hex: "#000000", hex2: "#8B4513", imageIndex: 1 },
      { name: "Full black", hex: "#1a1a1a", imageIndex: 2, available: false }
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
      "images/pd921-acero-2.png"
    ],
    description: "Elegancia contemporánea con correa de acero inoxidable. Cronógrafo premium con cierre de seguridad oculto.",
    shortDescription: "Cronógrafo premium en acero",
    features: [
      "Caja de 42mm - Presencia equilibrada",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable 21mm",
      "Cristal Hardlex resistente",
      "Cronógrafo funcional completo",
      "Calendario día y fecha",
      "Manecillas luminosas",
      "Cierre oculto con botón de seguridad",
      "Peso: 130g - Construcción sólida"
    ],
    colors: [
      { name: "Azul con plateado", hex: "#1e3a8a", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Full black", hex: "#1a1a1a", imageIndex: 1 }
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
    description: "Diseño versátil y moderno con opciones de correa intercambiable. Elegancia casual para cualquier ocasión.",
    shortDescription: "Versatilidad elegante",
    features: [
      "Caja de 41mm - Tamaño universal",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa intercambiable: cuero o acero",
      "Ancho de correa: 20mm",
      "Cristal mineral resistente",
      "Fecha automática",
      "Grosor ultra delgado: 10mm"
    ],
    colors: [
      { name: "Full black", hex: "#1a1a1a", imageIndex: 0 },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 1 }
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
    description: "Diseño femenino elegante en acero inoxidable con caja cuadrada y detalles luminosos. Ideal para ocasiones modernas o uso diario.",
    shortDescription: "Estilo delicado y luminoso",
    features: [
      "Caja de 31mm - Diseño delicado femenino",
      "Movimiento de cuarzo CHENLONG japonés",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Cierre oculto con botón de seguridad",
      "Funciones: Día/Fecha, reserva de energía",
      "Manecillas y marcadores luminosos",
      "Grosor de caja: 11mm"
    ],
    colors: [
      { name: "Rosa con plateado", hex: "#FFC0CB", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Turquesa con plateado", hex: "#40E0D0", hex2: "#C0C0C0", imageIndex: 1, available: false }
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
      "images/pd930-2.png",
      "images/pd930-3.png",
      "images/pd930-4.png"
    ],
    description: "Estilo casual contemporáneo con correa de acero inoxidable y múltiples opciones de color. Diseño versátil para uso diario.",
    shortDescription: "Casual contemporáneo versátil",
    features: [
      "Caja de 41mm - Tamaño equilibrado",
      "Movimiento de cuarzo japonés",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Cierre desplegable con seguridad",
      "Cristal mineral resistente",
      "Peso ligero: 80g",
      "Batería de larga duración: 1-2 años"
    ],
    colors: [
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Blanco con plateado", hex: "#FFFFFF", hex2: "#C0C0C0", imageIndex: 1 },
      { name: "Azul con plateado", hex: "#0066CC", hex2: "#C0C0C0", imageIndex: 2 },
      { name: "Verde con plateado", hex: "#28a745", hex2: "#C0C0C0", imageIndex: 3 }
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
      "images/pd786m-2.png",
      "images/pd786m-3.png",
      "images/pd786m-4.png"
    ],
    description: "Reloj femenino elegante con calendario completo y detalles luminosos. Combinación perfecta de sofisticación y funcionalidad.",
    shortDescription: "Sofisticación femenina completa",
    features: [
      "Caja de 35mm - Diseño femenino refinado",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium 24mm",
      "Calendario completo integrado",
      "Día y fecha",
      "Manecillas luminosas",
      "Batería: 18 meses"
    ],
    colors: [
      { name: "Dorado", hex: "#D4AF37", imageIndex: 0 },
      { name: "Dorado con plateado", hex: "#D4AF37", hex2: "#C0C0C0", imageIndex: 1 },
      { name: "Blanco con plateado", hex: "#FFFFFF", hex2: "#C0C0C0", imageIndex: 2, available: false },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 3 }
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
    description: "Diseño deportivo versátil con correa de silicona cómoda. Ideal para estilo casual y activo, perfecto para parejas.",
    shortDescription: "Deportivo y versátil",
    features: [
      "Caja de 42mm - Tamaño equilibrado",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de silicona premium 20mm",
      "Ultra delgado: 10mm de grosor",
      "Diseño unisex para parejas",
      "Batería: 1-2 años",
      "Peso: 50g (ultra ligero)"
    ],
    colors: [
      { name: "Blanco con plateado", hex: "#FFFFFF", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 1 }
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
    description: "Elegancia minimalista con correa de acero inoxidable. Diseño limpio y contemporáneo para cualquier ocasión.",
    shortDescription: "Minimalismo en acero",
    features: [
      "Caja de 42mm - Diseño universal",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable 20mm",
      "Ultra delgado: 10mm de grosor",
      "Diseño unisex elegante",
      "Batería: 1-2 años",
      "Acabado premium pulido"
    ],
    colors: [
      { name: "Blanco con plateado", hex: "#FFFFFF", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 1 }
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
      "images/pd808-2.png",
      "images/pd808-3.png"
    ],
    description: "Reloj deportivo y versátil con correa de nylon, función de fecha automática y diseño luminoso.",
    shortDescription: "Deportivo, robusto y luminoso",
    features: [
      "Caja de 41mm - Tamaño universal",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de nylon premium 22mm",
      "Fecha automática",
      "Manecillas luminosas",
      "Grosor: 13mm",
      "Peso ligero: 80g"
    ],
    colors: [
      { name: "Azul marino", hex: "#001f3f", imageIndex: 0 },
      { name: "Negro", hex: "#000000", imageIndex: 1 },
      { name: "Blanco con negro", hex: "#FFFFFF", hex2: "#000000", imageIndex: 2 }
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
      "images/pd821-2.png",
      "images/pd821-3.png"
    ],
    description: "Diseño elegante casual con correa de acero inoxidable y movimiento japonés. Perfecto balance entre lujo y versatilidad.",
    shortDescription: "Elegancia casual premium",
    features: [
      "Caja de 41mm - Tamaño equilibrado",
      "Movimiento de cuarzo japonés de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Cristal mineral resistente",
      "Peso ultra ligero: 80g",
      "Batería: 1-2 años",
      "Edición limitada"
    ],
    colors: [
      { name: "Celeste cielo con plateado", hex: "#87CEEB", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Azul marino con plateado", hex: "#000080", hex2: "#C0C0C0", imageIndex: 1 },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 2 }
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
    description: "Cronógrafo deportivo de alto rendimiento con múltiples funciones. Diseño robusto y elegante.",
    shortDescription: "Cronógrafo deportivo premium",
    features: [
      "Caja de 42mm - Presencia deportiva",
      "Movimiento de cuarzo BEIJING",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Cronógrafo multifunción completo",
      "Día y fecha integrados",
      "Manecillas luminosas",
      "Peso: 145g - Construcción sólida"
    ],
    colors: [
      { name: "Full black", hex: "#1a1a1a", imageIndex: 0 },
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 1 }
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
      "images/pd815-1.png"
    ],
    description: "Reloj multifunción de gran tamaño con cronómetro y múltiples displays. Máxima funcionalidad.",
    shortDescription: "Multifunción de gran formato",
    features: [
      "Caja de 44.5mm - Presencia imponente",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable 20mm",
      "Fecha automática",
      "Display día y semana",
      "Cronómetro integrado",
      "Peso robusto: 120g"
    ],
    colors: [
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 0 }
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
    description: "Reloj femenino elegante con diseño vintage-moderno. Combinación perfecta de estilo retro y contemporáneo.",
    shortDescription: "Elegancia vintage-moderna",
    features: [
      "Caja de 31mm - Delicado y refinado",
      "Movimiento de cuarzo japonés",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Cierre desplegable con seguridad",
      "Diseño vintage con toques modernos",
      "Peso: 90g",
      "Estilo versátil: casual a formal"
    ],
    colors: [
      { name: "Oro rosa", hex: "#E0BFB8", imageIndex: 0 },
      { name: "Blanco con oro rosa", hex: "#FFFFFF", hex2: "#E0BFB8", imageIndex: 1 }
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
      "images/pd613-acero-2.png",
      "images/pd613-acero-3.png",
      "images/pd613-acero-4.png"
    ],
    description: "Diseño cuadrado moderno con correa de acero inoxidable. Estilo único y contemporáneo.",
    shortDescription: "Diseño cuadrado contemporáneo",
    features: [
      "Caja cuadrada de 41mm - Diseño distintivo",
      "Movimiento de cuarzo SL28",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Fecha automática",
      "Grosor: 11mm",
      "Peso robusto: 120g",
      "Estilo versátil: sport, business, casual"
    ],
    colors: [
      { name: "Negro con plateado", hex: "#000000", hex2: "#C0C0C0", imageIndex: 0 },
      { name: "Blanco con plateado", hex: "#FFFFFF", hex2: "#C0C0C0", imageIndex: 1 },
      { name: "Azul con plateado", hex: "#0066CC", hex2: "#C0C0C0", imageIndex: 2 },
      { name: "Verde con plateado", hex: "#28a745", hex2: "#C0C0C0", imageIndex: 3 }
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
      "images/pd613-cuero-1.png"
    ],
    description: "Versión elegante con correa de cuero genuino. Diseño clásico con toques deportivos y manecillas luminosas.",
    shortDescription: "Elegancia en cuero con luminoso",
    features: [
      "Caja redonda de 41mm - Clásico versátil",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de cuero genuino",
      "Fecha automática",
      "Manecillas luminosas",
      "Grosor: 11mm",
      "Peso cómodo: 100g"
    ],
    colors: [
      { name: "Blanco con café", hex: "#FFFFFF", hex2: "#8B4513", imageIndex: 0 }
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
      "images/pd814-1.png"
    ],
    description: "Reloj deportivo versátil con caja de acero inoxidable completa. Diseño cool y funcional para uso diario activo.",
    shortDescription: "Deportivo versátil en acero",
    features: [
      "Caja de 41mm - Acero inoxidable completo",
      "Movimiento de cuarzo de precisión",
      "Resistente al agua 3ATM (30 metros)",
      "Correa de acero inoxidable premium",
      "Fecha automática",
      "Manecillas luminosas",
      "Diseño deportivo-ejecutivo",
      "Peso equilibrado: 100g"
    ],
    colors: [
      { name: "Azul con negro", hex: "#0066CC", hex2: "#000000", imageIndex: 0 }
    ],
    badge: "VERSÁTIL"
  }
];



let currentProduct = null;
let selectedColor = null;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Cargar producto al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  updateCartCount();
});

// Cargar datos del producto
function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  currentProduct = products.find(p => p.id === productId);
  selectedColor = null;
  
  if (!currentProduct) {
    alert('Producto no encontrado');
    window.location.href = 'catalog.html';
    return;
  }
  
  displayProduct();
}

// Mostrar producto
function displayProduct() {
  const p = currentProduct;
  const isAvailable = p.inStock !== false;
  
  document.getElementById('product-name').textContent = p.title;
  document.getElementById('product-category').textContent = p.category.toUpperCase();
  document.getElementById('product-price').innerHTML = `Bs. ${p.price}`;
  document.getElementById('product-description').textContent = p.description;

  const breadcrumb = document.getElementById('breadcrumb-product');
  if (breadcrumb) breadcrumb.textContent = p.title;
  const badgeEl = document.getElementById('product-badge');
  if (badgeEl) badgeEl.textContent = p.badge || 'TICORÉ';
  
  const featuresHtml = p.features.map(f => `<li>${f}</li>`).join('');
  document.getElementById('product-features').innerHTML = featuresHtml;
  
  const mainImage = document.getElementById('main-image');
  mainImage.src = p.images[0];
  mainImage.onerror = function() {
    this.src = `https://via.placeholder.com/500x500/1a1a1a/D4AF37?text=TICORE+${p.code}`;
  };
  
  const thumbnailGallery = document.getElementById('thumbnail-gallery');
  thumbnailGallery.innerHTML = p.images.map((img, index) => `
    <img src="${img}" 
         alt="Vista ${index + 1}" 
         class="thumbnail ${index === 0 ? 'active' : ''}" 
         onclick="changeMainImage('${img}', this)"
         onerror="this.src='https://via.placeholder.com/80x80/1a1a1a/D4AF37?text=V${index+1}'">
  `).join('');
  
  if (p.colors && p.colors.length > 0) {
    createColorSelector();
  } else {
    const selectorContainer = document.getElementById('color-selector-container');
    if (selectorContainer) selectorContainer.innerHTML = '';
  }

  updateStockStatus(isAvailable);
}

// Crear selector de colores
function createColorSelector() {
  const selectorContainer = document.getElementById('color-selector-container');
  if (!selectorContainer) return;

  const hasUnavailableColors = currentProduct.colors.some(color => color.available === false);
  const helperText = hasUnavailableColors
    ? 'Selecciona un color disponible (los agotados están indicados).'
    : 'Selecciona un color';

  const colorOptions = currentProduct.colors.map(color => {
    const backgroundStyle = color.hex2 
      ? `linear-gradient(90deg, ${color.hex} 50%, ${color.hex2} 50%)`
      : color.hex;
    
    const requiresOutline = (color.hex || '').toLowerCase() === '#ffffff' || (color.hex2 || '').toLowerCase() === '#ffffff';
    const boxShadow = requiresOutline ? 'box-shadow: inset 0 0 0 1px #ccc;' : '';
    const isAvailable = color.available !== false;
    const safeColorName = color.name.replace(/'/g, "\\'");
    
    return `
      <div class="color-option ${isAvailable ? '' : 'color-option-disabled'}"
           data-color-name="${color.name}"
           data-color-hex="${color.hex}"
           ${isAvailable ? `onclick="selectColor('${safeColorName}', '${color.hex}')"` : 'aria-disabled="true"'}
           style="background: ${backgroundStyle}; ${boxShadow}">
        ${!isAvailable ? '<span class="color-status-tag">Agotado</span>' : ''}
      </div>
    `;
  }).join('');

  selectorContainer.innerHTML = `
    <div class="color-selector color-selector-premium">
      <label>Color:</label>
      <div class="color-options-grid">
        ${colorOptions}
      </div>
      <p id="selected-color" class="color-helper-text">${helperText}</p>
    </div>
  `;
}

function updateStockStatus(isAvailable) {
  const stockStatusEl = document.getElementById('stock-status');
  const addBtn = document.querySelector('.btn-add-cart-premium');
  const buyBtn = document.querySelector('.btn-buy-now-premium');
  const qtyBtns = document.querySelectorAll('.qty-btn-premium');
  const quantityInput = document.getElementById('quantity');

  if (stockStatusEl) {
    stockStatusEl.textContent = isAvailable
      ? 'Disponible para envío inmediato'
      : 'Producto agotado';
    stockStatusEl.classList.toggle('in-stock', isAvailable);
    stockStatusEl.classList.toggle('out-of-stock', !isAvailable);
    stockStatusEl.setAttribute('aria-live', 'polite');
  }

  [addBtn, buyBtn].forEach(btn => {
    if (!btn) return;
    btn.disabled = !isAvailable;
    btn.classList.toggle('disabled', !isAvailable);
    btn.setAttribute('aria-disabled', !isAvailable);
  });

  qtyBtns.forEach(btn => {
    btn.disabled = !isAvailable;
  });

  if (quantityInput) {
    quantityInput.disabled = !isAvailable;
  }
}


// Seleccionar color
// Seleccionar color Y CAMBIAR IMAGEN
function selectColor(colorName, colorHex) {
  // Buscar el color completo en el producto actual
  const colorObj = currentProduct.colors.find(c => c.name === colorName);

  if (colorObj && colorObj.available === false) {
    alert('Ese color está agotado. Por favor elige otro tono.');
    return;
  }

  selectedColor = { 
    name: colorName, 
    hex: colorHex,
    imageIndex: colorObj && typeof colorObj.imageIndex === 'number' ? colorObj.imageIndex : null
  };

  // Actualizar texto
  const selectedColorEl = document.getElementById('selected-color');
  if (selectedColorEl) {
    selectedColorEl.innerHTML = `
      <strong style="color: #D4AF37;">Color seleccionado:</strong> ${colorName}
    `;
  }

  // Actualizar selección visual
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.colorName === colorName);
  });

  // ⭐ CAMBIAR IMAGEN PRINCIPAL según el color
  if (colorObj && typeof colorObj.imageIndex === 'number' && currentProduct.images[colorObj.imageIndex]) {
    const mainImage = document.getElementById('main-image');
    mainImage.src = currentProduct.images[colorObj.imageIndex];
    
    // Fallback por si la imagen no carga
    mainImage.onerror = function() {
      this.src = `https://via.placeholder.com/500x500/1a1a1a/D4AF37?text=TICORE+${currentProduct.code}`;
    };
  }
}


// Cambiar imagen principal
function changeMainImage(imageSrc, thumbnail) {
  document.getElementById('main-image').src = imageSrc;
  
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
}

// Cambiar cantidad
function changeQuantity(change) {
  const quantityInput = document.getElementById('quantity');
  let newValue = parseInt(quantityInput.value) + change;
  
  if (newValue < 1) newValue = 1;
  if (newValue > 10) newValue = 10;
  
  quantityInput.value = newValue;
}

// Agregar al carrito
function addToCart() {
  if (currentProduct.inStock === false) {
    alert('Este producto está agotado actualmente.');
    return;
  }

  if (currentProduct.colors && currentProduct.colors.length > 0 && !selectedColor) {
    alert('Por favor selecciona un color');
    return;
  }
  
  const quantity = parseInt(document.getElementById('quantity').value);
  
  const existingItemIndex = cart.findIndex(item => 
    item.id === currentProduct.id && 
    (!selectedColor || item.selectedColor === selectedColor.name)
  );
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    const cartItem = {
      id: currentProduct.id,
      title: currentProduct.title,
      code: currentProduct.code,
      price: currentProduct.price,
      image: currentProduct.images[0],
      images: currentProduct.images,
      quantity: quantity,
      selectedColor: selectedColor ? selectedColor.name : null,
      colorHex: selectedColor ? selectedColor.hex : null
    };
    
    cart.push(cartItem);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  const colorText = selectedColor ? ` (${selectedColor.name})` : '';
  alert(`¡${currentProduct.title}${colorText} agregado al carrito!`);
}

// Actualizar contador del carrito
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = `(${totalItems})`;
  }
}

// Comprar ahora (agregar y redirigir al carrito)
function buyNow() {
  if (currentProduct.inStock === false) {
    alert('Este producto está agotado actualmente.');
    return;
  }

  // Validar selección de color
  if (currentProduct.colors && currentProduct.colors.length > 0 && !selectedColor) {
    alert('Por favor selecciona un color');
    return; // DETIENE la función aquí
  }
  
  const quantity = parseInt(document.getElementById('quantity').value);
  
  // Buscar si el producto ya existe en el carrito
  const existingItemIndex = cart.findIndex(item => 
    item.id === currentProduct.id && 
    (!selectedColor || item.selectedColor === selectedColor.name)
  );
  
  if (existingItemIndex > -1) {
    // Si existe, aumentar cantidad
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Si no existe, agregarlo
    const cartItem = {
      id: currentProduct.id,
      title: currentProduct.title,
      code: currentProduct.code,
      price: currentProduct.price,
      image: currentProduct.images[0],
      images: currentProduct.images,
      quantity: quantity,
      selectedColor: selectedColor ? selectedColor.name : null,
      colorHex: selectedColor ? selectedColor.hex : null
    };
    
    cart.push(cartItem);
  }
  
  // Guardar carrito actualizado
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Redirigir inmediatamente al carrito
  window.location.href = 'cart.html';
}
