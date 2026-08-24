# ACTech — landing de planos

Protótipo da landing page da ACTech Informática, em Neumorphism (Soft UI).
Arquivo principal: [`project/ACTech Landing.dc.html`](project/ACTech%20Landing.dc.html).

## Testar no seu computador

```powershell
.\preview.ps1
```

Abre em `http://127.0.0.1:8777`, montando a pasta exatamente como o GitHub Pages monta.
**Não abra o arquivo com dois cliques**: por `file://` o `support.js` não carrega e a página
aparece crua, com `{{ ... }}` no lugar do conteúdo.

## Publicar no GitHub Pages

O deploy é automático a cada push na `main`. O workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
copia o `.dc.html` como `index.html` — assim o arquivo de design continua sendo a única fonte
de verdade, sem cópia duplicada no repositório.

Primeira vez:

1. Crie um repositório vazio no GitHub (pode ser privado; o Pages funciona em privado só no plano pago).
2. Conecte e envie:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

```bash
git push -u origin main
```

3. No GitHub: **Settings → Pages → Source: GitHub Actions**.

Pronto. Em cerca de um minuto o endereço aparece na aba **Actions**, no passo `deploy`.
Nos próximos pushes é só empurrar — o site atualiza sozinho.

## Antes de mostrar pra cliente

- **Número do WhatsApp**: hoje é o de teste (`5599999999999`). Troque no fim do
  `ACTech Landing.dc.html`, na linha `const phone = this.props.whatsappNumber ?? '5599999999999';`.
- **Depoimentos**: os textos da seção "O que os clientes falam" são exemplo. Troque pelos reais.
- **Imagens**: as seções "O que fazemos" e "Nosso trabalho" usam mockups em SVG.
  Veja [`project/COMPONENTES.md`](project/COMPONENTES.md) para trocar por fotos de verdade.
- **Título e descrição do Google**: ficam no `<head>` do `ACTech Landing.dc.html`
  (`<title>`, `meta name="description"` e as tags `og:`). É o que aparece no resultado
  de busca e na prévia quando alguém manda o link no WhatsApp.
- **Prévia no WhatsApp/redes**: falta a imagem de compartilhamento (`og:image`).
  Sem ela o link aparece só com texto. Precisa de uma imagem 1200×630 no repositório.

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read `planos-de-conte-do-para-actech/project/ACTech Landing.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `planos-de-conte-do-para-actech/README.md` — this file
- `planos-de-conte-do-para-actech/project/` — the `Planos de conteúdo para ACTech` project files (HTML prototypes, assets, components)
