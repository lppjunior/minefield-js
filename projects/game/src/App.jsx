import React, { useEffect, useRef, useState } from 'react'
import { Minefield } from '@minefield/main'
import { getFullscreenSize, MAX_DIMENSION } from './fullscreen.mjs'

const HISTORY_KEY = 'minefield.results.v1'
const MAX_HISTORY = 50

const SIZES = [
  { key: 'small', label: 'Pequeno', rows: 9, cols: 9 },
  { key: 'medium', label: 'Médio', rows: 16, cols: 16 },
  { key: 'large', label: 'Grande', rows: 16, cols: 30 },
  { key: 'fullscreen', label: 'Tela inteira' },
  { key: 'custom', label: 'Personalizado' }
]

const DIFFICULTIES = [
  { key: 'easy', label: 'Fácil', percent: 10 },
  { key: 'normal', label: 'Normal', percent: 15 },
  { key: 'hard', label: 'Difícil', percent: 20 },
  { key: 'insane', label: 'Insano', percent: 25 }
]

function clamp (value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getViewport () {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function getMineCount (rows, cols, percent) {
  const total = rows * cols
  return clamp(Math.round(total * percent / 100), 1, total - 1)
}

function formatTime (seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

function formatCounter (value) {
  return value < 0
    ? `-${String(Math.abs(value)).padStart(2, '0')}`
    : String(value).padStart(3, '0')
}

function cellKey (row, col) {
  return `${row},${col}`
}

function parseCellKey (key) {
  return key.split(',').map(Number)
}

function snapshot (state) {
  return {
    ...state,
    board: state.board.map(row => [...row]),
    lastUpdate: state.lastUpdate.map(update => ({ ...update }))
  }
}

function loadHistory () {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY)
    if (!stored) return []

    const history = JSON.parse(stored)
    if (!Array.isArray(history)) {
      throw new TypeError('Saved game history must be an array.')
    }

    return history.slice(0, MAX_HISTORY)
  } catch (error) {
    console.error('Unable to load saved minefield results.', error)
    return []
  }
}

function saveHistory (history) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Unable to save minefield results.', error)
  }
}

function MineLogo () {
  return (
    <svg aria-hidden='true' className='mine-logo' viewBox='0 0 40 40'>
      <rect height='40' rx='9' width='40' />
      <path d='M20 5v5m-8 6-2-2m20 0-2 2m-19 8-2 1m24-1 2 1m-13 9v-3' />
      <circle cx='20' cy='22' r='7' />
      <path d='m19 16 3-5' />
      <circle className='mine-logo-fuse' cx='23' cy='10' r='2' />
    </svg>
  )
}

