import React from "react";
import loginService from "../services/login";

function LoginForm({ setUser, handleSetNotification }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setPassword("");
      setUsername("");
    } catch (exception) {
      handleSetNotification({
        type: "error",
        message: "Error: Wrong credentials",
      });
    }
  };

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <p>Username</p>
          <input
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <p>Password</p>
          <input
            type="text"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
}

export default LoginForm;
