# Minefield JS

Campo Minado Smart é um jogo de Campo Minado para navegador. O projeto separa
as regras do jogo da interface React e do bot, com comunicação por eventos.

## Requisitos

- Node.js 26.x
- npm 8 ou superior

## Executar localmente

Na raiz do repositório, instale as dependências e inicie a interface:

```shell
npm ci
npm start
```

O servidor de desenvolvimento abre em `http://localhost:9000`.

## Comandos

```shell
npm test       # testes do motor e do bot
npm run lint   # lint dos workspaces
npm run build  # build de produção em dist/
```

O workspace da interface usa Vite para desenvolvimento e build.

## Workspaces

- `projects/main`: motor do jogo, geração do tabuleiro e API baseada em eventos.
- `projects/bot`: bot que joga usando a API pública do motor.
- `projects/game`: interface React responsiva e aplicação de navegador.

## Regras e controles

- Escolha o tamanho do tabuleiro e a dificuldade antes de iniciar.
- Clique/toque abre uma casa; clique direito ou toque prolongado marca uma bandeira.
- O botão de bandeira da barra superior também funciona em telas touch.
- Abrir um número com as bandeiras corretas ao redor revela as casas vizinhas.
- A primeira casa aberta é segura.
- O resumo das partidas é salvo localmente no navegador; não há envio para servidor.

## Usar o motor

O pacote `@minefield/main` exporta `getInstance`, `CHECKERS`, `DEFAULTS`,
`EVENTS` e `STATUS`. Exemplo em um consumidor com suporte a ES modules:

```js
import Minefield from '@minefield/main'

const game = Minefield.getInstance({
  rows: 9,
  cols: 9,
  mines: 10,
  safeFirstClick: true
})

game.addListener(Minefield.EVENTS.ALL, ({ event, state }) => {
  console.log(event, state)
})

game.start()
game.open(0, 0)
game.flag(0, 1)
```

## SEO e compartilhamento

A página inclui metadados em português, Open Graph, Twitter Cards e dados
estruturados para o jogo. Configure a URL canônica e URLs absolutas de
compartilhamento quando o domínio de publicação estiver definido.
