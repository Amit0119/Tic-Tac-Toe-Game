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

// Sound Effects (Audio objects)
let clickSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/button_tiny.mp3");
let winSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/bell_ring.mp3");
let drawSound = new Audio("https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/branch_break.mp3");

let turnO = true; // playerX, playerO

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

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // Reset sound to start and play
        clickSound.currentTime = 0;
        clickSound.play();

        if(turnO === true){
            box.innerText = "O";
            box.classList.add("o-marker");
            turnO = false; 
            turnIndicator.innerText = "X's Turn";
            turnIndicator.className = "player-turn x-turn"
        }
        else{
            box.innerText = "X";
            box.classList.add("x-marker");
            turnO = true;
            turnIndicator.innerText = "o's Turn";
            turnIndicator.className = "player-turn o-turn";
        }
        box.disabled = true;
        checkWinner();
    });
});

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
    turnO = true;
    turnIndicator.innerText = "o's Turn";
    turnIndicator.className = "player-turn o-turn";

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

                // Show popup with a slight delay
                setTimeout(() => {
                    showWinner(posVal1);
                },1500)
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
        }
    }
};

resetBtn.addEventListener("click", resetGame);
modalResetBtn.addEventListener("click", resetGame);