import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

function AnecdoteForm() {
  const dispatch = useDispatch();

  const addNewAnecdote = async (event) => {
    event.preventDefault();
    const anecdoteContent = event.target.content.value;
    dispatch(createAnecdote(anecdoteContent));
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
