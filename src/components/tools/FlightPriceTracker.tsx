
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, PlaneTakeoff } from 'lucide-react';
import { getFlightPriceSuggestions, getOpenAIKey, simulateFlightPrice } from '@/lib/api';
import { OpenAIKeyInput } from '@/components/OpenAIKeyInput';
import { useToast } from '@/components/ui/use-toast';

// Sample airports data
const AIRPORTS = [
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA" },
  { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore" },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan" },
  { code: "SYD", name: "Kingsford Smith", city: "Sydney", country: "Australia" }
];

export const FlightPriceTracker = () => {
  const [fromAirport, setFromAirport] = useState<string>("");
  const [toAirport, setToAirport] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [flightPrice, setFlightPrice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getOpenAIKey());
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!fromAirport || !toAirport || !departureDate) return;
    
    setIsLoading(true);
    
    try {
      let priceInfo;
      
      // If API key is available, use OpenAI for more accurate suggestions
      if (hasApiKey) {
        const fromCity = AIRPORTS.find(a => a.code === fromAirport)?.city || fromAirport;
        const toCity = AIRPORTS.find(a => a.code === toAirport)?.city || toAirport;
        
        const response = await getFlightPriceSuggestions(
          fromCity, 
          toCity, 
          departureDate
        );
        
        if (response.success && response.data) {
          const aiResponse = response.data.choices[0].message.content;
          try {
            const parsedData = JSON.parse(aiResponse);
            priceInfo = {
              lowPrice: parsedData.priceRange.low,
              highPrice: parsedData.priceRange.high,
              averagePrice: parsedData.averagePrice,
              bestDayToBook: parsedData.bestTimeToBook,
              priceClass: parsedData.priceClass,
              tip: parsedData.bestDealTip
            };
          } catch (error) {
            // Fallback to simulation if parsing fails
            priceInfo = simulateFlightPrice(fromAirport, toAirport, departureDate);
          }
        } else {
          // API call failed, fallback to simulation
          priceInfo = simulateFlightPrice(fromAirport, toAirport, departureDate);
          toast({
            title: "API Error",
            description: "Could not get AI-powered prices. Using simulation instead.",
            variant: "destructive"
          });
        }
      } else {
        // No API key, use simulation
        priceInfo = simulateFlightPrice(fromAirport, toAirport, departureDate);
      }
      
      setFlightPrice(priceInfo);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get flight prices. Please try again.",
        variant: "destructive"
      });
      console.error("Error fetching flight prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceClassColor = (priceClass: string) => {
    switch (priceClass) {
      case "low": return "text-green-600";
      case "medium": return "text-amber-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-travel-dark text-2xl flex items-center gap-2">
          <PlaneTakeoff className="h-6 w-6 text-travel-blue" />
          Flight Price Tracker
        </CardTitle>
        <CardDescription>
          Get estimated flight prices and find the best time to book
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <OpenAIKeyInput onKeyChange={(key) => setHasApiKey(!!key)} />
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fromAirport" className="block text-sm font-medium mb-1">Departure Airport</label>
              <Select
                value={fromAirport}
                onValueChange={setFromAirport}
              >
                <SelectTrigger id="fromAirport" className="w-full">
                  <SelectValue placeholder="Select departure airport" />
                </SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((airport) => (
                    <SelectItem key={`from-${airport.code}`} value={airport.code}>
                      {airport.city} ({airport.code}) - {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="toAirport" className="block text-sm font-medium mb-1">Arrival Airport</label>
              <Select
                value={toAirport}
                onValueChange={setToAirport}
              >
                <SelectTrigger id="toAirport" className="w-full">
                  <SelectValue placeholder="Select arrival airport" />
                </SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((airport) => (
                    <SelectItem key={`to-${airport.code}`} value={airport.code}>
                      {airport.city} ({airport.code}) - {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium mb-1">Departure Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="departureDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "MMMM d, yyyy") : <span>Select departure date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="w-full bg-travel-blue hover:bg-travel-teal transition-colors"
              disabled={isLoading || !fromAirport || !toAirport || !departureDate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <PlaneTakeoff className="mr-2 h-4 w-4" />
                  Search Flights
                </>
              )}
            </Button>
            
            {hasApiKey && (
              <p className="text-xs text-muted-foreground italic text-center">
                Using OpenAI for enhanced price predictions
              </p>
            )}
          </div>
          
          <div className="bg-travel-light rounded-lg p-6 flex items-center justify-center shadow-sm">
            <div className="w-full">
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-travel-blue mb-4" />
                  <p className="text-gray-600">Searching for the best flight prices...</p>
                </div>
              ) : flightPrice ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Price Range</p>
                      <p className="text-2xl font-bold text-travel-blue">
                        ${flightPrice.lowPrice} - ${flightPrice.highPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Average Price</p>
                      <p className={`text-xl font-semibold ${getPriceClassColor(flightPrice.priceClass)}`}>
                        ${flightPrice.averagePrice}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <h4 className="font-medium text-travel-dark mb-2">Flight Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">From</p>
                        <p className="font-medium">{AIRPORTS.find(a => a.code === fromAirport)?.city} ({fromAirport})</p>
                      </div>
                      <div>
                        <p className="text-gray-500">To</p>
                        <p className="font-medium">{AIRPORTS.find(a => a.code === toAirport)?.city} ({toAirport})</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{departureDate && format(departureDate, "MMMM d, yyyy")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price Class</p>
                        <p className={`font-medium ${getPriceClassColor(flightPrice.priceClass)}`}>
                          {flightPrice.priceClass.charAt(0).toUpperCase() + flightPrice.priceClass.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-md shadow-sm">
                    <h4 className="font-medium text-travel-blue mb-2">Booking Tips</h4>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Best time to book:</span> {flightPrice.bestDayToBook}
                    </p>
                    {flightPrice.tip && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Pro tip:</span> {flightPrice.tip}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      {flightPrice.priceClass === "high" 
                        ? "Prices are high for this date. Consider booking immediately or changing your travel dates."
                        : flightPrice.priceClass === "medium" 
                          ? "Prices are moderate. They might drop slightly if you wait, but could also increase."
                          : "Prices are currently low. This is a good time to book."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Select departure and arrival airports and a date to see estimated flight prices.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {hasApiKey 
                      ? "Using AI-powered pricing for accurate estimates" 
                      : "Add your OpenAI API key for more accurate price predictions"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
