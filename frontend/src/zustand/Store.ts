import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  LoginRegisterData,
  loginRegisterAction,
  fetchUsersAction,
  allUserData,
  fetchGamesAction,
  gameData
} from "./Actions";

interface User {
  username: string;
  _id: string;
}

interface StoreState {
  user: User | null;
  users: allUserData[] | null;
  userGames: gameData[] | null;
  fetchUsers: () => Promise<void>;
  fetchGames: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  loginRegister: (data: LoginRegisterData) => Promise<void>;

  logState: () => void;
  setLoginState: (isLoggedIn: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      userGames: [],
      isLoggedIn: false,
      isLoading: false,
      error: null,
      setUser: (user: User | null) => set({ user }),
      setLoginState: (isLoggedIn: boolean) => set({ isLoggedIn }),
      loginRegister: async (data: LoginRegisterData) => {
        set({ isLoading: true, error: null });
        const { user, error } = await loginRegisterAction(data);
        if (user) {
          set({ user, isLoggedIn: true });
          set({ isLoading: false });
        } else if (error) {
          set({ error });
          set({ isLoading: false });
        }
      },
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        const { users, error } = await fetchUsersAction();
        if (users) {
          set({ users, isLoading: false });
        } else if (error) {
          set({ error, isLoading: false });
        }
      },
      fetchGames: async () => {
        set({ isLoading: true, error: null });
        const { userGames, error } = await fetchGamesAction();
        if (userGames) {
          set({ userGames, isLoading: false });
        } else if (error) {
          set({ error, isLoading: false });
        }
      },
      logState: () => {
        setTimeout(() => {
          console.log(
            "Current state:",
            get().user,
            "logged in:",
            get().isLoggedIn,
            "Users:",
            get().users,
            "Games:",
            get().userGames
          );
        }, 100);
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
