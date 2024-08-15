import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "../graphql/querys";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      props.setToken(token);
      props.setPage("authors");
      localStorage.setItem("user-token", token);
    }
  }, [result.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }

  const handlelogin = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <>
      <form onSubmit={handlelogin}>
        <p>
          username{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </p>
        <p>
          password{" "}
          <input
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </p>
        <button type="submit">login</button>
      </form>
    </>
  );
}

export default LoginForm;
