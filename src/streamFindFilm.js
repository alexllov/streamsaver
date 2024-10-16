import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";

//Need a nice list of inputs at some point (will get from user input)
var country = "GB";
var filmsSearch = ["The Godfather", "Fantastic Mr. Fox"];
var authorization = { Authorization: `Bearer ${APIReadKey}` };

const FindFilm = () => {
    //useReducer
  const [shows, setShows] = useState([]);
  useEffect(() => {
    var resultTitlesAndIds = [];
    filmsSearch.forEach((film) => {
      //fetch query, wait for promise to reutrn & convert to Json, wait for that, then do what I want w/ it
      var search_url = `https://api.themoviedb.org/3/search/movie?query=${film}&include_adult=true`;
      fetch(search_url, {
        method: "GET",
        headers: authorization,
      })
        .then((r) => r.json())
        .then((jsonSearch) => {
          var resultId = jsonSearch.results[0].id;
          var resultTitle = jsonSearch.results[0].title;
          //Eventually have user select the film they want rather than assuming its just the top result
          //Put the new details in lists of IDs & Titles
          console.log("Film:", resultTitle, "ID:", resultId);
          setShows([...shows, (resultTitle, resultId)]);
          //    shows = [(itemA, itemB), (itemC, itemD), ...]
          // ...shows = (itemA, itemB), (itemC, itemD), ...
        });
      resultTitlesAndIds.push((resultTitle, resultId));
    });
    setShows([...shows, ...resultTitlesAndIds]);
  }, []);

  return (
    <div>
      {console.log(shows)}
      {shows.map((show, index) => (
        <p key={index}>{show}</p>
      ))}
    </div>
  );
};

export default FindFilm;
