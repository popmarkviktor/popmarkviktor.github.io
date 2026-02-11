/* =====================================================
   CANVAS PARTICLE BACKGROUND
===================================================== */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const opts = {
  particleColor: "rgb(200,200,200)",
  lineColor: "rgb(200,200,200)",
  particleAmount: 30,
  defaultSpeed: 1,
  variantSpeed: 1,
  defaultRadius: 2,
  variantRadius: 2,
  linkRadius: 200,
};

let w, h, particles = [];
let resizeTimeout, delay = 200;
const rgb = opts.lineColor.match(/\d+/g);

/* ----- Resize canvas ----- */
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.querySelector(".hero").offsetHeight;
}

/* ----- Debounce resize ----- */
function debounceResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, delay);
}

window.addEventListener("resize", debounceResize);

/* ----- Distance calculation ----- */
const distance = (x1, y1, x2, y2) =>
  Math.hypot(x2 - x1, y2 - y1);

/* ----- Draw line between particles ----- */
function linkParticles(p1, allParticles) {
  allParticles.forEach(p2 => {
    const dist = distance(p1.x, p1.y, p2.x, p2.y);
    const opacity = 1 - dist / opts.linkRadius;

    if (opacity > 0) {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });
}

/* ----- Particle class ----- */
class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
    this.directionAngle = Math.random() * 2 * Math.PI;
    this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
    this.color = opts.particleColor;
    this.vector = {
      x: Math.cos(this.directionAngle) * this.speed,
      y: Math.sin(this.directionAngle) * this.speed
    };
  }

  update() {
    this.x += this.vector.x;
    this.y += this.vector.y;
    this.checkBounds();
  }

  checkBounds() {
    if (this.x <= 0 || this.x >= w) this.vector.x *= -1;
    if (this.y <= 0 || this.y >= h) this.vector.y *= -1;
    this.x = Math.min(Math.max(this.x, 0), w);
    this.y = Math.min(Math.max(this.y, 0), h);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

/* ----- Setup particles and animation ----- */
function initParticles() {
  particles = [];
  resizeCanvas();
  for (let i = 0; i < opts.particleAmount; i++) {
    particles.push(new Particle());
  }
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  particles.forEach(p => linkParticles(p, particles));
}

initParticles();

/* =====================================================
   HAMBURGER MENU TOGGLE
===================================================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

/* =====================================================
   CONTACT FORM MAILTO
===================================================== */
const form = document.getElementById("contactForm");
const messageInput = document.getElementById("message");
const messageError = document.getElementById("messageError");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", e => {
  e.preventDefault();

  messageError.style.display = "none";
  confirmation.style.display = "none";

  const name = document.getElementById("name").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = messageInput.value.trim();

  if (message.length < 15) {
    messageError.style.display = "block";
    messageInput.focus();
    return;
  }

  const mailto = `mailto:popmarkviktor@gmail.com?subject=${encodeURIComponent(subject)}&body=Name:%20${encodeURIComponent(name)}%0D%0A%0D%0A${encodeURIComponent(message)}`;
  window.open(mailto, "_blank");

  confirmation.style.display = "block";
  setTimeout(() => confirmation.style.display = "none", 5000);

  form.reset();
});

/* =====================================================
   COPYRIGHT YEAR
===================================================== */
document.getElementById("year").textContent = new Date().getFullYear();

/* =====================================================
   BACK TO TOP BUTTON
===================================================== */
const backToTopBtn = document.getElementById("backToTop");
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =====================================================
   LIGHT / DARK MODE TOGGLE
===================================================== */
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  themeToggle.textContent = isDark ? "🌙" : "🌞";
});
