"use client";

import { useState } from "react";
import Board from "@/components/Board";
import calculateWinner from "@/utils/calculateWinner";

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
    //デフォルト値を０に設定
    // デフォルト値とは、変数が undefined または null の場合に使用される値
    // JavaScriptでは0スタートだが、表示は1スタートにしたいので、+1する
    const row = (step.location?.row ?? 0) + 1;
    const col = (step.location?.col ?? 0) + 1;
    if (move === 0) {
      description = "Go to game start";
    } else if (move === currentMove) {
      description = `You are at move #${move} (${row}, ${col})`;
    } else {
      description = `Go to move #${move} (${row}, ${col})`;
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
