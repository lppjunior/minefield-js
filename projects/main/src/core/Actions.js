import { CHECKERS } from './constants'
import Board from './Board'

export default {
  updateValue: function (row, col, value) {
    this.state.setValue(row, col, value)
    this.state.get('lastUpdate').push({ row, col, value })

    if ([CHECKERS.EMPTY, CHECKERS.FLAG, CHECKERS.MINE].indexOf(value) === -1) {
      this.state.set('checked', this.state.get('checked') + 1)
    }
  },

  openAll: function () {
    const board = this.state.get('board')
    board.forEach((_, row) => _.forEach((__, col) => {
      board[row][col] = this.board[row][col]
    }))

    this.state.set('board', board)
  },

  open: function (row, col, batchMode = false) {
    if (this.state.isFinish()) {
      return
    }

    if (this.options.safeFirstClick &&
      this.state.get('checked') === 0 &&
      this.state.getValue(row, col) === CHECKERS.EMPTY &&
      this.board[row][col] === CHECKERS.MINE) {
      this.board = Board.make(this.options, { row, col })
    }

    if (!batchMode) {
      this.state.set('lastUpdate', [])
    }

    if (this.state.getValue(row, col) === CHECKERS.EMPTY) {
      const value = this.board[row][col]

      this.updateValue(row, col, value)

      if (value === 0) {
        this.expand(row, col)
      }
    }

    if (!batchMode) this.nextTurn()
  },

  chord: function (row, col) {
    if (this.state.isFinish()) {
      return
    }

    const value = this.state.getValue(row, col)
    if (typeof value !== 'number' || value < CHECKERS.NUMBER_1 || value > CHECKERS.NUMBER_8) {
      return
    }

    const covered = []
    let flags = 0

    for (let neighborRow = row - 1; neighborRow <= row + 1; neighborRow++) {
      for (let neighborCol = col - 1; neighborCol <= col + 1; neighborCol++) {
        if (this.board[neighborRow] === undefined ||
          this.board[neighborRow][neighborCol] === undefined ||
          (neighborRow === row && neighborCol === col)) {
          continue
        }

        const neighbor = this.state.getValue(neighborRow, neighborCol)
        if (neighbor === CHECKERS.FLAG) {
          flags++
        } else if (neighbor === CHECKERS.EMPTY) {
          covered.push({ row: neighborRow, col: neighborCol })
        }
      }
    }

    if (flags !== value || covered.length === 0) {
      return
    }

    this.state.set('lastUpdate', [])
    covered.forEach(({ row: neighborRow, col: neighborCol }) => {
      this.open(neighborRow, neighborCol, true)
    })
    this.nextTurn()
  },

  flag: function (row, col, batchMode = false) {
    if (this.state.isFinish()) {
      return
    }

    if (!batchMode) {
      this.state.set('lastUpdate', [])
    }

    const lastValue = this.state.getValue(row, col)
    if ([CHECKERS.FLAG, CHECKERS.EMPTY].indexOf(lastValue) > -1) {
      this.updateValue(row, col, lastValue === CHECKERS.FLAG ? CHECKERS.EMPTY : CHECKERS.FLAG)
    }

    if (!batchMode) this.nextTurn()
  },

  batch: function (payload) {
    this.state.set('lastUpdate', [])

    payload.forEach(checker => {
      this[(checker.type === CHECKERS.FLAG) ? 'flag' : 'open'](checker.row, checker.col, true)
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
