/* ================================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initBackgroundAnimation();
  initTimelineObserver(); // Trigger animation when in view
  initCertificateZoom();
  initTypewriter();
});

/* ================================
   MOBILE MENU
================================ */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });

    links.forEach(link => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }
}

/* ================================
   THEME TOGGLE
================================ */
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const themes = ["dark", "light", "midnight"];

  let currentTheme = localStorage.getItem("theme") || "dark";
  body.className = currentTheme;

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      let currentIndex = themes.indexOf(currentTheme);
      let nextIndex = (currentIndex + 1) % themes.length;
      currentTheme = themes[nextIndex];

      body.className = currentTheme;
      localStorage.setItem("theme", currentTheme);

      // Optional: Update toggle icon based on theme
      const icon = themeToggle.querySelector("img");
      if (icon) {
        if (currentTheme === "light") icon.src = "asset/Images/logos/darkmode.png";
        else icon.src = "asset/Images/logos/lightmode.png";
      }
    });
  }
}

/* ================================
   TIMELINE OBSERVER (Trigger Animation)
================================ */
function initTimelineObserver() {
  const timelineSection = document.querySelector('.creative-timeline');
  const path = document.querySelector('.timeline-path');

  if (!timelineSection || !path) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger CSS animation by adding a class if we were using class-based trigger
        // In CSS we currently used 'animation: fillPath 3s...' directly.
        // To restart or trigger it only on view, we can reset animation.
        path.style.animation = 'none';
        path.offsetHeight; /* trigger reflow */
        path.style.animation = 'fillPath 3s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(timelineSection);
}

/* ================================
   TYPEWRITER EFFECT (Hero)
================================ */
function initTypewriter() {
  // Simple CSS animation handles the cursor/typing usually, 
  // but let's add a blinking cursor effect if needed dynamically.
  // Current CSS uses background-clip without typing animation.
  // User asked for creative highlighting.
}

/* ================================
   CERTIFICATE ZOOM
================================ */
function initCertificateZoom() {
  window.toggleZoom = function (img) {
    img.classList.toggle("zoomed");
  };
}

/* ================================
   BACKGROUND ANIMATION (Particles)
================================ */
function initBackgroundAnimation() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const particleCount = 50;
  const connectionDistance = 150;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      // Randomly assign blue or pink hue
      this.color = Math.random() > 0.5 ? "rgba(59, 130, 246," : "rgba(236, 72, 153,";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + "0.5)"; // Opacity 0.5
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      // Connect
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          // Gradient stroke
          const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          gradient.addColorStop(0, p.color + "0.2)");
          gradient.addColorStop(1, p2.color + "0.2)");
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================================
   MODAL SYSTEM
================================ */
window.openModal = function (id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Staggered animation for impact modal images
    if (id === 'impactModal') {
      const images = modal.querySelectorAll('.wall-item img');
      images.forEach((img, index) => {
        img.style.opacity = '0';
        img.style.transform = 'translateY(20px)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
          img.style.opacity = '1';
          img.style.transform = 'translateY(0)';
        }, index * 100); // 100ms delay per image
      });
    }
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach(m => {
      m.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("show");
    document.body.style.overflow = "";
  }
});

/* ================================
   IMPACT WALL PAGINATION
================================ */
window.switchImpactImages = function () {
  const images = document.querySelectorAll('#impactModal .wall-item img');

  // Animate out
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
  });

  setTimeout(() => {
    // Shuffle or change sources (Simulation)
    // Ideally, we would have an array of 20+ images and slice a new set.
    // For now, we just re-trigger the animation to simulate "New View" or shuffle.
    // In a real app: src = nextBatch[i]

    // Animate In with Stagger
    images.forEach((img, index) => {
      // Simulate new content by slightly changing query param if placeholder, 
      // or just animate back in for effect if real images are limited.
      // img.src = src + "?v=" + Math.random(); 

      setTimeout(() => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, index * 50);
    });
  }, 300);
}

/* ================================
   SCROLL ANIMATIONS (IntersectionObserver)
================================ */
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

/* ================================
   BACK BUTTON LOGIC (History API)
================================ */
// Hook into openModal to push state
/* ================================
   BACK BUTTON LOGIC (History API)
================================ */
// Hook into openModal to push state
const originalOpenModal = window.openModal;
window.openModal = function (id) {
  originalOpenModal(id);
  // Push state to history so "Back" can catch it
  // Ensure we don't push duplicates if clicked multiple times
  if (!history.state || history.state.modalId !== id) {
    history.pushState({ modalId: id }, null, "#modal-" + id);
  }
};

// Define global closeModal
window.closeModal = function (id) {
  // Check if we have history state for this modal
  if (history.state && history.state.modalId === id) {
    history.back(); // This will trigger popstate
  } else {
    // Fallback if no state (e.g. reload on modal, or direct call)
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = "";
    }
  }
};

// Listen for Back Button (popstate)
window.addEventListener('popstate', (e) => {
  // If we went back, we should close any open modals
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modal => {
    modal.classList.remove('show');
    document.body.style.overflow = "";
  });
});

/* ================================
   SKILLS CHART (Radar / Spider)
================================ */
/*
function initSkillsChart() {
  // Removed
*/

/* Chart Removed */
