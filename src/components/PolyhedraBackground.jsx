// // import { useRef, useEffect } from 'react';

// // // ── Geometry helpers ──
// // const vec3 = (x, y, z) => ({ x, y, z });

// // function icosahedronVerts(r) {
// //   const t = (1 + Math.sqrt(5)) / 2;
// //   const n = r / Math.sqrt(1 + t * t);
// //   return [
// //     vec3(-n, t*n, 0), vec3(n, t*n, 0), vec3(-n, -t*n, 0), vec3(n, -t*n, 0),
// //     vec3(0, -n, t*n), vec3(0, n, t*n), vec3(0, -n, -t*n), vec3(0, n, -t*n),
// //     vec3(t*n, 0, -n), vec3(t*n, 0, n), vec3(-t*n, 0, -n), vec3(-t*n, 0, n),
// //   ];
// // }
// // const ICO_EDGES = [
// //   [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
// //   [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
// //   [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
// //   [7,8],[7,10],[8,9],[10,11]
// // ];
// // const ICO_FACES = [
// //   [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
// //   [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
// //   [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
// //   [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
// // ];

// // function octahedronVerts(r) {
// //   return [vec3(r,0,0), vec3(-r,0,0), vec3(0,r,0), vec3(0,-r,0), vec3(0,0,r), vec3(0,0,-r)];
// // }
// // const OCT_EDGES = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];

// // function cubeVerts(r) {
// //   const s = r * 0.577;
// //   return [
// //     vec3(-s,-s,-s), vec3(s,-s,-s), vec3(s,s,-s), vec3(-s,s,-s),
// //     vec3(-s,-s,s), vec3(s,-s,s), vec3(s,s,s), vec3(-s,s,s),
// //   ];
// // }
// // const CUBE_EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

// // function diamondVerts(r) {
// //   return [vec3(0,r,0), vec3(0,-r,0), vec3(r*0.5,0,0), vec3(-r*0.5,0,0), vec3(0,0,r*0.5), vec3(0,0,-r*0.5)];
// // }
// // const DIAMOND_EDGES = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]];

// // function rotateVec3(v, ax, ay, az) {
// //   let { x, y, z } = v;
// //   let c = Math.cos(ax), s = Math.sin(ax);
// //   let y1 = y*c - z*s, z1 = y*s + z*c;
// //   y = y1; z = z1;
// //   c = Math.cos(ay); s = Math.sin(ay);
// //   let x1 = x*c + z*s; z1 = -x*s + z*c;
// //   x = x1; z = z1;
// //   c = Math.cos(az); s = Math.sin(az);
// //   x1 = x*c - y*s; y1 = x*s + y*c;
// //   return { x: x1, y: y1, z: z1 };
// // }

// // function project(v, cx, cy, fov) {
// //   const scale = fov / (fov + v.z);
// //   return { x: cx + v.x * scale, y: cy + v.y * scale, scale };
// // }

// // const WIRE_COLORS = [
// //   'rgba(212,170,90,',  // gold
// //   'rgba(200,130,70,',  // copper
// //   'rgba(230,190,110,', // amber
// //   'rgba(210,160,140,', // rose
// // ];

// // const PolyhedraBackground = () => {
// //   const canvasRef = useRef(null);
// //   const rafRef = useRef(null);

// //   useEffect(() => {
// //     const canvas = canvasRef.current;
// //     if (!canvas) return;

// //     const ctx = canvas.getContext('2d');
// //     const dpr = window.devicePixelRatio || 1;
// //     let width = 0, height = 0;

// //     const resize = () => {
// //       const rect = canvas.getBoundingClientRect();
// //       width = rect.width;
// //       height = rect.height;
// //       canvas.width = Math.max(1, Math.floor(width * dpr));
// //       canvas.height = Math.max(1, Math.floor(height * dpr));
// //       ctx.setTransform(1, 0, 0, 1, 0, 0);
// //       ctx.scale(dpr, dpr);
// //     };
// //     resize();
// //     window.addEventListener('resize', resize);

// //     const fov = 500;

// //     function draw(now) {
// //       ctx.clearRect(0, 0, width, height);

// //       const mobile = width < 820;
// //       const cx = mobile ? width * 0.5  : width * 0.75;
// //       const cy = mobile ? height * 0.72 : height * 0.5;

