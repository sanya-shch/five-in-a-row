export const rotateCounterClockwise = (a) => {
  const n = a.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      const tmp = a[i][j];
      a[i][j] = a[j][n - i - 1];
      a[j][n - i - 1] = a[n - i - 1][n - j - 1];
      a[n - i - 1][n - j - 1] = a[n - j - 1][i];
      a[n - j - 1][i] = tmp;
    }
  }
  return a;
};

export const rotateClockwise = (a) => {
  const n = a.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      const tmp = a[i][j];
      a[i][j] = a[n - j - 1][i];
      a[n - j - 1][i] = a[n - i - 1][n - j - 1];
      a[n - i - 1][n - j - 1] = a[j][n - i - 1];
      a[j][n - i - 1] = tmp;
    }
  }
  return a;
};
