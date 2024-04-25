'use strict'

const BOARD_SIZE = 10
const EMPTY = 0
const HIT = 1
const MISS = 2
const DESTROYED = 3

var gPlayers
var gCurrPlayerIdx
var gMaxHits

function createPlayers() {
    gPlayers = [
        { name: 'P1', board: createBoard(), hitBoard: createHitBoard(), hitCount: 0, color: 'blue' },
        { name: 'P2', board: createBoard(), hitBoard: createHitBoard(), hitCount: 0, color: 'red' },
    ]
    gCurrPlayerIdx = 0
}

function createHitBoard() {
    const board = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push([])
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = EMPTY
        }
    }
    // DEBUG
    // board[0][0] = DESTROYED
    // board[0][1] = DESTROYED
    // board[0][2] = DESTROYED
    // DEBUG
    return board
}

function createBoard() {
    const board = createHitBoard()
    setShips(board)
    // autoPlaceShips(board)
    return board
}

function setNextTurn() {
    gCurrPlayerIdx = (gCurrPlayerIdx === 0) ? 1 : 0
}

function setCellState({ i, j }, state) {
    const currPlayer = getCurrPlayer()
    currPlayer.hitBoard[i][j] = state
}

function getEnemyBoard() {
    return gCurrPlayerIdx === 0 ? gPlayers[1].board : gPlayers[0].board
}

function getCurrPlayer() {
    return gPlayers[gCurrPlayerIdx]
}

function getGameStates() {
    return {
        EMPTY, HIT, MISS, DESTROYED
    }
}