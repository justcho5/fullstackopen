const Persons = ({ persons, filter, onDelete }) => {
  //   console.log(persons);
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => onDelete({ ...person })}>delete</button>
          </div>
        ))}
    </div>
  );
};

export default Persons;
