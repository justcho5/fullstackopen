import { useState, useEffect } from "react";
import axios from "axios";

import Search from "../components/Search";
import Result from "../components/Result";
function App() {
  const [newCountry, setNewCountry] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => response.data)
      .then((countries) => {
        setCountries(countries);
      });
  }, []);

  const handleChange = (event) => {
    const filter = event.target.value;
    setNewCountry(filter);
  };

  return (
    <div>
      <Search value={newCountry} onChange={handleChange} />
      <Result countries={countries} filter={newCountry} />
    </div>
  );
}

export default App;
