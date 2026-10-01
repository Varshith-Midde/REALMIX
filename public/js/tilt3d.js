// Real-Life Quest: 3D Mouse Perspective Tilt & Glare Engine
// High performance 60fps card tilt with dynamic specular lighting

class Tilt3DEngine {
  constructor() {
    this.maxTilt = 12; // max tilt angle in degrees
    this.perspective = 1000; // perspective in px
    this.scale = 1.02; // slight scale on hover
  }

  init() {
    // Bind to existing cards and watch for dynamically rendered cards
    this.applyTiltToSelector('.rpg-card, .quest-card, .shop-item-card, .achievement-card, .stat-metric-card, .chapter-node');

    // Observer to re-apply tilt on dynamically rendered views
    const observer = new MutationObserver(() => {
      this.applyTiltToSelector('.rpg-card, .quest-card, .shop-item-card, .achievement-card, .stat-metric-card, .chapter-node');
    });

    const target = document.getElementById('viewContainer');
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  }

  applyTiltToSelector(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.dataset.tiltAttached) return;
      el.dataset.tiltAttached = 'true';
      this.bindElement(el);
    });
  }

  bindElement(el) {
    // Ensure glare element exists
    let glare = el.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      el.appendChild(glare);
    }

    let rect = el.getBoundingClientRect();
    let isHovered = false;

    const onMouseEnter = () => {
      isHovered = true;
      rect = el.getBoundingClientRect();
      glare.style.opacity = '1';
    };

    const onMouseMove = (e) => {
      if (!isHovered) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees
      const tiltX = -((y - centerY) / centerY) * this.maxTilt;
      const tiltY = ((x - centerX) / centerX) * this.maxTilt;

      el.style.transform = `perspective(${this.perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;

      // Dynamic light glare position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, transparent 65%)`;
    };

    const onMouseLeave = () => {
      isHovered = false;
      el.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      glare.style.opacity = '0';
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
  }
}

window.tilt3d = new Tilt3DEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.tilt3d.init();
});
