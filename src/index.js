import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
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
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(0),
                moveIndex: -1
            }],
            stepNumber: 0,
            player1IsNext: true
        };
        this.playerLetters = ['X','O'];
    }

    handleClick(i) {
        // get a copy of the state
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.player1IsNext ? 1 : 2;
        this.setState({
            history: history.concat([{
                squares: squares,
                moveIndex: i
            }]),
            stepNumber: history.length,
            player1IsNext: !this.state.player1IsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            player1IsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        // translate board content to player letters and blanks
        const displaySquares = current.squares.map((square) => 
            square === -1 ? null : this.playerLetters[square - 1]
        );
        
        // build moves list
        const moves = history.map((step,move) => {
            const moveIndex = step.moveIndex;
            const player = this.playerLetters[step.squares[moveIndex] - 1];
            const coordinate = [Math.floor(moveIndex / 3), moveIndex % 3];

            const desc = move ? `Go to move #${move}: ${player} 
                at row ${coordinate[0]}, col ${coordinate[1]}` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        // check for winner
        let status = '';
        if (winner === 1 || winner === 2) {
            status = `Winner: ${this.playerLetters[winner - 1]}`;
        } else if (winner === -1)
            status = 'The game is a draw';
        else {
            status = `Next player: ${this.state.player1IsNext? this.playerLetters[0] : this.playerLetters[1]}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={displaySquares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  

function calculateWinner (sq) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    // winner
    for (let index = 0; index < lines.length; index++) {
        const [a, b, c] = lines[index];
        if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
            return sq[a];
        } 
    }

    // game is draw
    if (!sq.includes(0)) {
        return -1;
    }

    return 0; // game continues
}