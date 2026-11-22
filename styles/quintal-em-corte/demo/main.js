// Quintal em Corte 3D — demo "Como um buraco no quintal vira piscina" (9:16).
// Um bloco de terra cortado como bolo, uma casa em cima, e a obra acontecendo no corte, um problema de cada vez.
import * as THREE from 'three';
import { clamp, seg, ss, eo, ei, eio, back, env, mulberry } from '/core/lib.js';

const W = innerWidth, H = innerHeight, U = W / 1080;

// ---------- tempo (vem de timing.json, gerado a partir da narração) ----------
let TM = { dur: 46, lines: [0.6, 4.4, 8.8, 13.2, 17.0, 20.8, 25.2, 28.0, 34.7, 38.7], words: [] };
try { const r = await fetch('timing.json'); if (r.ok) TM = await r.json(); } catch (e) {}
const L = TM.lines, DUR = TM.dur;
const nextL = i => (i + 1 < L.length ? L[i + 1] : DUR - 2.2);

// ---------- renderer / cena ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene();
{ // céu em degradê (fundo)
  const c = document.createElement('canvas'); c.width = 4; c.height = 512; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#7fb7e3'); gr.addColorStop(0.55, '#cfe6f5'); gr.addColorStop(1, '#eef4f2');
  x.fillStyle = gr; x.fillRect(0, 0, 4, 512); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; scene.background = tx;
}
const cam = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);
scene.add(new THREE.HemisphereLight(0xdff0ff, 0x8a6a4a, 1.25));
const sun = new THREE.DirectionalLight(0xfff2dc, 2.6);
sun.position.set(-6, 11, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight(0xbfd8ff, 0.5); fill.position.set(6, 3, 8); scene.add(fill);

// ---------- materiais procedurais (cor pela posição no mundo) ----------
const NOISE = `
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vn(p);p*=2.03;a*=.5;}return s;}
vec2 planar(vec3 p, vec3 n){vec3 a=abs(n);return a.y>.5?p.xz:(a.x>.5?p.zy:p.xy);}`;
function proc(kind, opts = {}) {
  const m = new THREE.MeshStandardMaterial({ roughness: opts.rough ?? 0.92, metalness: 0, transparent: !!opts.transparent, opacity: opts.opacity ?? 1 });
  m.customProgramCacheKey = () => 'proc-' + kind;
  m.userData.u = { uTint: { value: new THREE.Color(1, 1, 1) }, uWipe: { value: 9 } };
  m.onBeforeCompile = s => {
    Object.assign(s.uniforms, m.userData.u);
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xyz; vWN=normalize(mat3(modelMatrix)*objectNormal);');
    let body = '';
    if (kind === 'soil') body = `
      vec2 q=planar(vWP,vWN); float w=fbm(q*1.3)*.35; float y=vWP.y+w;
      vec3 c=y>-.55?vec3(.30,.19,.11):(y>-1.65?vec3(.55,.31,.17):(y>-2.6?vec3(.70,.53,.34):vec3(.47,.44,.40)));
      float sp=vn(q*38.); c*=.86+.22*sp; float st=step(.93,vn(q*7.+3.1)); c=mix(c,vec3(.62,.6,.56)*(.8+.3*sp),st*(y<-.4?1.:0.));
      if(abs(vWN.y)>.5) c=vec3(.34,.22,.13)*(.85+.25*sp);
      diffuseColor.rgb=c;`;
    if (kind === 'grass') body = `
      vec2 q=planar(vWP,vWN); float sp=fbm(q*6.); vec3 c=mix(vec3(.30,.55,.18),vec3(.42,.66,.24),sp);
      if(abs(vWN.y)<.5){ c=mix(vec3(.24,.16,.09),vec3(.33,.5,.17),smoothstep(-.09,-.02,vWP.y)); }
      diffuseColor.rgb=c*(.9+.15*vn(q*40.));`;
    if (kind === 'concrete') body = `
      vec2 q=planar(vWP,vWN); float sp=fbm(q*5.); diffuseColor.rgb=vec3(.62,.62,.6)*(.82+.25*sp)*(.9+.12*vn(q*60.));
      if(vWP.y>uWipe) discard;`;
    if (kind === 'tile') body = `
      vec2 q=planar(vWP,vWN)/.16; vec2 f=fract(q); vec2 id=floor(q);
      float g=step(.07,f.x)*step(.07,f.y); vec3 c=mix(vec3(.30,.66,.84),vec3(.44,.78,.92),h21(id));
      diffuseColor.rgb=mix(vec3(.9,.93,.94),c,g);
      if(vWP.y>uWipe) discard;`;
    if (kind === 'membrane') body = `
      vec2 q=planar(vWP,vWN); diffuseColor.rgb=vec3(.12,.14,.17)*(.85+.3*vn(q*14.));
      if(vWP.y>uWipe) discard;`;
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN; uniform vec3 uTint; uniform float uWipe;' + NOISE)
      .replace('#include <color_fragment>', '#include <color_fragment>' + body + '\ndiffuseColor.rgb*=uTint;');
  };
  return m;
}
const MS = { soil: proc('soil'), grass: proc('grass', { rough: 1 }), conc: proc('concrete'), tile: proc('tile', { rough: 0.35 }), memb: proc('membrane', { rough: 0.6 }) };
const std = (c, r = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o; };
// caixa definida por limites
const bx = (x0, x1, y0, y1, z0, z1, m) => box(x1 - x0, y1 - y0, z1 - z0, m, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);

// ---------- o bloco de terra ----------
const B = { x0: -5, x1: 5, z0: -6, z1: 2.5, y0: -3.4 };          // bloco; a face z1 é o corte
const P = { x0: -2, x1: 2, z0: -3, y0: -1.6 };                      // buraco da piscina (vai até a face do corte)
const T = 0.18;                                                     // espessura da parede de concreto
const world = new THREE.Group(); scene.add(world);
// terra em volta do buraco
world.add(bx(B.x0, P.x0, B.y0, -0.1, B.z0, B.z1, MS.soil), bx(P.x1, B.x1, B.y0, -0.62, B.z0, B.z1, MS.soil), bx(P.x1, B.x1, -0.62, -0.1, B.z0, 1.88, MS.soil), bx(2.62, B.x1, -0.62, -0.1, 1.88, B.z1, MS.soil),
  bx(P.x0, P.x1, B.y0, -0.1, B.z0, P.z0, MS.soil), bx(P.x0, P.x1, B.y0, P.y0, P.z0, B.z1, MS.soil));
// grama em volta do buraco
const gr = [bx(B.x0, P.x0, -0.1, 0, B.z0, B.z1, MS.grass), bx(P.x1, B.x1, -0.1, 0, B.z0, B.z1, MS.grass), bx(P.x0, P.x1, -0.1, 0, B.z0, P.z0, MS.grass)];
world.add(...gr);
// terra que ainda vai sair (o buraco começa cheio)
const plug = bx(P.x0, P.x1, P.y0, -0.1, P.z0, B.z1, MS.soil); world.add(plug);
const skPlug = bx(P.x1, 2.62, -0.62, -0.1, 1.88, B.z1, MS.soil); world.add(skPlug); // vira o skimmer
const plugGrass = bx(P.x0, P.x1, -0.1, 0, P.z0, B.z1, MS.grass); world.add(plugGrass);
// tufos de grama (instanciados)
{
  const n = 520, geo = new THREE.ConeGeometry(0.035, 0.16, 4); geo.translate(0, 0.08, 0);
  const im = new THREE.InstancedMesh(geo, std(0x4f8a2a, 1), n); const r = mulberry(11); const m4 = new THREE.Matrix4(); let k = 0;
  while (k < n) {
    const x = B.x0 + 0.1 + r() * 9.8, z = B.z0 + 0.1 + r() * 8.3;
    if (x > P.x0 - 0.15 && x < P.x1 + 0.15 && z > P.z0 - 0.15) continue;   // fora da piscina
    if (x > -3.9 && x < 0.9 && z < -3.4 && z > -5.9) continue;             // fora da casa
    m4.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r() * 6, (r() - .5) * .3)), new THREE.Vector3(1, 0.6 + r() * 0.9, 1));
    im.setMatrixAt(k++, m4);
  }
  im.castShadow = false; im.receiveShadow = true; world.add(im);
}
// casa
const house = new THREE.Group(); world.add(house); house.position.set(-1.5, 0, -4.7);
{
  const wall = std(0xf3efe7, 0.85), roofM = std(0x4a4f57, 0.7), trim = std(0xffffff, 0.6), glass = std(0x9fc9e6, 0.15, { metalness: 0.2, emissive: 0x23384a, emissiveIntensity: 0.15 }), wood = std(0x8a5a36, 0.8);
  house.add(box(4.4, 2.3, 2.2, wall, 0, 1.15, 0));
  const tri = new THREE.Shape(); tri.moveTo(-1.32, 0); tri.lineTo(1.32, 0); tri.lineTo(0, 1.05); tri.lineTo(-1.32, 0);
  const rg = new THREE.ExtrudeGeometry(tri, { depth: 4.7, bevelEnabled: false }); rg.translate(0, 0, -2.35); rg.rotateY(Math.PI / 2);
  const roof = new THREE.Mesh(rg, roofM); roof.position.set(0, 2.3, 0); roof.castShadow = roof.receiveShadow = true; house.add(roof);
  for (const x of [-1.4, 1.35]) { house.add(box(0.9, 0.85, 0.06, trim, x, 1.35, 1.11)); house.add(box(0.78, 0.73, 0.07, glass, x, 1.35, 1.12)); }
  house.add(box(0.8, 1.55, 0.07, wood, 0, 0.78, 1.12));
  house.add(box(2.6, 0.08, 0.9, wood, 0, 0.04, 1.55)); // degrau / deck
}
// árvore
const tree = new THREE.Group(); world.add(tree); tree.position.set(3.6, 0, -4.4);
{
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 1.6, 10), std(0x6b4a2e)); tr.position.y = 0.8; tr.castShadow = true; tree.add(tr);
  const cm = std(0x3f7d2c, 0.9);
  for (const [x, y, z, s] of [[0, 2.0, 0, 0.95], [0.45, 1.75, 0.2, 0.7], [-0.4, 1.8, -0.15, 0.72], [0.1, 2.5, -0.1, 0.65]]) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), cm); c.position.set(x, y, z); c.castShadow = true; tree.add(c); }
}

