/* ==========================================================================
   VINAYA SATHISH — LUXURY EDITORIAL PORTFOLIO JAVASCRIPT
   Features:
   - Three.js Restrained 3D Hero Element (Champagne/Gold Geometric Geometry)
   - Sticky Header & Mobile Nav Toggle
   - Form Validation & Interactive States
   - Smooth Scroll & Reveal Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initNavbar();
  initHero3D();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   SPLASH SCREEN INTRO
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  // Prevent scroll during brand opening screen
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    splash.classList.add('fade-out');
    document.body.style.overflow = '';
  }, 2400);
}

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   THREE.JS 3D HERO ELEMENT (Subtle Luxury Geometry)
   ========================================================================== */
function initHero3D() {
  const container = document.getElementById('hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group to hold geometry
  const group = new THREE.Group();
  scene.add(group);

  // 1. Icosahedron Outer Wireframe (Gold)
  const geometry1 = new THREE.IcosahedronGeometry(2.2, 1);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xC5A059,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const icosahedron = new THREE.Mesh(geometry1, wireframeMaterial);
  group.add(icosahedron);

  // 2. Inner Solid Octahedron (Subtle Dark Gold Accent)
  const geometry2 = new THREE.OctahedronGeometry(1.2, 0);
  const material2 = new THREE.MeshPhongMaterial({
    color: 0x1A1918,
    emissive: 0x9A7B38,
    emissiveIntensity: 0.15,
    shininess: 80,
    flatShading: true,
    transparent: true,
    opacity: 0.8
  });
  const octahedron = new THREE.Mesh(geometry2, material2);
  group.add(octahedron);

  // 3. Floating Ring Orbit
  const ringGeo = new THREE.TorusGeometry(3.0, 0.012, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xD4AF37,
    transparent: true,
    opacity: 0.4
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xE5C158, 1.2);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
  dirLight2.position.set(-5, -5, -5);
  scene.add(dirLight2);

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation
    group.rotation.y += 0.003;
    group.rotation.x += 0.0015;

    octahedron.rotation.y -= 0.005;
    ring.rotation.z += 0.002;

    // Parallax damping
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    group.position.x = targetX * 0.4;
    group.position.y = -targetY * 0.4;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill out all required fields.', 'error');
      return;
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Success State
    showFeedback(`Thank you, ${name}! Your message has been sent successfully. I will get back to you shortly.`, 'success');
    form.reset();
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
      if (type === 'success') {
        feedback.style.display = 'none';
      }
    }, 6000);
  }
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-item, .editorial-card, .education-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  // Inject active revealed styling
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}
