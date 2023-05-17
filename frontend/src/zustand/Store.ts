import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      const setUser = (user: User | null) => set({ user });
      const setLoginState = (isLoggedIn: boolean) => set({ isLoggedIn });

      const loginRegister = async (data: LoginRegisterData): Promise<void> => {
        const isLoading = (loading: boolean) => set({ isLoading: loading });
        const setError = (error: string | null) => set({ error });

        await loginRegisterAction(data, {
          setUser,
          setLoginState,
          setIsLoading: isLoading,
          setError: setError
        });
      };

      return {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null,
        setUser,
        setLoginState,
        loginRegister
      };
    },
    {
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