// //       const polyRadius = mobile
// //         ? Math.min(width, height * 0.5) * 0.32
// //         : Math.min(width * 0.22, height * 0.44);

// //       const icoV  = icosahedronVerts(polyRadius);
// //       const octV  = octahedronVerts(polyRadius * 0.6);
// //       const cubeV = cubeVerts(polyRadius * 0.4);
// //       const diaV  = diamondVerts(polyRadius * 0.22);

// //       const shapes = [
// //         { verts: icoV,  edges: ICO_EDGES,     faces: ICO_FACES, color: WIRE_COLORS[0], sax: 0.0003, say: 0.0004, saz: 0.0001, lw: 1.2 },
// //         { verts: octV,  edges: OCT_EDGES,     faces: null,      color: WIRE_COLORS[1], sax: 0.0005, say: 0.0002, saz: 0.0003, lw: 1.0 },
// //         { verts: cubeV, edges: CUBE_EDGES,    faces: null,      color: WIRE_COLORS[2], sax: 0.0002, say: 0.0006, saz: 0.0004, lw: 0.8 },
// //         { verts: diaV,  edges: DIAMOND_EDGES, faces: null,      color: WIRE_COLORS[3], sax: 0.0007, say: 0.0003, saz: 0.0005, lw: 0.7 },
// //       ];

// //       // Pulsing core glow
// //       const corePulse = 0.5 + Math.sin(now * 0.002) * 0.3;
// //       const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, polyRadius * 1.2);
// //       coreGrd.addColorStop(0, `rgba(212,170,90,${0.12 * corePulse})`);
// //       coreGrd.addColorStop(0.5, `rgba(212,170,90,${0.04 * corePulse})`);
// //       coreGrd.addColorStop(1, 'rgba(212,170,90,0)');
// //       ctx.beginPath();
// //       ctx.arc(cx, cy, polyRadius * 1.2, 0, Math.PI * 2);
// //       ctx.fillStyle = coreGrd;
// //       ctx.fill();

// //       for (const shape of shapes) {
// //         const ax = now * shape.sax;
// //         const ay = now * shape.say;
// //         const az = now * shape.saz;

// //         const projected = shape.verts.map(v => {
// //           const rv = rotateVec3(v, ax, ay, az);
// //           return { ...project(rv, cx, cy, fov), z: rv.z };
// //         });

// //         // Translucent faces (icosahedron)
// //         if (shape.faces) {
// //           for (const [a, b, c] of shape.faces) {
// //             const avgZ = (projected[a].z + projected[b].z + projected[c].z) / 3;
// //             const faceAlpha = 0.03 + (avgZ + polyRadius) / (polyRadius * 2) * 0.04;
// //             ctx.beginPath();
// //             ctx.moveTo(projected[a].x, projected[a].y);
// //             ctx.lineTo(projected[b].x, projected[b].y);
// //             ctx.lineTo(projected[c].x, projected[c].y);
// //             ctx.closePath();
// //             ctx.fillStyle = `${shape.color}${faceAlpha})`;
// //             ctx.fill();
// //           }
// //         }

// //         // Depth-sorted edges
// //         const edgesWithDepth = shape.edges.map(([a, b]) => ({
// //           a, b, z: (projected[a].z + projected[b].z) / 2
// //         }));
// //         edgesWithDepth.sort((a, b) => a.z - b.z);

// //         for (const edge of edgesWithDepth) {
// //           const pa = projected[edge.a], pb = projected[edge.b];
// //           const depthFactor = 0.4 + (edge.z + polyRadius) / (polyRadius * 2) * 0.6;

// //           // Glow (subtle)
// //           ctx.beginPath();
// //           ctx.moveTo(pa.x, pa.y);
// //           ctx.lineTo(pb.x, pb.y);
// //           ctx.strokeStyle = `${shape.color}${0.1 * depthFactor})`;
// //           ctx.lineWidth = shape.lw * 2;
// //           ctx.stroke();

// //           // Core line
// //           ctx.beginPath();
// //           ctx.moveTo(pa.x, pa.y);
// //           ctx.lineTo(pb.x, pb.y);
// //           ctx.strokeStyle = `${shape.color}${0.85 * depthFactor})`;
// //           ctx.lineWidth = shape.lw;
// //           ctx.stroke();
// //         }

