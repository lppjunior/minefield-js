'strict'


function run () {
  const config = {
    cols: Math.floor(window.innerWidth / 27),
    rows: Math.floor((window.innerHeight - 130) / 27)
  }

  window.game = Minefield.getInstance({ ...config, mines: Math.floor(config.rows * config.cols * 0.08) })

  window.bot = Bot.getInstance({
    game,
    process: Bot.PROCESS.UNIT,
    speed: 100
  })

  new MinefieldController({ game })

  game.start()
}

document.addEventListener('DOMContentLoaded', run, false)
