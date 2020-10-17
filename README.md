# minefield-js

This is a javascript implementation of the classic minefield game. The objective of this project is to offer a complete implementation of all the logic of the game.

With a simple implementation, you will have the ability to implement the game interface without worrying about logic, rules, blocks, checks, in short.

## How to use

First, you want to understand the implementation.

### Using project
Minefield project has no explicit constructor, this implementation allows the methods, classes, properties and state of the game to be safe from external access. Keeping your game data completely safe.

**Class structure**
```js
const Minefield = {
    getInstance: function (options = { rows, cols, mines, debug }) => {},
    CHECKERS: { EMPTY, FLAG, MINE, NUMBER_0, NUMBER_1, NUMBER_2, NUMBER_3, NUMBER_4, NUMBER_5, NUMBER_6, NUMBER_7, NUMBER_8 },
    DEFAULTS: { EASY, MEDIUM, HARD },
    EVENTS: { ALL, START, NEXT_TURN, FINISH },
    STATUS: { LOSS, PLAYING, WIN }
}

// Game instance structure Minefield.getInstance()
const instance = {
    addListener: (event, fn) => {},
    start: () => game.start(),
    open: (x, y) => game.open(x, y),
    flag: (x, y) => game.flag(x, y),
    batch: (payload) => game.batch(payload),
    getState: () => game.getState(),
    reset: () => game.start()
}
```

## Examples
```js
//Make minefield instance
const minefield = Minefield.getInstance({
    rows: 10,
    cols: 10,
    mines: 10
})

// Add event listeners
minefield.addListener(minefield.START, (state) => {})
minefield.addListener(minefield.NEXT_TURN, (state) => {})
minefield.addListener(minefield.FINISH, (state) => {})

// Outher listener format
minefield.addListener(minefield.ALL, (data = { event, state }) => {})

// Starting application
minefield.start()

// Make flag checker
minefield.flag(row, cow) // toggle action

// Open a checker
minefield.open(row, cow)

// Open or make flag to many checker
minefield.batck([
    { row, cow },
    { row, cow, flag: true }
])
```

**Options**
```js
// Example 1: No parameter
// Use Minefield.DEFAULTS.MEDIUM by default
Minefield.getInstance()

// Example 2: Complete options
Minefield.getInstance({
    rows: 10,
    cols: 10,
    mines: 10,
    debug: true // default false
})

// Example 3: Using Defaults
Minefield.getInstance(Minefield.DEFAULTS.EASY)

// Example 4: Using Defaults + attributes
Minefield.getInstance({
    ...Minefield.DEFAULTS.HARD,
    debug: true
})
```

**Gameplay**
```js
function play(event, state) {
    switch (event) {
        case Minefield.EVENTS.START:
        case Minefield.EVENTS.NEXT_TURN:
            // game.flag(x, y)
            // game.open(x, y)
            break;
        case Minefield.EVENTS.FINISH:
            // check game status (state.status)
            break;
    }
}

const game = Minefield.getInstance()

game.addListener(minefield.ALL, play)
game..play()

```
**State**
```js
{
    rows: 10,
    cols: 10,
    mines: 10,
    total: 100,
    status: PLAYING, // LOSS | PLAYING | WIN
    checked: 0,
    updated: [],
    board: [['']], // Array(rows)(cols)
    debug: { board: [['']] } //only added when debug is enabled
}
```

## Running example project

Into src-example you can run a single implementation example.

Run this command sequence

```shell
npm install
npm start
```
