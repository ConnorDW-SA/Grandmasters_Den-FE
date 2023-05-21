import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface loginRegisterData {
  email?: string;
  password: string;
  username?: string;
}

export interface allUserData {
  _id: string;
  email?: string;
  username?: string;
}

export interface gameData {
  _id: string;
  player1?: allUserData;
  player2: allUserData;
  error?: string;
}

export enum ErrorMessages {
  ServerError = "Server error",
  InvalidCredentials = "Invalid email or password",
  UnknownError = "Unknown error"
}

interface StoreState {
  isLoading: boolean;
  error: string | null;
  user: allUserData | null;
  loginRegister: (data: loginRegisterData) => Promise<void>;
  isLoggedIn: boolean;
  setLoginState: (isLoggedIn: boolean) => void;
  setUser: (user: allUserData | null) => void;
  users: allUserData[] | null;
  fetchUsers: () => Promise<void>;
  userGames: gameData[] | null;
  newGame: gameData | null;
  createGame: (player2Id: string) => Promise<void>;
  fetchGames: () => Promise<void>;
  logState: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      userGames: [],
      newGame: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      loginRegister: async (data: loginRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/users/${
              data.username ? "register" : "login"
            }`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            }
          );
          if (response.ok) {
            const { user, accessToken } = await response.json();
            localStorage.setItem("accessToken", accessToken);
            set({ user, isLoggedIn: true, isLoading: false });
          } else {
            set({ error: ErrorMessages.InvalidCredentials, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      setUser: (user: allUserData | null) => set({ user }),
      setLoginState: (isLoggedIn: boolean) => set({ isLoggedIn }),
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("http://localhost:3001/users/allUsers", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          if (response.ok) {
            const users: allUserData[] = await response.json();
            set({ users, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      fetchGames: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3001/games/userGames",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );
          if (response.ok) {
            const userGames: gameData[] = await response.json();
            set({ userGames, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      createGame: async (player2Id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3001/games/createGame",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ player2: player2Id })
            }
          );
          if (response.ok) {
            const newGame = await response.json();
            set({ newGame: { ...newGame }, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      logState: () => {
        console.log(
          "Current user:",
          get().user,
          "logged in:",
          get().isLoggedIn,
          "Users:",
          get().users,
          "Games:",
          get().userGames
        );
      }
    }),
    {
      partialize(state) {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !["error"].includes(key))
        );
      },
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
