
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

// Sample destination climate data
const CLIMATES = [
  "Tropical",
  "Desert",
  "Mediterranean",
  "Humid Continental",
  "Subarctic",
  "Temperate",
  "Oceanic",
  "Alpine"
];

// Sample trip types
const TRIP_TYPES = [
  "Beach Vacation",
  "City Break",
  "Mountain/Hiking",
  "Business Trip",
  "Backpacking",
  "Luxury Resort",
  "Safari/Adventure",
  "Ski Trip"
];

// Essential packing items
const ESSENTIAL_ITEMS = [
  "Passport/ID",
  "Credit/Debit Cards",
  "Travel Insurance Documents",
  "Flight/Travel Tickets",
  "Phone & Charger",
  "Power Adapter",
  "Medications"
];

// Define packing items by categories
const PACKING_CATEGORIES = {
  "Clothing": {
    "Tropical": ["T-shirts", "Shorts", "Swimwear", "Light dresses", "Sandals", "Sun hat", "Light jacket"],
    "Desert": ["Light, loose clothing", "Long-sleeved shirts", "Hat with neck cover", "Sunglasses", "Sturdy shoes"],
    "Mediterranean": ["Light clothing", "Swimwear", "Evening wear", "Light jacket", "Walking shoes"],
    "Humid Continental": ["Layered clothing", "Rain jacket", "Warmer jacket", "Comfortable shoes", "Umbrella"],
    "Subarctic": ["Thermal underwear", "Heavy jackets", "Insulated boots", "Gloves", "Scarves", "Warm hats"],
    "Temperate": ["Mix of light and warm clothing", "Rain jacket", "Sweaters", "Comfortable shoes"],
    "Oceanic": ["Rain jacket", "Waterproof shoes", "Umbrella", "Layered clothing", "Light sweaters"],
    "Alpine": ["Hiking boots", "Thermal layers", "Waterproof jacket", "Warm hat", "Gloves"]
  },
  "Toiletries": [
    "Toothbrush & toothpaste",
    "Shower gel/soap",
    "Shampoo & conditioner",
    "Deodorant",
    "Sunscreen",
    "Moisturizer",
    "Razor & shaving cream",
    "Hairbrush/comb",
    "Makeup & remover",
    "Contact lenses & solution"
  ],
  "Health & Safety": [
    "First aid kit",
    "Hand sanitizer",
    "Insect repellent",
    "Pain relievers",
    "Prescription medications",
    "Vitamins",
    "Face masks",
    "Sunscreen",
    "Lip balm with SPF"
  ],
  "Technology": [
    "Phone & charger",
    "Laptop/tablet & charger",
    "Camera & charger",
    "Power bank",
    "Headphones",
    "E-reader",
    "Universal adapter",
    "USB cables"
  ],
  "Miscellaneous": [
    "Sunglasses",
    "Books/e-reader",
    "Travel pillow",
    "Eye mask",
    "Earplugs",
    "Reusable water bottle",
    "Snacks",
    "Laundry bag",
    "Travel locks",
    "Travel journal"
  ]
};

// Additional items by trip type
const TRIP_SPECIFIC_ITEMS = {
  "Beach Vacation": ["Beach towel", "Flip flops", "Extra swimwear", "Beach bag", "Snorkeling gear", "Beach games"],
  "City Break": ["City map/guide", "Comfortable walking shoes", "Day bag/backpack", "Dressy outfit for evenings"],
  "Mountain/Hiking": ["Hiking boots", "Hiking poles", "Backpack", "Water bottle", "Trail maps", "First aid kit"],
  "Business Trip": ["Business attire", "Portfolio/notebook", "Business cards", "Presentation materials"],
  "Backpacking": ["Backpack", "Quick-dry towel", "Sleeping bag", "Multi-tool", "Flashlight"],
  "Luxury Resort": ["Formal wear", "Dress shoes", "Jewelry/accessories", "Spa outfit"],
  "Safari/Adventure": ["Binoculars", "Long-sleeved shirts", "Sturdy boots", "Insect repellent", "Hat with neck protection"],
  "Ski Trip": ["Ski jacket", "Ski pants", "Thermal base layers", "Ski gloves", "Goggles", "Wool socks"]
};

