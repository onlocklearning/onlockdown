/** 
 * @module game
 * Represents the game state and logic
 */

/**
 * Creates the initial game state
 * @returns {Object} state
 */
export function createGameState() {
  return {
    gridSize: 50,
    playerPos: { x: 25, y: 25 }, // center of 50x50 grid
  };
}

/**
 * Returns visible grid cells around the player, with player in center
 * @param {Object} state 
 * @returns {Array} cells - array of objects {x, y, hasPlayer, outOfBounds}
 */
export function getVisibleGridCells(state) {
  const viewSize = 11;
  const half = Math.floor(viewSize / 2);
  const cells = [];

  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const x = state.playerPos.x + dx;
      const y = state.playerPos.y + dy;

      cells.push({
        x,
        y,
        hasPlayer: dx === 0 && dy === 0,
        outOfBounds: x < 0 || y < 0 || x >= state.gridSize || y >= state.gridSize
      });
    }
  }

  return cells;
}

/**
 * Moves the player one cell in the given direction if valid
 * @param {Object} state - current game state
 * @param {'up'|'down'|'left'|'right'} direction
 * @returns {Object} new state (immutable update)
 */
export function movePlayer(state, direction) {
  const { x, y } = state.playerPos;
  let newX = x;
  let newY = y;

  switch (direction) {
    case 'up': newY = y > 0 ? y - 1 : y; break;
    case 'down': newY = y < state.gridSize - 1 ? y + 1 : y; break;
    case 'left': newX = x > 0 ? x - 1 : x; break;
    case 'right': newX = x < state.gridSize - 1 ? x + 1 : x; break;
  }

  return {
    ...state,
    playerPos: { x: newX, y: newY }
  };
}
