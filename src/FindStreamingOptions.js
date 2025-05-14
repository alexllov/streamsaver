import { useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import { Container } from "react-bootstrap";
const country = "GB";

/**
 * Called on click, make API call to get exact details of selected film.
 * Return an object that contains:
 * name, filmID, bigger poster path, & streaming availability
 */
export default function FindStreamingOptions({
  hiddenItems,
  photosUrl,
  selectedContent,
  addContentToSelectedContent,
  removeContent,
}) {
  const lenHiddenItems = hiddenItems.length;
  const newItem = hiddenItems[lenHiddenItems - 1];

  // Get Streaming Options.
  useEffect(() => {
    // Check if latest item already in selected to avoid dupication.
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
        const streamingOptions = response.results[country].free
          ? response.results[country].free
          : response.results[country].flatrate;
        addContentToSelectedContent(newItem, streamingOptions);
      })
      .catch((err) => console.error(err));
  }, [hiddenItems]);

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
              <div onClick={() => removeContent(item)} key={index2}>
                <img
                  key={item.id}
                  src={photosUrl + item.posterPath}
                  alt={item.title}
                  width={200}
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
