import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { changeNotificationText, setNotificationNull } from "../reducers/notificationReducer";

function AnecdoteList() {
  const anecdotes = useSelector((state) => {
    if(state.filter === ""){
      return [...state.anecdotes]
    }
    return state.anecdotes.filter(item => item.content.toLowerCase().includes(state.filter.toLowerCase()))
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdote(id));
    const targetContent = anecdotes.find(item => item.id === id).content;
    dispatch(changeNotificationText(`you voted for '${targetContent}'`));
    setTimeout(() => dispatch(setNotificationNull()), 5000);
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
