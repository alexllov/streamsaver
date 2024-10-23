import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { APIReadKey } from "./keys";
import FindContent from "./FindContent";

function App() {
  // javascript stuff goes here  :)
  const [keyTerms, setKeyTerms] = useState("");
  const [filmOrSeries, setFilmOrSeries] = useState("tv");
  const [country, setCountry] = useState("GB");
  const [safeSearch, setSafeSearch] = useState(true);
  const [search, setSearch] = useState([null, null, null, null]);

  function handleSubmit(e) {
    e.preventDefault();
    var search = [keyTerms, filmOrSeries, country, safeSearch];
    setSearch(search);
    console.log(`You've Pressed Submit ${search}`);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form id="showSearchForm" onSubmit={handleSubmit}>
          <input
            type="text"
            id="searchTitle"
            name="searchTitle"
            value={keyTerms}
            onChange={(e) => setKeyTerms(e.target.value)}
          />
          <br />
          <input
            type="radio"
            id="series"
            name="filmSeriesRadio"
            value="tv"
            defaultChecked
            onClick={(e) => setFilmOrSeries(e.target.value)}
          />
          <label htmlFor="series">Series</label>
          <input
            type="radio"
            id="film"
            name="filmSeriesRadio"
            value="movie"
            onClick={(e) => setFilmOrSeries(e.target.value)}
          />
          <label htmlFor="film">Film</label>
          <br />
          <input type="submit" value="Submit"></input>
        </form>
        <script src="FindFilmReducer"></script>
        <FindContent searchForm={search} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
