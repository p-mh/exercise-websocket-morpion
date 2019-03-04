const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {
  createNewGameBoard,
  getWinner,
  getIsFinish,
  getNewGameBoard,
} = require('./utilsFunc');

let gameStates = {};

const emitGameToPlayers = gameId => {
  const {
    [gameId]: { players },
  } = gameStates;
  players.forEach(socket => {
    const {
      [gameId]: { players, ...gameState },
    } = gameStates;
    socket.emit('gameState', gameState);
  });
};

io.on('connection', socket => {
  socket.on('newGame', () => {
    const gameToJoin = Object.values(gameStates).find(
      ({ players }) => players.length < 2
    );
    if (gameToJoin) {
      const { id: gameId } = gameToJoin;
      const { [gameId]: gameToChange, ...otherGames } = gameStates;
      socket.emit('playerId', 2);
      gameStates = {
        [gameId]: {
          ...gameToChange,
          players: [...gameToChange.players, socket],
          completeGame: true,
        },
        ...otherGames,
      };
      emitGameToPlayers(gameId);
    } else {
      socket.emit('playerId', 1);
      const gameId = Date.now();
      const newGame = {
        id: gameId,
        players: [socket],
        completeGame: false,
        turn: 1,
        gameBoard: createNewGameBoard(8),
        isFinish: false,
        winner: null,
      };
      gameStates = {
        ...gameStates,
        [gameId]: newGame,
      };
      emitGameToPlayers(gameId);
    }
  });

  socket.on('gameBoard', ({ gameId, cellPlayedIndex }) => {
    const { [gameId]: gameToChange, ...otherGames } = gameStates;
    const newGameState = {
      id: gameId,
      players: gameToChange.players,
      completeGame: true,
      turn: gameToChange.turn === 1 ? 2 : 1,
      winner: getWinner(cellPlayedIndex, gameToChange),
      gameBoard: getNewGameBoard(cellPlayedIndex, gameToChange),
      isFinish: getIsFinish(cellPlayedIndex, gameToChange),
    };
    gameStates = { [gameId]: newGameState, ...otherGames };
    emitGameToPlayers(gameId);
  });

  socket.on('resetGame', gameId => {
    const { [gameId]: gameToChange, ...otherGames } = gameStates;
    const newGameState = {
      id: gameId,
      players: gameToChange.players,
      completeGame: true,
      turn: gameToChange.winner === 1 ? 2 : 1,
      gameBoard: createNewGameBoard(8),
      isFinish: false,
      winner: null,
    };
    gameStates = { [gameId]: newGameState, ...otherGames };
    emitGameToPlayers(gameId);
  });

  socket.on('disconnect', () => {
    const gameStatePlayed = Object.values(gameStates).find(({ players }) =>
      players.includes(socket)
    );
    if (gameStatePlayed) {
      gameStatePlayed.players.forEach(socket => {
        socket.emit('endGame');
      });
      const { [gameStatePlayed.id]: gameToRemove, ...otherGames } = gameStates;
      gameStates = otherGames;
    }
  });
});

server.listen('8080', () => {
  console.log('server started');
});
