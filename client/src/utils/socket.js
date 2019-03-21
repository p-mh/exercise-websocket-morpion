import socketIOClient from 'socket.io-client';
import {
  PLAYER_ID,
  GAMESTATE,
  GAMEBOARD,
  RESETGAME,
  NEW_GAME,
  END_GAME,
} from '../../../commons/constantes';

const socket = socketIOClient('http://localhost:8080');

export const receivePlayerId = callback =>
  socket.on(PLAYER_ID, id => callback(id));

export const receiveGameBoard = callback =>
  socket.on(GAMESTATE, gameState => {
    callback(gameState);
  });

export const play = (cellPlayedIndex, gameId) =>
  socket.emit(GAMEBOARD, { gameId, cellPlayedIndex });

export const resetGame = gameId => socket.emit(RESETGAME, gameId);

export const playGame = () => socket.emit(NEW_GAME);

export const receiveDeadGameAlert = callback =>
  socket.on(END_GAME, () => callback());
