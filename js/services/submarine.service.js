'use strict'

const SHIPS = [2, 3, 3, 4, 5]
const BOARD_SIZE = 10
const EMPTY = 0
const HIT = 1
const MISS = 2
const DESTROYED = 3

var gPlayers
var gCurrPlayerIdx
var gMaxHits
var gNextShipNum = 1

function setPlayers() {
    gPlayers = [
        { name: 'P1', board: createBoard(), hitBoard: createHitBoard(), hitCount: 0, color: 'blue' },
        { name: 'P2', board: createBoard(), hitBoard: createHitBoard(), hitCount: 0, color: 'red' },
    ]
    gCurrPlayerIdx = 0
    setMaxHits()
}

function setNextTurn() {
    gCurrPlayerIdx = (gCurrPlayerIdx === 0) ? 1 : 0
}

function setCellState({ i, j }, state) {
    const currPlayer = getCurrPlayer()
    const enemyBoard = getEnemyBoard()

    currPlayer.hitBoard[i][j] = state

    if (state === HIT) {
        currPlayer.hitCount++
        damageShip(enemyBoard[i][j])
    }
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

function getMaxHits() {
    return gMaxHits
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
    autoPlaceShips(board)
    // DEBUG
    const ship = { name: 's7', health: 3 }
    board[0][0] = ship
    board[0][1] = ship
    board[0][2] = ship
    // DEBUG
    return board
}

function damageShip(ship) {
    ship.health--
    const enemyBoard = getEnemyBoard()
    for (let i = 0; i < enemyBoard.length; i++) {
        for (let j = 0; j < enemyBoard.length; j++) {
            const currShip = enemyBoard[i][j]
            if (currShip.name !== ship.name) continue
            if (currShip.health <= 0) {
                const currPlayer = getCurrPlayer()
                currPlayer.hitBoard[i][j] = DESTROYED
            }
        }
    }
}

function autoPlaceShips(board) {
    SHIPS.forEach(size => {
        let placed = false
        while (!placed) {
            const isHorizontal = Math.random() < 0.5
            const rowIdx = getRandomInt(0, BOARD_SIZE)
            const colIdx = getRandomInt(0, BOARD_SIZE)
            if (checkValidPlacement(board, rowIdx, colIdx, size, isHorizontal)) {
                placeShip(board, rowIdx, colIdx, size, isHorizontal)
                placed = true
            }
        }
    })
    gNextShipNum = 1
}

function checkValidPlacement(board, rowIdx, colIdx, size, isHorizontal) {
    if (isHorizontal) {
        if (colIdx + size > BOARD_SIZE) {
            return false
        }
        for (let i = colIdx; i < colIdx + size; i++) {
            if (board[rowIdx][i] !== EMPTY) {
                return false
            }
        }
    } else {
        if (rowIdx + size > BOARD_SIZE) {
            return false
        }
        for (let i = rowIdx; i < rowIdx + size; i++) {
            if (board[i][colIdx] !== EMPTY) {
                return false
            }
        }
    }
    return true
}

function placeShip(board, rowIdx, colIdx, size, isHorizontal) {
    const ship = { name: 's' + gNextShipNum, health: size }
    if (isHorizontal) {
        for (let i = colIdx; i < colIdx + size; i++) {
            board[rowIdx][i] = ship
        }
    } else {
        for (let i = rowIdx; i < rowIdx + size; i++) {
            board[i][colIdx] = ship
        }
    }
    gNextShipNum++
}

function setMaxHits() {
    gMaxHits = SHIPS.reduce((acc, size) => acc + size, 0)
}