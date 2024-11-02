import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
var authorization = { Authorization: `Bearer ${APIReadKey}` };
const country = "GB";

// Called on click, make API call to get exact details of film
// Return an object that contains: name, filmID, bigger poster path, & streaming availability

//item has - .id, .title, .posterPath properties

//IF TV SHOW: https://api.themoviedb.org/3/tv/{series_id}/watch/providers
//IF MOVIE: https://api.themoviedb.org/3/movie/{movie_id}/watch/providers

////Find index of element, splice array around it & return new array
function removeElement(element, array) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return [...array];
}

//Control the content in selectedContent.
function selectedContentReducer(selectedContent, action) {
  switch (action.type) {
    case "added":
      return [...selectedContent, action.item];
    case "removed":
      return removeElement(action.item, selectedContent);
    default: {
      throw Error("Unknown Action");
    }
  }
}

export default function FindStreamingOptions({
  hiddenItems,
  addHiddenItem,
  photosUrl,
}) {
  console.log(hiddenItems);
  //Content user has clicked from accordion to add to wanted content
  const [selectedContent, dispatchSelectContent] = useReducer(
    selectedContentReducer,
    []
  );

  //Divide selectedContent into batches of 7 for the rendering to look pretty
  var sevensOfSelected = [];
  for (var i = 0; i < hiddenItems.length; i += 7) {
    var batchOfSeven = hiddenItems.slice(i, i + 7);
    sevensOfSelected.push(batchOfSeven);
  }

  const lenHiddenItems = hiddenItems.length;
  const newItem = hiddenItems[lenHiddenItems - 1];

  const url = `//api.themoviedb.org/3/${newItem.contentType}/${newItem.id}/watch/providers`;
  // const [selectedContent, dispatchSelectContent] = useReducer(
  //   selectedContentReducer,
  //   []
  // );
  //Catch if selections is empy to prevent API call error.

  //Get img pathway config details
  fetch(url, {
    method: "GET",
    headers: authorization,
  })
    .then((response) => response.json())
    .then((response) => {
      //THIS IS WHERE WE DO STUFF WITH OUR OBJECT
      const streamingOptions = console.log(response.results[country].flatrate);
      // addSelectedContent(item, streamingOptions);
    })
    .catch((err) => console.error(err));

  return (
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
              //onClick={() => removeContent(item)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
