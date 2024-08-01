import { useState } from "react";
import personsService from "../services/persons";

const PersonForm = ({ persons, setPersons, handleSetNotification }) => {
  const [newPerson, setNewPerson] = useState({
    name: "",
    number: "",
  });

  const handlePersonChange = (event) => {
    setNewPerson({ ...newPerson, [event.target.name]: event.target.value });
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    if (personExist().length !== 0) {
      const confirmation = confirm(
        `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmation) {
        updatePerson();
      }
      return;
    }
    personsService
      .addPerson(newPerson)
      .then((response) => {
        setPersons(persons.concat(response));
        handleSetNotification({
          type: "success",
          message: "Success: Contact Add",
        });
      })
      .catch((error) =>
        handleSetNotification({
          type: "error",
          message: error.response.data.error,
        })
      );
  };

  const updatePerson = () => {
    const findPerson = persons.find((p) => p.name === newPerson.name);
    personsService
      .updatePerson(findPerson.id, newPerson)
      .then((response) => {
        const newPersons = persons.map((p) =>
          p.name === findPerson.name ? response : p
        );
        setPersons(newPersons);
        handleSetNotification({
          type: "success",
          message: "Success: Contact Update",
        });
      })
      .catch(() =>
        handleSetNotification({
          type: "error",
          message: "Error: Contact was deleted form server",
        })
      );
  };

  const personExist = () => {
    return persons.filter((p) => p.name === newPerson.name);
  };

  return (
    <form onSubmit={addNewPerson}>
      <div>
        name:{" "}
        <input
          onChange={handlePersonChange}
          name="name"
          value={newPerson.name}
        />
      </div>
      <div>
        number:{" "}
        <input
          onChange={handlePersonChange}
          name="number"
          value={newPerson.number}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