// //         // Vertex glows
// //         for (const p of projected) {
// //           const vGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3 * p.scale);
// //           vGrd.addColorStop(0, `${shape.color}0.6)`);
// //           vGrd.addColorStop(1, `${shape.color}0)`);
// //           ctx.beginPath();
// //           ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
// //           ctx.fillStyle = vGrd;
// //           ctx.fill();
// //         }
// //       }

// //       rafRef.current = requestAnimationFrame(draw);
// //     }

// //     rafRef.current = requestAnimationFrame(draw);

// //     return () => {
// //       cancelAnimationFrame(rafRef.current);
// //       window.removeEventListener('resize', resize);
// //     };
// //   }, []);

// //   return <canvas ref={canvasRef} className="polyhedra-canvas-bg" aria-hidden="true" />;
// // };

// // export default PolyhedraBackground;

// import { useRef, useEffect } from 'react';

// // ═══════════════════════════════════════════════════════════════
// // POLYHEDRA — new 5-shape code (dod + ico + oct + cub + dia)
// // ORANGE brand color, 15-second animation cycle, sized to fit
// // entirely inside the right panel with no edge clipping.
// // ═══════════════════════════════════════════════════════════════

// const ORANGE = '232, 118, 43';
// const DURATION = 15000; // ms per full rotation cycle

// // ── Geometry ────────────────────────────────────────────────────
// function icoRaw() {
//   const t = (1 + Math.sqrt(5)) / 2;
//   const v = [
//     [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
//     [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
//     [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
//   ];
//   const f = [
//     [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
//     [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
//     [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
//     [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
//   ];
//   const s = new Set();
//   f.forEach(([a, b, c]) =>
//     [[a, b], [b, c], [c, a]].forEach(([x, y]) =>
//       s.add(x < y ? `${x}-${y}` : `${y}-${x}`)
//     )
//   );
//   return { v, f, e: [...s].map(k => k.split('-').map(Number)) };
// }

// function octRaw() {
//   return {
//     v: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
//     f: [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]],
//     e: [[0, 2], [2, 1], [1, 3], [3, 0], [0, 4], [2, 4], [1, 4], [3, 4], [0, 5], [2, 5], [1, 5], [3, 5]],
//   };
// }

// function cubRaw() {
//   return {
//     v: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]],
//     f: [[0, 1, 2], [0, 2, 3], [4, 6, 5], [4, 7, 6], [0, 5, 1], [0, 4, 5], [2, 7, 3], [2, 6, 7], [1, 6, 2], [1, 5, 6], [0, 3, 7], [0, 7, 4]],
//     e: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
//   };
// }

// function diaRaw() {
//   return {
//     v: [[1, 0, 0], [-1, 0, 0], [0, 1.5, 0], [0, -1.5, 0], [0, 0, 1], [0, 0, -1]],
//     f: [[0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4], [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]],
//     e: [[0, 2], [2, 1], [1, 3], [3, 0], [0, 4], [2, 4], [1, 4], [3, 4], [0, 5], [2, 5], [1, 5], [3, 5]],
//   };
// }

// function dodRaw() {
//   const p = (1 + Math.sqrt(5)) / 2, i = 1 / p;
//   const v = [
//     [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
//     [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
//     [0, -i, -p], [0, i, -p], [0, -i, p], [0, i, p],
//     [-i, -p, 0], [i, -p, 0], [i, p, 0], [-i, p, 0],
//     [-p, 0, -i], [p, 0, -i], [p, 0, i], [-p, 0, i],
//   ];
//   const pg = [
//     [0, 8, 9, 3, 16], [0, 16, 19, 4, 12], [0, 12, 13, 1, 8],
//     [1, 13, 5, 18, 17], [1, 17, 2, 9, 8], [2, 17, 18, 6, 14],
//     [2, 14, 15, 3, 9], [3, 15, 7, 19, 16], [4, 19, 7, 11, 10],
//     [4, 10, 5, 13, 12], [5, 10, 11, 6, 18], [6, 11, 7, 15, 14],
//   ];
//   const f = [];
//   pg.forEach(q => { for (let k = 1; k < q.length - 1; k++) f.push([q[0], q[k], q[k + 1]]); });
//   const s = new Set();
//   pg.forEach(q => {
//     for (let k = 0; k < q.length; k++) {
//       const a = q[k], b = q[(k + 1) % q.length];
//       s.add(a < b ? `${a}-${b}` : `${b}-${a}`);
//     }
//   });
//   return { v, f, e: [...s].map(k => k.split('-').map(Number)) };
// }

