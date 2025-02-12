/***********************
     * Global Variables
     ***********************/
let matrixSize, matrix, currentStep = { x: 0, y: 0 };
const CELL_SIZE = 48; // Must match CSS
const CELL_GAP = 2;   // Must match CSS
let isPaused = false; // Animation pause flag

// Cache for output cells (to update highlights without re-rendering)
let outputCells = [];

/***********************
 * DOM Elements
 ***********************/
const inputGrid = document.getElementById('input-grid');
const outputGrid = document.getElementById('output-grid');
const slidingWindow = document.getElementById('sliding-window');
const matrixSizeInput = document.getElementById('matrix-size');
const filterSizeInput = document.getElementById('filter-size');
const strideInput = document.getElementById('stride');
const paddingInput = document.getElementById('padding');
const operationSelect = document.getElementById('operation');
const pauseResumeButton = document.getElementById('pause-resume');

/***********************
 * Initialization
 ***********************/
function initialize() {
  // Read initial matrix size from input
  matrixSize = parseInt(matrixSizeInput.value) || 9;
  matrix = createMatrix(matrixSize);
  renderMatrix();
  updateVisualization();
  // Start the sliding window animation
  resetAnimation();
}

/***********************
 * Animation Reset Function
 ***********************/
function resetAnimation() {
  // Cancel any ongoing transition by disabling it and resetting current step
  slidingWindow.style.transition = 'none';
  currentStep = { x: 0, y: 0 };
  slidingWindow.style.transform = 'translate(2px, 2px)';
  // Force reflow so the change takes effect immediately
  void slidingWindow.offsetWidth;
  // Re-enable transition if not paused and start movement after a short delay
  if (!isPaused) {
    setTimeout(() => {
      slidingWindow.style.transition = 'transform 1.0s cubic-bezier(0.34, 1.0, 0.64, 1)';
      moveSlidingWindow();
    }, 50);
  }
}

/***********************
 * Pause/Resume Toggle Function
 ***********************/
function togglePause() {
  if (!isPaused) {
    // Pause the animation
    isPaused = true;
    // Read the computed transform and freeze the element by disabling transition
    const computedTransform = window.getComputedStyle(slidingWindow).transform;
    slidingWindow.style.transition = 'none';
    slidingWindow.style.transform = computedTransform;
    // Change button text and style
    pauseResumeButton.textContent = '▶ Resume';
    pauseResumeButton.classList.add('paused');
  } else {
    // Resume the animation
    isPaused = false;
    // Re-enable transition property
    slidingWindow.style.transition = 'transform 1.0s cubic-bezier(0.34, 1.0, 0.64, 1)';
    pauseResumeButton.textContent = '❚❚ Pause';
    pauseResumeButton.classList.remove('paused');
    // Continue moving from the current state
    moveSlidingWindow();
  }
}

/***********************
 * Matrix and Visualization Functions
 ***********************/
function createMatrix(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1)
  );
}

function renderMatrix() {
  const padding = parseInt(paddingInput.value);
  const totalSize = matrixSize + padding * 2;
  inputGrid.style.gridTemplateColumns = `repeat(${totalSize}, ${CELL_SIZE}px)`;
  inputGrid.innerHTML = '';
  for (let i = 0; i < totalSize; i++) {
    for (let j = 0; j < totalSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      const isPadded = i < padding || i >= totalSize - padding || j < padding || j >= totalSize - padding;
      if (!isPadded) {
        const originalI = i - padding;
        const originalJ = j - padding;
        cell.textContent = matrix[originalI][originalJ];
        cell.className += ' editable';
        cell.dataset.row = originalI;
        cell.dataset.col = originalJ;
        cell.contentEditable = true;
        cell.addEventListener('input', updateMatrixValue);
      }
      inputGrid.appendChild(cell);
    }
  }
}

function updateMatrixValue(e) {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  matrix[row][col] = parseInt(cell.textContent) || 0;
  updateVisualization();
  resetAnimation();
}

function updateVisualization() {
  const filterSize = parseInt(filterSizeInput.value);
  const stride = parseInt(strideInput.value);
  const padding = parseInt(paddingInput.value);
  const operation = operationSelect.value;
  const paddedMatrix = addPadding(matrix, padding);
  const processedMatrix = processOperation(paddedMatrix, filterSize, stride, operation);
  renderOutput(processedMatrix);
  renderMatrix();
}

