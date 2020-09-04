import * as Minefield from '../../main'

export default {
  calculateNextList: function () {
    this.addFlag()
    this.addOpen()
    this.addRand()
    this.removeDuplication()
  },

  addFlag: function () {
    Object
    .keys(Minefield.CHECKERS)
    .filter((key) => ![
        Minefield.CHECKERS.EMPTY,
        Minefield.CHECKERS.FLAG
      ].includes(Minefield.CHECKERS[key])
    ).forEach((key) => {
      this.boardMap[Minefield.CHECKERS[key]].forEach(checker => {
        if (checker.value === checker.around[Minefield.CHECKERS.EMPTY].length + checker.around[Minefield.CHECKERS.FLAG].length) {
          const itens = checker.around[Minefield.CHECKERS.EMPTY]
          itens.forEach(item => {
            item.type = Minefield.CHECKERS.FLAG
          })

          this.nextList = [...this.nextList, ...itens]
        }
      })
    })

    console.warn('ADD FLAG', this.nextList.length)

  },

  addOpen: function () {
    Object
    .keys(Minefield.CHECKERS)
    .filter((key) => ![
        Minefield.CHECKERS.EMPTY,
        Minefield.CHECKERS.FLAG
      ].includes(Minefield.CHECKERS[key])
    ).forEach((key) => {
      this.boardMap[Minefield.CHECKERS[key]].forEach(checker => {
        if (checker.value === checker.around[Minefield.CHECKERS.FLAG].length) {
          const itens = checker.around[Minefield.CHECKERS.EMPTY]
          itens.forEach(item => {
            item.origin = 'ADD_OPEN'
          })

          this.nextList = [...this.nextList, ...itens]
        }
      })
    })

    console.warn('ADD OPEN', this.nextList.length)
  },

  addRand: function () {
    if (this.state.checked === 0 || this.nextList.length === 0) {
      const rand = (size) => Math.floor(Math.random() * size)
      const emptyCheckers = this.boardMap[Minefield.CHECKERS.EMPTY]
      const checker = { origin: 'RANDOM', ...emptyCheckers[rand(emptyCheckers.length)]}
      this.nextList.push(checker)
      console.warn('ADD RANDOMIC PLAYER', this.nextList.length)
    }
  },

  removeDuplication: function () {
    this.nextList = this.nextList.filter((checker, i) => {
      for (let j = i + 1; j < this.nextList.length; j++) {
        if (checker.row === this.nextList[j].row && checker.col === this.nextList[j].col) {
          return false
        }
      }

      return true
    })
  }
}