// ---------- obra ----------
const IN = { x0: P.x0 + T, x1: P.x1 - T, z0: P.z0 + T, y0: P.y0 + T }; // bacia interna
// pedaços de terra que desmoronam
const crumbs = []; { const r = mulberry(5); const g = new THREE.DodecahedronGeometry(0.06, 0); for (let i = 0; i < 34; i++) { const m = new THREE.Mesh(g, MS.soil); m.castShadow = true; const side = i % 3; m.userData = { side, u: r(), d: r() * 0.9, s: 0.6 + r() * 1.1 }; m.visible = false; world.add(m); crumbs.push(m); } }
// gaiola de ferro (instanciada)
const bars = []; // {a,b} pares de pontos
{
  const st = 0.36;
  for (let z = P.z0 + 0.1; z < B.z1; z += st) { bars.push([[P.x0 + 0.1, P.y0 + 0.1, z], [P.x0 + 0.1, -0.05, z]]); bars.push([[P.x1 - 0.1, P.y0 + 0.1, z], [P.x1 - 0.1, -0.05, z]]); }
  for (let x = P.x0 + 0.1; x <= P.x1 - 0.1; x += st) bars.push([[x, P.y0 + 0.1, P.z0 + 0.1], [x, -0.05, P.z0 + 0.1]]);
  for (const y of [-1.35, -0.85, -0.35]) { bars.push([[P.x0 + 0.1, y, P.z0 + 0.1], [P.x0 + 0.1, y, B.z1]]); bars.push([[P.x1 - 0.1, y, P.z0 + 0.1], [P.x1 - 0.1, y, B.z1]]); bars.push([[P.x0 + 0.1, y, P.z0 + 0.1], [P.x1 - 0.1, y, P.z0 + 0.1]]); }
  for (let x = P.x0 + 0.1; x <= P.x1 - 0.1; x += st) bars.push([[x, P.y0 + 0.1, P.z0 + 0.1], [x, P.y0 + 0.1, B.z1]]);
  for (let z = P.z0 + 0.1; z < B.z1; z += st) bars.push([[P.x0 + 0.1, P.y0 + 0.1, z], [P.x1 - 0.1, P.y0 + 0.1, z]]);
}
const rebarGeo = new THREE.CylinderGeometry(0.022, 0.022, 1, 5); rebarGeo.translate(0, 0.5, 0);
const rebar = new THREE.InstancedMesh(rebarGeo, std(0x8a4a2a, 0.55, { metalness: 0.5 }), bars.length); rebar.castShadow = true; world.add(rebar);
bars.forEach((b, i) => { const a = new THREE.Vector3(...b[0]), c = new THREE.Vector3(...b[1]); b.len = a.distanceTo(c); b.q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.clone().sub(a).normalize()); b.a = a; b.order = (a.y + c.y) * 0.5 + i * 0.002; });
const barOrder = bars.map((b, i) => i).sort((i, j) => bars[i].order - bars[j].order);
// casca: concreto, manta, pastilha (paredes + fundo, dentro do buraco)
function shell(m, inset) {
  const g = new THREE.Group(); const t = 0.02 + inset;
  g.add(bx(P.x0 + inset, P.x0 + T, P.y0 + inset, -0.02, P.z0 + inset, B.z1 - 0.001, m), bx(P.x1 - T, P.x1 - inset, P.y0 + inset, -0.02, P.z0 + inset, B.z1 - 0.001, m),
    bx(P.x0 + inset, P.x1 - inset, P.y0 + inset, -0.02, P.z0 + inset, P.z0 + T, m), bx(P.x0 + inset, P.x1 - inset, P.y0 + inset, P.y0 + T, P.z0 + inset, B.z1 - 0.001, m));
  world.add(g); return g;
}
const conc = shell(MS.conc, 0.0);
// mais simples: placas finas coladas na bacia interna
function liner(m, d) {
  const g = new THREE.Group(), e = 0.015;
  g.add(bx(IN.x0, IN.x0 + e, IN.y0, -0.02, IN.z0, B.z1 - 0.002, m), bx(IN.x1 - e, IN.x1, IN.y0, -0.02, IN.z0, B.z1 - 0.002, m),
    bx(IN.x0, IN.x1, IN.y0, -0.02, IN.z0, IN.z0 + e, m), bx(IN.x0, IN.x1, IN.y0, IN.y0 + e, IN.z0, B.z1 - 0.002, m));
  g.position.set(0, 0, 0); g.children.forEach(o => { o.position.x += 0; }); world.add(g); return g;
}
const membL = liner(MS.memb), tileL = liner(MS.tile);
membL.children.forEach(o => { o.position.add(new THREE.Vector3(o.position.x < 0 ? 0.004 : -0.004, 0.004, 0.004)); });
tileL.children.forEach(o => { o.position.add(new THREE.Vector3(o.position.x < IN.x0 + 0.1 ? 0.012 : (o.position.x > IN.x1 - 0.1 ? -0.012 : 0), 0.012, 0.012)); });
// água
const waterM = new THREE.MeshStandardMaterial({ color: 0x3fb2e0, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.62, depthWrite: false });
const water = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), waterM); water.renderOrder = 2; world.add(water);
const surfG = new THREE.PlaneGeometry(IN.x1 - IN.x0 - 0.04, B.z1 - IN.z0 - 0.02, 40, 40); surfG.rotateX(-Math.PI / 2);
const surfM = new THREE.MeshStandardMaterial({ color: 0x8fd6f2, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.55, depthWrite: false });
const surf = new THREE.Mesh(surfG, surfM); surf.position.set(0, 0, (IN.z0 + B.z1) / 2); surf.renderOrder = 3; world.add(surf);
const surfBase = surfG.attributes.position.array.slice();
// gotas que vazam pela terra (problema)
const drips = []; { const g = new THREE.CapsuleGeometry(0.035, 0.16, 3, 6); const m = std(0x3aa6e6, 0.2, { emissive: 0x0b4a7a, emissiveIntensity: 0.4 }); const r = mulberry(9);
  for (let i = 0; i < 22; i++) { const d = new THREE.Mesh(g, m); d.userData = { x: IN.x0 + 0.2 + r() * (IN.x1 - IN.x0 - 0.4), o: r(), v: 0.7 + r() * 0.6 }; d.visible = false; world.add(d); drips.push(d); } }
