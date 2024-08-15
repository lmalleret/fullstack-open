import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../graphql/querys";

function Recommend(props) {
  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Evita hacer la query si el género aún no está disponible
    pollInterval: 10000,
  });

  if (!props.show) {
    return null;
  }

  if (userLoading || booksLoading) {
    return <div>Loading...</div>;
  }

  if (!favoriteGenre) {
    return <div>No favorite genre found</div>;
  }

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksData.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Recommend;
