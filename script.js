const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let matches = 0;
let timeLeft = 40;
let timer;
let timerStarted = false;
let gameActive = true;

// Score & Timer Display
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

// Sound Effects
const flipSound = new Audio('https://www.fesliyanstudios.com/play-mp3/4382'); 
const tingSound = new Audio('https://pixabay.com/sound-effects/snd-fragment-retrievewav-14728/'); 

// Background Music
let isPlaying = false;
const bgMusic = document.getElementById("bg-music");
const playBtn = document.querySelector(".play-sound-btn");

// Timer Function
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showGameOverCard(false);
    }
  }, 1000);
}

// Start Timer on First Click
cards.forEach(card => card.addEventListener('click', function startGame() {
  startTimer();
  cards.forEach(card => card.removeEventListener('click', startGame));
}));

// Flip Card Function
function flipCard() {
  if (!gameActive || lockBoard || this === firstCard) return;

  flipSound.play();
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  hasFlippedCard = false;
  secondCard = this;
  checkForMatch();
}

// Check for Match
function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    tingSound.play();
    disableCards();
    updateScore();
    matches++;

    if (matches === 6) {
      clearInterval(timer);
      showGameOverCard(true);
    }
  } else {
    unflipCards();
  }
}

// Disable Matched Cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

// Unflip Cards if Not Matched
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

// Reset Board
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Update Score
function updateScore() {
  score += 10;
  scoreDisplay.innerText = `Score: ${score}`;
}

// Show Game Over Card
function showGameOverCard(won) {
  setTimeout(() => {
    const gameOverCard = document.getElementById("gameOverCard");
    const gameOverEmoji = document.getElementById("gameOverEmoji");
    const gameOverText = document.getElementById("gameOverText");

    gameOverText.innerText = won ? "🎉 You Won! 🎉" : "😢 You Lost! 😢";
    gameOverEmoji.src = won ? "https://tse2.mm.bing.net/th?id=OIP._L3HX4liRiwmIHcU9xg8swHaHa&pid=Api&P=0&h=180" : "https://tse4.mm.bing.net/th?id=OIP.gf6q5A9i7zDDuHuyh3vUxAAAAA&pid=Api&P=0&h=180"; // Replace with actual images

    gameOverCard.style.display = "flex";
    setTimeout(() => {
      gameOverCard.style.opacity = "1";
    }, 100);
  }, 500);

  // Disable all cards
  document.querySelectorAll(".memory-card").forEach(card => {
    card.classList.add("disabled");
  });

  // Stop any further game interactions
  gameActive = false;
}

// Restart Game
function restartGame() {
  const gameOverCard = document.getElementById("gameOverCard");
  
  // Hide Game Over Pop-up
  gameOverCard.style.display = "none";
  gameOverCard.style.opacity = "0";

  // Reset All Cards
  document.querySelectorAll(".memory-card").forEach(card => {
    card.classList.remove("disabled", "flip");
    card.addEventListener('click', flipCard);
  });

  // Reset Variables
  score = 0;
  matches = 0;
  timeLeft = 40;
  timerStarted = false;
  gameActive = true;
  scoreDisplay.innerText = "Score: 0";
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;

  // Restart Timer
  clearInterval(timer);
  shuffle();
}

// Shuffle Cards
function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
}

// Play / Pause Background Music
function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        playBtn.innerText = "🔊 Play Music";
    } else {
        bgMusic.play();
        playBtn.innerText = "⏸ Pause Music";
    }
    isPlaying = !isPlaying;
}

// Event Listener for Card Flip
cards.forEach(card => card.addEventListener('click', flipCard));

// Restart & Back Button Functionality
document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("backButton");
  const playAgainButton = document.getElementById("playAgainButton");

  if (backButton) {
      backButton.addEventListener("click", () => {
          window.history.back();
      });
  }

  if (playAgainButton) {
      playAgainButton.addEventListener("click", restartGame);
  }
});

// Initial Shuffle
shuffle();





