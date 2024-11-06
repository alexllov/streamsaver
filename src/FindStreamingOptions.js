import { useState, useEffect, useReducer } from "react";
import { APIReadKey } from "./keys";
import Stack from "react-bootstrap/Stack";
import { Container } from "react-bootstrap";
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

  //onClick={() => removeContent(item)}

  return (
    <>
      <Container
        style={{
          width: "80vw",
          gap: "1rem",
        }}
      >
        <Stack class="mx-auto">
          <div>Available Conent</div>
          <div
            key={`Available Conent`}
            style={{
              gap: "1rem",
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
            }}
          >
            {selectedContent.map((item, index2) => (
              // Lazy & ternary operator, cheat out HTML when 1st is True
              <div onClick={() => removeContent(item)}>
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
            ))}
          </div>
        </Stack>
      </Container>
    </>
  );
}
