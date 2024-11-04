import { useEffect, useReducer, useState } from "react";

/*Providers Contains: 
provider_name: 
display_priority: 
logo_path: 
availableContent: []
*/

function removeElement(element, array) {
  array = array.filter((item) => item.provider_name != element.provider_name);
  return array;
}

function getContentProvided(provider, array) {
  for (var element of array) {
    if (element.provider_name === provider.provider_name) {
      return element.availableContent;
    }
  }
}

function providersReducer(providers, action) {
  switch (action.type) {
    case "addProvider":
      return [
        ...providers,
        {
          provider_name: action.provider_name,
          display_priority: action.display_priority,
          logo_path: action.logo_path,
          availableContent: [action.availableContent],
        },
      ];
    case "addContentToProvider":
      //Get the content of the old entry to combine w/ new details when replaced
      var previousContent = getContentProvided(action.provider, providers);
      var content = [...previousContent, action.newContent];
      providers = removeElement(action.provider, providers);
      return [
        ...providers,
        {
          provider_name: action.provider.provider_name,
          display_priority: action.provider.display_priority,
          logo_path: action.provider.logo_path,
          availableContent: content,
        },
      ];
  }
}

//function unstreamableContentReducer(unstreamableContent)

export default function SetCoverSolution(selectedContent) {
  const [providers, dispatchProviders] = useReducer(providersReducer, []);
  //const [unstreamableContent, dispatchUnstreamableContent] = useReducer(unstreamableContentReducer,[]);
  const [unstreamableContent, setUnstreamableContent] = useState([]);

  function addProvider(content, provider) {
    dispatchProviders({
      type: "addProvider",
      provider_name: provider.provider_name,
      display_priority: provider.display_priority,
      logo_path: provider.logo_path,
      availableContent: content,
    });
  }

  function addContentToProvider(content, provider) {
    dispatchProviders({
      type: "addContentToProvider",
      provider: provider,
      newContent: content,
    });
  }

  //IDENTIFY WHICH STREAMING SERVICES PROVIDE WHAT CONTENT
  useEffect(() => {
    var loggedStreamingServices = [];
    //Go thruogh every piece of content
    for (var content of selectedContent.selectedContent) {
      //Go through each provider for a piece of content
      /* NEED TO ADD AN ERROR CATCH FOR IF CONTENT HAS NO STREAMING OPTIONS
         THIS SHOULD BE DONE IN SELECTING CONTENT, IF NO STREAMING OPTIONS -> UNAVAILABLE, RATHER THAN SELECTED
         AVOIDS THIS ERR COMPLETELY
         CREATE A NEW ARRAY OF SELECTABLE SHOWS WHERE THEY ARE SHOWN AS UNAVAILABLE
     */
      console.log(content);
      if (content.streamingOptions !== undefined) {
        for (var streamingService of content.streamingOptions) {
          var repeatProvider = false;
          //Go through all already identified providers
          for (var provider of loggedStreamingServices) {
            if (provider.provider_name === streamingService.provider_name) {
              repeatProvider = true;
              //CALL FUNCTION TO ADD CONTENT TO LIST OF PROVIDED CONTENT FOR THAT PROVIDER
              addContentToProvider(content, provider);
            }
          }
          if (!repeatProvider) {
            //ADD PROVIDER TO LIST OF PROVIDERS
            addProvider(content, streamingService);
            loggedStreamingServices.push(streamingService);
          }
        }
      } else {
        //NEEDS REPLACING WITH A REDUCER? content is "object Object" here for some reason
        setUnstreamableContent([...unstreamableContent, content]);
      }
    }
  }, []);
  console.log(providers);
  console.log("Unstreamable:", unstreamableContent);

  //Identify Subsets
  //LOOK @ THE BASIC SET OPERATOR TOOLS & SEE IF THEY'RE MORE EFFICIENT FOR THIS
  function isSubset(parentArray, childArray) {
    return childArray.every((element) => parentArray.includes(element));
  }
  //REMOVE ALL SUBSETS
  var subsets = [];
  for (var provider of providers) {
    for (var provider2 of providers) {
      // 3rd parameter will cause problems if both are identical sets, tho tbf in that instance it makes sense to keep both anyway
      if (
        provider != provider2 &&
        isSubset(provider.availableContent, provider2.availableContent) &&
        !isSubset(provider2.availableContent, provider.availableContent)
      ) {
        console.log(
          `Wow, ${provider2.provider_name} is a subset of ${provider.provider_name}!`
        );
        subsets.push(provider2);
      }
    }
  }
  subsets = new Set(subsets);
  console.log("All identified subsets:", subsets);

  return <>HI :)</>;
}
