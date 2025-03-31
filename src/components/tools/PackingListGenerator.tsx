
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Printer, RefreshCw, Search, Thermometer, UsersRound, User, Baby } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample packing items categorized by climate and traveler type
const PACKING_ITEMS = {
  Clothing: {
    Tropical: {
      Male: ["T-shirts", "Shorts", "Sandals", "Light rain jacket", "Swimming trunks", "Casual shirts"],
      Female: ["T-shirts", "Shorts", "Sandals", "Light dresses/skirts", "Swimwear", "Sun hat", "Light rain jacket"],
      Couple: ["T-shirts", "Shorts", "Sandals", "Light dresses/skirts", "Swimwear", "Sun hats", "Light rain jackets"],
      "Couple with Kids": ["T-shirts", "Shorts", "Sandals", "Light dresses/skirts", "Swimwear", "Sun hats", "Light rain jackets", "Kids swimwear", "Kids sandals", "Kids sun hats", "Kids casual wear"]
    },
    Desert: {
      Male: ["Light long-sleeve shirts", "Lightweight pants", "Sun hat", "Bandana/scarf", "Sunglasses", "Closed shoes"],
      Female: ["Light long-sleeve shirts", "Lightweight pants", "Sun hat", "Bandana/scarf", "Sunglasses", "Closed shoes", "Light long skirts/dresses"],
      Couple: ["Light long-sleeve shirts", "Lightweight pants", "Sun hats", "Bandanas/scarves", "Sunglasses", "Closed shoes", "Light long skirts/dresses"],
      "Couple with Kids": ["Light long-sleeve shirts", "Lightweight pants", "Sun hats", "Bandanas/scarves", "Sunglasses", "Closed shoes", "Light long skirts/dresses", "Kids sun protective clothing", "Kids closed shoes", "Kids sun hats"]
    },
    Mediterranean: {
      Male: ["T-shirts", "Shorts", "Light sweater", "Light jacket", "Comfortable walking shoes", "Swimming trunks"],
      Female: ["T-shirts", "Shorts", "Light sweater", "Light jacket", "Comfortable walking shoes", "Swimwear", "Summer dresses"],
      Couple: ["T-shirts", "Shorts", "Light sweaters", "Light jackets", "Comfortable walking shoes", "Swimwear", "Summer dresses"],
      "Couple with Kids": ["T-shirts", "Shorts", "Light sweaters", "Light jackets", "Comfortable walking shoes", "Swimwear", "Summer dresses", "Kids light sweaters", "Kids comfortable shoes", "Kids swimwear"]
    },
    "Humid Continental": {
      Male: ["Mix of short and long-sleeve shirts", "Pants", "Light jacket", "Comfortable walking shoes"],
      Female: ["Mix of short and long-sleeve shirts", "Pants", "Skirts", "Light jacket", "Comfortable walking shoes"],
      Couple: ["Mix of short and long-sleeve shirts", "Pants", "Skirts", "Light jackets", "Comfortable walking shoes"],
      "Couple with Kids": ["Mix of short and long-sleeve shirts", "Pants", "Skirts", "Light jackets", "Comfortable walking shoes", "Kids pants", "Kids tops", "Kids light jackets"]
    },
    Subarctic: {
      Male: ["Thermal base layers", "Sweaters", "Heavy jacket", "Gloves", "Winter hat", "Scarf", "Insulated boots"],
      Female: ["Thermal base layers", "Sweaters", "Heavy jacket", "Gloves", "Winter hat", "Scarf", "Insulated boots"],
      Couple: ["Thermal base layers", "Sweaters", "Heavy jackets", "Gloves", "Winter hats", "Scarves", "Insulated boots"],
      "Couple with Kids": ["Thermal base layers", "Sweaters", "Heavy jackets", "Gloves", "Winter hats", "Scarves", "Insulated boots", "Kids thermal layers", "Kids winter coats", "Kids gloves/mittens", "Kids winter boots"]
    },
    Temperate: {
      Male: ["Mix of T-shirts and long sleeves", "Jeans/pants", "Light jacket or sweater", "Comfortable shoes"],
      Female: ["Mix of T-shirts and long sleeves", "Jeans/pants", "Light jacket or sweater", "Comfortable shoes", "Versatile dress/skirt"],
      Couple: ["Mix of T-shirts and long sleeves", "Jeans/pants", "Light jackets or sweaters", "Comfortable shoes", "Versatile dresses/skirts"],
      "Couple with Kids": ["Mix of T-shirts and long sleeves", "Jeans/pants", "Light jackets or sweaters", "Comfortable shoes", "Versatile dresses/skirts", "Kids jeans/pants", "Kids t-shirts", "Kids light jackets"]
    },
    Oceanic: {
      Male: ["Layers (T-shirts, long sleeves)", "Light sweater", "Waterproof jacket", "Jeans/pants", "Walking shoes"],
      Female: ["Layers (T-shirts, long sleeves)", "Light sweater", "Waterproof jacket", "Jeans/pants", "Walking shoes"],
      Couple: ["Layers (T-shirts, long sleeves)", "Light sweaters", "Waterproof jackets", "Jeans/pants", "Walking shoes"],
      "Couple with Kids": ["Layers (T-shirts, long sleeves)", "Light sweaters", "Waterproof jackets", "Jeans/pants", "Walking shoes", "Kids waterproof jackets", "Kids layers", "Kids comfortable shoes"]
    },
    Alpine: {
      Male: ["Thermal base layers", "Sweaters", "Down jacket", "Hiking boots", "Gloves", "Hat"],
      Female: ["Thermal base layers", "Sweaters", "Down jacket", "Hiking boots", "Gloves", "Hat"],
      Couple: ["Thermal base layers", "Sweaters", "Down jackets", "Hiking boots", "Gloves", "Hats"],
      "Couple with Kids": ["Thermal base layers", "Sweaters", "Down jackets", "Hiking boots", "Gloves", "Hats", "Kids thermal layers", "Kids warm jackets", "Kids hiking shoes", "Kids warm accessories"]
    }
  },
  Toiletries: {
    Male: ["Toothbrush & toothpaste", "Deodorant", "Shampoo & conditioner", "Soap/body wash", "Razor", "Sunscreen", "Moisturizer", "Lip balm", "Aftershave/cologne"],
    Female: ["Toothbrush & toothpaste", "Deodorant", "Shampoo & conditioner", "Soap/body wash", "Razor", "Sunscreen", "Moisturizer", "Lip balm", "Makeup", "Makeup remover", "Hair accessories", "Feminine hygiene products"],
    Couple: ["Toothbrushes & toothpaste", "Deodorants", "Shampoo & conditioner", "Soap/body wash", "Razors", "Sunscreen", "Moisturizer", "Lip balm", "Makeup", "Makeup remover", "Hair accessories", "Feminine hygiene products", "Aftershave/cologne"],
    "Couple with Kids": ["Toothbrushes & toothpaste", "Deodorants", "Shampoo & conditioner", "Soap/body wash", "Razors", "Sunscreen", "Moisturizer", "Lip balm", "Makeup", "Makeup remover", "Hair accessories", "Feminine hygiene products", "Aftershave/cologne", "Baby wipes", "Diaper rash cream", "Kids toothbrushes", "Kids sunscreen", "Kids shampoo"]
  },
  "Health & Safety": {
    Male: ["Prescription medications", "Basic first aid kit", "Pain relievers", "Hand sanitizer", "Insect repellent", "Travel insurance info"],
    Female: ["Prescription medications", "Basic first aid kit", "Pain relievers", "Hand sanitizer", "Insect repellent", "Travel insurance info"],
    Couple: ["Prescription medications", "Basic first aid kit", "Pain relievers", "Hand sanitizer", "Insect repellent", "Travel insurance info"],
    "Couple with Kids": ["Prescription medications", "Basic first aid kit", "Pain relievers", "Hand sanitizer", "Insect repellent", "Travel insurance info", "Children's pain relief medication", "Band-aids with cartoon characters", "Thermometer", "Antihistamine", "Motion sickness medication"]
  },
  Technology: {
    Male: ["Phone & charger", "Camera", "Power adapter", "Portable power bank", "Headphones"],
    Female: ["Phone & charger", "Camera", "Power adapter", "Portable power bank", "Headphones"],
    Couple: ["Phones & chargers", "Camera", "Power adapter", "Portable power bank", "Headphones", "Selfie stick"],
    "Couple with Kids": ["Phones & chargers", "Camera", "Power adapter", "Portable power bank", "Headphones", "Selfie stick", "Tablet/iPad for kids", "Kids headphones", "Portable night light", "White noise machine"]
  },
  Miscellaneous: {
    Male: ["Passport/ID", "Travel documents", "Local currency", "Credit/debit cards", "Sunglasses", "Travel pillow", "Water bottle", "Day bag/backpack", "Books/e-reader"],
    Female: ["Passport/ID", "Travel documents", "Local currency", "Credit/debit cards", "Sunglasses", "Travel pillow", "Water bottle", "Day bag/backpack", "Books/e-reader", "Scarf/wrap", "Small purse"],
    Couple: ["Passports/IDs", "Travel documents", "Local currency", "Credit/debit cards", "Sunglasses", "Travel pillows", "Water bottles", "Day bags/backpacks", "Books/e-readers", "Scarf/wrap", "Small purse"],
    "Couple with Kids": ["Passports/IDs", "Travel documents", "Local currency", "Credit/debit cards", "Sunglasses", "Travel pillows", "Water bottles", "Day bags/backpacks", "Books/e-readers", "Scarf/wrap", "Small purse", "Kids backpacks", "Comfort items/toys", "Snacks", "Activity books", "Kids water bottles"]
  }
};

