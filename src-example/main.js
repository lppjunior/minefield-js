'strict'


function run () {
  const game = Minefield.getInstance(Minefield.DEFAULTS.MEDIUM)

  new Bot({ game, mode: Bot.MODE.FAST })
  new MinefieldController({ game })

  game.start()
}

document.addEventListener('DOMContentLoaded', run, false)
