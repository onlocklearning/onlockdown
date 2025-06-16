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
      gridSize: 5,
      playerPos: { x: 2, y: 2 }, // center of 5x5 grid
      // future: enemies, timer, score, etc.
    };
  }
  
  /**
   * Returns an array of grid cells with player position marked
   * @param {Object} state 
   * @returns {Array} cells - array of objects {x, y, hasPlayer}
   */
  export function getGridCells(state) {
    const cells = [];
    for(let y=0; y<state.gridSize; y++) {
      for(let x=0; x<state.gridSize; x++) {
        cells.push({
          x, y,
          hasPlayer: x === state.playerPos.x && y === state.playerPos.y
        });
      }
    }
    return cells;
  }
  