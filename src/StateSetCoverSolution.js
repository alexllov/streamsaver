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
    case "removeProvider":
      //return removeElement(providers, action.provider);
      return console.log("Removing something");
  }
}

function subsetsReducer(subsets, action) {
  switch (action.type) {
    case "add":
      //ADD DUPLICATE HANDLING HERE TO REMOVE THE EXTRAS
      //Find out if already present, if so do not add again
      console.log("Reducer");
      var newSubsets;
      if (subsets.includes(action.provider)) {
        console.log(
          `Subset already identified: ${action.provider.provider_name}`
        );
        newSubsets = [...subsets];
      } else {
        newSubsets = [...subsets, action.provider];
      }
      return newSubsets;
  }
}

//function unstreamableContentReducer(unstreamableContent)

export default function SetCoverSolution(selectedContent) {
  const [providers, dispatchProviders] = useReducer(providersReducer, []);
  //const [unstreamableContent, dispatchUnstreamableContent] = useReducer(unstreamableContentReducer,[]);
  const [unstreamableContent, setUnstreamableContent] = useState([]);
  const [subsets, dispatchSubsets] = useReducer(subsetsReducer, []);

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

  function removeProvider(provider) {
    dispatchProviders({
      type: "removeProvider",
      provider: provider,
    });
  }

  function addSubset(provider) {
    dispatchSubsets({
      type: "add",
      provider: provider,
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

  //useEffect(() => {
  //Identify Subsets
  //LOOK @ THE BASIC SET OPERATOR TOOLS & SEE IF THEY'RE MORE EFFICIENT FOR THIS
  function isSubset(parentArray, childArray) {
    return childArray.every((element) => parentArray.includes(element));
  }
  //REMOVE ALL SUBSETS
  //Identify Subsets
  // Will need to track the state of subsets
  for (var provider of providers) {
    for (var provider2 of providers) {
      // 3rd parameter will cause problems if both are identical sets, tho tbf in that instance it makes sense to keep both anyway
      if (
        provider != provider2 &&
        isSubset(provider.availableContent, provider2.availableContent) &&
        !isSubset(provider2.availableContent, provider.availableContent)
      ) {
        //console.log(`Wow, ${provider2.provider_name} is a subset of ${provider.provider_name}!`);
        console.log("subset ADDED");
        addSubset(provider2);
      }
    }
  }
  //}, []);
  console.log("All identified subsets:", subsets);
  console.log("All Providers =", providers);

  // Remove identified subsets from providers
  //////////////////////////////////////////////
  //for (provider of subsets) {
  //  console.log(`Wow, im ${provider.provider_name} & im a subset`);
  //  removeProvider(provider);
  //}
  //}
  //console.log(providers);
  /////////////////////////////////////////////

  // Order providers by len of availableContent

  // Take 1st & compare len to second.
  // IF tie, compare display_priority

  // Add the winner to finalResults
  // Remove the content provided by it from all other providers

  // Return to order providers

  return <>Results will be shown here -Alice</>;
}
