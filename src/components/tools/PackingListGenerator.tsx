
// This is a patch to fix the TypeScript error
// Only fixing the necessary part of the function that causes the error

// Assuming the original handleDestinationInput function looks like this:
const handleDestinationInput = (value: string) => {
  setDestination(value);
  
  if (value.length < 3) {
    setShowSuggestions(false);
    return;
  }
  
  if (!autocompleteService.current) {
    console.error("Google Places Autocomplete service not loaded");
    return;
  }
  
  autocompleteService.current.getPlacePredictions(
    { input: value, types: ['(cities)'] },
    (predictions: google.maps.places.AutocompletePrediction[] | null) => {
      if (!predictions) {
        console.log("No predictions found");
        return;
      }
      
      // Fix: Make sure predictions is an array before mapping
      const suggestions = Array.isArray(predictions) 
        ? predictions.map(p => p.description) 
        : [];
      
      setDestinationSuggestions(suggestions);
      setShowSuggestions(true);
    }
  );
};
