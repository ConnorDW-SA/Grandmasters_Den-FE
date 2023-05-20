import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Board from "../components/board/Board";
import { useStore } from "../zustand/Store";

const GamePage: React.FC = () => {
  type ParamTypes = {
    gameId: string;
  };
  const { gameId } = useParams<ParamTypes>();
  const logState = useStore((state) => state.logState);
  const fetchCurrentGame = useStore((state) => state.fetchCurrentGame);
  useEffect(() => {
    logState();
    if (gameId) {
      fetchCurrentGame(gameId);
    }
  }, [gameId]);

  const player1 = useStore((state) => state.currentGame?.player1.username);
  const player2 = useStore((state) => state.currentGame?.player2.username);

  return (
    <div>
      <h1>
        {player1} vs {player2}
      </h1>
      <Board />
    </div>
  );
};

export default GamePage;
