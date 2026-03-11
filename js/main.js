/* ══════════ THEME ══════════════════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
}
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
})();

/* ══════════ AUDIO ══════════════════════════════════════════ */
let AC,
  soundOn = true;
function getAC() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === "suspended") AC.resume();
  return AC;
}
function playTone(freq, dur, type = "sine", vol = 0.1) {
  if (!soundOn) return;
  try {
    const ac = getAC(),
      o = ac.createOscillator(),
      g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.start(ac.currentTime);
    o.stop(ac.currentTime + dur);
  } catch (e) {}
}
function playNoise(dur, vol = 0.05) {
  if (!soundOn) return;
  try {
    const ac = getAC();
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(),
      g = ac.createGain(),
      f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 700;
    f.Q.value = 0.7;
    s.buffer = buf;
    s.connect(f);
    f.connect(g);
    g.connect(ac.destination);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    s.start();
  } catch (e) {}
}
function playClick() {
  playTone(880, 0.07, "square", 0.07);
  setTimeout(() => playTone(440, 0.05, "square", 0.03), 35);
}
function playHover() {
  playTone(660, 0.05, "sine", 0.04);
}
function playSection() {
  playTone(110, 0.25, "sawtooth", 0.05);
  setTimeout(() => playNoise(0.1, 0.03), 60);
}
function playWarp() {
  if (!soundOn) return;
  try {
    const ac = getAC(),
      o = ac.createOscillator(),
      g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(60, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.5);
    o.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.9);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.1, ac.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1);
    o.start(ac.currentTime);
    o.stop(ac.currentTime + 1.1);
    setTimeout(() => playNoise(0.3, 0.08), 200);
    setTimeout(() => playTone(55, 0.4, "sine", 0.12), 250);
  } catch (e) {}
}
function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("sound-btn").textContent = soundOn ? "🔊" : "🔇";
  document.getElementById("sound-btn").classList.toggle("muted", !soundOn);
  if (soundOn) playClick();
}

/* ══════════ LOADER ═════════════════════════════════════════ */
const ldFill = document.getElementById("ld-fill");
const ldPct = document.getElementById("ld-pct");
let pct = 0;
const ldIv = setInterval(() => {
  pct = Math.min(100, pct + Math.random() * 4 + 1.5);
  ldFill.style.width = pct + "%";
  ldPct.textContent = Math.floor(pct) + "%";
  if (pct >= 100) {
    clearInterval(ldIv);
    setTimeout(() => {
      playWarp();
      document.getElementById("warp").classList.add("boom");
      setTimeout(() => {
        document.getElementById("loader").classList.add("out");
        document.body.classList.add("open");
        startCoords();
        countStats();
      }, 450);
    }, 350);
  }
}, 55);

/* ══════════ CURSOR ═════════════════════════════════════════ */
let mx = innerWidth / 2,
  my = innerHeight / 2,
  cx = mx,
  cy = my;
const curEl = document.getElementById("cur");
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
document.addEventListener("mousedown", () =>
  document.body.classList.add("clk"),
);
document.addEventListener("mouseup", () =>
  document.body.classList.remove("clk"),
);
document
  .querySelectorAll(
    "a,button,.gproj,.gcert,.gedu,.spill,.gtag,.sfeat,.gpill,.cert-photo-card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hov");
      playHover();
    });
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("hov"),
    );
  });
function tickCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  curEl.style.left = cx + "px";
  curEl.style.top = cy + "px";
  requestAnimationFrame(tickCursor);
}
tickCursor();

/* ══════════ TRAIL CANVAS ════════════════════════════════════ */
const tc = document.getElementById("trail-cv"),
  tctx = tc.getContext("2d");
function resizeTrail() {
  tc.width = innerWidth;
  tc.height = innerHeight;
}
resizeTrail();
addEventListener("resize", resizeTrail);
let trail = [];
document.addEventListener("mousemove", (e) => {
  trail.push({
    x: e.clientX,
    y: e.clientY,
    t: Date.now(),
    r: 2 + Math.random() * 2,
  });
  if (trail.length > 28) trail.shift();
});
function drawTrail() {
  tctx.clearRect(0, 0, tc.width, tc.height);
  const now = Date.now();
  for (let i = 1; i < trail.length; i++) {
    const p = trail[i - 1],
      q = trail[i],
      age = now - q.t,
      alpha = Math.max(0, 1 - age / 300);
    if (alpha < 0.01) continue;
    const grad = tctx.createLinearGradient(p.x, p.y, q.x, q.y);
    grad.addColorStop(0, `rgba(255,26,14,${alpha * 0.25})`);
    grad.addColorStop(1, `rgba(252,220,0,${alpha * 0.12})`);
    tctx.beginPath();
    tctx.moveTo(p.x, p.y);
    tctx.lineTo(q.x, q.y);
    tctx.strokeStyle = grad;
    tctx.lineWidth = q.r * alpha;
    tctx.lineCap = "round";
    tctx.stroke();
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

/* ══════════ BG CANVAS — reduced particles ═══════════════════ */
const bgc = document.getElementById("bg-cv"),
  bc = bgc.getContext("2d");
let bW, bH;
function resizeBG() {
  bW = bgc.width = innerWidth;
  bH = bgc.height = innerHeight;
}
resizeBG();
addEventListener("resize", resizeBG);
const pts = [];
for (let i = 0; i < 55; i++)
  pts.push({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 1.2 + 0.3,
    o: Math.random() * 0.3 + 0.08,
    hue: Math.random() < 0.3 ? "255,220,0" : "255,26,14",
  });
let mfx = 0,
  mfy = 0;
document.addEventListener("mousemove", (e) => {
  mfx = e.clientX;
  mfy = e.clientY;
});
function drawBG() {
  bc.clearRect(0, 0, bW, bH);
  pts.forEach((p, i) => {
    const dx = p.x - mfx,
      dy = p.y - mfy,
      d = Math.sqrt(dx * dx + dy * dy);
    if (d < 140) {
      p.vx += (dx / d) * 0.05;
      p.vy += (dy / d) * 0.05;
    }
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = bW;
    if (p.x > bW) p.x = 0;
    if (p.y < 0) p.y = bH;
    if (p.y > bH) p.y = 0;
    bc.beginPath();
    bc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bc.fillStyle = `rgba(${p.hue},${p.o})`;
    bc.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j],
        ddx = p.x - q.x,
        ddy = p.y - q.y,
        dd = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dd < 120) {
        bc.beginPath();
        bc.moveTo(p.x, p.y);
        bc.lineTo(q.x, q.y);
        bc.strokeStyle = `rgba(255,26,14,${0.07 * (1 - dd / 120)})`;
        bc.lineWidth = 0.4;
        bc.stroke();
      }
    }
  });
  requestAnimationFrame(drawBG);
}
drawBG();

