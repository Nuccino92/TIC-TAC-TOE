
const DisplayChange = (() => {
    
    const openComputerButton = document.querySelectorAll('[data-open-computer]');
    const openPlayerButton =  document.querySelectorAll('[data-open-player]');

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

    const playButton = document.getElementById('play-button');
    const returnButton = document.getElementById('return');
    const setupUi = document.getElementById('setup-ui');
    const gameUi = document.getElementById('game-ui');
    const newGameBtn = document.getElementById('new-game-btn');
    const resetBtn = document.getElementById('reset-btn');
    const winOverlay = document.getElementById('win-overlay');

    playButton.addEventListener('click', () => {
        openGame();
    });

    returnButton.addEventListener('click', () => {
        setupReturn();
        Gameboard.resetBoard();
        removeBlockBoard();
    })

    function openGame() {
        setupUi.classList.add('active');
        gameUi.classList.add('active');
    };

    function setupReturn() {
        setupUi.classList.remove('active');
        gameUi.classList.remove('active');
    }
    
    newGameBtn.addEventListener('click', () => {
        Gameboard.resetBoard();
        Players.startRound();
        removeBlockBoard();
        // Players.rotateTurnDraw();
    })

    resetBtn.addEventListener('click', () => {
        Gameboard.resetBoard();
        Players.startRound();
        removeBlockBoard();
        Players.roundCounterReset();
        Players.scoreReset();
    })

    function blockBoard() {
        winOverlay.classList.add('active');
    }

    function removeBlockBoard() {
        winOverlay.classList.remove('active');
    }

    return {blockBoard, removeBlockBoard}

})();

const Gameboard = (() => {
    let cells = document.querySelectorAll('.cell')
    let board = ['', '', '', '', '', '', '', '', ''];
    
    const changeBoard = (num, mark) => {
        board[num] = mark;
    }
    
    const renderCells = () => {
        for(i = 0; i < board.length; i++) {
            cells[i].textContent = board[i];     
        }
    }

    function resetBoard() {
        for(i = 0; i < board.length; i++) {
            Gameboard.board[i] = '';
            Gameboard.cells[i].textContent = ''; 
        }
        Players.startRound();   
    }  
    
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    
    function checkWin() {
        for(const combination of winningCombinations) { // grabbing [num1,num2,num3] and using for board[here] in turn getting an index of board, if the indexes = the comination its obviously a win
            const [a,b,c] = combination; 

            if (board[a] && (board[a] === board[b] && board[a] === board[c])) {
                if(board[a] == 'x') {
                    Players.xWin();
                }
                if(board[a] == 'o') {
                    Players.oWin();
                }
            }
        }
        return null;
    }

    return {board, cells, renderCells, changeBoard, resetBoard, checkWin};
    
})();

const Players = (() => {
    
    let roundCounter = 2; // i used this variable to toggle rounds. /even numbers for player 1. odd numbers for player2 or computer.
    const xMark = 'x';
    const oMark = 'o';
    let oTurn; //i used this variable to switch what appears when clicked between 'x' or 'o'.
    let scoreOne = 0;
    let scoreTwo = 0;
    startRound();
    
    const xButton = document.querySelector('.x-button-one');
    const oButton = document.querySelector('.o-button-one');

    xButton.addEventListener('click', setTurnX);
        
    oButton.addEventListener('click', setTurnO);

    function setTurnX() {
        return roundCounter = 2;
    }

    function setTurnO() {
        return roundCounter = 1;
    }

    function startRound() {
        oTurn = false;
        
        Gameboard.cells.forEach(cell  => {
            cell.removeEventListener('click', cellClicked);
            cell.addEventListener('click', cellClicked, {once: true});      
        }) 
    }    
        
    function cellClicked() { 
        let cell = this.id; //gets the exact cell you click
        let currentMark = oTurn ? oMark : xMark; // gets an 'x' or 'o' string

        placeSelection(cell, currentMark);
        switchTurn();
        Gameboard.checkWin();
    }

    function placeSelection(cell, currentMark) { //puts the 'x' or 'o' on the cell clicked using the functions called.
        Gameboard.changeBoard(cell, currentMark);
        Gameboard.renderCells();
    }
   
    function switchTurn() {
        (oTurn = !oTurn);  
    }

    function xWin() {
        DisplayChange.blockBoard();
        rotateTurn();
    }

    function oWin() {
        DisplayChange.blockBoard();
        rotateTurn();
    }

    function playerOneScore() {
        scoreOne++
        document.getElementById('player-one-score-total').textContent = scoreOne;
    }

    function playerTwoScore() {
        scoreTwo++
        document.getElementById('player-two-score-total').textContent = scoreTwo;
    }

    function rotateTurn() {  
        if(roundCounter % 2 === 0) { 
            playerOneScore(); return roundCounter++
        }
        if(Math.abs(roundCounter % 2) == 1) {         //if the difference between roundCounter % 2 == 1 the number will be odd
            playerTwoScore(); return roundCounter++
        }
    }

    function rotateTurnDraw() {
        return roundCounter++; //new function if the board is full and you press the new game button, rotates the turn without giving points
    }

    function roundCounterReset() {
        roundCounter = 2;
    }

    function scoreReset() {
        scoreOne = 0;
        scoreTwo = 0;
        document.getElementById('player-one-score-total').textContent = scoreOne;
        document.getElementById('player-two-score-total').textContent = scoreTwo;
    }

    return {oTurn, startRound, xWin, oWin, scoreReset, rotateTurn, roundCounterReset, rotateTurnDraw};

})();




