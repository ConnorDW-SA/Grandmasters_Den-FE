import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import {
  loginRegister as loginRegisterAction,
  LoginRegisterData
} from "./Actions";

interface User {
  username: string;
}

interface StoreState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoginState: (isLoggedIn: boolean) => void;
  loginRegister: (data: LoginRegisterData) => Promise<void>;
  logState: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
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

      logState: () => {
        console.log(
          "Current state: ",
          get().user,
          "logged in:",
          get().isLoggedIn
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
