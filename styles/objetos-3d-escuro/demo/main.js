// "Do roteiro ao vídeo" — demo do estilo Objetos 3D no Escuro (9:16).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clamp, seg, ss, eo, eio, back, env } from '/core/lib.js';

const W = innerWidth, H = innerHeight, U = W / 1080;
const DUR = 24;

// ---------- 3D ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050506);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.18;

const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);

// luz: key de cima, dois recortes frios atrás, um preenchimento quente bem fraco
const key = new THREE.SpotLight(0xfff1e0, 260, 30, 0.42, 0.7, 1.6);
key.position.set(1.6, 7.5, 3.2); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004;
scene.add(key, key.target);
const rimL = new THREE.PointLight(0x9fb4ff, 30, 12, 2); rimL.position.set(-3.2, 2.2, -2.6); scene.add(rimL);
const rimR = new THREE.PointLight(0xffc9a0, 18, 12, 2); rimR.position.set(3.4, 1.6, -2.4); scene.add(rimR);

// chão: preto fosco com um disco de luz embaixo do objeto
scene.fog = new THREE.Fog(0x050506, 10, 19);
const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.55, metalness: 0.0 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

const M = {
  body: new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.62, metalness: 0.15 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.5, metalness: 0.3 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8a8a90, roughness: 0.28, metalness: 0.9 }),
  paper: new THREE.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.85 }),
  accent: new THREE.MeshStandardMaterial({ color: 0xff6a3d, roughness: 0.45, emissive: 0xff4a1a, emissiveIntensity: 0.25 }),
  glow: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3dd, emissiveIntensity: 2.2 }),
  ink: new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.9 }),
};
const rbox = (w, h, d, m, r = 0.04) => { const g = new THREE.BoxGeometry(w, h, d, 1, 1, 1); const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; return o; };
const cyl = (rt, rb, h, m, s = 48) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); o.castShadow = o.receiveShadow = true; return o; };

// --- objeto 1: pilha de fichas de roteiro ---
const cards = new THREE.Group(); const cardList = [];
for (let i = 0; i < 6; i++) {
  const c = new THREE.Group();
  const sheet = rbox(1.5, 0.025, 2.0, M.paper); c.add(sheet);
  for (let l = 0; l < 6; l++) { const ln = rbox(l === 0 ? 0.9 : 1.15 - (l % 3) * 0.18, 0.006, 0.06, l === 0 ? M.accent : M.ink); ln.position.set(-0.05 - (l === 0 ? 0.12 : 0), 0.016, -0.7 + l * 0.24); c.add(ln); }
  cards.add(c); cardList.push(c);
}
scene.add(cards);

// --- objeto 2: microfone de estúdio ---
const mic = new THREE.Group();
const capsule = new THREE.Group();
const grille = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.75, 12, 48), new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.35, metalness: 0.85, wireframe: false }));
grille.castShadow = true; capsule.add(grille);
for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.012, 8, 64), M.steel); r.rotation.x = Math.PI / 2; r.position.y = -0.36 + i * 0.09; capsule.add(r); }
const band = cyl(0.44, 0.44, 0.12, M.dark); band.position.y = -0.62; capsule.add(band);
const dot = cyl(0.05, 0.05, 0.02, M.accent); dot.rotation.x = Math.PI / 2; dot.position.set(0, -0.62, 0.44); capsule.add(dot);
capsule.position.y = 2.15; mic.add(capsule);
const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.035, 12, 48, Math.PI), M.steel); yoke.rotation.z = Math.PI; yoke.position.y = 2.0; yoke.castShadow = true; mic.add(yoke);
const pole = cyl(0.045, 0.045, 1.4, M.steel); pole.position.y = 0.85; mic.add(pole);
const base = cyl(0.62, 0.7, 0.14, M.body); base.position.y = 0.07; mic.add(base);
scene.add(mic);

