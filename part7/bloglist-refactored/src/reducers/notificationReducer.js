import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { type: null, message: '' },
  reducers: {
    changeNotificationText(state, action) {
      return action.payload;
    },
    setNotificationNull(state, action) {
      return { type: null, message: '' };
    },
  },
});

export const setNotification = (text, timeout) => {
  return (dispatch) => {
    dispatch(changeNotificationText(text));
    let idTimeout = null;
    if (idTimeout) {
      clearTimeout(idTimeout);
    }
    idTimeout = setTimeout(
      () => dispatch(setNotificationNull()),
      timeout * 1000
    );
  };
};

export const { changeNotificationText, setNotificationNull } =
  notificationSlice.actions;
export default notificationSlice.reducer;
