const Filter = ({ searchPerson, handleSearchPerson, persons, setPersons }) => {
  return (
    <p>
      filter shown with{" "}
      <input onChange={handleSearchPerson} name="search" value={searchPerson} />
    </p>
  );
};

export default Filter;
