let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let selectedDepartment = localStorage.getItem('selectedDepartment') || 'Santa Cruz';

document.addEventListener('DOMContentLoaded', () => {
  displayCart();
  updateCartCount();
});

function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  const rightNav = document.getElementById('right-nav');
  const hamburger = document.getElementById('hamburger');
  
  navLinks.classList.toggle('active');
  rightNav.classList.toggle('active');
  hamburger.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      toggleMenu();
    }
  });
});

function onDepartmentChange() {
  selectedDepartment = document.getElementById('department-select').value;
  localStorage.setItem('selectedDepartment', selectedDepartment);
  displayCart();
}

function displayCart() {
  const container = document.getElementById('cart-content');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado ningún producto a tu carrito</p>
        <a href="catalog.html" class="shop-btn">
          <i class="fas fa-store"></i> Ir a la tienda
        </a>
      </div>
    `;
    return;
  }

  const headerHtml = `
    <div class="cart-header">
      <h1 class="cart-title">
        <i class="fas fa-shopping-cart"></i>
        Mi Carrito
        <span class="cart-count-badge">${cart.length} ${cart.length === 1 ? 'producto' : 'productos'}</span>
      </h1>
      <button class="clear-cart-btn" onclick="clearCart()">
        <i class="fas fa-trash"></i> Vaciar Carrito
      </button>
    </div>
  `;

  const itemsHtml = cart.map((item, index) => `
    <div class="cart-item">
      <div class="item-image">
        <img src="${item.images ? item.images[0] : item.image}" alt="${item.title}" 
             onerror="this.src='https://via.placeholder.com/120x120/f8f9fa/666?text=Sin+imagen'" />
      </div>
      
      <div class="item-details">
        <h3 class="item-title">${item.title}</h3>
        <p class="item-code">Código: ${item.code}</p>
        
        ${item.selectedColor ? `
          <div class="item-color">
            <span class="color-dot" style="background: ${item.colorHex}; ${item.colorHex === '#ffffff' ? 'border-color: #999;' : ''}"></span>
            <span>${item.selectedColor}</span>
          </div>
        ` : ''}
        
        <div class="item-price-section">
          <span class="item-price">Bs. ${item.price}</span>
          ${item.originalPrice ? `<span class="item-original-price">Bs. ${item.originalPrice}</span>` : ''}
        </div>
      </div>
      
      <div class="item-actions">
        <button class="remove-btn" onclick="removeItem(${index})" title="Eliminar">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        
        <div class="item-subtotal">
          Subtotal: <strong>Bs. ${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cart.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const isSantaCruz = selectedDepartment === 'Santa Cruz';
  const shippingText = isSantaCruz 
    ? (subtotal >= 500 ? '<span style="color: #D4AF37; font-weight: 600;">GRATIS</span>' : '<span style="color: #666; font-weight: 600;">Coordinar Precio</span>')
    : '<span style="color: #666; font-weight: 600;">Encomienda a coordinar</span>';

  const summaryHtml = `
    <div class="cart-summary">
      <h2 class="summary-title">Resumen del Pedido</h2>
      
      <div class="summary-row">
        <span>Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} artículos):</span>
        <span>Bs. ${subtotal.toFixed(2)}</span>
      </div>
      
      ${discount > 0 ? `
        <div class="summary-row">
          <span>Descuento:</span>
          <span style="color: #D4AF37; font-weight: 600;">-Bs. ${discount.toFixed(2)}</span>
        </div>
      ` : ''}
      
      <div class="department-selector">
        <label class="department-label">
          <i class="fas fa-map-marker-alt"></i>
          Elige el departamento:
        </label>
        <select id="department-select" class="department-select" onchange="onDepartmentChange()">
          <option value="Santa Cruz" ${selectedDepartment === 'Santa Cruz' ? 'selected' : ''}>Santa Cruz</option>
          <option value="Beni" ${selectedDepartment === 'Beni' ? 'selected' : ''}>Beni</option>
          <option value="Pando" ${selectedDepartment === 'Pando' ? 'selected' : ''}>Pando</option>
          <option value="La Paz" ${selectedDepartment === 'La Paz' ? 'selected' : ''}>La Paz</option>
          <option value="Cochabamba" ${selectedDepartment === 'Cochabamba' ? 'selected' : ''}>Cochabamba</option>
          <option value="Oruro" ${selectedDepartment === 'Oruro' ? 'selected' : ''}>Oruro</option>
          <option value="Potosí" ${selectedDepartment === 'Potosí' ? 'selected' : ''}>Potosí</option>
          <option value="Chuquisaca" ${selectedDepartment === 'Chuquisaca' ? 'selected' : ''}>Chuquisaca</option>
          <option value="Tarija" ${selectedDepartment === 'Tarija' ? 'selected' : ''}>Tarija</option>
        </select>
      </div>
      
      <div class="summary-row">
        <span>Envío a ${selectedDepartment}:</span>
        <span>${shippingText}</span>
      </div>
      
      ${isSantaCruz && subtotal < 500 && subtotal > 0 ? `
        <div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 0.9rem; color: #856404; border: 1px solid #ffc107;">
          <i class="fas fa-info-circle"></i> 
          Te faltan Bs. ${(500 - subtotal).toFixed(2)} para envío gratis en Santa Cruz
        </div>
      ` : ''}
      
      ${!isSantaCruz ? `
        <div style="background: #e7f3ff; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 0.9rem; color: #004085; border: 1px solid #b8daff;">
          <i class="fas fa-truck"></i> 
          El precio de encomienda se coordinará por WhatsApp
        </div>
      ` : ''}
      
      <div class="summary-row total">
        <span>Total:</span>
        <span>Bs. ${subtotal.toFixed(2)}</span>
      </div>
      
      ${!isSantaCruz || subtotal < 500 ? `
        <div style="font-size: 0.85rem; color: #666; text-align: center; margin-top: 10px; font-style: italic;">
          *${!isSantaCruz ? 'El precio de la encomienda' : 'El precio del envío'} se coordinará por WhatsApp
        </div>
      ` : ''}
      
      <button class="checkout-btn" onclick="checkout()">
        <span style="display: flex; align-items: center; gap: 10px;">
          <i class="fab fa-whatsapp"></i>
          Realizar Pedido
        </span>
        <span class="checkout-btn-subtitle">Continúa en nuestro chat de WhatsApp</span>
      </button>
      
      <button class="continue-shopping" onclick="window.location.href='catalog.html'">
        <i class="fas fa-arrow-left"></i>
        Continuar Comprando
      </button>
    </div>
  `;

  container.innerHTML = `
    ${headerHtml}
    <div class="cart-content">
      <div class="cart-items">
        ${itemsHtml}
      </div>
      ${summaryHtml}
    </div>
  `;
}

function updateQuantity(index, change) {
  const item = cart[index];
  item.quantity += change;

  if (item.quantity <= 0) {
    removeItem(index);
    return;
  }

  if (item.quantity > 10) {
    showNotification('Cantidad máxima: 10 unidades por producto', 'warning');
    item.quantity = 10;
  }

  saveCart();
  displayCart();
  updateCartCount();
}

function removeItem(index) {
  const item = cart[index];
  const colorText = item.selectedColor ? ` (${item.selectedColor})` : '';
  
  cart.splice(index, 1);
  saveCart();
  displayCart();
  updateCartCount();
  
  showNotification(`${item.title}${colorText} eliminado del carrito`, 'info');
}

function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cart = [];
    saveCart();
    displayCart();
    updateCartCount();
    showNotification('Carrito vaciado', 'info');
  }
}

