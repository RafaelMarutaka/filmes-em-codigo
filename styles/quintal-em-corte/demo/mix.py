"""Som do demo: narração + foley sintetizado a partir de events.json + ambiente de quintal (passarinho, vento). Sem música.
Uso: python mix.py <demo> <LIB>  → <demo>/out/mix.wav"""
import json, os, sys, numpy as np, soundfile as sf
D, LIB = sys.argv[1], sys.argv[2]
sys.path.insert(0, f'{LIB}/core/audio')
from sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, clack, pop, thump, whoosh, compress, limit, add

ev = json.load(open(f'{D}/events.json')); dur = ev['dur']
N = int(SR * (dur + 0.3)); buf = np.zeros((N, 2))
rng = np.random.default_rng(21)

def crunch(v=1.0):          # pá entrando na terra
    d = .32; x = bp(noise(d), 180, 2400) * env_exp(d, .09)
    grit = hp(noise(d), 3000) * (rng.random(len(x)) > .985) * 3 * env_exp(d, .12)
    return norm(x + grit * .4) * v
def pebble(v=1.0):
    d = .05; tt = t_(d); f = 1800 + rng.random() * 2500
    return norm(np.sin(2 * np.pi * f * tt) * env_exp(d, .006) + hp(noise(d), 4000) * env_exp(d, .002) * .5) * v
def clink(v=1.0):           # vergalhão batendo
    d = .5; tt = t_(d); b = 900 + rng.random() * 500
    s = sum(a * np.sin(2 * np.pi * b * m * tt) * env_exp(d, tau) for m, a, tau in [(1, .6, .12), (2.76, .5, .07), (5.4, .3, .04), (8.9, .2, .025)])
    return norm(s + hp(noise(d), 5000) * env_exp(d, .003) * .4) * v
def hiss(d, v=1.0):         # jato de concreto
    x = bp(noise(d), 1200, 7000); m = 0.7 + 0.3 * np.sin(2 * np.pi * 5.3 * t_(d)) * np.sin(2 * np.pi * 0.7 * t_(d))
    e = np.minimum(1, t_(d) / .15) * np.minimum(1, (d - t_(d)) / .25)
    grit = lp(noise(d), 600) * .5
    return norm((x * m + grit) * e) * v
def drip(v=1.0):
    d = .18; tt = t_(d); f = 1400 * np.exp(-tt * 18) + 500
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .04)) * v
def pour(d, v=1.0):         # água enchendo
    x = bp(noise(d), 300, 3000); g = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 7 * t_(d) + np.sin(2 * np.pi * 1.3 * t_(d)) * 3))
    low = lp(noise(d), 250) * 1.2; e = np.minimum(1, t_(d) / .3) * np.minimum(1, (d - t_(d)) / .5)
    return norm((x * g + low) * e) * v
def hum(d, v=1.0):          # bomba ligada
    tt = t_(d); s = .6 * np.sin(2 * np.pi * 60 * tt) + .3 * np.sin(2 * np.pi * 120 * tt) + .15 * np.sin(2 * np.pi * 240 * tt)
    s += bp(noise(d), 400, 1600) * .08; e = np.minimum(1, tt / .6) * np.minimum(1, (d - tt) / .8)
    return norm(s * e) * v
def splash(v=1.0):
    d = .9; x = bp(noise(d), 400, 6000) * env_exp(d, .18); body = lp(noise(d), 300) * env_exp(d, .08) * 1.5
    return norm(x + body) * v
def bird(v=1.0):            # piado descendente (FM)
    d = .16 + rng.random() * .1; tt = t_(d); f0 = 3200 + rng.random() * 1500
    f = f0 * (1 - .35 * tt / d) + 300 * np.sin(2 * np.pi * 35 * tt); s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return s * np.sin(np.pi * tt / d) ** 2 * v

for e in ev['ev']:
    t, ty, d = e['t'], e['type'], e.get('d', 0)
    if ty == 'dig':
        k = 0.0
        while k < d: add(buf, crunch(.5), t + k, pan=rng.uniform(-.3, .3)); [add(buf, pebble(.12), t + k + .1 + rng.random() * .3, pan=rng.uniform(-.6, .6)) for _ in range(3)]; k += .42 + rng.random() * .12
    elif ty == 'crumble':
        add(buf, lp(noise(d), 200) * np.sin(np.pi * t_(d) / d) * .25, t)
        for _ in range(26): add(buf, pebble(.16), t + rng.random() * d, pan=rng.uniform(-.7, .7))
    elif ty == 'clinks':
        k = 0.0
        while k < d: add(buf, clink(.16), t + k, pan=rng.uniform(-.6, .6)); k += .09 + rng.random() * .14
    elif ty == 'spray': add(buf, hiss(d, .32), t)
    elif ty == 'seep':
        for _ in range(int(d * 4)): add(buf, drip(.18), t + rng.random() * d, pan=rng.uniform(-.5, .5))
    elif ty == 'roll': add(buf, whoosh(d, .5), t)
    elif ty == 'tiles':
        k = 0.0
        while k < d: add(buf, clack(1.4 + rng.random() * .4, .12), t + k, pan=rng.uniform(-.5, .5)); k += .07 + rng.random() * .07
    elif ty == 'fill': add(buf, pour(d + .6, .4), t)
    elif ty == 'pipes':
        for k in np.linspace(0, d, 7): add(buf, clack(.7, .22), t + k, pan=.3)
    elif ty == 'pop': add(buf, pop(.35), t, pan=.4); add(buf, thump(.25, 90), t)
    elif ty == 'pump': add(buf, hum(d, .04), t, pan=.35)
    elif ty == 'plip': add(buf, drip(.22), t, pan=.2)
    elif ty == 'gulp': add(buf, lp(noise(.3), 900) * env_exp(.3, .06) * .3, t, pan=.4)
    elif ty == 'splash': add(buf, splash(.45), t)

# ambiente: vento baixinho + passarinhos espaçados
bed = lp(brown(dur + .3), 500)[:N] * .05; n = len(bed); buf[:n, 0] += bed; buf[:n, 1] += bed
k = 1.2
while k < dur - 1:
    for j in range(rng.integers(1, 4)): add(buf, bird(.035), k + j * .22, pan=rng.uniform(-.8, .8))
    k += 2.5 + rng.random() * 3.5

# narração por cima
v, sr = sf.read(f'{D}/voice/voz_montada.wav'); v = v if v.ndim == 1 else v.mean(1)
v = compress(v / max(1e-9, np.abs(v).max()) * .9, thr=.3, ratio=3.0)
v = norm(v, .95)
fx_rms = np.sqrt(np.mean(buf ** 2)) + 1e-9; v_rms = np.sqrt(np.mean(v[np.abs(v) > .02] ** 2))
buf *= (v_rms / 7.5) / fx_rms                       # efeitos uns 17-18 dB abaixo da voz
add(buf, v, 0.0, gain=0.72)
for c in range(2): buf[:, c] = limit(buf[:, c], .95)
os.makedirs(f'{D}/out', exist_ok=True); sf.write(f'{D}/out/mix.wav', buf.astype(np.float32), SR)
print('mix ok', round(len(buf) / SR, 2), 's')
