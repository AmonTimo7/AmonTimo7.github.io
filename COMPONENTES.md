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
| TestimonialsColumn | shadcn-style | seção `#depoimentos`, classes `.tcols` / `.tcol` / `.tcard` | `motion/react` (`motion.div` com `translateY: -50%`) |
| Liquid Carve Button | Originkit | botão do CTA, `setupGooButton()` | `framer-motion` (`useAnimate`) |
| BlobCard (FluidBlobs + GlowEffect) | shadcn-style | cards de plano, classes `.blob-*` | `FluidBlobs`, `GlowEffect` — **fonte não fornecida** |
| TiltCard (Tilt + ClippedCircle) | unlumen-ui | cards de plano, `setupTilt()` | `Tilt`, `ClippedCircle` — **fonte não fornecida** |
| Mockup iPhone (perfil Instagram) | Mockup iPhone Instagram Customizável | seção `#redes`, classes `.iph*` | nenhuma (os `<image-slot>` viraram `<img>`) |
| Cartão de métrica (hero) | — | seção do hero, classes `.mx*`; dados em `metricaFaixas()` e desenho em `metricaDesenho()` | nenhuma (SVG + CSS) |
| CardSwap | React Bits | seção `#diferenciais`, `setupCardSwap()` | `gsap` |
| TrueFocus | React Bits | título de `#planos`, `setupTrueFocus()` | `motion` |
| DriftWall (parede 3D em marquee) | — | seção `#trabalhos`, classes `.wall` / `.wall-col` / `.wtile` | nenhuma (transform 3D + `@keyframes`) |

## Parâmetros mantidos

- **Click Effects**: `interactionMode="sniper"`, `duration=0.3`, `strokeWidth=2`, `effectSize=90`;
  cor trocada de `#ffffff` para o accent `#6C63FF` (fundo claro).
- **Hover Image Reveal**: `offsetX=200`, `imageWidth=300`, `imageHeight=400`, `rounded=32`.
  `textColor=#3D4852`, `dimColor=#A0AEC0` no lugar do par branco/`#51565A` do tema escuro.
- **TestimonialsColumn** (usado duas vezes — depoimentos e trabalhos): mesma física do original (`translateY: -50%`, `ease: linear`, `repeat: Infinity`),
  em CSS puro — sem JS na seção. `duration` vira `--tdur` por coluna (32s e 26s); a segunda coluna
  usa `animation-direction: reverse` pra rolar ao contrário. A lista é duplicada 2× com
  `padding-bottom` igual ao `gap`, que é o que faz a emenda do loop ficar invisível.
  Avatar por foto trocado por iniciais em baixo-relevo: zero requisição extra.
  O grid usa `align-items: start`: sem isso ele estica a coluna mais curta até a altura da mais
  alta e o `-50%` deixa de bater com uma volta do conteúdo — a emenda pula.
- **DriftWall**: cinco colunas em `rotateX(16deg) rotateY(-14deg) rotateZ(-3deg) scale(1.14)`,
  `perspective: 1200px`, profundidade por coluna em `--tz` (0 / -40 / -80 / -40 / 0). O mesmo
  `@keyframes tscroll` dos depoimentos move cada faixa, com duração e sentido próprios (42s a 62s).
  A profundidade fica no `.wall-col` e a animação no `.wall-lane` de dentro — as duas no mesmo
  elemento brigariam pelo `transform`. Cada coluna mostra a lista inteira girada pelo seu índice,
  então duas vizinhas nunca ficam iguais e todas têm a mesma altura. As bordas dissolvem num
  `::after` com dois gradientes até `var(--bg)`, sem moldura.
- **Liquid Carve Button**: `smoothness=55`, `squash` até `1.6`, `GOO_STRENGTH=8`.
  Raio da bolha reduzido de 50 para 34 — num botão de 64px de altura, 50 comia metade da pílula.
- **BlobCard**: `headerHeight=224`; paleta trocada para azul, como pedido —
  `#2B4BFF`, `#3B82F6`, `#60A5FA`, `#6C63FF`; glow em `#93C5FD → #A5B4FC → #2B4BFF`.
