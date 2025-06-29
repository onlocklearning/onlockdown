import { createGameState, getVisibleGridCells, movePlayer } from './game.js';
import { mathQuestions } from './mathQuestions.js';

// sounds
const correctSound = new Audio('assets/sounds/correct/correct_1.mp3');
const incorrectSound = new Audio('assets/sounds/wrong/wrong_1.mp3');
const timerSound = new Audio('assets/sounds/timer/timer_loop.mp3'); // replace with your timer sound file
timerSound.loop = true; // loop the sound while timer runs
const munchSound = new Audio('assets/sounds/chicken_bite/munch1.mp3');
const gameOverSound = new Audio('assets/sounds/game_over.mp3');

const container = document.getElementById('game-container');
const hud = document.getElementById('hud');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-game-btn');

const chickenSprites = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image()
};

chickenSprites.up.src = 'assets/images/chicken/chicken_up.png';
chickenSprites.down.src = 'assets/images/chicken/chicken_down.png';
chickenSprites.left.src = 'assets/images/chicken/chicken_left.png';
chickenSprites.right.src = 'assets/images/chicken/chicken_right.png';

let lives = 3;

let currentQuestion = null;      // Store the current math question object
let answerTiles = [];            // Store which grid squares hold which answer


let gameStarted = false;

let autoQuestionInterval = null;
let questionCooldownTimeout = null;

let isGameOver = false;

let hasTriggeredAnswer = false; // Allow movement, but prevent multiple answers

let questionTimer = null;
let questionTimeRemaining = 0;

let countdownInterval = null;

let questionCount = 0;
const tiers = [
  "tier1",
  "tier2",
  "tier3",
  "tier4",
  "tier5",
  "tier6",
  "tier7",
  "tier8"
];
let currentDifficulty = "easy";

// Initialize high score from localStorage or 0 if none found
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

// Update high score display on page load
const highScoreEl = document.querySelector('#high-score h2');
highScoreEl.textContent = `High Score: ${highScore}`;



const tierRewards = {
  tier1: 3,
  tier2: 4,
  tier3: 5,
  tier4: 6,
  tier5: 8,
  tier6: 12,
  tier7: 18,
  tier8: 25
};


function updateHighScore(newScore) {
  if (newScore > highScore) {
    highScore = newScore;
    localStorage.setItem('highScore', highScore);
    highScoreEl.textContent = `High Score: ${highScore}`;
  }
}


function startGame() {
  isGameOver = false; // <-- Reset again to be safe

  if (questionCooldownTimeout) clearTimeout(questionCooldownTimeout);

  startScreen.style.display = 'none';  // hide start screen
  container.style.display = 'flex';    // <-- add this line to show game container
  state = createGameState();            // reset game state
  render();                            // render initial game
  gameStarted = true;
  setTimeout(() => {
    startMathChallenge();
  }, 2000); // 2 second delay (2000ms)
  
}

startBtn.addEventListener('click', startGame);




function resetGame() {
  isGameOver = false; // <-- Reset flag here

  questionCount = 0;
  currentDifficulty = "tier1";
  
  if (questionCooldownTimeout) clearTimeout(questionCooldownTimeout);

  // Reset your game state here
  state = createGameState();

  // Hide game container, show start screen again
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';

  // Hide speech bubble if visible
  const bubble = document.querySelector('.speech-modal');
  if (bubble) {
    bubble.style.display = 'none';
  }

  // Reset score
  document.getElementById('hud').innerText = '';

  // Reset lives (both logic and hearts)
  lives = 3;
  for (let i = 1; i <= 3; i++) {
    const heart = document.getElementById(`heart-${i}`);
    if (heart) heart.style.visibility = 'visible';
  }
  questionCooldownTimeout = null;
  currentQuestion = null;
  answerTiles = [];
  selectedAnswerResult = null;
  hasTriggeredAnswer = false;

}




