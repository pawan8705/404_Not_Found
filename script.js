// Particle System
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 30 : 80;

    this.init();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.particleCount = window.innerWidth < 768 ? 30 : 80;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${Math.floor(Math.random() * 100 + 156)}, 
                                     ${Math.floor(Math.random() * 100 + 99)}, 
                                     ${Math.floor(Math.random() * 155 + 100)}, 
                                     ${Math.random() * 0.5 + 0.2})`
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connecting lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Update and draw particles
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Boundary check
      if (p.x > this.canvas.width) p.x = 0;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.y > this.canvas.height) p.y = 0;
      if (p.y < 0) p.y = this.canvas.height;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.fillStyle = p.color;
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Hover Particle Effect for 404 circle
class HoverParticleEffect {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.isHovering = false;
    this.animationId = null;

    this.init();
  }

  init() {
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
                        width: ${Math.random() * 6 + 2}px;
                        height: ${Math.random() * 6 + 2}px;
                        background: ${this.getRandomColor()};
                        left: ${Math.random() * 100}%;
                        top: ${Math.random() * 100}%;
                    `;
      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        opacity: 0
      });
    }
  }

  getRandomColor() {
    const colors = ['#6C63FF', '#FF6B8B', '#36D1DC', '#00FF9D'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  start() {
    if (this.isHovering) return;
    this.isHovering = true;

    // Show particles
    this.particles.forEach(p => {
      p.element.style.opacity = '0.8';
    });

    // Start animation
    this.animate();
  }

  stop() {
    this.isHovering = false;

    // Hide particles
    this.particles.forEach(p => {
      p.element.style.opacity = '0';
    });

    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate() {
    if (!this.isHovering) return;

    this.particles.forEach(p => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Boundary check
      if (p.x < 0 || p.x > 100) p.speedX *= -1;
      if (p.y < 0 || p.y > 100) p.speedY *= -1;

      // Apply position
      p.element.style.left = `${p.x}%`;
      p.element.style.top = `${p.y}%`;

      // Pulsing effect
      const pulse = Math.sin(Date.now() / 1000 + p.x) * 0.3 + 0.7;
      p.element.style.opacity = (0.8 * pulse).toString();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Interactive elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system
  new ParticleSystem();

  // Initialize hover particle effect
  const hoverParticles = new HoverParticleEffect(document.getElementById('hoverParticles'));

  // Elements
  const errorAnimation = document.getElementById('errorAnimation');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.querySelector('.search-input');
  const homeBtn = document.getElementById('homeBtn');
  const backBtn = document.getElementById('backBtn');
  const contactBtn = document.getElementById('contactBtn');

  // Circle hover effects
  errorAnimation.addEventListener('mouseenter', () => {
    hoverParticles.start();

    // Create particle burst from center
    createHoverBurst(errorAnimation);
  });

  errorAnimation.addEventListener('mouseleave', () => {
    hoverParticles.stop();
  });

  // Click on error animation
  errorAnimation.addEventListener('click', () => {
    // Create burst from center
    createBurst(errorAnimation, 30);

    // Shake animation
    errorAnimation.style.animation = 'none';
    errorAnimation.offsetHeight; // Trigger reflow
    errorAnimation.style.transform = 'scale(0.95)';

    setTimeout(() => {
      errorAnimation.style.transform = '';
      errorAnimation.style.animation = 'float 6s ease-in-out infinite';
    }, 300);
  });

  // Search button interaction
  searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim() === '') {
      // Shake animation
      searchInput.style.animation = 'none';
      searchInput.offsetHeight; // Trigger reflow
      searchInput.style.animation = 'pulseBorder 0.5s ease';

      searchInput.placeholder = "Enter something to search...";
      searchInput.focus();
    } else {
      // Search animation
      searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      searchBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        // Create particle burst
        createBurst(searchBtn);

        // Show message
        alert(`Searching the cosmos for: "${searchInput.value}"\n(Simulated search in this 404 demo)`);

        // Reset
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.style.pointerEvents = 'auto';
        searchInput.value = '';
      }, 1500);
    }
  });

  // Enter key in search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // Home button interaction
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Ripple effect
    createRipple(e, homeBtn);

    // Button animation
    homeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Teleporting...';
    homeBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      // Create particle burst
      createBurst(homeBtn);

      // Show message
      alert("Beaming you back to the homepage...\n(Simulated navigation in this 404 demo)");

      // Reset
      homeBtn.innerHTML = '<i class="fas fa-home"></i> Beam Me Home';
      homeBtn.style.pointerEvents = 'auto';
    }, 1800);
  });

  // Back button interaction
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Ripple effect
    createRipple(e, backBtn);

    // Button animation
    backBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Warping...';
    backBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      // Create particle burst
      createBurst(backBtn);

      if (window.history.length > 1) {
        alert("Traveling back in time...\n(Simulated back navigation in this 404 demo)");
      } else {
        alert("No timeline to go back to!\n(Simulated back navigation in this 404 demo)");
      }

      // Reset
      backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Go Back in Time';
      backBtn.style.pointerEvents = 'auto';
    }, 1800);
  });

  // Contact button interaction
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Ripple effect
    createRipple(e, contactBtn);

    // Button animation
    contactBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    contactBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      // Create particle burst
      createBurst(contactBtn);

      // Show message
      alert("Contacting mission control...\n(Simulated contact form in this 404 demo)");

      // Reset
      contactBtn.innerHTML = '<i class="fas fa-comment-alt"></i> Contact Mission Control';
      contactBtn.style.pointerEvents = 'auto';
    }, 1800);
  });

  // Create hover burst effect
  function createHoverBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#6C63FF', '#FF6B8B', '#36D1DC', '#00FF9D'];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
                        position: fixed;
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        pointer-events: none;
                        z-index: 100;
                        left: ${centerX}px;
                        top: ${centerY}px;
                        transform: translate(-50%, -50%);
                        animation: hoverBurst 1s forwards;
                    `;

      document.body.appendChild(particle);

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 70;

      // Animate
      setTimeout(() => {
        particle.style.transform = `translate(
                            ${Math.cos(angle) * distance}px, 
                            ${Math.sin(angle) * distance}px
                        )`;
        particle.style.opacity = '0';
      }, 10);

      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  // Create ripple effect
  function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                    z-index: 0;
                `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Create particle burst
  function createBurst(element, count = 15) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#6C63FF', '#FF6B8B', '#36D1DC', '#00FF9D'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
                        position: fixed;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        pointer-events: none;
                        z-index: 100;
                        left: ${centerX}px;
                        top: ${centerY}px;
                        transform: translate(-50%, -50%);
                        animation: burst 1s forwards;
                    `;

      document.body.appendChild(particle);

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;

      // Animate
      setTimeout(() => {
        particle.style.transform = `translate(
                            ${Math.cos(angle) * distance}px, 
                            ${Math.sin(angle) * distance}px
                        )`;
        particle.style.opacity = '0';
      }, 10);

      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  // Add CSS for new animations
  const style = document.createElement('style');
  style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes burst {
                    0% {
                        transform: translate(0, 0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty));
                        opacity: 0;
                    }
                }
                
                @keyframes hoverBurst {
                    0% {
                        transform: translate(0, 0);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty));
                        opacity: 0;
                    }
                }
            `;
  document.head.appendChild(style);

  // Parallax effect on mouse move
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    if (!errorAnimation.matches(':hover')) {
      errorAnimation.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
});