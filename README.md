# 🎬 Filmes em Código

**99 estilos de filme pra fazer vídeos curtos inteiros em código, com o Claude.**
Você escolhe o estilo, conta a história e o filme sai pronto: imagem, animação, narração e legenda.

Biblioteca privada de **Rafael Marutaka** · usada pela skill `filmes-em-codigo`.

**▶ [Abrir a galeria com os 99 filmes](https://rafaelmarutaka.github.io/filmes-em-codigo-videos/)**

---

## Como funciona

1. **Escolha um estilo** da lista abaixo (ou peça uma sugestão pro tema).
2. **Chame a skill** `/filmes-em-codigo` e diga em uma frase o que você quer:

> Faz um filme de 45 segundos no estilo **Watercolor Brush** sobre moldes de roupa pra pet, com narração feminina.

3. O Claude escreve o roteiro, monta as cenas, renderiza e entrega o vídeo na pasta do projeto.

A skill baixa esta biblioteca pra `~/filmes-em-codigo` na primeira vez. Cada filme fica numa pasta própria, com o código-fonte e o vídeo final.

## Os estilos (99)

- **Edição e documentário** (8): Caption News, 1920s Newsreel, Live Countdown Split-screen, City Symphony, Visual Investigation, Constructivist Montage, Sports Telestrator, Broadcast News Package
- **Pintura e ilustração** (5): Crayon Picture Book, Watercolor Brush, Impasto Oil Painting, Urban Sketch · Pen & Wash, Colored-Pencil Science Illustration
- **Desenho e lousa** (7): One-line Drawing, Whiteboard Explainer, Chalkboard, Sketchnote, Stick-figure Explainer, Tablet Sketch Explainer, Marker on Paper
- **Artesanato tradicional** (7): Chinese Ink Wash, Shadow Puppetry, Ukiyo-e, Red Paper-cut, Paper-cut Lightbox, Stained Glass, Gilded Illumination
- **Gravura e impressão** (8): Risograph Print, Halftone Dossier, Woodcut Print, Copperplate Engraving, Silkscreen Travel Poster, Scratchboard Long Take, Pop Art, Vintage Engraving Collage
- **Design gráfico e tipografia** (8): Swiss Motion Graphics, 60s Spy Title Sequence, Art Deco, Pictogram Motion, Bauhaus Shapes, Scale Zoom Explainer, Text Flash Cuts ✦, Silhouette Rhythm
- **Diagramas em linha** (8): Blueprint, Isometric Infographic, Exploded Teardown, Line-Art Cutaway, Color-Coded Mechanism, Instruction Manual Art, Pen Plotter, Assembly-Line Diagram
- **Desenho animado** (6): 1930s Rubber Hose Cartoon, 80s Cel Anime, Sci-Fi Sitcom Toon, Mid-century Cartoon, Comic History Cartoon ✦, Manga Panels ✦
- **Videogame** (4): 16-bit Pixel RPG, 2.5D Pixel Art, Microgame Frenzy, Rhythm Game Show
- **Película e fita** (5): CRT ASCII Terminal, 1920s Silent Film, Liminal Found Footage, Scratch Film, Double Exposure
- **Telas e interfaces** (6): Dark Tech Keynote, Mascot Screencast, Sci-fi Hologram HUD, Tabletop App Flythrough, Spreadsheet Film, 1-bit Dither
- **Luz e linhas** (5): Circuit Board, Firefly Pointillism, Flow-field Wind Lines, Oscilloscope Math, Neon Tubes
- **3D e miniatura** (8): Brick Toy, Paper Pop-up Book, Tilt-Shift Miniature, Low-poly Isometric Island, Glass Product Render, Memphis Diorama, Isometric People Scene, Crayon World 3D
- **Instrumentos e evidências** (8): Satellite Briefing, Engineering Briefing Board, LiDAR Survey, Under the Microscope, Archive Light Table, Security X-ray, Radar Sweep Documentary, Thermal Camera
- **Dados e mapas** (6): Data Storytelling, Projection-Mapped Model, Data Physicalization, Transit Map, 3D Map Explainer, Blob Simulation

✦ precisa de um gerador de imagens (ex.: Codex CLI).

O índice completo, com a pasta de cada estilo, está em [`styles/README.md`](styles/README.md). Cada estilo tem um `STYLE.md` com as regras de visual, cor, tipografia, movimento e som.

## Estrutura

| Pasta | O que tem |
|---|---|
| `styles/` | os 99 estilos (regras e código de demonstração) |
| `core/` | motor de render, legendas, áudio e exportação |
| `tools/` | ferramentas de apoio |
| `AGENTS.md`, `DIRECTOR.md`, `TECHNIQUE.md` | guias de produção que o Claude segue |

## Requisitos

Node 20+, ffmpeg 7+ e Python 3. A skill instala o resto sozinha.

---

<sub>Os filmes que você faz com esta biblioteca são seus, inclusive pra uso comercial. A biblioteca é uma cópia privada de um projeto aberto; termos de licença e créditos em [`LICENSE`](LICENSE).</sub>
