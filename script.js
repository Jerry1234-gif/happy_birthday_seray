// =============================
// EDIT THESE 3 THINGS ONLY ✅
// =============================
const SETTINGS = {
  herName: "Maseray",          // e.g. "Maseray"
  yourName: "~Jere",        // e.g. "Michelle"
  herBirthDate: "February 21, 2007 00:00:00", // change to her real date
};

// =============================
// Elements
// =============================
const envelope = document.getElementById("envelope");
const bgMusic = document.getElementById("bgMusic");
const splashImg = document.getElementById("splash-img");
const musicToggle = document.getElementById("music-control");

const splashText = document.getElementById("splash-text");
const splashSubtext = document.getElementById("splash-subtext");

// Safety: never start splash image as invisible
if (splashImg) splashImg.style.opacity = 1;

// Name targets
const herNameTargets = [
  document.getElementById("her-name-letter"),
  document.getElementById("her-name"),
  document.getElementById("her-name-footer"),
];
const yourNameTargets = [
  document.getElementById("your-name"),
  document.getElementById("your-name-2"),
];

// =============================
// Fill names
// =============================
function injectNames() {
  herNameTargets.forEach(el => { if (el) el.textContent = SETTINGS.herName; });
  yourNameTargets.forEach(el => { if (el) el.textContent = SETTINGS.yourName; });
}
injectNames();

// =============================
// 1) Audio Control
// =============================
if (musicToggle && bgMusic) {
  musicToggle.onclick = () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.innerText = "🎵";
    } else {
      bgMusic.pause();
      musicToggle.innerText = "🔇";
    }
  };
}

// =============================
// 2) Open Card Sequence
// =============================
function openSequence() {
  if (!envelope) return;

  envelope.classList.add("open");
  if (bgMusic) bgMusic.play().catch(() => {}); // play on interaction

  setTimeout(() => {
    const envStage = document.getElementById("envelope-stage");
    const splashStage = document.getElementById("splash-stage");

    if (envStage) envStage.style.display = "none";
    if (splashStage) splashStage.style.display = "flex";

    runSplashSequence();
  }, 1200);
}

if (envelope) {
  envelope.onclick = openSequence;
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openSequence();
  });
}

