# 🎬 Filmes em Código

**102 estilos de filme pra fazer vídeos curtos inteiros em código, com o Claude.**
Você escolhe o estilo, conta a história e o filme sai pronto: imagem, animação, narração e legenda.

Biblioteca privada de **Rafael Marutaka** · usada pela skill `filmes-em-codigo`.

**▶ [Abrir a galeria com os 102 filmes](https://rafaelmarutaka.github.io/filmes-em-codigo-videos/)**

---

## Como funciona

1. **Escolha um estilo** da lista abaixo (ou peça uma sugestão pro tema).
2. **Chame a skill** `/filmes-em-codigo` e diga em uma frase o que você quer:

> Faz um filme de 45 segundos no estilo **Pincel de Aquarela** sobre moldes de roupa pra pet, com narração feminina.

3. O Claude escreve o roteiro, monta as cenas, renderiza e entrega o vídeo na pasta do projeto.

A skill baixa esta biblioteca pra `~/filmes-em-codigo` na primeira vez. Cada filme fica numa pasta própria, com o código-fonte e o vídeo final.

## Os estilos (102)

- **Edição e documentário** (8): Notícia com Legendas, Cinejornal Anos 20, Contagem Regressiva em Tela Dividida, Sinfonia da Cidade, Investigação Visual, Montagem Construtivista, Lousa Tática Esportiva, Telejornal
- **Pintura e ilustração** (5): Livro Infantil de Giz de Cera, Pincel de Aquarela, Pintura a Óleo com Textura, Croqui Urbano a Nanquim e Aguada, Ilustração Científica em Lápis de Cor
- **Desenho e lousa** (7): Desenho de Uma Linha Só, Explicação no Quadro Branco, Lousa de Giz, Anotação Visual (Sketchnote), Explicação com Bonecos de Palito, Explicação Desenhada no Tablet, Canetão no Papel
- **Artesanato tradicional** (7): Pintura Chinesa a Nanquim, Teatro de Sombras, Ukiyo-e (Gravura Japonesa), Recorte de Papel Vermelho, Luminária de Papel Recortado, Vitral, Iluminura Dourada
- **Gravura e impressão** (8): Impressão Risograph, Dossiê em Retícula, Xilogravura, Gravura em Metal, Pôster de Viagem em Serigrafia, Plano-Sequência em Raspagem, Pop Art, Colagem de Gravuras Antigas
- **Design gráfico e tipografia** (8): Motion Design Suíço, Abertura de Filme de Espião Anos 60, Art Déco, Pictogramas Animados, Formas Bauhaus, Explicação com Zoom de Escala, Cortes Rápidos de Texto ✦, Ritmo de Silhuetas
- **Diagramas em linha** (8): Planta Técnica (Blueprint), Infográfico Isométrico, Desmontagem em Vista Explodida, Corte em Traço, Mecanismo com Cores por Peça, Manual de Instruções, Plotter de Caneta, Diagrama de Linha de Montagem
- **Desenho animado** (7): Desenho Animado Anos 30, Anime Anos 80, Desenho de Sitcom Sci-Fi, Desenho Retrô Anos 50, História em Desenho Cômico ✦, Quadrinhos de Mangá ✦, Contos em Desenho 2D
- **Videogame** (4): RPG em Pixel 16-bit, Pixel Art 2.5D, Maratona de Minigames, Game Show de Ritmo
- **Película e fita** (5): Terminal ASCII de Tubo, Cinema Mudo Anos 20, Fita Perdida (Found Footage), Película Riscada, Dupla Exposição
- **Telas e interfaces** (6): Apresentação Tech Escura, Gravação de Tela com Mascote, Holograma Sci-Fi, Tour de App na Mesa, Filme em Planilha, Pontilhado 1-bit
- **Luz e linhas** (5): Placa de Circuito, Pontilhismo de Vaga-lumes, Linhas de Vento, Matemática no Osciloscópio, Letreiro de Neon
- **3D e miniatura** (10): Blocos de Montar, Livro Pop-up de Papel, Miniatura Tilt-Shift, Ilha Low-poly Isométrica, Produto em Vidro 3D, Diorama Memphis, Cena Isométrica com Pessoas, Mundo 3D de Giz de Cera, Objetos 3D no Escuro, Bonecos 3D de Blocos
- **Instrumentos e evidências** (8): Relatório por Satélite, Quadro de Engenharia, Mapeamento LiDAR, No Microscópio, Mesa de Luz de Arquivo, Raio-X de Segurança, Documentário de Radar, Câmera Térmica
- **Dados e mapas** (6): História com Dados, Maquete com Projeção, Dados em Objetos Físicos, Mapa de Metrô, Explicação em Mapa 3D, Simulação com Bonequinhos

✦ precisa de um gerador de imagens (ex.: Codex CLI).

O índice completo, com a pasta de cada estilo, está em [`styles/README.md`](styles/README.md). Cada estilo tem um `STYLE.md` com as regras de visual, cor, tipografia, movimento e som.

## Estrutura

| Pasta | O que tem |
|---|---|
| `styles/` | os 102 estilos (regras e código de demonstração) |
| `core/` | motor de render, legendas, áudio e exportação |
| `tools/` | ferramentas de apoio |
| `AGENTS.md`, `DIRECTOR.md`, `TECHNIQUE.md` | guias de produção que o Claude segue |

## Requisitos

Node 20+, ffmpeg 7+ e Python 3. A skill instala o resto sozinha.

---

<sub>Os filmes que você faz com esta biblioteca são seus, inclusive pra uso comercial. A biblioteca é uma cópia privada de um projeto aberto; termos de licença e créditos em [`LICENSE`](LICENSE).</sub>
