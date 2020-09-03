'strict'

function run () {
  const minefield = Minefield.getInstance(Minefield.DEFAULTS.MEDIUM)

  new MinefieldController(minefield)
}

document.addEventListener('DOMContentLoaded', run, false)
