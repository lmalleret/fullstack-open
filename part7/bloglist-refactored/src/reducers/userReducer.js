import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';

const userSlice = createSlice({
  name: 'user',
  initialState: JSON.parse(window.localStorage.getItem('user')),
  reducers: {
    setLogin(state, action) {
      return action.payload;
    },
    setLogout(state, action) {
      return null;
    },
  },
});

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    window.localStorage.setItem('user', JSON.stringify(user));
    dispatch(setLogin(user));
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('user');
    dispatch(setLogout());
  };
};

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
