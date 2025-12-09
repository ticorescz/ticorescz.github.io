// Forzar la reproducción del video cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('hero-video');
  
  // Función para intentar reproducir el video
  function tryPlayVideo() {
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(function() {
        // El video se está reproduciendo
        console.log('Video reproduciéndose automáticamente');
      }).catch(function(error) {
        console.log('Autoplay bloqueado, esperando interacción del usuario');
      });
    }
  }

  // Intentar reproducir inmediatamente
  tryPlayVideo();

  // Intentar reproducir en múltiples eventos (especialmente para móviles)
  const events = ['click', 'touchstart', 'touchend', 'scroll'];
  
  function playOnInteraction() {
    if (video.paused) {
      video.play().then(function() {
        // Remover los event listeners después de reproducir exitosamente
        events.forEach(function(event) {
          document.removeEventListener(event, playOnInteraction);
        });
      }).catch(function(error) {
        console.log('Error al reproducir:', error);
      });
    }
  }

  // Agregar listeners para todos los eventos
  events.forEach(function(event) {
    document.addEventListener(event, playOnInteraction, { passive: true });
  });

  // Asegurar que el video se reinicie cuando termine (por si loop falla)
  video.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  });

  // Monitorear si el video se pausa accidentalmente
  video.addEventListener('pause', function() {
    // Solo reproducir si no está en el final del video
    if (this.currentTime < this.duration - 0.1) {
      setTimeout(function() {
        video.play();
      }, 100);
    }
  });

  // Para Safari iOS - intentar reproducir después de un pequeño delay
  setTimeout(function() {
    if (video.paused) {
      tryPlayVideo();
    }
  }, 500);

  // Verificar periódicamente si el video está pausado (solo los primeros 5 segundos)
  let attempts = 0;
  const checkInterval = setInterval(function() {
    attempts++;
    if (video.paused && attempts < 10) {
      tryPlayVideo();
    }
    if (attempts >= 10 || !video.paused) {
      clearInterval(checkInterval);
    }
  }, 500);
});



// ============================================
// FUNCIONALIDADES PREMIUM
// ============================================

// Animación de números en stats
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    let current = 0;
    const increment = target / 50;
    
    const updateNumber = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target + '+';
      }
    };
    
    updateNumber();
  });
}

// Observador para animar stats cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.premium-stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    contactForm.reset();
  });
}