// function normalize(g) {
//   const m = g.v.reduce((M, [x, y, z]) => Math.max(M, Math.hypot(x, y, z)), 0);
//   return { ...g, v: g.v.map(([x, y, z]) => [x / m, y / m, z / m]) };
// }

// const G = {
//   ico: normalize(icoRaw()),
//   oct: normalize(octRaw()),
//   cub: normalize(cubRaw()),
//   dia: normalize(diaRaw()),
//   dod: normalize(dodRaw()),
// };

// function rot([x, y, z], rx, ry, rz) {
//   let cy = Math.cos(ry), sy = Math.sin(ry);
//   let nx = x * cy + z * sy;
//   let nz = -x * sy + z * cy;
//   let cx = Math.cos(rx), sx = Math.sin(rx);
//   let ny = y * cx - nz * sx;
//   nz = y * sx + nz * cx;
//   let cz = Math.cos(rz), sz = Math.sin(rz);
//   return [nx * cz - ny * sz, nx * sz + ny * cz, nz];
// }

// // Smooth S-curve for the center → right glide on mount
// function easeInOutCubic(t) {
//   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// }

// // Glide timing — synced with orange panel slide in Login.css
// const SHIFT_START_MS    = 1100;
// const SHIFT_DURATION_MS = 1100;

// // ── Component ───────────────────────────────────────────────────
// const PolyhedraBackground = () => {
//   const canvasRef = useRef(null);
//   const rafRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const dpr = window.devicePixelRatio || 1;
//     let width = 0, height = 0;

//     const resize = () => {
//       const rect = canvas.getBoundingClientRect();
//       width = rect.width;
//       height = rect.height;
//       canvas.width = Math.max(1, Math.floor(width * dpr));
//       canvas.height = Math.max(1, Math.floor(height * dpr));
//     };
//     resize();
//     window.addEventListener('resize', resize);

//     const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     const startTime = performance.now();

//     function draw(now) {
//       const elapsed = now - startTime;

//       // Fresh transform each frame, apply dpr scale
//       ctx.setTransform(1, 0, 0, 1, 0, 0);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.scale(dpr, dpr);

//       const mobile = width < 820;
//       const rightHalfWidth = mobile ? width : width * 0.5;

//       // ─── SIZE — small enough to fit fully inside the right half ───
//       //    Outer dodecahedron diameter ≈ 0.86 * size. Constrain both
//       //    horizontally (right half) and vertically (viewport) so no
//       //    edge ever clips the orange panel or screen edges.
//       const size = mobile
//         ? Math.min(width * 0.78, height * 0.5)
//         : Math.min(rightHalfWidth * 0.72, height * 0.72);

//       const s0 = size / 380;

//       // ─── POSITION — glide from viewport center to right-half center
//       const startCx = width * 0.5;
//       const startCy = height * 0.5;
//       const endCx   = mobile ? width * 0.5  : width * 0.75;
//       const endCy   = mobile ? height * 0.72 : height * 0.5;

//       const rawProgress = Math.max(
//         0,
//         Math.min(1, (elapsed - SHIFT_START_MS) / SHIFT_DURATION_MS)
//       );
//       const progress = reduceMotion ? 1 : easeInOutCubic(rawProgress);

//       const px = startCx + (endCx - startCx) * progress;
//       const py = startCy + (endCy - startCy) * progress;

//       // ─── Rotation cycle ──────────────────────────────────────────
//       const rotT = reduceMotion ? 0 : (elapsed % DURATION) / DURATION;

//       const SHAPES = [
//         { type: 'dod', radius: 150 * s0, revs: [1, 1, 2] },
//         { type: 'ico', radius: 120 * s0, revs: [1, 2, 1] },
//         { type: 'oct', radius: 85  * s0, revs: [2, 1, 2] },
//         { type: 'cub', radius: 60  * s0, revs: [1, 3, 1] },
//         { type: 'dia', radius: 45  * s0, revs: [2, 1, 2] },
//       ];

