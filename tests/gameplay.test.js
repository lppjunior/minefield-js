import { Minefield } from '../src'

describe('Minefield gameplay', () => {
  describe('Test flag', () => {
    const instance = Minefield.getInstance(Minefield.DEFAULTS.HARD).start()

    instance.flag(0, 0)
    instance.getState().board.forEach((cols, row) => {
      cols.forEach((value, col) => {
        instance.flag(row, col)
        instance.flag(row, col)
        instance.open(row, col)
      })
    })
    instance.flag(0, 0)
  })

  describe('Test win', () => {
    const instance = Minefield.getInstance({
      ...Minefield.DEFAULTS.HARD,
      debug: true
    }).start()

    instance.getState().debug.board.forEach((cols, row) => {
      cols.forEach((value, col) => {
        if (value !== Minefield.CHECKER.MINE) {
          instance.flag(row, col)
          instance.open(row, col)
          instance.flag(row, col)
          instance.open(row, col)
          instance.open(row, col)
        }
      })
    })
    instance.open(0, 0)

    test('should assert gameStatus is WIN', () => {
      expect(instance.getState().status).toEqual(Minefield.STATUS.WIN)
    })
  })

  describe('Test loss', () => {
    const instance = Minefield.getInstance({
      ...Minefield.DEFAULTS.HARD,
      debug: true
    }).start()

    instance.getState().debug.board.forEach((cols, row) => {
      cols.forEach((value, col) => {
        if (value === Minefield.CHECKER.MINE) {
          instance.open(row, col)
        }
      })
    })
    instance.open(0, 0)

    test('should assert gameStatus is LOSS', () => {
      expect(instance.getState().status).toEqual(Minefield.STATUS.LOSS)
    })
  })
})
