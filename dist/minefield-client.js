class MinefieldController {
  constructor (game) {
    this.EVENTS = Minefield.EVENTS
    this.STATUS = Minefield.STATUS

    game
      .addListener(this.EVENTS.START, (data) => this.start(data))
      .addListener(this.EVENTS.NEXT_TURN, (data) => this.nextTurn(data))
      .addListener(this.EVENTS.FINISH, (data) => this.finish(data))
      .addListener(this.EVENTS.ALL, (data = { event, state }) => { console.log('EVENT.ALL > ', data) })
      .start()

    this.click = (event) => {
      event = event || window.event

      const { x, y } = event.target.dataset
      const action = event.type === 'click' ? 'open' : 'flag'

      game[action](parseInt(x), parseInt(y))
      event.preventDefault()
    }
  }

  start(state) {
    // this.board = state.debug.board
    this.state = state
    this.log()

    this.mountBoard()
  }

  mountBoard() {
    const classes = {
      '': 'closed',
      'F': 'openned flag',
      '-1': 'openned mine',
      '0': 'openned number number-0',
      '1': 'openned number number-1',
      '2': 'openned number number-2',
      '3': 'openned number number-3',
      '4': 'openned number number-4',
      '5': 'openned number number-5',
      '6': 'openned number number-6',
      '7': 'openned number number-7',
      '8': 'openned number number-8'
    }

    const lines = this.state.board.map((line, i) => {
      return `<tr>${
        // line.map((value, j) => `<td data-x='${i}' data-y='${j}' class='${classes[value]}'>${value === '' ? this.board[i][j] : ''}</td>`).join('')
        line.map((value, j) => `<td data-x='${i}' data-y='${j}' class='${classes[value]}'></td>`).join('')
      }</tr>`
    }).join('')

    var game = document.getElementById('game')

    var child = document.createElement('div')
    child.innerHTML = `<table>${lines}</table>`
    child = child.firstChild

    if(game.firstChild !== null)
      game.removeChild(game.firstChild)

    game.appendChild(child)

    const elements = document.getElementsByTagName('td')
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', (e) => this.click(e), false)
      elements[i].addEventListener('contextmenu', (e) => this.click(e), false)
    }
  }

  nextTurn(state) {
    this.state = state
    this.mountBoard()
    this.log()
  }

  finish(state) {
    this.state = state

    console.error('Finish', state.status, state)
    this.mountBoard()
    this.log()
  }

  log () {
    console.log(this.state)
    console.log(JSON.stringify(this.state))
  }
}
