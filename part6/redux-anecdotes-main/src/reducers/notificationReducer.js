import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    changeNotificationText(state, action) {
      return action.payload;
    },
    setNotificationNull(state, action) {
      return null;
    },
  },
});

export const { changeNotificationText, setNotificationNull } =
  notificationSlice.actions;
export default notificationSlice.reducer;
