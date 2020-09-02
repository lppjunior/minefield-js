import { Observer } from '@lppjunior/pattern-js'

import Actions from './Actions'
import Board from './Board'
import State from './State'
import Validator from './Validator'
import { DEFAULT, EVENT, STATUS } from '../config'

class Minefield {
  constructor (options = {}) {
    this.options = {
      ...DEFAULT,
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
    this.board = Board.make(this.options)
    this.state = new State(this.options, this.board)

    this.emit(EVENT.START)
  }

  nextTurn () {
    this.validateLastTurn()

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
}

Object.keys(Actions).forEach(action => Minefield.prototype[action] = Actions[action])
Object.keys(Validator).forEach(action => Minefield.prototype[action] = Validator[action])

export default Minefield
