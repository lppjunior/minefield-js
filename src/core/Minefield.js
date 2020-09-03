import { Observer } from '@lppjunior/pattern-js'

import Actions from './Actions'
import Board from './Board'
import State from './State'
import { EVENTS, STATUS, CHECKER } from './constants'

class Minefield {
  constructor (options) {
    this.options = {
      ...options
    }

    this.observer = new Observer()
  }

  addListener (event, fn) {
    this.observer.on(event, fn)
  }

  emit (event) {
    this.observer.emit(event, this.getState())
    this.observer.emit(EVENTS.ALL, { event, state: this.getState() })
  }

  start () {
    this.board = Board.make(this.options)
    this.state = new State(this.options, this.board)

    this.emit(EVENTS.START)

    return this
  }

  getState () {
    const data = this.state.get()

    if (this.options.debug) {
      data.debug = {
        board: this.board
      }
    }

    return data
  }

  nextTurn () {
    this.updateStatus()

    switch (this.state.get('status')) {
      case STATUS.PLAYING:
        this.emit(EVENTS.NEXT_TURN)
        break
      case STATUS.LOSS:
      case STATUS.WIN:
        this.openAll()
        this.emit(EVENTS.FINISH)
        break
    }
  }

  updateStatus () {
    if (this.state.get('updated').length === 0) return

    this.state.set('status',
      this.state.get('updated')[0].value === CHECKER.MINE ? STATUS.LOSS
        : this.state.get('checked') === this.state.get('total') ? STATUS.WIN
          : STATUS.PLAYING
    )
  }
}

Object.keys(Actions).forEach(action => { Minefield.prototype[action] = Actions[action] })

export default Minefield