// Determining approximate climate by temperature
const getClimateByTemperature = (tempCelsius: number): string => {
  if (tempCelsius > 30) return "Tropical";
  if (tempCelsius > 25) return "Desert";
  if (tempCelsius > 20) return "Mediterranean";
  if (tempCelsius > 15) return "Temperate";
  if (tempCelsius > 5) return "Humid Continental";
  if (tempCelsius > 0) return "Oceanic";
  if (tempCelsius > -10) return "Subarctic";
  return "Subarctic";
};

// Fallback function to determine climate by location name
const getClimateByLocation = (destination: string): string => {
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

type TravelerType = "Male" | "Female" | "Couple" | "Couple with Kids";

export const PackingListGenerator = () => {
  const [destination, setDestination] = useState<string>("");
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(7);
  const [climate, setClimate] = useState<string>("Temperate");
  const [currentTemperature, setCurrentTemperature] = useState<number | null>(null);
  const [packingList, setPackingList] = useState<{category: string, items: {name: string, packed: boolean}[]}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [travelerType, setTravelerType] = useState<TravelerType>("Male");
  const { toast } = useToast();
  
  // Generate the packing list based on inputs
  const generatePackingList = () => {
    if (!destination || duration <= 0) return;
    
    setIsGenerating(true);
    
    // Fetch weather data for the destination
    fetchWeatherData(destination)
      .then(weatherData => {
        setTimeout(() => {
          // Set climate based on temperature if available, otherwise fallback to location
          const detectedClimate = currentTemperature 
            ? getClimateByTemperature(currentTemperature) 
            : getClimateByLocation(destination);
            
          setClimate(detectedClimate);
          
          const list: {category: string, items: {name: string, packed: boolean}[]}[] = [];
          
          // Add clothing based on climate and traveler type
          const clothingItems = PACKING_ITEMS.Clothing[detectedClimate as keyof typeof PACKING_ITEMS.Clothing][travelerType] || 
                               PACKING_ITEMS.Clothing.Temperate[travelerType];
                               
          list.push({
            category: "Clothing",
            items: clothingItems.map(item => ({ name: item, packed: false }))
          });
          
          // Calculate clothing quantities based on trip duration
          if (duration > 7) {
            list[0].items.push({ name: "Extra clothing for longer trip", packed: false });
          }
          
          // Add other categories based on traveler type
          Object.entries(PACKING_ITEMS)
            .filter(([category]) => category !== "Clothing")
            .forEach(([category, items]) => {
              const travelerItems = items[travelerType as keyof typeof items] || [];
              list.push({
                category,
                items: travelerItems.map(item => ({ name: item, packed: false }))
              });
            });
          
          // Add travel-specific items
          if (/\b(beach|island|tropical|bali|hawaii|caribbean)\b/.test(destination.toLowerCase())) {
            const beachItems = [
              { name: "Beach towel", packed: false },
              { name: "Snorkeling gear", packed: false },
              { name: "Beach bag", packed: false }
            ];
            
            if (travelerType === "Couple with Kids") {
              beachItems.push(
                { name: "Beach toys for kids", packed: false },
                { name: "Floaties/swim aids", packed: false }
              );
            }
            
            list.push({
              category: "Beach Essentials",
              items: beachItems
            });
          }
          
          if (/\b(hiking|mountain|alps|andes|rockies|trail)\b/.test(destination.toLowerCase())) {
            const hikingItems = [
              { name: "Hiking boots", packed: false },
              { name: "Trekking poles", packed: false },
              { name: "Day pack", packed: false },
              { name: "Water bottle", packed: false }
            ];
            
            if (travelerType === "Couple with Kids") {
              hikingItems.push(
                { name: "Child carrier/hiking backpack", packed: false },
                { name: "Kids hiking shoes", packed: false }
              );
            }
            
            list.push({
              category: "Hiking Gear",
              items: hikingItems
            });
          }
          
          setPackingList(list);
          setIsGenerating(false);
          
          toast({
            title: "Packing list generated!",
            description: `Based on your trip to ${destination} for ${duration} days with a ${detectedClimate} climate for ${travelerType}.`,
          });
        }, 800);
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
    
    if (window.google && window.google.maps && window.google.maps.places) {
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
    }
  };
  
  // Fetch weather data using Google Maps API and OpenWeatherMap
  const fetchWeatherData = async (location: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject("Google Maps API not loaded");
        return;
      }
      
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) {
          reject("Failed to geocode location");
          return;
        }
        
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        
        // For a real app, use a weather API like OpenWeatherMap here
        // For now, we'll simulate weather data
        const tempCelsius = simulateTemperature(lat, lng);
        setCurrentTemperature(tempCelsius);
        
        resolve({
          temperature: tempCelsius,
          conditions: tempCelsius > 25 ? "Sunny" : tempCelsius > 15 ? "Partly Cloudy" : "Cloudy",
          humidity: Math.floor(Math.random() * 30) + 50 // 50-80%
        });
      });
    });
  };
  
  // Simulate temperature based on latitude and time of year
  const simulateTemperature = (lat: number, lng: number): number => {
    const month = new Date().getMonth(); // 0-11
    const isNorthernHemisphere = lat > 0;
    
    // Distance from equator (0-90)
    const distanceFromEquator = Math.abs(lat);
    
    // Base temperature decreases as we move away from equator
    let baseTemp = 30 - (distanceFromEquator / 3);
    
    // Seasonal adjustment
    const isSummer = isNorthernHemisphere ? (month >= 4 && month <= 9) : (month <= 3 || month >= 10);
    const seasonalAdjustment = isSummer ? 5 : -5;
    
    // Random daily variation
    const dailyVariation = Math.random() * 4 - 2; // -2 to +2
    
    return Math.round(baseTemp + seasonalAdjustment + dailyVariation);
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
    
    // Fetch weather data for the selected location
    fetchWeatherData(suggestion)
      .then(weatherData => {
        // Climate will be updated based on temperature
        toast({
          title: "Location selected",
          description: `Current temperature: ${currentTemperature}°C`,
        });
      })
      .catch(error => {
        console.error("Error fetching weather:", error);
      });
  };
  
  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get traveler type icon
  const getTravelerTypeIcon = (type: TravelerType) => {
    switch (type) {
      case "Male":
        return <User className="h-5 w-5" />;
      case "Female":
        return <User className="h-5 w-5" />;
      case "Couple":
        return <UsersRound className="h-5 w-5" />;
      case "Couple with Kids":
        return <Baby className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#5e17eb] to-purple-500 bg-clip-text text-transparent">Packing List Generator</CardTitle>
        <CardDescription>
          Create a customized packing list for your trip based on destination and current weather
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
            
            <div className="grid grid-cols-2 gap-4">
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
                <label htmlFor="travelerType" className="block text-sm font-medium mb-1">Traveler Type</label>
                <Select
                  value={travelerType}
                  onValueChange={(value) => setTravelerType(value as TravelerType)}
                >
                  <SelectTrigger id="travelerType" className="w-full">
                    <SelectValue placeholder="Select traveler type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{getTravelerTypeIcon("Male")} Male</SelectItem>
                    <SelectItem value="Female">{getTravelerTypeIcon("Female")} Female</SelectItem>
                    <SelectItem value="Couple">{getTravelerTypeIcon("Couple")} Couple</SelectItem>
                    <SelectItem value="Couple with Kids">{getTravelerTypeIcon("Couple with Kids")} Couple with Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {currentTemperature && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center">
                <Thermometer className="h-5 w-5 text-[#5e17eb] mr-2" />
                <div>
                  <p className="text-sm font-medium">Current Temperature</p>
                  <p className="text-2xl font-bold">{currentTemperature}°C</p>
                  <p className="text-xs text-gray-500">Suggested climate: {climate}</p>
                </div>
              </div>
            )}
            
            <Button 
              onClick={generatePackingList} 
              className="w-full bg-[#5e17eb] hover:bg-[#4e08dd] text-white"
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
          
          <div className="bg-purple-50 dark:bg-gray-800/50 rounded-lg p-6 max-h-[70vh] overflow-y-auto">
            {packingList.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Your Packing List</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {destination} ({climate} climate) · {duration} days · {travelerType}
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
                    className="bg-[#5e17eb] h-2.5 rounded-full transition-all duration-500" 
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
