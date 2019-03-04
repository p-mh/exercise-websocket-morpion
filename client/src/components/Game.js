import React, { Component } from 'react';
import Cell from './Cell';
import {
  receivePlayerId,
  receiveGameBoard,
  play,
  resetGame,
} from '../utils/socket';
import styled from 'styled-components';

const GameBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 600px;
  margin: auto;
  background-color: ${({ id }) => (id === 1 ? '#8CA984' : '#FFC1B4')};
  border: #000 3px solid;
  border-radius: 5px;
`;

export default class Game extends Component {
  state = {
    playerId: null,
    id: null,
    gameBoard: {},
    turn: null,
    isFinish: false,
    winner: null,
  };
  componentDidMount = () => {
    receivePlayerId(playerId =>
      this.setState({
        playerId,
      })
    );
    receiveGameBoard(
      ({ id, gameBoard, turn, isFinish, winner, completeGame }) =>
        this.setState({
          id,
          gameBoard,
          turn,
          isFinish,
          winner,
          completeGame,
        })
    );
  };
  cellClick = index => {
    const { playerId, id, turn, gameBoard, isFinish } = this.state;
    if (turn === playerId && !gameBoard[index] && !isFinish) {
      play(index, id);
    }
  };

  render() {
    const { gameBoard, isFinish, winner, turn, completeGame } = this.state;
    const gameBoardMapped = Object.entries(gameBoard).map(
      ([cellIndex, cellValue]) => (
        <Cell
          key={cellIndex}
          value={cellValue}
          cellClick={this.cellClick.bind(this, cellIndex)}
        />
      )
    );
    return (
      <div>
        {completeGame ? (
          !isFinish ? (
            <div>
              <GameBoard id={this.state.playerId}>{gameBoardMapped}</GameBoard>
              <p>{turn === 1 ? 'x' : 'o'} turn</p>
            </div>
          ) : (
            <div>
              <p>
                Game is over. {winner ? (winner === 1 ? 'x' : 'o') : 'Nobody'}{' '}
                win !
              </p>
              <button onClick={resetGame.bind(this, this.state.id)}>
                Play Again
              </button>
            </div>
          )
        ) : (
          <div>
            <i className="fas fa-spinner fa-pulse" />
            <p>Waiting for an opponent</p>
          </div>
        )}
      </div>
    );
  }
}
