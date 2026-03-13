// Lenis fallback - ensure it loads
if (typeof Lenis === "undefined") {
  document.write(
    '<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"><\/script>',
  );
}

// Initialize Lenis smooth scroll (with fallback)
let lenis;
try {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
} catch (e) {
  console.log("Lenis not loaded, using native scroll");
  // Fallback to native smooth scroll
  document.documentElement.style.scrollBehavior = "smooth";
}

// Loading Screen - FIXED VERSION
(function initLoader() {
  const loader = document.getElementById("loader");
  const loaderProgress = document.getElementById("loader-progress");
  const loaderText = document.getElementById("loader-text");

  if (!loader || !loaderProgress) {
    console.error("Loader elements not found");
    return;
  }

  let width = 0;
  const phrases = ["INITIALIZING", "LOADING ASSETS", "COMPILING", "READY"];
  let phraseIndex = 0;

  // Force complete after max 5 seconds regardless
  const maxTimeout = setTimeout(() => {
    finishLoader();
  }, 5000);

  const interval = setInterval(() => {
    width += Math.random() * 30 + 10; // Faster progress

    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      clearTimeout(maxTimeout);
      finishLoader();
    } else {
      // Update text based on progress
      if (width > 25 && phraseIndex === 0) {
        phraseIndex = 1;
        loaderText.textContent = phrases[1];
      } else if (width > 50 && phraseIndex === 1) {
        phraseIndex = 2;
        loaderText.textContent = phrases[2];
      } else if (width > 75 && phraseIndex === 2) {
        phraseIndex = 3;
        loaderText.textContent = phrases[3];
      }
    }

    loaderProgress.style.width = width + "%";
  }, 200);

  function finishLoader() {
    loaderText.textContent = "READY";
    loaderProgress.style.width = "100%";

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loader.style.display = "none";
        initAnimations();
      }, 500);
    }, 300);
  }
})();

// Custom Cursor
const cursorDot = document.getElementById("cursor-dot");
const cursorCircle = document.getElementById("cursor-circle");

if (cursorDot && cursorCircle) {
  let mouseX = 0,
    mouseY = 0;
  let circleX = 0,
    circleY = 0;

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateCursor() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      cursorCircle.style.left = circleX + "px";
      cursorCircle.style.top = circleY + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = document.querySelectorAll(".hover-target");
    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () =>
        cursorCircle.classList.add("hover"),
      );
      target.addEventListener("mouseleave", () =>
        cursorCircle.classList.remove("hover"),
      );
      target.addEventListener("mousedown", () =>
        cursorCircle.classList.add("click"),
      );
      target.addEventListener("mouseup", () =>
        cursorCircle.classList.remove("click"),
      );
    });
  } else {
    // Hide custom cursor on touch devices
    cursorDot.style.display = "none";
    cursorCircle.style.display = "none";
    document.body.style.cursor = "auto";
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
  let menuOpen = false;
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const line1 = document.getElementById("menu-line-1");
  const line2 = document.getElementById("menu-line-2");
  const line3 = document.getElementById("menu-line-3");

  menuToggle.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("active");

    if (menuOpen) {
      if (line1) line1.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (line2) line2.style.opacity = "0";
      if (line3) line3.style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      if (line1) line1.style.transform = "none";
      if (line2) line2.style.opacity = "1";
      if (line3) line3.style.transform = "none";
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("active");
      if (line1) line1.style.transform = "none";
      if (line2) line2.style.opacity = "1";
      if (line3) line3.style.transform = "none";
    });
  });
}

