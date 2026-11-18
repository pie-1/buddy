
import { contours } from "d3-contour";

const CELL = 20;
const LEVELS = Array.from({ length: 30 }, (_, i) => 0.06 + i * 0.042);
const MAJOR_EVERY = 5;

const FILL_AT = [8, 19];

const INK = [79, 70, 229];
const VIOLET = [139, 92, 246];
const WARM = [249, 115, 22];

const mix = (a, b, k) => Math.round(a + (b - a) * k);

const LEAN = 0.2;
const WAKE_SIGMA = 120;
const WAKE_REACH = WAKE_SIGMA * 3;
const WAKE_FADE = 0.985;

const RIPPLE_LIFE = 2.5;
const RIPPLE_SPEED = 400;
const RIPPLE_W = 45;
const RIPPLE_AMP = 0.25;

const BASE = 1 / 460;

const OCT = [
  { f: 1.0, a: 1.0, r: 0.0, vx: 0.02, vy: 0.012, flow: 1.0 },
  { f: 2.1, a: 0.5, r: 0.7, vx: -0.035, vy: 0.022, flow: 1.4 },
  { f: 4.3, a: 0.25, r: 1.5, vx: 0.055, vy: -0.037, flow: 1.9 },
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

  return (
    a +
    (b - a) * xf +
    (c - a) * yf +
    (a - b - c + d) * xf * yf
  );
}

function addRing(p, ring) {
  const n = ring.length - 1;
  if (n < 3) return;

  p.moveTo(
    ((ring[0][0] + ring[1][0]) / 2) * CELL,
    ((ring[0][1] + ring[1][1]) / 2) * CELL
  );

  for (let i = 1; i <= n; i++) {
    const a = ring[i % n];
    const b = ring[(i + 1) % n];

    p.quadraticCurveTo(
      a[0] * CELL,
      a[1] * CELL,
      ((a[0] + b[0]) / 2) * CELL,
      ((a[1] + b[1]) / 2) * CELL
    );
  }

  p.closePath();
}

