import React, { useEffect, useState } from "react";
import { useStore } from "../zustand/Store";
import { createGameAction } from "../zustand/Actions";
import { useNavigate } from "react-router-dom";
const HomePage: React.FC = () => {
  const logState = useStore((state) => state.logState);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const fetchGames = useStore((state) => state.fetchGames);
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.user);
  const games = useStore((state) => state.userGames);
  const users = useStore((state) => state.users);
  useEffect(() => {
    fetchUsers();
    fetchGames();
    logState();
  }, [fetchUsers, logState, fetchGames]);
  const createGame = async (player2Id: string) => {
    const { newGame, error } = await createGameAction(player2Id);
    if (newGame) {
      navigate(`/game/${newGame._id}`);
    } else {
      console.error(error);
      // handle error...
    }
  };

  return (
    <div className="main-section-one">
      <div className="">
        <h1 className="test text-dark">Welcome {currentUser?.username}</h1>
      </div>
      <div className="">
        <div className="">
          <h1>users</h1>
          {users && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <ul key={user._id}>
                  {user.username}{" "}
                  <button onClick={() => createGame(user._id)}>
                    Create Game
                  </button>
                </ul>
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
                <ul key={game._id}>
                  {/* {getOpponentUsername(game, currentUser?._id)} */}
                  <button onClick={() => navigate(`/game/${game._id}`)}>
                    Join Game
                  </button>
                </ul>
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
