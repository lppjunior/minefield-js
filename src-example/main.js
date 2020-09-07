'strict'


function run () {
  window.game = Minefield.getInstance({
    ...Minefield.DEFAULTS.HARD
  })

  window.bot = Bot.getInstance({
    game,
    process: Bot.PROCESS.UNIT,
    speed: 200
  })

  new MinefieldController({ game })

  game.start()
}

document.addEventListener('DOMContentLoaded', run, false)
