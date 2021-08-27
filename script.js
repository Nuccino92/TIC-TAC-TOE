const DisplayChange = (() => {
    
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

    const playButton = document.getElementById('play-button');
    const returnButton = document.getElementById('return');
    const setupUi = document.getElementById('setup-ui');
    const gameUi = document.getElementById('game-ui');

    playButton.addEventListener('click', () => {
        openGame()
    });

    returnButton.addEventListener('click', () => {
        setupReturn()
        Gameboard.resetBoard()
    })

    function openGame() {
        setupUi.classList.add('active');
        gameUi.classList.add('active');
    };

    function setupReturn() {
        setupUi.classList.remove('active');
        gameUi.classList.remove('active');
    }
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
        // for(i = 0; i < board.length; i++) {
        //     board[i] = '';
        //     cells[i].textContent = '';
        //     Players.oTurn = false;
        // }
    }
    
    return {board, cells, renderCells, changeBoard, resetBoard};
    
})();

const Players = (() => {
    
    const xMark = 'x';
    const oMark = 'o';
    let oTurn;
    
    const xButton = document.querySelector('.x-button-one')
    const oButton = document.querySelector('.o-button-one')

    xButton.addEventListener('click', setTurnX);
        
    oButton.addEventListener('click', setTurnO);

    function setTurnX() {
        console.log('chicken')
    }

    function setTurnO() {
        (oTurn = !oTurn) 
    }

    Gameboard.cells.forEach(cell  => {
        if(Gameboard.resetBoard) {
            cell.addEventListener('click', cellClicked, {once: false})
        }else
            cell.addEventListener('click', cellClicked, {once: true})
    }) 
    
    function cellClicked(e) { 
        let cell = this.id;
        let currentMark = oTurn ? oMark : xMark;
        placeSelection(cell, currentMark);
        switchTurn();
    }

    function placeSelection(cell, currentMark) {
        Gameboard.changeBoard(cell, currentMark)
        Gameboard.renderCells()
    }
   
    function switchTurn() {
        (oTurn = !oTurn)  
    }
      
     return {oTurn}

})();








