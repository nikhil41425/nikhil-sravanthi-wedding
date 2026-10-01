import {
  AmbientLight, BufferGeometry, Color, DirectionalLight, DoubleSide,
  Float32BufferAttribute, Mesh, MeshPhongMaterial, PerspectiveCamera,
  Scene, WebGLRenderer,
} from "three";

function createPetalGeometry() {
  const positions = [];
  const colors = [];
  const indices = [];
  const rows = 16;
  const columns = 12;
  const wine = new Color("#8f2543");
  const blush = new Color("#ed8fa8");
  const color = new Color();
  for (let row = 0; row <= rows; row++) {
    const v = row / rows;
    const width = Math.pow(Math.sin(Math.PI * v), .55) * (.52 + .14 * v);
    for (let column = 0; column <= columns; column++) {
      const u = column / columns * 2 - 1;
      const x = u * width;
      // A cupped surface and curled edge give each petal real depth.
      positions.push(x, (v - .5) * 1.5, .22 * u * u + .16 * Math.sin(Math.PI * v) + .14 * v * v + .05 * x * v);
      color.copy(wine).lerp(blush, Math.min(1, .25 + .5 * v + .25 * Math.abs(u)));
      colors.push(color.r, color.g, color.b);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        const b = a + 1;
        const d = a + columns + 1;
        indices.push(a, b, d, b, d + 1, d);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createPetalScene(canvas, context, field, onFailure) {
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 10, 4000);
  scene.add(new AmbientLight(0xfff5ee, .75));
  const light = new DirectionalLight(0xfff5f1, 1.2);
  light.position.set(-250, 400, 700);
  scene.add(light);
  const fill = new DirectionalLight(0xffccd5, .35);
  fill.position.set(250, -100, 300);
  scene.add(fill);
  const geometry = createPetalGeometry();
  const petals = [6, 91, 23, 76, 12, 86, 38, 64, 4, 95, 29, 71].map((left, index) => {
    const material = new MeshPhongMaterial({
      vertexColors: true,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
      shininess: 28,
      specular: new Color("#9e626f"),
    });
    const mesh = new Mesh(geometry, material);
    mesh.scale.setScalar(12 + index % 4 * 1.5);
    scene.add(mesh);
    return { mesh, left, duration: 14 + index % 5 * 1.7, opacity: index >= 6 && left > 20 && left < 80 ? .3 : .58 };
  });
  let width = 1;
  let height = 1;
  let elapsed = 0;
  let previousTime = 0;
  let running = false;
  let disposed = false;

  function draw() {
    petals.forEach(({ mesh, left, duration, opacity }, index) => {
      const phase = ((elapsed + index * 2.3 + 1) / duration) % 1;
      mesh.position.set(
        (left / 100 - .5) * width + Math.sin(phase * Math.PI * 2 + index) * 18,
        height / 2 + 40 - phase * (height + 80),
        -120 + index % 4 * 65 + Math.sin(elapsed * .35 + index) * 18,
      );
      mesh.rotation.set(Math.sin(elapsed * .6 + index) * .65, elapsed * (.65 + index % 3 * .15) + index * .6, Math.sin(elapsed * .7 + index) * .65);
      const edgeFade = Math.min(1, phase / .08, (1 - phase) / .1);
      mesh.material.opacity = opacity * edgeFade;
    });
    renderer.render(scene, camera);
  }

  function resize() {
    width = Math.max(1, field.clientWidth);
    height = Math.max(1, field.clientHeight);
    camera.aspect = width / height;
    camera.position.z = height / (2 * Math.tan(Math.PI / 9));
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }
  resize();
  const resizeObserver = new ResizeObserver(() => {
    if (!disposed) {
      try { resize(); } catch { onFailure(); }
    }
  });
  resizeObserver.observe(field);

  function pause() {
    running = false;
    renderer.setAnimationLoop(null);
    field.dataset.motion = "paused";
  }
  return {
    start() {
      if (running || disposed) return;
      running = true;
      previousTime = performance.now();
      field.dataset.motion = "running";
      renderer.setAnimationLoop((time) => {
        if (time - previousTime < 1000 / 30) return;
        elapsed += Math.min((time - previousTime) / 1000, .08);
        previousTime = time;
        try { draw(); } catch { onFailure(); }
      });
    },
    pause,
    dispose() {
      if (disposed) return;
      disposed = true;
      pause();
      resizeObserver.disconnect();
      geometry.dispose();
      petals.forEach(({ mesh }) => mesh.material.dispose());
      renderer.dispose();
    },
  };
}
