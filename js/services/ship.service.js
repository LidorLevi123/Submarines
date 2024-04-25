'use strict'

const SIZES = [2, 3, 4, 5]

function setShips(board) {
    for (let i = 0; i < SIZES.length; i++) {
        const ship = {
            health: SIZES[i],
            coords: []
        }
        for (let j = 0; j < SIZES[i]; j++) {
            board[i][j] = ship
            ship.coords.push({ i, j })
        }
    }
}

function damageShip(coord) {
    const currPlayer = getCurrPlayer()
    const ship = getEnemyShip(coord)

    ship.health--
    currPlayer.hitCount++

    if (ship.health > 0) return

    // If ship's health reaches below 0, we need to update each coord of the ship at the
    // player's hit board as DESTROYED state
    for (let i = 0; i < ship.coords.length; i++) {
        const currCoord = ship.coords[i]
        currPlayer.hitBoard[currCoord.i][currCoord.j] = DESTROYED
    }
}

function autoPlaceShips(board) {
    SIZES.forEach(size => {
        let isPlaced = false
        while (!isPlaced) {
            const isHorizontal = Math.random() < 0.5
            const rowIdx = getRandomInt(0, BOARD_SIZE)
            const colIdx = getRandomInt(0, BOARD_SIZE)
            if (checkValidPlacement(board, rowIdx, colIdx, size, isHorizontal)) {
                placeShip(board, rowIdx, colIdx, size, isHorizontal)
                isPlaced = true
            }
        }
    })
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
    const ship = {
        health: size,
        coords: []
    }
    if (isHorizontal) {
        for (let i = colIdx; i < colIdx + size; i++) {
            board[rowIdx][i] = ship
            ship.coords.push({ i: rowIdx, j: i })
        }
    } else {
        for (let i = rowIdx; i < rowIdx + size; i++) {
            board[i][colIdx] = ship
            ship.coords.push({ i, j: colIdx })
        }
    }
}

function getEnemyShip(coord) {
    const enemyBoard = getEnemyBoard()
    const ship = enemyBoard[coord.i][coord.j]
    return ship
}

function getMaxHits() {
    return SIZES.reduce((acc, size) => acc + size, 0)
}