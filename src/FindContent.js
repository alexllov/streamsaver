import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import findStreamingOptions from "./FindStreamingOptions";
import FindStreamingOptions from "./FindStreamingOptions";

var authorization = { Authorization: `Bearer ${APIReadKey}` };

//Control the content of foundItems.
function foundItemsReducer(shows, action) {
  switch (action.type) {
    case "added":
      return [
        ...shows,
        {
          id: action.id,
          title: action.title,
          posterPath: action.posterPath,
          contentType: action.contentType,
        },
      ];
    //Add newly found content into the last array in foundItems (for accordion).
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
            contentType: action.contentType,
          },
        ],
      ];
    //Spread shows, add new array to end, for next section of accordion.
    case "addArray":
      return [...shows, []];
    default: {
      throw Error("Unknown Action");
    }
  }
}

export default function FindContent({
  searchForm,
  addHiddenItem,
  hiddenItems,
}) {
  //useReducer to track hiddenContent
  //Content returned from API after form search
  const [foundItems, dispatchFoundItems] = useReducer(foundItemsReducer, []);
  //Url for photos from API call
  const [photosUrl, setphotosUrl] = useState("");

  //Stores search terms used by the user to name accordion sections
  const [searchedTerms, setSearchedTerms] = useState([]);
  //

  const searchTerm = searchForm[0];
  const filmOrSeries = searchForm[1];
  const country = searchForm[2];
  const safeSearch = searchForm[3];

  //  function addContent(id, title, posterPath) {
  //    dispatchFoundItems({
  //      type: "added",
  //      id: id,
  //      title: title,
  //      posterPath: posterPath,
  //    });
  //  }

  function addNewContentArray() {
    dispatchFoundItems({
      type: "addArray",
    });
  }

  function addContentToLastArray(id, title, posterPath, contentType) {
    dispatchFoundItems({
      type: "addToLastArray",
      id: id,
      title: title,
      posterPath: posterPath,
      contentType: contentType,
    });
  }

  //Take user click -> add item to selected content & hidden ids
  // function selectContent(item) {
  //   //check if the item already has streaming details property. If not make func call
  //   // IF does, then just save it straight - reduces calls in case user deselects then reselects
  //   console.log(item);
  //   //const streamingOptions = await findStreamingOptions(item);
  //   console.log(item);
  //   dispatchSelectContent({
  //     type: "added",
  //     item: item,
  //   });
  //   dispatchHiddenItemIds({
  //     type: "added",
  //     id: item.id,
  //   });
  // }

  // //Take user click -> remove item from selected content & hidden ids.
  // function removeContent(item) {
  //   dispatchSelectContent({
  //     type: "removed",
  //     item: item,
  //   });
  //   dispatchHiddenItemIds({
  //     type: "removed",
  //     id: item.id,
  //   });
  // }

  //Check if content is visible: iterate through the IDs in hiddenItemIds to look for a match.
  function isVisible(id, hiddenItems) {
    var visible = true;
    hiddenItems.forEach((item) => {
      if (item.id == id) {
        visible = false;
      }
    });
    return visible;
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
        // Need to add an extra detail in here to get both small & larger poster so that can adjust size#
        // Adjusted size taken from 1 -> 3, so they look better @ scale
        const pixelSize = response.images.poster_sizes[3];

        setphotosUrl(`${baseUrl}${pixelSize}`);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    //Catch if form is empy to prevent API call error.
    if (searchTerm === null) {
      return;
    }

    //Search Results stored as 2D array so that they display in the accordion.
    addNewContentArray();

    //fetch query, wait for promise to reutrn & convert to Json, wait for that, then do what I want w/ it.
    //For each result returned, record id, title & posterPath.
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
          if ("title" in result) {
            var contentType = "movie";
          } else {
            var contentType = "tv";
          }
          addContentToLastArray(id, title, posterPath, contentType);
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
              {itemArray.map(
                (item, index2) =>
                  // Lazy & ternary operator, cheat out HTML when 1st is True
                  isVisible(item.id, hiddenItems) && (
                    <div onClick={() => addHiddenItem(item)}>
                      <img
                        key={item.id}
                        src={photosUrl + item.posterPath}
                        alt={item.title}
                        //Locking width lets use larger posster w/o needing additional call/ storing info
                        width={200}
                        //looks @ css flexbox/ padding/ margin for spacing
                      />
                      <p>{item.title}</p>
                    </div>
                  )
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      {hiddenItems.length != 0 && (
        <FindStreamingOptions
          hiddenItems={hiddenItems}
          addHiddenItem={addHiddenItem}
          photosUrl={photosUrl}
        />
      )}
    </>
  );
}
