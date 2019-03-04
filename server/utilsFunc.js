const { winPossibilities } = require('./constantes');

const createNewGameBoard = (n, result = {}) => {
  if (n === 0) {
    return { ...result, [n]: null };
  }
  return createNewGameBoard(n - 1, { ...result, [n]: null });
};

const getWinner = (cellPlayedIndex, gameState) => {
  const { gameBoard, turn } = gameState;
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

const getIsFinish = (cellPlayedIndex, gameState) => {
  const { gameBoard } = gameState;
  const completeGameState = Object.entries(gameBoard).every(
    ([index, value]) => value || index === cellPlayedIndex
  );
  const isWin = getWinner(cellPlayedIndex, gameState);
  return !!isWin || completeGameState;
};

const getNewGameBoard = (index, gameState) => ({
  ...gameState.gameBoard,
  [index]: gameState.turn,
});

module.exports = {
  createNewGameBoard,
  getWinner,
  getIsFinish,
  getNewGameBoard,
};