function startMathChallenge() {
  if (isGameOver) return; // ⛔ Don't show questions if game is over

  if (!gameStarted) {
    startScreen.style.display = 'none';
    container.style.display = 'flex';
    gameStarted = true;
  }

  // Clear any existing timer if question was already active
  if (questionTimer) {
    clearTimeout(questionTimer);
    questionTimer = null;
  }

  // 1. Pick a random math question
  questionCount++;

  // Determine tier index based on questionCount:
  // e.g. every 5 questions, move to next tier (adjust as you like)
  const tierIndex = Math.min(Math.floor(questionCount / 5), tiers.length - 1);
  currentDifficulty = tiers[tierIndex];
  
  const possibleQuestions = mathQuestions.filter(q => q.difficulty === currentDifficulty);
  const questionObj = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];

      currentQuestion = questionObj;

  startCountdown(Math.floor(questionObj.timeLimit / 1000));


  // 2. Build array of answers (1 correct, 3 wrong)
  const options = [
    { text: questionObj.answer, isCorrect: true },
    ...questionObj.wrongAnswers.map(text => ({ text, isCorrect: false }))
  ];

  // 3. Shuffle answers so their order is random
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // 4. Get all visible cells that are empty
  const cells = getVisibleGridCells(state).filter(c => !c.outOfBounds && !(c.hasPlayer));
  const chosenCells = [];

  // 5. Pick 4 random grid squares to place answers on
  while (chosenCells.length < 4 && cells.length > 0) {
    const index = Math.floor(Math.random() * cells.length);
    chosenCells.push(cells.splice(index, 1)[0]);
  }

  // 6. Combine grid location + answer into objects
  answerTiles = chosenCells.map((cell, i) => ({
    ...cell,
    ...options[i]
  }));

  // 7. Re-render the grid with answers shown
  render();
  showSpeechBubble(questionObj.question);

  // 8. Start the timer for this question
  questionTimeRemaining = questionObj.timeLimit || 10000; // default 10 seconds if missing
}



function scheduleNextQuestion() {
  if (questionCooldownTimeout) clearTimeout(questionCooldownTimeout);
  if (isGameOver) return; // <--- prevent scheduling if game over

  const delay = Math.floor(Math.random() * (8000 - 4000 + 1)) + 3000; // Random between 4000–10000 ms

  questionCooldownTimeout = setTimeout(() => {
    startMathChallenge();
  }, delay);
}


function stopAutoQuestions() {
  if (autoQuestionInterval) {
    clearInterval(autoQuestionInterval);
    autoQuestionInterval = null;
  }
}





let state = createGameState();
const GRID_SIZE = 11;
const cellElements = []; // 2D array of divs [row][col]
const tileImages = [];   // 2D array of tile background <img> elements

// Preload a single image, returns Promise<img>
function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

// Build the grid once with tile <img> placeholders
function createGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    const rowCells = [];
    const rowTiles = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const div = document.createElement('div');
      div.classList.add('grid-cell');

      // Create tile background image once and append
      const tileImg = document.createElement('img');
      tileImg.classList.add('grid-tile-img');
      div.appendChild(tileImg);

      container.appendChild(div);
      rowCells.push(div);
      rowTiles.push(tileImg);
    }
    cellElements.push(rowCells);
    tileImages.push(rowTiles);
  }
}


function loseLife() {
  if (lives > 0) {
    const heart = document.getElementById(`heart-${lives}`);
    if (heart) {
      heart.style.visibility = 'hidden';
    }
    lives--;
  }

  if (lives === 0) {
    isGameOver = true; // <-- Important line
    gameOverSound.play();
    updateHighScore(state.score); // <-- Add this line here

  
    console.log('Game Over');
    gameOverSound.play();
    // ❌ Clear question and answer UI
    answerTiles = [];
    currentQuestion = null;
    selectedAnswerResult = null;
    hasTriggeredAnswer = false;

  
    // Show the Game Over overlay
    const gameOverScreen = document.getElementById('game-over-screen');
    
    gameOverScreen.classList.remove('hidden');
  
    // Hide it after 3 seconds and reset the game
// Wait for player to click Retry

  }

}


