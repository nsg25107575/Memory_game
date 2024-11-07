const cards = [
    "1", "2", "1", "2", 
    "3", "4", "3", "4", 
    "5", "6", "5", "6", 
    "7", "8", "7", "8"
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

let flippedCards = [];
let matchedCards = 0;
let movesCounter = 0;
let startTime = 0;
let gameTime = 0;
let timer;
let gameBoard = document.getElementById("gameBoard");

const matchSound = new Audio('sounds/match-cave-164967.mp3');
const mismatchSound = new Audio('sounds/match-lighting-candle-81020.mp3');

function startGame() {
    shuffleArray(cards);
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedCards = 0;
    movesCounter = 0;
    gameTime = 0;
    clearInterval(timer);
    
    document.getElementById("movesCounter").textContent = movesCounter;
    document.getElementById("gameTime").textContent = gameTime;

    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-card", card);
        cardElement.setAttribute("data-index", index);
        cardElement.addEventListener("click", flipCard);
        gameBoard.appendChild(cardElement);
    });

    startTimer();
}


function flipCard(event) {
    const clickedCard = event.target;

    if (flippedCards.length === 2 || clickedCard.classList.contains("flipped") || clickedCard.classList.contains("matched")) {
        return; // Якщо вже дві карти перевернуті або карта вже перевернута/совпала
    }

    clickedCard.classList.add("flipped");
    clickedCard.innerHTML = clickedCard.getAttribute("data-card");
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        movesCounter++;
        document.getElementById("movesCounter").textContent = movesCounter; // Оновлюємо кількість ходів
        checkForMatch();
    }
}

// Перевірка на співпадіння карт
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute("data-card") === card2.getAttribute("data-card")) {
        matchSound.play();  // Якщо карти співпали, грає звук для співпадінь
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedCards++;

        if (matchedCards === cards.length / 2) {
            clearInterval(timer);
            alert(`You win! Moves: ${movesCounter}, Time: ${gameTime} seconds.`);
        }
    } else {
        mismatchSound.play();  // Якщо карти не співпали, грає звук для несупадінь
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.innerHTML = "";
            card2.innerHTML = "";
        }, 1000);
    }

    flippedCards = [];
}

// Таймер гри
function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        gameTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("gameTime").textContent = gameTime;
    }, 1000);
}

// Вибір теми
document.getElementById("lightThemeButton").addEventListener("click", () => {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    document.querySelectorAll(".game-board .card").forEach(card => card.classList.remove("dark-theme"));
});

document.getElementById("darkThemeButton").addEventListener("click", () => {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    document.querySelectorAll(".game-board .card").forEach(card => card.classList.add("dark-theme"));
});

// Запуск гри при завантаженні сторінки
window.onload = startGame;
