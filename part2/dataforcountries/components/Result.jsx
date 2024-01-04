import OneCountry from "./OneCountry";

const Result = ({ countries, filter }) => {
  const filtered = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filter === "") {
    return "";
  } else if (filtered.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (filtered.length !== 1) {
    return (
      <div>
        {filtered.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))}
      </div>
    );
  } else {
    return <OneCountry country={filtered[0]} />;
  }
};

export default Result;