function hideTimer() {
  const timerEl = document.getElementById('bubble-timer');
  if (timerEl) {
    timerEl.textContent = '';
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}


// Render updates the existing elements without clearing tile images
async function render() {
  const cells = getVisibleGridCells(state);

  // Preload all visible tile images first to prevent flicker
  const preloadPromises = cells.map(cell =>
    preloadImage(`./assets/grid_tiles/tile_${cell.x}_${cell.y}.png`)
      .catch(() => null) // ignore missing images gracefully
  );
  const loadedImages = await Promise.all(preloadPromises);

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = cells[i];
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const div = cellElements[row][col];
    const tileImg = tileImages[row][col];

    if (cell.outOfBounds || !loadedImages[i]) {
      tileImg.src = './assets/images/transparent.png';
      div.classList.add('out-of-bounds');
    } else {
      tileImg.src = loadedImages[i].src;
      div.classList.remove('out-of-bounds');
    }

    // Remove all children except the tile background image (index 0)
    while (div.childNodes.length > 1) {
      div.removeChild(div.lastChild);
    }

    // Check if this cell has an answer on it

    const answer = answerTiles.find(tile => tile.x === cell.x && tile.y === cell.y);

    if (answer) {
      const span = document.createElement('span');
      span.innerHTML = `\\(${answer.text}\\)`; // MathJax inline format
      span.classList.add('answer-label');

      if (selectedAnswerResult) {
        if (answer.text === currentQuestion.answer) {
          span.classList.add('correct');
        } else {
          span.classList.add('incorrect');
        }
      }      
      div.appendChild(span);
    }

    // Add corn image if present
    if (cell.hasCorn) {
      const cornImg = document.createElement('img');
      cornImg.src = './assets/images/corn/corn.png';
      cornImg.alt = 'Corn';
      cornImg.classList.add('corn-img');

      // Apply a random rotation between -15 and +15 degrees

      const angle = cell.cornStyle?.rotation ?? 0;
      const scale = cell.cornStyle?.scale ?? 1;
      cornImg.style.transform = `rotate(${angle}deg) scale(${scale})`;
    

      div.appendChild(cornImg);
    }

    // Add player (chicken) image if present
    if (cell.hasPlayer) {
      const chicken = document.createElement('img');
      const facing = state.facing || 'down';
      chicken.src = chickenSprites[facing].src;
      chicken.alt = 'chicken';
      chicken.classList.add('chicken-img');
      div.appendChild(chicken);
    }
  }

  if (hud) {
    hud.innerText = ` ${state.score} 🌽`;
  }
  // Ask MathJax to re-typeset new LaTeX content
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise().catch((err) => console.error("MathJax render error:", err));
  }

}



