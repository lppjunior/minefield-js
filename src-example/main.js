'strict'

function run () {
  const minefield = Minefield.getInstance({
    ...Minefield.DEFAULTS.MEDIUM,
    debug: true
  })

  new MinefieldController(minefield)

  window.m = minefield
  // m.open(7, 7)
}

document.addEventListener('DOMContentLoaded', run, false)
