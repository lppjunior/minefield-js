import { Observer } from '@lppjunior/pattern-js'

import * as Minefield from '@minefield/main'
import * as Modules from './modules'
import * as Constants from './constants'

class Bot {
  constructor (options) {
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })

    if (this.speed !== Constants.SPEED.NONE) {
      this.game.addListener(Minefield.EVENTS.ALL, (data) => {
        this.autoRun(data)
      }, this.speed)
    }

    this.observer = new Observer()
    this.reset()
  }

  onFinish (fn) {
    this.observer.on('onFinish', fn)
  }

  reset () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = null
    this.nextList = []
    this.stopped = false
  }

  autoRun (data) {
    if (data.event === Minefield.EVENTS.START) {
      this.reset()
    }

    if (!this.stopped) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      this.timeout = setTimeout(() => {
        this.timeout = null
        if (!this.stopped) this.run()
      }, this.speed)
    }
  }

  play () {
    this.stopped = false
    this.run()

    return this
  }

  stop () {
    this.stopped = true
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  run () {
    if (this.stopped) {
      return
    }

    this.setState()
    if (this.state.status === Minefield.STATUS.PLAYING) {
      this.calculate()
      this.open()
    }

    this.result()
  }

  calculate () {
    if (this.nextList.length > 0) {
      return
    }

    this.makeBoardMap()
    this.calculateNextList()
  }

  getHint () {
    this.setState()

    if (this.state.status !== Minefield.STATUS.PLAYING) {
      return null
    }

    this.nextList = []
    this.calculate()

    const move = this.nextList.find(checker => checker.origin !== 'RANDOM')
    if (!move) {
      return null
    }

    return {
      row: move.row,
      col: move.col,
      action: move.type === Minefield.CHECKERS.FLAG ? 'flag' : 'open'
    }
  }

  result () {
    if (this.state.status !== Minefield.STATUS.PLAYING) {
      this.observer.emit('onFinish', this.state.status)
    }
  }

  open () {
    if (this.nextList.length === 0) {
      return
    }

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