// canos (na face do corte, meio enterrados)
const pipeM = std(0xf2f2ee, 0.45);
function pipe(pts, r = 0.075) {
  const g = new THREE.Group(); const segs = [];
  for (let i = 0; i < pts.length - 1; i++) { const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]); const len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 14), pipeM); m.castShadow = true; m.userData = { a, b, len };
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); g.add(m); segs.push(m);
    const j = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 12, 8), pipeM); j.position.copy(b); j.userData.joint = true; g.add(j); }
  world.add(g); return { g, segs, total: segs.reduce((s, m) => s + m.userData.len, 0) };
}
const ZC = B.z1 + 0.01;
const suction = pipe([[0.6, IN.y0 + 0.02, ZC], [0.6, P.y0 - 0.25, ZC], [4.15, P.y0 - 0.25, ZC], [4.15, 0.05, ZC]]);
const ret = pipe([[3.6, 0.05, ZC], [3.6, -1.0, ZC], [IN.x1 - 0.02, -1.0, ZC]]);
const drain = box(0.42, 0.03, 0.42, std(0xdcdcd8, 0.4), 0.6, IN.y0 + 0.03, B.z1 - 0.24); world.add(drain);
const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.14, 12), std(0xdcdcd8, 0.4)); nozzle.rotation.z = Math.PI / 2; nozzle.position.set(IN.x1 - 0.06, -1.0, B.z1 - 0.12); world.add(nozzle);
// filtro de areia + bomba em cima da grama
const filt = new THREE.Group(); world.add(filt); filt.position.set(3.9, 0, B.z1 - 0.45);
{ const tank = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.5, 6, 16), std(0x2f6f9f, 0.45)); tank.position.y = 0.68; tank.castShadow = true; filt.add(tank);
  const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 16), std(0x222428, 0.5)); valve.position.y = 1.25; filt.add(valve);
  const pump = box(0.42, 0.3, 0.32, std(0x3a3d42, 0.5), -0.55, 0.15, 0.05); filt.add(pump);
  const base = box(1.6, 0.06, 0.8, std(0xa9a49a, 0.9), -0.25, 0.03, 0); filt.add(base); }
