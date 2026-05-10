const vssSlider = document.getElementById("vssSlider");

const noiseSlider = document.getElementById("noiseSlider");
const blurSlider = document.getElementById("blurSlider");
const floatersSlider = document.getElementById("floatersSlider");
const glareSlider = document.getElementById("glareSlider");

const panel = document.querySelector(".vss-panel");

/* HUD SWITCH */
function showDefault() {
  document.getElementById("hudImage").src = "default.png";
}

function showVSS() {
  document.getElementById("hudImage").src = "vss.png";
}

/* TOGGLE VSS MODE */
function toggleVSS() {
  document.body.classList.toggle("vss-mode");

  const enabled = document.body.classList.contains("vss-mode");

  vssSlider.disabled = !enabled;

  panel.style.pointerEvents = enabled ? "auto" : "none";
  panel.style.opacity = enabled ? "1" : "0.4";

  if (!enabled) {
    vssSlider.value = 0;
    document.body.style.filter = "";
  }
}

/* INTENSITY SLIDER */
vssSlider.addEventListener("input", () => {
  let v = vssSlider.value / 100;

  document.body.style.filter =
    `blur(${v * 1.5}px) contrast(${1 + v * 0.4}) brightness(${1 + v * 0.1})`;
});

/* EXTRA SETTINGS */
function updateVSS() {
  let blur = blurSlider.value / 100;
  let glare = glareSlider.value / 100;
  let floaters = floatersSlider.value / 100;

  document.body.style.filter = `
    blur(${blur * 2}px)
    contrast(${1 + glare * 0.5})
    brightness(${1 + glare * 0.3})
  `;

  document.body.style.setProperty("--floaters", floaters);
}

[blurSlider, glareSlider, floatersSlider].forEach(slider => {
  slider.addEventListener("input", updateVSS);
});