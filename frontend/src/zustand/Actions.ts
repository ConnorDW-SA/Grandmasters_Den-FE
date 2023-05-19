export interface LoginRegisterData {
  email: string;
  password: string;
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

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    const response = await fetch("http://localhost:3001/users/allUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data.users;
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
