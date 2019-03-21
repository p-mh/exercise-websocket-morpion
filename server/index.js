const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {
  PLAYER_ID,
  GAMESTATE,
  GAMEBOARD,
  RESETGAME,
  NEW_GAME,
  END_GAME,
  DISCONNECT,
} = require('../commons/constantes');

const {
  createNewGame,
  joinExistingGame,
  playing,
  resetGame,
} = require('./newGameStatesFuncs');

let gameStates = {};

const emitGameToPlayers = gameId => {
  const {
    [gameId]: { players },
  } = gameStates;
  players.forEach(socket => {
    const {
      [gameId]: { players, ...gameState },
    } = gameStates;
    socket.emit(GAMESTATE, gameState);
  });
};

io.on('connection', socket => {
  socket.on(NEW_GAME, () => {
    const gameToJoin = Object.values(gameStates).find(
      ({ players }) => players.length < 2
    );
    if (gameToJoin) {
      const { id: gameId } = gameToJoin;
      gameStates = joinExistingGame(socket, gameId, gameStates);
      socket.emit(PLAYER_ID, 2);
      emitGameToPlayers(gameId);
    } else {
      const gameId = Date.now();
      gameStates = createNewGame(socket, gameId, gameStates);
      socket.emit(PLAYER_ID, 1);
      emitGameToPlayers(gameId);
    }
  });

  socket.on(GAMEBOARD, ({ gameId, cellPlayedIndex }) => {
    gameStates = playing(gameId, cellPlayedIndex, gameStates);
    emitGameToPlayers(gameId);
  });

  socket.on(RESETGAME, gameId => {
    gameStates = resetGame(gameId, gameStates);
    emitGameToPlayers(gameId);
  });

  socket.on(DISCONNECT, () => {
    const gameStatePlayed = Object.values(gameStates).find(({ players }) =>
      players.includes(socket)
    );
    if (gameStatePlayed) {
      gameStatePlayed.players.forEach(socket => {
        socket.emit(END_GAME);
      });
      const { [gameStatePlayed.id]: gameToRemove, ...otherGames } = gameStates;
      gameStates = otherGames;
    }
  });
});

server.listen('8080', () => {
  console.log('server started');
});
