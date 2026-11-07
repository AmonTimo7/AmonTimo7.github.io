/* Service worker: faz o site funcionar sem internet, no celular e no PC.

   O que ele NÃO resolve, e é bom saber antes de confiar:
   - Precisa de UMA visita com internet antes. Aparelho que nunca abriu o
     site não tem o que servir offline.
   - Checkout do Mercado Pago, links de WhatsApp e o pixel da Meta são de
     fora: sem rede, não funcionam. O resto da página funciona.

   Estratégia, por tipo de pedido:
   - Páginas (navegação): rede primeiro, cache como rede de segurança. Assim
     uma publicação nova aparece na hora quando há sinal, e a loja sem sinal
     ainda abre.
   - Arquivos (imagem, fonte, js, css): cache primeiro e atualiza por trás.
     São versionados pelo deploy e não mudam no meio do dia.
*/

var VERSAO = 'actech-v39';
var C_CASCA = VERSAO + '-casca';
var C_USO = VERSAO + '-uso';

/* O kit de venda: o que precisa estar garantido offline mesmo que o Amon
   nunca tenha aberto a apresentação naquele aparelho. São ~700 KB. */
/* Sem .html: o Cloudflare Pages responde /termos.html com 308 para /termos, e
   resposta redirecionada guardada no cache nao serve para abrir pagina. */
var CASCA = [
  'apresentar',
  './',
  'obrigado',
  'assinar',
  '404',
  'offline',
  'privacidade',
  'termos',
  'barbearia/',
  'salao-de-beleza/',
  'maquiagem/',
  'loja-de-roupa/',
  'pet-shop/',
  'mercado/',
  'restaurante/',
  'clinica/',
  'criacao-de-sites-brasilia/',
  'criacao-de-sites-goiania/',
  'quanto-custa-um-site/',
  'gestao-de-instagram-brasilia/',
  'sistema-sob-medida-brasilia/',
  'manifest.webmanifest',
  'favicon.ico',
  'imgs/favicon-96.png',
  'site.css?v=10',
  'site.js?v=9',
  'extras/assinar.css?v=1',
  'extras/assinar.js?v=1',
  'extras/aceite.js?v=4',
  'extras/estudio.js?v=4',
  'extras/estudio.css?v=2',
  'extras/sistemas.js?v=3',
  'extras/mouses.js?v=1',
  'fontes/red-hat-display.woff2',
  'fontes/red-hat-text.woff2',
  'imgs/marca.webp',
  'imgs/logo.webp',
  'imgs/amon-foto.webp',
  'imgs/amon-foto-mini.webp',
  'imgs/assinatura.webp',
  'imgs/painel-caixa.webp',
  'vendor/gsap-3.12.5.min.js',
  'imgs/ramos/barbearia-1.webp',
  'imgs/ramos/barbearia-2.webp',
  'imgs/ramos/barbearia-3.webp',
  'imgs/ramos/clinica-1.webp',
  'imgs/ramos/clinica-2.webp',
  'imgs/ramos/clinica-3.webp',
  'imgs/ramos/maquiagem-1.webp',
  'imgs/ramos/maquiagem-2.webp',
  'imgs/ramos/maquiagem-3.webp',
  'imgs/ramos/mercado-1.webp',
  'imgs/ramos/mercado-2.webp',
  'imgs/ramos/mercado-3.webp',
  'imgs/ramos/outro-1.webp',
  'imgs/ramos/outro-2.webp',
  'imgs/ramos/outro-3.webp',
  'imgs/ramos/petshop-1.webp',
  'imgs/ramos/petshop-2.webp',
  'imgs/ramos/petshop-3.webp',
  'imgs/ramos/restaurante-1.webp',
  'imgs/ramos/restaurante-2.webp',
  'imgs/ramos/restaurante-3.webp',
  'imgs/ramos/roupa-1.webp',
  'imgs/ramos/roupa-2.webp',
  'imgs/ramos/roupa-3.webp',
  'imgs/ramos/roupa-4.webp',
  'imgs/ramos/salao-1.webp',
  'imgs/ramos/salao-2.webp',
  'imgs/ramos/salao-3.webp'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(C_CASCA).then(function (c) {
      /* Um por vez em vez de addAll: com addAll, um único arquivo que falhe
         derruba a instalação inteira e o site fica sem offline nenhum. */
      return Promise.all(CASCA.map(function (u) {
        return c.add(u)['catch'](function (err) {
          console.warn('[sw] nao consegui guardar', u, err);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (n) {
        if (n.indexOf(VERSAO) !== 0) return caches['delete'](n);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // só o que é deste site; checkout, WhatsApp e pixel passam direto
  if (url.origin !== self.location.origin) return;
  // no computador de desenvolvimento (localhost) nada de cache: sempre o arquivo novo
  if (/^(localhost|127\.0\.0\.1)$/.test(self.location.hostname)) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copia = res.clone();
        caches.open(C_USO).then(function (c) { c.put(req, copia); });
        return res;
      })['catch'](function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          return r || caches.match('apresentar').then(function (a) {
            return a || caches.match('offline');
          });
        });
      })
    );
    return;
  }

  /* ignoreSearch: o site pede estilos.js?v=3 e extras.css?v=2 pra furar o
     cache do GitHub Pages. Guardamos sem a query; sem isto dava miss e a
     prévia de site não montava offline. */
  /* Arquivo com ?v= (versionado): se a versao exata nao esta guardada, e
     arquivo novo -- busca na rede primeiro e so cai na versao velha sem
     internet. Antes o ignoreSearch servia o guia.js?v=1 para quem pedia ?v=2. */
  if (url.search) {
    e.respondWith(
      caches.match(req).then(function (exato) {
        if (exato) return exato;
        return fetch(req).then(function (res) {
          if (res && res.status === 200 && res.type === 'basic') {
            var c = res.clone();
            caches.open(C_USO).then(function (cache) { cache.put(req, c); });
          }
          return res;
        })['catch'](function () { return caches.match(req, { ignoreSearch: true }); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (guardado) {
      var daRede = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copia = res.clone();
          caches.open(C_USO).then(function (c) { c.put(req, copia); });
        }
        return res;
      })['catch'](function () { return guardado; });
      return guardado || daRede;
    })
  );
});
