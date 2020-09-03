import * as CONFIG from './constants'
import { Minefield } from './core'

export function getInstance (options = CONFIG.DEFAULTS.MEDIUM ) {
  const game = new Minefield(options)

  const instance = {
    addListener: (event, fn) => {
      game.addListener(event, fn)

      return instance
    },
    start: () => game.start(),
    open: (x, y) => game.open(x, y),
    flag: (x, y) => game.flag(x, y),
    getState: () => game.state,
    reset: () => game.start(),

    STATUS: CONFIG.STATUS,
    ...CONFIG.EVENT
  }

  return instance
}

export const DEFAULTS = CONFIG.DEFAULTS

export default {
  DEFAULTS: CONFIG.DEFAULTS,
  getInstance
}
