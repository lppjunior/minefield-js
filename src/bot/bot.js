import { Observer } from '@lppjunior/pattern-js'

import * as Minefield from '../main'
import * as Modules from './modules'
import * as Constants from './constants'

class Bot {
  constructor (options) {
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })

    if (this.speed !== Constants.SPEED.NONE) {
      this.game.addListener(Minefield.EVENTS.ALL, () => this.autoRun(), this.speed)
    }

    this.nextList = []
    this.stoped = false

    this.observer = new Observer()
  }

  onFinish (fn) {
    this.observer.on('onFinish', fn)
  }

  autoRun () {
    if (!this.stoped) {
      setTimeout(() => this.run(), this.speed)
    }
  }

  play () {
    this.stoped = false
    this.run()

    return this
  }

  stop () {
    this.stoped = true
  }

  run () {
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

  result () {
    if (this.state.status !== Minefield.STATUS.PLAYING) {
      this.observer.emit('onFinish', this.state.status)
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