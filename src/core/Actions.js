import { VALUES } from '../config'

export default {
  updateValue: function (row, col, value) {
    this.state.setValue(row, col, value)
    this.state.get('updated').push({ row, col, value })

    if ([VALUES.EMPTY, VALUES.FLAG, VALUES.MINE].indexOf(value) === -1) {
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
    this.state.set('updated', [])

    if (this.state.getValue(row, col) === VALUES.EMPTY) {
      const value = this.board[row][col]

      this.updateValue(row, col, value)

      if (value === 0) {
        this.expand(row, col)
      }
    }

    this.nextTurn()
  },

  flag: function (row, col) {
    this.state.set('updated', [])

    const lastValue = this.state.getValue(row, col)
    if ([VALUES.FLAG, VALUES.EMPTY].indexOf(lastValue) > -1) {
      this.updateValue(row, col, lastValue === VALUES.FLAG ? VALUES.EMPTY : VALUES.FLAG)
    }

    this.nextTurn()
  },

  expand: function (parentRow, parentCol, ) {
    for (let row = parentRow - 1; row <= parentRow + 1; row++) {
      for (let col = parentCol - 1; col <= parentCol + 1; col++) {
        if (this.board[row] !== undefined
            && this.board[row][col] !== undefined
            && this.board[row][col] === VALUES.NUMBER_0
            && this.state.get('board')[row][col] === VALUES.EMPTY) {
          this.updateValue(row, col, 0)
          this.expand(row, col)
        }
      }
    }
  }
}
