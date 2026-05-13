const vssSlider = document.getElementById("vssSlider") || {
  value: 100,
  disabled: false,
  addEventListener: () => {}
};

const noiseSlider = document.getElementById("noiseSlider");
const blurSlider = document.getElementById("blurSlider");
const floatersSlider = document.getElementById("floatersSlider");
const glareSlider = document.getElementById("glareSlider");
const movementSlider = document.getElementById("movementSlider");

const panel = document.querySelector(".vss-panel");
const noiseOverlay = document.querySelector(".noise-overlay");

const presetButtons = document.querySelectorAll(".preset-btn");
const advancedToggle = document.getElementById("advancedToggle");
const settingsPanel = document.querySelector(".settings-panel");

/* ===================== */
/* GLOBAL STATE */
/* ===================== */

let advancedLocked = true;

/* ===================== */
/* HUD IMAGE SWITCHING */
/* ===================== */

function showDefault() {
  document.getElementById("hudImage").src = "default.png";
}

function showVSS() {
  document.getElementById("hudImage").src = "vss.png";
}

/* ===================== */
/* TOGGLE VSS MODE */
/* ===================== */

function toggleVSS() {

  document.body.classList.toggle("vss-mode");

  const enabled = document.body.classList.contains("vss-mode");

  const sliders = [
  vssSlider,
  noiseSlider,
  blurSlider,
  floatersSlider,
  movementSlider,
  glareSlider
];

  sliders.forEach(slider => {
    slider.disabled = !enabled;
  });

  panel.style.pointerEvents = enabled ? "auto" : "none";
  panel.style.opacity = enabled ? "1" : "0.4";

  if (enabled) {

  vssSlider.value = 100;
  movementSlider.value = 50;
    noiseSlider.value = 50;
    blurSlider.value = 50;
    floatersSlider.value = 50;
    glareSlider.value = 50;

    noiseOverlay.style.display = "block";

    updateVSS();
  } else {

    vssSlider.value = 0;
    noiseSlider.value = 0;
    blurSlider.value = 0;
    floatersSlider.value = 0;
    glareSlider.value = 0;
     movementSlider.value = 0;

    document.querySelector(".page-content").style.filter = "";
    document.querySelector(".noise-overlay").style.opacity = 0;
    document.body.style.setProperty("--floaters", 0);

    noiseOverlay.style.display = "none";
  }
}

/* ===================== */
/* MAIN VSS UPDATE */
/* ===================== */

function updateVSS() {

  if (!document.body.classList.contains("vss-mode")) return;

  let intensity = vssSlider.value / 100;

  let noise = noiseSlider.value / 100;
  let blur = blurSlider.value / 100;
  let floaters = floatersSlider.value / 100;
  let glare = glareSlider.value / 100;
  let movement = movementSlider.value / 100;

  const swayX = Math.sin(Date.now() * 0.0015) * movement * 1.2;
const swayY = Math.cos(Date.now() * 0.0012) * movement * 0.2;

document.querySelector(".page-content").style.transform =
  `translate(${swayX}px, ${swayY}px)`;

const maxBrightness = 1.35;
const maxContrast = 1.25;

document.querySelector(".page-content").style.filter = `
  blur(${blur * 1.6}px)
  contrast(${1 + glare * (maxContrast - 1)})
  brightness(${1 + glare * (maxBrightness - 1)})
`;

  document.querySelector(".noise-overlay").style.opacity = noise * 0.85;

  document.body.style.setProperty("--floaters", floaters * intensity);
}

/* ===================== */
/* SLIDERS */
/* ===================== */

[
  vssSlider,
  noiseSlider,
  blurSlider,
  floatersSlider,
  glareSlider,
  movementSlider,
].forEach(slider => {
  slider.addEventListener("input", updateVSS);
});

/* ===================== */
/* START STATE */
/* ===================== */

noiseOverlay.style.display = "none";

[
  vssSlider,
  noiseSlider,
  blurSlider,
  floatersSlider,
  glareSlider
].forEach(slider => {
  slider.disabled = true;
});

/* ===================== */
/* ADVANCED TOGGLE (SAFE LOCK) */
/* ===================== */

advancedToggle.addEventListener("change", () => {

  if (advancedLocked) {
    advancedToggle.checked = false;
    return;
  }

  document.querySelectorAll(".advanced-only").forEach(el => {
    el.style.display = advancedToggle.checked ? "block" : "none";
  });
});

/* default collapsed */
document.querySelectorAll(".advanced-only").forEach(el => {
  el.style.display = "none";
});

/* ===================== */
/* PRESET SYSTEM (FIXED ACTIVE STATE) */
/* ===================== */

function applyPreset(type, event) {
  settingsPanel.classList.remove(
  "preset-default",
  "preset-vss",
  "preset-low",
  "preset-high"
);

settingsPanel.classList.add(`preset-${type}`);

  const presets = {
    default: {
      uiContrast: 70,
      fontSize: 100,
      hudScale: 100,
      brightness: 50,
      noiseIntensity: 30,
      glare: 40,
      saturation: 50
    },
    vss: {
      uiContrast: 90,
      fontSize: 120,
      hudScale: 110,
      brightness: 35,
      noiseIntensity: 70,
      glare: 65,
      saturation: 40
    },
    low: {
      uiContrast: 60,
      fontSize: 110,
      hudScale: 105,
      brightness: 45,
      noiseIntensity: 0,
      glare: 25,
      saturation: 45
    },
    high: {
      uiContrast: 100,
      fontSize: 100,
      hudScale: 100,
      brightness: 60,
      noiseIntensity: 0,
      glare: 20,
      saturation: 60
    }
  };

  const values = presets[type];
  if (!values) return;

  // apply values (if sliders exist later)
  Object.entries(values).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  /* ===================== */
  /* FIXED ACTIVE BUTTON STATE */
  /* ===================== */

  presetButtons.forEach(btn => btn.classList.remove("active"));

  const clicked =
    event?.target?.classList.contains("preset-btn")
      ? event.target
      : document.querySelector(`.preset-btn[onclick*="${type}"]`);

  if (clicked) clicked.classList.add("active");

  /* ===================== */
  /* LOCK SYSTEM */
  /* ===================== */

  if (type === "default") {

    advancedLocked = true;

    advancedToggle.checked = false;
    advancedToggle.disabled = true;

    document.querySelectorAll(".advanced-only").forEach(el => {
      el.style.display = "none";
      el.style.opacity = "0.35";
      el.style.pointerEvents = "none";
    });

  } else {

    advancedLocked = false;

    advancedToggle.disabled = false;

    document.querySelectorAll(".advanced-only").forEach(el => {
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
    });
  }

  console.log("Preset applied:", type);
}

/* ===================== */
/* ACCORDION (LOCKED CLEANLY) */
/* ===================== */

document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {

    if (advancedLocked) return;

    const group = header.parentElement;
    const isOpen = group.classList.contains("open");

    document.querySelectorAll(".settings-group").forEach(g => {
      g.classList.remove("open");
    });

    if (!isOpen) group.classList.add("open");
  });
});

/*movement animation*/
function animateVSS() {
  updateVSS();
  requestAnimationFrame(animateVSS);
}

animateVSS();

window.addEventListener("DOMContentLoaded", () => {
  applyPreset("default");
});

