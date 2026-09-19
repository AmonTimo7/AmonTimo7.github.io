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

> **@ e números são exemplo.** Os números (1.240 seguidores, 318 seguindo) estão chumbados
> no HTML da seção; o @ vem de `instagramUser` e é o mesmo dos links de contato. Trocar
> pelos reais antes de publicar — é o perfil de vocês na página de vocês.

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

## Ficha do Google e "a conta" (`#google` e `#planos`)

- **Antes e depois da ficha** (`#google`): as duas fichas são HTML montado à mão, não captura
  de cliente — dá pra editar item por item. A da esquerda usa `--nm-in` (afundada, cinza) e a
  da direita `--nm-out` (em relevo, branca): a hierarquia é a própria física da página.
  Dentro dos cartões a tipografia é Roboto e as cores são as do Google (`#1A73E8`, `#FBBC04`,
  `#188038`), porque ali a ilusão tem que ser de painel do Google, não de página nossa.
- **Tráfego pago saiu (ADS OFF)**: a ACTech não cuida mais de Google Ads / Meta Ads. Nada
  foi apagado — a faixa de plataformas, o painel do post patrocinado, o CSS dos dois, o item
  do plano Completo e a pergunta do FAQ sobre "verba de anúncio separada" estão comentados
  e marcados com `ADS OFF` no `index.html`. São sete pontos; o comentário grande do CSS
  (`.ads-faixa`) lista todos. Pra religar, é tirar os comentários desses sete.
- **A conta do padeiro** (fim de `#planos`): `R$ 197 ÷ R$ 50 = 4 clientes`. Os dois números
  de entrada estão no HTML da seção; se o preço do plano mudar, o resultado **não** se
  recalcula sozinho — é texto. O ticket de R$ 50 é o chute que faz fechar em 4.
  A letra miúda existe de propósito: sem ela a conta vira promessa de resultado.
- **Sozinho x com a ACTech** (`#sozinho`, entre `#planos` e `#diferenciais`): responde a
  objeção que vem depois do preço — "isso eu mesmo faço". Dois painéis com o mesmo mês:
  o da esquerda afundado (`--nm-in`, cinza), o da direita em relevo (`--nm-out`, roxo),
  a mesma física do antes/depois da ficha. As linhas **não** se alinham pixel a pixel;
  o par é feito pelo `data-tema`, e `setupDuelo()` acende as duas ao passar o mouse.
  Não tem `tabindex`: o realce é decorativo e dez paradas de tabulação só atrapalhariam.
  O medidor de horas embaixo só enche quando entra na tela. As 14h são estimativa, e a
  letra miúda diz isso — mesma regra da conta do padeiro.
- **Cabeçalho**: dois caminhos no topo — "Ver planos" (secundário, âncora pra `#planos`)
  para quem quer preço antes de conversa, e "Fale com a gente" (primário, WhatsApp).
  O link de texto "Planos" saiu do menu: com o botão do lado, era o mesmo destino duas vezes.

## Desempenho

A página junta muita coisa cara ao mesmo tempo: sete faixas em loop, quatro blobs sob
`blur`, um glow girando e uma parede 3D com 40 quadros. Três regras seguram isso:

1. **Anima só o que está na tela.** `setupPausar()` põe `fora-de-vista` em cada bloco
   marcado com `data-anima` (faixa de segmentos, planos, depoimentos, trabalhos) e o CSS
   pausa as animações lá dentro. Volta a rodar 200px antes de reaparecer, então ninguém
   flagra a faixa parada. Pausar não desalinha o loop: ele retoma de onde estava.
2. **Modal aberto congela o fundo.** `lockScroll()` põe `modal-aberto` no `<body>`.
   Por baixo de um `backdrop-filter`, cada quadro do fundo obriga o navegador a
   refazer o desfoque da tela inteira.
3. **Uma escrita por quadro no tilt.** O ponteiro dispara bem mais que 60 eventos por
   segundo; antes cada um media o card (`getBoundingClientRect`, que força layout) e
   escrevia o `transform`. Agora mede uma vez no `pointerenter` e escreve uma vez por
   quadro via `requestAnimationFrame` — 120 eventos viram 1 escrita de estilo.

Também: `renderVals()` roda inteiro a cada `setState` (e o quiz dispara um por resposta),
então o que não muda passou por `memo()` — perguntas, ícones, os 40 quadros da parede,
a curva do gráfico por faixa. E os raios de blur caíram um pouco (`.fluid` 50→40px,
glow 26→21px): o custo cresce com o raio e a diferença não aparece.

### O desfoque dos cards de plano virou textura

Era o gargalo da página inteira. Medido no cartão de preço, com a seção na tela:

