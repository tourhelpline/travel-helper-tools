
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Printer, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Sample packing items categorized by climate
const PACKING_ITEMS = {
  Clothing: {
    Tropical: [
      "T-shirts", "Shorts", "Sandals", "Light dresses/skirts", "Swimwear", "Sun hat", "Light rain jacket"
    ],
    Desert: [
      "Light long-sleeve shirts", "Lightweight pants", "Sun hat", "Bandana/scarf", "Sunglasses", "Closed shoes"
    ],
    Mediterranean: [
      "T-shirts", "Shorts", "Light sweater", "Light jacket", "Comfortable walking shoes", "Swimwear"
    ],
    "Humid Continental": [
      "Mix of short and long-sleeve shirts", "Pants", "Light jacket", "Comfortable walking shoes"
    ],
    Subarctic: [
      "Thermal base layers", "Sweaters", "Heavy jacket", "Gloves", "Winter hat", "Scarf", "Insulated boots"
    ],
    Temperate: [
      "Mix of T-shirts and long sleeves", "Jeans/pants", "Light jacket or sweater", "Comfortable shoes"
    ],
    Oceanic: [
      "Layers (T-shirts, long sleeves)", "Light sweater", "Waterproof jacket", "Jeans/pants", "Walking shoes"
    ],
    Alpine: [
      "Thermal base layers", "Sweaters", "Down jacket", "Hiking boots", "Gloves", "Hat"
    ]
  },
  Toiletries: [
    "Toothbrush & toothpaste", "Deodorant", "Shampoo & conditioner", "Soap/body wash", "Razor", "Sunscreen", 
    "Moisturizer", "Lip balm"
  ],
  "Health & Safety": [
    "Prescription medications", "Basic first aid kit", "Pain relievers", "Hand sanitizer", "Insect repellent", 
    "Travel insurance info"
  ],
  Technology: [
    "Phone & charger", "Camera", "Power adapter", "Portable power bank", "Headphones"
  ],
  Miscellaneous: [
    "Passport/ID", "Travel documents", "Local currency", "Credit/debit cards", "Sunglasses", "Travel pillow",
    "Water bottle", "Day bag/backpack", "Books/e-reader"
  ]
};

// Determining approximate climate by region and Google Maps API for weather data
const getDefaultClimate = (destination: string): string => {
  const destination_lower = destination.toLowerCase();
  
  if (/\b(thailand|bali|singapore|malaysia|philippines|indonesia|hawaii|jamaica|caribbean)\b/.test(destination_lower)) {
    return "Tropical";
  } else if (/\b(egypt|dubai|sahara|arizona|nevada|qatar|saudi|uae)\b/.test(destination_lower)) {
    return "Desert";
  } else if (/\b(italy|greece|spain|france|portugal|croatia|turkey)\b/.test(destination_lower)) {
    return "Mediterranean";
  } else if (/\b(new york|chicago|toronto|boston|detroit|beijing|seoul)\b/.test(destination_lower)) {
    return "Humid Continental";
  } else if (/\b(alaska|siberia|greenland|iceland|finland|norway|sweden)\b/.test(destination_lower)) {
    return "Subarctic";
  } else if (/\b(london|paris|amsterdam|berlin|brussels|uk|england|ireland)\b/.test(destination_lower)) {
    return "Oceanic";
  } else if (/\b(alps|swiss|dolomites|andes|colorado|himalayas|rockies)\b/.test(destination_lower)) {
    return "Alpine";
  } else {
    return "Temperate"; // Default
  }
};

