'use strict'

const gAudioHit = new Audio('./sound/hit.mp3')
const gAudioMiss = new Audio('./sound/miss.mp3')
const gAudioDestroy = new Audio('./sound/destroy.mp3')
const gAudioAmbience = new Audio('./sound/ambience.mp3')

gAudioHit.volume = 0.1
gAudioMiss.volume = 0.1
gAudioDestroy.volume = 0.1
gAudioAmbience.volume = 0.050
gAudioAmbience.loop = true

var isSoundMuted = false
var isAmbienceMuted = false
var gTurnIntervalId

const gGameStates = getGameStates()

function onInit() {
    setPlayers()
    renderBoard()
    // gAudioAmbience.play()
}

function renderBoard() {
    var strHTML = ''
    const currPlayer = getCurrPlayer()
    const length = currPlayer.hitBoard.length

    for (let i = 0; i < length; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < length; j++) {
            const cell = currPlayer.hitBoard[i][j]

            var className = 'cell'
            var content = ''

            if (cell === gGameStates.HIT) className += ' hit'
            else if (cell === gGameStates.DESTROYED) className += ' hit destroyed'
            else if (cell === gGameStates.MISS) {
                className += ' miss'
                content += 'X'
            }

            strHTML += `<td id="cell-${i}-${j}" class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${content}</td>`
        }
        strHTML += '</tr>'
    }

    document.querySelector('.current-player').innerHTML = `
    <h1>
        <span style="color: ${currPlayer.color}">${currPlayer.name}</span>'s Turn:
    </h1>`
    document.querySelector('.game-board').innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    clearInterval(gTurnIntervalId)

    const coord = { i, j }
    const elBoard = document.querySelector('.game-board')

    if (!isEmptyCell(coord)) return

    if (isHit(coord)) {
        setCellState(coord, gGameStates.HIT)
        elCell.classList.add('hit')

        gAudioHit.currentTime = 0
        gAudioHit.play()

        markDestroyedCells(coord)
        checkVictory()
    } else {
        setCellState(coord, gGameStates.MISS)
        elCell.classList.add('miss')
        elCell.innerText = 'X'
        elBoard.classList.add('unclickable')

        gAudioMiss.currentTime = 0
        gAudioMiss.play()

        gTurnIntervalId = setTimeout(() => {
            elBoard.classList.remove('unclickable')
            setNextTurn()
            renderBoard()
        }, 2000)
    }
}

function isHit(coord) {
    const enemyBoard = getEnemyBoard()
    return enemyBoard[coord.i][coord.j] !== gGameStates.EMPTY
}

function isEmptyCell(coord) {
    const currPlayer = getCurrPlayer()
    return currPlayer.hitBoard[coord.i][coord.j] === gGameStates.EMPTY
}

function showShipImg() {
    const elRadar = document.querySelector('.radar')
    elRadar.src = `img/ship${getRandomInt(1, 5)}.gif`
    setTimeout(()=> {
        elRadar.src = 'img/radar.gif'
    }, 7000)
}

function markDestroyedCells(coord) {
    if (!isDestroyed(coord)) return
    const currPlayer = getCurrPlayer()
    const length = currPlayer.hitBoard.length

    for (let i = coord.i - 1; i <= coord.i + 1; i++) {
        if (i < 0 || i >= length) continue
        for (let j = coord.j - 1; j <= coord.j + 1; j++) {
            if (j < 0 || j >= length) continue

            const coord = { i, j }
            const elCell = getElCell(coord)

            if (!isDestroyed(coord)) continue
            if (elCell.classList.contains('destroyed')) continue

            elCell.classList.add('destroyed')
            castFlames(elCell)
            markDestroyedCells(coord)
        }
    }

    showShipImg()
    gAudioDestroy.currentTime = 0
    gAudioDestroy.play()
}

function isDestroyed(coord) {
    const currPlayer = getCurrPlayer()
    return currPlayer.hitBoard[coord.i][coord.j] === gGameStates.DESTROYED
}

function castFlames(elCell) {
    elCell.classList.add('flame')
    setTimeout(() => {
        elCell.classList.remove('flame')
    }, 1000)
}

function checkVictory() {
    const currPlayer = getCurrPlayer()
    const maxHits = getMaxHits()

    if (currPlayer.hitCount >= maxHits) {
        const elModal = document.querySelector('.modal')
        elModal.innerHTML = `
            <h1><span style="color: ${currPlayer.color}">${currPlayer.name}</span> is victorious!</h1>
            <button onclick="onNewGame()">New Game</button>`
        showModal()
        showBackdrop()
    }
}

function getElCell(pos) {
    return document.getElementById(`cell-${pos.i}-${pos.j}`)
}

function onMuteBG() {
    isAmbienceMuted = !isAmbienceMuted
    isAmbienceMuted ? gAudioAmbience.pause() : gAudioAmbience.play()
}

function onMuteSE() {
    isSoundMuted = !isSoundMuted
    if (isSoundMuted) {
        gAudioHit.volume = 0
        gAudioMiss.volume = 0
        gAudioDestroy.volume = 0
    } else {
        gAudioHit.volume = 0.1
        gAudioMiss.volume = 0.1
        gAudioDestroy.volume = 0.1
    }
}

function onNewGame() {
    showBackdrop(false)
    showModal(false)
    onInit()
}