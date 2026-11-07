// A living contour map drawn on <canvas>.
// Height field = slowly flowing terrain + a "wake" that the cursor leaves behind.
// The field is turned into contour lines every frame, so the LINES move and bend;
// nothing slides as a block.
//
//   npm i d3-contour
import { contours } from "d3-contour";

const CELL = 20; // px per grid cell (bigger = faster, softer lines)
const LEVELS = Array.from({ length: 24 }, (_, i) => 0.08 + i * 0.055); // fixed, so lines never "jump"
const MAJOR_EVERY = 5; // every 5th line is drawn stronger (index contour)

const LEAN = 0.5; // how far the big shapes lean with the mouse (lattice units)
const WAKE_SIGMA = 80; // width of the bump the cursor leaves (px)
const WAKE_REACH = WAKE_SIGMA * 3;
const WAKE_FADE = 0.987; // per frame @60fps: how fast the wake relaxes

// noise octaves: freq, amplitude, rotation, drift (lattice units / second)
// 1 lattice unit = 460px at freq 1, so the biggest shapes drift ~18px/s
const BASE = 1 / 460;
const OCT = [
  { f: 1.0, a: 1.0, r: 0.0, vx: 0.04, vy: 0.024 },
  { f: 2.1, a: 0.5, r: 0.7, vx: -0.07, vy: 0.045 },
  { f: 4.3, a: 0.25, r: 1.5, vx: 0.11, vy: -0.075 },
].map((o, k) => ({
  ...o,
  freq: o.f * BASE,
  c: Math.cos(o.r),
  s: Math.sin(o.r),
  ox: k * 17.31,
  oy: k * 9.77,
}));
const NORM = OCT.reduce((s, o) => s + o.a, 0);

function hash(x, y) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const fade = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = fade(x - xi);
  const yf = fade(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

// closed ring of grid points -> smooth curve (quadratic through the midpoints)
function addRing(p, ring) {
  const n = ring.length - 1; // last point repeats the first
  if (n < 3) return;
  p.moveTo(((ring[0][0] + ring[1][0]) / 2) * CELL, ((ring[0][1] + ring[1][1]) / 2) * CELL);
  for (let i = 1; i <= n; i++) {
    const a = ring[i % n];
    const b = ring[(i + 1) % n];
    p.quadraticCurveTo(a[0] * CELL, a[1] * CELL, ((a[0] + b[0]) / 2) * CELL, ((a[1] + b[1]) / 2) * CELL);
  }
  p.closePath();
}

export function createTopoField(canvas) {
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  let values, ambient, wake, wakeTmp, gen;
  let frame = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cols = Math.ceil(W / CELL) + 2; // 1 spare cell on every side
    rows = Math.ceil(H / CELL) + 2;
    values = new Float32Array(cols * rows);
    ambient = new Float32Array(cols * rows);
    wake = new Float32Array(cols * rows);
    wakeTmp = new Float32Array(cols * rows);
    gen = contours().size([cols, rows]).thresholds(LEVELS);
    frame = 0;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // sample (i,j) sits at grid pos (i+.5, j+.5) and we shift the canvas by -1 cell,
  // so its pixel position is (i - 0.5) * CELL
  function sampleAmbient(t, leanX, leanY) {
    for (let j = 0; j < rows; j++) {
      const wy = (j - 0.5) * CELL;
      for (let i = 0; i < cols; i++) {
        const wx = (i - 0.5) * CELL;
        let n = 0;
        for (let k = 0; k < 3; k++) {
          const o = OCT[k];
          const lean = k === 0 ? 1 : k === 1 ? 0.5 : 0;
          n +=
            o.a *
            noise(
              (wx * o.c - wy * o.s) * o.freq + o.vx * t + o.ox + leanX * lean,
              (wx * o.s + wy * o.c) * o.freq + o.vy * t + o.oy + leanY * lean
            );
        }
        ambient[j * cols + i] = n / NORM;
      }
    }
  }

  // the wake spreads out a little and fades, like ripples settling
  function relaxWake(dt) {
    const k = Math.pow(WAKE_FADE, dt * 60);
    for (let j = 0; j < rows; j++) {
      const row = j * cols;
      const up = (j > 0 ? j - 1 : j) * cols;
      const down = (j < rows - 1 ? j + 1 : j) * cols;
      for (let i = 0; i < cols; i++) {
        const l = i > 0 ? i - 1 : i;
        const r = i < cols - 1 ? i + 1 : i;
        wakeTmp[row + i] =
          ((wake[row + i] * 4 + wake[row + l] + wake[row + r] + wake[up + i] + wake[down + i]) / 8) * k;
      }
    }
    [wake, wakeTmp] = [wakeTmp, wake];
  }

  function stampWake(px, py, amp) {
    const inv2s2 = 1 / (2 * WAKE_SIGMA * WAKE_SIGMA);
    const i0 = Math.max(0, Math.floor((px - WAKE_REACH) / CELL + 0.5));
    const i1 = Math.min(cols - 1, Math.ceil((px + WAKE_REACH) / CELL + 0.5));
    const j0 = Math.max(0, Math.floor((py - WAKE_REACH) / CELL + 0.5));
    const j1 = Math.min(rows - 1, Math.ceil((py + WAKE_REACH) / CELL + 0.5));
    for (let j = j0; j <= j1; j++) {
      const dy = (j - 0.5) * CELL - py;
      for (let i = i0; i <= i1; i++) {
        const dx = (i - 0.5) * CELL - px;
        const g = amp * Math.exp(-(dx * dx + dy * dy) * inv2s2);
        const idx = j * cols + i;
        if (g > wake[idx]) wake[idx] = g; // max, not +: standing still never piles up
      }
    }
  }

  // t: flow time (s) · dt: frame time (s) · x,y: cursor in canvas px
  // speed: cursor speed (px/frame) · on: 0..1 · mx,my: smoothed mouse, -0.5..0.5
  function draw({ t, dt, x, y, speed, on, mx, my }) {
    // 1. height field
    if (frame++ % 2 === 0) sampleAmbient(t, -mx * LEAN, -my * LEAN); // slow drift: 30x/s is plenty
    relaxWake(dt);
    if (on > 0.02) stampWake(x, y, (0.14 + 0.34 * Math.min(1, speed / 14)) * Math.min(on, 1));
    for (let k = 0; k < values.length; k++) values[k] = ambient[k] + wake[k];

    // 2. contours -> two Path2D (normal + index lines)
    const geos = gen(values);
    const minor = new Path2D();
    const major = new Path2D();
    geos.forEach((g, i) => {
      const target = i % MAJOR_EVERY === 0 ? major : minor;
      g.coordinates.forEach((poly) => poly.forEach((ring) => addRing(target, ring)));
    });

    // 3. lines
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round";
    ctx.setTransform(dpr, 0, 0, dpr, -CELL * dpr, -CELL * dpr);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(110,110,185,.17)";
    ctx.stroke(minor);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(99,102,241,.34)";
    ctx.stroke(major);
  }

  return { draw, destroy: () => ro.disconnect() };
}