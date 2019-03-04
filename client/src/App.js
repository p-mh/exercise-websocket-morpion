import React, { Component } from 'react';
import './App.css';

import Game from './components/Game';

import { playGame, receiveDeadGameAlert } from './utils/socket';

class App extends Component {
  state = {
    gameState: 'BEGIN',
  };
  componentDidMount = () => {
    receiveDeadGameAlert(() => this.setState({ gameState: 'DEAD_GAME' }));
  };
  playGame = () => {
    this.setState({ gameState: 'PLAY' });
    playGame();
  };
  goToBegin = () => {
    this.setState({ gameState: 'BEGIN' });
  };
  render() {
    const gameState = {
      BEGIN: (
        <div>
          <button onClick={this.playGame.bind(this)}>Play !</button>
        </div>
      ),
      PLAY: <Game />,
      DEAD_GAME: (
        <div>
          <p>Your opponent is gone</p>
          <button onClick={this.goToBegin.bind(this)}>Go to home page</button>
        </div>
      ),
    };
    return <div className="App">{gameState[this.state.gameState]}</div>;
  }
}

export default App;
