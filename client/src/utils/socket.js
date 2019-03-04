import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:8080');

export const receivePlayerId = callback =>
  socket.on('playerId', id => callback(id));

export const receiveGameBoard = callback =>
  socket.on('gameState', gameState => {
    callback(gameState);
  });

export const play = (cellPlayedIndex, gameId) =>
  socket.emit('gameBoard', { gameId, cellPlayedIndex });

export const resetGame = gameId => socket.emit('resetGame', gameId);

export const playGame = () => socket.emit('newGame');

export const receiveDeadGameAlert = callback =>
  socket.on('endGame', () => callback());
