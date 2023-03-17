import { useEffect, useState } from 'react'

import { useChannel, usePresence } from '@ably-labs/react-hooks'

import classNames from '@/lib/classNames'
import { BlackPawn, WhitePawn } from '@/svg/Pawn'

const [ROW, COL] = [6, 6]

interface Props {
  gameId: string
  clientId: string
}

const coord = (r: number, c: number) => r * COL + c

const flipBoard = (board: string[][]) => {
  return board
    .map((row) =>
      row.map((cell) => (cell === 'B' ? 'W' : cell === 'W' ? 'B' : '_'))
    )
    .reverse()
}

const makeMove = (board: string[][], from: number, to: number) => {
  const [r1, c1] = [Math.floor(from / COL), from % COL]
  const [r2, c2] = [Math.floor(to / COL), to % COL]

  board[r2][c2] = board[r1][c1]
  board[r1][c1] = '_'

  return board
}

const getMovableSquare = (board: string[][], x: number) => {
  const [r, c] = [Math.floor(x / COL), x % COL]
  const cell = board[r][c]
  const movable = []

  for (let i = -1; i <= 1; i++) {
    const [nr, nc] = [r + (cell === 'B' ? 1 : -1), c + i]
    if (
      nr < 0 ||
      nr >= ROW ||
      nc < 0 ||
      nc >= COL ||
      board[nr][nc] === board[r][c] ||
      (i === 0 && board[nr][nc] === (cell === 'B' ? 'W' : 'B'))
    ) {
      continue
    }
    movable.push(coord(nr, nc))
  }

  return movable
}

