const Utils = require('./utilsFunc');

createNewGame = (socket, gameId, gameStates) => {
  const newGame = {
    id: gameId,
    players: [socket],
    completeGame: false,
    turn: 1,
    gameBoard: Utils.createNewGameBoard(8),
    isFinish: false,
    winner: null,
  };
  return {
    ...gameStates,
    [gameId]: newGame,
  };
};

joinExistingGame = (socket, gameId, gameStates) => {
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

const playing = (gameId, cellPlayedIndex, gameStates) => {
  const { [gameId]: gameToChange, ...otherGames } = gameStates;
  const { players, turn, gameBoard, completeGame } = gameToChange;
  const newGameState = {
    id: gameId,
    players,
    completeGame,
    turn: turn === 1 ? 2 : 1,
    winner: Utils.getWinner(cellPlayedIndex, { gameBoard, turn }),
    gameBoard: Utils.getNewGameBoard(cellPlayedIndex, { gameBoard, turn }),
    isFinish: Utils.getIsFinish(cellPlayedIndex, { gameBoard, turn }),
  };
  return { [gameId]: newGameState, ...otherGames };
};

const resetGame = (gameId, gameStates) => {
  const { [gameId]: gameToChange, ...otherGames } = gameStates;
  const { id, players, winner, completeGame } = gameToChange;
  const newGameState = {
    id,
    players,
    completeGame,
    turn: winner === 1 ? 2 : 1,
    gameBoard: Utils.createNewGameBoard(8),
    isFinish: false,
    winner: null,
  };
  return { [gameId]: newGameState, ...otherGames };
};

module.exports = {
  createNewGame,
  joinExistingGame,
  playing,
  resetGame,
};
