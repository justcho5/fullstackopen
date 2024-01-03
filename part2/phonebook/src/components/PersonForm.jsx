const PersonForm = ({
  name,
  number,
  onSubmit,
  onNameChange,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} required />
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange} required />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
