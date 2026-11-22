// "O cliente do desconto" — demo do estilo Bonecos 3D de Blocos (9:16).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clamp, seg, ss, eo, eio, back, env } from '/core/lib.js';

const W = innerWidth, H = innerHeight, U = W / 1080, DUR = 20;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x14173a);
scene.fog = new THREE.Fog(0x14173a, 14, 26);
const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.35;
const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);

// luz: ambiente azul-violeta + key quente + recorte rosa
scene.add(new THREE.HemisphereLight(0x8f9cff, 0x1a1030, 0.9));
const key = new THREE.DirectionalLight(0xfff0dd, 2.4); key.position.set(4, 8, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 }); scene.add(key);
const rim = new THREE.PointLight(0xff7ad9, 25, 14, 2); rim.position.set(-4, 4, -3); scene.add(rim);

const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82, metalness: 0 });
const box = (w, h, d, c) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? mat(c) : c); o.castShadow = o.receiveShadow = true; return o; };

// sala: chão, parede de fundo, prateleira com objetos simples, quadro
const room = new THREE.Group();
const fl = box(20, 0.2, 14, 0x232659); fl.position.y = -0.1; room.add(fl);
const wall = box(20, 10, 0.2, 0x262a63); wall.position.set(0, 5, -3.5); room.add(wall);
const shelf = box(3.2, 0.12, 0.6, 0x3a3f8a); shelf.position.set(-2.6, 3.6, -3.1); room.add(shelf);
const p1 = box(0.4, 0.6, 0.4, 0x5fd3c8); p1.position.set(-3.6, 3.96, -3.1); room.add(p1);
const p2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 4), mat(0x7ad1ff)); p2.position.set(-2.6, 4.0, -3.1); p2.castShadow = true; room.add(p2);
const p3 = box(0.7, 0.3, 0.45, 0xffc857); p3.position.set(-1.6, 3.81, -3.1); room.add(p3);
const frame = box(1.6, 1.1, 0.08, 0x111334); frame.position.set(2.6, 4.2, -3.38); room.add(frame);
const art = box(1.36, 0.86, 0.02, 0xff7a59); art.position.set(2.6, 4.2, -3.33); room.add(art);
const desk = box(4.4, 0.2, 1.6, 0x4b4fa3); desk.position.set(0, 1.5, 0.9); room.add(desk);
for (const x of [-2, 2]) { const leg = box(0.16, 1.4, 0.16, 0x3a3f8a); leg.position.set(x, 0.7, 0.9); room.add(leg); }
const laptop = new THREE.Group(); const lb = box(1.2, 0.06, 0.8, 0x9aa0c8); laptop.add(lb); const ls = box(1.2, 0.78, 0.05, 0x9aa0c8); ls.position.set(0, 0.4, -0.38); ls.rotation.x = -0.25; laptop.add(ls);
const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.66), new THREE.MeshStandardMaterial({ color: 0x8fe3ff, emissive: 0x58c8ff, emissiveIntensity: 0.9 })); scr.position.set(0, 0.4, -0.35); scr.rotation.x = -0.25; scr.rotation.y = Math.PI; laptop.add(scr);
laptop.position.set(-0.9, 1.63, 0.9); laptop.rotation.y = Math.PI; room.add(laptop);
scene.add(room);

