import { useMutation, UseMutationResult } from "react-query";

interface LoginRegisterData {
  email: string;
  password: string;
  username?: string;
}

const loginRegister = async ({
  email,
  password,
  username
}: LoginRegisterData) => {
  const response = await fetch(
    `http://localhost:3001/users/${username ? "register" : "login"}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username })
    }
  );

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(username ? "Failed to register." : "Failed to login.");
  }
};

interface UseLoginRegisterOptions {
  onSuccess: (data: any) => void;
}

export const useLoginRegister = (
  options: UseLoginRegisterOptions
): UseMutationResult<unknown, Error, LoginRegisterData> => {
  return useMutation(loginRegister, options);
};
