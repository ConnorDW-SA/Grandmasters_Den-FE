import React, { useEffect, useState } from "react";
import { useStore } from "../zustand/Store";

export default function HomePage() {
  const username = useStore((state) => state.user?.username);
  const logState = useStore((state) => state.logState);
  const fetchUsers = useStore((state) => state.fetchUsers);
  useEffect(() => {
    fetchUsers();
    logState();
  }, [fetchUsers, logState]);

  return (
    <div>
      <h1>Hello {username}</h1>
    </div>
  );
}
