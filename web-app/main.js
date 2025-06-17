import { createGameState, getVisibleGridCells, movePlayer } from './game.js';

const container = document.getElementById('game-container');
const hud = document.getElementById('hud');

let state = createGameState();

function render() {
  container.innerHTML = '';

  const cells = getVisibleGridCells(state);
  cells.forEach(cell => {
    const div = document.createElement('div');
    div.classList.add('grid-cell');
    if (cell.hasPlayer) {
      const chicken = document.createElement('img');
      chicken.src = 'assets/chicken.webp'; 
      chicken.alt = 'chicken';
      chicken.classList.add('chicken-img');
      div.appendChild(chicken);
    }
        if (cell.outOfBounds) div.classList.add('out-of-bounds');

    // Terrain style
    if (!cell.outOfBounds) {
      if ((cell.x + cell.y) % 2 === 0) {
        div.style.backgroundColor = '#3a5';
      } else {
        div.style.backgroundColor = '#4b6';
      }

      // Show corn image instead of yellow tile
      if (cell.hasCorn) {
        const cornImg = document.createElement('img');
        cornImg.src = './assets/corn.webp';  // Adjust path to your image location
        cornImg.alt = 'Corn';
        cornImg.style.width = '60px';   // Fit nicely inside grid cell (80px assumed)
        cornImg.style.height = '60px';
        cornImg.style.userSelect = 'none';
        cornImg.style.pointerEvents = 'none';
        div.appendChild(cornImg);
      }
    }

    container.appendChild(div);
  });

  // Update corn count in HUD
  if (hud) {
    hud.innerText = `🌽 Corn Collected: ${state.score}`;
  }
}

// Direction handler
function handleMove(direction) {
  state = movePlayer(state, direction);
  render();
}

const keyMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right'
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

window.startHold = function(direction) {
  handleMove(direction);
  if (buttonHoldInterval) clearInterval(buttonHoldInterval);
  buttonHoldInterval = setInterval(() => {
    handleMove(direction);
  }, 150);
};

window.stopHold = function() {
  clearInterval(buttonHoldInterval);
  buttonHoldInterval = null;
};

window.addEventListener('DOMContentLoaded', () => {
  const arrows = document.querySelectorAll('.arrow-btn');
  arrows.forEach(btn => btn.classList.add('pulsing'));

  setTimeout(() => {
    arrows.forEach(btn => btn.classList.remove('pulsing'));
  }, 5000);
});

render();
