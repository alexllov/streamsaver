import { useState, useEffect, useReducer } from "react";
import Stack from "react-bootstrap/Stack";
import { Container } from "react-bootstrap";
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
    const middleManUrl =
      "https://beneficial-cherry-evergreen.glitch.me/findStreamingOptions";
    const searchUrl = `https://api.themoviedb.org/3/${newItem.contentType}/${newItem.id}/watch/providers`;
    const headers = {
      Authorization: "HELLO :)",
      searchUrl: searchUrl,
    };
    fetch(middleManUrl, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("FindStreamingOptions API call made");
        const streamingOptions = response.results[country].flatrate;
        addContentToSelectedContent(newItem, streamingOptions);
      })
      .catch((err) => console.error(err));
  }, [hiddenItems]);

  //onClick={() => removeContent(item)}

  return (
    <Container
      style={{
        width: "80vw",
      }}
    >
      <>
        <div
          style={{
            backgroundColor: "#198754",
            borderRadius: "0.5rem 0.5rem 0 0",
          }}
        >
          Available Content
        </div>
      </>
      <Container
        style={{
          gap: "1rem",
          backgroundColor: "#212529",
          borderRadius: "0 0 0.5rem 0.5rem",
          paddingTop: "1rem",
        }}
      >
        <Stack className="mx-auto">
          <div
            key={`Available Content`}
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
    </Container>
  );
}
