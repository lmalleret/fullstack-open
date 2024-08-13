import React from 'react';
import loginService from '../services/login';
import { useField } from '../hooks/useFields';
import { useDispatch } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';
import { loginUser } from '../reducers/userReducer';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const username = useField('text', 'username');
  const password = useField('text', 'password');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        loginUser({ username: username.value, password: password.value })
      );
      e.target.value = '';
      username.onChange(e);
      password.onChange(e);
      navigate('/');
    } catch (exception) {
      dispatch(
        setNotification(
          { type: 'error', message: 'Error: Wrong credentials' },
          5
        )
      );
    }
  };

  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <p>Username</p>
          <input {...username} />
          <p>Password</p>
          <input {...password} />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
}

export default LoginForm;
