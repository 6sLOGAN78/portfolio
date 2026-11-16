import * as THREE from 'three';
import gsap from 'gsap';

export interface Scene {
  morph(shape: number, x: number): void;
  setScroll(v: number): void;
  pulse(): void;
}

const SHAPES = 6;

function rnd(a = 1, b = 0) {
  return b + Math.random() * (a - b);
}

function sphere(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = g * i;
    const shell = i % 7 === 0 ? rnd(1.25, 0.5) : 2.15;
    out[i * 3] = Math.cos(t) * r * shell;
    out[i * 3 + 1] = y * shell;
    out[i * 3 + 2] = Math.sin(t) * r * shell;
  }
  return out;
}

function helix(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const turns = 3.2;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const y = (u - 0.5) * 6.4;
    const a = u * Math.PI * 2 * turns;
    const kind = i % 5;
    let x: number, z: number;
    if (kind < 2) {
      x = Math.cos(a) * 1.25;
      z = Math.sin(a) * 1.25;
    } else if (kind < 4) {
      x = Math.cos(a + Math.PI) * 1.25;
      z = Math.sin(a + Math.PI) * 1.25;
    } else {
      // rungs, snapped to discrete steps along the helix
      const step = Math.round(u * 46) / 46;
      const ra = step * Math.PI * 2 * turns;
      const k = rnd(1, -1) * 1.25;
      x = Math.cos(ra) * k;
      z = Math.sin(ra) * k;
      out[i * 3 + 1] = (step - 0.5) * 6.4;
      out[i * 3] = x;
      out[i * 3 + 2] = z;
      continue;
    }
    const j = 0.07;
    out[i * 3] = x + rnd(j, -j);
    out[i * 3 + 1] = y + rnd(j, -j);
    out[i * 3 + 2] = z + rnd(j, -j);
  }
  return out;
}

function network(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const sizes = [4, 7, 9, 7, 3];
  const nodes: THREE.Vector3[][] = sizes.map((count, li) => {
    const x = (li - (sizes.length - 1) / 2) * 1.45;
    return Array.from({ length: count }, (_, k) => {
      const y = (k - (count - 1) / 2) * 0.62;
      return new THREE.Vector3(x, y, rnd(0.5, -0.5));
    });
  });
  const flat = nodes.flat();
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  for (let l = 0; l < nodes.length - 1; l++)
    for (const a of nodes[l]) for (const b of nodes[l + 1]) edges.push([a, b]);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    if (i % 3 === 0) {
      const c = flat[i % flat.length];
      v.set(rnd(1, -1), rnd(1, -1), rnd(1, -1)).normalize().multiplyScalar(rnd(0.13, 0.02)).add(c);
    } else {
      const [a, b] = edges[(i * 7) % edges.length];
      v.lerpVectors(a, b, Math.random());
    }
    out[i * 3] = v.x;
    out[i * 3 + 1] = v.y;
    out[i * 3 + 2] = v.z;
  }
  return out;
}

function knot(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const p = 2, q = 3;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 * p;
    const r = 1.35 + 0.6 * Math.cos((q * t) / p);
    const cx = r * Math.cos(t), cy = r * Math.sin(t), cz = 0.75 * Math.sin((q * t) / p);
    const a = Math.random() * Math.PI * 2;
    const tube = Math.sqrt(Math.random()) * 0.24;
    out[i * 3] = cx + Math.cos(a) * tube * Math.cos(t);
    out[i * 3 + 1] = cy + Math.cos(a) * tube * Math.sin(t);
    out[i * 3 + 2] = cz + Math.sin(a) * tube;
  }
  return out;
}

function wave(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const cols = Math.ceil(Math.sqrt(n * 1.6));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const cx = (i % cols) / (cols - 1) - 0.5;
    const cz = Math.floor(i / cols) / (rows - 1) - 0.5;
    const x = cx * 8.4, z = cz * 5.2;
    out[i * 3] = x;
    out[i * 3 + 1] = Math.sin(x * 1.3) * 0.38 + Math.cos(z * 1.7 + x * 0.6) * 0.34 - 0.5;
    out[i * 3 + 2] = z;
  }
  return out;
}

function galaxy(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const arm = i % 3;
    const r = Math.pow(Math.random(), 0.65) * 3.1 + 0.12;
    const a = (arm / 3) * Math.PI * 2 + r * 1.25 + rnd(0.32, -0.32) / (0.4 + r * 0.4);
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = rnd(1, -1) * 0.2 * Math.exp(-r * 0.5);
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}

