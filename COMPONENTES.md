# Componentes de terceiros usados na landing

A página (`index.html`) roda no runtime `x-dc` do Claude Design: React global,
sem bundler e sem npm. Por isso os componentes abaixo foram **portados** para HTML + CSS + JS
dentro do próprio arquivo, preservando parâmetros e física do original.

Quando isso virar código de verdade (React/Next), troque cada porte pelo componente original —
o visual já está calibrado para a paleta neumórfica.

| Componente | Origem | Onde está no protótipo | Dependência real |
|---|---|---|---|
| Click Effects (modo `sniper`) | Originkit | `setupClickFx()` — overlay `#fx-layer` | `gsap` (já carregado por CDN no `<helmet>`) |
| Hover Image Reveal | Originkit | seção `#servicos`, `setupHoverReveal()` | `framer-motion` (`useSpring`) |
| Live Chat (iOS Message List) | Originkit | seção `#depoimentos`, `setupChat()` | `framer-motion` (`useAnimate` + `stagger`) |
| Liquid Carve Button | Originkit | botão do CTA, `setupGooButton()` | `framer-motion` (`useAnimate`) |
| BlobCard (FluidBlobs + GlowEffect) | shadcn-style | cards de plano, classes `.blob-*` | `FluidBlobs`, `GlowEffect` — **fonte não fornecida** |
| TiltCard (Tilt + ClippedCircle) | unlumen-ui | cards de plano, `setupTilt()` | `Tilt`, `ClippedCircle` — **fonte não fornecida** |
| CardSwap | React Bits | seção `#diferenciais`, `setupCardSwap()` | `gsap` |
| TrueFocus | React Bits | título de `#planos`, `setupTrueFocus()` | `motion` |
| DriftWall | — | seção `#trabalhos`, `setupDriftWall()` | **fonte não fornecida** (só o exemplo de uso) |

## Parâmetros mantidos

- **Click Effects**: `interactionMode="sniper"`, `duration=0.3`, `strokeWidth=2`, `effectSize=90`;
  cor trocada de `#ffffff` para o accent `#6C63FF` (fundo claro).
- **Hover Image Reveal**: `offsetX=200`, `imageWidth=300`, `imageHeight=400`, `rounded=32`.
  `textColor=#3D4852`, `dimColor=#A0AEC0` no lugar do par branco/`#51565A` do tema escuro.
- **Live Chat**: `staggerDelay=150ms`; bolha enviada usa o accent, a recebida usa a superfície
  neumórfica em relevo.
- **Liquid Carve Button**: `smoothness=55`, `squash` até `1.6`, `GOO_STRENGTH=8`.
  Raio da bolha reduzido de 50 para 34 — num botão de 64px de altura, 50 comia metade da pílula.
- **BlobCard**: `headerHeight=224`; paleta trocada para azul, como pedido —
  `#2B4BFF`, `#3B82F6`, `#60A5FA`, `#6C63FF`; glow em `#93C5FD → #A5B4FC → #2B4BFF`.
- **TiltCard**: `rotationFactor=11`.
- **CardSwap**: `cardDistance=60`, `verticalDistance=70`, `delay=5000`, `skewAmount=6`,
  `easing="elastic"`. Card 320×200 (o padrão 500×400 não cabe na coluna).
- **DriftWall**: `columns=5`, `tileWidth=200`, `tileHeight=132`, `gap=18`, `tilt=16`, `turn=-14`,
  `perspective=1200`, `depth=120`, `speed=42`, `variance=0.45`, `parallax=0.6`.
  `overlayColor` trocado de `#060010` para `#E0E5EC` — as bordas dissolvem na superfície da página.

## Pendências de conteúdo

- **Depoimentos**: os textos em `#depoimentos` são exemplo. Trocar pelos depoimentos reais
  antes de publicar.
- **Imagens**: `#servicos` e `#trabalhos` usam mockups em SVG desenhados aqui. Para usar fotos
  reais, troque o `<svg>` de cada `.reveal-slide` por `<img src="...">` — o DriftWall clona esses
  mesmos elementos, então ele acompanha a troca automaticamente.
