// import { useRef, useEffect } from 'react';

// function icoRaw() {
//   const t = (1 + Math.sqrt(5)) / 2;
//   const v = [
//     [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
//     [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
//     [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
//   ];
//   const f = [
//     [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
//     [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
//     [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
//     [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
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
//     v: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
//     f: [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]],
//     e: [[0,2],[2,1],[1,3],[3,0],[0,4],[2,4],[1,4],[3,4],[0,5],[2,5],[1,5],[3,5]],
//   };
// }

// function cubRaw() {
//   return {
//     v: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],
//     f: [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,5,1],[0,4,5],[2,7,3],[2,6,7],[1,6,2],[1,5,6],[0,3,7],[0,7,4]],
//     e: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
//   };
// }

// function diaRaw() {
//   return {
//     v: [[1,0,0],[-1,0,0],[0,1.5,0],[0,-1.5,0],[0,0,1],[0,0,-1]],
//     f: [[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]],
//     e: [[0,2],[2,1],[1,3],[3,0],[0,4],[2,4],[1,4],[3,4],[0,5],[2,5],[1,5],[3,5]],
//   };
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
// };

// function rot([x, y, z], rx, ry, rz) {
//   const cy = Math.cos(ry), sy = Math.sin(ry);
//   let nx = x * cy + z * sy;
//   let nz = -x * sy + z * cy;
//   const cx = Math.cos(rx), sx = Math.sin(rx);
//   let ny = y * cx - nz * sx;
//   nz = y * sx + nz * cx;
//   const cz = Math.cos(rz), sz = Math.sin(rz);
//   return [nx * cz - ny * sz, nx * sz + ny * cz, nz];
// }

// const SHAPES = [
//   { type: 'ico', r: 0.200, revs: [1, 2, 1] },
//   { type: 'oct', r: 0.142, revs: [2, 1, 2] },
//   { type: 'cub', r: 0.100, revs: [1, 3, 1] },
//   { type: 'dia', r: 0.075, revs: [2, 1, 2] },
// ];

// const PolyhedraAnimation = ({
//   size = 380,
//   color = '232, 118, 43',
//   duration = 15000,
//   className = '',
//   style = {},
// }) => {
//   const canvasRef = useRef(null);
//   const rafRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = size * dpr;
//     canvas.height = size * dpr;
//     const ctx = canvas.getContext('2d');

//     const s0 = size / 380;
//     const strokeOuter = Math.max(0.8, 1.6 * Math.sqrt(s0));
//     const strokeInner = Math.max(0.5, 1.0 * Math.sqrt(s0));
//     const vertR = Math.max(2, 4 * Math.sqrt(s0));
//     const fov = size * 5;

//     const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     const startTime = performance.now();

//     function draw(now) {
//       const elapsed = now - startTime;
//       const rotT = reduceMotion ? 0 : (elapsed % duration) / duration;

//       ctx.setTransform(1, 0, 0, 1, 0, 0);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.scale(dpr, dpr);

//       const px = size / 2, py = size / 2;

//       const pulseR = Math.sin(now * 0.001) * (size * 0.017) + size * 0.067;
//       const grd = ctx.createRadialGradient(px, py, 0, px, py, pulseR * 4);
//       grd.addColorStop(0, `rgba(${color},0.12)`);
//       grd.addColorStop(1, `rgba(${color},0)`);
//       ctx.fillStyle = grd;
//       ctx.fillRect(0, 0, size, size);

//       const faces = [], edges = [], verts = [];
//       SHAPES.forEach(sh => {
//         const g = G[sh.type];
//         const radius = sh.r * size;
//         const rx = rotT * Math.PI * 2 * sh.revs[0];
//         const ry = rotT * Math.PI * 2 * sh.revs[1];
//         const rz = rotT * Math.PI * 2 * sh.revs[2];
//         const pr = g.v.map(v => {
//           const r = rot(v, rx, ry, rz);
//           const worldZ = r[2] * radius;
//           const s = fov / (fov + worldZ);
//           return {
//             x: px + r[0] * radius * s,
//             y: py + r[1] * radius * s,
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

//       faces.sort((a, b) => a.z - b.z);
//       ctx.fillStyle = `rgba(${color},0.04)`;
//       faces.forEach(f => {
//         ctx.beginPath();
//         ctx.moveTo(f.p[0].x, f.p[0].y);
//         ctx.lineTo(f.p[1].x, f.p[1].y);
//         ctx.lineTo(f.p[2].x, f.p[2].y);
//         ctx.closePath();
//         ctx.fill();
//       });

