import * as Minefield from '../main'

class Bot {
  constructor (options = {
    mode: Bot.MANUAL
  }) {
    this.game = options.game
    this.delay = options.mode
    this.nextList = []

    this.game.addListener(Minefield.EVENTS.ALL, () => this.autoRun(), this.delay)
  }

  autoRun () {
    if (this.delay > Bot.MODE.MANUAL) {
      setTimeout(() => this.run(), this.delay)
    }
  }

  run () {
    this.state = this.game.getState()

    if (this.state.status === Minefield.STATUS.PLAYING) {
      this.calculate()
      this.openNext()
    } else {
      console.log(`Heeey, i'm the Minefield BOT and i'm \
        ${this.state.status === Minefield.STATUS.LOSS
          ? 'LOSS! =('
          : 'WIN! \ o /'
        } game`
      )
    }
  }

  calculate () {
    this.calcAvailable()

    if (this.nextList.length || this.state.checked < 4) {
      return
    }

    this.calcAround()
    this.calcNextList()
  }

  calcAvailable () {
    this.available = [].concat(
      ...this.state.board.map(
        (cols, row) => cols.map(
          (value, col) => (value === Minefield.CHECKERS.EMPTY
            ? { row, col } : null)
        )
      )
    ).filter(values => values !== null)
  }

  calcAround() {
    this.available.forEach(checker => {
      checker.around = 0
      checker.aroundList = []
      checker.closedList = []

      const { rows, cols } = this.state

      if (checker.row === 0 && (checker.col === 0 || checker.col === cols - 1)
      || checker.row === rows - 1 && (checker.col === 0 || checker.col === cols - 1)) {
        checker.around += 5
      } else if (checker.row === 0
      || checker.row === rows - 1
      || checker.col === 0
      || checker.col === cols -1) {
        checker.around += 3
      }

      for (let row = checker.row - 1; row <= checker.row + 1; row++) {
        for (let col = checker.col - 1; col <= checker.col + 1; col++) {
          if (this.state.board[row] !== undefined
            && this.state.board[row][col] !== undefined) {
              if (this.state.board[row][col] !== Minefield.CHECKERS.EMPTY) {
                checker.around++
                checker.aroundList.push(this.state.board[row][col])
              } else {
                checker.closedList.push(this.state.board[row][col])
              }
          }
        }
      }
    });
  }

  calcNextList() {
    this.nextList = []
    this.available.forEach((checker) => {
      if (checker.around === 8) {
        checker.flag = true
        this.nextList.push(checker)
      }
    })
  }

  open(checker) {
    console.log('OPEN: ', checker)

    if (checker.flag) {
      this.game.flag(checker.row, checker.col)
    } else {
      this.game.open(checker.row, checker.col)
    }
  }

  openNext() {
    if (this.nextList.length) {
      this.open(this.nextList.pop())
    } else {
      this.openRandom()
      console.log('========================> RANDOM')
    }
  }

  openRandom () {
    this.open(this.available[Math.floor(Math.random() * this.available.length)])
  }
}

Bot.MODE = {
  FAST: 1000,
  MANUAL: -1,
  NORMAL: 2000,
  SLOW: 4000
}

export default Bot
