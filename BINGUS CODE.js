// javascript stuff goes here  :)

const [titles, setTitles] = useState(["The Godfather"]);
const [ids, setIds] = useState([238]);
const [output, setOutput] = useState({ key1: "testData" });

function OutputComponent(listOfTextToRender) {
  // or here :)

  return (
    <>
      {Object.getOwnPropertyNames(listOfTextToRender).map((key) => {
        console.log(key);
        return Object.keys(listOfTextToRender[key]).map((item) => {
          console.log(listOfTextToRender[key][item]);
          return (
            <p>
              {listOfTextToRender[key][item] !== undefined
                ? "defined"
                : "undefined"}
            </p>
          );
        });
      })}
    </>
  );
}

//IN APP()

//Need a nice list of inputs at some point (will get from user input)
var country = "GB";
var filmsSearch = ["The Godfather", "Fantastic Mr. Fox"];
var authorization = { Authorization: `Bearer ${APIReadKey}` };
useEffect(() => {
  var resultIds = [];
  var resultTitles = [];
  filmsSearch.forEach((film) => {
    //fetch queiry, wait for promise to reutrn & convert to Json, wait for that, then do what I want w/ it
    var search_url = `https://api.themoviedb.org/3/search/movie?query=${film}&include_adult=true`;
    var { resultId, resultTitle } = fetch(search_url, {
      method: "GET",
      headers: authorization,
    })
      .then((r) => r.json())
      .then((jsonSearch) => {
        var resultId = jsonSearch.results[0].id;
        var resultTitle = jsonSearch.results[0].title;
        //Eventually have user select the film they want rather than assuming its just the top result
        //Put the new details in lists of IDs & Titles
        resultIds.push(resultId);
        resultTitles.push(resultTitle);
        setTitles(resultTitles.slice());
        setIds(resultIds.slice());

        //Find the streaming options by country for current title
        var query_url = `https://api.themoviedb.org/3/movie/${resultId}/watch/providers`;
        fetch(query_url, { method: "GET", headers: authorization })
          .then((r) => r.json())
          .then((jsonQuery) => {
            var countryFiltered = jsonQuery.results[country];
            if (countryFiltered !== undefined) {
              var flatrateFiltered = countryFiltered.flatrate;
              var providers = [];
              var buildDictEntry = [];
              //Find out where the providers are going??
              //console.log("FLATRATE:", flatrateFiltered);
              for (var provider in flatrateFiltered) {
                providers.push(provider.provider_name);

                console.log("EACH PROVIDER", provider);

                buildDictEntry.push(
                  ...[provider.provider_name, provider.display_priority]
                );
              }
              console.log("TOTAL PROVIDERS:", providers);
              var titleProvidersDict = {};
              titleProvidersDict[resultTitle] = buildDictEntry;

              const titleProvidersDeepClone =
                structuredClone(titleProvidersDict);
              console.log(structuredClone(titleProvidersDict));
              setOutput(structuredClone(titleProvidersDict));
              console.log("PROVIDERS DICT:", titleProvidersDeepClone);
            }
          });
      });
  });
}, []);