- **TiltCard**: `rotationFactor=11`.
- **CardSwap**: `cardDistance=60`, `verticalDistance=70`, `delay=5000`, `skewAmount=6`,
  `easing="elastic"`. Card 320×200 (o padrão 500×400 não cabe na coluna).

## Mockup do iPhone (`#redes`)

Porte do zip "Mockup iPhone Instagram Customizável", com três mudanças:

- Os `<image-slot>` (componente de upload do editor) viraram `<img>` apontando para
  `imgs/insta-*.webp`, então nada de `image-slot.js` aqui.
- O `zoom: .55` do original virou `scale()` dentro do `transform` 3D — `zoom` mexe no layout
  e empurraria a coluna; `scale` só desenha. O aparelho é posicionado absoluto e centrado
  dentro do `.iph-palco`, que é quem segura a altura na página.
- A sombra saiu do marrom do mockup (fundo bege) para a cinza-azulada da página.

Os ângulos (`rotateY(-22deg) rotateX(6deg) rotateZ(-6deg)`) e a moldura são os do original.
O tamanho é o `--iph-esc`: `.80` no desktop, `.68` até 900px, `.57` no celular.

**Conteúdo:** o perfil é o da própria ACTech e as artes são as reais, de `imgs2/`.
A ordem da grade é embaralhada de propósito (artes coloridas e escuras alternadas) —
em ordem de arquivo a grade fica com um bloco azul embaixo e um preto em cima.
São 8 artes em 12 quadros: as quatro últimas repetem para fechar a grade, senão sobra
meia fileira vazia no meio da tela.

> **@ e números são exemplo.** `actech.informatica`, 1.240 seguidores e 318 seguindo estão
> chumbados no HTML da seção. Trocar pelos reais antes de publicar — é o perfil de vocês
> na página de vocês.

## Cartão de métrica do hero

Substituiu os anéis neumórficos. O visual é o de um painel de cotação: número grande,
variação, seletor de período (1M / 3M / 6M / 1A), linha com área, base tracejada,
barras de volume e eixos.

- **Os números são ilustrativos.** Estão em `metricaFaixas()` — `total`, `delta`, `escala`,
  `subida` e os rótulos do eixo de baixo. O rodapé do cartão diz "Exemplo ilustrativo" de
  propósito: sem isso o gráfico se lê como resultado real de cliente.
- A curva usa ruído com semente fixa, não `Math.random`: sem isso o gráfico se redesenharia
  a cada re-render (abrir o menu, responder o quiz).
- `delta` e a base tracejada são a mesma coisa: a linha pontilhada é o ponto de partida e o
  `delta` é o quanto a curva subiu dali até a ponta.
- **Só linha e área são SVG.** Grade, base, ponto e barras são HTML posicionado por
  porcentagem, porque o parser do navegador recusa `{{ }}` em atributo de SVG (`cx`, `x`,
  `width`...) e joga erro no console antes da hidratação — em `style` ele aceita numa boa.
  Pelo mesmo motivo os rótulos dos eixos não são `<text>`: o runtime embrulha todo `{{ }}`
  num `<span>`, e um `<span>` dentro de `<svg>` não desenha nada.
- O `key="{{ mxFaixa }}"` no `<path>` é o que faz o traço se redesenhar ao trocar de período:
  mudando a key, o React remonta o elemento e a animação roda de novo.

## Ficha do Google, anúncios e "a conta" (`#google` e `#planos`)

- **Antes e depois da ficha** (`#google`): as duas fichas são HTML montado à mão, não captura
  de cliente — dá pra editar item por item. A da esquerda usa `--nm-in` (afundada, cinza) e a
  da direita `--nm-out` (em relevo, branca): a hierarquia é a própria física da página.
  Dentro dos cartões a tipografia é Roboto e as cores são as do Google (`#1A73E8`, `#FBBC04`,
  `#188038`), porque ali a ilusão tem que ser de painel do Google, não de página nossa.