| | antes | depois |
|---|---|---|
| Elementos com `filter` vivo animando | 4 | 0 |
| Área redesenhada por quadro | ~10,4 milhões de px | 0 |

O glow sozinho era um `conic-gradient` de ~2.200 × 2.250px sob `blur(21px)` girando sem
parar, **em cada um dos dois cards** — uns 15 MB de textura por card, pra aparecer uns 2px
de borda colorida. E os quatro blobs animavam dentro de um `filter: blur(40px)`, o que
obriga o navegador a refazer o desfoque da área toda a cada quadro.

Agora o desfoque vem pronto em três WebP somando 6 KB:

- `imgs/plano-blobs-1.webp` e `-2.webp` — as mesmas elipses de antes, desenhadas e
  desfocadas uma vez. Na página, duas camadas que trocam de opacidade e deslizam.
- `imgs/plano-glow.webp` — o anel do conic-gradient, já desfocado, girando.

`opacity` e `transform` o compositor resolve sozinho, sem repintar. Para regerar as
texturas (mudou cor, mudou tamanho), os dois scripts que as desenham estão no histórico
deste commit — são uns 30 linhas de Pillow cada.

**Efeitos com timer** (TrueFocus nos planos, CardSwap nos diferenciais) passaram a
consultar `podeAnimar()`: fora da tela ou com o modal aberto, o tique não faz nada.
Só a classe `fora-de-vista` não resolvia isso — ela pausa animação de CSS, não `setInterval`.

### Os cinco painéis de `#servicos`

Os mockups em SVG saíram. No lugar entraram cinco painéis montados com material da
própria ACTech — capturas dos sistemas e as artes reais do Instagram, os mesmos arquivos
que `#trabalhos` e `#redes` já carregam, então não pesou um byte a mais:

| Item | O painel |
|---|---|
| Sites que vendem | moldura de navegador com a home de um cliente + "no ar em 5 dias" |
| Redes sociais ativas | celular com a grade do perfil |
| Google Meu Negócio | a ficha, no estilo do painel do Google |
| Manutenção e suporte | painel do sistema + conversa de aprovação |

> O painel de anúncios (post patrocinado + contagem de cliques) era o quarto desta lista
> e está comentado com `ADS OFF`. Os painéis casam com os itens da lista **pela ordem** em
> que aparecem no HTML, não pelo número em `data-slide` / `data-item` — por isso comentar
> os dois (painel e item) de uma vez mantém tudo alinhado. Se religar um, religue o outro.

Os mesmos quatro existem como pranchas no canvas do Claude Design (`Painéis O Que Fazemos`),
que é onde dá pra mexer neles no olho e exportar PNG. Os arquivos-fonte `.dc.html` são
irmãos deste formato — o projeto todo roda no mesmo runtime `x-dc`.

O quadro muda de proporção (300×400 no desktop, 420×300 no celular), então nada aqui tem
tamanho fixo: a peça principal cresce com `flex: 1` e as imagens recortam com `object-fit`.
O texto dentro do celular mede em `cqw` (container query) porque em px ele estourava quando
o aparelho encolhia para 100px de largura.

### Contato

Duas portas, nesta ordem de prioridade: WhatsApp (botão do topo, hero, planos, CTA final e
o flutuante) e Instagram como alternativa para quem não quer puxar conversa — botão "Ver o
perfil" em `#redes`, "ou chama no direct" embaixo do CTA final e o chip no rodapé.

O número e o @ ficam nos campos de Contato (`whatsappNumber`, `instagramUser`) e viram
`whatsUrl` / `instaUrl` num lugar só do estado: trocar o @ é uma linha, e os três links
acompanham.

## Pendências de conteúdo

- **"Ilimitadas" saiu**: o Completo dizia "atualizações ilimitadas no site" e agora diz
  "4 atualizações de conteúdo por mês" — o Essencial tem 1, então a escada fica clara sem
  precisar de letra miúda. Quando o contrato existir, vale definir lá o que conta como
  atualização.
- **Depoimentos — seção desligada**: os seis depoimentos eram exemplo, com nome e negócio
  inventados, e por isso a seção saiu do ar antes da publicação. Ela está guardada inteira
  num `<script type="text/html" data-depoimentos-desligados>`, e não num comentário HTML,
  porque o bloco tem um comentário dentro dele e vários `--` (`--tdur`, `tcol--down`) —
  comentário aninhado quebraria o parser. Script de tipo desconhecido o navegador não
  renderiza, não carrega imagem e o runtime não percorre.

  Pra religar: troque texto, nome e negócio de cada `.tcard`, lembrando que **cada card
  aparece duas vezes** (a duplicata é o que fecha a emenda do loop), e apague as linhas do
  `<script>` e do `</script>`. O CSS `.tcols` / `.tcard` ficou de pé de propósito.

  Duas ou três depoimentos reais já resolvem — a coluna rola em loop e repete os cards.
