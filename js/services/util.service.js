'use strict'

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function showModal(isShow = true) {
    const elModal = document.querySelector('.modal')
    isShow ?
        elModal.classList.add('active') :
        elModal.classList.remove('active')
}

function showBackdrop(isShow = true) {
    const elBackdrop = document.querySelector('.backdrop')
    isShow ?
        elBackdrop.classList.add('active') :
        elBackdrop.classList.remove('active')
}