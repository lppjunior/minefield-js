import * as CONFIG from './core/constants'
import { Minefield } from './core'

export function getInstance (options = CONFIG.DEFAULTS.MEDIUM) {
  const game = new Minefield(options)

  const instance = {
    addListener: (event, fn) => {
      game.addListener(event, fn)

      return instance
    },
    start: () => game.start(),
    open: (x, y) => game.open(x, y),
    flag: (x, y) => game.flag(x, y),
    batch: (payload) => game.batch(payload),
    getState: () => game.getState(),
    reset: () => game.start()
  }

  return instance
}

export const CHECKERS = CONFIG.CHECKERS
export const DEFAULTS = CONFIG.DEFAULTS
export const EVENTS = CONFIG.EVENTS
export const STATUS = CONFIG.STATUS

export default {
  getInstance
}
