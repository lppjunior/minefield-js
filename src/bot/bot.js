import * as Minefield from '../main'

class Bot {
  constructor (options = {
    delay: Bot.MANUAL
  }) {
    this.game = options.game
    this.delay = options.delay
  }

  run (data) {
    switch (data.event) {
      case Minefield.EVENTS.START:
        this.random(data)
        break

      case Minefield.EVENTS.NEXT_TURN:
        // this.game.open(2, 2)
        console.log('-----> NEXT_TURN!')
        break

      case Minefield.EVENTS.FINISH:
        console.log(data.state.status === Minefield.STATUS.LOSS ? 'I\'m LOSS! =(' : 'I\'m WIN! \ o /')
        break
    }
  }

  random (data) {
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
