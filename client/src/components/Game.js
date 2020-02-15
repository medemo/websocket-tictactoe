import React from 'react'

import { useJoinedRoom } from '../hooks'
import socket from '../socket'
import './Game.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function Game(props) {
  const joinedRoom = useJoinedRoom()

  const ready = joinedRoom.status === 2
  const squares = joinedRoom.board.map(n => (joinedRoom.players[n]?.name ?? null))
  const winner = calculateWinner(squares)

  const handleMove = (i) => {
    if (ready && !winner)
      socket.emit('make-move', { room: joinedRoom.id, index: i })
  }

  const handleLeave = () => {
    socket.emit('leave-room', joinedRoom.id)
  }

  const generateInfo = () => {
    if (!ready) return 'Waiting for other player to join'
    if (winner) return `${winner} won the game`

    const nextTurn = joinedRoom.lastTurn
      ? joinedRoom.players.find(p => p.id !== joinedRoom.lastTurn.id)?.name
      : 'Anyone'

    return `Next turn: ${nextTurn}`
  }


  return (
    <div className="game">
      <div className="game-info">
        {generateInfo()}
      </div>
      <div className="game-board">
        <Board
          squares={squares}
          onClick={handleMove}
        />
      </div>
      <div>
        <br />
        <br />
        <button onClick={handleLeave}>
          LEAVE THE GAME
        </button>
      </div>
    </div>
  );
}


export default Game


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
