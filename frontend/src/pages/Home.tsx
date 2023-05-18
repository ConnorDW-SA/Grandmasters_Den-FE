import React from "react";
import { useStore } from "../zustand/Store";

export default function HomePage() {
  useStore((state) => state.logState());
  const username = useStore((state) => state.user?.username);
  return (
    <div>
      <h1>Hello {username}</h1>
    </div>
  );
}
