import { chunkArray } from "./chunkArray";

const getColorMatrix = (board) => {
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
      matrix[matrixY].push(chunkedBoard[boardIndex][boardY][boardX]);

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

const checkHorizontally = (color, matrix, points) => {
  for (let i = 0, counter = []; i < 9; i++) {
    for (let y = 0; y < 9; y++) {
      if (points[matrix[i][y]] === color) counter.push(matrix[y][i]);
      else counter = [];

      if (counter.length === 5) return { color, points: counter };
    }

    counter = [];
  }

  return false;
};

const checkVertically = (color, matrix, points) => {
  for (let i = 0, counter = []; i < 9; i++) {
    for (let y = 0; y < 9; y++) {
      if (points[matrix[y][i]] === color) counter.push(matrix[y][i]);
      else counter = [];

      if (counter.length === 5) return { color, points: counter };
    }

    counter = [];
  }

  return false;
};

const checkIncreasingDiagonally = (color, matrix, points) => {
  for (let i = 4; i < 9; i++) {
    for (let y = 0; y < 5; y++) {
      if (
        points[matrix[y][i]] === color &&
        points[matrix[y + 1][i - 1]] === color &&
        points[matrix[y + 2][i - 2]] === color &&
        points[matrix[y + 3][i - 3]] === color &&
        points[matrix[y + 4][i - 4]] === color
      ) {
        return {
          color,
          points: [
            matrix[y][i],
            matrix[y + 1][i - 1],
            matrix[y + 2][i - 2],
            matrix[y + 3][i - 3],
            matrix[y + 4][i - 4],
          ],
        };
      }
    }
  }

  return false;
};

const checkDecreasingDiagonally = (color, matrix, points) => {
  for (let i = 0; i < 5; i++) {
    for (let y = 0; y < 5; y++) {
      if (
        points[matrix[y][i]] === color &&
        points[matrix[y + 1][i + 1]] === color &&
        points[matrix[y + 2][i + 2]] === color &&
        points[matrix[y + 3][i + 3]] === color &&
        points[matrix[y + 4][i + 4]] === color
      ) {
        return {
          color,
          points: [
            matrix[y][i],
            matrix[y + 1][i + 1],
            matrix[y + 2][i + 2],
            matrix[y + 3][i + 3],
            matrix[y + 4][i + 4],
          ],
        };
      }
    }
  }

  return false;
};

export const checkWin = (colors, board, points) => {
  console.log(colors);

  const colorMatrix = getColorMatrix(board, points);

  const checkList = [
    checkHorizontally,
    checkVertically,
    checkDecreasingDiagonally,
    checkIncreasingDiagonally,
  ];

  for (let color of colors) {
    for (let func of checkList) {
      const isWin = func(color, colorMatrix, points);

      if (isWin) return isWin;
    }
  }

  return false;
};