// setinhas de fluxo nos canos
const flowG = new THREE.ConeGeometry(0.05, 0.14, 8); const flowM = std(0x2b9be0, 0.3, { emissive: 0x1a6fb0, emissiveIntensity: 0.9 });
const arrows = []; for (let i = 0; i < 26; i++) { const a = new THREE.Mesh(flowG, flowM); a.visible = false; world.add(a); arrows.push(a); }
function along(p, u) { let d = u * p.total; for (const m of p.segs) { const { a, b, len } = m.userData; if (d <= len) { const k = d / len; return [a.clone().lerp(b, k), b.clone().sub(a).normalize()]; } d -= len; } const m = p.segs[p.segs.length - 1].userData; return [m.b.clone(), m.b.clone().sub(m.a).normalize()]; }
// skimmer na parede lateral, aberto no corte: boca na parede, cesto dentro, cano até a sucção
const SK = { x0: P.x1, x1: 2.62, y0: -0.62, y1: -0.02, z0: 1.88, z1: B.z1, m0: -0.5, m1: -0.08 };
const skim = new THREE.Group(); world.add(skim);
{ const wm = std(0xeeeeea, 0.4), e = 0.03;
  skim.add(bx(SK.x1 - e, SK.x1, SK.y0, SK.y1, SK.z0, SK.z1 - 0.001, wm), bx(SK.x0, SK.x1, SK.y0, SK.y0 + e, SK.z0, SK.z1 - 0.001, wm), bx(SK.x0, SK.x1, SK.y0, SK.y1, SK.z0, SK.z0 + e, wm),
    bx(SK.x0, SK.x0 + e, SK.y0, SK.m0, SK.z0, SK.z1 - 0.001, wm), bx(SK.x0, SK.x0 + e, SK.m1, SK.y1, SK.z0, SK.z1 - 0.001, wm));
  // boca: abertura escura atravessando a parede da piscina
  skim.add(bx(IN.x1 - 0.04, SK.x0 + 0.02, SK.m0, SK.m1, SK.z0 + 0.03, SK.z1 + 0.004, std(0x1d3a4c, 0.6)));
  // tampa na grama
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 24), wm); lid.position.set((SK.x0 + SK.x1) / 2 + 0.02, 0.01, SK.z0 + 0.25); skim.add(lid);
  // cesto
  const bm = std(0x7d8b92, 0.6); const by = -0.47;
  skim.add(bx(SK.x0 + 0.07, SK.x1 - 0.07, by, by + 0.02, SK.z0 + 0.07, SK.z1 - 0.03, bm), bx(SK.x0 + 0.07, SK.x0 + 0.09, by, by + 0.14, SK.z0 + 0.07, SK.z1 - 0.03, bm),
    bx(SK.x1 - 0.09, SK.x1 - 0.07, by, by + 0.14, SK.z0 + 0.07, SK.z1 - 0.03, bm), bx(SK.x0 + 0.07, SK.x1 - 0.07, by, by + 0.14, SK.z0 + 0.07, SK.z0 + 0.09, bm)); }
