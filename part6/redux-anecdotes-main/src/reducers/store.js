import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterReducer";
import anecdoteReducer from "./anecdoteReducer";
import notificationReducer from "./notificationReducer";

export const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
});

console.log(store.getState());
