const openComputerButton = document.querySelectorAll('[data-open-computer]')
const openPlayerButton =  document.querySelectorAll('[data-open-player]')

openComputerButton.forEach(button => {
    button.addEventListener('click', () => {
        const computerUi = document.getElementById('computerUi');
        openComputer(computerUi);
    })
});

openPlayerButton.forEach(button => {
    button.addEventListener('click', () => {
        const playerUi = document.getElementById('playerUi');
        openPlayer(playerUi);
    })
});

function openComputer(computerUi) {
    computerUi.classList.add('active');
    playerUi.classList.add('active');
};

function openPlayer(playerUi) {
    playerUi.classList.remove('active');
    computerUi.classList.remove('active');
};

// All code above selects the computer/player two UI
// ---------------------------------------------------------------------

const Gameboard = (function() {
    let board = [];


})();