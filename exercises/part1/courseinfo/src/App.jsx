const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.numExercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => {
        return (
          <Part
            key={part.id}
            name={part.name}
            numExercises={part.numExercises}
          />
        );
      })}
    </div>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.totalNum}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  const parts = [
    { id: 1, name: part1, numExercises: exercises1 },
    { id: 2, name: part2, numExercises: exercises2 },
    { id: 3, name: part3, numExercises: exercises3 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total totalNum={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
