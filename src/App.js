import { useState } from "react";
import './App.css'

function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, move, result }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = result.winner;
  let status;
  let status2;
  let status3 = null;
  status2 = "You are at move # " + move;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  if (winner == null){
    status3 = "No one is winning yet!";
  }

  return (
    <>
      <div className="status"> {status} </div>
      <div className="status2"> {status2} </div>
      <div className="status2"> {status3} </div>
      {Array(3).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array(3).fill(null).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            const isWinningSquare = result.winningSquares.includes(index);
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                className={isWinningSquare ? 'winning-square' : ''} // Apply CSS class
              />
            );
          })}
        </div>
      ))}
    </>
  );
  
}

function calculateWinner(squares) {
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
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: [] };
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascending, setAscending] = useState(true);
  const result = calculateWinner(currentSquares);
  let order;
  if (ascending){
    order = "Ascending";
  } else {
    order = "Descending";
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function onOrderClick(){
    setAscending(!ascending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Reverse the order of moves if not ascending
  const sortedMoves = ascending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} move={currentMove} result={result}/>
      </div>
      <div className="game-info">
        <button className = "order" onClick = {onOrderClick}>{order}</button>
        <ol> {sortedMoves}</ol>
      </div>
    </div>
  );
}
