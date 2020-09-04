import * as Minefield from '../main'

class Bot {
  constructor (options = {
    delay: Bot.MANUAL
  }) {
    this.game = options.game
    this.delay = options.delay

    this.game.addListener(Minefield.EVENTS.ALL, (data) => this.autoRun(data), this.delay)
  }

  autoRun (data) {
    if (this.delay > Bot.MODE.MANUAL) {
      setTimeout(() => this.run(data), this.delay)
    }
  }

  run (data) {
    switch (data.event) {
      case Minefield.EVENTS.START:
      case Minefield.EVENTS.NEXT_TURN:
        this.calculate(data)
        break

      case Minefield.EVENTS.FINISH:
        console.log(`Heeey, i'm the Minefield BOT and i'm ${data.state.status === Minefield.STATUS.LOSS } ? 'LOSS! =(' : 'WIN! \ o /' game`  )
        break
    }
  }

  calculate(data) {
    console.log('====> AGORA FUDEU!')
    this.openRandom(data)
  }

  openRandom (data) {
    const rand = (size) => Math.floor(Math.random() * size)

    this.game.open(
      rand(data.state.rows),
      rand(data.state.cols)
    )
  }
}

Bot.MODE = {
  FAST: 1000,
  MANUAL: -1,
  SLOW: 4000
}

export default Bot
