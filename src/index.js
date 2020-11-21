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
                squares: Array(9).fill(null),
                moveIndex: -1
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        // get a copy of the state
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        } 
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveIndex: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move) => {
            const moveIndex = step.moveIndex;
            const player = step.squares[moveIndex];
            const coordinate = [Math.floor(moveIndex / 3), moveIndex % 3];

            const desc = move ? `Go to move #${move}: ${player} 
                at row ${coordinate[0]}, col ${coordinate[1]}` : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status = '';
        if (winner === 'X' || winner === 'O') {
            status = `Winner: ${winner}`;
        } else if (winner === 'draw')
            status = 'The game is a draw';
        else {
            status = `Next player: ${this.state.xIsNext? 'X' : 'O'}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
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
    if (!sq.includes(null)) {
        return 'draw';
    }

    return null;
}