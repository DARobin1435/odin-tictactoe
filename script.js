const GameBoard = (() =>{
    // Array representing the various positions in 3x3
    const board = [];
    // Define Position object
    let Position = (num) =>{
        return {position: num}
    }
    // Fill array with Position objects numbered 1 - 9 
    for (let i=1; i<=9; i++){
        board.push(Position(i));
    }
    // Create game board
    const makeGameBoard = (()=>{

        // Checks the data-position attribute of the clicked object
        // THEN returns that row value
        // TRIGGERS on click
        function checkPosition(val){
            let rowPosition;
            val = parseInt(val);
            val <=3 ? rowPosition = 1: 
            val<=6 ? rowPosition = 2:
            rowPosition = 3;
            return rowPosition;
        }
        // Create grid
        const gameContainer = document.querySelector(".game-container");
        board.forEach(position =>{
            
            let squareContainer = document.createElement("div");
            let square = document.createElement("a");
            squareContainer.classList.add("game-square-container");
            squareContainer.setAttribute("data-position", position.position);

            squareContainer.addEventListener("click", (e)=>{
                let currentTarget = e.target;
                let turnPlayer;

                if(player1.isTurnPlayer){
                    turnPlayer = player1;
                }else{
                    turnPlayer = player2;
                }
                
                let currentPosition = currentTarget.getAttribute("data-position");
                currentTarget.innerText = "X"
                turnPlayer.claimedPositions[`row${checkPosition(currentPosition)}`].push(currentPosition);
                console.log(`${turnPlayer.name} captured position ${currentPosition} with ${turnPlayer.marker}`)
            })

            gameContainer.appendChild(squareContainer);
        })    
    })();

})();

// Player object takes a name and a selected marker
let Player = (name) =>{

    let isTurnPlayer = false;
    let marker;
    let claimedPositions = {
        row1: [],
        row2: [],
        row3: [],
        col1: [],
        col2: [],
        col3: []
    }
    return {name, marker, isTurnPlayer, claimedPositions}
}
// Create players
let player1 = Player("Kaaaaaaaaaaaa");
let player2 = Player("Laaaaaaaaaaaa");
// GLOBALS || Game, updateDisplay, Player, gameBoard
// GAME: controls flow of game state
// UPDATEDISPLAY: changes the display with the most recent values
// PLAYER: defines player objects
// GAMEBOARD: defines board logic

const player1Div = document.querySelector(".player-list .player-name.player-1>span");
const player2Div = document.querySelector(".player-list .player-name.player-2>span");

player1Div.innerText = player1.name;
player2Div.innerText = player2.name;


const Game = ((players) => {

    // Choose the first player randomly at start of game
    const startGame = (() => {
        let chosenPlayer = players[Math.floor(Math.random * 2)];
        chosenPlayer.isTurnPlayer = true;
        chosenPlayer.marker = "X";
        // If not, put chosenPlayer in first position of array
        // In both cases, set the marker property of the other to "O"
        if (chosenPlayer == players[0]){
            players[1].marker = "O";
        } else{
            players[0].marker = "O";
            [[chosenPlayer, players[0]]] = players
        }
    });

    const changeTurns = () => {
        // Destructure the player Array
        let [ player1, player2 ] = players;
        // Check which is turn player and then reverse those states 
        if (player1.isTurnPlayer) {
            player1.isTurnPlayer = false;
            player2.isTurnPlayer = true;
        }else{
            player2.isTurnPlayer = false;
            player1.isTurnPlayer = true;
        }
    }

    return { changeTurns }
    
})([player1, player2]);

const updateDisplay = ()=>{

    if (player1.isTurnPlayer){
        player1Div.classList.toggle("is-turn-player");
        player2Div.classList.toggle("is-turn-player");
    }else{
        player1Div.classList.toggle("is-turn-player");
        player2Div.classList.toggle("is-turn-player");
    }
}