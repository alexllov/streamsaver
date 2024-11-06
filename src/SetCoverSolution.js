import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Container } from "react-bootstrap";

/*Providers Contains: 
provider_name: 
display_priority: 
logo_path: 
availableContent: []
*/

function removeElement(element, array) {
  array = array.filter((item) => item.provider_name !== element.provider_name);
  return array;
}

function getContentProvided(provider, array) {
  for (var element of array) {
    if (element.provider_name === provider.provider_name) {
      return element.availableContent;
    }
  }
}

function addContentToProvider(content, provider, providers) {
  //Get the content of the old entry to combine w/ new details when replaced
  var previousContent = getContentProvided(provider, providers);
  var newContent = [...previousContent, content];
  providers = removeElement(provider, providers);
  return [
    ...providers,
    {
      provider_name: provider.provider_name,
      display_priority: provider.display_priority,
      logo_path: provider.logo_path,
      availableContent: newContent,
    },
  ];
}
/*
IDENTIFY WHICH STREAMING SERVICES PROVIDE WHAT CONTENT
*/
function findProviders(selectedContent) {
  var providers = [];
  var unstreamableContent = [];
  //Go thruogh every piece of content
  for (var content of selectedContent) {
    //Go through each provider for a piece of content + catch err where no flatrate
    if (content.streamingOptions !== undefined) {
      for (var streamingService of content.streamingOptions) {
        var repeatProvider = false;
        //Go through all already identified providers
        for (var provider of providers) {
          if (provider.provider_name === streamingService.provider_name) {
            repeatProvider = true;
            //CALL FUNCTION TO ADD CONTENT TO LIST OF PROVIDED CONTENT FOR THAT PROVIDER
            providers = addContentToProvider(content, provider, providers);
          }
        }
        if (!repeatProvider) {
          //ADD PROVIDER TO LIST OF PROVIDERS
          const serviceWithContent = {
            ...streamingService,
            availableContent: [content],
          };
          providers.push(serviceWithContent);
        }
      }
    } else {
      //NEEDS REPLACING WITH A REDUCER? content is "object Object" here for some reason
      unstreamableContent.push(content);
    }
  }
  return [providers, unstreamableContent];
}

function isSubset(parentArray, childArray) {
  return childArray.every((element) => parentArray.includes(element));
}

/*
Identify Subsets within an providers
*/
function findSubsets(providers) {
  var subsets = [];
  for (var provider of providers) {
    for (var provider2 of providers) {
      // 3rd parameter will cause problems if both are identical sets, tho tbf in that instance it makes sense to keep both anyway
      // If provider != self
      // & is a subset
      // & is not already in subsets
      // & (is not a superset (ie not identical content)
      // OR has lower display priority)
      if (
        provider !== provider2 &&
        isSubset(provider.availableContent, provider2.availableContent) &&
        !subsets.includes(provider2) &&
        (!isSubset(provider2.availableContent, provider.availableContent) ||
          provider.display_priority < provider2.display_priority)
      ) {
        subsets.push(provider2);
      }
    }
  }
  return subsets;
}

function removeSubsets(providers) {
  var subsets = findSubsets(providers);
  // Remove identified subsets from providers
  for (var provider of subsets) {
    providers = providers.filter(
      (item) => item.provider_name !== provider.provider_name
    );
  }
  return providers;
}

function greedySolve(providers, selectedContent, unstreamableContent) {
  var solution = [];
  const allAvailableContent = selectedContent.filter(
    (item) => !unstreamableContent.includes(item)
  );
  var foundItems = [];
  while (foundItems.length < allAvailableContent.length) {
    //Identify all Subsets of providers (inc. lower priority providers of === sets)
    providers = removeSubsets(providers);
    //Sort providers by length - break ties with priority
    providers.sort(
      (a, b) => b.availableContent.length - a.availableContent.length
      // || a.display_priority - b.display_priority
    );
    //Take the top item of Providers & add to solution
    solution.push(providers[0]);
    //This is adding duplicate content, which means the filtering isnt working properly, so while loop is stopping short
    foundItems.push(...providers[0].availableContent);
    providers.splice(0, 1);
    for (var provider of providers) {
      provider.availableContent = provider.availableContent.filter(
        (item) => !foundItems.includes(item)
      );
    }
  }
  return solution;
}

export default function SetCoverSolution({ selectedContent, photosUrl }) {
  const [finalProviders, setFinalProviders] = useState([]);
  useEffect(() => {
    //Identfy all Providers & content they offer
    let [providers, unstreamableContent] = findProviders(selectedContent);
    console.log("Unstreamable =", unstreamableContent);
    //Implement Greedy Solution to Problem
    var solution = greedySolve(providers, selectedContent, unstreamableContent);

    setFinalProviders(solution);
  }, []);

  return (
    <>
      <Container
        style={{
          width: "80vw",
          gap: "1rem",
        }}
      >
        <Accordion alwaysOpen data-bs-theme="dark">
          {finalProviders.map((provider, index) => (
            <Accordion.Item key={index} eventKey={index}>
              <Accordion.Header>{provider.provider_name}</Accordion.Header>
              <Accordion.Body
                key={`${index}`}
                style={{
                  gap: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  overflowX: "auto",
                }}
              >
                {provider.availableContent.map((item, index2) => (
                  <div>
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
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  );
}
