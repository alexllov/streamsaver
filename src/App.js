import logo from "./logo.svg";
import { useState, useEffect, useReducer } from "react";
import FindContent from "./FindContent";
import FindStreamingOptions from "./FindStreamingOptions";
import SetCoverSolution from "./SetCoverSolution";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Container, FloatingLabel, Row } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import "./App.css";

const authorization = { Authorization: "Hello :)" };

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
        justWatchLink: item.justWatchLink,
        tmdbLink: item.tmdbLink,
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

  //Bool for website instructions
  const [showInstructions, setShowInstructions] = useState(true);

  // form contents
  const [keyTerms, setKeyTerms] = useState("");
  const [filmOrSeries, setFilmOrSeries] = useState("tv");
  const [country, setCountry] = useState("GB");
  const [safeSearch, setSafeSearch] = useState(false);
  const [search, setSearch] = useState([null, null, null, null]);

  useEffect(() => {
    //Get img pathway config details
    const middleManUrl =
      "https://beneficial-cherry-evergreen.glitch.me/photoUrl";
    fetch(middleManUrl, {
      method: "GET",
      headers: authorization,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("PhotoApi call made");
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
    setResultsLoaded(false);
    setShowInstructions(false);
    console.log(`You've Pressed Submit ${search}`);
  }

  function handleClick(e) {
    e.preventDefault();
    setResultsLoaded(true);
  }
  //<img src={logo} className="App-logo" alt="logo" />
  return (
    <div className="App">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <header className="App-header">
        <img src={logo} width="250" style={{ marginTop: 10 }} />
        <br />
        <Stack gap={"5 rem"}>
          <Container
            style={{
              width: "80vw",
              gap: "1rem",
              zIndex: "10",
              position: "sticky",
              top: "2vh",
            }}
          >
            <Form
              id="showSearchForm"
              onSubmit={handleSubmit}
              data-bs-theme="dark"
            >
              <InputGroup
                style={{
                  height: "4rem",
                  borderRadius: "0.375rem 0.375rem 0 0",
                  boxShadow: "0 0 0px 1px #198754",
                }}
              >
                <Form.Control
                  type="searchTerm"
                  id="searchTerm"
                  placeholder="Search for Content..."
                  autoComplete="off"
                  value={keyTerms}
                  className="formSearchBox"
                  onChange={(e) => setKeyTerms(e.target.value)}
                />
                <Button
                  variant="outline-success"
                  className="button--submit"
                  type="submit"
                  style={{
                    borderRadius: "0 0.375 0 0",
                    borderTop: 0,
                    borderRight: 0,
                  }}
                >
                  Search
                </Button>
              </InputGroup>
              <div
                className="radio-inputs"
                style={{
                  gap: "1rem",
                }}
              >
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
            </Form>
          </Container>
          {showInstructions && (
            <Container
              style={{
                width: "80vw",
                paddingTop: "1rem",
              }}
            >
              <p>1. Search for the films & tv shows you want to watch.</p>
              <br />
              <p>
                2. Click on something to select it; if its available to stream
                it will be added to Available Content.
              </p>
              <br />
              <p>
                3. Press the button to find which streaming services you need to
                access your content.
              </p>
            </Container>
          )}
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
            <Container
              style={{
                width: "80vw",
                gap: "1rem",
              }}
            >
              <Button variant="success" onClick={handleClick}>
                Click Me
              </Button>
            </Container>
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
        </Stack>
        <Container className="attributionContainer">
          <div>
            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"></img>
            <img
              alt="JustWatch"
              src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg"
              class="center"
            ></img>
          </div>
          <br />
          <div>
            <p>
              This website uses TMDB and the TMDB APIs but is not endorsed,
              certified, or otherwise approved by TMDB.
            </p>
            <p>
              Streaming details are found thanks to the JustWatch API (via
              TMDB).
            </p>
          </div>
        </Container>
      </header>
    </div>
  );
}

export default App;
