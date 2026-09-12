# lojahelpcell.com.br

Site institucional da **Help Cell** — assistência técnica especializada em celulares,
iPhone, MacBook, iPad e Apple Watch, no Floripa Shopping (Florianópolis/SC) desde 2007.

Criado e mantido por **PMTurbo**.

## O que é isto

Site **estático** (HTML + CSS + JS). Não há processo de build: os arquivos são servidos
como estão. Para rodar localmente:

```sh
python3 -m http.server 5500
```

E abrir <http://127.0.0.1:5500/>.

## Estrutura

| Caminho | O que é |
|---|---|
| `*.html` | 23 páginas (`index.html` é a home; `404.html` a página de erro) |
| `_next/static/` | CSS e JS do tema. O CSS tem, **no fim do arquivo**, blocos próprios da Help Cell (avaliações do Google e remoção das animações de imagem) |
| `assets/images/` | Imagens. `_originais-*/` guardam os arquivos originais do tema |
| `assets/js/helpcell-google.js` | Bloco de avaliações do Google na home (nota, total e mapa da ficha) |
| `CONTEUDO-HELPCELL.md` | Conteúdo real do cliente, extraído das reuniões — fonte da verdade para os textos |

## Atenção ao editar textos

O site é um build de Next.js servido estaticamente, então **cada texto existe em até
três lugares** e todos precisam ser alterados juntos — senão o React reverte o texto
na hidratação:

1. o HTML renderizado;
2. o *flight data* (`self.__next_f.push(...)`) dentro do mesmo HTML, em JSON escapado;
3. os chunks em `_next/static/chunks/` (para os componentes client).

Particularidades já encontradas: preços aparecem como `$$33.00` no flight data (o RSC
escapa `$` inicial) e `©` vira `\xa9` nos chunks minificados.

## Pendências

Ver a seção final de [`CONTEUDO-HELPCELL.md`](CONTEUDO-HELPCELL.md): telefone, e-mail,
Instagram e a tabela de preços dos serviços ainda são dados de exemplo do tema.