- **Instagram**: o perfil é **@actech.systems**. As artes vêm de `imgs2/`, convertidas para
  WebP quadrado de 520px em `imgs/insta-N.webp`:
  - `insta-1..8` — as artes de maio/2026
  - `insta-9..16` — o caso do painel de indicadores do banco (set/2026): `carrossel-01..06`,
    `post-12-indicadores` e `post-dia30-dia1`

  As grades mostram as novas primeiro, como num perfil de verdade. Os originais são 1080×1350
  (4:5) e a célula da grade é quadrada, então o recorte é **central** — o mesmo que o
  `object-fit: cover` faria. Confira o recorte ao acrescentar arte nova: título muito no topo
  ou muito no pé fica de fora.

  Os números do perfil (`.iph-nums`) são os **reais** do @actech.systems, não chute — quem
  clica no link do rodapé confere em um segundo. Reconferir quando mudarem.

  A pasta `imgs2/` é só arquivo-fonte; não é referenciada por nada no HTML.
- **Sigilo**: nenhum nome de cliente aparece em `#trabalhos` — nem no texto, nem na barra de
  endereço da moldura (`cliente.com.br/...`). Nas capturas em `imgs/`, as marcas foram apagadas
  (logo borrado, nome removido do subtítulo). Os arquivos originais estão no histórico do git.
  Ao acrescentar um trabalho, confira a captura antes: o nome costuma aparecer em logo, título e
  rodapé.
- **Logo e card social**: o logo real está em `imgs2/logo.jpeg`, num quadrado de 1024px
  com fundo branco. Dele saíram dois arquivos:
  - `imgs/marca.webp` — só o símbolo (o "A"), sem o fundo. O logo completo traz "Python" e
    "Java" escritos embaixo, que não dizem nada pra quem veio comprar site pra padaria.
    O fundo branco saiu por preenchimento a partir da borda, não por teste de cor: o brilho
    azul em volta do DNA não é branco neutro, e um teste de cor ou deixava o halo ou comia
    a tela do celular junto. O que separa os dois é a topologia — o halo encosta na borda,
    as telas estão trancadas dentro de um contorno escuro.
  - `imgs/og.png` — o card 1200×630 que aparece quando alguém cola o link no WhatsApp.
    A URL no `og:image` é **absoluta** (`https://amontimo7.github.io/...`) porque raspador
    de rede social não resolve caminho relativo. Se o domínio mudar, muda lá também.

  O símbolo **não** virou favicon: a 16px e 32px ele vira borrão (testado). O favicon
  segue sendo o `< >` em SVG, que é nítido em qualquer tamanho.
- **Imagens**: as duas seções usam material real de `imgs/`. Se um dia entrarem fotos de
  verdade (a loja, a equipe, o cliente usando o sistema), elas caem nos mesmos lugares —
  `.srv-visual img` em `#servicos` e as capturas da parede em `#trabalhos`.

## Cor: os tons das seções e a cor que quer dizer algo

A página era um mar de cinza com roxo por cima. Duas frentes resolveram isso.

**Tons de seção** (`.tom` + `.tom--lavanda` / `--menta` / `--pessego`). Neumorfismo exige que
o card tenha a **mesma cor** do que está atrás dele — é daí que sai o relevo. Então tingir uma
seção não é pintar o fundo e deixar os cards cinzas: é redefinir `--bg` e as sombras ali dentro
e deixar a cascata levar isso pros cards.

Os três tons têm exatamente a mesma luminosidade e saturação do cinza base (L 90,2% / S 24%) —
**só o matiz muda**. É isso que faz a emenda entre uma seção e a vizinha ser suave, sem precisar
de degradê. Tingidas hoje: `#redes` e `#diagnostico` (lavanda), `#google` e `#sozinho` (menta),
`#trabalhos` (pêssego). `#planos` ficou cinza de propósito — é onde os cards de gradiente roxo
mais rendem.

> **A pegadinha que custou caro:** trocar `--sh-dark` sozinho **não funciona**. O valor computado
> de `--nm-out` já sai do `:root` com o `var(--sh-dark)` resolvido, e é esse valor pronto que
> desce pela herança. As sombras continuavam azul-acinzentadas em cima do pêssego. Por isso
> `.tom` **redeclara os seis tokens** de sombra: redeclarar força a substituição a acontecer de
> novo, agora com o `--sh-dark` local. Se criar um tom novo, ele precisa da classe `.tom` junto.

O fundo é pintado por um `::after` de `100vw` centrado, porque as seções são `.wrap`
(máx. 1180px) e o tom precisa sangrar até a borda. Só não estoura porque o wrapper raiz tem
`overflow-x: hidden`.

