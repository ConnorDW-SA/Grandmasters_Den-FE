export interface LoginRegisterData {
  email: string;
  password?: string;
  username?: string;
}

export const loginRegisterAction = async ({
  email,
  password,
  username
}: LoginRegisterData): Promise<{ user?: any; error?: string }> => {
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

      return { user: { ...user, username: user.username } };
    } else {
      const statusCode = response.status;

      let customErrorMessage = "Unknown error";
      if (statusCode === 401) {
        customErrorMessage = "Invalid email or password";
      } else if (statusCode === 403) {
        customErrorMessage = "Forbidden";
      }

      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export interface allUserData {
  id: string;
  email: string;
  username: string;
}

export const fetchUsersAction = async (): Promise<{
  users?: allUserData[];
  error?: string;
}> => {
  try {
    const response = await fetch("http://localhost:3001/users/allUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    if (response.ok) {
      const users: allUserData[] = await response.json();
      return { users };
    } else {
      const statusCode = response.status;
      let customErrorMessage = "Unknown error occurred while fetching users.";
      if (statusCode === 403) {
        customErrorMessage =
          "Forbidden. You don't have permission to access user data.";
      } else if (statusCode === 500) {
        customErrorMessage = "Server error occurred while fetching users.";
      }

      return { error: customErrorMessage };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
