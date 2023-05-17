import { useState } from "react";

interface LoginRegisterData {
  email: string;
  password: string;
  username?: string;
}

export const useLoginRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginRegister = async (
    { email, password, username }: LoginRegisterData,
    successCallback: (user: any, accessToken: string) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/users/${username ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username })
        }
      );

      if (response.ok) {
        const { user, accessToken } = await response.json();
        successCallback(user, accessToken);
      } else {
        const statusCode = response.status;

        let customErrorMessage = "Unknown error";
        if (statusCode === 401) {
          customErrorMessage = "Invalid email or password";
        } else if (statusCode === 403) {
          customErrorMessage = "Forbidden";
        }

        setError(customErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { loginRegister, isLoading, error };
};
