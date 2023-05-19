import React, { useEffect, useState } from "react";
import { useStore } from "../zustand/Store";
import { useNavigate } from "react-router-dom";
const HomePage: React.FC = () => {
  const logState = useStore((state) => state.logState);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.user);

  const users = useStore((state) => state.users);
  useEffect(() => {
    fetchUsers();
    logState();
  }, [fetchUsers, logState]);

  return (
    <div>
      <h1>Hello {currentUser?.username}</h1>
    </div>
  );
};

export default HomePage;