// WebGL Cosmic Background - WITH FALLBACK
function initWebGL() {
  const canvas = document.getElementById("cosmic-canvas");
  if (!canvas || typeof THREE === "undefined") {
    console.log("WebGL/Three.js not available, using CSS fallback");
    // CSS fallback is already in place via the dark background
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500; // Reduced for performance
    const posArray = new Float32Array(starsCount * 3);
    const colorArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100;

      colorArray[i] = 0.2 + Math.random() * 0.3;
      colorArray[i + 1] = 0.6 + Math.random() * 0.4;
      colorArray[i + 2] = 0.8 + Math.random() * 0.2;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );
    starsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3),
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    camera.position.z = 30;

    let targetX = 0,
      targetY = 0;
    document.addEventListener("mousemove", (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    let frameCount = 0;

    function animate() {
      requestAnimationFrame(animate);
      frameCount++;

      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 !== 0) return;

      const elapsedTime = clock.getElapsedTime();
      starsMesh.rotation.y = elapsedTime * 0.05;
      starsMesh.rotation.x = targetY * 0.1;
      starsMesh.rotation.y += targetX * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (e) {
    console.error("WebGL initialization failed:", e);
  }
}

// Create floating particles
function createParticles() {
  const container = document.getElementById("hero-particles");
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    // Reduced count
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.animationDuration = 10 + Math.random() * 10 + "s";
    container.appendChild(particle);
  }
}

// GSAP Animations - WITH SAFETY CHECKS
function initAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.log("GSAP not loaded, skipping animations");
    // Make all content visible immediately
    document.querySelectorAll(".reveal-up").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTl = gsap.timeline();
    heroTl
      .to("#hero-line1", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
      .to(
        "#hero-line2",
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        "#hero-subtitle",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        "#hero-desc",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4",
      )
      .to(
        "#hero-cta",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4",
      );

    // Counter animation
    const codeCounter = document.getElementById("code-counter");
    if (codeCounter) {
      gsap.to(codeCounter, {
        innerText: 50000,
        duration: 2.5,
        snap: { innerText: 1 },
        ease: "power2.out",
        delay: 0.5,
      });
    }

    // Stats counters
    document.querySelectorAll("[data-count]").forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      gsap.to(stat, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Reveal animations
    document.querySelectorAll(".reveal-up").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    // Skill bars
    document.querySelectorAll(".skill-bar").forEach((bar) => {
      const width = bar.getAttribute("data-width");
      gsap.to(bar, {
        width: width + "%",
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bar,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Magnetic buttons
    document.querySelectorAll(".magnetic-btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "elastic.out(1, 0.3)",
        });
      });
    });

    // 3D Tilt effect
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });

    // Text scramble effect
    const subtitle = document.getElementById("hero-subtitle");
    if (subtitle) {
      class TextScramble {
        constructor(el) {
          this.el = el;
          this.chars = "!<>-_\\/[]{}—=+*^?#________";
          this.update = this.update.bind(this);
        }
        setText(newText) {
          const oldText = this.el.innerText;
          const length = Math.max(oldText.length, newText.length);
          const promise = new Promise((resolve) => (this.resolve = resolve));
          this.queue = [];
          for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
          }
          cancelAnimationFrame(this.frameRequest);
          this.frame = 0;
          this.update();
          return promise;
        }
        update() {
          let output = "";
          let complete = 0;
          for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
              complete++;
              output += to;
            } else if (this.frame >= start) {
              if (!char || Math.random() < 0.28) {
                char = this.randomChar();
                this.queue[i].char = char;
              }
              output += `<span class="text-cosmic-cyan">${char}</span>`;
            } else {
              output += from;
            }
          }
          this.el.innerHTML = output;
          if (complete === this.queue.length) {
            this.resolve();
          } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
          }
        }
        randomChar() {
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }

      const fx = new TextScramble(subtitle);
      let counter = 0;
      const phrases = [
        "Full Stack Developer",
        "NASA Global Nominee",
        "Problem Solver",
        "Creative Technologist",
      ];

      setInterval(() => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(() => {
            counter = (counter + 1) % phrases.length;
          }, 2000);
        });
      }, 4000);
    }
  } catch (e) {
    console.error("Animation error:", e);
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -100, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// Initialize everything
initWebGL();
createParticles();

// education
// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const expandBtn = document.getElementById("expand-btn");
  const timelineContent = document.getElementById("timeline-content");
  const expandIcon = document.getElementById("expand-icon");
  const expandText = document.getElementById("expand-text");

  if (expandBtn && timelineContent) {
    expandBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Toggle visibility
      if (timelineContent.classList.contains("hidden")) {
        // Show
        timelineContent.classList.remove("hidden");
        timelineContent.style.animation = "slideDown 0.4s ease forwards";
        expandIcon.style.transform = "rotate(180deg)";
        expandText.textContent = "Hide academic progress";
        expandBtn.classList.add("text-cosmic-cyan");
      } else {
        // Hide
        timelineContent.style.animation = "slideUp 0.3s ease forwards";
        setTimeout(() => {
          timelineContent.classList.add("hidden");
        }, 300);
        expandIcon.style.transform = "rotate(0deg)";
        expandText.textContent = "Click to see academic progress";
        expandBtn.classList.remove("text-cosmic-cyan");
      }
    });
  }
});

