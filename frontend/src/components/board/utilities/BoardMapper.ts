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
