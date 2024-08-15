import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../graphql/querys";
import { useMutation, useQuery } from "@apollo/client";

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS, { pollInterval: 2000 });
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [editAuthor] = useMutation(EDIT_AUTHOR);

  if (!props.show) {
    return null;
  }

  const updatedAuthorBirthday = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, setBornTo: +birthyear } });
    setName("");
    setBirthyear("");
  };

  const fillForm = (event) => {
    setName(event.target.parentElement.children[0].innerText);
    setBirthyear(event.target.parentElement.children[1].innerText);
  };

  if (authors.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <p>click an author to change their born year</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id} onClick={fillForm}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={updatedAuthorBirthday}>
        <h2>Set birthyear</h2>
        <p>
          name
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            readOnly
          />
        </p>
        <p>
          born
          <input
            type="text"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </p>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
