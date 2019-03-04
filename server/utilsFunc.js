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

newGameStates_createNewGame = (socket, gameId, gameStates) => {
  const newGame = {
    id: gameId,
    players: [socket],
    completeGame: false,
    turn: 1,
    gameBoard: createNewGameBoard(8),
    isFinish: false,
    winner: null,
  };
  return {
    ...gameStates,
    [gameId]: newGame,
  };
};

newGameStates_joinExistingGame = (socket, gameId, gameStates) => {
  const { [gameId]: gameToChange, ...otherGames } = gameStates;
  return {
    [gameId]: {
      ...gameToChange,
      players: [...gameToChange.players, socket],
      completeGame: true,
    },
    ...otherGames,
  };
};

const newGameStates_playing = (gameId, cellPlayedIndex, gameStates) => {
  const { [gameId]: gameToChange, ...otherGames } = gameStates;
  const { players, turn, gameBoard, completeGame } = gameToChange;
  const newGameState = {
    id: gameId,
    players,
    completeGame,
    turn: turn === 1 ? 2 : 1,
    winner: getWinner(cellPlayedIndex, { gameBoard, turn }),
    gameBoard: getNewGameBoard(cellPlayedIndex, { gameBoard, turn }),
    isFinish: getIsFinish(cellPlayedIndex, { gameBoard, turn }),
  };
  return { [gameId]: newGameState, ...otherGames };
};

const newGameStates_resetGame = (gameId, gameStates) => {
  const { [gameId]: gameToChange, ...otherGames } = gameStates;
  const { id, players, winner, completeGame } = gameToChange;
  const newGameState = {
    id,
    players,
    completeGame,
    turn: gameToChange.winner === 1 ? 2 : 1,
    gameBoard: createNewGameBoard(8),
    isFinish: false,
    winner: null,
  };
  return { [gameId]: newGameState, ...otherGames };
};

module.exports = {
  createNewGameBoard,
  getWinner,
  getIsFinish,
  getNewGameBoard,
  newGameStates_createNewGame,
  newGameStates_joinExistingGame,
  newGameStates_playing,
  newGameStates_resetGame,
};
