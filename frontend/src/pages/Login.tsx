import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../zustand/Store";
import { useLoginRegister } from "../zustand/Actions";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const setUser = useStore((state) => state.setUser);
  const setLoginState = useStore((state) => state.setLoginState);

  const { loginRegister, error } = useLoginRegister();

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (
      event.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      event.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;
    const username = isLogin
      ? undefined
      : (event.currentTarget.elements.namedItem("username") as HTMLInputElement)
          .value;

    await loginRegister({ email, password, username }, (user, accessToken) => {
      localStorage.setItem("accessToken", accessToken);
      setUser({ ...user, username: user.username });
      setLoginState(true);
    });
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-form">
        <h1 className="text-light">{isLogin ? "Login" : "Register"}</h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-between h-25"
        >
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
            />
          )}
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-secondary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          type="button"
          className="btn btn-link text-light"
          onClick={switchForm}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