- **Logos das plataformas**: SVG desenhado aqui, nenhum arquivo externo. Uso nominativo —
  serve pra dizer em que plataformas a gente trabalha.
- **A conta do padeiro** (fim de `#planos`): `R$ 197 ÷ R$ 50 = 4 clientes`. Os dois números
  de entrada estão no HTML da seção; se o preço do plano mudar, o resultado **não** se
  recalcula sozinho — é texto. O ticket de R$ 50 é o chute que faz fechar em 4.
  A letra miúda existe de propósito: sem ela a conta vira promessa de resultado.
- **Cabeçalho**: dois caminhos no topo — "Ver planos" (secundário, âncora pra `#planos`)
  para quem quer preço antes de conversa, e "Fale com a gente" (primário, WhatsApp).
  O link de texto "Planos" saiu do menu: com o botão do lado, era o mesmo destino duas vezes.

## Pendências de conteúdo

- **"Ilimitadas" saiu**: o Completo dizia "atualizações ilimitadas no site" e agora diz
  "4 atualizações de conteúdo por mês" — o Essencial tem 1, então a escada fica clara sem
  precisar de letra miúda. Quando o contrato existir, vale definir lá o que conta como
  atualização.
- **Depoimentos**: os textos em `#depoimentos` são exemplo. Trocar pelos depoimentos reais
  antes de publicar.
- **Instagram**: as artes vieram de `imgs2/` (34 MB em PNG) convertidas para WebP quadrado
  de 520px em `imgs/insta-1..8.webp` — 137 KB no total, avatar incluso. A pasta `imgs2/`
  é só o arquivo-fonte; não precisa ir pro site.
- **Sigilo**: nenhum nome de cliente aparece em `#trabalhos` — nem no texto, nem na barra de
  endereço da moldura (`cliente.com.br/...`). Nas capturas em `imgs/`, as marcas foram apagadas
  (logo borrado, nome removido do subtítulo). Os arquivos originais estão no histórico do git.
  Ao acrescentar um trabalho, confira a captura antes: o nome costuma aparecer em logo, título e
  rodapé.
- **Imagens**: `#servicos` ainda usa mockups em SVG desenhados aqui (`#trabalhos` já usa capturas
  reais de `imgs/`). Para usar fotos reais no `#servicos`, troque o `<svg>` de cada `.reveal-slide` por `<img src="...">` — o DriftWall clona esses
  mesmos elementos, então ele acompanha a troca automaticamente.

## Diagnóstico e presente

Fluxo próprio, sem biblioteca de terceiros — vive no estado do `DCLogic`:

| Peça | Onde |
|---|---|
| Perguntas, ícones e textos | `quizData()` no `index.html` |
| Cálculo da nota, faltas, ações e plano | `quizResult()` |
| Apresentação do ebook | bloco `.ebook` na seção `#diagnostico` |
| Slot do ebook | bloco `.mat-grid` no `index.html`, com as instruções em comentário logo acima |

A mensagem do WhatsApp é montada com o perfil inteiro que a pessoa respondeu —
é o que transforma o diagnóstico em lead qualificado do lado de cá.

Para mudar as perguntas, mexa só em `quizData()`: a barra de progresso, o "de N"
e o passo do nome se ajustam sozinhos ao tamanho da lista.

O slot do ebook está vazio de propósito. Enquanto estiverem com
`data-vazio` ele aparece afundado na superfície, marcado como "Em breve" e não
é clicável. O comentário acima do bloco explica as quatro linhas que mudam para
ativá-lo.

O diagnóstico também é o portão de entrada: `setupPortao()` intercepta qualquer
link para o WhatsApp — CTA do topo, hero, os dois planos, o botão do CTA final e
o flutuante — e abre o modal antes. Depois que a pessoa responde (ou escolhe
falar direto), os links voltam a funcionar normalmente.

As imagens do carrossel ficam em `imgs/`. São capturas grandes (~1,6 MB no
total); se a página começar a pesar, vale reduzir para 1600px de largura e
converter para WebP.
