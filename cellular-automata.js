const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  cellSize: 8,
  speed: 200, // milliseconds between generations
  density: 0.3, // initial population density
  colors: {
    alive: '#00f5ff',
    dead: '#0a0a0a',
    border: '#1a1a1a'
  }
};

let grid = [];
let cols, rows;
let lastUpdate = 0;
let generation = 0;

const sketch = ({ context, width, height }) => {
  // Initialize grid dimensions
  cols = Math.floor(width / params.cellSize);
  rows = Math.floor(height / params.cellSize);

  // Create initial random population
  initializeGrid();

  return ({ context, width, height, time }) => {
    context.fillStyle = params.colors.dead;
    context.fillRect(0, 0, width, height);

    // Update grid based on speed parameter
    const currentTime = time * 1000;
    if (currentTime - lastUpdate > params.speed) {
      updateGrid();
      lastUpdate = currentTime;
      generation++;
    }

    // Draw the grid
    drawGrid(context, width, height);

    // Draw generation counter
    drawInfo(context, width, height);
  };
};

function initializeGrid() {
  grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      // Randomly populate cells based on density
      grid[i][j] = Math.random() < params.density ? 1 : 0;
    }
  }
  generation = 0;
}

function updateGrid() {
  const newGrid = [];

  // Create new grid based on Conway's rules
  for (let i = 0; i < cols; i++) {
    newGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      const neighbors = countNeighbors(i, j);
      const currentCell = grid[i][j];

      // Conway's Game of Life rules:
      if (currentCell === 1) {
        // Live cell with 2-3 neighbors survives
        newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
      } else {
        // Dead cell with exactly 3 neighbors becomes alive
        newGrid[i][j] = (neighbors === 3) ? 1 : 0;
      }
    }
  }

  grid = newGrid;
}

function countNeighbors(x, y) {
  let count = 0;

  // Check all 8 neighboring cells
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the cell itself

      const nx = x + i;
      const ny = y + j;

      // Handle edges with wraparound (toroidal topology)
      const wrappedX = (nx + cols) % cols;
      const wrappedY = (ny + rows) % rows;

      count += grid[wrappedX][wrappedY];
    }
  }

  return count;
}

function drawGrid(context, width, height) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * params.cellSize;
      const y = j * params.cellSize;

      if (grid[i][j] === 1) {
        // Draw living cell
        context.fillStyle = params.colors.alive;
        context.fillRect(x, y, params.cellSize, params.cellSize);

        // Add slight glow effect
        context.shadowColor = params.colors.alive;
        context.shadowBlur = 2;
        context.fillRect(x, y, params.cellSize, params.cellSize);
        context.shadowBlur = 0;
      }

      // Draw grid lines (optional, for debugging)
      if (params.cellSize > 4) {
        context.strokeStyle = params.colors.border;
        context.lineWidth = 0.5;
        context.strokeRect(x, y, params.cellSize, params.cellSize);
      }
    }
  }
}

function drawInfo(context, width, height) {
  // Draw generation counter
  context.fillStyle = '#ffffff';
  context.font = '16px monospace';
  context.textAlign = 'left';
  context.fillText(`Generation: ${generation}`, 20, 30);

  // Count living cells
  let livingCells = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      livingCells += grid[i][j];
    }
  }

  context.fillText(`Population: ${livingCells}`, 20, 50);
  context.fillText(`Density: ${(livingCells / (cols * rows) * 100).toFixed(1)}%`, 20, 70);
}

// Add some interesting starting patterns
function addGlider(x, y) {
  const pattern = [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1]
  ];

  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const gridX = (x + i + cols) % cols;
      const gridY = (y + j + rows) % rows;
      grid[gridX][gridY] = pattern[i][j];
    }
  }
}

function addOscillator(x, y) {
  // Blinker pattern
  const pattern = [
    [1, 1, 1]
  ];

  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      const gridX = (x + i + cols) % cols;
      const gridY = (y + j + rows) % rows;
      grid[gridX][gridY] = pattern[i][j];
    }
  }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case 'r':
      // Reset with random population
      initializeGrid();
      break;
    case 'c':
      // Clear grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = 0;
        }
      }
      generation = 0;
      break;
    case 'g':
      // Add some gliders
      addGlider(10, 10);
      addGlider(cols - 15, 10);
      break;
    case 'o':
      // Add oscillators
      for (let i = 0; i < 5; i++) {
        addOscillator(
          Math.floor(Math.random() * cols),
          Math.floor(Math.random() * rows)
        );
      }
      break;
    case ' ':
      // Pause/unpause (by changing speed to very high value)
      params.speed = params.speed === 200 ? 10000 : 200;
      break;
  }
});

console.log('Controls:');
console.log('R - Reset with random population');
console.log('C - Clear grid');
console.log('G - Add gliders');
console.log('O - Add oscillators');
console.log('Space - Pause/Resume');

canvasSketch(sketch, settings);