const skWater = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x3fb2e0, roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false })); skWater.renderOrder = 2; world.add(skWater);
// folhas
const leafS = new THREE.Shape(); leafS.moveTo(0, -0.12); leafS.quadraticCurveTo(0.1, 0, 0, 0.12); leafS.quadraticCurveTo(-0.1, 0, 0, -0.12);
const leafG = new THREE.ShapeGeometry(leafS);
const leaves = [0xc98a2a, 0xd9a03a, 0xa8742a].map(c => { const m = new THREE.Mesh(leafG, std(c, 0.8, { side: THREE.DoubleSide })); m.castShadow = true; world.add(m); return m; });
// correnteza na superfície (setinhas brancas indo pra boca)
const curM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
const curs = []; for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(flowG, curM); c.rotation.z = -Math.PI / 2; c.scale.set(1.2, 1.2, 0.4); c.renderOrder = 4; world.add(c); curs.push(c); }
// boia
const floatie = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.12, 14, 32), std(0xff6f61, 0.45)); floatie.rotation.x = -Math.PI / 2; floatie.castShadow = true; world.add(floatie);
// monte de terra tirada do buraco (aparece ao cavar, some depois)
const pile = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), MS.soil); pile.position.set(3.4, 0, -2.0); pile.castShadow = pile.receiveShadow = true; world.add(pile);
// partículas genéricas (terra voando, jato de concreto)
const parts = []; { const g = new THREE.SphereGeometry(0.04, 5, 4); for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(g, MS.soil); m.visible = false; world.add(m); parts.push(m); } }
const sprayM = std(0x9c9c98, 0.9);
// marcador de problema (moldura vermelha pulsando)
const warnM = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
const warnWalls = new THREE.Group(); world.add(warnWalls);
for (const [x, ry] of [[P.x0 + 0.01, Math.PI / 2], [P.x1 - 0.01, -Math.PI / 2]]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(B.z1 - P.z0, -P.y0), warnM); p.rotation.y = ry; p.position.set(x, P.y0 / 2, (P.z0 + B.z1) / 2); warnWalls.add(p); }
const warnFloor = new THREE.Mesh(new THREE.PlaneGeometry(P.x1 - P.x0, 1.2), warnM); warnFloor.position.set(0, P.y0 - 0.6, B.z1 + 0.012); world.add(warnFloor);

