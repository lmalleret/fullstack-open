const Persons = ({ filteredNames, deletePerson }) => {
  return (
    <table>
      <tbody>
        {filteredNames.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.number}</td>
            <td>
              <button onClick={() => deletePerson(p.id)}>delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Persons;
