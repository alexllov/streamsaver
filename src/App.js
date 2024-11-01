import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { APIReadKey } from "./keys";
import FindContent from "./FindContent";

function App() {
  // javascript stuff goes here  :)
  // Country should probably be stored as a separate drop-down & sent to FindStreamingOptions directly,
  //   its not actually needsd in FindContent, so making it part of the form only complicates things
  const [keyTerms, setKeyTerms] = useState("");
  const [filmOrSeries, setFilmOrSeries] = useState("tv");
  const [country, setCountry] = useState("GB");
  const [safeSearch, setSafeSearch] = useState(false);
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
        <form id="showSearchForm" onSubmit={handleSubmit}>
          <div class="input-group">
            <input
              type="text"
              class="input"
              id="searchTitle"
              name="searchTitle"
              placeholder="Search for Content..."
              autocomplete="off"
              value={keyTerms}
              onChange={(e) => setKeyTerms(e.target.value)}
            />
            <input class="button--submit" value="Seach" type="submit" />
          </div>
          <div class="radio-inputs">
            <label class="radio" htmlFor="series">
              <input
                type="radio"
                id="series"
                name="filmSeriesRadio"
                value="tv"
                defaultChecked
                onClick={(e) => setFilmOrSeries(e.target.value)}
              />
              <span class="name">SERIES</span>
            </label>
            <label class="radio" htmlFor="film">
              <input
                type="radio"
                id="film"
                name="filmSeriesRadio"
                value="movie"
                onClick={(e) => setFilmOrSeries(e.target.value)}
              />
              <span class="name">FILM</span>
            </label>
          </div>
        </form>
        <script src="FindFilmReducer"></script>
        <FindContent searchForm={search} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </header>
    </div>
  );
}

export default App;