// ---------- coreografia ----------
const r1 = mulberry(3), rnd = Array.from({ length: 400 }, () => r1());
function place(t) {
  // L0 intro · L1 cava · L2 desmorona+ferro · L3 concreto · L4 vaza · L5 manta+pastilha · L6 verde · L7 canos/filtro · L8 skimmer · L9 enche+boia
  const dig = ss(seg(t, L[1] + 1.4, nextL(1) + 0.2));
  plugGrass.visible = t < L[1] + 1.5;
  const dy = lerpN(-0.1, P.y0 + 0.001, dig); plug.visible = dig < 0.999;
  const ph0 = Math.max(0.001, dy - P.y0); plug.scale.y = ph0 / (-0.1 - P.y0); plug.position.y = P.y0 + ph0 / 2;
  // terra voando enquanto cava
  const digOn = env(t, L[1] + 1.4, nextL(1) + 0.2, 0.2, 0.3);
  parts.forEach((p, i) => { const ph = (t * 1.6 + rnd[i]) % 1; const on = digOn > 0.05;
    p.visible = on; if (!on) return; p.material = MS.soil;
    const sx = lerpN(P.x0 + 0.4, P.x1 - 0.4, rnd[i + 60]), sz = lerpN(P.z0 + 0.4, B.z1 - 0.6, rnd[i + 120]), sy = dy;
    p.position.set(lerpN(sx, 3.2 + rnd[i + 180] * 0.6, ph), sy + Math.sin(ph * Math.PI) * 1.4 + ph * (0.1 - sy), lerpN(sz, -2.0 + (rnd[i + 240] - .5) * .6, ph)); p.scale.setScalar(0.7 + rnd[i + 300]); });
  const pileK = ss(seg(t, L[1] + 0.8, nextL(1))) * (1 - ss(seg(t, L[3], L[3] + 0.8)));
  pile.visible = pileK > 0.01; pile.scale.set(0.9 * pileK + 0.01, 0.75 * pileK + 0.01, 0.9 * pileK + 0.01);
  // desmorona: pedaços caindo das paredes
  const cr = seg(t, L[2] + 0.2, L[2] + 2.0);
  crumbs.forEach(c => { const { side, u, d, s } = c.userData; const k = clamp((cr - d * 0.5) / 0.5); c.visible = cr > 0 && t < L[3] + 0.5 && k > 0;
    const x = side === 0 ? P.x0 + 0.05 : side === 1 ? P.x1 - 0.05 : lerpN(P.x0 + 0.3, P.x1 - 0.3, u);
    const z = side === 2 ? P.z0 + 0.05 : lerpN(P.z0 + 0.3, B.z1 - 0.3, u);
    const fall = ei(clamp(k)); c.position.set(x + (side === 0 ? 1 : side === 1 ? -1 : 0) * fall * 0.35, lerpN(-0.15 - d * 0.2, P.y0 + 0.08, fall), z + (side === 2 ? fall * 0.3 : 0)); c.scale.setScalar(s); c.rotation.set(fall * 4 + u * 6, fall * 3, 0); });
  warnM.opacity = 0.32 * env(t, L[2] + 0.2, L[2] + 2.3, 0.2, 0.3) * (0.6 + 0.4 * Math.sin(t * 12));
  warnWalls.visible = t < L[3]; warnFloor.visible = t > L[4] && t < L[5];
  if (t > L[4]) warnM.opacity = 0.35 * env(t, L[4] + 0.8, nextL(4) - 0.1, 0.25, 0.3) * (0.6 + 0.4 * Math.sin(t * 12));
  // ferro: barras brotam de baixo pra cima
  const rb = seg(t, L[2] + 1.9, nextL(2) - 0.1); const m4 = new THREE.Matrix4();
  barOrder.forEach((i, k) => { const b = bars[i]; const g = eo(clamp(rb * 1.25 * bars.length / bars.length - k / bars.length * 0.95)) ; const hide = MS.conc.userData.u.uWipe.value > -0.06 && t > L[3];
    m4.compose(b.a, b.q, new THREE.Vector3(1, Math.max(0.0001, b.len * clamp(g * 1.6)), 1)); if (hide || rb <= 0) m4.makeScale(0, 0, 0); rebar.setMatrixAt(i, m4); });
  rebar.instanceMatrix.needsUpdate = true;
  // concreto jateado sobe
  const cw = ss(seg(t, L[3] + 0.3, nextL(3) - 0.4)); conc.visible = cw > 0; MS.conc.userData.u.uWipe.value = lerpN(P.y0 - 0.01, 0.05, cw);
  // jato: partículas cinza no bico
  const spray = env(t, L[3] + 0.3, nextL(3) - 0.4, 0.2, 0.2);
  if (spray > 0.02) parts.forEach((p, i) => { if (i > 40) { p.visible = false; return; } const ph = (t * 3 + rnd[i]) % 1; p.visible = true; p.material = sprayM;
    const y = MS.conc.userData.u.uWipe.value; const side = i % 2 ? P.x0 + 0.2 : P.x1 - 0.2; p.position.set(lerpN(0, side, ph), lerpN(0.6, y - 0.1, ph) + Math.sin(ph * 3) * 0.1, lerpN(1.2, (P.z0 + B.z1) / 2 + (rnd[i + 50] - .5) * 3, ph)); p.scale.setScalar(0.6); });
  // vaza: água fantasma e gotas descendo pela terra
  const seep = env(t, L[4] + 0.4, nextL(4), 0.4, 0.3);
  drips.forEach(d => { const { x, o, v } = d.userData; const ph = (t * v * 0.55 + o) % 1; d.visible = seep > 0.05; d.position.set(x, P.y0 - 0.1 - ph * 1.6, B.z1 + 0.04); d.scale.setScalar(seep * (1 - ph * 0.6)); });
  // manta escura e depois pastilha, de baixo pra cima
  const mw = ss(seg(t, L[5] + 0.2, L[5] + 1.6)), tw = ss(seg(t, L[5] + 1.7, nextL(5) - 0.2));
  membL.visible = mw > 0; MS.memb.userData.u.uWipe.value = lerpN(IN.y0 - 0.02, 0.05, mw);
  tileL.visible = tw > 0; MS.tile.userData.u.uWipe.value = lerpN(IN.y0 - 0.02, 0.05, tw);
  // água: fantasma (vaza), verde, limpa, cheia
  let level = 0, op = 0.62, col = new THREE.Color(0x3fb2e0);
  if (seep > 0) { level = 0.45 * seep * (1 - seg(t, L[4] + 1.0, nextL(4))); op = 0.4; }
  const fill1 = ss(seg(t, L[6], L[6] + 1.2));
  if (t >= L[6]) { level = 1.05 * fill1; }
  const green = ss(seg(t, L[6] + 0.4, L[6] + 1.6)) * (1 - ss(seg(t, L[7] + 2.2, nextL(7) - 0.3)));
  col.lerp(new THREE.Color(0x5f8a2c), green); op = lerpN(op, 0.86, green);
  const fill2 = ss(seg(t, L[9] + 0.2, L[9] + 1.8)); if (t >= L[9]) level = lerpN(1.05, 1.25, fill2);
  waterM.color.copy(col); waterM.opacity = op; surfM.color.copy(col.clone().lerp(new THREE.Color(0xffffff), 0.35)); surfM.opacity = op * 0.8;
  const wy = IN.y0 + 0.02 + level; water.visible = surf.visible = level > 0.01;
  water.scale.set(IN.x1 - IN.x0 - 0.04, Math.max(0.001, level), B.z1 - IN.z0 - 0.03); water.position.set(0, IN.y0 + 0.02 + level / 2, (IN.z0 + B.z1) / 2);
  surf.position.y = wy;
  { const a = surfG.attributes.position; for (let i = 0; i < a.count; i++) { const x = surfBase[i * 3], z = surfBase[i * 3 + 2]; a.array[i * 3 + 1] = 0.012 * Math.sin(x * 4 + t * 2.1) + 0.01 * Math.sin(z * 5 - t * 1.7); } a.needsUpdate = true; surfG.computeVertexNormals(); }
  // canos crescem pelo corte, depois setas correm
  const pg = seg(t, L[7] + 0.1, L[7] + 2.0);
  for (const [p, k0] of [[suction, 0], [ret, 0.45]]) { const k = clamp((pg - k0) / 0.55); let d = k * p.total;
    p.g.children.forEach(m => { if (m.userData.joint) { m.visible = k > 0.98 || false; return; } const { a, b, len } = m.userData; const u = clamp(d / len); d -= len; m.visible = u > 0; m.scale.set(1, Math.max(0.001, u * len), 1); m.position.copy(a.clone().lerp(b, u * 0.5)); }); }
  drain.visible = nozzle.visible = filt.visible = t > L[7] + 0.1;
  filt.scale.setScalar(Math.max(0.001, back(seg(t, L[7] + 2.2, L[7] + 2.7), 2)));
  const flowOn = t > L[7] + 2.6;
  arrows.forEach((a, i) => { a.visible = flowOn; if (!flowOn) return; const p = i < 15 ? suction : ret; const n = i < 15 ? 15 : 11; const u = ((i % n) / n + t * 0.22) % 1; const [pos, dir] = along(p, u); a.position.copy(pos).add(new THREE.Vector3(0, 0, 0.07)); a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); });
  // skimmer: aparece com seu cano; folhas caem, a correnteza leva até a boca e elas ficam no cesto
  const sk = seg(t, L[8] - 0.3, L[8] + 0.5); skim.visible = sk > 0; skim.scale.set(1, 1, 1);
  skPlug.visible = sk <= 0;
  const skLevel = Math.min(wy, SK.y1 - 0.03); skWater.visible = sk > 0 && skLevel > SK.m0;
  skWater.scale.set(SK.x1 - SK.x0 - 0.06, Math.max(0.001, skLevel - SK.y0 - 0.03), SK.z1 - SK.z0 - 0.04); skWater.position.set((SK.x0 + SK.x1) / 2, (SK.y0 + 0.03 + skLevel) / 2, (SK.z0 + SK.z1) / 2);
  skWater.material.color.copy(waterM.color);
  leaves.forEach((lv, j) => {
    const o = j * 0.28, xs = [0.15, 0.75, -0.3][j], zs = [2.25, 1.95, 2.12][j];
    const A = seg(t, L[8] + 0.05 + o, L[8] + 1.0 + o), Bq = seg(t, L[8] + 1.0 + o, L[8] + 2.2 + o * 0.5), C = seg(t, L[8] + 2.2 + o * 0.5, L[8] + 2.8 + o * 0.5);
    lv.visible = A > 0; if (!lv.visible) return;
    const xm = SK.x0 - 0.05, zm = 2.18 + (j - 1) * 0.08, xb = (SK.x0 + SK.x1) / 2 + (j - 1) * 0.1, yb = -0.44 + j * 0.012;
    let x = xs + Math.sin(A * 6 + j) * 0.3 * (1 - A), y = lerpN(wy + 2.0 + j * 0.2, wy + 0.012, ss(A)), z = zs;
    if (Bq > 0) { x = lerpN(xs, xm, ss(Bq)); z = lerpN(zs, zm, ss(Bq)); y = wy + 0.012 + Math.sin(t * 3 + j) * 0.006; }
    if (C > 0) { x = lerpN(xm, xb, ss(C)); z = zm; y = lerpN(wy + 0.012, Math.min(yb, wy - 0.02), ei(C)); }
    lv.position.set(x, y, z);
    lv.rotation.set(-Math.PI / 2 + Math.sin(A * 9 + j) * 0.5 * (1 - A), 0, j * 1.7 + A * 4 + Bq * 0.8); lv.scale.setScalar(1.7);
  });
  const cOn = env(t, L[8] + 0.9, L[8] + 3.0, 0.3, 0.4); curM.opacity = 0.75 * cOn;
  curs.forEach((c, i) => { c.visible = cOn > 0.01; const u = ((i / curs.length) + t * 0.45) % 1; c.position.set(lerpN(0.1, SK.x0 - 0.15, u), wy + 0.025, 1.95 + (i % 3) * 0.17); c.material.opacity = 0.75 * cOn * Math.sin(u * Math.PI); });
  // boia cai e boia
  const fd = seg(t, L[9] + 1.6, L[9] + 2.4); floatie.visible = fd > 0;
  floatie.position.set(0.5, lerpN(2.4, wy + 0.05, ei(fd)) + (fd >= 1 ? Math.sin(t * 2.2) * 0.03 : 0), 0.6); floatie.rotation.z = t * 0.25;
}
function lerpN(a, b, k) { return a + (b - a) * k; }

