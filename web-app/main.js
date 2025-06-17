import { createGameState, getVisibleGridCells, movePlayer } from './game.js';

const container = document.getElementById('game-container');

let state = createGameState();

function render() {
  container.innerHTML = '';

  const cells = getVisibleGridCells(state);
  cells.forEach(cell => {
    const div = document.createElement('div');
    div.classList.add('grid-cell');
    if (cell.hasPlayer) div.classList.add('player');
    if (cell.outOfBounds) div.classList.add('out-of-bounds');

    // Add terrain look
    if (!cell.outOfBounds) {
      if ((cell.x + cell.y) % 2 === 0) {
        div.style.backgroundColor = '#3a5'; // green tile 1
      } else {
        div.style.backgroundColor = '#4b6'; // green tile 2
      }
    }
    container.appendChild(div);
  });
}

// Direction handler
function handleMove(direction) {
  state = movePlayer(state, direction);
  render();
}

// --- Smooth continuous movement on key hold ---

const keyMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right'
};

let moveInterval = null;
let currentDirection = null;

window.addEventListener('keydown', (e) => {
  if (!keyMap[e.key]) return; // Ignore other keys

  if (currentDirection === keyMap[e.key]) return; // Already moving in this direction

  currentDirection = keyMap[e.key];

  // Immediately move once on keydown
  handleMove(currentDirection);

  // Start interval to move repeatedly while key held down
  if (moveInterval) clearInterval(moveInterval);
  moveInterval = setInterval(() => {
    handleMove(currentDirection);
  }, 150); // Adjust speed here (150 ms per move)
});

window.addEventListener('keyup', (e) => {
  if (keyMap[e.key] && currentDirection === keyMap[e.key]) {
    clearInterval(moveInterval);
    moveInterval = null;
    currentDirection = null;
  }
});

// Button controls (for mobile)
window.handleMove = handleMove;

// Mobile/on-screen button hold support
let buttonHoldInterval = null;

window.startHold = function(direction) {
  handleMove(direction); // move once immediately
  if (buttonHoldInterval) clearInterval(buttonHoldInterval);
  buttonHoldInterval = setInterval(() => {
    handleMove(direction);
  }, 150);
};

window.stopHold = function() {
  clearInterval(buttonHoldInterval);
  buttonHoldInterval = null;
};

// Initial render
render();

