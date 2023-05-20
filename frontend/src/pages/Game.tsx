import React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Board from "../components/board/Board";
import { useStore } from "../zustand/Store";

const GamePage: React.FC = () => {
  type ParamTypes = {
    gameId: string;
  };
  const { gameId } = useParams<ParamTypes>();

  return (
    <div>
      <h1>Player 1 vs Player 2</h1>
      <Board />
    </div>
  );
};

export default GamePage;
