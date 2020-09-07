import {
  Bot,
  Minefield
} from '../src'

describe('Minefield Bot', () => {
  describe('Test existance of all public methods and attributes', () => {
    test('should assert than Bot has been defined', () => {
      expect(Bot).toBeDefined()
    })

    describe('Test existance of Bot.SPEED', () => {
      test('should assert than Bot.SPEED has been defined', () => {
        expect(Bot.SPEED).toBeDefined()
      })

      test('should assert than Bot.SPEED.NONE has been defined', () => {
        expect(Bot.SPEED.NONE).toBeDefined()
      })

      test('should assert than Bot.SPEED.FAST has been defined', () => {
        expect(Bot.SPEED.FAST).toBeDefined()
      })

      test('should assert than Bot.SPEED.NORMAL has been defined', () => {
        expect(Bot.SPEED.NORMAL).toBeDefined()
      })

      test('should assert than Bot.SPEED.SLOW has been defined', () => {
        expect(Bot.SPEED.SLOW).toBeDefined()
      })
    })

    describe('Test existance of Bot.PROCESS', () => {
      test('should assert than Bot.PROCESS has been defined', () => {
        expect(Bot.PROCESS).toBeDefined()
      })

      test('should assert than Bot.PROCESS.BATCH has been defined', () => {
        expect(Bot.PROCESS.BATCH).toBeDefined()
      })

      test('should assert than Bot.PROCESS.UNIT has been defined', () => {
        expect(Bot.PROCESS.UNIT).toBeDefined()
      })
    })

    describe('Test existance of Bot.getInstance', () => {
      test('should assert than Bot.getInstance has been defined', () => {
        expect(Bot.getInstance).toBeDefined()
      })
    })

    describe('Test Bot.getInstance() calling all methods', () => {
      describe('Test existance of Bot.getInstance', () => {
        test('should assert than Bot.getInstance has been defined', () => {
          expect(Bot.getInstance).toBeDefined()
        })

        jest.spyOn(Bot, 'getInstance')
        const game = Minefield.getInstance(Minefield.DEFAULTS.HARD)
        const instance = Bot.getInstance({
          game,
          process: Bot.PROCESS.UNIT,
          speed: 200
        })

        test('should assert method Bot.getInstance was called', () => {
          expect(Bot.getInstance).toHaveBeenCalled()
        })

        test('should assert method instance.play was called', () => {
          jest.spyOn(instance, 'play')
          instance.play()
          expect(instance.play).toHaveBeenCalled()
        })

        test('should assert method instance.stop was called', () => {
          jest.spyOn(instance, 'stop')
          instance.stop()
          expect(instance.stop).toHaveBeenCalled()
        })

        test('should assert method instance.setProcess was called', () => {
          jest.spyOn(instance, 'setProcess')
          instance.setProcess(Bot.PROCESS.UNIT)
          expect(instance.setProcess).toHaveBeenCalled()
        })

        test('should assert method instance.setSpeed was called', () => {
          jest.spyOn(instance, 'setSpeed')
          instance.setSpeed(50)
          expect(instance.setSpeed).toHaveBeenCalled()
        })

        test('should assert method instance.onFinish was called', () => {
          jest.spyOn(instance, 'onFinish')
          instance.onFinish(() => {})
          expect(instance.onFinish).toHaveBeenCalled()
        })

        game.start()
      })
    })

    describe('Test GamePlay', () => {
      Object.keys({
        ...Minefield.DEFAULTS,
        PERSONALIZED: {
          rows: 100,
          cols: 100,
          mines: 300
        }
      }).forEach(key => {
        describe(`Test ${key} Minefield mode`, () => {
          Object.keys(Bot.PROCESS).forEach(processKey => {
            const speed = (Bot.PROCESS[processKey] === Bot.PROCESS.UNIT) ? Bot.SPEED.NONE : 10

            describe(`Test ${processKey} bot mode`, () => {
              test(`should assert Bot can play a complete ${key} game`, () => {
                const game = Minefield.getInstance(Minefield.DEFAULTS[key])
                const bot = Bot.getInstance({ game, process: Bot.PROCESS[processKey], speed })

                game.start()

                if (Bot.PROCESS[processKey] === Bot.PROCESS.UNIT) {
                  do {
                    bot.play()
                  } while (game.getState().status === Minefield.STATUS.PLAYING)
                } else {
                  console.log(speed, processKey)
                }
              })

              test(`should assert Bot can WIN a ${key} game`, () => {
                const game = Minefield.getInstance(Minefield.DEFAULTS[key])

                const bot = Bot.getInstance({ game, process: Bot.PROCESS[processKey], speed })
                bot.onFinish((result) => {
                  if (result === Minefield.STATUS.LOSS) {
                    game.reset()
                  } else {
                    expect(result).toEqual(Minefield.STATUS.WIN)
                  }
                })

                game.start()

                if (Bot.PROCESS[processKey] === Bot.PROCESS.UNIT) {
                  do {
                    bot.play()
                  } while (game.getState().status === Minefield.STATUS.PLAYING)
                }
              })

              test(`should assert Bot can LOSS a ${key} game`, () => {
                const game = Minefield.getInstance(Minefield.DEFAULTS[key])

                const bot = Bot.getInstance({ game, process: Bot.PROCESS[processKey], speed })

                bot.onFinish((result) => {
                  if (result === Minefield.STATUS.WIN) {
                    game.reset()
                  } else {
                    expect(result).toEqual(Minefield.STATUS.LOSS)
                  }
                })

                game.start()

                if (Bot.PROCESS[processKey] === Bot.PROCESS.UNIT) {
                  do {
                    bot.play()
                  } while (game.getState().status === Minefield.STATUS.PLAYING)
                }
              })
            })
          })
        })
      })
    })
  })
})
