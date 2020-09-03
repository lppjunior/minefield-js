class MinefieldController {
  constructor (game) {
    game
      .addListener(game.START, (data) => this.start(data))
      .addListener(game.NEXT_TURN, (data) => this.nextTurn(data))
      .addListener(game.FINISH, (data) => this.finish(data))
      .start()

    this.STATUS = game.STATUS

    this.click = (event) => {
      event = event || window.event

      const { x, y } = event.target.dataset
      const action = event.type === 'click' ? 'open' : 'flag'

      game[action](parseInt(x), parseInt(y))
      event.preventDefault()
    }
  }

  start(state) {
    this.board = state.debug.board
    this.state = state
    this.log()

    this.mountBoard()
  }

  mountBoard() {
    const classes = {
      '': 'closed',
      'X': 'oppened',
      'F': 'flag',
      '-1': 'mine',
      '0': 'number number-0',
      '1': 'number number-1',
      '2': 'number number-2',
      '3': 'number number-3',
      '4': 'number number-4',
      '5': 'number number-5',
      '6': 'number number-6',
      '7': 'number number-7',
      '8': 'number number-8'
    }

    const lines = this.state.board.map((line, i) => {
      return `<tr>${
        line.map((value, j) => `<td data-x='${i}' data-y='${j}' class='${classes[value]}'>${this.board[i][j]}</td>`).join('')
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
    console.log('NEXT_TURN Update!!!')
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
