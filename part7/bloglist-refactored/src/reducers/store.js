import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogReducer';
import notificationReducer from './notificationReducer';
import userReducer from './userReducer';

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});
