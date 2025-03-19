// Square.tsx

export interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  isWinningSquare: boolean; // 勝利ラインかどうかを判定するフラグ
}
// 小さい四角のSquareコンポーネント
export default function Square({
  value,
  onSquareClick,
  isWinningSquare,
}: SquareProps) {
  return (
    <button
      className={`square ${isWinningSquare ? "highlight" : ""}`} //勝利ラインならハイライト
      onClick={onSquareClick}>
      {value}
    </button>
  );
}
