import * as Minefield from '../../main'

export default {
  makeBoardMap: function () {
    this.boardMap = {}
    Object.keys(Minefield.CHECKERS).forEach(value => { this.boardMap[Minefield.CHECKERS[value]] = [] })

    this.state.board.forEach(
      (cols, row) => cols.forEach(
        (value, col) => this.addMap(row, col, value)
      )
    )
  },

  addMap: function (row, col, value) {
    const checker = {
      row,
      col,
      value,
      around: {}
    }

    this.calcAround(checker)
    this.boardMap[value].push(checker)
  },

  calcAround: function (checker) {
    const around = { out: 0 }
    Object.keys(Minefield.CHECKERS).map((value) => { around[Minefield.CHECKERS[value]] = [] })

    const { rows, cols } = this.state
    if ((checker.row === 0 && (checker.col === 0 || checker.col === cols - 1)) ||
    (checker.row === rows - 1 && (checker.col === 0 || checker.col === cols - 1))) {
      around.out += 5
    } else if (checker.row === 0 ||
    checker.row === rows - 1 ||
    checker.col === 0 ||
    checker.col === cols - 1) {
      around.out += 3
    }

    for (let row = checker.row - 1; row <= checker.row + 1; row++) {
      for (let col = checker.col - 1; col <= checker.col + 1; col++) {
        if (this.state.board[row] !== undefined && this.state.board[row][col] !== undefined) {
          around[this.state.board[row][col]].push({ row, col })
        }
      }
    }

    checker.around = around
  }
}
