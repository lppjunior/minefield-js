import { CHECKERS } from './constants'

export default {
  updateValue: function (row, col, value) {
    this.state.setValue(row, col, value)
    this.state.get('updated').push({ row, col, value })

    if ([CHECKERS.EMPTY, CHECKERS.FLAG, CHECKERS.MINE].indexOf(value) === -1) {
      this.state.set('checked', this.state.get('checked') + 1)
    }
  },

  openAll: function () {
    const board = this.state.get('board')
    board.map((_, row) => _.map((__, col) => {
      board[row][col] = this.board[row][col]
    }))

    this.state.set('board', board)
  },

  open: function (row, col, batchMode = false) {
    if (this.state.isFinish()) {
      return
    }

    this.state.set('updated', [])

    if (this.state.getValue(row, col) === CHECKERS.EMPTY) {
      const value = this.board[row][col]

      this.updateValue(row, col, value)

      if (value === 0) {
        this.expand(row, col)
      }
    }

    if (!batchMode) this.nextTurn()
  },

  flag: function (row, col, batchMode = false) {
    if (this.state.isFinish()) {
      return
    }

    this.state.set('updated', [])

    const lastValue = this.state.getValue(row, col)
    if ([CHECKERS.FLAG, CHECKERS.EMPTY].indexOf(lastValue) > -1) {
      this.updateValue(row, col, lastValue === CHECKERS.FLAG ? CHECKERS.EMPTY : CHECKERS.FLAG)
    }

    if (!batchMode) this.nextTurn()
  },

  batch: function (payload) {
    payload.forEach(checker => {
      this[checker.type === Minefield.CHECKERS.FLAG ? 'flag' : 'open'](checker.row, checker.col, true)
    })

    this.nextTurn()
  },

  expand: function (parentRow, parentCol) {
    for (let row = parentRow - 1; row <= parentRow + 1; row++) {
      for (let col = parentCol - 1; col <= parentCol + 1; col++) {
        if (this.board[row] !== undefined &&
            this.board[row][col] !== undefined &&
            this.board[row][col] >= CHECKERS.NUMBER_0 &&
            this.board[row][col] <= CHECKERS.NUMBER_8 &&
            this.state.get('board')[row][col] === CHECKERS.EMPTY) {
          this.updateValue(row, col, this.board[row][col])

          if (this.board[row][col] === CHECKERS.NUMBER_0) {
            this.expand(row, col)
          }
        }
      }
    }
  }
}
