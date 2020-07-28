import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = ({ value, onClick }) => {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    )
}
class Board extends React.Component {
    renderSquare(i) {
        const { squares, handelClick } = this.props;
        return <Square
            value={squares[i]}
            onClick={() => handelClick(i)}
        />;
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
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }
    handelClick(i) {
        const { xIsNext} = this.state;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();

        if (computeWinners(squares) || squares[i]) {
            return;
        }
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: newSquares,
            }]),
            stepNumber: history.length,
            xIsNext: !xIsNext
        })

    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        console.log(this.state)
        const { xIsNext } = this.state;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = computeWinners(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move #${move}` : `Go to game start`;
            return (
                <li key={step}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = `Winner ${winner}`
        } else {
            status = `Next player: ${xIsNext ? "X" : "O"}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board xIsNext={xIsNext} squares={current.squares} handelClick={(i) => this.handelClick(i)} />
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

function computeWinners(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
