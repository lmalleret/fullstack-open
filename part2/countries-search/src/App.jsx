import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );

  const handleShowDetails = (country) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${country.latlng[0]}&lon=${country.latlng[1]}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
      )
      .then((response) => {
        setWeather(response.data);
        setSelectedCountry(country);
      });
  };

  return (
    <div>
      <p>
        find countries{" "}
        <input onChange={handleSearchValue} value={searchValue} />
      </p>
      {!searchValue ? (
        <p></p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length !== 0 ? (
        filteredCountries.map((country) => (
          <div key={country.cca3}>
            <p>
              {country.name.common}{" "}
              <button onClick={() => handleShowDetails(country)}>show</button>
            </p>
            {selectedCountry && selectedCountry.cca3 === country.cca3 && (
              <div>
                <h2>{country.name.common}</h2>
                <p>capital {country.capital[0]}</p>
                <p>area {country.area}</p>
                <ul>
                  {Object.values(country.languages).map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
                <img src={country.flags.png} alt={country.flags.alt} />
                <h3>Weather in {country.name.common}</h3>
                <p>temperature {weather.current.temp} Celcius</p>
                <img src={weather.current.weather[0].icon} alt="weather icon" />
                <p>wind {`https://openweathermap.org/img/wn/${weather.current.wind_speed}.png`}m/s</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No countries found</p>
      )}
    </div>
  );
}

export default App;
