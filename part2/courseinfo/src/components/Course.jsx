// const Header = (props) => {
//   return <h1>{props.course}</h1>;
// };

// const Part = (props) => {
//   return (
//     <p>
//       {props.name} {props.exercises}
//     </p>
//   );
// };

// const Content = (props) => {
//   return (
//     <div>
//       <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
//       <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
//       <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
//     </div>
//   );
// };

// const Total = (props) => {
//   return (
//     <p>
//       Number of exercises{" "}
//       {props.parts[0].exercises +
//         props.parts[1].exercises +
//         props.parts[2].exercises}
//     </p>
//   );
// };
import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