//projects

// ==========================================
// NEBULA CAROUSEL (Projects) - FIXED
// ==========================================
(function () {
  const section = document.querySelector(".nebula-section");
  const ring = document.getElementById("orbitRing");
  const nav = document.getElementById("orbitNav");
  const items = document.querySelectorAll(".orbit-item");

  // CRITICAL FIX: Exit if elements don't exist
  if (!ring || items.length === 0) {
    console.log("Nebula carousel elements not found, skipping initialization");
    return;
  }

  let currentRotation = 0;
  let targetRotation = 0;
  let isDragging = false;
  let startX = 0;
  let autoRotate = true;

  function init() {
    createStardust();
    createNavDots();
    startAutoRotation();
    bindEvents();
  }

  function createStardust() {
    const container = document.getElementById("stardust");
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "stardust-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = 8 + Math.random() * 12 + "s";
      particle.style.animationDelay = Math.random() * 5 + "s";
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      container.appendChild(particle);
    }
  }

  function createNavDots() {
    if (!nav) return;
    items.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      nav.appendChild(dot);
    });
    updateNavDots();
  }

  function goToSlide(index) {
    const anglePerItem = 360 / items.length;
    targetRotation = -index * anglePerItem;
    autoRotate = false;
    updateNavDots();
    items.forEach((item, i) => item.classList.toggle("active", i === index));
    setTimeout(() => {
      autoRotate = true;
      items.forEach((item) => item.classList.remove("active"));
    }, 5000);
  }

  function updateNavDots() {
    if (!nav) return;
    const dots = nav.querySelectorAll("button");
    const activeIndex = Math.round(
      (-currentRotation % 360) / (360 / items.length),
    );
    dots.forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        i === (activeIndex + items.length) % items.length,
      );
    });
  }

  function startAutoRotation() {
    function animate() {
      if (autoRotate && !isDragging) targetRotation += 0.15;
      currentRotation += (targetRotation - currentRotation) * 0.05;
      ring.style.transform = `rotateY(${currentRotation}deg)`;
      if (Math.abs(targetRotation - currentRotation) < 0.1) updateNavDots();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // FIXED: Added null checks for all event bindings
  function bindEvents() {
    if (!section) return;

    // Mouse events
    section.addEventListener("mousedown", onDragStart);
    section.addEventListener("mousemove", onDragMove);
    section.addEventListener("mouseup", onDragEnd);
    section.addEventListener("mouseleave", onDragEnd);

    // Touch events
    section.addEventListener("touchstart", onDragStart, { passive: false });
    section.addEventListener("touchmove", onDragMove, { passive: false });
    section.addEventListener("touchend", onDragEnd);

    // Hover pause
    section.addEventListener("mouseenter", () => {
      if (!isDragging) autoRotate = false;
    });
    section.addEventListener("mouseleave", () => {
      if (!isDragging) autoRotate = true;
    });

    // Item clicks
    items.forEach((item, index) => {
      item.addEventListener("click", () => goToSlide(index));
    });
  }

  function onDragStart(e) {
    isDragging = true;
    autoRotate = false;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    if (section) section.style.cursor = "grabbing";
  }

  function onDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const delta = (x - startX) * 0.3;
    targetRotation += delta;
    startX = x;
  }

  function onDragEnd() {
    isDragging = false;
    if (section) section.style.cursor = "default";
    setTimeout(() => (autoRotate = true), 2000);
  }

  init();
})();

