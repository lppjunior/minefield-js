import { CHECKER } from './constants'

export default {
  updateValue: function (row, col, value) {
    this.state.setValue(row, col, value)
    this.state.get('updated').push({ row, col, value })

    if ([CHECKER.EMPTY, CHECKER.FLAG, CHECKER.MINE].indexOf(value) === -1) {
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

  open: function (row, col) {
    if (this.state.isFinish()) {
      return
    }

    this.state.set('updated', [])

    if (this.state.getValue(row, col) === CHECKER.EMPTY) {
      const value = this.board[row][col]

      this.updateValue(row, col, value)

      if (value === 0) {
        this.expand(row, col)
      }
    }

    this.nextTurn()
  },

  flag: function (row, col) {
    if (this.state.isFinish()) {
      return
    }

    this.state.set('updated', [])

    const lastValue = this.state.getValue(row, col)
    if ([CHECKER.FLAG, CHECKER.EMPTY].indexOf(lastValue) > -1) {
      this.updateValue(row, col, lastValue === CHECKER.FLAG ? CHECKER.EMPTY : CHECKER.FLAG)
    }

    this.nextTurn()
  },

  expand: function (parentRow, parentCol) {
    for (let row = parentRow - 1; row <= parentRow + 1; row++) {
      for (let col = parentCol - 1; col <= parentCol + 1; col++) {
        if (this.board[row] !== undefined &&
            this.board[row][col] !== undefined &&
            this.board[row][col] === CHECKER.NUMBER_0 &&
            this.state.get('board')[row][col] === CHECKER.EMPTY) {
          this.updateValue(row, col, 0)
          this.expand(row, col)
        }
      }
    }
  }
}
