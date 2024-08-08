import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";

function AnecdoteForm() {
  const dispatch = useDispatch();

  const addNewAnecdote = (event) => {
    event.preventDefault();
    console.dir(event.target);

    const anecdoteContent = event.target.content.value;
    dispatch(addAnecdote(anecdoteContent));
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
