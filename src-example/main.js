'strict'

function run () {
  const game = Minefield.getInstance(Minefield.DEFAULTS.MEDIUM)

  new Bot({ game, delay: 2000 })
  new MinefieldController({ game })

  game.start()
}

document.addEventListener('DOMContentLoaded', run, false)