//       edges.sort((a, b) => a.z - b.z);
//       edges.forEach(e => {
//         ctx.beginPath();
//         ctx.moveTo(e.a.x, e.a.y);
//         ctx.lineTo(e.b.x, e.b.y);
//         ctx.lineWidth = strokeOuter;
//         ctx.strokeStyle = `rgba(${color},0.1)`;
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(e.a.x, e.a.y);
//         ctx.lineTo(e.b.x, e.b.y);
//         ctx.lineWidth = strokeInner;
//         ctx.strokeStyle = `rgba(${color},0.78)`;
//         ctx.stroke();
//       });

//       verts.forEach(v => {
//         const rg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, vertR);
//         rg.addColorStop(0, `rgba(${color},0.3)`);
//         rg.addColorStop(1, `rgba(${color},0)`);
//         ctx.fillStyle = rg;
//         ctx.beginPath();
//         ctx.arc(v.x, v.y, vertR, 0, Math.PI * 2);
//         ctx.fill();
//       });

//       rafRef.current = requestAnimationFrame(draw);
//     }

//     rafRef.current = requestAnimationFrame(draw);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, [size, color, duration]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className={className}
//       style={{ width: size, height: size, display: 'block', ...style }}
//     />
//   );
// };

// export default PolyhedraAnimation;

import { useEffect, useRef, useId } from "react";

const PolyhedraAnimation = ({ size = 72, color = "#f94d00" }) => {
  const svgRef = useRef(null);
  const maskId = useId(); // unique id so multiple loaders on one page don't collide

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = (event) => {
      const svg = svgRef.current;
      if (!svg) return;
      if (event.matches) {
        svg.pauseAnimations?.();
      } else {
        svg.unpauseAnimations?.();
      }
    };

    updateMotionPreference(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);
      return () =>
        mediaQuery.removeEventListener("change", updateMotionPreference);
    }
  }, []);

  const animationValues = `
    M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z;
    M 59.500 38.400 C 62.800 32.300 66.300 28.200 69.600 27.600 L 69.600 51.000 C 66.000 51.700 62.500 54.400 59.500 58.500 Z;
    M 59.500 38.400 C 60.800 30.500 62.000 25.800 62.800 25.400 L 62.800 49.800 C 61.800 51.100 60.500 54.800 59.500 58.500 Z;
    M 59.500 38.400 C 59.500 30.000 59.500 25.000 59.500 25.000 L 59.500 49.400 C 59.500 51.500 59.500 55.000 59.500 58.500 Z;
    M 59.500 38.400 C 58.200 30.500 57.000 25.800 56.200 25.400 L 56.200 49.800 C 57.200 51.100 58.500 54.800 59.500 58.500 Z;
    M 59.500 38.400 C 56.200 32.300 52.700 28.200 49.400 27.600 L 49.400 51.000 C 53.000 51.700 56.500 54.400 59.500 58.500 Z;
    M 59.500 38.400 C 55.100 35.100 50.800 33.300 46.000 33.300 L 46.000 53.700 C 51.000 53.700 55.200 55.400 59.500 58.500 Z
  `;

  const animationKeySplines =
    "0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1; 0.37 0 0.63 1";

  const animationProps = {
    attributeName: "d",
    dur: "0.778s",
    repeatCount: "indefinite",
    calcMode: "spline",
    keyTimes: "0.000;0.180;0.400;0.500;0.600;0.820;1.000",
    keySplines: animationKeySplines,
    values: animationValues,
  };

  const visuallyHidden = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  };

  return (
    <span role="status" aria-live="polite">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 94 90"
        aria-hidden="true"
        focusable="false"
        style={{
          width: typeof size === "number" ? `${size}px` : size,
          height: "auto",
          display: "block",
          color,
          overflow: "visible",
        }}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="94"
            height="90"
          >
            <rect x="0" y="0" width="94" height="90" fill="white" />
            <path
              fill="black"
              d="M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z"
            >
              <animate {...animationProps} />
            </path>
          </mask>
        </defs>

        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${maskId})`}
        >
          <path d="M59.5 38.4 C55.1 35.1 50.8 33.3 46 33.3 L46 53.7 C51 53.7 55.2 55.4 59.5 58.5" />
          <path d="M59.5 38.4 C64 35.1 69.1 33.3 74.3 33.3 L74.3 53.7 C69.1 53.7 64.2 55.4 59.5 58.5" />
          <path d="M59.5 38.4 L59.5 59.1" />
        </g>

        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 59.500 38.400 C 64.000 35.100 69.100 33.300 74.300 33.300 L 74.300 53.700 C 69.100 53.700 64.200 55.400 59.500 58.500 Z"
        >
          <animate {...animationProps} />
        </path>
      </svg>
      <span style={visuallyHidden}>Loading</span>
    </span>
  );
};

export default PolyhedraAnimation;
