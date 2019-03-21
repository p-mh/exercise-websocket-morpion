const { winPossibilities } = require('./constantes');

const createNewGameBoard = (n, result = {}) => {
  if (n === 0) {
    return { ...result, [n]: null };
  }
  return createNewGameBoard(n - 1, { ...result, [n]: null });
};

const getWinner = (cellPlayedIndex, { gameBoard, turn }) => {
  const winPossibilitiesFiltered = winPossibilities.filter(winPos => {
    return winPos.includes(Number(cellPlayedIndex));
  });
  const winFind = winPossibilitiesFiltered.some(winPos =>
    winPos.every(nb => gameBoard[nb] === turn || nb === Number(cellPlayedIndex))
  );
  if (winFind) {
    return turn;
  } else {
    return null;
  }
};

const getIsFinish = (cellPlayedIndex, { gameBoard, turn }) => {
  const completeGameState = Object.entries(gameBoard).every(
    ([index, value]) => value || index === cellPlayedIndex
  );
  const isWin = getWinner(cellPlayedIndex, { gameBoard, turn });
  return !!isWin || completeGameState;
};

const getNewGameBoard = (index, { gameBoard, turn }) => ({
  ...gameBoard,
  [index]: turn,
});


module.exports = {
  createNewGameBoard,
  getWinner,
  getIsFinish,
  getNewGameBoard,
};
