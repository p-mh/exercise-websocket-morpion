const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {
  newGameStates_createNewGame,
  newGameStates_joinExistingGame,
  newGameStates_playing,
  newGameStates_resetGame,
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
      gameStates = newGameStates_joinExistingGame(socket, gameId, gameStates);
      socket.emit('playerId', 2);
      emitGameToPlayers(gameId);
    } else {
      const gameId = Date.now();
      gameStates = newGameStates_createNewGame(socket, gameId, gameStates);
      socket.emit('playerId', 1);
      emitGameToPlayers(gameId);
    }
  });

  socket.on('gameBoard', ({ gameId, cellPlayedIndex }) => {
    gameStates = newGameStates_playing(gameId, cellPlayedIndex, gameStates);
    emitGameToPlayers(gameId);
  });

  socket.on('resetGame', gameId => {
    gameStates = newGameStates_resetGame(gameId, gameStates);
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