export const PackingListGenerator = () => {
  const [destination, setDestination] = useState<string>("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(7);
  const [climate, setClimate] = useState<string>("Temperate");
  const [packingList, setPackingList] = useState<{category: string, items: {name: string, packed: boolean}[]}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Generate the packing list based on inputs
  const generatePackingList = () => {
    if (!destination || duration <= 0) return;
    
    setIsGenerating(true);
    
    // Fetch weather data using Google Maps API
    fetchWeatherData(destination)
      .then(weatherData => {
        setTimeout(() => {
          const detectedClimate = getDefaultClimate(destination);
          if (climate !== detectedClimate) setClimate(detectedClimate);
          
          const list: {category: string, items: {name: string, packed: boolean}[]}[] = [];
          
          // Add clothing based on climate
          const clothingItems = PACKING_ITEMS.Clothing[climate as keyof typeof PACKING_ITEMS.Clothing] || PACKING_ITEMS.Clothing.Temperate;
          list.push({
            category: "Clothing",
            items: clothingItems.map(item => ({ name: item, packed: false }))
          });
          
          // Calculate clothing quantities based on trip duration
          if (duration > 7) {
            list[0].items.push({ name: "Extra clothing for longer trip", packed: false });
          }
          
          // Add other categories
          Object.entries(PACKING_ITEMS)
            .filter(([category]) => category !== "Clothing")
            .forEach(([category, items]) => {
              list.push({
                category,
                items: (items as string[]).map(item => ({ name: item, packed: false }))
              });
            });
          
          // Add travel-specific items
          if (/\b(beach|island|tropical|bali|hawaii|caribbean)\b/.test(destination.toLowerCase())) {
            list.push({
              category: "Beach Essentials",
              items: [
                { name: "Beach towel", packed: false },
                { name: "Snorkeling gear", packed: false },
                { name: "Beach bag", packed: false }
              ]
            });
          }
          
          if (/\b(hiking|mountain|alps|andes|rockies|trail)\b/.test(destination.toLowerCase())) {
            list.push({
              category: "Hiking Gear",
              items: [
                { name: "Hiking boots", packed: false },
                { name: "Trekking poles", packed: false },
                { name: "Day pack", packed: false },
                { name: "Water bottle", packed: false }
              ]
            });
          }
          
          setPackingList(list);
          setIsGenerating(false);
          
          toast({
            title: "Packing list generated!",
            description: `Based on your trip to ${destination} for ${duration} days with a ${climate} climate.`,
          });
        }, 1000);
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        setIsGenerating(false);
        toast({
          variant: "destructive",
          title: "Failed to generate packing list",
          description: "Weather data could not be retrieved. Using default settings instead.",
        });
      });
  };
  
  // Fetch location suggestions from Google Maps API
  const fetchLocationSuggestions = (query: string) => {
    if (query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }
    
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: query,
        types: ['(cities)']
      },
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          console.error("Error fetching place predictions:", status);
          setDestinationSuggestions([]);
          return;
        }
        
        setDestinationSuggestions(predictions.map(p => p.description));
        setShowSuggestions(true);
      }
    );
  };
  
  // Fetch weather data using Google Maps API
  const fetchWeatherData = async (location: string): Promise<any> => {
    // In a real app, we would use the Google Maps Geocoding API to get coordinates
    // and then fetch weather data from a weather API like OpenWeatherMap
    // For now, we'll just return a mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: 25,
          conditions: "Sunny",
          humidity: 60
        });
      }, 500);
    });
  };
  
  // Toggle packed status
  const togglePacked = (categoryIndex: number, itemIndex: number) => {
    const updatedList = [...packingList];
    updatedList[categoryIndex].items[itemIndex].packed = !updatedList[categoryIndex].items[itemIndex].packed;
    setPackingList(updatedList);
  };
  
  // Calculate packing progress
  const getProgressPercentage = () => {
    const totalItems = packingList.reduce((sum, category) => sum + category.items.length, 0);
    const packedItems = packingList.reduce((sum, category) => 
      sum + category.items.filter(item => item.packed).length, 0);
    
    return totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  };
  
  // Print packing list
  const printPackingList = () => {
    window.print();
    toast({
      title: "Print dialog opened",
      description: "Your packing list is ready to print!",
    });
  };
  
  // Save packing list
  const savePackingList = () => {
    const listJSON = JSON.stringify(packingList);
    localStorage.setItem(`packingList-${destination}-${duration}`, listJSON);
    toast({
      title: "Packing list saved",
      description: "Your packing list has been saved locally.",
    });
  };
  
  // Handle destination change
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    fetchLocationSuggestions(value);
  };
  
  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setDestination(suggestion);
    setShowSuggestions(false);
    
    // Update climate based on selected location
    const detectedClimate = getDefaultClimate(suggestion);
    setClimate(detectedClimate);
  };
  
  useEffect(() => {
    // Load Google Maps API script
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDstR0CAhqB8EDENlx4KZ-fGoyg1g0DYzQ&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
    }
    
    // Close suggestions when clicking outside
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Packing List Generator</CardTitle>
        <CardDescription>
          Create a customized packing list for your trip based on destination and climate
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
              <div className="relative">
                <Input
                  id="destination"
                  placeholder="Enter destination (e.g., Paris, Thailand)"
                  value={destination}
                  onChange={handleDestinationChange}
                  className="w-full pr-10"
                  onClick={(e) => e.stopPropagation()}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {showSuggestions && destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-1">Trip Duration (days)</label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="climate" className="block text-sm font-medium mb-1">Climate</label>
              <Select
                value={climate}
                onValueChange={setClimate}
              >
                <SelectTrigger id="climate" className="w-full">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tropical">Tropical (hot & humid)</SelectItem>
                  <SelectItem value="Desert">Desert (hot & dry)</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean (warm, mild)</SelectItem>
                  <SelectItem value="Humid Continental">Humid Continental (4 seasons)</SelectItem>
                  <SelectItem value="Subarctic">Subarctic (very cold)</SelectItem>
                  <SelectItem value="Temperate">Temperate (mild)</SelectItem>
                  <SelectItem value="Oceanic">Oceanic (mild, rainy)</SelectItem>
                  <SelectItem value="Alpine">Alpine (mountain climate)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generatePackingList} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isGenerating || !destination || duration <= 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Packing List
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 max-h-[70vh] overflow-y-auto">
            {packingList.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Your Packing List</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {destination} ({climate} climate) · {duration} days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={printPackingList} size="sm">
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                    <Button variant="outline" onClick={savePackingList} size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">{getProgressPercentage()}% packed</p>
                
                {packingList.map((category, catIndex) => (
                  <div key={`cat-${catIndex}`} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{category.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.items.map((item, itemIndex) => (
                        <div 
                          key={`item-${catIndex}-${itemIndex}`} 
                          className="flex items-center space-x-2"
                        >
                          <Checkbox 
                            checked={item.packed} 
                            onCheckedChange={() => togglePacked(catIndex, itemIndex)}
                            id={`item-${catIndex}-${itemIndex}`}
                          />
                          <label
                            htmlFor={`item-${catIndex}-${itemIndex}`}
                            className={`text-sm ${item.packed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your trip details and click "Generate Packing List" to create a customized packing list.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