**Cor com significado.** `icon()` e `ico()` passaram a usar `currentColor` — quem manda na cor
é o recipiente. Daí saem duas coisas:

- **Cada pergunta do quiz tem seu tom.** A classe `q0..q9` vai no `.modal-panel`, não na grade:
  a barra de progresso é irmã da grade e não enxergaria a variável de lá. Só enquanto pergunta —
  no resultado quem manda na cor é a nota. No formato lista o `.pick-ico` é o próprio radio, e
  por isso ele fica sem tinta de fundo: tingido, a opção parecia já escolhida.
- **A nota reage ao resultado.** Era sempre roxa; um 22 e um 85 ficavam idênticos. Agora
  vermelho (&lt;40), âmbar (40–67) e verde (≥68), com um chip dizendo a faixa. As faixas são as
  mesmas que decidem o título do resultado em `quizResult()` — **mexeu numa, mexa na outra.**
  "O que está faltando" ficou coral e "o que a gente faria" ficou verde.

> **Anel vivo, número escuro, de propósito.** O âmbar e o verde vibrantes não passam 3:1 contra
> o fundo, que é o mínimo para um gráfico. Mas o número declara a nota em texto do lado, então o
> anel não é a única fonte da informação e pode puxar saturação. O número usa as versões escuras
> (#C62A2F / #A76800 / #0E7C6F), todas acima de 3:1 como texto grande. Ao mexer nessas cores,
> refaça a conta — vivo não pode custar leitura.

## Pendências que dependem de material seu

- **`actech.com.br` não é da ACTech.** A bio do mockup do Instagram exibia esse domínio como
  se fosse o site. Ele é da **Actech Tecnologia**, outra empresa — que por sinal também vende
  sistema para mercado e padaria, ou seja, concorrente direto no mesmo público. Está trocado
  pelo CTA que a bio real usa ("Faça seu orçamento"). Quando existir domínio próprio, é ali
  que ele entra.
- **Quarta captura de fora**: `imgs2/sistema-visitas.png` (Agenda de visitas) ficou fora de
  `#trabalhos`. O sistema é bom, mas a tela foi capturada com dados de teste digitados no
  improviso — aparecem "sada", "sdadas", "asdasd" e "Visita 1" nos cartões. Numa parede de
  portfólio isso é lido. Refaça a captura com dados que pareçam reais e ela entra: já está
  convertida em `imgs/sistema-visitas.webp`, é só acrescentar uma entrada em `trabalhos()`.
- **"Agência 3309"** aparece em duas das capturas. Não nomeia o banco, mas é um dado
  específico — se incomodar, vale borrar antes de republicar.

## Diagnóstico e presente

Fluxo próprio, sem biblioteca de terceiros — vive no estado do `DCLogic`:

| Peça | Onde |
|---|---|
| Perguntas, ícones e textos | `quizData()` no `index.html` |
| Cálculo da nota, faltas, ações e plano | `quizResult()` |
| Apresentação do ebook | bloco `.ebook` na seção `#diagnostico` |
| Slot do ebook | bloco `.mat-grid` no `index.html`, com as instruções em comentário logo acima |

### O fim do diagnóstico

O quiz não joga mais direto no WhatsApp. Depois do resultado (nota, o que está faltando
e o que a gente faria primeiro), o botão leva a uma **tela de oferta** — passo `N + 3` —
com três saídas, nesta ordem:

1. **Ebook** — slot igual ao da página, marcado "Em breve" enquanto o arquivo não existe.
   O comentário em cima do bloco tem as quatro linhas que mudam pra ligar, seja como
   download (presente) ou como link de compra.
2. **Auditoria em 24h** — esta já funciona: abre o WhatsApp com o diagnóstico escrito e a
   última linha em branco (`Meu link (site, Instagram ou ficha do Google):`), esperando a
   pessoa colar. É `res.audit`, irmã de `res.whats`.
3. **Falar no WhatsApp** — o caminho antigo, com o perfil inteiro na mensagem.

Chegar nessa tela já libera o presente na página (`unlocked`), então quem fechar o modal
encontra o ebook esperando embaixo.

> **Atenção ao ligar o ebook:** a página promete "um presente no fim" antes do quiz e o
> bloco liberado diz "Presente liberado". Se ele virar produto pago, esses dois textos
> precisam mudar junto — senão a página promete de graça o que cobra duas telas depois.

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

As imagens do carrossel ficam em `imgs/`, agora em WebP: `site-home`,
`site-portfolio`, `painel-caixa` e `livro-caixa` saíram de 1,31 MB em PNG para
205 KB, sem mexer nas dimensões. Os `.png` originais continuam na pasta como
fonte — nada no HTML aponta pra eles, mas eles ainda sobem no deploy.
