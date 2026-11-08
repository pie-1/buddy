// client/src/components/ui/blob.js
// A calm, organic outline for the scan lens. Wobble and stretch are deliberately small.
const N = 44;

export function blobOutline(r, t, ux, uy, stretch, seed = 0) {
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      0.035 * Math.sin(2 * a + 0.55 * t + seed) +
      0.025 * Math.sin(3 * a - 0.8 * t + 2 * seed) +
      0.015 * Math.sin(5 * a + 1.0 * t + 3 * seed);
    let x = Math.cos(a) * r * k;
    let y = Math.sin(a) * r * k;
    // squash / stretch along the direction of travel
    const along = x * ux + y * uy;
    const side = -x * uy + y * ux;
    const al = along * (1 + stretch);
    const sd = side * (1 - 0.45 * stretch);
    pts.push([al * ux - sd * uy, al * uy + sd * ux]);
  }
  return pts;
}

export function outlinePath(pts, ox, oy) {
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  const mx = (i) => (pts[i % n][0] + pts[(i + 1) % n][0]) / 2 + ox;
  const my = (i) => (pts[i % n][1] + pts[(i + 1) % n][1]) / 2 + oy;
  let d = `M${f(mx(0))} ${f(my(0))}`;
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n];
    d += `Q${f(p[0] + ox)} ${f(p[1] + oy)} ${f(mx(i))} ${f(my(i))}`;
  }
  return d + "Z";
}