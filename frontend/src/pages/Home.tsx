import React, { useEffect } from "react";
import { useStore, UserData, GameData } from "../zustand/Store";

import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const logState = useStore((state) => state.logState);

  const currentUser = useStore((state) => state.user);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const fetchGames = useStore((state) => state.fetchGames);
  const games = useStore((state) => state.userGames);
  const users = useStore((state) => state.users);

  const getOpponentUsername = (
    currentUser: UserData | null,
    game: GameData
  ) => {
    const { player1, player2 } = game;
    return player1?._id === currentUser?._id
      ? player2.username
      : player1?.username;
  };

  useEffect(() => {
    fetchUsers();
    fetchGames();
    logState();
  }, [fetchUsers, logState, fetchGames]);

  const createGame = async (player2Id: string) => {
    try {
      const response = await fetch("http://localhost:3001/games/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ player2: player2Id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const game = await response.json();
      console.log(game);
      navigate(`/game/${game._id}`);
    } catch (error) {
      console.error("Failed to create game", error);
    }
  };

  return (
    <div className="main-section-one">
      <h1 className="test text-dark">Welcome {currentUser?.username}</h1>
      <div className="">
        <div className="">
          <h1>users</h1>
          {users && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  {user.username}{" "}
                  <button onClick={() => createGame(user._id)}>
                    Create Game
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users</p>
          )}
        </div>

        <div className="">
          <h1>Current Games</h1>
          {games && games.length > 0 ? (
            <ul>
              {games.map((game) => (
                <li key={game._id}>
                  {getOpponentUsername(currentUser, game)}
                  <button onClick={() => navigate(`/game/${game._id}`)}>
                    Join Game
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No games</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