export default function Client({ gameId, clientId }: Props) {
  const [board, setBoard] = useState([
    ['B', 'B', 'B', 'B', 'B', 'B'],
    ['B', 'B', 'B', 'B', 'B', 'B'],
    ['_', '_', '_', '_', '_', '_'],
    ['_', '_', '_', '_', '_', '_'],
    ['W', 'W', 'W', 'W', 'W', 'W'],
    ['W', 'W', 'W', 'W', 'W', 'W'],
  ])
  const [turn, setTurn] = useState<'W' | 'B'>('W')
  const [winner, setWinner] = useState<'W' | 'B' | null>(null)

  const [channel] = useChannel(`breakthrough:game:${gameId}`, (message) => {
    if (message.clientId === clientId) {
      return
    }
    setBoard(message.data.board)
    setTurn(message.data.turn)
  })
  usePresence(`breakthrough:game:${gameId}`, {}, (member) => {
    if (member.clientId !== clientId && member.action === 'enter') {
      channel.publish('move', { board, turn })
    }
  })

  const [selectedPawn, setSelectedPawn] = useState<number | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<number[]>([])
  const [boardFlipped, setBoardFlipped] = useState(false)

  const displayedBoard = boardFlipped ? flipBoard(board) : board
  const displayedTurn = boardFlipped ? (turn === 'W' ? 'B' : 'W') : turn
  const displayedWinner = winner
    ? boardFlipped
      ? winner === 'W'
        ? 'B'
        : 'W'
      : winner
    : winner

  const isDisabled = (x: number) => {
    if (winner) {
      return true
    }
    const [r, c] = [Math.floor(x / COL), x % COL]
    if (board[r][c] !== turn && !possibleMoves.includes(x)) {
      return true
    }
    return false
  }

  const boardCoord = (r: number, c: number) =>
    boardFlipped ? coord(ROW - r - 1, c) : coord(r, c)

  const handleMove = (from: number, to: number) => {
    const newBoard = makeMove(board, from, to)
    const newTurn = turn === 'W' ? 'B' : 'W'

    setBoard(newBoard)
    setTurn(newTurn)
    setSelectedPawn(null)
    setPossibleMoves([])

    channel.publish('move', { board: newBoard, turn: newTurn })
  }

  const handlePawnClick = (x: number) => {
    if (selectedPawn !== null && possibleMoves.includes(x)) {
      handleMove(selectedPawn, x)
      return
    }
    setSelectedPawn((selected) => {
      if (selected === x) {
        setPossibleMoves([])
        return null
      }
      setPossibleMoves(getMovableSquare(board, x))
      return x
    })
  }

  const handleSwitchTurn = () => {
    const newTurn = turn === 'W' ? 'B' : 'W'
    setTurn(newTurn)

    channel.publish('move', { board, turn: newTurn })
  }

  const handleReset = () => {
    setBoard([
      ['B', 'B', 'B', 'B', 'B', 'B'],
      ['B', 'B', 'B', 'B', 'B', 'B'],
      ['_', '_', '_', '_', '_', '_'],
      ['_', '_', '_', '_', '_', '_'],
      ['W', 'W', 'W', 'W', 'W', 'W'],
      ['W', 'W', 'W', 'W', 'W', 'W'],
    ])
    setTurn('W')
    setWinner(null)
    setSelectedPawn(null)
    setPossibleMoves([])

    channel.publish('move', {
      board: [
        ['B', 'B', 'B', 'B', 'B', 'B'],
        ['B', 'B', 'B', 'B', 'B', 'B'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['W', 'W', 'W', 'W', 'W', 'W'],
        ['W', 'W', 'W', 'W', 'W', 'W'],
      ],
      turn: 'W',
    })
  }

  useEffect(() => {
    if (
      board[0].some((cell) => cell === 'W') ||
      board.every((row) => row.every((cell) => cell !== 'B'))
    ) {
      setWinner('W')
    } else if (
      board[ROW - 1].some((cell) => cell === 'B') ||
      board.every((row) => row.every((cell) => cell !== 'W'))
    ) {
      setWinner('B')
    }
  }, [board])

  return (
    <div className="flex flex-col items-center py-8 text-center">
      {displayedWinner ? (
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Winner:{' '}
          <span>
            {displayedWinner === 'W' ? (
              <WhitePawn className="-mt-2 inline-block h-8 w-auto sm:h-10" />
            ) : (
              <BlackPawn className="-mt-2 inline-block h-8 w-auto sm:h-10" />
            )}
          </span>
        </h2>
      ) : (
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Turn:{' '}
          <span>
            {displayedTurn === 'W' ? (
              <WhitePawn className="-mt-2 inline-block h-8 w-auto sm:h-10" />
            ) : (
              <BlackPawn className="-mt-2 inline-block h-8 w-auto sm:h-10" />
            )}
          </span>
        </h2>
      )}
      <div>
        <div className="mt-4 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-md border border-gray-200 shadow sm:mt-8">
          {displayedBoard.map((row, r) => (
            <div key={r} className="grid grid-cols-6 divide-x divide-gray-200">
              {row.map((cell, c) => (
                <button
                  key={c}
                  className={classNames(
                    'relative flex aspect-square items-center justify-center p-2 ring-inset ring-gray-200 sm:p-3',
                    isDisabled(boardCoord(r, c)) ? '' : 'hover:bg-gray-100',
                    selectedPawn !== boardCoord(r, c) ? '' : 'ring-4'
                  )}
                  onClick={() => handlePawnClick(boardCoord(r, c))}
                  disabled={isDisabled(boardCoord(r, c))}
                  draggable={!isDisabled(boardCoord(r, c))}
                  onDragStart={() => {
                    setSelectedPawn(boardCoord(r, c))
                    setPossibleMoves(getMovableSquare(board, boardCoord(r, c)))
                  }}
                  onDragOver={(e) => {
                    if (possibleMoves.includes(boardCoord(r, c))) {
                      e.preventDefault()
                    }
                  }}
                  onDrop={() => {
                    if (
                      selectedPawn !== null &&
                      selectedPawn !== boardCoord(r, c)
                    ) {
                      handleMove(selectedPawn, boardCoord(r, c))
                    }
                  }}
                >
                  {cell === 'B' ? (
                    <BlackPawn className="-mt-1 h-8 w-auto sm:h-10" />
                  ) : cell === 'W' ? (
                    <WhitePawn className="-mt-1 h-8 w-auto sm:h-10" />
                  ) : null}
                  <span className="sr-only">{cell}</span>
                  <div
                    className={classNames(
                      'absolute rounded-full',
                      cell === '_'
                        ? 'h-4 w-4 bg-gray-700'
                        : 'inset-0 m-1 border-4 border-gray-700',
                      possibleMoves.includes(boardCoord(r, c))
                        ? 'opacity-30'
                        : 'opacity-0'
                    )}
                  ></div>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 grid w-full grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
          <button
            type="button"
            className="rounded-md bg-white py-2.5 px-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleSwitchTurn}
          >
            Switch turn
          </button>
          <button
            type="button"
            className="rounded-md bg-white py-2.5 px-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setBoardFlipped((flipped) => !flipped)}
          >
            Flip board
          </button>
          <button
            type="button"
            className="rounded-md bg-white py-2.5 px-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