// personagem: cabeça grande de bloco, cabelo em blocos, óculos, corpo curto
function person({ skin = 0xf3d2b5, hair = 0x3b2a22, shirt = 0x1e1f2a, glasses = true }) {
  const g = new THREE.Group(), head = new THREE.Group();
  head.add(box(1.5, 1.6, 1.4, skin));
  for (let i = 0; i < 7; i++) { const h = box(0.36, 0.34, 1.5, hair); h.position.set(-0.6 + i * 0.2, 0.9 + (i % 2) * 0.06, -0.02); head.add(h); }
  const back = box(1.56, 0.7, 0.3, hair); back.position.set(0, 0.55, -0.62); head.add(back);
  const eyes = [];
  for (const x of [-0.32, 0.32]) {
    const w = box(0.34, 0.3, 0.04, 0xffffff); w.position.set(x, 0.12, 0.71); head.add(w);
    const p = box(0.14, 0.16, 0.04, 0x111111); p.position.set(x, 0.1, 0.735); head.add(p); eyes.push(p);
    if (glasses) { const f = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.035, 6, 4), mat(0x9fb0ff)); f.rotation.z = Math.PI / 4; f.position.set(x, 0.12, 0.76); head.add(f); }
  }
  if (glasses) { const br = box(0.18, 0.04, 0.04, 0x9fb0ff); br.position.set(0, 0.16, 0.76); head.add(br); }
  const brows = []; for (const x of [-0.32, 0.32]) { const b = box(0.3, 0.06, 0.04, hair); b.position.set(x, 0.42, 0.72); head.add(b); brows.push(b); }
  const mouth = box(0.26, 0.06, 0.04, 0x3a1a1a); mouth.position.set(0, -0.38, 0.71); head.add(mouth);
  head.position.y = 2.45; g.add(head);
  const body = box(1.15, 1.2, 0.8, shirt); body.position.y = 1.2; g.add(body);
  const arms = []; for (const x of [-0.72, 0.72]) { const a = box(0.3, 1.0, 0.36, shirt); a.position.set(x, 1.3, 0); g.add(a); const hd = box(0.28, 0.26, 0.3, skin); hd.position.set(0, -0.6, 0); a.add(hd); arms.push(a); }
  for (const x of [-0.28, 0.28]) { const l = box(0.4, 0.62, 0.5, 0x2e3256); l.position.set(x, 0.31, 0); g.add(l); }
  return { g, head, mouth, eyes, brows, arms };
}
// bichinho: cubo verde-água com antena (personagem original do estilo)
function buddy() {
  const g = new THREE.Group(); const b = box(1.1, 1.0, 1.0, 0x5fd3c8); b.position.y = 0.5; g.add(b);
  const eyes = []; for (const x of [-0.22, 0.22]) { const e = box(0.16, 0.22, 0.04, 0x10203a); e.position.set(x, 0.6, 0.51); g.add(e); eyes.push(e); }
  const mouth = box(0.2, 0.05, 0.04, 0x10203a); mouth.position.set(0, 0.32, 0.51); g.add(mouth);
  const ant = box(0.06, 0.4, 0.06, 0x3a9c93); ant.position.set(0, 1.2, 0); g.add(ant);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffc400, emissiveIntensity: 1.2 })); tip.position.set(0, 1.45, 0); g.add(tip);
  for (const x of [-0.35, 0.35]) { const f = box(0.25, 0.16, 0.3, 0x3a9c93); f.position.set(x, 0.0, 0.1); g.add(f); }
  return { g, b, eyes, mouth, tip };
}
const rafa = person({}); rafa.g.position.set(-0.55, 0, 2.2); rafa.g.rotation.y = 0.35; scene.add(rafa.g);
const bud = buddy(); bud.g.position.set(1.15, 1.6, 0.9); bud.g.rotation.y = -0.5; scene.add(bud.g);

// ---------- falas (legenda amarela por palavra) ----------
const LINES = [
  { who: 'r', a: 0.8, b: 4.2, words: ['o', 'cliente', 'pediu', 'desconto'] },
  { who: 'b', a: 4.6, b: 7.0, words: ['de', 'quanto?'] },
  { who: 'r', a: 7.4, b: 10.6, words: ['de', 'cem', 'por', 'cento'] },
  { who: 'b', a: 11.0, b: 13.4, words: ['…'] },
  { who: 'r', a: 13.8, b: 17.2, words: ['e', 'ainda', 'quer', 'reembolso'] },
];
const SHOTS = [ // planos: geral, close nele, close no bichinho
  { a: 0, b: 4.4, s: 'wide' }, { a: 4.4, b: 7.2, s: 'bud' }, { a: 7.2, b: 10.8, s: 'rafa' },
  { a: 10.8, b: 13.6, s: 'bud' }, { a: 13.6, b: 17.4, s: 'rafa' }, { a: 17.4, b: 20, s: 'wide' },
];
const ov = document.getElementById('ov'); ov.width = W; ov.height = H; const g = ov.getContext('2d');
const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
function caption(t) {
  for (const L of LINES) {
    if (t < L.a || t > L.b) continue;
    const step = (L.b - L.a - 0.6) / L.words.length; const i = Math.min(L.words.length - 1, Math.floor((t - L.a) / step));
    const w = L.words[i], ts = L.a + i * step, p = back(seg(t, ts, ts + 0.16), 2.4);
    g.save(); g.font = `800 ${62 * U}px Poppins`; const tw = g.measureText(w).width;
    g.translate(W / 2, H * 0.8); g.scale(0.8 + 0.2 * p, 0.8 + 0.2 * p);
    g.fillStyle = 'rgba(10,10,20,.82)'; rr(-tw / 2 - 26 * U, -58 * U, tw + 52 * U, 84 * U, 22 * U); g.fill();
    g.fillStyle = '#ffd23f'; g.textAlign = 'center'; g.fillText(w, 0, 4 * U); g.restore();
    return [{ id: 'c' + L.a + i, text: w, pass: true, x0: 100, y0: H * 0.75, x1: W - 100, y1: H * 0.84 }];
  }
  return [];
}
function label(t) {
  const k = env(t, 0.2, 19.6, 0.4, 0.4); g.save(); g.globalAlpha = k; g.font = `600 ${30 * U}px Poppins`;
  const s = 'EPISÓDIO 01 · O CLIENTE DO DESCONTO'; const tw = g.measureText(s).width;
  g.fillStyle = 'rgba(10,10,25,.6)'; rr(W / 2 - tw / 2 - 22 * U, 150 * U, tw + 44 * U, 56 * U, 28 * U); g.fill();
  g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.fillText(s, W / 2, 189 * U); g.restore();
  return [{ id: 'label', text: s, x0: W / 2 - tw / 2, y0: 150 * U, x1: W / 2 + tw / 2, y1: 206 * U }];
}

