import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificationDispatch } from "../contexts/notificationContext";

const AnecdoteForm = () => {

  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: (newAnecdote) =>
      axios
        .post("http://localhost:3001/anecdotes", newAnecdote)
        .then((res) => res.data),
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) =>{
      notificationDispatch({type:"SET_NOTIFICATION", payload: "too short anecdote, must have length 5 or more"})
    setTimeout(() => {
      notificationDispatch({type:"SET_NOTIFICATION_NULL"})
    }, 5000);
    }
  });
  const notificationDispatch = useNotificationDispatch();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
    notificationDispatch({type:"SET_NOTIFICATION", payload: `new anecdote '${content}'`})
    setTimeout(() => {
      notificationDispatch({type:"SET_NOTIFICATION_NULL"})
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
