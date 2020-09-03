import { Minefield } from '../src'

describe('Minefield', () => {
  describe('Test existance of all public methods and attributes', () => {
    test('should assert than Minefield has been defined', () => {
      expect(Minefield).toBeDefined()
    })
    describe('Test existance of CHECKER', () => {
      test('should assert than Minefield.CHECKER has been defined', () => {
        expect(Minefield.CHECKER).toBeDefined()
      })
    })

    describe('Test existance of all DEFAULTS', () => {
      test('should assert than Minefield.DEFAULTS has been defined', () => {
        expect(Minefield.DEFAULTS).toBeDefined()
      })

      test('should assert than DEFAULTS.EASY has been defined', () => {
        expect(Minefield.DEFAULTS.EASY).toBeDefined()
      })

      test('should assert than DEFAULTS.MEDIUM has been defined', () => {
        expect(Minefield.DEFAULTS.MEDIUM).toBeDefined()
      })

      test('should assert than DEFAULTS.HARD has been defined', () => {
        expect(Minefield.DEFAULTS.HARD).toBeDefined()
      })
    })

    describe('Test existance getInstance properties and methods', () => {
      test('should assert than Minefield.getInstance has been defined', () => {
        expect(Minefield.getInstance).toBeDefined()
      })

      const minefieldInstance = Minefield.getInstance()

      test('should assert than minefieldInstance.addListener has been defined', () => {
        expect(minefieldInstance.addListener).toBeDefined()
      })

      test('should assert than minefieldInstance.start has been defined', () => {
        expect(minefieldInstance.start).toBeDefined()
      })

      test('should assert than minefieldInstance.open has been defined', () => {
        expect(minefieldInstance.open).toBeDefined()
      })

      test('should assert than minefieldInstance.flag has been defined', () => {
        expect(minefieldInstance.flag).toBeDefined()
      })

      test('should assert than minefieldInstance.getState has been defined', () => {
        expect(minefieldInstance.getState).toBeDefined()
      })

      test('should assert than minefieldInstance.reset has been defined', () => {
        expect(minefieldInstance.reset).toBeDefined()
      })

      describe('Test existance of all minefieldInstance.STATUS', () => {
        test('should assert than minefieldInstance.STATUS.LOSS has been defined', () => {
          expect(minefieldInstance.STATUS.LOSS).toBeDefined()
        })

        test('should assert than minefieldInstance.STATUS.PLAYING has been defined', () => {
          expect(minefieldInstance.STATUS.PLAYING).toBeDefined()
        })

        test('should assert than minefieldInstance.STATUS.WIN has been defined', () => {
          expect(minefieldInstance.STATUS.WIN).toBeDefined()
        })
      })

      describe('Test existance of all minefieldInstance EVENTS', () => {
        test('should assert than minefieldInstance.START has been defined', () => {
          expect(minefieldInstance.START).toBeDefined()
        })

        test('should assert than minefieldInstance.NEXT_TURN has been defined', () => {
          expect(minefieldInstance.NEXT_TURN).toBeDefined()
        })

        test('should assert than minefieldInstance.FINISH has been defined', () => {
          expect(minefieldInstance.FINISH).toBeDefined()
        })
      })
    })
  })

  describe('Test Minefield.getInstance() calling all methods', () => {
    jest.spyOn(Minefield, 'getInstance')
    const instance = Minefield.getInstance()

    test('should assert method Minefield.getInstance was called', () => {
      expect(Minefield.getInstance).toHaveBeenCalled()
    })

    test('should assert method instance.addListener was called', () => {
      jest.spyOn(instance, 'addListener')
      instance.addListener(instance.START, () => {})
      expect(instance.addListener).toHaveBeenCalled()
    })

    test('should assert method instance.start was called', () => {
      jest.spyOn(instance, 'start')
      instance.start()
      expect(instance.start).toHaveBeenCalled()
    })

    test('should assert method instance.open was called', () => {
      jest.spyOn(instance, 'open')
      instance.open(0, 0)
      expect(instance.open).toHaveBeenCalled()
    })

    test('should assert method instance.flag was called', () => {
      jest.spyOn(instance, 'flag')
      instance.flag(0, 1)
      expect(instance.flag).toHaveBeenCalled()
    })

    test('should assert method instance.getState was called', () => {
      jest.spyOn(instance, 'getState')
      instance.getState()
      expect(instance.getState).toHaveBeenCalled()
    })

    test('should assert method instance.reset was called', () => {
      jest.spyOn(instance, 'reset')
      instance.reset()
      expect(instance.reset).toHaveBeenCalled()
    })
  })
})
