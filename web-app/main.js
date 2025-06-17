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

// Keyboard controls
window.addEventListener('keydown', (e) => {
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  };

  if (keyMap[e.key]) {
    handleMove(keyMap[e.key]);
  }
});

// Button controls (for mobile)
window.handleMove = handleMove;

// Initial render
render();
