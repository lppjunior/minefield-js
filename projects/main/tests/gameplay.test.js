import { Minefield } from '../src'
import { CHECKERS } from '../src/core/constants'

describe('Minefield gameplay', () => {
  describe('Test open batch', () => {
    const instance = Minefield.getInstance(Minefield.DEFAULTS.HARD).start()
    instance.batch([{ col: 0, row: 0 }, { col: 1, row: 1, type: CHECKERS.FLAG }])
  })

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
        if (value !== Minefield.CHECKERS.MINE) {
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
        if (value === Minefield.CHECKERS.MINE) {
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