const vert = /* glsl */ `
uniform float uTime;
uniform float uShape;
uniform float uSize;
uniform float uScale;
uniform float uPulse;
uniform vec3 uMouse;
attribute vec3 p1;
attribute vec3 p2;
attribute vec3 p3;
attribute vec3 p4;
attribute vec3 p5;
attribute float aRand;
varying float vRand;
varying float vDepth;

vec3 pick(float i) {
  if (i < 0.5) return position;
  if (i < 1.5) return p1;
  if (i < 2.5) return p2;
  if (i < 3.5) return p3;
  if (i < 4.5) return p4;
  return p5;
}

void main() {
  float s = clamp(uShape, 0.0, 5.0);
  float i0 = floor(s);
  float f = s - i0;
  // each particle leaves and arrives at its own moment
  float t = smoothstep(0.0, 1.0, clamp(f * 1.6 - aRand * 0.6, 0.0, 1.0));
  vec3 a = pick(i0);
  vec3 b = pick(min(i0 + 1.0, 5.0));
  vec3 p = mix(a, b, t);

  // scatter mid-flight so the morph reads as a swarm, not a slide
  float mid = sin(t * 3.14159);
  vec3 n = vec3(
    sin(aRand * 91.7 + uTime * 0.6),
    cos(aRand * 57.3 + uTime * 0.5),
    sin(aRand * 23.1 - uTime * 0.7)
  );
  p += n * (mid * 0.9 + 0.035 + uPulse * 0.5);

  // breathing
  p += normalize(p + 0.0001) * sin(uTime * 0.8 + aRand * 6.2831) * 0.03;

  // pointer pushes particles away
  vec3 d = p - uMouse;
  float dist = length(d);
  p += normalize(d + 0.0001) * smoothstep(1.3, 0.0, dist) * 0.55;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uScale * (0.6 + aRand * 0.9) / -mv.z;
  vRand = aRand;
  vDepth = clamp((-mv.z - 3.5) / 6.0, 0.0, 1.0);
}
`;

const frag = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uOpacity;
varying float vRand;
varying float vDepth;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.18, d);
  vec3 c = mix(uColor, uAccent, step(0.82, vRand));
  gl_FragColor = vec4(c, a * uOpacity * mix(1.0, 0.28, vDepth));
}
`;

export function createScene(canvas: HTMLCanvasElement, reduced: boolean): Scene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  const small = window.innerWidth < 760;
  const weak = (navigator.hardwareConcurrency || 4) <= 4;
  let count = small ? 7000 : weak ? 12000 : 20000;
  let dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x0a0a0b, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.z = 7.2;

  const geo = new THREE.BufferGeometry();
  const shapes = [sphere, helix, network, knot, wave, galaxy].map((fn) => fn(count));
  geo.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3));
  for (let i = 1; i < SHAPES; i++) geo.setAttribute('p' + i, new THREE.BufferAttribute(shapes[i], 3));
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) rand[i] = Math.random();
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

  const uniforms = {
    uTime: { value: 0 },
    uShape: { value: 0 },
    uSize: { value: small ? 30 : 36 },
    uScale: { value: 1 },
    uPulse: { value: 0 },
    uOpacity: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 99) },
    uColor: { value: new THREE.Color('#efece4') },
    uAccent: { value: new THREE.Color('#ff5a1f') },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const target = { x: small ? 0 : 1.9, tilt: 0.18 };
  group.position.x = target.x;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the form inside narrow screens
    camera.position.z = w < 760 ? 9.5 : 7.2;
    camera.updateProjectionMatrix();
    uniforms.uScale.value = (h / 900) * dpr;
  }
  resize();
  window.addEventListener('resize', resize);

  const ndc = new THREE.Vector2(0, 0);
  const ptr = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const inv = new THREE.Matrix4();
  let hasPointer = false;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    hasPointer = true;
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  });

  let scroll = 0;
  let running = true;
  let visible = true;
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible && running) requestAnimationFrame(frame);
  });

  const clock = new THREE.Clock();
  let frames = 0, acc = 0, checked = false;

  function frame() {
    if (!visible || !running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.uTime.value += dt;

    ptr.lerp(ndc, 0.06);
    group.rotation.y += dt * 0.11;
    group.rotation.x = target.tilt + ptr.y * -0.18 + scroll * 0.35;
    group.rotation.z = ptr.x * 0.06;
    camera.position.x = ptr.x * 0.35;
    camera.position.y = ptr.y * 0.22;
    camera.lookAt(0, 0, 0);

    if (hasPointer) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        group.updateMatrixWorld();
        inv.copy(group.matrixWorld).invert();
        uniforms.uMouse.value.lerp(hit.applyMatrix4(inv), 0.2);
      }
    }
    renderer.render(scene, camera);

    // drop detail once if the machine cannot hold a decent frame rate
    if (!checked) {
      frames++;
      acc += dt;
      if (acc > 2.5) {
        checked = true;
        if (frames / acc < 34) {
          count = Math.floor(count * 0.45);
          geo.setDrawRange(0, count);
          dpr = 1;
          renderer.setPixelRatio(1);
          uniforms.uSize.value *= 1.35;
          resize();
        }
      }
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  gsap.to(uniforms.uOpacity, { value: small ? 0.6 : 0.8, duration: 2.2, delay: 0.2, ease: 'power2.out' });
  if (reduced) {
    // one still frame per change, no continuous motion
    uniforms.uOpacity.value = 0.5;
    frame();
  } else {
    requestAnimationFrame(frame);
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
    document.documentElement.classList.add('no-webgl');
  });

  return {
    morph(shape, x) {
      const tx = window.innerWidth < 760 ? 0 : x;
      if (reduced) {
        uniforms.uShape.value = shape;
        group.position.x = tx;
        frame();
        return;
      }
      gsap.to(uniforms.uShape, { value: shape, duration: 1.9, ease: 'power2.inOut', overwrite: true });
      gsap.to(group.position, { x: tx, duration: 1.9, ease: 'power3.inOut', overwrite: true });
    },
    setScroll(v) {
      scroll = v;
    },
    pulse() {
      if (reduced) return;
      gsap.fromTo(uniforms.uPulse, { value: 0.5 }, { value: 0, duration: 1.1, ease: 'power2.out', overwrite: true });
    },
  };
}
