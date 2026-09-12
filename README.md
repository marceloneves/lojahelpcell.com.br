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

## O site é HTML estático

O site nasceu de um build de Next.js espelhado, mas **a hidratação do React foi
removida de todas as páginas**: não há mais `self.__next_f` nem os chunks de
`_next/static/chunks/*.js` sendo carregados. Sobrou o CSS do tema.

O motivo: com a hidratação ativa, o React reconciliava o DOM e desfazia qualquer
alteração — apagava o texto editado, o atributo `style`, a classe no `<body>`. Era a
causa comum de praticamente todos os bugs desta base (lupa e menu mobile mortos,
contadores vazios, texto revertendo). Sem ela, **editar o HTML é suficiente**: um
texto, um lugar.

O que o tema fazia por JS e agora vive em `assets/js/helpcell-ui.js`:
busca, menu mobile, acordeão do FAQ, header fixo ao rolar, voltar ao topo,
cartão de serviço clicável e o botão flutuante de WhatsApp.

Os carrosséis do Swiper degradam por CSS: a hero mostra um slide e os depoimentos
viram grade de três colunas.

## Pendências

Ver a seção final de [`CONTEUDO-HELPCELL.md`](CONTEUDO-HELPCELL.md): telefone, e-mail,
Instagram e a tabela de preços dos serviços ainda são dados de exemplo do tema.
