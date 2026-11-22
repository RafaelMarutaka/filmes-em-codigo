"""Som do demo, sintetizado com numpy a partir de events.json: pad grave contínuo + efeitos nos eventos.
Uso: python sound.py <demo> → <demo>/mix.wav"""
import json, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
D = sys.argv[1]
ev = json.load(open(f'{D}/events.json'))
dur = ev['dur']; N = int(SR * (dur + 0.5))
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def put(sig, t, pan=0.0, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig)); s = sig[: j - i] * g
    L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))

def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR; e = np.minimum(1, t / a) * np.exp(-t / r); return e

def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

def lp(x, f):
    return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)

def whoosh(d=0.9):
    n = int(SR * d); x = rng.standard_normal(n); out = np.zeros(n); seg = 2048
    for k in range(0, n, seg):
        p = k / n; f = 300 + 3500 * np.sin(np.pi * p) ** 2
        out[k:k + seg] = bp(x[k:k + seg], f * 0.6, min(f * 1.4, 20000))
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * 0.5

def tick():
    n = int(SR * 0.08); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * t) * env(n, 0.001, 0.012) * 0.35

def pop():
    n = int(SR * 0.12); t = np.arange(n) / SR; f = 900 * np.exp(-t * 30) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.03) * 0.22

def paper():
    n = int(SR * 0.5); x = bp(rng.standard_normal(n), 1500, 9000)
    return x * env(n, 0.02, 0.12) * (0.6 + 0.4 * np.sin(np.arange(n) / SR * 60)) * 0.35

def hum(d):
    n = int(SR * d); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 110 * t) + 0.4 * np.sin(2 * np.pi * 220 * t) + 0.15 * np.sin(2 * np.pi * 330 * t))
    return s * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.6) * 0.06

def motor(d):
    n = int(SR * d); t = np.arange(n) / SR
    s = lp(rng.standard_normal(n), 600) * 0.6 + 0.3 * np.sign(np.sin(2 * np.pi * 18 * t)) * lp(rng.standard_normal(n), 2500)
    return s * np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.5) * 0.12

def click():
    n = int(SR * 0.15); x = bp(rng.standard_normal(n), 800, 5000)
    return x * env(n, 0.001, 0.02) * 0.6

def thump():
    n = int(SR * 1.2); t = np.arange(n) / SR; f = 70 * np.exp(-t * 4) + 38
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.35) * 0.7

FX = {'whoosh': whoosh, 'tick': tick, 'pop': pop, 'paper': paper, 'click': click, 'thump': thump}
for e in ev['ev']:
    k = e['type']
    if k == 'hum': put(hum(e.get('d', 3)), e['t'])
    elif k == 'motor': put(motor(e.get('d', 3)), e['t'])
    elif k in FX: put(FX[k](), e['t'], pan=float(rng.uniform(-0.3, 0.3)))

# pad: acorde grave suave que respira
t = np.arange(N) / SR; pad = np.zeros(N)
for f, a in [(55, 0.5), (82.4, 0.35), (110, 0.25), (164.8, 0.12)]:
    pad += a * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.11 * t))
pad *= 0.05 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.08 * t)) * np.minimum(1, t / 1.5) * np.clip((dur - t) / 2.0, 0, 1)
L += pad; R += pad
m = np.stack([L, R], 1); m /= max(1e-9, np.abs(m).max()) / 0.9
sf.write(f'{D}/mix.wav', m, SR)
print('mix.wav', round(dur, 2), 's')
