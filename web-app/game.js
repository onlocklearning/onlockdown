/**
 * @module game
 * Represents the game state and logic
 */

export function createGameState() {
  const gridSize = 50;
  const playerPos = { x: 25, y: 25 };
  const corn = generateCorn(90, gridSize); // 20 corn pieces
  const score = 0;

  return {
    gridSize,
    playerPos,
    corn,
    score,
    facing: 'down'  // ← new default direction

  };
}

function generateCorn(count, gridSize) {
  const cornSet = new Set();
  while (cornSet.size < count) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    cornSet.add(`${x},${y}`);
  }

  return Array.from(cornSet).map(str => {
    const [x, y] = str.split(',').map(Number);
  
    // Generate consistent per-corn style
    const rotation = (Math.random() * 160) - 15;   // -15 to +15 degrees
    const scale = 0.9 + Math.random() * 0.2;      // 0.9 to 1.1 scale
  
    return { x, y, cornStyle: { rotation, scale } };
  });
}

export function getVisibleGridCells(state) {
  const viewSize = 11;
  const half = Math.floor(viewSize / 2);
  const cells = [];

  for (let dy = -half; dy <= half; dy++) {
    for (let dx = -half; dx <= half; dx++) {
      const x = state.playerPos.x + dx;
      const y = state.playerPos.y + dy;

      const cornObj = state.corn.find(c => c.x === x && c.y === y);

      cells.push({
        x,
        y,
        hasPlayer: dx === 0 && dy === 0,
        outOfBounds: x < 0 || y < 0 || x >= state.gridSize || y >= state.gridSize,
        hasCorn: !!cornObj,
        cornStyle: cornObj?.cornStyle
      });    }
  }

  return cells;
}

export function movePlayer(state, direction) {
  const { x, y } = state.playerPos;
  let newX = x;
  let newY = y;

  switch (direction) {
    case 'up':    newY = y > 0 ? y - 1 : y; break;
    case 'down':  newY = y < state.gridSize - 1 ? y + 1 : y; break;
    case 'left':  newX = x > 0 ? x - 1 : x; break;
    case 'right': newX = x < state.gridSize - 1 ? x + 1 : x; break;
  }

  const collected = state.corn.find(c => c.x === newX && c.y === newY);
  let newCorn = state.corn.filter(c => c.x !== newX || c.y !== newY);
  let newScore = state.score;

  if (collected) {
    newScore += 1;

    // Generate new corn at random empty spot
    let newSpot = null;
    const occupied = new Set(newCorn.map(c => `${c.x},${c.y}`));
    occupied.add(`${newX},${newY}`); // Don't spawn on player

    while (true) {
      const randX = Math.floor(Math.random() * state.gridSize);
      const randY = Math.floor(Math.random() * state.gridSize);
      const key = `${randX},${randY}`;
      if (!occupied.has(key)) {
        newSpot = { x: randX, y: randY };
        break;
      }
    }

    newCorn.push(newSpot); 
  }

  return {
    ...state,
    playerPos: { x: newX, y: newY },
    corn: newCorn,
    score: newScore,
    facing: direction // ← this sets the facing to last moved direction

  };
}
