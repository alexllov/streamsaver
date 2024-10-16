import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";

//Need a nice list of inputs at some point (will get from user input)
var country = "GB";
var filmsSearch = ["The Godfather", "Fantastic Mr. Fox"];
var authorization = { Authorization: `Bearer ${APIReadKey}` };

function foundItemsReducer(shows, action) {
  console.log("REDUCER IS RUNNING");
  switch (action.type) {
    case "added":
      return [
        ...shows,
        {
          id: action.id,
          title: action.title,
          posterPath: action.posterPath,
          //done: false,
        },
      ];
    default: {
      throw Error("Unknown Action");
    }
  }
}

function selectedFilmReducer(selectedShows, action) {
  switch (action.type) {
    case "added":
      return [
        ...selectedShows,
        {
          item: action.item,
        },
      ];
    default: {
      throw Error("Unknown Action");
    }
  }
}

export default function FindFilm() {
  //useReducer
  const [foundItems, dispatch] = useReducer(foundItemsReducer, []);
  const [photosUrl, setphotosUrl] = useState("");
  const [selectedShows, dispatchSelectFilm] = useReducer(
    selectedFilmReducer,
    []
  );

  function addFilm(id, title, posterPath) {
    dispatch({
      type: "added",
      id: id,
      title: title,
      posterPath: posterPath,
    });
  }

  function selectFilm(item) {
    console.log("You clicked on", item.title);
    dispatchSelectFilm({
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
        //const pixelSize = response.images.poster_sizes[response.images.poster_sizes.length - 3];
        const pixelSize = response.images.poster_sizes[1];

        setphotosUrl(`${baseUrl}${pixelSize}`);
      })

      .catch((err) => console.error(err));
    console.log("CONSOLE LOG OF CONFIGURL VAR", photosUrl);

    filmsSearch.forEach((film) => {
      //fetch query, wait for promise to reutrn & convert to Json, wait for that, then do what I want w/ it
      var search_url = `https://api.themoviedb.org/3/search/movie?query=${film}&include_adult=true`;
      fetch(search_url, {
        method: "GET",
        headers: authorization,
      })
        .then((r) => r.json())
        .then((jsonSearch) => {
          var id = jsonSearch.results[0].id;
          var title = jsonSearch.results[0].title;
          var posterPath = jsonSearch.results[0].poster_path;
          //Eventually have user select the film they want rather than assuming its just the top result
          //Put the new details in lists of IDs & Titles

          //Send values to dispatch
          addFilm(id, title, posterPath);
          console.log("LOG RESULT & ID", id, title, posterPath);
        });
    });
  }, []);

  return (
    <div>
      {console.log("RETURN:", foundItems)}
      {foundItems.map((item, index) => (
        <div key={index}>
          <p>{item.title}</p>
          <p>{item.id}</p>
          <img
            onClick={() => selectFilm(item)}
            key={item.id}
            src={photosUrl + item.posterPath}
            alt={item.title}
            //width={100}
          />
        </div>
      ))}
    </div>
  );
}
