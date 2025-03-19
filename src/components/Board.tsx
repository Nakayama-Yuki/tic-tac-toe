// Board.tsx

import Square from "@/components/Square";
import calculateWinner from "@/utils/calculateWinner";

export interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[]; // 空の配列
  onPlay: (nextSquares: (string | null)[], i: number) => void;
  winningSquares: number[] | null; // 勝利したマス目のインデックス配列
}

// Squareを９個集めたBoardコンポーネント
export default function Board({
  xIsNext,
  squares,
  onPlay,
  winningSquares,
}: BoardProps) {
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
