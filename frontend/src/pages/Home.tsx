import React, { useEffect } from "react";
import { useStore } from "../zustand/Store";

export default function HomePage() {
  const username = useStore((state) => state.user?.username);
  useStore((state) => state.logState());
  useEffect(() => {
    useStore.getState().fetchUsers();
  }, []);

  return (
    <div>
      <h1>Hello {username}</h1>
    </div>
  );
}
