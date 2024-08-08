import { FC, useState } from "react";
import "./App.css";

// 1. For the current move only, show “You are at move #…” instead of a button ✅
// 2. Rewrite Board to use two loops to make the squares instead of hardcoding them ✅
// 3. Add a toggle button that lets you sort the moves in either ascending or descending order ✅
// 4. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw). ✅
// 5. Display the location for each move in the format (row, col) in the move history list. ✅

enum OrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

interface SquareProps {
  value: string;
  onSquareClick: () => void;
}

interface BoardProps {
  xIsNext: boolean;
  squares: string[];
  onPlay: (v: string[]) => void;
}

const Square: FC<SquareProps> = ({ value, onSquareClick }) => (
  <button className="square" onClick={onSquareClick}>
    {value}
  </button>
);

const Board: FC<BoardProps> = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (idx: number) => {
    if (squares[idx] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player:  ${xIsNext ? "X" : "O"}`;

  return (
    <>
      <h1>Triqui</h1>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

const calculateWinner = (squares: string[]) => {
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
};

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(OrderEnum.ASC);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares: string[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  };
  const toggleOrder = () => {
    setCurrentOrder(
      currentOrder === OrderEnum.ASC ? OrderEnum.DESC : OrderEnum.ASC
    );
  };

  const moves = history.map((_squares, move) => {
    const index =
      currentOrder === OrderEnum.DESC && move > 0
        ? history.length - move
        : move;
    const description =
      index === currentMove
        ? `You are at move #${index}`
        : index > 0
        ? `Go to move #${index}`
        : "Go to game start";

    return (
      <li key={index}>
        {currentMove === index ? (
          <p>{description}</p>
        ) : (
          <button onClick={() => jumpTo(index)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleOrder}>Toggle Order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
