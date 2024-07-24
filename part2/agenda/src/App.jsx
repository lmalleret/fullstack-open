import { useEffect, useState } from "react";
import personsService from "./services/persons";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchPerson, setSearchPerson] = useState("");
  const [notification, setNotification] = useState({ type: null, message: "" });

  useEffect(() => {
    personsService.getAll().then((response) => setPersons(response));
  }, []);

  const handleSearchPerson = (event) => {
    setSearchPerson(event.target.value);
  };

  const filteredNames = persons.filter((p) =>
    p.name.toLowerCase().includes(searchPerson.toLowerCase())
  );

  const deletePerson = (id) => {
    const person = filteredNames.find((p) => p.id === id);
    const deleteConfirmation = confirm(`Delete ${person.name}?`);
    if (deleteConfirmation) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          handleSetNotification({ type: "success", message: "Contact Delete" });
        })
        .catch(() =>
          setNotification({
            type: "error",
            message: "Error: Contact was deleted from server",
          })
        );
    }
  };

  const handleSetNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => setNotification({ type: null, message: "" }), 5000);
  };

  return (
    <div>
      <h2>numberbook</h2>
      <Notification notification={notification} />
      <Filter
        searchPerson={searchPerson}
        handleSearchPerson={handleSearchPerson}
      />
      <h2>Add a new contact</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        handleSetNotification={handleSetNotification}
      />
      <h2>Numbers</h2>
      <Persons filteredNames={filteredNames} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
