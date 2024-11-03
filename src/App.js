import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import FindContent from "./FindContent";

function App() {
  //Control the items that are 'Hidden' from search draws, ie content that has been selected.
  ////Find index of element, splice array around it & return new array
  function removeElement(element, array) {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
    array = array.filter((item) => item.id != element.id)

    return array;
  }

  function hiddenItemsReducer(hiddenItems, action) {
    switch (action.type) {
      case "added":
        return [...hiddenItems, action.item];
      case "removed":
        return removeElement(action.item, hiddenItems);
      default: {
        throw Error("Unknown Action");
      }
    }
  }

  function addHiddenItem(item) {
    dispatchHiddenItems({
      type: "added",
      item: item,
    });
  }

  function removeHiddenItem(item) {
    dispatchHiddenItems({
      type: "removed",
      item: item,
    });
  }

  // javascript stuff goes here  :)
  // Country should probably be stored as a separate drop-down & sent to FindStreamingOptions directly,
  //   its not actually needsd in FindContent, so making it part of the form only complicates things
  const [hiddenItems, dispatchHiddenItems] = useReducer(hiddenItemsReducer, []);

  // form contents
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
          <div className="input-group">
            <input
              type="text"
              className="input"
              id="searchTitle"
              name="searchTitle"
              placeholder="Search for Content..."
              autoComplete="off"
              value={keyTerms}
              onChange={(e) => setKeyTerms(e.target.value)}
            />
            <input className="button--submit" value="Seach" type="submit" />
          </div>
          <div className="radio-inputs">
            <label className="radio" htmlFor="series">
              <input
                type="radio"
                id="series"
                name="filmSeriesRadio"
                value="tv"
                defaultChecked
                onClick={(e) => setFilmOrSeries(e.target.value)}
              />
              <span className="name">SERIES</span>
            </label>
            <label className="radio" htmlFor="film">
              <input
                type="radio"
                id="film"
                name="filmSeriesRadio"
                value="movie"
                onClick={(e) => setFilmOrSeries(e.target.value)}
              />
              <span className="name">FILM</span>
            </label>
          </div>
        </form>
        <script src="FindFilmReducer"></script>
        <FindContent
          searchForm={search}
          hiddenItems={hiddenItems}
          addHiddenItem={addHiddenItem}
          removeHiddenItem={removeHiddenItem}
        />
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
