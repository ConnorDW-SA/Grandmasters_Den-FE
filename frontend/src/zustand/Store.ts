import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginRegisterAction,
  LoginRegisterData,
  fetchUsers,
  UserData
} from "./Actions";

interface User {
  username: string;
}

interface StoreState {
  user: User | null;
  users: User[] | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  loginRegister: (data: LoginRegisterData) => Promise<void>;
  setUsers: (users: User[] | null) => void;
  fetchUsers: (data: UserData) => Promise<void>;
  logState: () => void;
  setLoginState: (isLoggedIn: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      users: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      setUser: (user: User | null) => set({ user }),
      setUsers: (users: User[] | null) => set({ users }),
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
        try {
          const users = await fetchUsers();
          set({ users });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      logState: () => {
        setTimeout(() => {
          console.log(
            "Current state:",
            get().user,
            "logged in:",
            get().isLoggedIn,
            "users:",
            get().users
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
