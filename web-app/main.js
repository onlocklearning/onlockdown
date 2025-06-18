import { createGameState, getVisibleGridCells, movePlayer } from './game.js';

const munchSound = new Audio('assets/sounds/chicken_bite/munch1.mp3'); // adjust path if needed
const container = document.getElementById('game-container');
const hud = document.getElementById('hud');

let state = createGameState();

function render() {
  container.innerHTML = '';

  const cells = getVisibleGridCells(state);
  cells.forEach(cell => {
    const div = document.createElement('div');
    div.classList.add('grid-cell');
  
    if (cell.outOfBounds) {
      div.classList.add('out-of-bounds');
    } else {
      // ✅ 1. Always add tile background first
      const img = document.createElement('img');
      img.src = `./assets/grid_tiles/tile_${cell.x}_${cell.y}.png`;
      img.alt = `Tile ${cell.x},${cell.y}`;
      img.style.width = '80px';
      img.style.height = '80px';
      img.style.objectFit = 'cover';
      img.style.pointerEvents = 'none';
      img.style.position = 'absolute';
      div.appendChild(img);
  
      // ✅ 2. Add corn if present
      if (cell.hasCorn) {
        const cornImg = document.createElement('img');
        cornImg.src = './assets/corn.webp';
        cornImg.alt = 'Corn';
        cornImg.style.width = '60px';
        cornImg.style.height = '60px';
        cornImg.style.position = 'absolute';
        cornImg.style.zIndex = '2';
        cornImg.style.userSelect = 'none';
        cornImg.style.pointerEvents = 'none';
        div.appendChild(cornImg);
      }
  
      // ✅ 3. Add player (chicken) last so it's on top
      if (cell.hasPlayer) {
        const chicken = document.createElement('img');
        chicken.src = 'assets/chicken.webp';
        chicken.alt = 'chicken';
        chicken.classList.add('chicken-img');
        chicken.style.width = '60px';
        chicken.style.height = '60px';
        chicken.style.position = 'absolute';
        chicken.style.zIndex = '3';
        div.appendChild(chicken);
      }
    }
  
    // ✅ Position each cell in a grid (optional: use flex or grid in CSS instead)
    div.style.position = 'relative';
    div.style.width = '80px';
    div.style.height = '80px';
    div.style.overflow = 'hidden';
  
    container.appendChild(div);
  });
  
  // Update corn count in HUD
  if (hud) {
    hud.innerText = `🌽 Corn Collected: ${state.score}`;
  }
}

// Direction handler
function handleMove(direction) {
  const prevScore = state.score;
  state = movePlayer(state, direction);
  render();

  // Play munch sound if score increased
  if (state.score > prevScore) {
    munchSound.currentTime = 0; // rewind in case it's still playing
    munchSound.play();
  }
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
