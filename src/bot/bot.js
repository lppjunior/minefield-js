import * as Minefield from '../main'
import * as Modules from './modules'
import * as Constants from './constants'

class Bot {
  constructor (options) {
    Object.keys(options).forEach(key => { this[key] = options[key] })

    if (this.speed !== Constants.SPEED.NONE) {
      this.game.addListener(Minefield.EVENTS.ALL, () => this.autoRun(), this.speed)
    }

    this.nextList = []
  }

  autoRun () {
    if (this.speed > Constants.SPEED.NONE) {
      setTimeout(() => this.run(), this.speed)
    }
  }

  run () {
    this.setState()
    this.play()
    this.result()

    return this
  }

  play () {
    if (this.state.status === Minefield.STATUS.PLAYING) {
      this.calculate()
      this.open()
    }
  }

  calculate () {
    if (this.nextList.length > 0) {
      return
    }

    this.makeBoardMap()
    this.calculateNextList()
  }

  result () {
    if (this.state.status !== Minefield.STATUS.PLAYING) {
      const result = this.state.status === Minefield.STATUS.LOSS ? 'LOSS! =(' : 'WIN! \\o/'
      console.log(`Heeey, i'm the Minefield BOT and i'm ${result} game`)
    }
  }

  open () {
    const checkers = (this.process === Constants.PROCESS.BATCH)
      ? [].concat(this.nextList)
      : [this.nextList.pop()]

    if (this.process === Constants.PROCESS.BATCH) {
      this.nextList = []
    }

    this.game.batch(checkers)
  }

  setState () {
    this.state = this.game.getState()
  }
}

Object.keys(Modules).forEach((key) => {
  Object.keys(Modules[key]).forEach(action => {
    Bot.prototype[action] = Modules[key][action]
  })
})

export default Bot
