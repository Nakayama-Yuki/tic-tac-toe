// 以下の機能を追加する。
//4.どちらかが勝利したときに、勝利につながった 3 つのマス目をハイライト表示する。引き分けになった場合は、引き分けになったという結果をメッセージに表示する。
// 5.着手履歴リストで、各着手の場所を (row, col) という形式で表示する。
"use client";

import { useState } from "react";

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}
// 小さい四角のコンポーネント
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[]; // 空の配列
  onPlay: (nextSquares: (string | null)[]) => void;
}
// Squareを９個集めたボードコンポーネント
function Board({ xIsNext, squares, onPlay }: BoardProps) {
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
    onPlay(nextSquares);
  }
  // 勝者がいるときに、勝者を表示、いないときは次の手順を表示
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* 3つの行を生成する rowは横、colは縦 */}
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
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); //現在の手順
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true); // ソート順序のステート

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    //手順が１以上かつ現在の手順のとき
    if (move === currentMove && move > 0) {
      description = `You are at move #${move}`;
      // 手順が1以上の時
    } else if (move > 0) {
      description = `Go to move #${move}`;
      //初手の場合
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        {/* 手順が１以上かつ現在の手順のときは、文字で表示*/}
        {move === currentMove && move > 0 ? (
          <span>{description}</span>
        ) : (
          // それ以外はボタンで表示
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
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
      return squares[a]; // 勝者のマーク（'X' または 'O'）を返す
    }
  }
  return null; // 勝者がいない場合は null を返す
}
