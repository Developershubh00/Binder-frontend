import { useRef, useEffect } from 'react';

const WHITE = '255, 255, 255';

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

const SHAPES = [
  { type: 'ico', r: 0.200 },
  { type: 'oct', r: 0.142 },
  { type: 'cub', r: 0.100 },
  { type: 'dia', r: 0.075 },
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

const PolyhedraLogo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const size = Math.min(width, height) * 2.2;
      const s0 = size / 380;
      const px = width / 2;
      const py = height / 2;

      // Frozen at identity rotation — matches the right-side polyhedra cluster
      // before its rotation animation kicks in (same silhouette and layering).
      const rx = 0;
      const ry = 0;
      const rz = 0;

      const strokeOuter = Math.max(0.8, 1.6 * Math.sqrt(s0));
      const strokeInner = Math.max(0.5, 1.0 * Math.sqrt(s0));
      const vertR = Math.max(2, 4 * Math.sqrt(s0));
      const fov = size * 5;

      const faces = [], edges = [], verts = [];
      SHAPES.forEach(sh => {
        const g = G[sh.type];
        const radius = sh.r * size;
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

      faces.sort((a, b) => a.z - b.z);
      ctx.fillStyle = `rgba(${WHITE},0.06)`;
      faces.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(f.p[0].x, f.p[0].y);
        ctx.lineTo(f.p[1].x, f.p[1].y);
        ctx.lineTo(f.p[2].x, f.p[2].y);
        ctx.closePath();
        ctx.fill();
      });

      edges.sort((a, b) => a.z - b.z);
      edges.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.lineWidth = strokeOuter;
        ctx.strokeStyle = `rgba(${WHITE},0.18)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.lineWidth = strokeInner;
        ctx.strokeStyle = `rgba(${WHITE},0.95)`;
        ctx.stroke();
      });

      verts.forEach(v => {
        const rg = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, vertR);
        rg.addColorStop(0, `rgba(${WHITE},0.6)`);
        rg.addColorStop(1, `rgba(${WHITE},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(v.x, v.y, vertR, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return <canvas ref={canvasRef} className="polyhedra-logo-canvas" aria-hidden="true" />;
};

export default PolyhedraLogo;
