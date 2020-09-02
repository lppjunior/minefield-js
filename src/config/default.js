const GLOBALS = {
  debug: false
}

const makeLevel = amount => ({
  cols: amount,
  rows: amount,
  mines: amount
})

export const DEFAULTS = {
  EASY: {
    ...GLOBALS,
    ...makeLevel(10)
  },

  MEDIUM: {
    ...GLOBALS,
    ...makeLevel(2)
  },

  HARD: {
    ...GLOBALS,
    ...makeLevel(30)
  }
}
