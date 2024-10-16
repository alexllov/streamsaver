import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { APIReadKey } from "./keys";
import FindFilm from "./FindFilmReducer";

function App() {
  // javascript stuff goes here  :)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form>
          <input type="text" id="searchTitle" name="searchTitle" />
          <br />
          <input
            type="radio"
            id="series"
            name="film_series_radio"
            value="true"
          />
          <label htmlFor="series">Series</label>
          <br />
          <input type="radio" id="film" name="film_series_radio" />
          <label htmlFor="film">Film</label>
          <br />
        </form>
        <FindFilm />
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
