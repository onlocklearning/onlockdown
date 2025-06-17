import { createGameState, getGridCells, movePlayer } from './game.js';

const container = document.getElementById('game-container');
let state = createGameState();

function render() {
  container.innerHTML = '';
  const cells = getGridCells(state);
  cells.forEach(cell => {
    const div = document.createElement('div');
    div.classList.add('grid-cell');
    if (cell.hasPlayer) div.classList.add('player');
    container.appendChild(div);
  });
}

function handleMove(direction) {
  state = movePlayer(state, direction);
  render();
}

// Expose to window so buttons can use it
window.handleMove = handleMove;

// Arrow key controls
window.addEventListener('keydown', (e) => {
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  };

  const direction = keyMap[e.key];
  if (direction) {
    state = movePlayer(state, direction);
    render();
  }
});

// Initial render
render();
