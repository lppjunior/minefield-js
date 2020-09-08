import Bot from './Bot'
import * as Constants from './constants'

export function getInstance (options) {
  const bot = new Bot(options)

  return {
    play: () => bot.play(),
    stop: () => bot.stop(),
    setSpeed: (speed) => { bot.speed = speed },
    setProcess: (process) => { bot.process = process },
    onFinish: (fn) => { bot.onFinish(fn) }
  }
}

export const SPEED = Constants.SPEED
export const PROCESS = Constants.PROCESS

export default {
  getInstance
}
