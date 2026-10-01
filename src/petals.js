export function initialize3DPetals() {
  const field = document.querySelector(".rose-petal-field");
  const wedding = document.getElementById("wedding");
  const photo = document.getElementById("photo-dialog");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let scene;
  let loading = false;
  let unavailable = false;

  function shouldRun() {
    return !wedding.hidden && !document.hidden && !photo.open && !reducedMotion.matches;
  }

  async function synchronize() {
    if (scene) {
      if (shouldRun()) scene.start();
      else scene.pause();
      return;
    }
    if (loading || unavailable || !shouldRun()) return;
    loading = true;
    const canvas = document.createElement("canvas");
    canvas.className = "rose-petal-canvas";
    canvas.setAttribute("aria-hidden", "true");

    function fallback() {
      unavailable = true;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      scene?.dispose();
      scene = undefined;
      canvas.remove();
      field.classList.remove("has-3d-petals");
      field.dataset.renderer = "css";
      delete field.dataset.motion;
    }
    function onContextLost(event) {
      event.preventDefault();
      fallback();
    }

    try {
      const context = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      if (!context) {
        fallback();
        return;
      }
      canvas.addEventListener("webglcontextlost", onContextLost);
      const { createPetalScene } = await import("./petal-scene.js");
      if (unavailable || context.isContextLost()) {
        fallback();
        return;
      }
      field.append(canvas);
      scene = createPetalScene(canvas, context, field, fallback);
      field.classList.add("has-3d-petals");
      field.dataset.renderer = "three";
    } catch {
      fallback();
    } finally {
      loading = false;
    }
    if (scene) {
      if (shouldRun()) scene.start();
      else scene.pause();
    }
  }

  const stateObserver = new MutationObserver(synchronize);
  stateObserver.observe(wedding, { attributes: true, attributeFilter: ["hidden"] });
  stateObserver.observe(photo, { attributes: true, attributeFilter: ["open"] });
  reducedMotion.addEventListener("change", synchronize);
  document.addEventListener("visibilitychange", synchronize);
  window.addEventListener("pagehide", () => scene?.pause());
  window.addEventListener("pageshow", synchronize);
  synchronize();
}
