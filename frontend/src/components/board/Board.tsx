import React from "react";
import { specificGameData } from "../../zustand/Actions";
import { boardMapper } from "./utilities/BoardMapper";

interface BoardProps {
  onMove: (oldPosition: string, newPosition: string, hasMoved: boolean) => void;
  gameState: specificGameData | null;
}

const ChessBoard: React.FC<BoardProps> = (props) => {
  const boardData = boardMapper({ pieces: gameState.boardState });

  return (
    <div className="chess-board">
      {boardData.map((row, i) => (
        <div key={i} className="chess-board-row">
          {row.map((square) => (
            <div
              key={square.id}
              className={`chess-board-square ${square.color}`}
            >
              {square.piece && (
                <img src={getPieceImage(square.piece)} alt={square.piece} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
