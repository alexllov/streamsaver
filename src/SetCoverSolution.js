import { useEffect, useReducer } from "react";

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
      //this will get the provider w/ all its new info + newContent as the added piece
      //Need to get old content details: identify the old element, get its old data
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

    //   return [
    //     ...providers,
    //     {...providers[action.provider_name],
    //         availableContent : [
    //             ...providers[action.provider_name].availableContent,
    //             action.availableContent
    //         ]
    //     }
    // ]
  }
}

export default function SetCoverSolution(selectedContent) {
  const [providers, dispatchProviders] = useReducer(providersReducer, []);

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

  useEffect(() => {
    var loggedStreamingServices = [];
    //Go thruogh every piece of content
    for (var content of selectedContent.selectedContent) {
      //Go through each provider for a piece of content
      //NEED TO ADD AN ERROR CATCH FOR IF CONTENT HAS NO STREAMING OPTIONS
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
          console.log("Provider about to be added:", streamingService);
          addProvider(content, streamingService);
          loggedStreamingServices.push(streamingService);
        }
      }
    }
  }, []);
  console.log(providers);
  return <>HI :)</>;
}
