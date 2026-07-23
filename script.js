let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let turnIndicator = document.querySelector("#turn-indicator");
let winnerModal = document.querySelector("#winner-modal");
let winnerText = document.querySelector("#winner-text");
let modalResetBtn = document.querySelector("#modal-reset-btn");

// Score tracking variables and UI elements
let scoreX = 0;
let scoreO = 0;
let scoreXElement = document.querySelector("#score-x");
let scoreOElement = document.querySelector("#score-o");

// Player Name variables
let nameModal = document.querySelector("#name-modal");
let startGameBtn = document.querySelector("#start-game-btn");
let playerXInput = document.querySelector("#player-x-name");
let playerOInput = document.querySelector("#player-o-name");
let playerXLabel = document.querySelector(".x-score span");
let playerOLabel = document.querySelector(".o-score span");

let playerXName = "Player X";
let playerOName = "Player O";
let isComputerMode = false;
let playComputerCheckbox = document.querySelector("#play-computer");

// Sound Effects (Audio objects)
let clickSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/button_tiny.mp3");
let winSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/bell_ring.mp3");
let drawSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/branch_break.mp3");

let turnO = false; // false = X's turn, true = O's turn
let isGameOver = false;

const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
]

// Start Game Modal Logic
startGameBtn.addEventListener("click", () => {
    isComputerMode = playComputerCheckbox.checked;

    playerXName = playerXInput.value.trim() || "Player X";
    
    if (isComputerMode) {
        playerOName = "Computer 🤖";
        playerOInput.value = "";
    } else {
        playerOName = playerOInput.value.trim() || "Player O";
    }
    
    playerXLabel.innerText = playerXName;
    playerOLabel.innerText = playerOName;
    
    turnO = false; // X starts first
    isGameOver = false;
    turnIndicator.innerText = `${playerXName}'s Turn`;
    turnIndicator.className = "player-turn x-turn";
    
    nameModal.classList.add("hidden");
    clickSound.currentTime = 0;
    clickSound.play();
});

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // Prevent human clicking if it's computer's turn or game over
        if (isComputerMode && turnO) return;
        if (isGameOver) return;

        makeMove(box);
    });
});

const makeMove = (box) => {
    // Reset sound to start and play
    clickSound.currentTime = 0;
    clickSound.play();

    if(turnO === false){
        box.innerText = "X";
        box.classList.add("x-marker");
        turnO = true; 
        turnIndicator.innerText = `${playerOName}'s Turn`;
        turnIndicator.className = "player-turn o-turn";
    }
    else{
        box.innerText = "O";
        box.classList.add("o-marker");
        turnO = false;
        turnIndicator.innerText = `${playerXName}'s Turn`;
        turnIndicator.className = "player-turn x-turn";
    }
    box.disabled = true;
    checkWinner();

    // Trigger computer move if it's computer mode and O's turn
    if (isComputerMode && turnO && !isGameOver) {
        setTimeout(computerMove, 600);
    }
};

const computerMove = () => {
    if (isGameOver) return;
    
    let emptyBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            emptyBoxes.push({ box: box, index: index });
        }
    });

    if (emptyBoxes.length > 0) {
        let moveFound = false;

        // Function to check if a move leads to an immediate win for a given player
        const findWinningMove = (player) => {
            for (let pattern of winPatterns) {
                let val1 = boxes[pattern[0]].innerText;
                let val2 = boxes[pattern[1]].innerText;
                let val3 = boxes[pattern[2]].innerText;

                if (val1 === player && val2 === player && val3 === "") return pattern[2];
                if (val1 === player && val3 === player && val2 === "") return pattern[1];
                if (val2 === player && val3 === player && val1 === "") return pattern[0];
            }
            return -1;
        };

        // 1. Can Computer ("O") win? Take it!
        let winMove = findWinningMove("O");
        if (winMove !== -1) {
            makeMove(boxes[winMove]);
            moveFound = true;
        }

        // 2. Can Human ("X") win? Block them!
        if (!moveFound) {
            let blockMove = findWinningMove("X");
            if (blockMove !== -1) {
                makeMove(boxes[blockMove]);
                moveFound = true;
            }
        }

        // 3. Otherwise, pick random empty box
        if (!moveFound) {
            let randomObj = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
            makeMove(randomObj.box);
        }
    }
};

const disableBoxes = () => {
    for( let box of boxes) {
        box.disabled = true;
    }
};

const showWinner = (winner) => {
    winnerText.innerText = winner + " wins!"; 
    winnerModal.classList.remove("hidden");
    disableBoxes();
};

const resetGame = () => {
    turnO = false;
    isGameOver = false;
    turnIndicator.innerText = `${playerXName}'s Turn`;
    turnIndicator.className = "player-turn x-turn";

    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("o-marker", "x-marker", "winning-box");
    }
    winnerModal.classList.add("hidden");
};

// check winner function 
const checkWinner = () => {
    let winnerFound = false;
    for (let pattern of winPatterns) {
        let posVal1 = boxes[pattern[0]].innerText;
        let posVal2 = boxes[pattern[1]].innerText;
        let posVal3 = boxes[pattern[2]].innerText;

        if(posVal1 !==  "" && posVal2 !== "" && posVal3 !== "") {
            if(posVal1 === posVal2 && posVal2 === posVal3) {
                winnerFound = true;
                
                // Highlight winning boxes
                boxes[pattern[0]].classList.add("winning-box");
                boxes[pattern[1]].classList.add("winning-box");
                boxes[pattern[2]].classList.add("winning-box");  

                // Update score based on the winner
                if (posVal1 === "X") {
                    scoreX++;
                    scoreXElement.innerText = scoreX;
                } else {
                    scoreO++;
                    scoreOElement.innerText = scoreO;
                }

                // Play winning sound
                winSound.play();
                
                // Fire Confetti! 🎉
                confetti({
                    particleCount: 200,
                    spread: 80,
                    origin: { y: 0.6 }
                });

                let winnerName = posVal1 === "X" ? playerXName : playerOName;

                // Show popup with a slight delay
                setTimeout(() => {
                    showWinner(winnerName);
                },1500);

                isGameOver = true;
                return;
            }
        }
    }
    
    if(winnerFound === false) {
        let allFilled = true;
        for(let box of boxes) {
            if(box.innerText === "") {
                allFilled = false;
            }
        }

        if(allFilled === true) {
            winnerText.innerText = "Game Draw!";
            
            // Play draw sound
            drawSound.play();

            winnerModal.classList.remove("hidden");
            isGameOver = true;
        }
    }
};

resetBtn.addEventListener("click", resetGame);
modalResetBtn.addEventListener("click", resetGame);