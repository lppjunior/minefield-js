import * as Minefield from '../main'
import Calculate from './modules/calculate'
import MakeMap from './modules/makeMap'
import CalculateNext from './modules/calculateNext'

class Bot {
  constructor (options = {
    speed: Bot.SPEED.NONE,
    process: Bot.PROCESS.UNIT
  }) {
    this.game = options.game
    this.speed = options.speed
    this.process = options.process
    this.nextList = []

    if (this.speed !== Bot.SPEED.NONE) {
      this.game.addListener(Minefield.EVENTS.ALL, () => this.autoRun(), this.speed)
    }
  }

  autoRun () {
    if (this.speed > Bot.SPEED.NONE) {
      setTimeout(() => this.run(), this.speed)
    }
  }

  run () {
    this.state = this.game.getState()
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

  result () {
    if (this.state.status !== Minefield.STATUS.PLAYING) {
      const result = this.state.status === Minefield.STATUS.LOSS ? 'LOSS! =(' : 'WIN! \\ o /'
      console.log(`Heeey, i'm the Minefield BOT and i'm ${result} game`)
    }
  }

  open () {
    if (Bot.PROCESS.BATCH) {
      game.batch(this.nextList)
      this.nextList = []
    } else {
      const checker = this.nextList.pop()

      if (this.state.debug.board[checker.row][checker.col] === Minefield.CHECKERS.MINE && !checker.type !== Minefield.CHECKERS.FLAG) {
        console.error(this.nextList)
        console.error('YOU HAVE A BUG!!!', checker)
        return
      }

      this.game[checker.type === Minefield.CHECKERS.FLAG ? 'flag' : 'open'](checker.row, checker.col)
    }
  }
}

Bot.SPEED = {
  FAST: 1000,
  NONE: -1,
  NORMAL: 2000,
  SLOW: 4000
}

Bot.PROCESS = {
  BATCH: 'batch',
  UNIT: 'unit'
}

Object.keys(Calculate).forEach(action => { Bot.prototype[action] = Calculate[action] })
Object.keys(MakeMap).forEach(action => { Bot.prototype[action] = MakeMap[action] })
Object.keys(CalculateNext).forEach(action => { Bot.prototype[action] = CalculateNext[action] })

export default Bot
