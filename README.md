# BellaJeri Tour — site

Site da **BellaJeri Tour**, empresa de transfers e passeios em Jericoacoara (CE): [bellajeritour.com.br](https://www.bellajeritour.com.br).
Feito para ser rápido e fácil de achar no Google, com o atendimento direto pelo WhatsApp.

## O que tem

- Página inicial e uma página por serviço, cada uma com título, descrição e URL próprios para SEO:
  transfer Fortaleza ⇄ Jericoacoara e passeios Leste, Oeste e Barrinha.
- URLs limpas (sem `.html`) por meio de `rewrites` no `vercel.json`.
- `sitemap.xml` para indexação.
- Imagens em WebP, redimensionadas por script (`npm run optimize`).
- Seção de avaliações com link para a página da empresa no Google Maps (sem chave de API no código).

## Stack

HTML, CSS e JavaScript puros, sem framework e sem build. Hospedagem na Vercel.

## Estrutura

```txt
index.html                       página inicial
passeio-*.html, transfer-*.html  páginas de serviço
passeios-em-jericoacoara.html    listagem de passeios
css/styles.css                   estilos
js/script.js                     comportamento da página
imagens/  videos/                mídia (WebP)
scripts/optimize.js              converte imagens para WebP
vercel.json  sitemap.xml         rotas limpas e SEO
```

## Rodar localmente

```bash
npx serve .
```

## Otimizar novas imagens

Coloque PNG/JPG em `imagens/` e rode:

```bash
npm install
npm run optimize
```
