import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import ChessBoard from "../components/board/Board";
import { useStore, ErrorMessages } from "../zustand/Store";

const GamePage: React.FC = () => {
  type ParamTypes = {
    gameId: string;
  };
  const { gameId } = useParams<ParamTypes>();
  const currentUser = useStore((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentGame, setCurrentGame] = useState<specificGameData | null>(null);

  interface PieceData {
    type: string;
    color: string;
    position: string;
    hasMoved?: boolean;
  }

  interface MoveHistoryData {
    from: string;
    to: string;
    piece: string;
    color: "white" | "black";
    promotion?: string;
  }
  type PieceColor = "black" | "white";
  type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

  interface specificGameData {
    player1: { _id: string; username: string };
    player2: { _id: string; username: string };
    boardState: Array<{
      color: PieceColor;
      type: PieceType;
      position: string;
    }>;

    moveHistory: MoveHistoryData[];
  }

  useEffect(() => {
    const fetchCurrentGame = async (
      gameId: string
    ): Promise<{ gameData?: specificGameData; error?: string }> => {
      try {
        const response = await fetch(`http://localhost:3001/games/${gameId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (response.ok) {
          const gameData: specificGameData = await response.json();
          setCurrentGame(gameData);
          console.log(gameData.player1);
          console.log(gameData.player2);
          return { gameData };
        } else {
          return { error: ErrorMessages.ServerError };
        }
      } catch (error) {
        console.error(error);
        return { error: ErrorMessages.ServerError };
      }
    };

    if (gameId) {
      fetchCurrentGame(gameId);
    }
  }, [gameId]);

  const handleMove = (
    oldPosition: string,
    newPosition: string,
    hasMoved: boolean
  ) => {
    if (gameId) {
      updateGameState(gameId, oldPosition, newPosition, hasMoved);
    }
  };

  const updateGameState = async (
    gameId: string,
    oldPosition: string,
    newPosition: string,
    hasMoved: boolean
  ) => {
    const requestBody = { oldPosition, newPosition, hasMoved };

    const response = await fetch(`http://localhost:3001/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const updatedGame: specificGameData = await response.json();
      setCurrentGame(updatedGame);
    } else {
      const error = await response.text();
      console.error(error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
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

  return (
    <div>
      <h1>Hello</h1>
      <h1>
        {currentGame?.player1.username} vs {currentGame?.player2.username}
      </h1>
      <ChessBoard onMove={handleMove} gameState={currentGame} />
    </div>
  );
};

export default GamePage;
