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
    getState: () => game.getState(),
    reset: () => game.start(),

    STATUS: CONFIG.STATUS,
    ...CONFIG.EVENT
  }

  return instance
}

export const DEFAULTS = CONFIG.DEFAULTS
export const CHECKER = CONFIG.CHECKER
export const STATUS = CONFIG.STATUS

export default {
  getInstance
}
