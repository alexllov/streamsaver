import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";

var authorization = { Authorization: `Bearer ${APIReadKey}` };

function foundItemsReducer(shows, action) {
  switch (action.type) {
    case "added":
      return [
        ...shows,
        {
          id: action.id,
          title: action.title,
          posterPath: action.posterPath,
          //searchTerm: action.searchTerm,
        },
      ];
    case "addToLastArray":
      var lastArray = shows[shows.length - 1];
      return [
        ...shows.slice(0, -1),
        [
          ...lastArray,
          {
            id: action.id,
            title: action.title,
            posterPath: action.posterPath,
            //searchTerm: action.searchTerm,
          },
        ],
      ];
    case "addArray":
      return [...shows, []];
    default: {
      throw Error("Unknown Action");
    }
  }
}

function selectedContentReducer(selectedContent, action) {
  switch (action.type) {
    case "added":
      return [...selectedContent, action.item];
    default: {
      throw Error("Unknown Action");
    }
  }
}

export default function FindContent({ searchForm }) {
  //useReducer
  const [foundItems, dispatchFoundItems] = useReducer(foundItemsReducer, []);
  const [photosUrl, setphotosUrl] = useState("");
  const [selectedContent, dispatchSelectContent] = useReducer(
    selectedContentReducer,
    []
  );
  const [searchedTerms, setSearchedTerms] = useState([]);

  var searchTerm = searchForm[0];
  var filmOrSeries = searchForm[1];
  var country = searchForm[2];
  var safeSearch = searchForm[3];

  function addContent(id, title, posterPath) {
    dispatchFoundItems({
      type: "added",
      id: id,
      title: title,
      posterPath: posterPath,
      //searchTerm: searchTerm,
    });
  }

  function addNewContentArray() {
    dispatchFoundItems({
      type: "addArray",
    });
  }

  function addContentToLastArray(id, title, posterPath) {
    dispatchFoundItems({
      type: "addToLastArray",
      id: id,
      title: title,
      posterPath: posterPath,
      //searchTerm: searchTerm,
    });
  }

  function selectContent(item) {
    console.log("You clicked on", item.title);
    dispatchSelectContent({
      type: "added",
      item: item,
    });
  }

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
        const pixelSize = response.images.poster_sizes[1];

        setphotosUrl(`${baseUrl}${pixelSize}`);
      })
      .catch((err) => console.error(err));
    console.log("CONSOLE LOG OF CONFIGURL VAR", photosUrl);
  }, []);

  useEffect(() => {
    if (searchTerm === null) {
      return;
    }

    //Make Accordion, create new layer here before searches
    //Search Results stored as 2D array
    addNewContentArray();

    //fetch query, wait for promise to reutrn & convert to Json, wait for that, then do what I want w/ it
    var search_url = `https://api.themoviedb.org/3/search/${filmOrSeries}?query=${searchTerm}&include_adult=${safeSearch}`;
    setSearchedTerms([...searchedTerms, searchTerm]);

    fetch(search_url, {
      method: "GET",
      headers: authorization,
    })
      .then((r) => r.json())
      .then((jsonSearch) => {
        jsonSearch.results.forEach((result) => {
          var id = result.id;
          var title = result.name ? result.name : result.title;
          var posterPath = result.poster_path;
          //Eventually have user select the film they want rather than assuming its just the top result
          //Put the new details in lists of IDs & Title
          //Send values to dispatch
          console.log(searchTerm);
          addContentToLastArray(id, title, posterPath);
        });
      });
  }, [searchForm]);

  return (
    <>
      <Accordion alwaysOpen style={{ width: "80vw" }}>
        {foundItems.map((itemArray, index) => (
          <Accordion.Item key={index} eventKey={index}>
            <Accordion.Header>{searchedTerms[index]}</Accordion.Header>
            <Accordion.Body
              key={`${index}`}
              style={{
                width: "80vw",
                gap: "1vw",
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
              }}
            >
              {itemArray.map((item, index2) => (
                <div>
                  <img
                    onClick={() => selectContent(item)}
                    key={item.id}
                    src={photosUrl + item.posterPath}
                    alt={item.title}
                    //width={100}
                    //looks @ css flexbox/ padding/ margin for spacing
                  />
                  <p>{item.title}</p>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <Container>
        {selectedContent.map((item, index) => (
          <div>
            <img
              key={item.id}
              src={photosUrl + item.posterPath}
              alt={item.title}
            />
            <p>{item.title}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
