export interface LoginRegisterData {
  email: string;
  password: string;
  username?: string;
}

export interface UseLoginRegisterOptions {
  setUser: (user: any) => void;
  setLoginState: (isLoggedIn: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const loginRegister = async (
  { email, password, username }: LoginRegisterData,
  { setUser, setLoginState, setIsLoading, setError }: UseLoginRegisterOptions
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
      localStorage.setItem("accessToken", accessToken);

      setUser({ ...user, username: user.username });
      setLoginState(true);
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
