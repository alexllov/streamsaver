import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import FindContent from "./FindContent";
import FindStreamingOptions from "./FindStreamingOptions";
import SetCoverSolution from "./SetCoverSolution";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const authorization = { Authorization: `Bearer ${APIReadKey}` };

function removeElement(element, array) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  array = array.filter((item) => item.id != element.id);
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

//Control the content in selectedContent.
function selectedContentReducer(selectedContent, action) {
  switch (action.type) {
    case "add":
      return [...selectedContent, action.item];
    case "remove":
      return removeElement(action.item, selectedContent);
    default: {
      throw Error("Unknown Action");
    }
  }
}

function App() {
  //Control the items that are 'Hidden' from search draws, ie content that has been selected.
  ////Find index of element, splice array around it & return new array

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

  function addContentToSelectedContent(item, streamingOptions) {
    dispatchSelectedContent({
      type: "add",
      item: {
        id: item.id,
        title: item.title,
        posterPath: item.posterPath,
        contentType: item.contentType,
        streamingOptions: streamingOptions,
      },
    });
  }

  function removeContent(item) {
    dispatchSelectedContent({
      type: "remove",
      item: item,
    });
    removeHiddenItem(item);
    setResultsLoaded(false);
  }

  // javascript stuff goes here  :)
  // Country should probably be stored as a separate drop-down & sent to FindStreamingOptions directly,
  //   its not actually needsd in FindContent, so making it part of the form only complicates things
  const [hiddenItems, dispatchHiddenItems] = useReducer(hiddenItemsReducer, []);
  const [selectedContent, dispatchSelectedContent] = useReducer(
    selectedContentReducer,
    []
  );
  //Url for photos from API call
  const [photosUrl, setphotosUrl] = useState("");

  //Bool for search results button
  const [resultsLoaded, setResultsLoaded] = useState(false);

  // form contents
  const [keyTerms, setKeyTerms] = useState("");
  const [filmOrSeries, setFilmOrSeries] = useState("tv");
  const [country, setCountry] = useState("GB");
  const [safeSearch, setSafeSearch] = useState(false);
  const [search, setSearch] = useState([null, null, null, null]);

  useEffect(() => {
    //Get img pathway config details
    const configQueryUrl = "https://api.themoviedb.org/3/configuration";
    fetch(configQueryUrl, {
      method: "GET",
      headers: authorization,
    })
      .then((response) => response.json())
      .then((response) => {
        const baseUrl = response.images.base_url;
        // Need to add an extra detail in here to get both small & larger poster so that can adjust size#
        // Adjusted size taken from 1 -> 3, so they look better @ scale
        const pixelSize = response.images.poster_sizes[3];

        setphotosUrl(`${baseUrl}${pixelSize}`);
      })
      .catch((err) => console.error(err));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    var search = [keyTerms, filmOrSeries, country, safeSearch];
    setSearch(search);
    console.log(`You've Pressed Submit ${search}`);
  }

  function handleClick(e) {
    e.preventDefault();
    setResultsLoaded(true);
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
        {!resultsLoaded && (
          <FindContent
            searchForm={search}
            hiddenItems={hiddenItems}
            addHiddenItem={addHiddenItem}
            photosUrl={photosUrl}
          />
        )}
        {hiddenItems.length != 0 && (
          <FindStreamingOptions
            hiddenItems={hiddenItems}
            photosUrl={photosUrl}
            selectedContent={selectedContent}
            addContentToSelectedContent={addContentToSelectedContent}
            removeContent={removeContent}
          />
        )}
        {hiddenItems.length != 0 && !resultsLoaded && (
          <Button variant="success" onClick={handleClick}>
            Click Me
          </Button>
        )}
        {resultsLoaded && (
          <SetCoverSolution
            selectedContent={selectedContent}
            photosUrl={photosUrl}
          />
        )}
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
