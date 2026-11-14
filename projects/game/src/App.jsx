import React, { useEffect, useRef, useState } from 'react'
import { Bot } from '@minefield/bot'
import { Minefield } from '@minefield/main'

const LEVELS = {
  beginner: {
    label: 'Iniciante',
    shortLabel: 'Iniciante (9×9)',
    description: '9×9 · 10 minas',
    rows: 9,
    cols: 9,
    mines: 10
  },
  intermediate: {
    label: 'Intermediário',
    shortLabel: 'Intermediário (16×16)',
    description: '16×16 · 40 minas',
    rows: 16,
    cols: 16,
    mines: 40
  },
  expert: {
    label: 'Especialista',
    shortLabel: 'Especialista (30×16)',
    description: '30×16 · 99 minas',
    rows: 16,
    cols: 30,
    mines: 99
  }
}

const EMPTY_HINT = 'Peça uma dica para procurar uma jogada deduzida pelo tabuleiro.'

function snapshot (state) {
  return {
    ...state,
    board: state.board.map(row => [...row]),
    lastUpdate: [...state.lastUpdate]
  }
}

function formatTime (seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

function countFlags (state) {
  return state.board.reduce((count, row) => (
    count + row.filter(value => value === Minefield.CHECKERS.FLAG).length
  ), 0)
}

function App () {
  const [level, setLevel] = useState('intermediate')
  const [config, setConfig] = useState(LEVELS.intermediate)
  const [gameState, setGameState] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [flagMode, setFlagMode] = useState(false)
  const [hoveringCell, setHoveringCell] = useState(false)
  const [hint, setHint] = useState(null)
  const [hintMessage, setHintMessage] = useState(EMPTY_HINT)
  const [hintVisible, setHintVisible] = useState(true)
  const [modal, setModal] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [stats, setStats] = useState({ played: 0, wins: 0, best: null })
  const gameRef = useRef(null)
  const botRef = useRef(null)
  const secondsRef = useRef(0)
  const audioContextRef = useRef(null)

  useEffect(() => {
    const game = Minefield.getInstance(config)
    const bot = Bot.getInstance({
      game,
      process: Bot.PROCESS.UNIT,
      speed: Bot.SPEED.NONE
    })

    gameRef.current = game
    botRef.current = bot
    game.addListener(Minefield.EVENTS.ALL, ({ event, state }) => {
      setGameState(snapshot(state))

      if (event === Minefield.EVENTS.FINISH) {
        const won = state.status === Minefield.STATUS.WIN
        const elapsed = secondsRef.current

        setStats(current => ({
          played: current.played + 1,
          wins: current.wins + (won ? 1 : 0),
          best: won && (current.best === null || elapsed < current.best)
            ? elapsed
            : current.best
        }))
        setHint(null)
        setHintMessage(won
          ? 'Campo limpo! Você encontrou todas as casas seguras.'
          : 'Fim de jogo. Reinicie para tentar novamente.')
        setStarted(false)
      }
    })

    secondsRef.current = 0
    setSeconds(0)
    setStarted(false)
    setFlagMode(false)
    setHint(null)
    setHintMessage(EMPTY_HINT)
    setHintVisible(true)
    game.start()

    return () => bot.stop()
  }, [config])

  useEffect(() => {
    if (!started || gameState?.status !== Minefield.STATUS.PLAYING) {
      return undefined
    }

    const timer = window.setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [started, gameState?.status])

  function chooseLevel (key) {
    setLevel(key)
    setConfig({ ...LEVELS[key] })
  }

  function beginCustomGame (customConfig) {
    setLevel('custom')
    setConfig(customConfig)
    setModal(null)
  }

  function restart () {
    secondsRef.current = 0
    setSeconds(0)
    setStarted(false)
    setHint(null)
    setHintMessage(EMPTY_HINT)
    gameRef.current?.reset()
  }

  function performCellAction (row, col, action = flagMode ? 'flag' : 'open') {
    if (!gameState || gameState.status !== Minefield.STATUS.PLAYING) {
      return
    }

    setStarted(true)
    playTone(action === 'flag' ? 520 : 360)
    gameRef.current[action](row, col)
  }

  function playTone (frequency) {
    if (!soundEnabled || !window.AudioContext) {
      return
    }

    const context = audioContextRef.current || new window.AudioContext()
    audioContextRef.current = context

    const oscillator = context.createOscillator()
    const volume = context.createGain()
    volume.gain.setValueAtTime(0.04, context.currentTime)
    volume.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12)
    oscillator.frequency.value = frequency
    oscillator.connect(volume)
    volume.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.12)
  }

  function requestHint () {
    const nextHint = botRef.current?.getHint() ?? null
    setHint(nextHint)
    setHintVisible(true)
    playTone(680)

    if (!nextHint) {
      setHintMessage('Ainda não há uma jogada segura dedutível. Abra uma casa para começar.')
      return
    }

    const coordinate = `linha ${nextHint.row + 1}, coluna ${nextHint.col + 1}`
    setHintMessage(nextHint.action === 'flag'
      ? `A lógica deduziu uma mina na ${coordinate}.`
      : `A lógica deduziu uma casa segura na ${coordinate}.`)
  }

  function applyHint () {
    if (!hint) {
      return
    }

    performCellAction(hint.row, hint.col, hint.action)
    setHint(null)
    setHintMessage(EMPTY_HINT)
  }

  const flagsRemaining = gameState
    ? Math.max(0, gameState.mines - countFlags(gameState))
    : config.mines
  const winRate = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0
  const isFinished = Boolean(gameState && gameState.status !== Minefield.STATUS.PLAYING)

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <div className='topbar-inner'>
          <a className='brand' href='#game' aria-label='Campo Minado Smart'>
            <span className='brand-mark' aria-hidden='true'>✹</span>
            <span className='brand-name'>
              CAMPO MINADO
              <small>SMART EDITION</small>
            </span>
          </a>

          <nav className='level-nav' aria-label='Dificuldade'>
            {Object.entries(LEVELS).map(([key, item]) => (
              <button
                className={level === key ? 'nav-level is-active' : 'nav-level'}
                key={key}
                onClick={() => chooseLevel(key)}
                type='button'
                aria-pressed={level === key}
              >
                {item.shortLabel}
              </button>
            ))}
            <button
              className={level === 'custom' ? 'nav-level is-active' : 'nav-level'}
              onClick={() => setModal('custom')}
              type='button'
              aria-pressed={level === 'custom'}
            >
              Personalizado
            </button>
          </nav>

          <div className='header-actions'>
            <button
              aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
              aria-pressed={soundEnabled}
              className='icon-button'
              onClick={() => setSoundEnabled(value => !value)}
              title={soundEnabled ? 'Desativar som' : 'Ativar som'}
              type='button'
            >
              {soundEnabled ? '♫' : '♪'}
            </button>
            <button
              aria-label='Recordes da sessão'
              className='icon-button'
              onClick={() => setModal('stats')}
              title='Recordes'
              type='button'
            >
              ▥
            </button>
            <button
              aria-label='Como jogar'
              className='icon-button'
              onClick={() => setModal('help')}
              title='Como jogar'
              type='button'
            >
              ?
            </button>
          </div>
        </div>
      </header>

      <main className='main-content' id='game'>
        <section className='game-layout'>
          <div className='mode-bar'>
            <span className='mode-indicator' />
            <strong>MODO CLÁSSICO LÓGICO</strong>
            <span className='mode-separator'>•</span>
            <span>Use as pistas para encontrar as casas seguras</span>
            <div className='quick-levels' aria-label='Escolher dificuldade'>
              {Object.entries(LEVELS).map(([key, item]) => (
                <button
                  className={level === key ? 'quick-level is-active' : 'quick-level'}
                  key={key}
                  onClick={() => chooseLevel(key)}
                  type='button'
                >
                  {item.description}
                </button>
              ))}
              <button
                className='quick-level custom-shortcut'
                onClick={() => setModal('custom')}
                type='button'
              >
                ⚙ Ajustar
              </button>
            </div>
          </div>

          {hintVisible && (
            <section className='hint-card' aria-live='polite'>
              <div className='hint-copy'>
                <span className='hint-icon' aria-hidden='true'>✦</span>
                <div>
                  <div className='hint-heading'>
                    <strong>ASSISTENTE DE LÓGICA</strong>
                    <span className='safe-badge'>SEM CHUTES</span>
                  </div>
                  <p>{hintMessage}</p>
                </div>
              </div>
              <div className='hint-actions'>
                <button
                  className='button button-safe'
                  disabled={!hint}
                  onClick={applyHint}
                  type='button'
                >
                  {hint?.action === 'flag' ? 'Marcar bandeira' : 'Revelar célula'}
                </button>
                <button
                  aria-label='Fechar dica'
                  className='dismiss-button'
                  onClick={() => setHintVisible(false)}
                  type='button'
                >
                  ×
                </button>
              </div>
            </section>
          )}

          <section className='game-stage' aria-label='Campo minado'>
            <div className='game-hud'>
              <div className='counter-card'>
                <span className='counter-icon flag-icon' aria-hidden='true'>⚑</span>
                <span className='counter-label'>MINAS</span>
                <strong className='counter-value mine-counter'>
                  {String(flagsRemaining).padStart(3, '0')}
                </strong>
              </div>

              <button
                aria-label='Reiniciar jogo'
                className='reset-button'
                onClick={restart}
                title='Reiniciar jogo'
                type='button'
              >
                <span>{gameState?.status === Minefield.STATUS.WIN
                  ? '😎'
                  : gameState?.status === Minefield.STATUS.LOSS
                    ? '😵'
                    : hoveringCell
                      ? '😮'
                      : '🙂'}
                </span>
                <small>↻</small>
              </button>

              <div className='hud-tools'>
                <button
                  aria-pressed={flagMode}
                  className={flagMode ? 'button button-flag is-active' : 'button button-flag'}
                  onClick={() => setFlagMode(value => !value)}
                  title='Ativar modo bandeira'
                  type='button'
                >
                  ⚑ <span>Bandeira</span>
                </button>
                <button
                  className='button button-hint'
                  onClick={requestHint}
                  type='button'
                >
                  ✦ <span>Dica IA</span>
                </button>
              </div>

              <div className='counter-card timer-card'>
                <span className='counter-label'>TEMPO</span>
                <strong className='counter-value timer-value'>{formatTime(seconds)}</strong>
                <span className='counter-icon' aria-hidden='true'>◷</span>
              </div>
            </div>

            <div className='board-scroll'>
              {gameState && (
                <div
                  aria-label={`Tabuleiro ${gameState.rows} por ${gameState.cols}`}
                  className='board'
                  data-columns={gameState.cols}
                  role='grid'
                  style={{ '--columns': gameState.cols }}
                >
                  {gameState.board.map((row, rowIndex) => row.map((value, colIndex) => {
                    const isFlagged = value === Minefield.CHECKERS.FLAG
                    const isMine = value === Minefield.CHECKERS.MINE
                    const isOpen = value !== Minefield.CHECKERS.EMPTY && !isFlagged
                    const isHint = hint?.row === rowIndex && hint?.col === colIndex
                    const classes = ['cell']

                    classes.push(isFlagged ? 'cell--flagged' : isOpen ? 'cell--open' : 'cell--hidden')
                    if (isMine) classes.push('cell--mine')
                    if (isOpen && value > 0) classes.push(`cell--number-${value}`)
                    if (isHint) classes.push('cell--hint')

                    const label = isFlagged
                      ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, bandeira`
                      : isMine
                        ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, mina`
                        : isOpen
                          ? `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, ${value === 0 ? 'vazia' : value}`
                          : `Linha ${rowIndex + 1}, coluna ${colIndex + 1}, fechada`

                    return (
                      <button
                        aria-label={label}
                        aria-rowindex={rowIndex + 1}
                        aria-colindex={colIndex + 1}
                        className={classes.join(' ')}
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => performCellAction(rowIndex, colIndex)}
                        onContextMenu={event => {
                          event.preventDefault()
                          performCellAction(rowIndex, colIndex, 'flag')
                        }}
                        onMouseEnter={() => setHoveringCell(true)}
                        onMouseLeave={() => setHoveringCell(false)}
                        role='gridcell'
                        type='button'
                      >
                        {isFlagged ? '⚑' : isMine ? '✹' : value > 0 ? value : ''}
                      </button>
                    )
                  }))}
                </div>
              )}
            </div>

            <div className='game-help'>
              <span><kbd>Click</kbd> Revelar</span>
              <span className='help-divider'>·</span>
              <span><kbd>Dir.</kbd> Marcar</span>
              <span className='help-divider'>·</span>
              <span><kbd>Modo ⚑</kbd> Marcar por toque</span>
              <strong>◉ Lógica ativa</strong>
            </div>
            {isFinished && (
              <p className={gameState?.status === Minefield.STATUS.WIN ? 'game-result is-win' : 'game-result'}>
                {gameState?.status === Minefield.STATUS.WIN
                  ? 'Parabéns! Você venceu.'
                  : 'Fim de jogo. Tente novamente!'}
              </p>
            )}
          </section>

          <section className='info-cards' aria-label='Informações da partida'>
            <article className='info-card'>
              <div className='info-card-title'>
                <span aria-hidden='true'>🏆</span>
                <h2>Recordes da sessão</h2>
                <span className='level-badge'>{level === 'custom' ? 'Personalizado' : LEVELS[level].label}</span>
              </div>
              <div className='stats-row'>
                <div><span>Melhor</span><strong>{stats.best === null ? '--:--' : formatTime(stats.best)}</strong></div>
                <div><span>Vitórias</span><strong className='text-green'>{stats.wins}</strong></div>
                <div><span>Taxa</span><strong className='text-cyan'>{winRate}%</strong></div>
              </div>
              <p className='card-note'>Estatísticas desta sessão de jogo</p>
            </article>

            <article className='info-card certainty-card'>
              <div className='info-card-title'>
                <span aria-hidden='true'>⌁</span>
                <h2>Índice de certeza</h2>
                <strong className={hint ? 'text-green' : 'text-muted'}>{hint ? '100%' : '—'}</strong>
              </div>
              <p>{hint
                ? `Próximo movimento deduzido: linha ${hint.row + 1}, coluna ${hint.col + 1}.`
                : 'Peça uma dica para verificar se há uma jogada segura dedutível.'}
              </p>
              <div className='certainty-track'>
                <span style={{ width: hint ? '100%' : '0%' }} />
              </div>
              <button className='text-link' onClick={requestHint} type='button'>
                Verificar jogada segura <span aria-hidden='true'>→</span>
              </button>
            </article>

            <article className='info-card custom-card'>
              <div className='info-card-title'>
                <span aria-hidden='true'>▦</span>
                <h2>Personalização</h2>
              </div>
              <p>Crie um tabuleiro com dimensões e quantidade de minas próprias.</p>
              <button className='button button-secondary custom-button' onClick={() => setModal('custom')} type='button'>
                ▦ Criar campo próprio
              </button>
            </article>
          </section>
        </section>
      </main>

      <footer className='footer'>
        <span>Campo Minado Smart <span className='footer-dot'>•</span> Lógica sem suposições</span>
        <nav aria-label='Links do rodapé'>
          <a href='#game'>Jogo</a>
          <button onClick={() => setModal('stats')} type='button'>Recordes</button>
          <button onClick={() => setModal('help')} type='button'>Tutorial</button>
        </nav>
      </footer>

      {modal === 'custom' && (
        <CustomGameDialog
          initialConfig={config}
          onClose={() => setModal(null)}
          onCreate={beginCustomGame}
        />
      )}
      {modal === 'stats' && (
        <InfoDialog title='Recordes da sessão' onClose={() => setModal(null)}>
          <p>Partidas concluídas: <strong>{stats.played}</strong></p>
          <p>Vitórias: <strong>{stats.wins}</strong></p>
          <p>Taxa de vitória: <strong>{winRate}%</strong></p>
          <p>Melhor tempo: <strong>{stats.best === null ? 'Ainda sem vitórias' : formatTime(stats.best)}</strong></p>
        </InfoDialog>
      )}
      {modal === 'help' && (
        <InfoDialog title='Como jogar' onClose={() => setModal(null)}>
          <p>Revele as casas sem minas. Os números indicam quantas minas existem nas oito casas ao redor.</p>
          <p>Use o botão Bandeira ou o clique direito para marcar uma mina. A dica só sugere jogadas deduzidas pelo tabuleiro.</p>
          <p>Você vence ao revelar todas as casas seguras.</p>
        </InfoDialog>
      )}
    </div>
  )
}