// Render output matrix and cache its cells for fast highlighting
function renderOutput(outputMatrix) {
  outputGrid.style.gridTemplateColumns = `repeat(${outputMatrix.length}, ${CELL_SIZE}px)`;
  outputGrid.innerHTML = outputMatrix
    .flatMap(row => row.map(value => `<div class="matrix-cell">${value}</div>`))
    .join('');
  outputCells = Array.from(outputGrid.children);
}

function highlightOutput(x, y) {
  if (!outputCells.length) return;
  const outputSize = Math.sqrt(outputCells.length);
  outputCells.forEach(cell => cell.classList.remove('output-highlight'));
  const index = y * outputSize + x;
  if (index < outputCells.length) {
    outputCells[index].classList.add('output-highlight');
  }
}

function addPadding(matrix, padding) {
  if (padding === 0) return matrix;
  const size = matrix.length + padding * 2;
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      const x = i - padding;
      const y = j - padding;
      return (x >= 0 && x < matrix.length && y >= 0 && y < matrix.length)
        ? matrix[x][y]
        : 0;
    })
  );
}

function processOperation(matrix, filterSize, stride, operation) {
  const outputSize = Math.floor((matrix.length - filterSize) / stride) + 1;
  const output = Array.from({ length: outputSize }, () =>
    Array.from({ length: outputSize }, () => 0)
  );
  for (let i = 0; i < outputSize; i++) {
    for (let j = 0; j < outputSize; j++) {
      const values = [];
      for (let fi = 0; fi < filterSize; fi++) {
        for (let fj = 0; fj < filterSize; fj++) {
          values.push(matrix[i * stride + fi][j * stride + fj]);
        }
      }
      switch (operation) {
        case 'conv':
          output[i][j] = values.reduce((a, b) => a + b, 0);
          break;
        case 'maxpool':
          output[i][j] = Math.max(...values);
          break;
        case 'avgpool':
          output[i][j] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
          break;
      }
    }
  }
  return output;
}

/***********************
 * Sliding Window Animation
 ***********************/
function moveSlidingWindow() {
  if (isPaused) return; // Do not proceed if paused
  const filterSize = parseInt(filterSizeInput.value);
  const stride = parseInt(strideInput.value);
  const padding = parseInt(paddingInput.value) || 0;
  const totalSize = matrixSize + padding * 2;
  const cellSizeWithGap = CELL_SIZE + CELL_GAP;
  const outputSize = Math.floor((totalSize - filterSize) / stride) + 1;
  const maxX = outputSize - 1;
  const maxY = outputSize - 1;
  slidingWindow.style.width = `${filterSize * CELL_SIZE + (filterSize - 1) * CELL_GAP}px`;
  slidingWindow.style.height = `${filterSize * CELL_SIZE + (filterSize - 1) * CELL_GAP}px`;
  const baseOffset = 30;
  const xPos = baseOffset + currentStep.x * stride * cellSizeWithGap;
  const yPos = baseOffset + currentStep.y * stride * cellSizeWithGap;
  slidingWindow.style.transform = `translate(${xPos}px, ${yPos}px)`;
  highlightOutput(currentStep.x, currentStep.y);
  // Update current step for the next move
  currentStep.x++;
  if (currentStep.x > maxX) {
    currentStep.x = 0;
    currentStep.y++;
  }
  if (currentStep.y > maxY) {
    currentStep.x = 0;
    currentStep.y = 0;
  }
  console.log(`Moved sliding window to x: ${xPos}, y: ${yPos}`);
}

// When transition ends, if not paused, move to the next cell
slidingWindow.addEventListener('transitionend', function (e) {
  if (e.propertyName === 'transform' && !isPaused) {
    moveSlidingWindow();
  }
});

/***********************
 * Event Listeners for Controls
 ***********************/
[matrixSizeInput, filterSizeInput, strideInput, paddingInput, operationSelect].forEach(element => {
  element.addEventListener('input', () => {
    if (element === matrixSizeInput) {
      matrixSize = parseInt(element.value) || 9;
      matrix = createMatrix(matrixSize);
    }
    updateVisualization();
    resetAnimation();
  });
});

pauseResumeButton.addEventListener('click', togglePause);

// Button to randomize the matrix.
function randomizeMatrix() {
  matrix = createMatrix(matrixSize);
  updateVisualization();
  resetAnimation();
}

/***********************
 * Start Everything
 ***********************/
initialize();