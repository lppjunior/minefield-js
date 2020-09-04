'strict'

function run () {
  const minefield = Minefield.getInstance(Minefield.DEFAULTS.MEDIUM)
  new MinefieldController(minefield)
  const bot = new Bot({ delay: 1000, game: minefield })

  //Add bot listener
  minefield.addListener(Minefield.EVENTS.ALL, (data) => bot.run(data))

  //Start Game
  minefield.start()
}

document.addEventListener('DOMContentLoaded', run, false)