// câmera: chaves (alvo, azimute, elevação, distância)
const KEYS = () => [
  [0.0, [0, 0.10, -1.4], -0.55, 0.42, 28.4],
  [L[1] - 0.3, [0, 0.10, -1.0], -0.25, 0.40, 24.4],
  [L[1] + 1.0, [0, 0.00, 0.2], -0.12, 0.62, 19.1],
  [L[2] + 0.5, [0, -0.20, 0.3], 0.18, 0.40, 16.9],
  [L[3] + 0.5, [0, -0.20, 0.3], 0.30, 0.48, 16.6],
  [L[4] + 0.2, [0.3, -0.80, 1.2], 0.08, 0.16, 15.8],
  [L[5] + 0.5, [0, -0.20, 0.4], -0.22, 0.42, 16.4],
  [L[6] + 0.3, [0, -0.10, 0.2], -0.32, 0.55, 17.7],
  [L[7] + 0.3, [1.6, -0.10, 1.0], 0.38, 0.24, 17.2],
  [L[7] + 3.5, [2.0, 0.10, 1.0], 0.48, 0.30, 18.2],
  [L[8] + 0.2, [1.5, -0.25, 1.6], 0.38, 0.30, 7.6],
  [L[8] + 3.3, [1.75, -0.3, 1.8], 0.30, 0.28, 6.8],
  [L[9] + 0.2, [0, 0.20, -0.4], -0.10, 0.58, 19.1],
  [DUR, [0, 0.00, -1.2], -0.62, 0.62, 30.4],
];
function camAt(t) {
  const K = KEYS(); let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [ta, A] = [K[i][0], K[i]], B2 = K[i + 1]; const k = eio(clamp((t - ta) / Math.max(0.01, B2[0] - ta)));
  const tg = A[1].map((v, j) => lerpN(v, B2[1][j], k)); const az = lerpN(A[2], B2[2], k), el = lerpN(A[3], B2[3], k), di = lerpN(A[4], B2[4], k);
  cam.position.set(tg[0] + Math.sin(az) * Math.cos(el) * di, tg[1] + Math.sin(el) * di, tg[2] + Math.cos(az) * Math.cos(el) * di);
  cam.lookAt(tg[0], tg[1], tg[2]);
}