/* ══════════ SCROLL REVEAL ════════════════════════════════════ */
const rvObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.seen) {
        e.target.dataset.seen = "1";
        const d =
          parseFloat(getComputedStyle(e.target).transitionDelay || 0) * 1000;
        setTimeout(() => e.target.classList.add("on"), d);
      }
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".rv,.rvl").forEach((el) => rvObs.observe(el));

/* ══════════ SKILL BARS ═══════════════════════════════════════ */
const barObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        e.target
          .querySelectorAll(".ch-fi")
          .forEach((f) => f.classList.add("on"));
    });
  },
  { threshold: 0.15 },
);
const skSec = document.getElementById("skills");
if (skSec) barObs.observe(skSec);

/* ══════════ STAT COUNTERS ════════════════════════════════════ */
function countStats() {
  document.querySelectorAll(".hstat-n[data-target]").forEach((el) => {
    const target = parseInt(el.dataset.target),
      numEl = el.querySelector(".num");
    let cur = 0;
    const inc = target / 40;
    const iv = setInterval(() => {
      cur = Math.min(target, cur + inc);
      numEl.textContent = Math.ceil(cur);
      if (cur >= target) {
        clearInterval(iv);
        numEl.textContent = target;
      }
    }, 30);
  });
}

/* ══════════ COORDS FLICKER ═══════════════════════════════════ */
function startCoords() {
  const el = document.getElementById("coords");
  if (!el) return;
  const places = [
    "30.7865° N, 31.0004° E — TANTA, EGYPT",
    "37.7749° N, 122.4194° W — SAN FRANCISCO",
    "51.5074° N, 0.1278° W — LONDON, UK",
    "25.2048° N, 55.2708° E — DUBAI, UAE",
    "30.7865° N, 31.0004° E — TANTA, EGYPT",
  ];
  let pi = 0;
  el.style.transition = "opacity .3s";
  setInterval(() => {
    el.style.opacity = "0";
    setTimeout(() => {
      pi = (pi + 1) % places.length;
      el.textContent = places[pi];
      el.style.opacity = "1";
    }, 300);
  }, 5000);
}

/* ══════════ NAV ══════════════════════════════════════════════ */
const navEl = document.getElementById("nav");
let lastY = 0;
addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    navEl.style.transform =
      y > lastY + 8 && y > 80 ? "translateY(-100%)" : "translateY(0)";
    lastY = y;
    document.querySelectorAll("section[id]").forEach((s) => {
      const t = s.getBoundingClientRect().top;
      if (t < 120 && t > -s.offsetHeight + 120) {
        document
          .querySelectorAll(".nav-link")
          .forEach((l) => l.classList.remove("act"));
        const lnk = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if (lnk) lnk.classList.add("act");
      }
    });
  },
  { passive: true },
);

/* ══════════ SMOOTH SCROLL ════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) {
      e.preventDefault();
      playSection();
      t.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ══════════ KONAMI EASTER EGG ════════════════════════════════ */
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let ki = 0;
document.addEventListener("keydown", (e) => {
  ki = e.keyCode === konami[ki] ? ki + 1 : 0;
  if (ki === konami.length) {
    ki = 0;
    document.body.style.filter = "saturate(3) hue-rotate(15deg)";
    playTone(440, 0.1, "square", 0.2);
    setTimeout(() => playTone(550, 0.1, "square", 0.2), 120);
    setTimeout(() => playTone(660, 0.3, "square", 0.2), 240);
    setTimeout(() => {
      document.body.style.filter = "";
      alert("🌟 5 STAR WANTED: Exceptional Developer Detected!");
    }, 600);
  }
});



const username = "YOUR_GITHUB_USERNAME";

fetch(`https://api.github.com/users/${username}/repos`)
  .then((res) => res.json())
  .then((data) => {
    const projectsContainer = document.querySelector(".projects-grid");

    data.slice(0, 6).forEach((repo) => {
      projectsContainer.innerHTML += `
<div class="project-card">

<div class="project-image">
<i class="fas fa-code"></i>
</div>

<div class="project-info">
<h3>${repo.name}</h3>
<p>${repo.description ?? "GitHub Project"}</p>

<a href="${repo.html_url}" target="_blank" class="project-link">
View Project →
</a>

</div>
</div>
`;
    });
  });