function CustomGameDialog ({ initialConfig, onClose, onCreate }) {
  const [rows, setRows] = useState(String(initialConfig.rows))
  const [cols, setCols] = useState(String(initialConfig.cols))
  const [mines, setMines] = useState(String(initialConfig.mines))
  const [error, setError] = useState('')

  function submit (event) {
    event.preventDefault()
    const boardRows = Number(rows)
    const boardCols = Number(cols)
    const mineCount = Number(mines)

    if (!Number.isInteger(boardRows) || boardRows < 5 || boardRows > 30 ||
      !Number.isInteger(boardCols) || boardCols < 5 || boardCols > 30) {
      setError('Linhas e colunas devem estar entre 5 e 30.')
      return
    }

    if (!Number.isInteger(mineCount) || mineCount < 1 || mineCount >= boardRows * boardCols) {
      setError('Informe pelo menos uma mina e deixe ao menos uma casa segura.')
      return
    }

    onCreate({
      rows: boardRows,
      cols: boardCols,
      mines: mineCount
    })
  }

  return (
    <div
      className='modal-backdrop' onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section aria-labelledby='custom-title' aria-modal='true' className='dialog' role='dialog'>
        <button aria-label='Fechar' className='dialog-close' onClick={onClose} type='button'>×</button>
        <span className='dialog-kicker'>NOVO TABULEIRO</span>
        <h2 id='custom-title'>Campo personalizado</h2>
        <p>Escolha o tamanho do tabuleiro e a quantidade de minas.</p>
        <form className='custom-form' onSubmit={submit}>
          <label>
            Linhas
            <input max='30' min='5' onChange={event => setRows(event.target.value)} required type='number' value={rows} />
          </label>
          <label>
            Colunas
            <input max='30' min='5' onChange={event => setCols(event.target.value)} required type='number' value={cols} />
          </label>
          <label>
            Minas
            <input min='1' onChange={event => setMines(event.target.value)} required type='number' value={mines} />
          </label>
          {error && <p className='form-error' role='alert'>{error}</p>}
          <button className='button button-primary' type='submit'>Começar partida</button>
        </form>
      </section>
    </div>
  )
}

function InfoDialog ({ children, onClose, title }) {
  return (
    <div
      className='modal-backdrop' onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section aria-labelledby='info-title' aria-modal='true' className='dialog' role='dialog'>
        <button aria-label='Fechar' className='dialog-close' onClick={onClose} type='button'>×</button>
        <span className='dialog-kicker'>CAMPO MINADO SMART</span>
        <h2 id='info-title'>{title}</h2>
        <div className='dialog-content'>{children}</div>
        <button className='button button-primary' onClick={onClose} type='button'>Entendi</button>
      </section>
    </div>
  )
}

export default App
