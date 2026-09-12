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
| `index.html` | Home, servida em `/` |
| `<nome>/index.html` | Uma pasta por página, para a URL não mostrar `.html` (ex.: `/servico-celular/`) |
| `404.html` | Página de erro, na raiz porque é onde os hosts procuram |
| `_next/static/` | CSS e JS do tema. O CSS tem, **no fim do arquivo**, blocos próprios da Help Cell (avaliações do Google e remoção das animações de imagem) |
| `assets/images/` | Imagens. `_originais-*/` guardam os arquivos originais do tema |
| `assets/js/helpcell-google.js` | Bloco de avaliações do Google na home (nota, total e mapa da ficha) |
| `CONTEUDO-HELPCELL.md` | Conteúdo real do cliente, extraído das reuniões — fonte da verdade para os textos |

## URLs

As páginas ficam em **pastas com `index.html`**, então a URL não mostra `.html`
(`/contato/`, `/servico-celular/`). Por isso **todo caminho de asset e link é absoluto**
(`/assets/...`, `/_next/...`, `/services/`) — caminho relativo quebraria dentro das subpastas.
Ao adicionar página ou link novo, use sempre caminho absoluto.

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
