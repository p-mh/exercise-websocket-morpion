const NewGameStates = require('./newGameStatesFuncs');
const UtilsFuncs = require('./utilsFunc');

describe('createNewGame', () => {
  test('should return an object with correct keys', () => {
    expect(
      NewGameStates.createNewGame(['socket'], 123, { 456: null })
    ).toHaveProperty('123');
    expect(
      NewGameStates.createNewGame(['socket'], 123, { 456: null })
    ).toHaveProperty('456');
  });
  test('should return an object with correct keys and values', () => {
    expect(NewGameStates.createNewGame('socket', 123)).toEqual({
      123: {
        id: 123,
        completeGame: false,
        gameBoard: UtilsFuncs.createNewGameBoard(8),
        isFinish: false,
        players: ['socket'],
        turn: 1,
        winner: null,
      },
    });
  });
});

describe('joinExistingGame', () => {
  test('should return the correct objects with two sockets and completeGame = true', () => {
    expect(
      NewGameStates.joinExistingGame('socketNewPlayer', 1, {
        1: { players: ['firstPlayer'], completeGame: false },
      })
    ).toEqual({
      1: { players: ['firstPlayer', 'socketNewPlayer'], completeGame: true },
    });
  });
});

// UtilsFuncs.getWinner = jest.fn(() => 'Bonjour');
describe('playing', () => {
  test('should ', () => {
    const spyGetWinner = jest.spyOn(UtilsFuncs, 'getWinner');
    const spyGetNewGameBoard = jest.spyOn(UtilsFuncs, 'getNewGameBoard');
    const spyGetIsFinish = jest.spyOn(UtilsFuncs, 'getIsFinish');
    NewGameStates.playing(1, 0, {
      1: { players: [], turn: 1, gameBoard: {}, completeGame: false },
    });
    expect(spyGetWinner).toHaveBeenCalled();
    expect(spyGetNewGameBoard).toHaveBeenCalled();
    expect(spyGetIsFinish).toHaveBeenCalled();
  });
  test('should return the correct gamesState', () => {
    expect(
      NewGameStates.playing(1, 0, {
        1: {
          players: [],
          turn: 1,
          gameBoard: { 0: null, 1: null },
          completeGame: true,
        },
      })
    ).toEqual({
      '1': {
        completeGame: true,
        gameBoard: { 0: 1, 1: null },
        id: 1,
        isFinish: false,
        players: [],
        turn: 2,
        winner: null,
      },
    });
  });

  describe('resetGame', () => {
    test('should return correct gamesState', () => {
      expect(
        NewGameStates.resetGame(1, {
          1: {
            id: 1,
            players: [],
            winner: 1,
            completeGame: true,
          },
        })
      ).toEqual({
        '1': {
          completeGame: true,
          gameBoard: UtilsFuncs.createNewGameBoard(8),
          id: 1,
          isFinish: false,
          players: [],
          turn: 2,
          winner: null,
        },
      });
    });
  });
});
