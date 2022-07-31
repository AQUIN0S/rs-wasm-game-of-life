import { Cell, Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const elementName = "game-of-life-canvas";

const canvas = document.getElementById(elementName);

if (canvas == null) {
  throw `Couldn't retrieve element with id ${elementName}.`;
}

let count = 0;
const CELL_SIZE = 10;
const GRID_COLOUR = "#CCCCCC";
const DEAD_COLOUR = "#FFFFFF";
const ALIVE_COLOUR = "#000000";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

if (ctx == null) {
  throw `Couldn't get context of the Canvas element.`;
}

const renderLoop = () => {
  count += 1;

  if (count > 4) {
    count = 0;
    universe.tick();

    drawGrid();
    drawCells();
  }

  requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOUR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOUR : ALIVE_COLOUR;
      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke;
};

const getIndex = (row, column) => {
  return row * width + column;
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
