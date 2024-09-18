// 以下の機能を追加する。
// 5.着手履歴リストで、各着手の場所を (row, col) という形式で表示する。
"use client";

import { useState } from "react";

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  isWinningSquare: boolean; // 勝利ラインかどうかを判定するフラグ
}
// 小さい四角のコンポーネント
function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
  return (
    <button
      className={`square ${isWinningSquare ? "highlight" : ""}`} //勝利ラインならハイライト
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[]; // 空の配列
  onPlay: (nextSquares: (string | null)[], i: number) => void;
  winningSquares: number[] | null; // 勝利したマス目のインデックス配列
}
// Squareを９個集めたボードコンポーネント
function Board({ xIsNext, squares, onPlay, winningSquares }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }
  // 勝者がいるときに、勝者を表示、いないときは次の手順を表示
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every((square) => square !== null)) {
    status = "引き分け";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* 3つの行を生成する rowは横、colは縦 JSの要素番号は０からスタート */}
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div key={row} className="board-row">
            {/* 3つの列を生成 */}
            {Array(3)
              .fill(null)
              .map((_, col) => {
                //3行3列の行列を考えると、1次元配列に変換される
                //[0, 1, 2,
                // 3, 4, 5,
                // 6, 7, 8]
                // rowが2でcolが1なら、indexは 2 * 3 + 1 = 7 となり、1次元配列の7番目の要素に対応します。
                const index = row * 3 + col;
                const isWinningSquare =
                  winningSquares && winningSquares.includes(index); // 勝利ラインのマス目をハイライト
                return (
                  <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    isWinningSquare={isWinningSquare || false}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

export default function Game() {
  interface Move {
    squares: (string | null)[];
    location: { row: number; col: number } | null;
  }

  const [history, setHistory] = useState<Move[]>([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0); //現在の手番
  const xIsNext = currentMove % 2 === 0; // 次の手番がXか〇か
  const currentSquares = history[currentMove].squares;
  const [isAscending, setIsAscending] = useState(true); // ソート順序のステート ascending=昇順

  function handlePlay(nextSquares: (string | null)[], i: number) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: { row, col } },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const winnerInfo = calculateWinner(currentSquares);
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : null;

  const moves = history.map((step, move) => {
    let description;
    if (move === 0) {
      description = "Go to game start";
    } else if (move === currentMove) {
      description = `You are at move #${move}`;
    } else {
      description = `Go to move #${move} (${step.location?.row}, ${step.location?.col})`;
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  // ソート順序に基づいて手順をソート
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "降順にソート" : "昇順にソート"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
// 勝者を判定する関数
function calculateWinner(squares: (string | null)[]) {
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
      return { winner: squares[a], winningSquares: [a, b, c] }; // 勝者のマークと勝利ラインを返す
    }
  }
  return null;
}
