"""Corta a narração em falas, abre respiros entre elas e escreve:
   voice/voz_montada.wav (48 kHz mono) e timing.json (início de cada fala + palavras no tempo do filme).
Uso: python build_voice.py <demo>"""
import json, subprocess, sys, numpy as np, soundfile as sf

D = sys.argv[1]
SR = 48000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{D}/voice/voz.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32).copy()
W = json.load(open(f'{D}/voice/words.json'))

# pontos de corte (fim da última palavra de cada fala, no áudio original)
CUTS = [0.0, 3.70, 7.30, 11.92, 16.58, 19.82, 23.30, 25.96, 31.30, 34.88, len(v) / SR]
LEAD = 0.9                                         # abertura antes da 1ª fala
GAPS = [0.55, 0.65, 0.5, 0.5, 0.6, 0.55, 0.6, 0.75, 0.6]   # respiro extra antes das falas 2..10
TAIL = 2.6

out, lines, shift = [np.zeros(int(LEAD * SR), np.float32)], [], []
t = LEAD
for i in range(10):
    if i > 0:
        out.append(np.zeros(int(GAPS[i - 1] * SR), np.float32)); t += GAPS[i - 1]
    a, b = int(CUTS[i] * SR), int(CUTS[i + 1] * SR)
    seg = v[a:b].copy(); f = int(0.008 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    lines.append(round(t, 3)); shift.append(t - CUTS[i]); out.append(seg); t += (b - a) / SR
out.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
y = np.concatenate(out)
sf.write(f'{D}/voice/voz_montada.wav', y, SR)

words = []
for w, s, e in W:
    i = max(k for k in range(10) if s >= CUTS[k] - 0.02)
    words.append([round(s + shift[i], 3), w, round(e + shift[i], 3)])
json.dump({'dur': round(len(y) / SR, 3), 'lines': lines, 'words': words}, open(f'{D}/timing.json', 'w'), ensure_ascii=False)
print('dur', round(len(y) / SR, 2), 'lines', lines)
