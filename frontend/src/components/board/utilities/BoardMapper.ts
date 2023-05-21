import BlackKing from "../../../assets/pieces/b-king.png";
import BlackQueen from "../../../assets/pieces/b-queen.png";
import BlackBishop from "../../../assets/pieces/b-bishop.png";
import BlackKnight from "../../../assets/pieces/b-knight.png";
import BlackRook from "../../../assets/pieces/b-rook.png";
import BlackPawn from "../../../assets/pieces/b-pawn.png";
import WhiteKing from "../../../assets/pieces/w-king.png";
import WhiteQueen from "../../../assets/pieces/w-queen.png";
import WhiteBishop from "../../../assets/pieces/w-bishop.png";
import WhiteKnight from "../../../assets/pieces/w-knight.png";
import WhiteRook from "../../../assets/pieces/w-rook.png";
import WhitePawn from "../../../assets/pieces/w-pawn.png";

interface Square {
  id: string;
  piece: string | null;
  color: "white" | "black";
}

interface boardMapperData {
  pieces: {
    position: string;
    type: string;
    color: string;
  }[];
}

export const boardMapper = (data: boardMapperData): Square[][] => {
  let board: Square[][] = [];
  for (let i = 0; i < 8; i++) {
    let row: Square[] = [];
    for (let j = 0; j < 8; j++) {
      const id = `${String.fromCharCode(97 + j)}${8 - i}`;
      const piece = data.pieces.find((p) => p.position === id);
      const color = (i + j) % 2 === 0 ? "white" : "black";
      row.push({
        id,
        piece: piece ? `${piece.color.charAt(0)}-${piece.type}` : null,
        color
      });
    }
    board.push(row);
  }
  return board;
};