function talking(who, t) { for (const L of LINES) if (L.who === who && t > L.a && t < L.b - 0.4 && L.words[0] !== '…') return true; return false; }
function anim(t) {
  // boca: abre e fecha quando fala
  const tr = talking('r', t), tb = talking('b', t);
  rafa.mouth.scale.set(1, tr ? 1 + 2.2 * Math.abs(Math.sin(t * 14)) : 1, 1);
  bud.mouth.scale.set(1, tb ? 1 + 4 * Math.abs(Math.sin(t * 16)) : 1, 1);
  // piscadas
  const blink = t2 => (t2 % 3.1) < 0.12 ? 0.15 : 1;
  rafa.eyes.forEach(e => e.scale.y = blink(t)); bud.eyes.forEach(e => e.scale.y = blink(t + 1.3));
  // reações: sobrancelhas e balanço
  const shock = env(t, 13.8, 17.4, 0.2, 0.4);
  rafa.brows.forEach((b, i) => { b.position.y = 0.42 + 0.08 * shock; b.rotation.z = (i ? -1 : 1) * 0.2 * env(t, 7.4, 10.6, 0.2, 0.3); });
  rafa.head.rotation.z = Math.sin(t * 2) * 0.03 + (tr ? Math.sin(t * 7) * 0.04 : 0);
  rafa.head.rotation.y = -0.15 + 0.25 * env(t, 4.4, 7.2, 0.3, 0.3);
  rafa.arms[1].rotation.x = -0.9 * env(t, 1.0, 3.8, 0.3, 0.3) - 1.4 * env(t, 14.0, 17.0, 0.2, 0.3);
  rafa.arms[0].rotation.x = -1.4 * env(t, 14.0, 17.0, 0.2, 0.3);
  const jump = Math.max(0, Math.sin(seg(t, 11.2, 11.9) * Math.PI)) * 0.6;
  bud.g.position.y = 1.6 + jump + 0.03 * Math.sin(t * 3); bud.b.scale.y = 1 - 0.12 * Math.sin(seg(t, 11.0, 11.25) * Math.PI);
  bud.eyes.forEach(e => { e.scale.y *= 1 + 0.8 * env(t, 11.0, 13.4, 0.1, 0.3); });
  bud.tip.material.emissiveIntensity = 0.8 + 1.5 * (tb ? Math.abs(Math.sin(t * 8)) : 0) + 2 * env(t, 11, 13.4, 0.1, 0.3);
}
function camera(t) {
  let sh = SHOTS.find(s => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1]; const k = (t - sh.a) / (sh.b - sh.a);
  if (sh.s === 'wide') { cam.position.set(0.8 - 0.5 * k, 4.4, 17.5 - 1.0 * k); cam.lookAt(0.2, 2.3, 0.8); }
  if (sh.s === 'rafa') { cam.position.set(0.9, 3.0, 10.2 - 0.6 * k); cam.lookAt(-0.55, 2.1, 2.2); }
  if (sh.s === 'bud') { cam.position.set(-0.4, 2.9, 8.6 - 0.5 * k); cam.lookAt(1.15, 2.0, 0.9); }
}
function render(t) {
  anim(t); camera(t); renderer.render(scene, cam);
  g.clearRect(0, 0, W, H);
  const vg = g.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, H * 0.7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,5,20,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  let tx = [...label(t), ...caption(t)];
  if (t > 17.6) { const k = eo(seg(t, 17.8, 18.4)); g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.font = `800 ${74 * U}px Poppins`; g.fillStyle = '#fff'; g.fillText('Filmes em Código', W / 2, H * 0.3); g.font = `600 ${32 * U}px Poppins`; g.fillStyle = '#ffd23f'; g.fillText('bonecos 3D de blocos', W / 2, H * 0.3 + 56 * U); g.restore(); tx.push({ id: 'end', text: 'Filmes em Código bonecos 3D de blocos', x0: 100, y0: H * 0.25, x1: W - 100, y1: H * 0.34 }); }
  window._t = tx;
}
window.DUR = DUR; window.render = render; window.TEXTS = t => { render(t); return window._t; };
const EV = [{ t: 0.2, type: 'whoosh' }, { t: 11.0, type: 'pop' }, { t: 11.2, type: 'whoosh' }, { t: 17.6, type: 'thump' }];
for (const L of LINES) { const step = (L.b - L.a - 0.6) / L.words.length; L.words.forEach((_, i) => EV.push({ t: L.a + i * step, type: L.who === 'r' ? 'tick' : 'pop' })); }
for (const s of SHOTS.slice(1)) EV.push({ t: s.a, type: 'click' });
window.EV = EV;
Promise.all(['800 40px Poppins', '600 40px Poppins'].map(f => document.fonts.load(f))).then(() => { render(0); window.READY = true; });
