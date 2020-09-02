import { STATUS } from '../config'

class State {
  constructor (options, board) {
    this.options = options
    this.board = board

    this.init()
  }

  init () {
    this.state = {
      rows: this.options.rows,
      cols: this.options.cols,
      total: this.options.cols * this.options.rows - this.options.mines,
      status: STATUS.PLAYING,
      checked: 0,
      updated: [],
      board: Array(this.options.rows)
        .fill(null)
        .map(() => Array(this.options.cols)
          .fill(null)
          .map(() => '')
        )
    }
  }

  get (key) {
    return key ? this.state[key] : this.state
  }

  set (key, value) {
    return this.state[key] = value
  }

  getValue (row, col) {
    return this.state.board[row][col]
  }

  setValue (row, col, value) {
    return this.state.board[row][col] = value
  }

  isWin () {
    return this.state.get('status') === STATUS.WIN
  }

  isLoss () {
    return this.state.get('status') === STATUS.LOSS
  }
}

export default State