// --- objeto 3: projetor de cinema ---
const proj = new THREE.Group();
const pbody = rbox(1.9, 1.0, 1.15, M.body); pbody.position.y = 0.6; proj.add(pbody);
const panel = rbox(1.5, 0.34, 0.02, M.dark); panel.position.set(0, 0.52, 0.585); proj.add(panel);
for (let i = 0; i < 4; i++) { const k = rbox(0.18, 0.12, 0.02, M.ink); k.position.set(-0.55 + i * 0.24, 0.52, 0.6); proj.add(k); }
const knob = cyl(0.13, 0.13, 0.08, M.steel); knob.rotation.x = Math.PI / 2; knob.position.set(0.52, 0.52, 0.62); proj.add(knob);
const badge = rbox(0.26, 0.26, 0.03, M.accent); badge.position.set(0.15, 0.85, 0.59); proj.add(badge);
const lens = cyl(0.2, 0.24, 0.5, M.dark); lens.rotation.z = Math.PI / 2; lens.position.set(1.18, 0.66, 0); proj.add(lens);
const lensGlass = cyl(0.17, 0.17, 0.02, M.glow); lensGlass.rotation.z = Math.PI / 2; lensGlass.position.set(1.44, 0.66, 0); proj.add(lensGlass);
const reels = [];
for (const x of [-0.5, 0.45]) {
  const arm = cyl(0.04, 0.04, 0.55, M.steel); arm.position.set(x, 1.38, 0); proj.add(arm);
  const reel = new THREE.Group();
  const disc = cyl(0.52, 0.52, 0.08, M.dark); disc.rotation.x = Math.PI / 2; reel.add(disc);
  for (let h = 0; h < 5; h++) { const a = h / 5 * Math.PI * 2; const hole = cyl(0.11, 0.11, 0.1, M.body); hole.rotation.x = Math.PI / 2; hole.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0); reel.add(hole); }
  const hub = cyl(0.08, 0.08, 0.12, M.steel); hub.rotation.x = Math.PI / 2; reel.add(hub);
  reel.position.set(x, 1.95, 0); proj.add(reel); reels.push(reel);
}
const beamGeo = new THREE.ConeGeometry(1.1, 5, 48, 1, true); beamGeo.rotateZ(Math.PI / 2); beamGeo.translate(-2.5, 0, 0);
const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: 0xfff1d6, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
beam.rotation.y = Math.PI; beam.position.set(1.44, 0.66, 0); // feixe removido: a lente acesa basta
scene.add(proj);

// ---------- texto (overlay 2D) ----------
const ov = document.getElementById('ov'); ov.width = W; ov.height = H; const g = ov.getContext('2d');
const SCENES = [
  { a: 0.3, b: 7.4, l1: 'Do roteiro', hi: 'ao vídeo pronto', l3: '' },
  { a: 7.6, b: 14.4, l1: 'Narração', hi: 'sem microfone', l3: '' },
  { a: 14.6, b: 21.0, l1: 'Edição', hi: 'no automático', l3: '' },
  { a: 21.3, b: 24.0, l1: 'Filmes em', hi: 'Código', l3: '' },
];
const WORDS = [ // legenda de uma palavra, embaixo
  [1.6, 'escreve'], [2.3, 'a'], [2.6, 'ideia'], [4.4, 'vira'], [4.9, 'cena'],
  [9.0, 'a'], [9.3, 'voz'], [9.8, 'sai'], [10.3, 'pronta'], [11.9, 'e'], [12.2, 'sincronizada'],
  [16.0, 'corta'], [16.7, 'anima'], [17.4, 'legenda'], [18.9, 'e'], [19.2, 'exporta'],
];
const BLUE = '#6f9bff';
function headline(s, t) {
  const k = env(t, s.a, s.b, 0.5, 0.35); if (k <= 0) return [];
  const y0 = 300 * U, rise = (1 - eo(seg(t, s.a, s.a + 0.7))) * 40 * U;
  g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = `800 ${92 * U}px Inter`; g.fillStyle = '#f5f3ee';
  g.fillText(s.l1, W / 2, y0 + rise);
  // destaque: serifada itálica numa caixa azul com brilho
  const fs = 104 * U; g.font = `italic ${fs}px 'Instrument Serif'`;
  const tw = g.measureText(s.hi).width, bx = W / 2 - tw / 2 - 22 * U, by = y0 + 34 * U + rise, bw = tw + 44 * U, bh = fs * 1.08;
  const grow = eo(seg(t, s.a + 0.35, s.a + 0.95));
  g.shadowColor = 'rgba(111,155,255,.65)'; g.shadowBlur = 26 * U;
  g.fillStyle = 'rgba(40,70,160,.28)'; g.fillRect(bx, by, bw * grow, bh);
  g.strokeStyle = BLUE; g.lineWidth = 2.5 * U; g.strokeRect(bx, by, bw * grow, bh);
  g.shadowBlur = 0;
  // cantos (alças), como numa caixa de seleção
  if (grow > 0.98) for (const [cx, cy] of [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]]) { g.fillStyle = '#fff'; g.fillRect(cx - 5 * U, cy - 5 * U, 10 * U, 10 * U); g.strokeRect(cx - 5 * U, cy - 5 * U, 10 * U, 10 * U); }
  g.globalAlpha = k * eo(seg(t, s.a + 0.6, s.a + 1.1)); g.fillStyle = '#eef3ff';
  g.fillText(s.hi, W / 2, by + fs * 0.84);
  g.restore();
  return [{ id: 'h' + s.a, text: s.l1 + ' ' + s.hi, x0: bx, y0: y0 - 92 * U, x1: bx + bw, y1: by + bh }];
}
function word(t) {
  let cur = null; for (const [ts, w] of WORDS) if (t >= ts) cur = [ts, w];
  if (!cur) return []; const [ts, w] = cur; const next = WORDS.find(x => x[0] > ts); const te = Math.min(next ? next[0] : ts + 1.2, ts + 1.2);
  if (t > te) return [];
  const p = back(seg(t, ts, ts + 0.18), 2.2);
  g.save(); g.textAlign = 'center'; g.font = `700 ${58 * U}px Inter`; g.fillStyle = '#ffffff';
  g.translate(W / 2, H - 250 * U); g.scale(0.85 + 0.15 * p, 0.85 + 0.15 * p); g.globalAlpha = clamp(p * 1.4);
  g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 18 * U; g.fillText(w, 0, 0); g.restore();
  return [{ id: 'w' + ts, text: w, pass: true, x0: W / 2 - 200 * U, y0: H - 320 * U, x1: W / 2 + 200 * U, y1: H - 230 * U }];
}

