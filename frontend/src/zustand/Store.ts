import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  // Add the properties of the user object that you expect here
  username: string;
}

interface StoreState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setLoginState: (isLoggedIn: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      return {
        user: null,
        isLoggedIn: false,
        setUser: (user) => set({ user }),
        setLoginState: (isLoggedIn) => set({ isLoggedIn })
      };
    },
    {
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
