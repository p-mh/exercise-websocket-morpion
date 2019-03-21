const UtilsFuncs = require('./utilsFunc');

describe('createNewGameBoard', () => {
  test('should return the correct object', () => {
    expect(UtilsFuncs.createNewGameBoard(1)).toEqual({
      0: null,
      1: null,
    });
  });
});

describe('getWinner', () => {
  const winGameBoard = { 0: null, 1: 1, 2: 1 };
  const notWinGameBoard = { 0: null, 1: null, 2: null };
  test('should return the id of the winner (1)', () => {
    expect(
      UtilsFuncs.getWinner(0, {
        gameBoard: winGameBoard,
        turn: 1,
      })
    ).toBe(1);
  });
  test('should return null if there is no winner', () => {
    expect(
      UtilsFuncs.getWinner(0, {
        gameBoard: notWinGameBoard,
        turn: 1,
      })
    ).toBe(null);
  });
});

describe('getIsFinish', () => {
  const finishedGameBoard = { 0: null, 1: 1, 2: 1 };
  const notFinishedGameBoard = { 0: null, 1: 1, 2: null };
  test('should return truth if gameBoard is complete', () => {
    expect(
      UtilsFuncs.getIsFinish(0, { gameBoard: finishedGameBoard, turn: 1 })
    ).toBeTruthy();
  });
  test("should return false if gameBoard isn't complete", () => {
    expect(
      UtilsFuncs.getIsFinish(0, { gameBoard: notFinishedGameBoard, turn: 1 })
    ).toBeFalsy();
  });
});

describe('getNewGameBoard', () => {
  test('should return the correct new gameBoard', () => {
    expect(
      UtilsFuncs.getNewGameBoard(0, { gameBoard: { 0: null }, turn: 1 })
    ).toEqual({ 0: 1 });
  });
});
