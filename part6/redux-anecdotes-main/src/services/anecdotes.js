import axios from "axios";

const baseURL = "http://localhost:3001/anecdotes";

const getAllAnecdotes = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

const addAnecdote = async (content) => {
  const data = { content, votes: 0 };
  const response = await axios.post(baseURL, data);
  return response.data;
};

const updateVoteAnecdote = async (anecdote) => {
  const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
  const response = await axios.put(`${baseURL}/${anecdote.id}`, newAnecdote);
  return response.data;
};

export default { getAllAnecdotes, addAnecdote, updateVoteAnecdote };
