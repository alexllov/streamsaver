import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
var authorization = { Authorization: `Bearer ${APIReadKey}` };
const country = "GB";

// Called on click, make API call to get exact details of film
// Return an object that contains: name, filmID, bigger poster path, & streaming availability

//item has - .id, .title, .posterPath properties

//IF TV SHOW: https://api.themoviedb.org/3/tv/{series_id}/watch/providers
//IF MOVIE: https://api.themoviedb.org/3/movie/{movie_id}/watch/providers
export default function FindStreamingOptions(item) {
  const url = `//api.themoviedb.org/3/${item.contentType}/${item.id}/watch/providers`;
  // const [selectedContent, dispatchSelectContent] = useReducer(
  //   selectedContentReducer,
  //   []
  // );

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
}
