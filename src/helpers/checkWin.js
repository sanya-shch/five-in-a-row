import { chunkArray } from "./chunkArray";

const getColorMatrix = (board, points) => {
  const chunkedBoard = {};

  Object.values(board).forEach((block, index) => {
    chunkedBoard[index] = chunkArray(block, 3);
  });

  const matrix = [[], [], [], [], [], [], [], [], []];

  for (
    let matrixY = 0, boardY = 0, boardX = 0, boardIndex = 0;
    matrixY < 9;
    matrixY++
  ) {
    for (let matrixX = 0; matrixX < 9; matrixX++) {
      matrix[matrixY].push(points[chunkedBoard[boardIndex][boardY][boardX]]);

      if (boardX === 2) {
        boardX = 0;
        boardIndex++;
      } else boardX++;
    }

    if (boardY === 2) boardY = 0;
    else boardY++;

    if (matrixY < 2) boardIndex = 0;
    else if (matrixY < 5) boardIndex = 3;
    else boardIndex = 6;
  }

  return matrix;
};

const checkHorizontally = (color, matrix) => {
  console.log("checkHorizontally", color);

  for (let i = 0, counter = 0; i < 9; i++) {
    for (let y = 0; y < 9; y++) {
      if (matrix[i][y] === color) counter++;
      else counter = 0;

      if (counter === 5) return color;
    }

    counter = 0;
  }

  return false;
};

const checkVertically = (color, matrix) => {
  console.log("checkVertically", color);

  for (let i = 0, counter = 0; i < 9; i++) {
    for (let y = 0; y < 9; y++) {
      if (matrix[y][i] === color) counter++;
      else counter = 0;

      if (counter === 5) return color;
    }

    counter = 0;
  }

  return false;
};

const checkIncreasingDiagonally = (color, matrix) => {
  console.log("checkIncreasingDiagonally", color);

  for (let i = 4; i < 9; i++) {
    for (let y = 0; y < 5; y++) {
      if (
        matrix[y][i] === color &&
        matrix[y + 1][i - 1] === color &&
        matrix[y + 2][i - 2] === color &&
        matrix[y + 3][i - 3] === color &&
        matrix[y + 4][i - 4] === color
      ) {
        return color;
      }
    }
  }

  return false;
};

const checkDecreasingDiagonally = (color, matrix) => {
  console.log("checkDecreasingDiagonally", color);

  for (let i = 0; i < 5; i++) {
    for (let y = 0; y < 5; y++) {
      if (
        matrix[y][i] === color &&
        matrix[y + 1][i + 1] === color &&
        matrix[y + 2][i + 2] === color &&
        matrix[y + 3][i + 3] === color &&
        matrix[y + 4][i + 4] === color
      ) {
        return color;
      }
    }
  }

  return false;
};

export const checkWin = (colors, board, points) => {
  // console.log(colors, board);

  const colorMatrix = getColorMatrix(board, points);
  // console.log(colorMatrix);

  // const isHorizontally = checkIncreasingDiagonally("blue", colorMatrix);
  // console.log(isHorizontally);

  const checkList = [
    checkHorizontally,
    checkVertically,
    checkDecreasingDiagonally,
    checkIncreasingDiagonally,
  ];

  for (let color of colors) {
    for (let func of checkList) {
      const isWin = func(color, colorMatrix);

      if (isWin) return isWin;
    }
  }

  return false;
};
