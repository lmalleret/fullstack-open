import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificationDispatch } from "./contexts/notificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const voteAnecdoteMutation = useMutation({
    mutationFn: (anecdote) => {
      const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
      return axios
        .put(`http://localhost:3001/anecdotes/${anecdote.id}`, newAnecdote)
        .then((res) => res.data);
    },
    onSuccess: (anecdoteUpdated) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((item) =>
          item.id !== anecdoteUpdated.id ? item : anecdoteUpdated
        )
      );
    },
  });

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote);
    notificationDispatch({type:"SET_NOTIFICATION", payload: `you voted '${anecdote.content}'`})
    setTimeout(() => {
      notificationDispatch({type:"SET_NOTIFICATION_NULL"})
    }, 5000);
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: () =>
      axios.get("http://localhost:3001/anecdotes").then((res) => res.data),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const anecdotes = result.data;

  if (result.error) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {result.isLoading ? (
        <div>fetching anecdotes</div>
      ) : (
        <>
          {anecdotes.map((anecdote) => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote)}>vote</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;
