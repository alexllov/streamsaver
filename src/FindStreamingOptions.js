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
  return array;
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

export default function FindStreamingOptions({
  hiddenItems,
  removeHiddenItem,
  photosUrl,
}) {
  //Content user has clicked from accordion to add to wanted content
  // const [newItem, setNewItem] = useState([]);
  const [selectedContent, dispatchSelectedContent] = useReducer(
    selectedContentReducer,
    []
  );
  //const [newItem, setNewItem] = useState([]);

  //Divide selectedContent into batches of 7 for the rendering to look pretty
  console.log(selectedContent);
  var sevensOfSelected = [];
  for (var i = 0; i < selectedContent.length; i += 7) {
    var batchOfSeven = selectedContent.slice(i, i + 7);
    sevensOfSelected.push(batchOfSeven);
  }
  console.log(sevensOfSelected);

  function addContentToSelectedContent(item, streamingOptions) {
    dispatchSelectedContent({
      type: "add",
      item: {
        id: item.id,
        title: item.title,
        posterPath: item.posterPath,
        contentType: item.contentType,
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
  }

  const lenHiddenItems = hiddenItems.length;
  const newItem = hiddenItems[lenHiddenItems - 1];
  console.log(newItem);

  //Get img pathway config details
  useEffect(() => {
    //check for stuff in hidden but not in selected
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
        //THIS IS WHERE WE DO STUFF WITH OUR OBJECT
        console.log(newItem);
        const streamingOptions = response.results[country].flatrate;
        addContentToSelectedContent(newItem, streamingOptions);
        console.log(selectedContent);
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