//       const strokeOuter = Math.max(0.8, 1.6 * Math.sqrt(s0));
//       const strokeInner = Math.max(0.5, 1.0 * Math.sqrt(s0));
//       const vertR = Math.max(2, 4 * Math.sqrt(s0));
//       const fov = size * 5;

//       // ─── Pulsing core glow (scales with size) ───────────────────
//       const pulseR = Math.sin(now * 0.001) * (size * 0.017) + size * 0.067;
//       const grd = ctx.createRadialGradient(px, py, 0, px, py, pulseR * 4);
//       grd.addColorStop(0, `rgba(${ORANGE},0.12)`);
//       grd.addColorStop(1, `rgba(${ORANGE},0)`);
//       ctx.fillStyle = grd;
//       ctx.fillRect(0, 0, width, height);

//       // ─── Project all shapes ──────────────────────────────────────
//       const faces = [], edges = [], verts = [];
//       SHAPES.forEach(sh => {
//         const g = G[sh.type];
//         const rx = rotT * Math.PI * 2 * sh.revs[0];
//         const ry = rotT * Math.PI * 2 * sh.revs[1];
//         const rz = rotT * Math.PI * 2 * sh.revs[2];
//         const pr = g.v.map(v => {
//           const r = rot(v, rx, ry, rz);
//           const worldZ = r[2] * sh.radius;
//           const s = fov / (fov + worldZ);
//           return {
//             x: px + r[0] * sh.radius * s,
//             y: py + r[1] * sh.radius * s,
//             z: r[2],
//           };
//         });
//         pr.forEach(p => verts.push(p));
//         g.f.forEach(([a, b, c]) =>
//           faces.push({
//             p: [pr[a], pr[b], pr[c]],
//             z: (pr[a].z + pr[b].z + pr[c].z) / 3,
//           })
//         );
//         g.e.forEach(([a, b]) =>
//           edges.push({ a: pr[a], b: pr[b], z: (pr[a].z + pr[b].z) / 2 })
//         );
//       });

//       // ─── Faces (back to front, very subtle) ─────────────────────
//       faces.sort((a, b) => a.z - b.z);
//       ctx.fillStyle = `rgba(${ORANGE},0.04)`;
//       faces.forEach(f => {
//         ctx.beginPath();
//         ctx.moveTo(f.p[0].x, f.p[0].y);
//         ctx.lineTo(f.p[1].x, f.p[1].y);
//         ctx.lineTo(f.p[2].x, f.p[2].y);
//         ctx.closePath();
//         ctx.fill();
//       });

//       // ─── Edges (outer glow + core line) ─────────────────────────
//       edges.sort((a, b) => a.z - b.z);
//       edges.forEach(e => {
//         // Soft outer glow
//         ctx.beginPath();
//         ctx.moveTo(e.a.x, e.a.y);
//         ctx.lineTo(e.b.x, e.b.y);
//         ctx.lineWidth = strokeOuter;
//         ctx.strokeStyle = `rgba(${ORANGE},0.1)`;
//         ctx.stroke();
//         // Core bright line
//         ctx.beginPath();
//         ctx.moveTo(e.a.x, e.a.y);
//         ctx.lineTo(e.b.x, e.b.y);
//         ctx.lineWidth = strokeInner;
//         ctx.strokeStyle = `rgba(${ORANGE},0.78)`;
//         ctx.stroke();
//       });

//       // ─── Vertex radial glows ─────────────────────────────────────
//       verts.forEach(v => {
//         const rg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, vertR);
//         rg.addColorStop(0, `rgba(${ORANGE},0.3)`);
//         rg.addColorStop(1, `rgba(${ORANGE},0)`);
//         ctx.fillStyle = rg;
//         ctx.beginPath();
//         ctx.arc(v.x, v.y, vertR, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       rafRef.current = requestAnimationFrame(draw);
//     }

//     rafRef.current = requestAnimationFrame(draw);

//     return () => {
//       cancelAnimationFrame(rafRef.current);
//       window.removeEventListener('resize', resize);
//     };
//   }, []);

//   return <canvas ref={canvasRef} className="polyhedra-canvas-bg" aria-hidden="true" />;
// };

// export default PolyhedraBackground;

import { useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// POLYHEDRA BACKGROUND — uses the new 4-shape animation
// (ico + oct + cub + dia) copied exactly from PolyhedraAnimation.
//
// Flow:
//   1. Page opens → cluster appears centered, FROZEN (no rotation)
//   2. Orange panel slides in from left (at 1.1s, per Login.css)
//   3. At the same moment: cluster glides to right-half center
//      AND rotation starts.
// ═══════════════════════════════════════════════════════════════

const ORANGE   = '232, 118, 43';
const DURATION = 15000; // ms per full rotation cycle

// ── Geometry (matches PolyhedraAnimation exactly) ───────────────
function icoRaw() {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const f = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  const s = new Set();
  f.forEach(([a, b, c]) =>
    [[a, b], [b, c], [c, a]].forEach(([x, y]) =>
      s.add(x < y ? `${x}-${y}` : `${y}-${x}`)
    )
  );
  return { v, f, e: [...s].map(k => k.split('-').map(Number)) };
}

function octRaw() {
  return {
    v: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
    f: [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]],
    e: [[0,2],[2,1],[1,3],[3,0],[0,4],[2,4],[1,4],[3,4],[0,5],[2,5],[1,5],[3,5]],
  };
}

function cubRaw() {
  return {
    v: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],
    f: [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,5,1],[0,4,5],[2,7,3],[2,6,7],[1,6,2],[1,5,6],[0,3,7],[0,7,4]],
    e: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
  };
}

function diaRaw() {
  return {
    v: [[1,0,0],[-1,0,0],[0,1.5,0],[0,-1.5,0],[0,0,1],[0,0,-1]],
    f: [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]],
    e: [[0,2],[2,1],[1,3],[3,0],[0,4],[2,4],[1,4],[3,4],[0,5],[2,5],[1,5],[3,5]],
  };
}

function normalize(g) {
  const m = g.v.reduce((M, [x, y, z]) => Math.max(M, Math.hypot(x, y, z)), 0);
  return { ...g, v: g.v.map(([x, y, z]) => [x / m, y / m, z / m]) };
}

const G = {
  ico: normalize(icoRaw()),
  oct: normalize(octRaw()),
  cub: normalize(cubRaw()),
  dia: normalize(diaRaw()),
};

// Same shape config as PolyhedraAnimation
const SHAPES = [
  { type: 'ico', r: 0.200, revs: [1, 2, 1] },
  { type: 'oct', r: 0.142, revs: [2, 1, 2] },
  { type: 'cub', r: 0.100, revs: [1, 3, 1] },
  { type: 'dia', r: 0.075, revs: [2, 1, 2] },
];

function rot([x, y, z], rx, ry, rz) {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  let nx = x * cy + z * sy;
  let nz = -x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  let ny = y * cx - nz * sx;
  nz = y * sx + nz * cx;
  const cz = Math.cos(rz), sz = Math.sin(rz);
  return [nx * cz - ny * sz, nx * sz + ny * cz, nz];
}

// Smooth S-curve for the center → right glide
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Synced with the orange panel slideInFromLeft animation in Login.css
// (animation-delay: 1.1s, duration: 1.1s)
const SHIFT_START_MS    = 1100;
const SHIFT_DURATION_MS = 1100;

// Rotation starts AFTER the glide finishes, plus a 1.1s pause.
// Glide ends at 1100 + 1100 = 2200ms, then wait 1100ms → rotation begins at 3300ms.
const ROTATION_DELAY_MS = 1100; // pause after glide before rotation kicks in
const ROTATION_START_MS = SHIFT_START_MS + SHIFT_DURATION_MS + ROTATION_DELAY_MS;