function startCountdown(seconds) {
  const timerEl = document.getElementById('bubble-timer');
  let timeLeft = seconds;

  timerEl.style.display = 'block';
  timerSound.currentTime = 0;
  timerSound.play();
  timerEl.textContent = `⏳ ${timeLeft}s`;

  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }
  
    timeLeft--;
    timerEl.textContent = `⏳ ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      timerEl.textContent = '⏳ 0s';
      timerSound.pause();
      incorrectSound.play();


      if (!hasTriggeredAnswer) {
        loseLife();
        answerTiles = [];
        selectedAnswerResult = null;
        hasTriggeredAnswer = false;
        render();
        hideSpeechBubble();
      }
      scheduleNextQuestion();  // wait 5 seconds after timeout
    }
  }, 1000);
}



function showSpeechBubble(text) {
  const bubble = document.getElementById("question-bubble");
  const questionEl = document.getElementById("bubble-question");

  questionEl.innerHTML = `\\(${text}\\)?`;

  bubble.style.display = '';
  bubble.classList.remove("hidden");

  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([questionEl])
      .catch((err) => console.error("MathJax bubble render error:", err));
  }
}




function hideSpeechBubble() {
  const bubble = document.getElementById("question-bubble");
  bubble.classList.add("hidden");
}


let selectedAnswerResult = null; // <-- global state variable

function handleMove(direction) {
  if (!gameStarted || isGameOver) return; // ⛔ No moving after game over

  const prevScore = state.score;
  state = movePlayer(state, direction);
  render();

  if (state.score > prevScore) {
    munchSound.currentTime = 0;
    munchSound.play();
  }

  const playerCell = getVisibleGridCells(state).find(c => c.hasPlayer);
  const answer = answerTiles.find(tile => tile.x === playerCell.x && tile.y === playerCell.y);

  if (answer && !hasTriggeredAnswer) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    hideTimer();

    
    hasTriggeredAnswer = true;
    selectedAnswerResult = answer;
  
    if (answer.isCorrect) {
      correctSound.play();
      const reward = tierRewards[currentQuestion.difficulty] || 0;
      state.score += reward;
      updateHighScore(state.score);  // <-- Add this line here

    
      // Floating reward effect
      const rewardEl = document.getElementById('floating-reward');
      const rewardText = document.getElementById('reward-text');
      if (rewardEl && rewardText) {
        rewardText.textContent = `+${reward} 🌽`;
        rewardEl.classList.remove('hidden');
        rewardEl.classList.add('show');
    
        setTimeout(() => {
          rewardEl.classList.remove('show');
          rewardEl.classList.add('hidden');
        }, 700);
      }
    }
         else {
      incorrectSound.play();
      loseLife(); // 💥 Lose life if wrong
    }
  
    const allAnswerSpans = document.querySelectorAll('.answer-label');
    allAnswerSpans.forEach(span => {
      span.classList.add('fade-out');
    });
  
    setTimeout(() => {
      answerTiles = [];
      selectedAnswerResult = null;
      hasTriggeredAnswer = false;
      render();
    }, 600);
  
    hideSpeechBubble();
    scheduleNextQuestion();  // wait 5 seconds after answer

  }
  
}
    


const keyMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

let moveInterval = null;
let currentDirection = null;




document.getElementById('lose-life-btn').addEventListener('click', loseLife);

window.addEventListener('keydown', (e) => {
  if (!keyMap[e.key]) return;
  if (currentDirection === keyMap[e.key]) return;

  currentDirection = keyMap[e.key];
  handleMove(currentDirection);

  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    handleMove(currentDirection);
  }, 150);
});

window.addEventListener('keyup', (e) => {
  if (keyMap[e.key] && currentDirection === keyMap[e.key]) {
    clearInterval(moveInterval);
    moveInterval = null;
    currentDirection = null;
  }
});

window.handleMove = handleMove;

let buttonHoldInterval = null;

window.startHold = function (direction) {
  handleMove(direction);
  if (buttonHoldInterval) clearInterval(buttonHoldInterval);
  buttonHoldInterval = setInterval(() => {
    handleMove(direction);
  }, 150);
};

window.stopHold = function () {
  clearInterval(buttonHoldInterval);
  buttonHoldInterval = null;
};

window.addEventListener('DOMContentLoaded', () => {
  // Setup grid
  createGrid();
  render();


  // Show start screen
  startScreen.style.display = 'flex';

  // Start math challenge button
  document.getElementById('start-challenge-btn').addEventListener('click', startMathChallenge);

  // Reset button (die button)
  document.getElementById('reset-btn').addEventListener('click', resetGame);

  // Arrow animation setup
  const arrows = document.querySelectorAll('.arrow-btn');
  arrows.forEach((btn) => btn.classList.add('pulsing'));

  setTimeout(() => {
    arrows.forEach((btn) => btn.classList.remove('pulsing'));

    const wrappers = document.querySelectorAll('.arrow-wrapper');
    wrappers.forEach(wrapper => {
      wrapper.style.opacity = '0.2';
    });
  }, 5000);

  const wrappers = document.querySelectorAll('.arrow-wrapper');
  wrappers.forEach(wrapper => {
    wrapper.style.opacity = '1';
  });
});

document.getElementById('retry-btn').addEventListener('click', () => {
  const gameOverScreen = document.getElementById('game-over-screen');
  gameOverScreen.classList.add('hidden');
  resetGame();
  startGame();  // Immediately start the game again
});





