import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";
import {
  changeNotificationText,
  setNotificationNull,
} from "../reducers/notificationReducer";

function AnecdoteForm() {
  const dispatch = useDispatch();

  const addNewAnecdote = (event) => {
    event.preventDefault();
    const anecdoteContent = event.target.content.value;
    dispatch(addAnecdote(anecdoteContent));
    dispatch(
      changeNotificationText(`you create anecdote '${anecdoteContent}'`)
    );
    setTimeout(() => dispatch(setNotificationNull()), 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input type="text" name="content" />
        </div>
        <button>create</button>
      </form>
    </>
  );
}

export default AnecdoteForm;
