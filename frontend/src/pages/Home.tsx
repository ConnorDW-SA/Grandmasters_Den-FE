import React, { useEffect } from "react";
import { useStore, allUserData, gameData } from "../zustand/Store";

import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const logState = useStore((state) => state.logState);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const fetchGames = useStore((state) => state.fetchGames);
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.user);
  const createGame = useStore((state) => state.createGame);
  const games = useStore((state) => state.userGames);
  const users = useStore((state) => state.users);
  console.log(users);
  const getOpponentUsername = (
    currentUser: allUserData | null,
    game: gameData
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
  const createGameAction = async (player2Id: string) => {
    await createGame(player2Id);
    fetchGames();
    navigate(`/game/${player2Id}`);
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
                  <button onClick={() => createGameAction(user._id)}>
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