// ---------- legenda: uma palavra por vez ----------
const ov = document.getElementById('ov'); ov.width = W; ov.height = H; const g = ov.getContext('2d');
const HOT = new Set(['piscina', 'metro', 'meio', 'ferro', 'concreto', 'manta', 'pastilha', 'verde', 'filtro', 'areia', 'skimmer', 'bomba', 'desmorona', 'poroso']);
const WORDS = TM.words.length ? TM.words : [[0.7, 'Esse'], [1.0, 'é'], [1.1, 'um'], [1.25, 'quintal'], [1.7, 'comum.']];
function word(t) {
  let i = -1; for (let k = 0; k < WORDS.length; k++) if (t >= WORDS[k][0]) i = k;
  if (i < 0) return []; const [ts, w, te0] = WORDS[i]; const te = Math.max(te0 ?? ts + 0.5, ts + 0.32) + 0.15;
  const nx = WORDS[i + 1]; if (t > te && !(nx && t < nx[0])) return [];
  if (nx && t >= nx[0]) return [];
  const p = back(seg(t, ts, ts + 0.14), 2.0);
  const clean = w.replace(/[.,!?]/g, ''); const hot = HOT.has(clean.toLowerCase());
  const fs = (clean.length > 9 ? 104 : 124) * U;
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${fs}px Mont`;
  g.translate(W / 2, H * 0.735); const s = 0.8 + 0.2 * p; g.scale(s, s); g.globalAlpha = clamp(p * 1.5);
  g.lineJoin = 'round'; g.lineWidth = 16 * U; g.strokeStyle = '#111'; g.strokeText(clean.toUpperCase(), 0, 0);
  g.fillStyle = hot ? '#ffd23f' : '#ffffff'; g.fillText(clean.toUpperCase(), 0, 0); g.restore();
  return [{ id: 'w' + ts, text: clean, pass: true, x0: 60 * U, y0: H * 0.69, x1: W - 60 * U, y1: H * 0.78 }];
}

function render(t) {
  place(t); camAt(t);
  renderer.render(scene, cam);
  g.clearRect(0, 0, W, H);
  const vg = g.createRadialGradient(W / 2, H * 0.5, W * 0.45, W / 2, H * 0.5, H * 0.72); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,20,30,.28)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  window._texts = word(t);
}
window.DUR = DUR;
window.render = render;
window.TEXTS = t => { render(t); return window._texts; };
window.EV = [
  { t: L[1] + 1.4, type: 'dig', d: nextL(1) - L[1] - 1.2 },
  { t: L[2] + 0.2, type: 'crumble', d: 1.8 },
  { t: L[2] + 1.9, type: 'clinks', d: nextL(2) - L[2] - 2.0 },
  { t: L[3] + 0.3, type: 'spray', d: nextL(3) - L[3] - 0.7 },
  { t: L[4] + 0.4, type: 'seep', d: nextL(4) - L[4] - 0.4 },
  { t: L[5] + 0.2, type: 'roll', d: 1.4 },
  { t: L[5] + 1.7, type: 'tiles', d: nextL(5) - L[5] - 1.9 },
  { t: L[6], type: 'fill', d: 1.4 },
  { t: L[7] + 0.1, type: 'pipes', d: 1.9 },
  { t: L[7] + 2.2, type: 'pop' },
  { t: L[7] + 2.6, type: 'pump', d: DUR - L[7] - 3.6 },
  ...[0, 1, 2].map(j => ({ t: L[8] + 1.0 + j * 0.28, type: 'plip' })), { t: L[8] + 2.3, type: 'gulp' },
  { t: L[9] + 0.2, type: 'fill', d: 1.6 },
  { t: L[9] + 2.4, type: 'splash' },
];
await Promise.all(['900 40px Mont', '800 40px Mont'].map(f => document.fonts.load(f)));
await document.fonts.ready;
render(0); window.READY = true;