// FUNCIÓN CHECKOUT - ABRE WHATSAPP
// FUNCIÓN CHECKOUT - ABRE WHATSAPP Y MUESTRA MODAL
function checkout() {
  if (cart.length === 0) {
    showNotification('Tu carrito está vacío', 'warning');
    return;
  }

  let message = "¡Hola! He sido redirigido de la página Web de Ticoré, quiero realizar un pedido, los productos seleccionados son los siguientes:\n\n";
  
  cart.forEach(item => {
    const colorText = item.selectedColor ? ` ${item.selectedColor}` : '';
    const quantity = item.quantity > 1 ? ` (x${item.quantity})` : '';
    message += `• ${item.title}${colorText}${quantity}\n`;
  });
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isSantaCruz = selectedDepartment === 'Santa Cruz';
  
  message += `\n*Departamento:* ${selectedDepartment}`;
  message += `\n*Subtotal:* Bs. ${subtotal.toFixed(2)}`;
  
  if (isSantaCruz) {
    message += `\n*Envío:* ${subtotal >= 500 ? 'GRATIS' : 'A coordinar'}`;
  } else {
    message += `\n*Envío:* Encomienda a coordinar`;
  }
  
  message += `\n*Total:* Bs. ${subtotal.toFixed(2)}`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/59162893192/?text=${encodedMessage}`;
  
  // Abrir WhatsApp en nueva pestaña
  window.open(whatsappURL, '_blank');
  
  // Mostrar modal de agradecimiento
  showThankYouModal();
}


// MODAL DE AGRADECIMIENTO
function showThankYouModal() {
  // Crear el modal
  const modalHTML = `
    <div class="thank-you-modal" id="thank-you-modal">
      <div class="thank-you-content">
        <div class="thank-you-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="thank-you-title">¡Gracias por elegirnos!</h2>
        <p class="thank-you-message">Un agente de Ticoré responderá su solicitud en breves</p>
        <div class="thank-you-buttons">
          <button class="thank-you-btn btn-clear" onclick="clearCartAndClose()">
            <i class="fas fa-trash"></i>
            <span>Limpiar Carrito</span>
          </button>
          <button class="thank-you-btn btn-store" onclick="goToStore()">
            <i class="fas fa-store"></i>
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Insertar modal en el body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Mostrar con animación
  setTimeout(() => {
    document.getElementById('thank-you-modal').classList.add('show');
  }, 10);
}


// Limpiar carrito y cerrar modal
function clearCartAndClose() {
  cart = [];
  saveCart();
  closeThankYouModal();
  displayCart();
  updateCartCount();
  showNotification('Carrito limpiado correctamente', 'success');
}


// Ir a la tienda
function goToStore() {
  closeThankYouModal();
  window.location.href = 'catalog.html';
}


// Cerrar modal
function closeThankYouModal() {
  const modal = document.getElementById('thank-you-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}


function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 
                      type === 'error' ? 'times-circle' : 
                      type === 'warning' ? 'exclamation-triangle' : 
                      'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