export function createTopoField(canvas) {
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;

  let values;
  let ambient;
  let wake;
  let wakeTmp;
  let gen;

  let frame = 0;
  let cost = 0;
  let rich = true;

  const ripples = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = canvas.clientWidth;
    H = canvas.clientHeight;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    cols = Math.ceil(W / CELL) + 2;
    rows = Math.ceil(H / CELL) + 2;

    values = new Float32Array(cols * rows);
    ambient = new Float32Array(cols * rows);
    wake = new Float32Array(cols * rows);
    wakeTmp = new Float32Array(cols * rows);

    gen = contours()
      .size([cols, rows])
      .thresholds(LEVELS);

    frame = 0;
  };

  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function sampleAmbient(t, leanX, leanY, flow) {
    for (let j = 0; j < rows; j++) {
      const wy = (j - 0.5) * CELL;

      for (let i = 0; i < cols; i++) {
        const wx = (i - 0.5) * CELL;

        let n = 0;

        for (let k = 0; k < 3; k++) {
          const o = OCT[k];

          const lean = k === 0 ? 1 : k === 1 ? 0.5 : 0;
          const fl = flow * o.flow;

          n +=
            o.a *
            noise(
              (wx * o.c - wy * o.s) * o.freq +
                o.vx * t +
                o.ox +
                leanX * lean +
                fl,
              (wx * o.s + wy * o.c) * o.freq +
                o.vy * t +
                o.oy +
                leanY * lean +
                fl * 0.6
            );
        }

        ambient[j * cols + i] = n / NORM;
      }
    }
  }

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
          ((wake[row + i] * 4 +
            wake[row + l] +
            wake[row + r] +
            wake[up + i] +
            wake[down + i]) /
            8) *
          k;
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

        if (g > wake[idx]) wake[idx] = g;
      }
    }
  }

  function pulse(px, py) {
    ripples.push({
      x: px,
      y: py,
      t0: performance.now() / 1000,
    });

    if (ripples.length > 6) ripples.shift();
  }

  function applyRipples(t) {
    for (let n = ripples.length - 1; n >= 0; n--) {
      const rp = ripples[n];
      const age = t - rp.t0;

      if (age > RIPPLE_LIFE) {
        ripples.splice(n, 1);
        continue;
      }

      const R = age * RIPPLE_SPEED;
      const amp = RIPPLE_AMP * (1 - age / RIPPLE_LIFE);
      const reach = R + RIPPLE_W * 3;

      const i0 = Math.max(0, Math.floor((rp.x - reach) / CELL + 0.5));
      const i1 = Math.min(cols - 1, Math.ceil((rp.x + reach) / CELL + 0.5));
      const j0 = Math.max(0, Math.floor((rp.y - reach) / CELL + 0.5));
      const j1 = Math.min(rows - 1, Math.ceil((rp.y + reach) / CELL + 0.5));

      for (let j = j0; j <= j1; j++) {
        const dy = (j - 0.5) * CELL - rp.y;

        for (let i = i0; i <= i1; i++) {
          const dx = (i - 0.5) * CELL - rp.x;
          const g = (Math.hypot(dx, dy) - R) / RIPPLE_W;

          if (g > 3 || g < -3) continue;

          values[j * cols + i] += amp * Math.exp(-(g * g) / 2);
        }
      }
    }
  }

  function drawRipples(t) {
    for (const rp of ripples) {
      const age = t - rp.t0;

      if (age < 0 || age > RIPPLE_LIFE) continue;

      const k = 1 - age / RIPPLE_LIFE;
      const R = age * RIPPLE_SPEED;

      const cx = rp.x + CELL;
      const cy = rp.y + CELL;

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(139,92,246,${0.48 * k})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.8, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(249,115,22,${0.25 * k})`;
      ctx.stroke();
    }
  }

  function draw({ t, dt, x, y, speed, on, mx, my, flow = 0 }) {
    const started = performance.now();

    if (frame++ % 2 === 0) {
      sampleAmbient(t, -mx * LEAN, -my * LEAN, flow);
    }

    relaxWake(dt);

    if (on > 0.02) {
      stampWake(
        x,
        y,
        (0.1 + 0.22 * Math.min(1, speed / 14)) * Math.min(on, 1)
      );
    }

    for (let k = 0; k < values.length; k++) {
      values[k] = ambient[k] + wake[k];
    }

    applyRipples(t);

    const geos = gen(values);

    const minor = new Path2D();
    const major = new Path2D();
    const fills = [];

    geos.forEach((g, i) => {
      const target = i % MAJOR_EVERY === 0 ? major : minor;
      const fp = rich && FILL_AT.includes(i) ? new Path2D() : null;

      g.coordinates.forEach((poly) => {
        poly.forEach((ring) => {
          addRing(target, ring);

          if (fp) addRing(fp, ring);
        });
      });

      if (fp) fills.push(fp);
    });

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.setTransform(dpr, 0, 0, dpr, -CELL * dpr, -CELL * dpr);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalAlpha = 1;

    const glow = Math.min(1, on);
    const hx = x + CELL;
    const hy = y + CELL;

    const breath = 0.96 + 0.04 * Math.sin(t * 0.5);

    // Subtle terrain fill
    ctx.globalAlpha = breath;
    ctx.fillStyle = "rgba(99,102,241,0.055)";

    for (const fp of fills) {
      ctx.fill(fp, "evenodd");
    }

    // Minor contour lines
    const gMinor = ctx.createRadialGradient(
      hx, hy, 0,
      hx, hy, 420
    );

    gMinor.addColorStop(
      0,
      `rgba(${mix(79, 139, glow)},${mix(70, 92, glow)},${mix(229, 246, glow)},0.58)`
    );

    gMinor.addColorStop(
      0.55,
      "rgba(99,102,241,0.43)"
    );

    gMinor.addColorStop(
      1,
      "rgba(99,102,241,0.30)"
    );

    ctx.globalAlpha = breath;
    ctx.lineWidth = 1.15;
    ctx.strokeStyle = gMinor;
    ctx.stroke(minor);

    // Major contour lines
    const gMajor = ctx.createRadialGradient(
      hx, hy, 30,
      hx, hy, 460
    );

    gMajor.addColorStop(
      0,
      `rgba(${mix(67, 139, glow)},${mix(56, 92, glow)},${mix(202, 246, glow)},0.88)`
    );

    gMajor.addColorStop(
      0.5,
      "rgba(124,103,238,0.75)"
    );

    gMajor.addColorStop(
      1,
      "rgba(99,102,241,0.53)"
    );

    ctx.globalAlpha = breath;
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = gMajor;
    ctx.stroke(major);

    // Cursor glow
    if (glow > 0.02) {
      const gBoost = ctx.createRadialGradient(
        hx, hy, 0,
        hx, hy, 260
      );

      gBoost.addColorStop(
        0,
        `rgba(249,115,22,${0.32 * glow})`
      );

      gBoost.addColorStop(
        0.45,
        `rgba(139,92,246,${0.22 * glow})`
      );

      gBoost.addColorStop(
        1,
        "rgba(139,92,246,0)"
      );

      ctx.globalAlpha = 1;
      ctx.lineWidth = 7;
      ctx.strokeStyle = gBoost;
      ctx.stroke(major);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(255,255,255,${0.55 * glow})`;
      ctx.stroke(major);
    }

    // Click ripples
    ctx.globalAlpha = 1;
    drawRipples(t);

    cost += (performance.now() - started - cost) * 0.05;

    if (rich && cost > 11) {
      rich = false;
    } else if (!rich && cost < 6) {
      rich = true;
    }
  }

  return {
    draw,
    pulse,
    destroy: () => ro.disconnect(),
  };
}
