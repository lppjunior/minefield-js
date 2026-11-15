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

  describe('Safe first move', () => {
    test('moves a mine away from the first opened cell', () => {
      const random = jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.5)
        .mockReturnValue(0.9)
      const instance = Minefield.getInstance({
        rows: 3,
        cols: 3,
        mines: 1,
        safeFirstClick: true,
        debug: true
      }).start()

      try {
        instance.open(0, 0)

        expect(instance.getState().debug.board[0][0]).not.toEqual(Minefield.CHECKERS.MINE)
        expect(instance.getState().board[0][0]).not.toEqual(Minefield.CHECKERS.MINE)
      } finally {
        random.mockRestore()
      }
    })
  })

  describe('Chord open', () => {
    test('opens neighboring cells when the adjacent flag count matches the number', () => {
      const instance = Minefield.getInstance({
        mock: '[[-1, 1, 0], [1, 1, 0], [0, 0, 0]]'
      }).start()

      instance.open(1, 1)
      instance.flag(0, 0)
      instance.chord(1, 1)

      expect(instance.getState().status).toEqual(Minefield.STATUS.WIN)
      expect(instance.getState().checked).toEqual(8)
    })

    test('loses when a chord opens a mine after other safe neighbors', () => {
      const instance = Minefield.getInstance({
        mock: '[[0, 1, -1], [0, 1, 1], [0, 0, 0]]'
      }).start()

      instance.open(1, 1)
      instance.flag(2, 2)
      instance.chord(1, 1)

      expect(instance.getState().status).toEqual(Minefield.STATUS.LOSS)
      expect(instance.getState().lastUpdate.some(update => update.value === Minefield.CHECKERS.MINE)).toBe(true)
    })
  })
})
