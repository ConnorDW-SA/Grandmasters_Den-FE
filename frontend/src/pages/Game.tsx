import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import ChessBoard from "../components/board/Board";
import { useStore } from "../zustand/Store";

const GamePage: React.FC = () => {
  type ParamTypes = {
    gameId: string;
  };
  const { gameId } = useParams<ParamTypes>();
  const logState = useStore((state) => state.logState);
  const fetchCurrentGame = useStore((state) => state.fetchCurrentGame);
  const currentUser = useStore((state) => state.user);
  const updateGameState = useStore((state) => state.updateGameState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const currentGame = useStore((state) => state.currentGame);

  useEffect(() => {
    logState();
    if (gameId) {
      fetchCurrentGame(gameId);
    }
  }, [gameId, fetchCurrentGame, logState]);

  const handleMove = (
    oldPosition: string,
    newPosition: string,
    hasMoved: boolean
  ) => {
    if (gameId) {
      updateGameState(gameId, oldPosition, newPosition, hasMoved);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    console.log(currentUser?.username, "Joined");
    newSocket.emit("join game", gameId);
    newSocket.on("player joined", (data) => {
      console.log("Player joined", data);
    });

    newSocket.on("opponent move", (move) => {
      console.log("Opponent made a move", move);
    });

    return () => {
      newSocket.close();
    };
  }, [gameId]);

  const player1 = useStore((state) => state.currentGame?.player1.username);
  const player2 = useStore((state) => state.currentGame?.player2.username);

  return (
    <div>
      <h1>
        {player1} vs {player2}
      </h1>
      <ChessBoard onMove={handleMove} gameState={currentGame} />
    </div>
  );
};

export default GamePage;
