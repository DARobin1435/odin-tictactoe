// GLOBALS || Game, updateDisplay, Player, gameBoard
// GAME: controls flow of game state
// UPDATEDISPLAY: changes the display with the most recent values
// PLAYER: defines player objects
// GAMEBOARD: defines board logic

const GameBoard = (() =>{
    // Array representing the various positions in 3x3
    const board = [];
    // Reset button
    const resetGameButton = document.querySelector(".reset-game-button");
    resetGameButton.addEventListener("click", ()=>{
        gameContainer.innerHTML = "";
        player1.resetClaimedPositions();
        player1.resetIsWinner();
        player2.resetClaimedPositions();
        player2.resetIsWinner();

        makeGameBoard();
    })
    // Define Position object
    let Position = (num) =>{
        return {position: num}
    }
    // Fill array with Position objects numbered 1 - 9 
    for (let i=1; i<=9; i++){
        board.push(Position(i));
    }
    
    const updateBoardArray = (mrkr)=>{
        board.push(mrkr);
    }
    // Function to remove click listener after game is over
    const removeClickListeners = ()=>{
        Array.from(gameContainer.children).forEach(child =>{
            console.log("Square child")
            child.removeEventListener("click", ()=>{;
            console.log("Remove click listener")
            })
        })
        
    }
    // Create game board
    // Define gameContainer here so it is accessible outside
    const gameContainer = document.querySelector(".game-container");
    // Define gameBoard here so it is accessible outside
    const gameBoard = document.querySelector(".game-board");

    // Change visibility setting on gameContainer
    const showGameContainer = ()=>{
        setTimeout(()=>{
            gameContainer.style.display = "flex";
        }, 500)
        
    }
    const makeGameBoard = ()=>{

        // Checks the data-position attribute of the clicked object
        // THEN returns that row value
        // TRIGGERS on click
        function checkPosition(val){
            let rowPosition;
            val = parseInt(val);
            val <=3 ? rowPosition = 1: 
            val <=6 ? rowPosition = 2:
            rowPosition = 3;
            return rowPosition;
        }
        // Create grid
        
        board.forEach(position =>{
            
            let squareContainer = document.createElement("div");
            let square = document.createElement("a");
            squareContainer.classList.add("game-square-container");
            squareContainer.setAttribute("data-position", position.position);

            squareContainer.addEventListener("click", (e)=>{
                
                let currentTarget = e.target;
                if (currentTarget.innerText==""){

                    let turnPlayer;
                    let winnerDeclared;
                    let currentPosition;

                    if(player1.isTurnPlayer){
                        turnPlayer = player1;
                    }else{
                        turnPlayer = player2;
                    }
                    
                    currentPosition = currentTarget.getAttribute("data-position");
                    
                    turnPlayer.setClaimedPositions(parseInt(currentPosition));
                    currentTarget.innerText = turnPlayer.marker;
                    Game.changeTurns();
                    // updateDisplay();
                    if (turnPlayer.claimedPositions.length >= 3){
                        winnerDeclared = Game.checkWinner(turnPlayer);
                    }
                    if (winnerDeclared){
                        alert(`${turnPlayer.name} is winner!`);
                        removeClickListeners();
                        return;
                    }else{
                        console.log(`${turnPlayer.name
                        } captured position ${currentPosition} with ${turnPlayer.marker}`)
    
                    }
                        
                }
                
            })

            gameBoard.appendChild(squareContainer);
        })    
    }
    return { get board(){return board},
    showGameContainer,
    makeGameBoard }
})();

// Player object takes a name and a selected marker
let Player = (name) =>{

    let isTurnPlayer = false;
    let marker;
    let claimedPositions = [];
    let isWinner = false;
    const setIsTurnPlayer = () =>{
        isTurnPlayer = true;
    }
    const resetIsTurnPlayer = () =>{
        isTurnPlayer = false;
    }
    const setClaimedPositions = (pos)=>{
        claimedPositions.push(pos);
        claimedPositions.sort();
    }
    const resetClaimedPositions = ()=>{
        claimedPositions = [];
    }
    const setIsWinner = ()=>{
        isWinner = true;
    }
    const resetIsWinner = ()=>{
        isWinner = false;
    }
    return {name, marker, resetClaimedPositions,
        setIsTurnPlayer,
        resetIsTurnPlayer, 
        get isTurnPlayer(){return isTurnPlayer},
        setClaimedPositions,
        get claimedPositions() {return claimedPositions},
        setIsWinner,
        resetIsWinner,
        get isWinner() {return isWinner}
    }
}
// Create players
let player1 = Player("Kaaaaaaaaaaaa");
let player2 = Player("Laaaaaaaaaaaa");


const Game = ((players) => {
    // Welcome functionality
    const startGameButton = document.querySelector(".start-game-button");
    const nameInput = document.querySelector(".name-input");
    const welcomeScreen = document.querySelector(".welcome-screen");
    startGameButton.addEventListener("click", ()=>{

        welcomeScreen.innerHTML = "";
        welcomeScreen.classList.remove("welcome-screen");
        GameBoard.showGameContainer();
    })

    // Choose the first player randomly at start of game
  
    const startGame = (() => {

        let chosenPlayer = players[Math.floor(Math.random() * 2)];
        let otherPlayer;
        chosenPlayer.setIsTurnPlayer();
        chosenPlayer.marker = "X";
        // If not, put chosenPlayer in first position of array
        // In both cases, set the marker property of the other to "O"
        if (chosenPlayer == players[0]){
            otherPlayer = players[1]
            otherPlayer.marker = "O";
        } else{
            otherPlayer = players[0]
            otherPlayer.marker = "O";
            players.shift();
            players.push(otherPlayer)
        }
    })();

    const changeTurns = () => {
        // Destructure the player Array
        let [ player1, player2 ] = players;
        // Check which is turn player and then reverse those states 
        if (player1.isTurnPlayer) {
            player1.resetIsTurnPlayer();
            player2.setIsTurnPlayer();
        }else{
            player1.setIsTurnPlayer();
            player2.resetIsTurnPlayer();
        }
    }

    const checkWinner = (player) =>{
        
        const winCombos = [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [1,4,7],
            [2,5,8],
            [3,6,9],
            [1,5,9],
            [3,5,7]
        ]
        // Turn player's array of claimed positions
        // Iterate through win combinations, then check the player's array for each combination
        const runCombinations = (()=> {

            for (combo of winCombos){
                if (!player.isWinner){
                    let counter = 0;
                    for (item of combo){
                        for (pos of player.claimedPositions){
                            if (item == pos){
                                counter++;
                            }
                            if (counter == 3){
                                player.setIsWinner();
                                return
                            }
                        }
                    }
                }
            }

        })();

        if (player.isWinner) {
            return true;
        }
        
        return false;
    }

    return { changeTurns, checkWinner }
    
})([player1, player2]);

const updateDisplay = ()=>{

    const player1Div = document.querySelector(".player-list .player-name.player-1>span");
    const player2Div = document.querySelector(".player-list .player-name.player-2>span");
    
    player1Div.innerText = player1.name;
    player2Div.innerText = player2.name;
    
    if (player1.isTurnPlayer){
        player1Div.classList.toggle("is-turn-player");
        player2Div.classList.toggle("is-turn-player");
    }else{
        player1Div.classList.toggle("is-turn-player");
        player2Div.classList.toggle("is-turn-player");
    }

    const resetGameBoard = ()=>{

        GameBoard.makeGameBoard();
    };

    

    return { resetGameBoard };
}

// Function calls
updateDisplay();
GameBoard.makeGameBoard();