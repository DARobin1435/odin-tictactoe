// GLOBALS || Game, updateDisplay, Player, gameBoard
// GAME: controls flow of game state
// UPDATEDISPLAY: changes the display with the most recent values
// PLAYER: defines player objects
// GAMEBOARD: defines board logic

const GameBoard = (() =>{
    // Array representing the various positions in 3x3
    const board = [];
    function resetGame (){
        gameBoard.innerHTML = "";
        winnerDialog.close();
        noWinnerDialog.close();
        player1.resetClaimedPositions();
        player1.resetIsWinner();
        player2.resetClaimedPositions();
        player2.resetIsWinner();
        makeGameBoard();
    }
    // FUNCTION: To reset game by clearing the board and reset object values
    // Give all elements with class reset-game-button reset functionality
    const resetGameButtons = document.querySelectorAll(".reset-game-button");
    resetGameButtons.forEach(button =>{
        button.addEventListener("click", ()=>{
            resetGame();
        })
    })
    // FUNCTION: reset the game completely
    const startOverButton = document.querySelector(".new-game-button");
    startOverButton.addEventListener("click", ()=>{
        resetGame();
        player1.resetTotalWins();
        player2.resetTotalWins();
    })
    // Define Position object
    let Position = (num) =>{
        return {position: num}
    }
    // Fill array with Position objects numbered 1 - 9 
    for (let i=1; i<=9; i++){
        board.push(Position(i));
    }
    
    // Function to remove click listener after game is over
    const removeClickListeners = ()=>{
        Array.from(gameBoard.children).forEach(child =>{
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
        }, 200)
        
    }
    // MODALS -> for winner and loser
    const winnerDialog = document.querySelector(".winner-dialog");
    const noWinnerDialog = document.querySelector(".no-winner-dialog");
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
                    updateDisplay();

                    if (player1.claimedPositions.length + player2.claimedPositions.length < 9){
                        if (turnPlayer.claimedPositions.length >= 3){
                            winnerDeclared = Game.checkWinner(turnPlayer);
                        }
                        if (winnerDeclared){
                            removeClickListeners();
                            document.querySelectorAll(".winner-dialog .winner-name").forEach(name =>{
                                name.innerText = turnPlayer.name;
                                }
                            )
                            document.querySelector(".winner-dialog .player-wins").innerText = turnPlayer.totalWins;
                            winnerDialog.showModal();
                            return;
                        }else{
                            console.log(`${turnPlayer.name
                            } captured position ${currentPosition} with ${turnPlayer.marker}`)
        
                        }
                    }else if (player1.claimedPositions.length + player2.claimedPositions.length == 9){
                        
                        winnerDeclared = Game.checkWinner(turnPlayer);
                        if(winnerDeclared){
                            winnerDialog.showModal();
                        }
                        if(!winnerDeclared){
                            noWinnerDialog.showModal();
                        }
                    }
    
                }
            })

            gameBoard.appendChild(squareContainer);
        })    
    }
    // Empty board
    // board.splice(0,board.length-1);
    return { get board(){return board},
    showGameContainer,
    makeGameBoard }
})();

// Player object takes a name and a selected marker
let Player = (name, marker) =>{

    let isTurnPlayer = false;
    let claimedPositions = [];
    let isWinner = false;
    let totalWins = 0;
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
    const setTotalWins = ()=>{
        totalWins++;
    }
    const resetTotalWins = ()=>{
        totalWins = 0;
    }
    return {name, marker, resetClaimedPositions,
        setIsTurnPlayer,
        resetIsTurnPlayer, 
        get isTurnPlayer(){return isTurnPlayer},
        setClaimedPositions,
        get claimedPositions() {return claimedPositions},
        setIsWinner,
        resetIsWinner,
        get isWinner() {return isWinner},
        setTotalWins,
        resetTotalWins,
        get totalWins() {return totalWins}
    }
}
// Create players
let player1 = Player("Kaaaaaaaaaaaa", "X");
let player2 = Player("Laaaaaaaaaaaa", "O");


const Game = (() => {
    // Welcome Screen functionality
    const startGameButton = document.querySelector(".start-game-button");
    const nameInput = document.querySelector(".name-input");
    const welcomeScreen = document.querySelector(".welcome-screen");
    const message = "You need to add a name here";
    // let player1, player2;
    startGameButton.addEventListener("click", ()=>{
        // Clear welcome screen and show game container
        if (nameInput.value){
            welcomeScreen.innerHTML = "";
            welcomeScreen.classList.remove("welcome-screen");
            startGame();
            GameBoard.showGameContainer();
            
        }else{
            nameInput.placeholder = message;
        }
    })

    // Choose the first player randomly at start of game
  
    const startGame = () => {
        // Set name values for both players and then add to display
        player1 = Player(nameInput.value, "X");
        player1.setIsTurnPlayer();
        player2 = Player("Laaaaa", "O");
        updateDisplay();
    };

    const changeTurns = () => {
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
                
                let counter = 0;
                for (item of combo){
                    for (pos of player.claimedPositions){
                        if (item == pos){
                            counter++;
                        }
                        if (counter == 3){
                            player.setIsWinner();
                        }
                    }
                }
            }

        })();

        if (player.isWinner) {
            player.setTotalWins();
            return true;
        }
        console.log(`No winner declared`);
        return false;
    }

    return {
        startGame, 
        changeTurns, 
        checkWinner }
    
})();

const updateDisplay = () =>{

    const player1Div = document.querySelector(".player-list .player-name.player-1>span");
    const player2Div = document.querySelector(".player-list .player-name.player-2>span");
    if(player1 && player2){
        player1Div.innerText = player1.name;
        player2Div.innerText = player2.name;
        
        if (player1.isTurnPlayer){
            player1Div.classList.add("is-turn-player");
            player2Div.classList.remove("is-turn-player");
        }else{
            player1Div.classList.remove("is-turn-player");
            player2Div.classList.add("is-turn-player");
        }
    }

    const resetGameBoard = ()=>{
        GameBoard.makeGameBoard();
    };

    

    return { resetGameBoard };
}

// Function calls
GameBoard.makeGameBoard();