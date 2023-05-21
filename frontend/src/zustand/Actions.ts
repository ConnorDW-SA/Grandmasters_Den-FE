export interface LoginRegisterData {
  email: string;
  password?: string;
  username?: string;
}

export const loginRegisterAction = async ({
  email,
  password,
  username
}: LoginRegisterData): Promise<{ user?: any; error?: string }> => {
  try {
    const response = await fetch(
      `http://localhost:3001/users/${username ? "register" : "login"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username })
      }
    );

    if (response.ok) {
      const { user, accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);

      return { user: { ...user, username: user.username } };
    } else {
      const statusCode = response.status;

      let customErrorMessage = "Unknown error";
      if (statusCode === 401) {
        customErrorMessage = "Invalid email or password";
      }
      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export interface allUserData {
  _id: string;
  email: string;
  username: string;
}

export const fetchUsersAction = async (): Promise<{
  users?: allUserData[];
  error?: string;
}> => {
  try {
    const response = await fetch("http://localhost:3001/users/allUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (response.ok) {
      const users: allUserData[] = await response.json();
      return { users };
    } else {
      const statusCode = response.status;
      let customErrorMessage = "Unknown error occurred while fetching users.";
      if (statusCode === 403) {
        customErrorMessage =
          "Forbidden. You don't have permission to access user data.";
      } else if (statusCode === 500) {
        customErrorMessage = "Server error occurred while fetching users.";
      }

      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export interface userDataGame {
  _id: string;
  username: string;
  email: string;
}

export interface gameData {
  _id: string;
  player1: userDataGame;
  player2: userDataGame;
}

export const fetchGamesAction = async (): Promise<{
  userGames?: gameData[];
  error?: string;
}> => {
  try {
    const response = await fetch("http://localhost:3001/games/userGames", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (response.ok) {
      const userGames: gameData[] = await response.json();
      return { userGames };
    } else {
      const statusCode = response.status;
      let customErrorMessage = "Unknown error occurred while fetching games.";
      if (statusCode === 403) {
        customErrorMessage =
          "Forbidden. You don't have permission to access game data.";
      } else if (statusCode === 500) {
        customErrorMessage = "Server error occurred while fetching games.";
      }

      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export interface CreateGameData {
  player2: {
    _id: string;
    username: string;
  };
  error?: string;
  _id: string;
}

export const createGameAction = async (
  player2Id: string
): Promise<{
  newGame?: CreateGameData;
  error?: string;
}> => {
  console.log(player2Id);
  try {
    const response = await fetch("http://localhost:3001/games/createGame", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ player2: player2Id })
    });
    if (response.ok) {
      const newGame = await response.json();
      return { newGame: { ...newGame } };
    } else {
      const statusCode = response.status;
      let customErrorMessage = "Unknown error";
      if (statusCode === 401) {
        customErrorMessage = "Failed to create game";
      }
      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "unknown error" };
  }
};

export interface PieceData {
  type: string;
  color: string;
  position: string;
  hasMoved?: boolean;
}

export interface MoveHistoryData {
  from: string;
  to: string;
  piece: string;
  color: "white" | "black";
  promotion?: string;
}
type PieceColor = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

export interface specificGameData {
  player1: { _id: string; username: string };
  player2: { _id: string; username: string };
  boardState: Array<{
    color: PieceColor;
    type: PieceType;
    position: string;
  }>;

  moveHistory: MoveHistoryData[];
}

export const fetchSpecificGameAction = async (
  gameId: string
): Promise<{
  gameData?: specificGameData;
  error?: string;
}> => {
  try {
    const response = await fetch(`http://localhost:3001/games/${gameId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (response.ok) {
      const gameData: specificGameData = await response.json();
      return { gameData };
    } else {
      const statusCode = response.status;
      let customErrorMessage = "Unknown error occurred while fetching games.";
      if (statusCode === 403) {
        customErrorMessage =
          "Forbidden. You don't have permission to access game data.";
      } else if (statusCode === 500) {
        customErrorMessage = "Server error occurred while fetching games.";
      }

      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
