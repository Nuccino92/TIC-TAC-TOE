
const DisplayChange = (() => {
    
    const openComputerButton = document.querySelectorAll('[data-open-computer]');
    const openPlayerButton =  document.querySelectorAll('[data-open-player]');
    const setPlayerOpponent = document.querySelector('.player-two-game');
    const setComputerOpponent = document.querySelector('.computer-game');

    openComputerButton.forEach(button => {
        button.addEventListener('click', () => {
            const computerUi = document.getElementById('computerUi');
            openComputer(computerUi);
            setPlayerOpponent.classList.add('active');
            setComputerOpponent.classList.add('active');
        })
    });

    openPlayerButton.forEach(button => {
        button.addEventListener('click', () => {
            const playerUi = document.getElementById('playerUi');
            openPlayer(playerUi);
            setPlayerOpponent.classList.remove('active');
            setComputerOpponent.classList.remove('active');
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
    

    resetBtn.addEventListener('click', () => {
        Gameboard.resetBoard();
        Players.startRound();
        removeBlockBoard();
        Players.roundCounterReset();
        Players.scoreReset();
        roundCounter = 2;
        Players.playerMarkDisplay(roundCounter)
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
            board[i] = '';
            cells[i].textContent = ''; 
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
                    return Players.xWin();
                }
                if(board[a] == 'o') {
                    return Players.oWin();
                }
            }
        }
        return null;
    }

    
    return {board, cells, renderCells, changeBoard, resetBoard, checkWin};
    
})();

const Players = (() => {
    let roundCounter = 2; // i use this variable to control the rounds. If roundCounter is even p1 is x, if odd p1 is o
    const xMark = 'x';
    const oMark = 'o';
    let oTurn;   //i use this variable to switch between string 'x' or 'o'.
    let scoreOne = 0;
    let scoreTwo = 0;
    startRound();
    
    const xButton = document.querySelector('.x-button-one');
    const oButton = document.querySelector('.o-button-one');


    function startRound() {
        playerMarkDisplay(roundCounter);
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
        switchMark();
        Gameboard.checkWin();
    }

    function placeSelection(cell, currentMark) { //puts the 'x' or 'o' on the cell clicked using the functions called.
        Gameboard.changeBoard(cell, currentMark);
        Gameboard.renderCells();
    }
   
    function switchMark() {  //switch the strings
        (oTurn = !oTurn);  
    }

    function playerOneScore() {
        scoreOne++
        document.getElementById('player-one-score-total').textContent = scoreOne;
    }

    function playerTwoScore() {
        scoreTwo++
        document.getElementById('player-two-score-total').textContent = scoreTwo;
    }

    const xWin = () => {   // xwin on an "even round" p1++,  xwin on an "odd round" p2/cpu++
        if(roundCounter % 2 === 0) { 
            playerOneScore(); DisplayChange.blockBoard(); return 
        }
        if(Math.abs(roundCounter % 2) == 1) {         //if the difference between roundCounter % 2 == 1 the number will be odd
            playerTwoScore(); DisplayChange.blockBoard(); return 
        }
    }

    const oWin = () => {   //o win on "even round" p2/cpu++,  owin on an "odd round" p1++   // this covers all scenarios and rotates rounds correctly
        if(roundCounter % 2 === 0) { 
            playerTwoScore(); DisplayChange.blockBoard(); return 
        }
        if(Math.abs(roundCounter % 2) == 1) {         
            playerOneScore(); DisplayChange.blockBoard(); return 
        }
    }

    xButton.addEventListener('click', setTurnX);
        
    oButton.addEventListener('click', setTurnO);

    function setTurnX() {
        roundCounter = 2; playerMarkDisplay(roundCounter);
        return;   
    }

    function setTurnO() {
        roundCounter = 1; playerMarkDisplay(roundCounter);
        return;
    }

    function drawRotateTurn() {
        roundCounter++
        DisplayChange.blockBoard();
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

    function playerMarkDisplay(roundCounter) {  // shows what turn the players are on
        if(roundCounter % 2 === 0) { 
            document.getElementById('player-one-mark').textContent = 'x';
            document.getElementById('player-two-mark').textContent = 'o';
        }
        if(Math.abs(roundCounter % 2) == 1) {         
            document.getElementById('player-two-mark').textContent = 'x';
            document.getElementById('player-one-mark').textContent = 'o';
        }
    }

    const newGameBtn = document.getElementById('new-game-btn');
    
    newGameBtn.addEventListener('click', () => {
        roundCounter++
        Gameboard.resetBoard();
        Players.startRound();
        DisplayChange.removeBlockBoard(); 
    })

    return {oTurn, startRound, xWin, oWin, scoreReset, roundCounterReset, drawRotateTurn, playerMarkDisplay, roundCounter};

})();

    // function easyAi() {
    //     for(let i = o; i < 9; i++) {
    //         if(Gameboard.board[i] === '') {
    //             return {i}
    //         }
    //     }
    //     return null
    // }


