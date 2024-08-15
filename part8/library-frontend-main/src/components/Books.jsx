import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../graphql/querys";
import { useState, useEffect } from "react";

const Books = (props) => {
  const { data, loading, error, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: null }, // Inicialmente sin filtro de género
    pollInterval: 10000,
  });
  const [genres, setGenres] = useState(new Set());
  const [genre, setGenre] = useState("");

  // useEffect para gestionar géneros de forma eficiente
  useEffect(() => {
    if (data && data.allBooks) {
      const genreSet = new Set();
      data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => genreSet.add(genre));
      });
      setGenres(genreSet);
    }
  }, []);

  // Actualizar solo si se selecciona un nuevo género
  const handleGenreChange = (selectedGenre) => {
    if (genre !== selectedGenre) {
      setGenre(selectedGenre);
      refetch({ genre: selectedGenre }); // Realiza la query con el nuevo género
    }
  };

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading books</div>;
  }

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {Array.from(genres).map((genre, index) => (
          <button key={index} onClick={() => handleGenreChange(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => handleGenreChange(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
