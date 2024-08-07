import { STATUS } from './constants'

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
      mines: this.options.mines,
      total: this.options.cols * this.options.rows - this.options.mines,
      status: STATUS.PLAYING,
      checked: 0,
      lastUpdate: [],
      board: Array(this.options.rows).fill(null)
        .map(() => Array(this.options.cols).fill(''))
    }
  }

  get (key) {
    return key ? this.state[key] : this.state
  }

  set (key, value) {
    this.state[key] = value
  }

  getValue (row, col) {
    return this.state.board[row][col]
  }

  setValue (row, col, value) {
    this.state.board[row][col] = value
  }

  isWin () {
    return this.get('status') === STATUS.WIN
  }

  isLoss () {
    return this.get('status') === STATUS.LOSS
  }

  isFinish () {
    return this.isWin() || this.isLoss()
  }
}

export default State
