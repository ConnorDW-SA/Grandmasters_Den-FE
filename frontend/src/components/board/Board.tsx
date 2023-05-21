import React from "react";
import { specificGameData } from "../../zustand/Actions";
import BlackKing from "../../assets/pieces/b-king.png";
import BlackQueen from "../../assets/pieces/b-queen.png";
import BlackBishop from "../../assets/pieces/b-bishop.png";
import BlackKnight from "../../assets/pieces/b-knight.png";
import BlackRook from "../../assets/pieces/b-rook.png";
import BlackPawn from "../../assets/pieces/b-pawn.png";
import WhiteKing from "../../assets/pieces/w-king.png";
import WhiteQueen from "../../assets/pieces/w-queen.png";
import WhiteBishop from "../../assets/pieces/w-bishop.png";
import WhiteKnight from "../../assets/pieces/w-knight.png";
import WhiteRook from "../../assets/pieces/w-rook.png";
import WhitePawn from "../../assets/pieces/w-pawn.png";

interface BoardProps {
  onMove: (oldPosition: string, newPosition: string, hasMoved: boolean) => void;
  gameState: specificGameData | null;
}
type PieceColor = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

const ChessBoard: React.FC<BoardProps> = ({ onMove, gameState }) => {
  if (!gameState) return null;

  const { boardState } = gameState;
  const pieceImages: Record<PieceColor, Record<PieceType, string>> = {
    black: {
      king: BlackKing,
      queen: BlackQueen,
      bishop: BlackBishop,
      knight: BlackKnight,
      rook: BlackRook,
      pawn: BlackPawn
    },
    white: {
      king: WhiteKing,
      queen: WhiteQueen,
      bishop: WhiteBishop,
      knight: WhiteKnight,
      rook: WhiteRook,
      pawn: WhitePawn
    }
  };

  const chessRows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const chessColumns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return (
    <div className="chessboard">
      {chessRows.map((row, i) =>
        chessColumns.map((column, j) => {
          const position = `${column}${row}`;
          const piece = boardState.find((p) => p.position === position);
          const squareColor =
            (i + j) % 2 === 0 ? "white-square" : "black-square";
          return (
            <div
              key={position}
              id={position}
              className={`board-square ${squareColor}`}
            >
              {piece && (
                <img
                  src={piece ? pieceImages[piece.color][piece.type] : ""}
                  alt={piece ? piece.type : ""}
                  className={`chess-piece ${piece.color}-${piece.type}`}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
