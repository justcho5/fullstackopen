import Part from "./Part";

const Content = ({ parts }) => {
  const totalSum = parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p>
        <strong>total of {totalSum} exercises</strong>
      </p>
    </div>
  );
};

export default Content;
