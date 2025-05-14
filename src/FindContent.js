import { useState, useEffect, useReducer } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Container } from "react-bootstrap";

// Control the content of foundItems.
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
          justWatchLink: action.justWatchLink,
          tmdbLink: action.tmdbLink,
        },
      ];

    // Add new found content into the last array in foundItems (for accordion).
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
            justWatchLink: action.justWatchLink,
            tmdbLink: action.tmdbLink,
          },
        ],
      ];

    // Spread shows, add new array to end, for next section of accordion.
    case "addArray":
      return [...shows, []];
    default: {
      throw Error("Unknown Action");
    }
  }
}

// Takes form inputs, returns the first page of results from API.
export default function FindContent({
  searchForm,
  hiddenItems,
  addHiddenItem,
  photosUrl,
}) {
  // Content returned from API after form search.
  const [foundItems, dispatchFoundItems] = useReducer(foundItemsReducer, []);

  // Stores search terms used by the user to name accordion sections.
  const [searchedTerms, setSearchedTerms] = useState([]);

  const searchTerm = searchForm[0];
  const filmOrSeries = searchForm[1];
  const country = searchForm[2];
  const safeSearch = searchForm[3];

  function addNewContentArray() {
    dispatchFoundItems({
      type: "addArray",
    });
  }

  function addContentToLastArray(
    id,
    title,
    posterPath,
    contentType,
    justWatchLink,
    tmdbLink
  ) {
    dispatchFoundItems({
      type: "addToLastArray",
      id: id,
      title: title,
      posterPath: posterPath,
      contentType: contentType,
      justWatchLink: justWatchLink,
      tmdbLink: tmdbLink,
    });
  }

  /**
   * Check if content is visible:
   * iterate through the IDs in hiddenItemIds to look for a match.
   */
  function isVisible(id, hiddenItems) {
    var visible = true;
    hiddenItems.forEach((item) => {
      if (item.id == id) {
        visible = false;
      }
    });

    return visible;
  }

  // Generate JustWatch link from query reult.
  function createJustWatchLink(title, contentType, country) {
    if (country == "GB") {
      country = "uk";
    }
    var searchTitle = title.replace(/:/g, "");
    searchTitle = searchTitle.replace(/\s+/g, "-");
    if (contentType == "tv") {
      contentType = "tv-series";
    }
    const path = `https://www.justwatch.com/${country}/${contentType}/${searchTitle}`;
    return path;
  }

  // Generate TMDB link from query reult.
  function createtmdbLink(id, title, contentType) {
    var searchTitle = title.replace(/:/g, "");
    searchTitle = searchTitle.replace(/\s+/g, "-");
    const path = `https://www.themoviedb.org/${contentType}/${id}-${searchTitle}/watch?language=en-GB`;
    return path;
  }

  //Catch if form is empy to prevent API call error.
  useEffect(() => {
    if (searchTerm === null) {
      return;
    }

    //Search Results stored as 2D array so that they display in the accordion.
    addNewContentArray();

    /**
     * Fetch query, for each result returned record:
     * id, title, posterPath, content type, JustWatch & TMDB links.
     */
    const middleManUrl =
      "https://beneficial-cherry-evergreen.glitch.me/findContent";
    var searchUrl = `https://api.themoviedb.org/3/search/${filmOrSeries}?query=${searchTerm}&include_adult=${safeSearch}`;
    setSearchedTerms([...searchedTerms, searchTerm]);

    const headers = {
      Authorization: "HELLO :)",
      searchUrl: searchUrl,
    };

    fetch(middleManUrl, {
      method: "GET",
      headers: headers,
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
          const justWatchLink = createJustWatchLink(
            title,
            contentType,
            country
          );
          const tmdbLink = createtmdbLink(id, title, contentType);
          addContentToLastArray(
            id,
            title,
            posterPath,
            contentType,
            justWatchLink,
            tmdbLink
          );
        });
      });
  }, [searchForm]);

  return (
    <>
      <Container
        style={{
          width: "80vw",
          gap: "1rem",
        }}
      >
        <Accordion alwaysOpen data-bs-theme="dark">
          {foundItems.map((itemArray, index) => (
            <Accordion.Item key={index} eventKey={index}>
              <Accordion.Header>{searchedTerms[index]}</Accordion.Header>
              <Accordion.Body
                key={`${index}`}
                style={{
                  gap: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  overflowX: "auto",
                }}
              >
                {itemArray.map(
                  (item, index2) =>
                    // Lazy & ternary operator cheat out HTML when 1st is True.
                    isVisible(item.id, hiddenItems) && (
                      <div
                        onClick={() => addHiddenItem(item)}
                        key={`${index2}`}
                      >
                        <img
                          key={item.id}
                          src={photosUrl + item.posterPath}
                          alt={item.title}
                          // Locking width lets use larger posster w/o needing additional call/ storing info.
                          width={200}
                        />
                        <p>{item.title}</p>
                      </div>
                    )
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  );
}
