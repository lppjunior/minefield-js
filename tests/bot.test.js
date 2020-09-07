import { Bot } from '../src'

describe('Minefield Bot', () => {
  describe('Test existance of all public methods and attributes', () => {
    test('should assert than Bot has been defined', () => {
      expect(Bot).toBeDefined()
    })

    describe('Test existance of Bot.MODE', () => {
      test('should assert than Bot.MODE has been defined', () => {
        expect(Bot.MODE).toBeDefined()
      })

      test('should assert than Bot.MODE.FAST has been defined', () => {
        expect(Bot.MODE.FAST).toBeDefined()
      })

      test('should assert than Bot.MODE.MANUAL has been defined', () => {
        expect(Bot.MODE.MANUAL).toBeDefined()
      })

      test('should assert than Bot.MODE.SLOW has been defined', () => {
        expect(Bot.MODE.SLOW).toBeDefined()
      })
    })
  })
})
