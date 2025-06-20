import { createGameState, getVisibleGridCells, movePlayer } from './game.js';
import { mathQuestions } from './mathQuestions.js';

const munchSound = new Audio('assets/sounds/chicken_bite/munch1.mp3');
const container = document.getElementById('game-container');
const hud = document.getElementById('hud');


let currentQuestion = null;      // Store the current math question object
let answerTiles = [];            // Store which grid squares hold which answer



function startMathChallenge() {
  // 1. Pick a random math question
  const questionObj = mathQuestions[Math.floor(Math.random() * mathQuestions.length)];
  currentQuestion = questionObj;

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
      div.appendChild(span);
    }

    // Add corn image if present
    if (cell.hasCorn) {
      const cornImg = document.createElement('img');
      cornImg.src = './assets/corn.webp';
      cornImg.alt = 'Corn';
      cornImg.classList.add('corn-img');
      div.appendChild(cornImg);
    }

    // Add player (chicken) image if present
    if (cell.hasPlayer) {
      const chicken = document.createElement('img');
      chicken.src = 'assets/chicken.webp';
      chicken.alt = 'chicken';
      chicken.classList.add('chicken-img');
      div.appendChild(chicken);
    }
  }

  if (hud) {
    hud.innerText = `🌽 Corn Collected: ${state.score}`;
  }
  // Ask MathJax to re-typeset new LaTeX content
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise().catch((err) => console.error("MathJax render error:", err));
  }

}


function showSpeechBubble(text) {
  const bubble = document.getElementById("question-bubble");
  const speechText = document.getElementById("speech-text");

  // Find the chicken's position in pixels
  const chickenEl = document.querySelector('.chicken-img');
  if (!chickenEl) return;

  const rect = chickenEl.getBoundingClientRect();

  const bubbleWidth = 200;
  const offsetY = 70;

  bubble.style.left = `${rect.left + rect.width / 2 - bubbleWidth / 2}px`;
  bubble.style.top = `${rect.top - offsetY}px`;
  bubble.style.width = `${bubbleWidth}px`;

  speechText.textContent = text;
  bubble.classList.remove("hidden");
}


function hideSpeechBubble() {
  const bubble = document.getElementById("question-bubble");
  bubble.classList.add("hidden");
}



// Handle player movement
function handleMove(direction) {
  const prevScore = state.score;
  state = movePlayer(state, direction);
  render();

  if (state.score > prevScore) {
    munchSound.currentTime = 0;
    munchSound.play();
  }

      // Check if player just stepped on a correct answer
      const playerCell = getVisibleGridCells(state).find(c => c.hasPlayer);
      const answer = answerTiles.find(tile => tile.x === playerCell.x && tile.y === playerCell.y);
  
      if (answer) {
        // Remove question bubble
        hideSpeechBubble();
  
        // Clear the answerTiles so they don't keep showing
        answerTiles = [];
  
        // Optional: do something with correct/incorrect
        if (answer.isCorrect) {
          console.log("✅ Correct!");
        } else {
          console.log("❌ Incorrect!");
        }
  
        render(); // re-render to remove answer labels
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
  createGrid();
  render();

  const arrows = document.querySelectorAll('.arrow-btn');
  arrows.forEach((btn) => btn.classList.add('pulsing'));

  setTimeout(() => {
    arrows.forEach((btn) => btn.classList.remove('pulsing'));
  }, 5000);

  document.getElementById('start-challenge-btn').addEventListener('click', startMathChallenge);

});
