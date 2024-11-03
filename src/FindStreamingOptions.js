import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
var authorization = { Authorization: `Bearer ${APIReadKey}` };
const country = "GB";

// Called on click, make API call to get exact details of film
// Return an object that contains: name, filmID, bigger poster path, & streaming availability
export default function FindStreamingOptions({
  hiddenItems,
  photosUrl,
  selectedContent,
  addContentToSelectedContent,
  removeContent,
}) {
  //Divide selectedContent into batches of 7 for the rendering to look pretty
  var sevensOfSelected = [];
  for (var i = 0; i < selectedContent.length; i += 7) {
    var batchOfSeven = selectedContent.slice(i, i + 7);
    sevensOfSelected.push(batchOfSeven);
  }

  const lenHiddenItems = hiddenItems.length;
  const newItem = hiddenItems[lenHiddenItems - 1];

  //Get Streaming Options
  useEffect(() => {
    //check if latest item already in selected to avoid dupication
    for (const item of selectedContent) {
      if (item.id == newItem.id) {
        return;
      }
    }

    const url = `//api.themoviedb.org/3/${newItem.contentType}/${newItem.id}/watch/providers`;

    fetch(url, {
      method: "GET",
      headers: authorization,
    })
      .then((response) => response.json())
      .then((response) => {
        const streamingOptions = response.results[country].flatrate;
        addContentToSelectedContent(newItem, streamingOptions);
      })
      .catch((err) => console.error(err));
  }, [hiddenItems]);

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
              onClick={() => removeContent(item)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