// contact
// Subject Tag Selection
const subjectTags = document.querySelectorAll(".subject-tag");
const subjectInput = document.getElementById("subject");

subjectTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    subjectTags.forEach((t) => t.classList.remove("active"));
    tag.classList.add("active");
    subjectInput.value = tag.dataset.value;
  });
});

// Auto-resize Textarea
const textarea = document.getElementById("message");
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.max(120, this.scrollHeight) + "px";

  const count = this.value.length;
  charCount.textContent = count;

  if (count > 450) {
    document.querySelector(".char-counter").classList.add("warning");
  } else {
    document.querySelector(".char-counter").classList.remove("warning");
  }

  if (count > 500) {
    this.value = this.value.substring(0, 500);
    charCount.textContent = 500;
  }
});

// 3D Tilt Effect for Cards
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// Form Submission
const form = document.getElementById("contactForm");
const successOverlay = document.getElementById("successOverlay");
const submitBtn = document.querySelector(".submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate subject
  if (!subjectInput.value) {
    alert("Please select a subject");
    return;
  }

  submitBtn.classList.add("sending");
  submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  successOverlay.classList.add("show");
  submitBtn.classList.remove("sending");
  submitBtn.innerHTML = `
    <span class="btn-text">Send Message</span>
    <span class="btn-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </span>
  `;
});

function resetForm() {
  form.reset();
  subjectTags.forEach((t) => t.classList.remove("active"));
  subjectInput.value = "";
  textarea.style.height = "120px";
  charCount.textContent = "0";
  successOverlay.classList.remove("show");
}

// Intersection Observer for entrance animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".contact-card, .input-group")
  .forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

/////////////////////    FIXING ERROR    ////////////////////////////////////////////
// Fix missing images - temporary placeholder
document.addEventListener("DOMContentLoaded", function () {
  const missingImages = [
    "assets/experience/codveda-logo.png",
    "assets/experience/microsoft-azure.png",
    "assets/gallery/project-1.jpg",
    "assets/gallery/project-2.jpg",
    "assets/gallery/project-3.jpg",
    "assets/gallery/project-4.jpg",
    "assets/gallery/project-5.jpg",
    "assets/gallery/project-6.jpg",
    "assets/gallery/project-7.jpg",
    "assets/gallery/project-8.jpg",
  ];

  // Replace broken images with placeholders
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.src.includes("project-")) {
        // Use Unsplash placeholders for gallery
        const num = this.src.match(/project-(\d+)/)?.[1] || "1";
        this.src = `https://images.unsplash.com/photo-${
          [
            "1446776811953-b23d57bd21aa", // space
            "1451187580459-43490279c0fa", // earth
            "1419242902214-272b3f66ee7a", // night sky
            "1462331940025-496dfbfc7564", // galaxy
            "1506318137071-a8bcbf6755dd", // stars
            "1464802686167-b939a6910659", // planet
            "1516339901601-2e1b62dc0c45", // tech
            "1444703686981-a3abbc4d4fe3", // cosmos
          ][num - 1] || "1446776811953-b23d57bd21aa"
        }?w=400&h=600&fit=crop`;
      } else if (this.src.includes("codveda")) {
        this.src =
          "https://via.placeholder.com/400x200/00d4ff/ffffff?text=Codveda";
      } else if (this.src.includes("microsoft")) {
        this.src =
          "https://via.placeholder.com/400x200/00a4ef/ffffff?text=Microsoft";
      }
    });
  });
});

// At the start of the nebula carousel IIFE
(function () {
  "use strict";

  // SAFETY CHECK: Skip if HTML structure is missing
  if (
    !document.getElementById("orbitRing") ||
    document.querySelectorAll(".orbit-item").length === 0
  ) {
    console.log("Nebula carousel HTML not found - skipping");
    return;
  }

  // ... rest of carousel code
})();