function App () {
  const [screen, setScreen] = useState('menu')
  const [sizeKey, setSizeKey] = useState('medium')
  const [difficultyKey, setDifficultyKey] = useState('normal')
  const [customRows, setCustomRows] = useState('16')
  const [customCols, setCustomCols] = useState('16')
  const [menuError, setMenuError] = useState('')
  const [viewport, setViewport] = useState(getViewport)
  const [config, setConfig] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const [flaggedCells, setFlaggedCells] = useState(() => new Set())
  const [finishedRecord, setFinishedRecord] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const [cellSize, setCellSize] = useState(24)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const gameRef = useRef(null)
  const startingRef = useRef(false)
  const secondsRef = useRef(0)
  const clicksRef = useRef(0)
  const flaggedCellsRef = useRef(new Set())
  const finishedRef = useRef(false)
  const boardAreaRef = useRef(null)
  const longPressTimerRef = useRef(null)
  const longPressHandledRef = useRef(false)
  const suppressContextMenuUntilRef = useRef(0)

  useEffect(() => {
    const updateViewport = () => setViewport(getViewport())
    window.addEventListener('resize', updateViewport)
    window.visualViewport?.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.visualViewport?.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(() => {
    const updateFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', updateFullscreen)

    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  const sizeOption = SIZES.find(item => item.key === sizeKey)
  const difficulty = DIFFICULTIES.find(item => item.key === difficultyKey)
  const fullscreenSize = getFullscreenSize(viewport.width, viewport.height)
  const rows = sizeKey === 'custom'
    ? Number(customRows)
    : sizeKey === 'fullscreen'
      ? fullscreenSize.rows
      : sizeOption.rows
  const cols = sizeKey === 'custom'
    ? Number(customCols)
    : sizeKey === 'fullscreen'
      ? fullscreenSize.cols
      : sizeOption.cols
  const validDimensions = Number.isInteger(rows) && rows >= 5 && rows <= MAX_DIMENSION &&
    Number.isInteger(cols) && cols >= 5 && cols <= MAX_DIMENSION
  const previewMines = validDimensions
    ? getMineCount(rows, cols, difficulty.percent)
    : 0
  const canStart = validDimensions && previewMines < rows * cols
  const wins = history.filter(record => record.result === 'win')
  const bestTime = wins.reduce((best, record) => (
    best === null || record.elapsedSeconds < best ? record.elapsedSeconds : best
  ), null)

  useEffect(() => {
    if (screen !== 'game' || !config) return undefined

    const game = Minefield.getInstance({ ...config, safeFirstClick: true })
    gameRef.current = game

    game.addListener(Minefield.EVENTS.ALL, ({ event, state }) => {
      setGameState(snapshot(state))

      if (event === Minefield.EVENTS.START) {
        secondsRef.current = 0
        clicksRef.current = 0
        flaggedCellsRef.current = new Set()
        finishedRef.current = false
        setSeconds(0)
        setStarted(false)
        setFlagMode(false)
        setFlaggedCells(new Set())
        setFinishedRecord(null)
      }

      if (event === Minefield.EVENTS.FINISH && !finishedRef.current) {
        finishedRef.current = true
        setStarted(false)
        setFlagMode(false)

        const flagged = Array.from(flaggedCellsRef.current)
        const correctFlagCells = flagged.filter(key => {
          const [row, col] = parseCellKey(key)
          return state.board[row][col] === Minefield.CHECKERS.MINE
        })
        const wrongFlagCells = flagged.filter(key => !correctFlagCells.includes(key))
        const exploded = state.lastUpdate.find(update => update.value === Minefield.CHECKERS.MINE)
        const record = {
          id: `${Date.now()}-${clicksRef.current}`,
          result: state.status === Minefield.STATUS.WIN ? 'win' : 'loss',
          completedAt: new Date().toISOString(),
          rows: config.rows,
          cols: config.cols,
          mines: config.mines,
          difficulty: config.difficulty,
          elapsedSeconds: secondsRef.current,
          clicks: clicksRef.current,
          openedCells: state.checked,
          correctFlags: correctFlagCells.length,
          wrongFlags: wrongFlagCells.length,
          correctFlagCells,
          wrongFlagCells,
          explodedCell: exploded ? { row: exploded.row, col: exploded.col } : null
        }

        setFinishedRecord(record)
        setHistory(current => {
          const updated = [record, ...current].slice(0, MAX_HISTORY)
          saveHistory(updated)
          return updated
        })
      }
    })

    game.start()

    return () => {
      if (gameRef.current === game) gameRef.current = null
    }
  }, [screen, config])

  useEffect(() => {
    if (screen !== 'game' || config?.size !== 'fullscreen' || !gameState || clicksRef.current > 0) return

    const size = getFullscreenSize(window.innerWidth, window.innerHeight)
    if (size.rows !== config.rows || size.cols !== config.cols) {
      setConfig(current => ({
        ...current,
        ...size,
        mines: getMineCount(size.rows, size.cols, current.difficultyPercent)
      }))
    }
  }, [screen, config, gameState, viewport])

  useEffect(() => {
    if (screen !== 'game' || !started || gameState?.status !== Minefield.STATUS.PLAYING) {
      return undefined
    }

    const timer = window.setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [screen, started, gameState?.status])

  useEffect(() => {
    if (screen !== 'game' || !gameState || !boardAreaRef.current) return undefined

    const updateCellSize = () => {
      const area = boardAreaRef.current
      if (!area) return

      const gap = 1
      const availableWidth = area.clientWidth - 12 - (gameState.cols - 1) * gap
      const availableHeight = area.clientHeight - 12 - (gameState.rows - 1) * gap
      const fittedSize = Math.floor(Math.min(
        availableWidth / gameState.cols,
        availableHeight / gameState.rows,
        config.size === 'fullscreen' ? Infinity : 48
      ))
      setCellSize(Math.max(10, fittedSize))
    }

    updateCellSize()
    const observer = typeof window.ResizeObserver === 'undefined'
      ? null
      : new window.ResizeObserver(updateCellSize)
    observer?.observe(boardAreaRef.current)
    window.addEventListener('resize', updateCellSize)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateCellSize)
    }
  }, [screen, config, gameState?.rows, gameState?.cols])

  async function startGame () {
    if (startingRef.current) return
    if (!canStart) {
      setMenuError(`As dimensões precisam estar entre 5 e ${MAX_DIMENSION}.`)
      return
    }

    startingRef.current = true
    setMenuError('')
    setFullscreenError('')
    let gameRows = rows
    let gameCols = cols
    if (sizeKey === 'fullscreen') {
      try {
        await enterFullscreen()
      } catch (error) {
        console.error('Unable to activate fullscreen mode.', error)
        setFullscreenError('Tela inteira indisponível neste navegador.')
      }
      const size = getFullscreenSize(window.innerWidth, window.innerHeight)
      gameRows = size.rows
      gameCols = size.cols
    }

    setConfig({
      rows: gameRows,
      cols: gameCols,
      mines: getMineCount(gameRows, gameCols, difficulty.percent),
      difficulty: difficulty.key,
      difficultyPercent: difficulty.percent,
      size: sizeKey
    })
    setGameState(null)
    setScreen('game')
    startingRef.current = false
  }

  function performCellAction (row, col, action) {
    if (!gameState || gameState.status !== Minefield.STATUS.PLAYING || !gameRef.current) {
      return
    }

    clicksRef.current += 1
    setStarted(true)

    if (action === 'flag') {
      const current = new Set(flaggedCellsRef.current)
      const key = cellKey(row, col)
      if (gameState.board[row][col] === Minefield.CHECKERS.FLAG) {
        current.delete(key)
      } else if (gameState.board[row][col] === Minefield.CHECKERS.EMPTY) {
        current.add(key)
      }
      flaggedCellsRef.current = current
      setFlaggedCells(current)
      gameRef.current.flag(row, col)
    } else if (action === 'chord') {
      gameRef.current.chord(row, col)
    } else {
      gameRef.current.open(row, col)
    }
  }

  function handleCellClick (row, col) {
    if (longPressHandledRef.current) {
      longPressHandledRef.current = false
      return
    }

    const value = gameState.board[row][col]
    if (flagMode) {
      performCellAction(row, col, 'flag')
    } else if (value >= Minefield.CHECKERS.NUMBER_1 &&
      value <= Minefield.CHECKERS.NUMBER_8) {
      performCellAction(row, col, 'chord')
    } else {
      performCellAction(row, col, 'open')
    }
  }

  function handlePointerDown (event, row, col) {
    if (event.pointerType !== 'touch') return

    longPressHandledRef.current = false
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = window.setTimeout(() => {
      longPressHandledRef.current = true
      suppressContextMenuUntilRef.current = Date.now() + 1000
      performCellAction(row, col, 'flag')
    }, 500)
  }

  function clearLongPress () {
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function handleContextMenu (event, row, col) {
    event.preventDefault()
    if (Date.now() < suppressContextMenuUntilRef.current) return
    performCellAction(row, col, 'flag')
  }

  function restartGame () {
    gameRef.current?.reset()
  }

  function openMenu () {
    clearLongPress()
    setScreen('menu')
    setFlagMode(false)
  }

  async function enterFullscreen () {
    if (document.fullscreenElement) return
    if (!document.documentElement.requestFullscreen) {
      throw new Error('Fullscreen API is not supported.')
    }
    await document.documentElement.requestFullscreen()
  }

  async function toggleFullscreen () {
    setFullscreenError('')

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await enterFullscreen()
      }
    } catch (error) {
      console.error('Unable to toggle fullscreen mode.', error)
      setFullscreenError('Tela inteira indisponível neste navegador.')
    }
  }

  function getSizeDetails (item) {
    if (item.key === 'custom') {
      return `${customCols || 'x'} × ${customRows || 'y'}`
    }
    if (item.key === 'fullscreen') {
      return `${fullscreenSize.cols} × ${fullscreenSize.rows}`
    }
    return `${item.cols} × ${item.rows}`
  }

  if (screen === 'menu') {
    return (
      <main className='menu-screen'>
        <section aria-labelledby='menu-title' className='menu-card'>
          <div className='menu-brand'>
            <MineLogo />
            <div>
              <h1 id='menu-title'>CAMPO<span>MINADO</span></h1>
              <p>SMART EDITION</p>
            </div>
          </div>

          <fieldset className='menu-section'>
            <legend>TAMANHO</legend>
            <div className='size-options'>
              {SIZES.map(item => (
                <button
                  aria-pressed={sizeKey === item.key}
                  className={sizeKey === item.key ? 'size-option is-selected' : 'size-option'}
                  key={item.key}
                  onClick={() => {
                    setSizeKey(item.key)
                    setMenuError('')
                  }}
                  type='button'
                >
                  <strong>{item.label}</strong>
                  <small>{getSizeDetails(item)}</small>
                </button>
              ))}
            </div>
          </fieldset>

          {sizeKey === 'custom' && (
            <div className='custom-dimensions'>
              <label>
                Colunas (x)
                <input
                  max={MAX_DIMENSION}
                  min='5'
                  onChange={event => setCustomCols(event.target.value)}
                  type='number'
                  value={customCols}
                />
              </label>
              <span aria-hidden='true'>×</span>
              <label>
                Linhas (y)
                <input
                  max={MAX_DIMENSION}
                  min='5'
                  onChange={event => setCustomRows(event.target.value)}
                  type='number'
                  value={customRows}
                />
              </label>
            </div>
          )}

          <fieldset className='menu-section difficulty-section'>
            <legend>DIFICULDADE</legend>
            <div className='difficulty-options'>
              {DIFFICULTIES.map(item => (
                <button
                  aria-pressed={difficultyKey === item.key}
                  className={difficultyKey === item.key ? 'difficulty-option is-selected' : 'difficulty-option'}
                  key={item.key}
                  onClick={() => setDifficultyKey(item.key)}
                  type='button'
                >
                  <strong>{item.label}</strong>
                  <small>{item.percent}%</small>
                </button>
              ))}
            </div>
          </fieldset>

          <p aria-live='polite' className='mine-preview'>
            <strong>{canStart ? previewMines : '—'}</strong>
            {' minas em '}
            <span>{canStart ? rows * cols : '—'}</span>
            {' casas'}
          </p>
          {menuError && <p className='menu-error' role='alert'>{menuError}</p>}

          <button className='start-button' disabled={!canStart} onClick={startGame} type='button'>
            <span aria-hidden='true'>▷</span>
            NOVO JOGO
          </button>

          <section aria-label='Resumo das partidas' className='history-summary'>
            <h2>RESUMO DAS PARTIDAS</h2>
            <div className='summary-stats'>
              <div><small>Partidas</small><strong>{history.length}</strong></div>
              <div><small>Vitórias</small><strong>{wins.length}</strong></div>
              <div><small>Melhor tempo</small><strong>{bestTime === null ? '--:--' : formatTime(bestTime)}</strong></div>
            </div>
            {history.length > 0 && (
              <ul className='recent-games'>
                {history.slice(0, 3).map(record => (
                  <li key={record.id}>
                    <span className={record.result === 'win' ? 'result-dot is-win' : 'result-dot'} />
                    <span>{record.cols} × {record.rows}</span>
                    <strong>{record.result === 'win' ? 'Vitória' : 'Derrota'}</strong>
                    <time>{formatTime(record.elapsedSeconds)}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </main>
    )
  }

  const flaggedCount = flaggedCells.size
  const isFinished = Boolean(gameState && gameState.status !== Minefield.STATUS.PLAYING)
  const face = gameState?.status === Minefield.STATUS.WIN
    ? '😎'
    : gameState?.status === Minefield.STATUS.LOSS
      ? '😵'
      : '🙂'

  return (
    <main className='game-screen'>
      <header className='game-toolbar'>
        <div className='toolbar-start'>
          <button aria-label='Abrir menu' className='toolbar-button menu-button' onClick={openMenu} type='button'>
            <span aria-hidden='true'>☰</span>
          </button>
          <div className='toolbar-brand'>
            <span>CAMPO <strong>MINADO</strong></span>
            <small>{config.cols}×{config.rows}</small>
          </div>
        </div>

        <div className='toolbar-center'>
          <div aria-label={`${config.mines - flaggedCount} minas restantes`} className='toolbar-counter'>
            <span aria-hidden='true'>●</span>
            <strong>{formatCounter(config.mines - flaggedCount)}</strong>
          </div>
          <button
            aria-label='Reiniciar partida'
            className='face-button'
            onClick={restartGame}
            title='Reiniciar'
            type='button'
          >
            {face}
          </button>
          <time aria-label={`Tempo ${formatTime(seconds)}`} className='toolbar-timer'>
            {formatTime(seconds)}
          </time>
        </div>

        <div className='toolbar-actions'>
          <button
            aria-label={flagMode ? 'Desativar modo bandeira' : 'Ativar modo bandeira'}
            aria-pressed={flagMode}
            className={flagMode ? 'toolbar-button mobile-flag is-active' : 'toolbar-button mobile-flag'}
            onClick={() => setFlagMode(value => !value)}
            title='Modo bandeira'
            type='button'
          >
            <span aria-hidden='true'>⚑</span>
          </button>
          <button
            aria-label={fullscreen ? 'Sair da tela inteira' : 'Ativar tela inteira'}
            className='toolbar-button fullscreen-button'
            onClick={toggleFullscreen}
            title={fullscreen ? 'Sair da tela inteira' : 'Tela inteira'}
            type='button'
          >
            <span aria-hidden='true'>{fullscreen ? '⛶' : '⛶'}</span>
          </button>
        </div>
      </header>

      {fullscreenError && <p className='fullscreen-error' role='status'>{fullscreenError}</p>}

      <section
        aria-label={`Campo minado, ${config.cols} colunas por ${config.rows} linhas`}
        className='board-area'
        ref={boardAreaRef}
      >
        {gameState && (
          <div
            aria-label={`Tabuleiro ${gameState.rows} por ${gameState.cols}`}
            className='board'
            data-columns={gameState.cols}
            role='grid'
            style={{
              '--columns': gameState.cols,
              '--rows': gameState.rows,
              '--cell-size': `${cellSize}px`
            }}
          >
            {gameState.board.map((row, rowIndex) => row.map((value, colIndex) => {
              const key = cellKey(rowIndex, colIndex)
              const flagged = flaggedCells.has(key)
              const mine = value === Minefield.CHECKERS.MINE
              const open = typeof value === 'number' && value >= Minefield.CHECKERS.NUMBER_0
              const wrongFlag = isFinished && flagged && !mine
              const correctFlag = isFinished && flagged && mine
              const visibleMine = isFinished && mine && !flagged
              const exploded = finishedRecord?.explodedCell?.row === rowIndex &&
                finishedRecord?.explodedCell?.col === colIndex
              const classes = ['cell']

              classes.push(open && !flagged ? 'cell--open' : 'cell--closed')
              if (flagged) classes.push('cell--flagged')
              if (correctFlag) classes.push('cell--correct-flag')
              if (wrongFlag) classes.push('cell--wrong-flag')
              if (visibleMine) classes.push('cell--mine')
              if (exploded) classes.push('cell--exploded')
              if (open && value > 0) classes.push(`cell--number-${value}`)

              const label = wrongFlag
                ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, bandeira errada`
                : correctFlag
                  ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, bandeira correta`
                  : visibleMine
                    ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, ${exploded ? 'mina que explodiu' : 'mina'}`
                    : flagged
                      ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, bandeira`
                      : open
                        ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, ${value === 0 ? 'vazia' : value}`
                        : `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, fechada`

              return (
                <button
                  aria-colindex={colIndex + 1}
                  aria-label={label}
                  aria-rowindex={rowIndex + 1}
                  className={classes.join(' ')}
                  disabled={isFinished}
                  key={key}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={event => handleContextMenu(event, rowIndex, colIndex)}
                  onPointerCancel={clearLongPress}
                  onPointerDown={event => handlePointerDown(event, rowIndex, colIndex)}
                  onPointerLeave={clearLongPress}
                  onPointerUp={clearLongPress}
                  role='gridcell'
                  type='button'
                >
                  {flagged
                    ? <><span aria-hidden='true'>⚑</span>{wrongFlag && <span aria-hidden='true' className='wrong-mark'>×</span>}</>
                    : visibleMine
                      ? <span aria-hidden='true'>✹</span>
                      : open && value > 0
                        ? value
                        : ''}
                </button>
              )
            }))}
          </div>
        )}

        {isFinished && finishedRecord && (
          <aside aria-live='polite' className='result-banner'>
            <div className='result-heading'>
              <strong>{finishedRecord.result === 'win' ? 'CAMPO LIMPO' : 'FIM DE JOGO'}</strong>
              <span>
                {formatTime(finishedRecord.elapsedSeconds)} · {finishedRecord.clicks} cliques · {finishedRecord.openedCells} casas abertas
              </span>
            </div>
            <div className='result-flags'>
              <span className='correct-count'>⚑ {finishedRecord.correctFlags} certas</span>
              <span className='wrong-count'>⚑ {finishedRecord.wrongFlags} erradas</span>
            </div>
            <button onClick={openMenu} type='button'>Novo jogo</button>
          </aside>
        )}
      </section>
    </main>
  )
}

export default function AppWithFooter () {
  return (
    <div className='app-shell'>
      <App />
      <footer className='app-footer'><a href='https://lppjunior.com/'>lppjunior.com</a> · Campo Minado</footer>
    </div>
  )
}
