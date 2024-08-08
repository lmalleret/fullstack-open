import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
import { setNotification } from "./notificationReducer";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    addAnecdote(state, action) {
      return [...state, action.payload];
    },
    setState(state, action) {
      return action.payload;
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAllAnecdotes();
    dispatch(setState(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.addAnecdote(content);
    dispatch(addAnecdote(newAnecdote));
    dispatch(setNotification(`new anecdote '${newAnecdote.content}'`, 5));
  };
};

export const updateVoteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updateAnecdote = await anecdoteService.updateVoteAnecdote(anecdote);
    dispatch(voteAnecdote(updateAnecdote));
    dispatch(setNotification(`you voted for '${updateAnecdote.content}'`, 5));
  };
};

export const { voteAnecdote, addAnecdote, setState } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
