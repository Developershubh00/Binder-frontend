import { useRef, useEffect } from 'react';

// ── Geometry helpers ──
const vec3 = (x, y, z) => ({ x, y, z });

function icosahedronVerts(r) {
  const t = (1 + Math.sqrt(5)) / 2;
  const n = r / Math.sqrt(1 + t * t);
  return [
    vec3(-n, t*n, 0), vec3(n, t*n, 0), vec3(-n, -t*n, 0), vec3(n, -t*n, 0),
    vec3(0, -n, t*n), vec3(0, n, t*n), vec3(0, -n, -t*n), vec3(0, n, -t*n),
    vec3(t*n, 0, -n), vec3(t*n, 0, n), vec3(-t*n, 0, -n), vec3(-t*n, 0, n),
  ];
}
const ICO_EDGES = [
  [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
  [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
  [7,8],[7,10],[8,9],[10,11]
];
const ICO_FACES = [
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
];

function octahedronVerts(r) {
  return [vec3(r,0,0), vec3(-r,0,0), vec3(0,r,0), vec3(0,-r,0), vec3(0,0,r), vec3(0,0,-r)];
}
const OCT_EDGES = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];

function cubeVerts(r) {
  const s = r * 0.577;
  return [
    vec3(-s,-s,-s), vec3(s,-s,-s), vec3(s,s,-s), vec3(-s,s,-s),
    vec3(-s,-s,s), vec3(s,-s,s), vec3(s,s,s), vec3(-s,s,s),
  ];
}
const CUBE_EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

function diamondVerts(r) {
  return [vec3(0,r,0), vec3(0,-r,0), vec3(r*0.5,0,0), vec3(-r*0.5,0,0), vec3(0,0,r*0.5), vec3(0,0,-r*0.5)];
}
const DIAMOND_EDGES = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]];

function rotateVec3(v, ax, ay, az) {
  let { x, y, z } = v;
  let c = Math.cos(ax), s = Math.sin(ax);
  let y1 = y*c - z*s, z1 = y*s + z*c;
  y = y1; z = z1;
  c = Math.cos(ay); s = Math.sin(ay);
  let x1 = x*c + z*s; z1 = -x*s + z*c;
  x = x1; z = z1;
  c = Math.cos(az); s = Math.sin(az);
  x1 = x*c - y*s; y1 = x*s + y*c;
  return { x: x1, y: y1, z: z1 };
}

function project(v, cx, cy, fov) {
  const scale = fov / (fov + v.z);
  return { x: cx + v.x * scale, y: cy + v.y * scale, scale };
}

// ── Component ──
const WIRE_COLORS = [
  'rgba(212,170,90,',  // gold
  'rgba(200,130,70,',  // copper
  'rgba(230,190,110,', // amber
  'rgba(210,160,140,', // rose
];

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
    ctx.scale(dpr, dpr);

    const polyRadius = size * 0.32;
    const icoV = icosahedronVerts(polyRadius);
    const octV = octahedronVerts(polyRadius * 0.6);
    const cubeV = cubeVerts(polyRadius * 0.4);
    const diaV = diamondVerts(polyRadius * 0.22);
    const fov = 500;
    const cx = size / 2;
    const cy = size / 2;

    const shapes = [
      { verts: icoV, edges: ICO_EDGES, faces: ICO_FACES, color: WIRE_COLORS[0], sax: 0.0003, say: 0.0004, saz: 0.0001, lw: 1.2 },
      { verts: octV, edges: OCT_EDGES, faces: null, color: WIRE_COLORS[1], sax: 0.0005, say: 0.0002, saz: 0.0003, lw: 1.0 },
      { verts: cubeV, edges: CUBE_EDGES, faces: null, color: WIRE_COLORS[2], sax: 0.0002, say: 0.0006, saz: 0.0004, lw: 0.8 },
      { verts: diaV, edges: DIAMOND_EDGES, faces: null, color: WIRE_COLORS[3], sax: 0.0007, say: 0.0003, saz: 0.0005, lw: 0.7 },
    ];

    function draw(now) {
      ctx.clearRect(0, 0, size, size);

      // Pulsing core glow
      const corePulse = 0.5 + Math.sin(now * 0.002) * 0.3;
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, polyRadius * 1.2);
      coreGrd.addColorStop(0, `rgba(212,170,90,${0.12 * corePulse})`);
      coreGrd.addColorStop(0.5, `rgba(212,170,90,${0.04 * corePulse})`);
      coreGrd.addColorStop(1, 'rgba(212,170,90,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, polyRadius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = coreGrd;
      ctx.fill();

      for (const shape of shapes) {
        const ax = now * shape.sax;
        const ay = now * shape.say;
        const az = now * shape.saz;

        const projected = shape.verts.map(v => {
          const rv = rotateVec3(v, ax, ay, az);
          return { ...project(rv, cx, cy, fov), z: rv.z };
        });

        // Translucent faces (icosahedron)
        if (shape.faces) {
          for (const [a, b, c] of shape.faces) {
            const avgZ = (projected[a].z + projected[b].z + projected[c].z) / 3;
            const faceAlpha = 0.03 + (avgZ + polyRadius) / (polyRadius * 2) * 0.04;
            ctx.beginPath();
            ctx.moveTo(projected[a].x, projected[a].y);
            ctx.lineTo(projected[b].x, projected[b].y);
            ctx.lineTo(projected[c].x, projected[c].y);
            ctx.closePath();
            ctx.fillStyle = `${shape.color}${faceAlpha})`;
            ctx.fill();
          }
        }

        // Depth-sorted edges
        const edgesWithDepth = shape.edges.map(([a, b]) => ({
          a, b, z: (projected[a].z + projected[b].z) / 2
        }));
        edgesWithDepth.sort((a, b) => a.z - b.z);

        for (const edge of edgesWithDepth) {
          const pa = projected[edge.a], pb = projected[edge.b];
          const depthFactor = 0.4 + (edge.z + polyRadius) / (polyRadius * 2) * 0.6;

          // Glow (subtle)
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `${shape.color}${0.1 * depthFactor})`;
          ctx.lineWidth = shape.lw * 2;
          ctx.stroke();

          // Core line
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = `${shape.color}${0.85 * depthFactor})`;
          ctx.lineWidth = shape.lw;
          ctx.stroke();
        }

        // Vertex glows
        for (const p of projected) {
          const vGrd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3 * p.scale);
          vGrd.addColorStop(0, `${shape.color}0.6)`);
          vGrd.addColorStop(1, `${shape.color}0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = vGrd;
          ctx.fill();
        }
      }

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