export const PackingListGenerator = () => {
  const [destination, setDestination] = useState<string>("");
  const [climate, setClimate] = useState<string>("");
  const [tripType, setTripType] = useState<string>("");
  const [duration, setDuration] = useState<number>(7);
  const [packingList, setPackingList] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listGenerated, setListGenerated] = useState<boolean>(false);

  const generatePackingList = () => {
    if (!climate || !tripType || !duration) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Start with essential items
      let items = [...ESSENTIAL_ITEMS];
      
      // Add climate-specific clothing
      if (PACKING_CATEGORIES.Clothing[climate as keyof typeof PACKING_CATEGORIES.Clothing]) {
        items = [...items, ...PACKING_CATEGORIES.Clothing[climate as keyof typeof PACKING_CATEGORIES.Clothing]];
      }
      
      // Add toiletries
      items = [...items, ...PACKING_CATEGORIES.Toiletries];
      
      // Add health & safety items
      items = [...items, ...PACKING_CATEGORIES.Health & Safety];
      
      // Add technology items
      items = [...items, ...PACKING_CATEGORIES.Technology];
      
      // Add trip-specific items
      if (TRIP_SPECIFIC_ITEMS[tripType as keyof typeof TRIP_SPECIFIC_ITEMS]) {
        items = [...items, ...TRIP_SPECIFIC_ITEMS[tripType as keyof typeof TRIP_SPECIFIC_ITEMS]];
      }
      
      // Add miscellaneous items
      items = [...items, ...PACKING_CATEGORIES.Miscellaneous];
      
      // Filter out duplicates
      const uniqueItems = Array.from(new Set(items));
      
      // Sort alphabetically
      const sortedItems = uniqueItems.sort();
      
      setPackingList(sortedItems);
      
      // Initialize all items as unchecked
      const initialCheckedState: { [key: string]: boolean } = {};
      sortedItems.forEach(item => {
        initialCheckedState[item] = false;
      });
      setCheckedItems(initialCheckedState);
      
      setIsLoading(false);
      setListGenerated(true);
    }, 1500);
  };

  const handleCheckItem = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const downloadPackingList = () => {
    const title = `Packing List for ${destination || "Your Trip"}\n`;
    const details = `Destination: ${destination}\nClimate: ${climate}\nTrip Type: ${tripType}\nDuration: ${duration} days\n\n`;
    
    const categories: { [key: string]: string[] } = {
      "Essentials": [],
      "Clothing": [],
      "Toiletries": [],
      "Health & Safety": [],
      "Technology": [],
      "Trip Specific": [],
      "Miscellaneous": []
    };
    
    // Categorize items for the text file
    packingList.forEach(item => {
      if (ESSENTIAL_ITEMS.includes(item)) {
        categories["Essentials"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else if (climate && PACKING_CATEGORIES.Clothing[climate as keyof typeof PACKING_CATEGORIES.Clothing]?.includes(item)) {
        categories["Clothing"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else if (PACKING_CATEGORIES.Toiletries.includes(item)) {
        categories["Toiletries"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else if (PACKING_CATEGORIES["Health & Safety"].includes(item)) {
        categories["Health & Safety"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else if (PACKING_CATEGORIES.Technology.includes(item)) {
        categories["Technology"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else if (tripType && TRIP_SPECIFIC_ITEMS[tripType as keyof typeof TRIP_SPECIFIC_ITEMS]?.includes(item)) {
        categories["Trip Specific"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      } else {
        categories["Miscellaneous"].push(`${checkedItems[item] ? "✓" : "☐"} ${item}`);
      }
    });
    
    // Build the text content
    let content = title + details;
    
    for (const [category, items] of Object.entries(categories)) {
      if (items.length > 0) {
        content += `== ${category} ==\n`;
        content += items.join('\n');
        content += '\n\n';
      }
    }
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `packing-list-${destination.replace(/\s+/g, '-').toLowerCase() || 'trip'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getCategoryColor = (item: string) => {
    if (ESSENTIAL_ITEMS.includes(item)) {
      return "text-red-600 font-medium";
    }
    if (climate && PACKING_CATEGORIES.Clothing[climate as keyof typeof PACKING_CATEGORIES.Clothing]?.includes(item)) {
      return "text-blue-600";
    }
    if (PACKING_CATEGORIES.Toiletries.includes(item)) {
      return "text-purple-600";
    }
    if (PACKING_CATEGORIES["Health & Safety"].includes(item)) {
      return "text-green-600";
    }
    if (PACKING_CATEGORIES.Technology.includes(item)) {
      return "text-amber-600";
    }
    if (tripType && TRIP_SPECIFIC_ITEMS[tripType as keyof typeof TRIP_SPECIFIC_ITEMS]?.includes(item)) {
      return "text-teal-600 font-medium";
    }
    return "text-gray-700";
  };

  const getProgressPercentage = () => {
    if (packingList.length === 0) return 0;
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / packingList.length) * 100);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-travel-dark text-2xl">Packing List Generator</CardTitle>
        <CardDescription>
          Create a customized packing list based on your destination and trip details
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {!listGenerated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
                <Input
                  id="destination"
                  placeholder="Enter your destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
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
                    <SelectValue placeholder="Select climate type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIMATES.map((climateType) => (
                      <SelectItem key={climateType} value={climateType}>
                        {climateType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="tripType" className="block text-sm font-medium mb-1">Trip Type</label>
                <Select
                  value={tripType}
                  onValueChange={setTripType}
                >
                  <SelectTrigger id="tripType" className="w-full">
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIP_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">Trip Duration (days)</label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={90}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={generatePackingList} 
                className="w-full bg-travel-blue hover:bg-travel-teal transition-colors"
                disabled={isLoading || !climate || !tripType}
              >
                {isLoading ? "Generating..." : "Generate Packing List"}
              </Button>
            </div>
            
            <div className="bg-travel-light rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-3">How to use the Packing List Generator</h3>
                <ol className="text-left space-y-2 text-gray-600">
                  <li>1. Enter your destination (optional)</li>
                  <li>2. Select the climate of your destination</li>
                  <li>3. Choose your trip type</li>
                  <li>4. Set the duration of your trip</li>
                  <li>5. Click "Generate Packing List" to get your customized list</li>
                </ol>
                <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500">
                    After generating your list, you can check off items as you pack them and download the list for printing or offline reference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-travel-dark">
                  Packing List for {destination || "Your Trip"}
                </h3>
                <p className="text-sm text-gray-500">
                  {climate} climate • {tripType} • {duration} days
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setListGenerated(false)} variant="outline">
                  Edit Details
                </Button>
                <Button 
                  onClick={downloadPackingList} 
                  className="bg-travel-blue hover:bg-travel-teal transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download List
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Packing Progress</span>
                <span className="text-sm font-medium">{getProgressPercentage()}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-travel-teal rounded-full" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-medium">Items to Pack ({packingList.length})</h4>
                <div className="text-xs space-x-4">
                  <span className="text-red-600">● Essential</span>
                  <span className="text-teal-600">● Trip Specific</span>
                </div>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {packingList.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 py-1">
                      <Checkbox 
                        id={`item-${index}`}
                        checked={checkedItems[item] || false}
                        onCheckedChange={() => handleCheckItem(item)}
                      />
                      <Label 
                        htmlFor={`item-${index}`}
                        className={`${getCategoryColor(item)} ${checkedItems[item] ? 'line-through opacity-60' : ''}`}
                      >
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md text-sm">
              <h4 className="font-medium text-travel-blue mb-1">Packing Tips</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Roll clothes instead of folding to save space and reduce wrinkles</li>
                <li>Pack heavier items at the bottom of your suitcase</li>
                <li>Use packing cubes to organize and compress your belongings</li>
                <li>Place toiletries in a ziplock bag to prevent leaks</li>
                <li>Keep essential documents and medications in your carry-on</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
