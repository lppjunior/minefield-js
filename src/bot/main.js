import Bot from './Bot'
import * as Constants from './constants'

export function getInstance (options) {
  const bot = new Bot(options)

  return {
    run: () => bot.run(),
    stop: () => bot.stop(),
    setSpeed: (speed) => { bot.speed = speed },
    setProcess: (process) => { bot.process = process }
  }
}

export const SPEED = Constants.SPEED
export const PROCESS = Constants.PROCESS

export default {
  getInstance
}