// ---------- coreografia ----------
const OBJ = [ { o: cards, a: 0.0, b: 7.5 }, { o: mic, a: 7.5, b: 14.5 }, { o: proj, a: 14.5, b: 21.2 } ];
function place(t) {
  for (const { o, a, b } of OBJ) {
    const inn = eo(seg(t, a, a + 1.1)), out = eio(seg(t, b - 0.7, b));
    o.visible = t > a - 0.01 && t < b + 0.01;
    o.position.set(0, -2.2 * (1 - inn) + 3.0 * out, 0);
    o.rotation.y = -0.55 + (t - a) * 0.09 + (1 - inn) * -0.8 + out * 1.2;
    const sc = 0.85 + 0.15 * inn; o.scale.setScalar(sc * (1 - out * 0.3));
  }
  // fichas: espalham em leque e voltam a empilhar
  const fan = ss(seg(t, 1.4, 3.2)) - ss(seg(t, 4.6, 6.0));
  cardList.forEach((c, i) => {
    c.position.set((i - 2.5) * 0.06 * fan * 2, 0.7 + i * 0.05 + fan * i * 0.12, (i - 2.5) * -0.05);
    c.rotation.set(-0.15 * fan, (i - 2.5) * 0.16 * fan, (i - 2.5) * 0.06 * fan);
  });
  cards.rotation.x = -0.5 + 0.1 * Math.sin(t * 0.8);
  // microfone: anel de voz pulsando
  const talk = env(t, 8.8, 13.0, 0.3, 0.5);
  capsule.rotation.z = Math.sin(t * 1.3) * 0.04; grille.material.emissive = new THREE.Color(0x2b3c8a); grille.material.emissiveIntensity = talk * (0.08 + 0.1 * Math.abs(Math.sin(t * 9)));
  // projetor: rolos giram, feixe acende
  reels.forEach((r, i) => { r.rotation.z = -(t - 14.5) * (i ? 2.6 : 2.2) * clamp((t - 15.4) / 0.8); });
  0 && env(t, 16.0, 21.0, 0.4, 0.5) * (0.85 + 0.15 * Math.sin(t * 40));
  lensGlass.material.emissiveIntensity = 0.4 + 2.2 * env(t, 16.0, 21.0, 0.4, 0.5);
  // câmera: aproxima devagar, leve arco
  const k = (t % 7) / 7;
  const ang = -0.25 + 0.3 * k, dist = 12.4 - 1.0 * ss(k);
  cam.position.set(Math.sin(ang) * dist, 2.4 + 0.4 * k, Math.cos(ang) * dist);
  cam.lookAt(0, 1.9, 0);
  key.target.position.set(0, 0.8, 0);
}

function render(t) {
  place(t);
  // final: tudo some, sobra o nome
  scene.visible = t < 21.4;
  renderer.render(scene, cam);
  g.clearRect(0, 0, W, H);
  // vinheta
  const vg = g.createRadialGradient(W / 2, H * 0.55, W * 0.2, W / 2, H * 0.55, H * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  let texts = [];
  for (const s of SCENES) texts = texts.concat(headline(s, t));
  texts = texts.concat(word(t));
  if (t > 21.6) { const k = eo(seg(t, 21.8, 22.6)); g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.font = `500 ${34 * U}px Inter`; g.fillStyle = '#8f8f99'; g.fillText('99 estilos · tudo em código', W / 2, H * 0.62); g.restore(); texts.push({ id: 'sub', text: '99 estilos · tudo em código', x0: 200 * U, y0: H * 0.6, x1: 880 * U, y1: H * 0.64 }); }
  window._texts = texts;
}

window.DUR = DUR;
window.render = render;
window.TEXTS = t => { render(t); return window._texts; };
window.EV = [
  ...[0.3, 7.6, 14.6, 21.3].map(t => ({ t, type: 'whoosh' })),
  ...[0.7, 8.0, 15.0, 21.8].map(t => ({ t: t + 0.25, type: 'tick' })),
  { t: 1.4, type: 'paper' }, { t: 4.6, type: 'paper' },
  { t: 8.8, type: 'hum', d: 4.2 },
  { t: 15.4, type: 'motor', d: 5.4 }, { t: 16.0, type: 'click' },
  ...WORDS.map(([t]) => ({ t, type: 'pop' })),
  { t: 21.3, type: 'thump' },
];
Promise.all([`800 40px Inter`,`700 40px Inter`,`500 40px Inter`,`italic 40px 'Instrument Serif'`].map(f=>document.fonts.load(f))).then(()=>document.fonts.ready).then(() => { render(0); window.READY = true; });
