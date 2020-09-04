import { CHECKERS } from './constants'

class Board {
  constructor (options) {
    this.options = options
  }

  make () {
    this.makeBoard()
    this.makeMines()

    return this.data
  }

  makeBoard () {
    this.data = Array(this.options.rows)
      .fill(null)
      .map(() => Array(this.options.cols)
        .fill(null)
        .map(() => 0)
      )
  }

  makeMines () {
    let count = 0
    let mines = ''

    do {
      const mine = this.getRandomMap()
      const _mine = `${mine.join(',')}|`

      if (mines.indexOf(_mine) === -1) {
        this.data[mine[0]][mine[1]] = CHECKERS.MINE
        this.fillAround(mine)

        mines += _mine
        count++
      }
    } while (count < this.options.mines)
  }

  fillAround (mine) {
    for (let row = mine[0] - 1; row <= mine[0] + 1; row++) {
      for (let col = mine[1] - 1; col <= mine[1] + 1; col++) {
        if (this.data[row] !== undefined
          && this.data[row][col] !== undefined
          && this.data[row][col] > CHECKERS.MINE) {
          this.data[row][col]++
        }
      }
    }
  }

  getRandomMap () {
    const rand = (size) => Math.floor(Math.random() * size)

    return [
      rand(this.options.rows),
      rand(this.options.cols)
    ]
  }
}

Board.make = (options) => ((new Board(options)).make())

export default Board
