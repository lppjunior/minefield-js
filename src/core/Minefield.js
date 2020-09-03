import { Observer } from '@lppjunior/pattern-js'

import Actions from './Actions'
import Board from './Board'
import State from './State'
import { EVENT, STATUS, CHECKER } from '../constants'

class Minefield {
  constructor (options = {}) {
    this.options = {
      ...options
    }

    this.observer = new Observer()
  }

  addListener (event, fn) {
    this.observer.on(event, fn)
  }

  emit (event) {
    const data = this.state.get()

    if (this.options.debug) {
      data.debug = {
        board: this.board
      }
    }

    this.observer.emit(event, data)
  }

  start () {
    console.log(123)
    this.board = Board.make(this.options)
    this.state = new State(this.options, this.board)

    this.emit(EVENT.START)
  }

  nextTurn () {
    this.updateStatus()

    switch (this.state.get('status')) {
      case STATUS.PLAYING:
        this.emit(EVENT.NEXT_TURN)
        break
      case STATUS.LOSS:
      case STATUS.WIN:
        this.openAll()
        this.emit(EVENT.FINISH)
        break
    }
  }

  updateStatus() {
    if (this.state.get('updated').length === 0) return

    this.state.set('status',
      this.state.get('updated')[0].value === CHECKER.MINE ? STATUS.LOSS
        : this.state.get('checked') === this.state.get('total') ? STATUS.WIN
          : STATUS.PLAYING
    )
  }
}

Object.keys(Actions).forEach(action => Minefield.prototype[action] = Actions[action])

export default Minefield
