import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState([null, false]);
  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const handleAddNumber = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const personExists = persons.find(
      (person) => person.name === personObject.name
    );

    const createPerson = () =>
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setMessage([`Added ${returnedPerson.name}`, false]);
          setTimeout(() => {
            setMessage([null, false]);
          }, 5000);
        })
        .catch(() => {
          setMessage(["Error adding new contact", true]);
          setTimeout(() => {
            setMessage([null, false]);
          }, 5000);
        });

    const updatePerson = () => {
      const id = persons.filter(
        (person) => person.name === personObject.name
      )[0].id;
      personService
        .update(id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== returnedPerson.id ? person : returnedPerson
            )
          );
          setNewName("");
          setNewNumber("");
          setMessage([`Updated ${returnedPerson.name}`, false]);
          setTimeout(() => {
            setMessage([null, false]);
          }, 5000);
        })
        .catch(() => {
          setMessage([
            `Information of ${personObject.name} has already been removed from the server`,
            true,
          ]);
          setTimeout(() => {
            setMessage([null, false]);
          }, 5000);
        });
    };

    if (personExists) {
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
        ? updatePerson()
        : createPerson();
      return;
    }
    createPerson();
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleDelete = (personObject) => {
    if (window.confirm(`Delete ${personObject.name}?`)) {
      personService.deletePerson(personObject.id);
      setPersons(persons.filter((person) => person.id != personObject.id));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message[0]} isError={message[1]} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onSubmit={handleAddNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} onDelete={handleDelete} />
    </div>
  );
};

export default App;