// ── Component ───────────────────────────────────────────────────
const PolyhedraBackground = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = 0, height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width  = rect.width;
      height = rect.height;
      canvas.width  = Math.max(1, Math.floor(width  * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };
    resize();
    window.addEventListener('resize', resize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime    = performance.now();

    function draw(now) {
      const elapsed = now - startTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const mobile         = width < 820;
      const rightHalfWidth = mobile ? width : width * 0.5;

      // ─── SIZE — fits inside the right half ─────────────────────
      const MARGIN = 30;
const availableW = rightHalfWidth - 2 * MARGIN;
const availableH = mobile
  ? height * 0.55 - 2 * MARGIN   // mobile: cluster sits in lower row
  : height - 2 * MARGIN;
const boundingDim = Math.min(availableW, availableH);
const size = boundingDim / 0.42;

      const s0 = size / 380;

      // ─── POSITION glide: viewport center → right-half center ───
      const startCx = width  * 0.5;
      const startCy = height * 0.5;
      const endCx   = mobile ? width  * 0.5  : width  * 0.75;
      const endCy   = mobile ? height * 0.72 : height * 0.5;

      const rawProgress = Math.max(
        0,
        Math.min(1, (elapsed - SHIFT_START_MS) / SHIFT_DURATION_MS)
      );
      const progress = reduceMotion ? 1 : easeInOutCubic(rawProgress);

      const px = startCx + (endCx - startCx) * progress;
      const py = startCy + (endCy - startCy) * progress;

      // ─── ROTATION — FROZEN in center, starts when glide begins ─
      // const rotElapsed = Math.max(0, elapsed - SHIFT_START_MS);
      // const rotT       = reduceMotion ? 0 : (rotElapsed % DURATION) / DURATION;
      // ─── ROTATION — frozen until glide finishes, then 1.1s pause, then spins ─
      const rotElapsed = Math.max(0, elapsed - ROTATION_START_MS);
      const rotT       = reduceMotion ? 0 : (rotElapsed % DURATION) / DURATION;

      const strokeOuter = Math.max(0.8, 1.6 * Math.sqrt(s0));
      const strokeInner = Math.max(0.5, 1.0 * Math.sqrt(s0));
      const vertR       = Math.max(2,   4   * Math.sqrt(s0));
      const fov         = size * 5;

      // ─── Pulsing core glow ─────────────────────────────────────
      const pulseR = Math.sin(now * 0.001) * (size * 0.017) + size * 0.067;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, pulseR * 4);
      grd.addColorStop(0, `rgba(${ORANGE},0.12)`);
      grd.addColorStop(1, `rgba(${ORANGE},0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // ─── Project all shapes ────────────────────────────────────
      const faces = [], edges = [], verts = [];
      SHAPES.forEach(sh => {
        const g      = G[sh.type];
        const radius = sh.r * size;
        const rx = rotT * Math.PI * 2 * sh.revs[0];
        const ry = rotT * Math.PI * 2 * sh.revs[1];
        const rz = rotT * Math.PI * 2 * sh.revs[2];
        const pr = g.v.map(v => {
          const r = rot(v, rx, ry, rz);
          const worldZ = r[2] * radius;
          const s = fov / (fov + worldZ);
          return {
            x: px + r[0] * radius * s,
            y: py + r[1] * radius * s,
            z: r[2],
          };
        });
        pr.forEach(p => verts.push(p));
        g.f.forEach(([a, b, c]) =>
          faces.push({
            p: [pr[a], pr[b], pr[c]],
            z: (pr[a].z + pr[b].z + pr[c].z) / 3,
          })
        );
        g.e.forEach(([a, b]) =>
          edges.push({ a: pr[a], b: pr[b], z: (pr[a].z + pr[b].z) / 2 })
        );
      });

      // ─── Faces (back to front, very subtle) ────────────────────
      faces.sort((a, b) => a.z - b.z);
      ctx.fillStyle = `rgba(${ORANGE},0.04)`;
      faces.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(f.p[0].x, f.p[0].y);
        ctx.lineTo(f.p[1].x, f.p[1].y);
        ctx.lineTo(f.p[2].x, f.p[2].y);
        ctx.closePath();
        ctx.fill();
      });

      // ─── Edges (outer glow + core line) ────────────────────────
      edges.sort((a, b) => a.z - b.z);
      edges.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.lineWidth   = strokeOuter;
        ctx.strokeStyle = `rgba(${ORANGE},0.1)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.lineWidth   = strokeInner;
        ctx.strokeStyle = `rgba(${ORANGE},0.78)`;
        ctx.stroke();
      });

      // ─── Vertex radial glows ───────────────────────────────────
      verts.forEach(v => {
        const rg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, vertR);
        rg.addColorStop(0, `rgba(${ORANGE},0.3)`);
        rg.addColorStop(1, `rgba(${ORANGE},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(v.x, v.y, vertR, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="polyhedra-canvas-bg" aria-hidden="true" />;
};

export default PolyhedraBackground;