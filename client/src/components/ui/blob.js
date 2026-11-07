const N = 44; 

export function blobOutline(r, t, ux, uy, stretch, seed = 0) {
  const pts = new Array(N);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      0.07 * Math.sin(2 * a + t * 0.9 + seed) +
      0.05 * Math.sin(3 * a - t * 1.3 + seed * 2) +
      0.03 * Math.sin(5 * a + t * 1.7 + seed * 3);
    const x = Math.cos(a) * r * k;
    const y = Math.sin(a) * r * k;
    const along = (x * ux + y * uy) * (1 + stretch);
    const side = (-x * uy + y * ux) * (1 - stretch * 0.45);
    pts[i] = [along * ux - side * uy, along * uy + side * ux];
  }
  return pts;
}

export function outlinePath(pts, ox, oy) {
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  let d = `M${f((pts[0][0] + pts[1][0]) / 2 + ox)} ${f((pts[0][1] + pts[1][1]) / 2 + oy)}`;
  for (let i = 1; i <= n; i++) {
    const a = pts[i % n];
    const b = pts[(i + 1) % n];
    d += `Q${f(a[0] + ox)} ${f(a[1] + oy)} ${f((a[0] + b[0]) / 2 + ox)} ${f((a[1] + b[1]) / 2 + oy)}`;
  }
  return d + "Z";
}