// Splash steps: You -> Her -> Home
function runSplashSequence() {
  const steps = [
    {
      img: "you1.jpg",
      title: "You’re probably wondering why I’m here…",
      sub: "Relax — it’s not my birthday 😌",
    },
    {
      img: "you2.jpg",
      title: "Okay… it’s still not my birthday 😭",
      sub: "But I had to show up first. Just trust me…",
    },
    {
      img: "her1.jpg",
      title: `It’s YOUR birthday ❤️`,
      sub: "And I couldn’t let today pass without doing something special.",
    },
  ];

  let i = 0;

  function applyStep(step) {
    // Guard
    if (!splashImg) return;

    // Fade out current image first
    splashImg.style.opacity = 0;

    // Update text safely
    if (splashText) splashText.textContent = step.title;
    if (splashSubtext) splashSubtext.textContent = step.sub;

    // Re-trigger text animation safely
    if (splashText) {
      splashText.style.animation = "none";
      void splashText.offsetWidth;
      splashText.style.animation = "";
    }
    if (splashSubtext) {
      splashSubtext.style.animation = "none";
      void splashSubtext.offsetWidth;
      splashSubtext.style.animation = "";
    }

    const nextSrc = step.img;

    // If next image loads, fade it in
    splashImg.onload = () => {
      splashImg.style.opacity = 1;
    };

    // If next image fails, show a visible placeholder (so it never stays blank)
    splashImg.onerror = () => {
      splashImg.style.opacity = 1;
      splashImg.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
            <rect width='100%' height='100%' fill='#ffffff'/>
            <text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle'
              font-family='Montserrat, Arial' font-size='28' fill='#B63A60'>
              Missing image
            </text>
            <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
              font-family='Montserrat, Arial' font-size='18' fill='#777'>
              ${nextSrc}
            </text>
          </svg>
        `);
    };

    // Swap source after short fade-out
    setTimeout(() => {
      splashImg.src = nextSrc;
    }, 250);
  }

  applyStep(steps[i]);

  const interval = setInterval(() => {
    i += 1;

    if (i >= steps.length) {
      clearInterval(interval);

      setTimeout(() => {
        const splashStage = document.getElementById("splash-stage");
        const homeStage = document.getElementById("home-stage");

        if (splashStage) splashStage.style.display = "none";
        if (homeStage) homeStage.style.display = "block";

        handleScrollReveal();
        startSweetWords();
      }, 1000);

      return;
    }

    applyStep(steps[i]);
  }, 3200);
}

// =============================
// 3) Live Timer (Since birth)
// =============================
function updateTimer() {
  const birth = new Date(SETTINGS.herBirthDate).getTime();
  const now = Date.now();
  const d = now - birth;

  const y = Math.floor(d / 31557600000); // years (incl leap)
  const days = Math.floor((d % 31557600000) / 86400000);
  const h = Math.floor((d % 86400000) / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);

  const el = document.getElementById("live-timer");
  if (el) {
    el.innerHTML = `${y} Years <br> ${days} Days, ${h} Hrs, ${m} Mins, ${s} Secs`;
  }
}
setInterval(updateTimer, 1000);
updateTimer();

// =============================
// 4) Scroll Reveal
// =============================
function handleScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal, .scroll-item").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// =============================
// 5) Floating Sweet Words (romantic vibe)
// =============================
function startSweetWords() {
  const container = document.getElementById("sweet-words");
  if (!container) return;

  const words = [
    "My favorite person",
    "My safe place",
    "My answered prayer",
    "My sunshine",
    "My love ❤️",
    "My peace",
    "My joy",
  ];

  function spawnWord() {
    const w = document.createElement("div");
    w.className = "floating-word";
    w.textContent = words[Math.floor(Math.random() * words.length)];

    // random position
    const left = Math.random() * 90 + 5; // 5% - 95%
    const top = Math.random() * 40 + 10; // near header top
    w.style.left = `${left}%`;
    w.style.top = `${top}%`;

    // random duration
    const dur = Math.random() * 4 + 5; // 5 - 9 sec
    w.style.animationDuration = `${dur}s`;

    container.appendChild(w);
    setTimeout(() => w.remove(), dur * 1000);
  }

  injectFloatingWordStyles();

  spawnWord();
  setInterval(spawnWord, 900);
}

function injectFloatingWordStyles() {
  if (document.getElementById("floating-word-style")) return;

  const style = document.createElement("style");
  style.id = "floating-word-style";
  style.textContent = `
    .floating-word{
      position:absolute;
      z-index: 0;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.75);
      border: 1px solid rgba(233,89,132,0.18);
      box-shadow: 0 14px 30px rgba(0,0,0,0.05);
      color: rgba(182,58,96,0.95);
      font-weight: 600;
      font-size: 0.95rem;
      opacity: 0;
      transform: translateY(12px);
      animation: floatUp linear forwards;
      pointer-events:none;
      white-space: nowrap;
      backdrop-filter: blur(8px);
    }
    @keyframes floatUp{
      0%{ opacity: 0; transform: translateY(18px) scale(0.98); }
      15%{ opacity: 1; }
      100%{ opacity: 0; transform: translateY(-60px) scale(1.02); }
    }
  `;
  document.head.appendChild(style);
}

// =============================
// 6) Particle Engine (pink particles)
// =============================
const canvas = document.getElementById("bg-particles");
const ctx = canvas.getContext("2d");
let particlesArray = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
if (canvas) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function getAccentRGB() {
  const rgb = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-rgb")
    .trim();
  return rgb || "233, 89, 132";
}

class Particle {
  constructor(accentRGB) {
    this.accentRGB = accentRGB;
    this.reset(true);
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 80;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * -1 - 0.5;
    this.opacity = Math.random() * 0.35 + 0.15;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -20) this.reset();
  }

  draw() {
    ctx.fillStyle = `rgba(${this.accentRGB}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas || !ctx) return;
  particlesArray = [];
  const accentRGB = getAccentRGB();
  for (let i = 0; i < 110; i++) particlesArray.push(new Particle(accentRGB));
}

function animateParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();