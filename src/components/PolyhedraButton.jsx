import { useRef, useEffect } from 'react';

const ORANGE = '232, 118, 43';
const DURATION = 15000;

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

function dodRaw() {
  const p = (1 + Math.sqrt(5)) / 2, i = 1 / p;
  const v = [
    [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
    [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],
    [0,-i,-p],[0,i,-p],[0,-i,p],[0,i,p],
    [-i,-p,0],[i,-p,0],[i,p,0],[-i,p,0],
    [-p,0,-i],[p,0,-i],[p,0,i],[-p,0,i],
  ];
  const pg = [
    [0,8,9,3,16],[0,16,19,4,12],[0,12,13,1,8],
    [1,13,5,18,17],[1,17,2,9,8],[2,17,18,6,14],
    [2,14,15,3,9],[3,15,7,19,16],[4,19,7,11,10],
    [4,10,5,13,12],[5,10,11,6,18],[6,11,7,15,14],
  ];
  const f = [];
  pg.forEach(q => { for (let k = 1; k < q.length - 1; k++) f.push([q[0], q[k], q[k + 1]]); });
  const s = new Set();
  pg.forEach(q => {
    for (let k = 0; k < q.length; k++) {
      const a = q[k], b = q[(k + 1) % q.length];
      s.add(a < b ? `${a}-${b}` : `${b}-${a}`);
    }
  });
  return { v, f, e: [...s].map(k => k.split('-').map(Number)) };
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
  dod: normalize(dodRaw()),
};

function rot([x, y, z], rx, ry, rz) {
  let cy = Math.cos(ry), sy = Math.sin(ry);
  let nx = x * cy + z * sy;
  let nz = -x * sy + z * cy;
  let cx = Math.cos(rx), sx = Math.sin(rx);
  let ny = y * cx - nz * sx;
  nz = y * sx + nz * cx;
  let cz = Math.cos(rz), sz = Math.sin(rz);
  return [nx * cz - ny * sz, nx * sz + ny * cz, nz];
}

const PolyhedraButton = ({ size = 64, onClick, isOpen }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');

    const s0 = size / 380;
    const SHAPES = [
      { type: 'dod', radius: 150 * s0, revs: [1, 1, 2] },
      { type: 'ico', radius: 120 * s0, revs: [1, 2, 1] },
      { type: 'oct', radius: 85  * s0, revs: [2, 1, 2] },
      { type: 'cub', radius: 60  * s0, revs: [1, 3, 1] },
      { type: 'dia', radius: 45  * s0, revs: [2, 1, 2] },
    ];

    const strokeOuter = Math.max(0.8, 1.6 * Math.sqrt(s0));
    const strokeInner = Math.max(0.5, 1.0 * Math.sqrt(s0));
    const vertR = Math.max(2, 4 * Math.sqrt(s0));
    const fov = size * 5;

    const startTime = performance.now();

    function draw(now) {
      const progress = ((now - startTime) % DURATION) / DURATION;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const cw = size, ch = size;
      const px = cw / 2, py = ch / 2;

      const pulseR = Math.sin(now * 0.001) * (size * 0.017) + size * 0.067;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, pulseR * 2);
      grd.addColorStop(0, `rgba(${ORANGE},0.15)`);
      grd.addColorStop(1, `rgba(${ORANGE},0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cw, ch);

      const faces = [], edges = [], verts = [];
      SHAPES.forEach(sh => {
        const g = G[sh.type];
        const rx = progress * Math.PI * 2 * sh.revs[0];
        const ry = progress * Math.PI * 2 * sh.revs[1];
        const rz = progress * Math.PI * 2 * sh.revs[2];
        const pr = g.v.map(v => {
          const r = rot(v, rx, ry, rz);
          const worldZ = r[2] * sh.radius;
          const s = fov / (fov + worldZ);
          return {
            x: px + r[0] * sh.radius * s,
            y: py + r[1] * sh.radius * s,
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
      ctx.fillStyle = `rgba(${ORANGE},0.05)`;
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
        ctx.strokeStyle = `rgba(${ORANGE},0.1)`;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.lineWidth = strokeInner;
        ctx.strokeStyle = `rgba(${ORANGE},1)`;
        ctx.stroke();
      });

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
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <button
      className={`polyhedra-chat-btn${isOpen ? ' open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      type="button"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, display: 'block' }}
      />
    </button>
  );
};

export default PolyhedraButton;
