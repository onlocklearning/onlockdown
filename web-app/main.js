import R from "./ramda.js";

import { createGameState, getGridCells } from './game.js';

const container = document.getElementById('game-container');
let state = createGameState();

function render() {
  container.innerHTML = '';
  const cells = getGridCells(state);
  cells.forEach(cell => {
    const div = document.createElement('div');
    div.classList.add('grid-cell');
    if(cell.hasPlayer) div.classList.add('player');
    container.appendChild(div);
  });
}

// Initial render
render();
