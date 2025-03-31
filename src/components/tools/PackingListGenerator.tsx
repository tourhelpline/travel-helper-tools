import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Clipboard, Copy, MapPin, Cloud, Thermometer } from 'lucide-react';
import { getPackingListSuggestions } from '@/lib/api';
import { fetchWeatherForLocation, WeatherData } from '@/lib/weatherUtils';
import { useToast } from '@/hooks/use-toast';

export const PackingListGenerator = () => {
  const { toast } = useToast();
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('7');
  const [climate, setClimate] = useState('moderate');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [travelerType, setTravelerType] = useState('solo-male');
  const [packingList, setPackingList] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // For Google Places Autocomplete
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  
  // Initialize Google Places Autocomplete service
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);
  
  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle destination input and get suggestions
  const handleDestinationInput = (value: string) => {
    setDestination(value);
    setWeatherData(null); // Reset weather data when destination changes
    
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
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = async (suggestion: string) => {
    setDestination(suggestion);
    setShowSuggestions(false);
    
    // Fetch weather data for the selected destination
    await fetchWeatherData(suggestion);
  };
  
  // Fetch weather data for a location
  const fetchWeatherData = async (location: string) => {
    setLoadingWeather(true);
    
    try {
      const data = await fetchWeatherForLocation(location);
      
      if (data) {
        setWeatherData(data);
        setClimate(data.climate); // Set the climate automatically based on weather data
        
        toast({
          title: "Weather data retrieved",
          description: `Current conditions: ${data.temperature}°C, ${data.condition}`,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoadingWeather(false);
    }
  };
  
  // Generate packing list
  const generatePackingList = async () => {
    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please enter your destination",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // If we don't have weather data yet, try to fetch it
    if (!weatherData) {
      await fetchWeatherData(destination);
    }
    
    // This would normally hit the OpenAI API, but for demo purposes we'll mock the response
    const mockResponse = getMockPackingList(
      destination, 
      parseInt(duration), 
      weatherData ? weatherData.climate : climate, 
      travelerType
    );
    
    // Simulate network delay
    setTimeout(() => {
      setPackingList(mockResponse);
      setLoading(false);
    }, 1500);
  };
  
  // Copy packing list to clipboard
  const copyToClipboard = () => {
    if (!packingList) return;
    
    let clipboardText = `Packing List for ${destination} (${duration} days, ${climate} climate)\n\n`;
    
    packingList.categories.forEach((category: any) => {
      clipboardText += `${category.name.toUpperCase()}:\n`;
      category.items.forEach((item: string) => {
        clipboardText += `- ${item}\n`;
      });
      clipboardText += '\n';
    });
    
    clipboardText += 'SPECIAL ITEMS:\n';
    packingList.specialItems.forEach((item: string) => {
      clipboardText += `- ${item}\n`;
    });
    
    clipboardText += '\nTIPS FOR THIS DESTINATION:\n';
    packingList.destinationTips.forEach((tip: string) => {
      clipboardText += `- ${tip}\n`;
    });
    
    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Packing list copied to clipboard",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative" ref={autocompleteRef}>
            <Label htmlFor="destination" className="text-sm font-medium mb-2 block">Destination</Label>
            <div className="relative">
              <Input
                id="destination"
                placeholder="e.g. Paris, France"
                value={destination}
                onChange={(e) => handleDestinationInput(e.target.value)}
                className="pl-9"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            {showSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-gray-700">
                {destinationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Weather data display */}
          {weatherData && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md flex items-center space-x-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                <Thermometer className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {weatherData.temperature}°C, {weatherData.condition}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Climate: <span className="capitalize">{weatherData.climate}</span>
                </p>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="duration" className="text-sm font-medium mb-2 block">Trip Duration (Days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="climate" className="text-sm font-medium mb-2 block">
              Climate {weatherData && "(Auto-detected from weather data)"}
            </Label>
            <Select 
              value={climate} 
              onValueChange={setClimate}
              disabled={!!weatherData} // Disable manual selection if we have weather data
            >
              <SelectTrigger>
                <SelectValue placeholder="Select climate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">Cold (Below 50°F/10°C)</SelectItem>
                <SelectItem value="moderate">Moderate (50-70°F/10-21°C)</SelectItem>
                <SelectItem value="warm">Warm (70-85°F/21-29°C)</SelectItem>
                <SelectItem value="hot">Hot (Above 85°F/29°C)</SelectItem>
                <SelectItem value="tropical">Tropical (Hot & Humid)</SelectItem>
                <SelectItem value="variable">Variable/Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="travelerType" className="text-sm font-medium mb-2 block">Traveler Type</Label>
            <Select value={travelerType} onValueChange={setTravelerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select traveler type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo-male">Solo (Male)</SelectItem>
                <SelectItem value="solo-female">Solo (Female)</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="family">Family with Children</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generatePackingList} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {loading ? "Generating..." : "Generate Packing List"}
          </Button>
        </div>
        
        <div>
          {packingList ? (
            <Card className="h-full overflow-auto">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  Packing List for {destination}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-4">
                  {packingList.categories.map((category: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-2">{category.name}</h3>
                      <ul className="space-y-1">
                        {category.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="flex items-start">
                            <span className="inline-block w-4 h-4 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {index < packingList.categories.length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
                  
                  {packingList.specialItems.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div>
                        <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-2">Special Items</h3>
                        <ul className="space-y-1">
                          {packingList.specialItems.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-4 h-4 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  <Separator className="my-3" />
                  <div>
                    <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-2">Tips for {destination}</h3>
                    <ul className="space-y-1">
                      {packingList.destinationTips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-4 h-4 mr-2 mt-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8">
              <div className="text-center">
                <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No packing list yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Fill in the details and generate your personalized packing list
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock function to generate packing list without requiring OpenAI API
function getMockPackingList(destination: string, duration: number, climate: string, travelerType: string) {
  // Base categories every traveler needs
  const baseCategories = [
    {
      name: "Clothing Essentials",
      items: [
        "Underwear (1 per day)",
        "Socks (1 per day)",
        "T-shirts/tops (1 per 2-3 days)",
        "Pants/shorts (1 per 3-4 days)",
        "Light jacket or sweater",
        "Comfortable walking shoes",
        "Sleepwear"
      ]
    },
    {
      name: "Toiletries",
      items: [
        "Toothbrush and toothpaste",
        "Deodorant",
        "Shampoo and conditioner",
        "Body wash or soap",
        "Moisturizer",
        "Sunscreen",
        "Personal medications"
      ]
    },
    {
      name: "Electronics",
      items: [
        "Smartphone and charger",
        "Power adapter",
        "Portable power bank",
        "Headphones"
      ]
    },
    {
      name: "Travel Documents",
      items: [
        "Passport/ID",
        "Travel insurance information",
        "Hotel/accommodation details",
        "Transport tickets",
        "Credit/debit cards",
        "Cash in local currency"
      ]
    }
  ];
  
  // Add climate-specific items
  const climateItems: Record<string, string[]> = {
    cold: ["Warm coat", "Thermal underwear", "Hat and gloves", "Scarf", "Warm boots", "Thick socks"],
    moderate: ["Light sweater", "Light jacket", "Closed-toe shoes", "Mix of short and long sleeves"],
    warm: ["Shorts", "T-shirts", "Sandals", "Sunglasses", "Hat", "Lightweight clothing"],
    hot: ["Breathable clothing", "Sun hat", "Sunglasses", "Extra sunscreen", "Water bottle", "Cooling towel"],
    tropical: ["Insect repellent", "Breathable clothing", "Rain jacket", "Umbrella", "Quick-dry clothes", "Anti-humidity hair products"],
    variable: ["Layerable clothing", "Versatile jacket", "Convertible pants", "Both warm and cool options", "Rain protection"]
  };
  
  // Add traveler type specific items
  const travelerTypeItems: Record<string, string[]> = {
    "solo-male": ["Men's toiletries", "Razor and shaving cream"],
    "solo-female": ["Feminine hygiene products", "Makeup essentials (if used)", "Hair accessories"],
    "couple": ["Shared chargers", "Shared toiletries", "Relationship essentials"],
    "family": ["Kid-friendly entertainment", "Snacks", "Extra changes of clothes for children", "Diapers/baby supplies (if needed)", "First-aid kit"],
    "business": ["Business attire", "Portable laptop", "Business cards", "Notebook and pens", "Presentation materials"]
  };
  
  // Add destination-specific tips based on the city name
  let destinationTips: string[] = [];
  let specialItems: string[] = [];
  
  // Add some destination specific recommendations
  if (destination.toLowerCase().includes("beach") || 
      destination.toLowerCase().includes("miami") || 
      destination.toLowerCase().includes("hawaii") || 
      destination.toLowerCase().includes("cancun")) {
    specialItems.push("Swimwear", "Beach towel", "Flip-flops");
    destinationTips.push("Bring a reusable water bottle to stay hydrated in the sun");
    destinationTips.push("Pack a dry bag to keep electronics safe near water");
  } else if (destination.toLowerCase().includes("paris") || 
             destination.toLowerCase().includes("rome") || 
             destination.toLowerCase().includes("london")) {
    specialItems.push("Stylish outfit for nice restaurants", "Comfortable walking shoes for cobblestone streets");
    destinationTips.push("Many European attractions require modest dress (shoulders covered)");
    destinationTips.push("Bring a small daypack for city exploration that can be worn in front for security");
  } else if (destination.toLowerCase().includes("mountain") || 
             destination.toLowerCase().includes("alps") || 
             destination.toLowerCase().includes("hiking")) {
    specialItems.push("Hiking boots", "Trekking poles", "Backpack with water storage");
    destinationTips.push("Layer clothing for changing mountain weather conditions");
    destinationTips.push("Pack light snacks for energy during hikes");
  }
  
  // Add generic tips if no specific destination matched
  if (destinationTips.length === 0) {
    destinationTips.push("Research specific cultural norms for your destination regarding dress code");
    destinationTips.push("Keep a digital copy of your important documents in your email");
    destinationTips.push("Register with your country's travel advisory service before international trips");
  }
  
  if (specialItems.length === 0) {
    specialItems.push("Reusable water bottle", "Travel pillow for long journeys", "Small first aid kit");
  }
  
  // Add duration-specific advice
  if (duration <= 3) {
    destinationTips.push("For short trips, consider packing only carry-on luggage to save time");
  } else if (duration >= 14) {
    destinationTips.push("For longer trips, consider doing laundry rather than packing for every day");
    destinationTips.push("Bring versatile clothing items that can be mixed and matched");
  }
  
  // Adjust clothing based on duration
  const clothingCategory = baseCategories.find(c => c.name === "Clothing Essentials");
  if (clothingCategory) {
    if (duration <= 3) {
      clothingCategory.items = clothingCategory.items.map(item => 
        item.includes("per day") ? item.replace(/\(1 per [^)]+\)/, "(just enough for your short trip)") : item
      );
    } else if (duration >= 14) {
      clothingCategory.items = clothingCategory.items.map(item => 
        item.includes("per day") ? item.replace(/\(1 per [^)]+\)/, "(enough for 1 week + laundry)") : item
      );
      clothingCategory.items.push("Travel-sized laundry detergent");
    }
  }
  
  // Add climate specific items to clothing
  if (clothingCategory && climateItems[climate]) {
    clothingCategory.items = [...clothingCategory.items, ...climateItems[climate]];
  }
  
  // Add traveler type specific items to appropriate categories
  const travelerItems = travelerTypeItems[travelerType] || [];
  const toiletryCategory = baseCategories.find(c => c.name === "Toiletries");
  
  if (toiletryCategory && travelerItems.length > 0) {
    toiletryCategory.items = [...toiletryCategory.items, ...travelerItems.filter(item => 
      item.toLowerCase().includes("toiletries") || 
      item.toLowerCase().includes("hygiene") || 
      item.toLowerCase().includes("razor") || 
      item.toLowerCase().includes("makeup")
    )];
  }
  
  // If there are family-specific items, create a new category
  if (travelerType === "family") {
    baseCategories.push({
      name: "Family Essentials",
      items: travelerItems
    });
  } else if (travelerType === "business") {
    baseCategories.push({
      name: "Business Essentials",
      items: travelerItems
    });
  }
  
  return {
    categories: baseCategories,
    specialItems: specialItems,
    destinationTips: destinationTips
  };
}

export default PackingListGenerator;
