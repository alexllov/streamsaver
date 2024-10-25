import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
          visible: true,
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
            visible: true,
          },
        ],
      ];
    //Spread shows, add new array to end, for next section of accordion.
    case "addArray":
      return [...shows, []];
    //Change item's visibility to 'false'
    //case "hideItem":
    //  for (var array in shows) {
    //    for (var item in array) {
    //
    //    }
    //  }
    //  return [];
    default: {
      throw Error("Unknown Action");
    }
  }
}

//Control the content in selectedContent.
function selectedContentReducer(selectedContent, action) {
  switch (action.type) {
    case "added":
      return [...selectedContent, action.item];
    case "removed":
      //Find index of action.item, splice array around it & return
      const index = selectedContent.indexOf(action.item);
      if (index > -1) {
        selectedContent.splice(index, 1);
      }
      return [...selectedContent];
    default: {
      throw Error("Unknown Action");
    }
  }
}

//Control the items that are 'Hidden' from search draws, ie content that has been selected.
function hiddentItemIdsReducer(hiddenItemIds, action) {
  switch (action.type) {
    case "added":
      return [...hiddenItemIds, action.id];
    case "removed":
      const index = hiddenItemIds.indexOf(action.id);
      if (index > -1) {
        console.log(hiddenItemIds);
        hiddenItemIds.splice(index, 1);
        console.log(hiddenItemIds);
      }
      return [...hiddenItemIds];
    default: {
      throw Error("Unknown Action");
    }
  }
}

//Control the items that are shown in search draws, ie content that has been selected.
//function shownSearchResultsReducer(shownSearchResults, action, foundItems) {
//  switch (action.type) {
//    case "removed":
//      console.log(action.id);
//      return [...shownSearchResults, action.id];
//    default: {
//      throw Error("Unknown Action");
//    }
//  }
//}

export default function FindContent({ searchForm }) {
  //useReducer to track hiddenContent
  //Content returned from API after form search
  const [foundItems, dispatchFoundItems] = useReducer(foundItemsReducer, []);
  //Url for photos from API call
  const [photosUrl, setphotosUrl] = useState("");
  //Content user has clicked from accordion to add to wanted content
  const [selectedContent, dispatchSelectContent] = useReducer(
    selectedContentReducer,
    []
  );
  //Stores search terms used by the user to name accordion sections
  const [searchedTerms, setSearchedTerms] = useState([]);
  //Stores the IDs of items that have been selected in order to work out hiding them
  const [hiddenItemIds, dispatchHiddenItemIds] = useReducer(
    hiddentItemIdsReducer,
    []
  );
  //Stores all foundItems that are not in hiddenItemIds, so that order can be preserved in foundItems
  //const [shownSearchResults, dispatchShownSearchResults] = useReducer(shownSearchResultsReducer, []);

  var searchTerm = searchForm[0];
  var filmOrSeries = searchForm[1];
  var country = searchForm[2];
  var safeSearch = searchForm[3];

  //Divide selectedContent into batches of 7 for the rendering to look pretty
  var sevensOfSelected = [];
  for (var i = 0; i < selectedContent.length; i += 7) {
    var batchOfSeven = selectedContent.slice(i, i + 7);
    sevensOfSelected.push(batchOfSeven);
  }

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

  function addContentToLastArray(id, title, posterPath) {
    dispatchFoundItems({
      type: "addToLastArray",
      id: id,
      title: title,
      posterPath: posterPath,
    });
  }

  //Take user click -> add item to selected content & hidden ids
  function selectContent(item) {
    console.log("You clicked on", item.title);
    dispatchSelectContent({
      type: "added",
      item: item,
    });
    dispatchHiddenItemIds({
      type: "added",
      id: item.id,
    });
  }

  //Take user click -> remove item from selected content & hidden ids
  function removeContent(item) {
    dispatchSelectContent({
      type: "removed",
      item: item,
    });
    dispatchHiddenItemIds({
      type: "removed",
      id: item.id,
    });
  }

  //Check if content is visible: iterate through the IDs in hiddenItemIds to look for a match.
  function isVisible(id, hiddenItemIds) {
    var visible = true;
    hiddenItemIds.forEach((item) => {
      if (item == id) {
        console.log("Found item that's hidden");
        visible = false;
      }
    });
    return visible;
  }

  var list = [1];
  var testVal = 11;
  console.log(isVisible(testVal, list));

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
    //Catch if form is empy to prevent API call error.
    if (searchTerm === null) {
      return;
    }

    //Make Accordion, create new layer here before searches.
    //Search Results stored as 2D array.
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
              {itemArray.map(
                (item, index2) =>
                  isVisible(item.id, hiddenItemIds) && (
                    <div onClick={() => selectContent(item)}>
                      <img
                        key={item.id}
                        src={photosUrl + item.posterPath}
                        alt={item.title}
                        //width={100}
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
      <div className="Container-Container">
        <p></p>
        <h1>Selected Content</h1>
        {sevensOfSelected.map((batch) => (
          <div className="Container">
            {batch.map((item) => (
              <img
                key={item.id}
                src={photosUrl + item.posterPath}
                alt={item.title}
                onClick={() => removeContent(item)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
