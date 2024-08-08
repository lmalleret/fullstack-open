import { useDispatch, useSelector } from "react-redux";
import { updateVoteAnecdote } from "../reducers/anecdoteReducer";

function AnecdoteList() {
  const anecdotes = useSelector((state) => {
    if (state.filter === "") {
      return [...state.anecdotes];
    }
    return state.anecdotes.filter((item) =>
      item.content.toLowerCase().includes(state.filter.toLowerCase())
    );
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    const target = anecdotes.find((item) => item.id === id);
    dispatch(updateVoteAnecdote(target));
  };

  return (
    <>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
}

export default AnecdoteList;
