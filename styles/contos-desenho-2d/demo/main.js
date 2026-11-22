// "O mundo do depois" — demo do estilo Contos em Desenho 2D (9:16).
import { clamp, seg, ss, eo, eio, back, env, lerp } from '/core/lib.js';

const cv = document.getElementById('c'), W = innerWidth, H = innerHeight; cv.width = W; cv.height = H;
const g = cv.getContext('2d'), U = W / 1080, DUR = 20;
const INK = '#1d1d2b', OL = 7 * U;

// legenda: grupos de 1–3 palavras; a palavra entre * fica amarela
const CAPS = [
  [0.6, 'Neste mundo,'], [1.7, 'quem deixa'], [2.6, 'tudo pra'], [3.3, '*depois*'],
  [4.6, 'ganha uma'], [5.4, '*plantinha*'], [6.3, 'na cabeça.'],
  [8.0, 'E cada'], [8.7, 'tarefa adiada'], [9.8, 'faz ela'], [10.5, '*crescer.*'],
  [12.4, 'O Léo'], [13.1, 'adiou'], [13.7, 'a academia…'], [15.0, 'por *três*'], [15.8, '*anos.*'],
];
const END = 17.4;

function sky(t) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#1b2350'); gr.addColorStop(0.6, '#2d3a78'); gr.addColorStop(1, '#3c4a8c');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // lua e estrelas
  g.fillStyle = '#fff6c9'; g.beginPath(); g.arc(W * 0.8, H * 0.1, 70 * U, 0, 7); g.fill();
  g.fillStyle = '#1b2350'; g.beginPath(); g.arc(W * 0.8 - 30 * U, H * 0.1 - 18 * U, 62 * U, 0, 7); g.fill();
  for (let i = 0; i < 40; i++) { const x = (i * 263.7 % 1) * W, y = ((i * 0.618) % 1) * H * 0.45, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); g.globalAlpha = 0.4 + 0.6 * tw; g.fillStyle = '#fff'; g.fillRect(x, y, 4 * U, 4 * U); }
  g.globalAlpha = 1;
}
function outlined(path, fill) { g.fillStyle = fill; path(); g.fill(); g.lineWidth = OL; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); }
function park(t) {
  // morros e árvores ao fundo
  g.fillStyle = '#26326b'; g.beginPath(); g.moveTo(0, H * 0.58); g.quadraticCurveTo(W * 0.3, H * 0.5, W * 0.6, H * 0.57); g.quadraticCurveTo(W * 0.85, H * 0.62, W, H * 0.55); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  for (const [x, s] of [[0.12, 1], [0.88, 1.15], [0.55, 0.8]]) {
    const X = W * x, Y = H * 0.6;
    outlined(() => { g.beginPath(); g.rect(X - 12 * U * s, Y - 40 * U, 24 * U * s, 160 * U * s); }, '#4a3a5c');
    outlined(() => { g.beginPath(); g.arc(X, Y - 90 * U * s, 110 * U * s, 0, 7); }, '#2f6b5a');
    outlined(() => { g.beginPath(); g.arc(X - 60 * U * s, Y - 40 * U * s, 70 * U * s, 0, 7); }, '#3a7d66');
  }
  // chão
  outlined(() => { g.beginPath(); g.rect(-20, H * 0.72, W + 40, H); }, '#3b6b4f');
  g.fillStyle = '#c9b48a'; g.beginPath(); g.moveTo(W * 0.3, H); g.quadraticCurveTo(W * 0.48, H * 0.8, W * 0.46, H * 0.72); g.lineTo(W * 0.56, H * 0.72); g.quadraticCurveTo(W * 0.58, H * 0.82, W * 0.78, H); g.fill();
  // postes com luz
  for (const x of [0.22, 0.8]) {
    const X = W * x, Y = H * 0.73;
    outlined(() => { g.beginPath(); g.rect(X - 8 * U, Y - 420 * U, 16 * U, 420 * U); }, '#2a2a3c');
    const glow = g.createRadialGradient(X, Y - 440 * U, 10, X, Y - 440 * U, 220 * U); glow.addColorStop(0, 'rgba(255,230,150,.55)'); glow.addColorStop(1, 'rgba(255,230,150,0)');
    g.fillStyle = glow; g.beginPath(); g.arc(X, Y - 440 * U, 220 * U, 0, 7); g.fill();
    outlined(() => { g.beginPath(); g.roundRect(X - 30 * U, Y - 480 * U, 60 * U, 70 * U, 12 * U); }, '#ffe7a3');
  }
  // banco
  const bx = W * 0.5, by = H * 0.76;
  outlined(() => { g.beginPath(); g.roundRect(bx - 230 * U, by - 150 * U, 460 * U, 26 * U, 8 * U); }, '#8a5a3b');
  outlined(() => { g.beginPath(); g.roundRect(bx - 230 * U, by - 110 * U, 460 * U, 26 * U, 8 * U); }, '#8a5a3b');
  outlined(() => { g.beginPath(); g.roundRect(bx - 240 * U, by - 60 * U, 480 * U, 30 * U, 8 * U); }, '#9b6a48');
  for (const dx of [-200, 200]) outlined(() => { g.beginPath(); g.rect(bx + dx * U - 10 * U, by - 30 * U, 20 * U, 70 * U); }, '#2a2a3c');
}
// personagem: cabeça redonda grande, olhos enormes, corpo simples
function leo(t) {
  const x = W * 0.5, y = H * 0.738, bob = Math.sin(t * 2.2) * 4 * U;
  const surprise = env(t, 15.0, END, 0.15, 0.3), look = env(t, 4.6, 7.4, 0.4, 0.4) + env(t, 10.2, 11.8, 0.3, 0.4);
  // corpo sentado
  outlined(() => { g.beginPath(); g.roundRect(x - 75 * U, y - 170 * U + bob, 150 * U, 170 * U, 40 * U); }, '#e8a33d');
  outlined(() => { g.beginPath(); g.roundRect(x - 70 * U, y - 20 * U, 60 * U, 90 * U, 20 * U); g.roundRect(x + 10 * U, y - 20 * U, 60 * U, 90 * U, 20 * U); }, '#3a4a7a');
  // braço que coça a cabeça no fim
  const scratch = env(t, 12.6, 14.8, 0.3, 0.3);
  g.save(); g.translate(x + 70 * U, y - 140 * U + bob); g.rotate(-0.3 - 2.3 * scratch + Math.sin(t * 14) * 0.15 * scratch);
  outlined(() => { g.beginPath(); g.roundRect(-18 * U, 0, 36 * U, 120 * U, 18 * U); }, '#e8a33d');
  outlined(() => { g.beginPath(); g.arc(0, 128 * U, 22 * U, 0, 7); }, '#f2c9a0'); g.restore();
  // cabeça
  const hx = x, hy = y - 290 * U + bob, R = 135 * U;
  outlined(() => { g.beginPath(); g.ellipse(hx, hy, R, R * 0.95, 0, 0, 7); }, '#f2c9a0');
  // olhos (olham pra cima quando a planta cresce)
  const ey = hy - 10 * U - 30 * U * look, er = (52 + 18 * surprise) * U;
  for (const dx of [-55, 55]) {
    outlined(() => { g.beginPath(); g.ellipse(hx + dx * U, hy - 10 * U, er * 0.8, er, 0, 0, 7); }, '#ffffff');
    const blink = (t % 3.4) < 0.12 ? 0.1 : 1;
    g.fillStyle = INK; g.beginPath(); g.ellipse(hx + dx * U, ey, 18 * U, 22 * U * blink, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(hx + dx * U + 6 * U, ey - 8 * U, 6 * U, 0, 7); g.fill();
  }
  // boca
  g.lineWidth = OL; g.strokeStyle = INK; g.lineCap = 'round';
  if (surprise > 0.3) { g.fillStyle = '#7a2f3a'; g.beginPath(); g.ellipse(hx, hy + 75 * U, 22 * U, 30 * U * surprise, 0, 0, 7); g.fill(); g.stroke(); }
  else { g.beginPath(); g.arc(hx, hy + 55 * U, 30 * U, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke(); }
  return { hx, hy: hy - R * 0.9 };
}
// planta na cabeça: cresce em etapas a cada "tarefa adiada"
function plant(t, top) {
  const stages = [[4.6, 0.25], [8.7, 0.45], [10.5, 0.7], [13.7, 0.85], [15.8, 1.0]];
  let h = 0; for (const [ts, v] of stages) h = Math.max(h, lerp(h, v, back(seg(t, ts, ts + 0.5), 2.6)));
  if (h <= 0.001) return;
  const L = 560 * U * h, sway = Math.sin(t * 1.6) * 0.06;
  g.save(); g.translate(top.hx, top.hy + 10 * U); g.rotate(sway);
  g.lineWidth = 14 * U * (0.6 + h); g.strokeStyle = INK; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(30 * U, -L * 0.5, 0, -L); g.stroke();
  g.lineWidth = 8 * U * (0.6 + h); g.strokeStyle = '#57b36a'; g.stroke();
  const leaves = Math.floor(2 + h * 6);
  for (let i = 0; i < leaves; i++) {
    const p = (i + 1) / (leaves + 1), side = i % 2 ? 1 : -1, ly = -L * p, s = (0.6 + 0.6 * h) * U * (1 - p * 0.3);
    g.save(); g.translate(15 * U * Math.sin(p * 3), ly); g.rotate(side * 0.9);
    outlined(() => { g.beginPath(); g.ellipse(side * 50 * s, 0, 55 * s, 24 * s, 0, 0, 7); }, i % 3 ? '#6cc47d' : '#4fa060'); g.restore();
  }
  if (h > 0.95) { // flor no topo
    const k = back(seg(t, 16.0, 16.6), 2.2);
    g.translate(0, -L); g.scale(k, k);
    for (let i = 0; i < 6; i++) { g.rotate(Math.PI / 3); outlined(() => { g.beginPath(); g.ellipse(0, -38 * U, 22 * U, 34 * U, 0, 0, 7); }, '#ff8fb1'); }
    outlined(() => { g.beginPath(); g.arc(0, 0, 24 * U, 0, 7); }, '#ffd23f');
  }
  g.restore();
}
function caption(t) {
  let cur = null; for (const c of CAPS) if (t >= c[0]) cur = c;
  if (!cur || t > END - 0.2) return [];
  const [ts, raw] = cur, p = back(seg(t, ts, ts + 0.2), 2.3);
  const parts = raw.split(/(\*[^*]+\*)/).filter(Boolean);
  g.save(); g.font = `800 ${92 * U}px 'Baloo 2'`; g.textBaseline = 'middle';
  const widths = parts.map(s => g.measureText(s.replace(/\*/g, '')).width), tw = widths.reduce((a, b) => a + b, 0);
  g.translate(W / 2, H * 0.86); g.scale(0.7 + 0.3 * p, 0.7 + 0.3 * p);
  let x = -tw / 2;
  parts.forEach((s, i) => { const hl = s.startsWith('*'), txt = s.replace(/\*/g, '');
    g.lineWidth = 16 * U; g.strokeStyle = INK; g.lineJoin = 'round'; g.strokeText(txt, x, 0);
    g.fillStyle = hl ? '#ffd23f' : '#ffffff'; g.fillText(txt, x, 0); x += widths[i]; });
  g.restore();
  return [{ id: 'cap' + ts, text: raw.replace(/\*/g, ''), pass: true, x0: 60, y0: H * 0.82, x1: W - 60, y1: H * 0.9 }];
}
function render(t) {
  // câmera: aproxima devagar do Léo e sobe com a planta
  const z = 1 + 0.18 * ss(seg(t, 0, END)), up = 160 * U * ss(seg(t, 8, 16));
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H * 0.6); g.scale(z, z); g.translate(-W / 2, -H * 0.6 + up);
  sky(t); park(t); const top = leo(t); plant(t, top); g.restore();
  let tx = caption(t);
  if (t > END) { const k = eo(seg(t, END, END + 0.6)); g.fillStyle = `rgba(20,24,60,${0.75 * k})`; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.font = `800 ${100 * U}px 'Baloo 2'`; g.lineWidth = 16 * U; g.strokeStyle = INK; g.strokeText('Filmes em Código', W / 2, H * 0.45); g.fillStyle = '#fff'; g.fillText('Filmes em Código', W / 2, H * 0.45);
    g.font = `600 ${44 * U}px 'Baloo 2'`; g.fillStyle = '#ffd23f'; g.fillText('contos em desenho 2D', W / 2, H * 0.45 + 70 * U); g.restore();
    tx.push({ id: 'end', text: 'Filmes em Código contos em desenho 2D', x0: 80, y0: H * 0.38, x1: W - 80, y1: H * 0.5 }); }
  window._t = tx;
}
window.DUR = DUR; window.render = render; window.TEXTS = t => { render(t); return window._t; };
window.EV = [
  ...CAPS.map(([t]) => ({ t, type: 'pop' })),
  ...[4.6, 8.7, 10.5, 13.7, 15.8].map(t => ({ t, type: 'whoosh' })),
  { t: 15.0, type: 'tick' }, { t: 16.0, type: 'click' }, { t: END, type: 'thump' },
];
Promise.all(["800 40px 'Baloo 2'", "600 40px 'Baloo 2'"].map(f => document.fonts.load(f))).then(() => { render(0); window.READY = true; });
