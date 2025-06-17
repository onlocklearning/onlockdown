export function createGameState() {
  return {
    gridSize: 5,
    playerPos: { x: 2, y: 2 } // center
  };
}

export function getGridCells(state) {
  const cells = [];
  for (let y = 0; y < state.gridSize; y++) {
    for (let x = 0; x < state.gridSize; x++) {
      cells.push({
        x, y,
        hasPlayer: x === state.playerPos.x && y === state.playerPos.y
      });
    }
  }
  return cells;
}

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
