const GLOBALS = {
  debug: false
}

export const DEFAULTS = {
  EASY: {
    ...GLOBALS,
    cols: 10,
    rows: 10,
    mines: 10
  },

  MEDIUM: {
    ...GLOBALS,
    cols: 15,
    rows: 5,
    mines: 15
  },

  HARD: {
    ...GLOBALS,
    cols: 30,
    rows: 30,
    mines: 30
  }
}
