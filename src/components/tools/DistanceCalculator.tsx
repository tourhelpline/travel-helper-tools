
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Plane, Clock, Calculator } from 'lucide-react';

// Sample location data
const LOCATIONS = [
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 }
];

// Distance calculation helper
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

// Travel time calculation
const calculateTravelTimes = (distanceKm: number) => {
  // Average speeds in km/h
  const speeds = {
    flight: 850, // Average commercial airplane speed
    car: 90,     // Average highway driving speed
    train: 160,  // Average high-speed train
    bus: 70,     // Average intercity bus
    ship: 40     // Average cruise ship
  };

  // Calculate times in hours
  const times = {
    flight: distanceKm / speeds.flight,
    car: distanceKm / speeds.car,
    train: distanceKm / speeds.train,
    bus: distanceKm / speeds.bus,
    ship: distanceKm / speeds.ship
  };

  // Add airport time for flights (check-in, security, boarding, etc.)
  times.flight += 3; // Add 3 hours for airport procedures

  return times;
};

// Helper to format time
const formatTime = (hours: number) => {
  if (hours < 0.1) return "Less than 5 minutes";
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
  return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

export const DistanceCalculator = () => {
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTimes, setTravelTimes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km");

  const handleCalculate = () => {
    if (!fromLocation || !toLocation) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const fromLoc = LOCATIONS.find(loc => loc.name === fromLocation);
      const toLoc = LOCATIONS.find(loc => loc.name === toLocation);
      
      if (fromLoc && toLoc) {
        const distanceKm = calculateDistance(fromLoc.lat, fromLoc.lng, toLoc.lat, toLoc.lng);
        setDistance(distanceKm);
        setTravelTimes(calculateTravelTimes(distanceKm));
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const getFormattedDistance = () => {
    if (distance === null) return null;
    
    if (distanceUnit === "km") {
      return distance < 10 
        ? `${distance.toFixed(1)} km` 
        : `${Math.round(distance)} km`;
    } else {
      const miles = distance * 0.621371;
      return miles < 10 
        ? `${miles.toFixed(1)} miles` 
        : `${Math.round(miles)} miles`;
    }
  };

  // Helper to determine if a transportation mode is feasible
  const isTransportFeasible = (mode: string, distance: number) => {
    switch (mode) {
      case 'car':
      case 'bus':
        return distance < 1500;
      case 'train':
        return distance < 1000;
      case 'ship':
        // Only feasible if both locations are coastal
        // This would require a more complex database in a real app
        return distance > 100;
      default:
        return true;
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-travel-dark text-2xl">Distance & Travel Time Calculator</CardTitle>
        <CardDescription>
          Calculate the distance and estimated travel time between locations
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fromLocation" className="block text-sm font-medium mb-1">Starting Location</label>
              <Select
                value={fromLocation}
                onValueChange={setFromLocation}
              >
                <SelectTrigger id="fromLocation" className="w-full">
                  <SelectValue placeholder="Select starting location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={`from-${location.name}`} value={location.name}>
                      {location.name}, {location.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="toLocation" className="block text-sm font-medium mb-1">Destination</label>
              <Select
                value={toLocation}
                onValueChange={setToLocation}
              >
                <SelectTrigger id="toLocation" className="w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={`to-${location.name}`} value={location.name}>
                      {location.name}, {location.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Distance Unit</label>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${distanceUnit === 'km' ? 'bg-travel-blue text-white' : 'bg-gray-100'}`}
                  onClick={() => setDistanceUnit('km')}
                >
                  Kilometers
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${distanceUnit === 'miles' ? 'bg-travel-blue text-white' : 'bg-gray-100'}`}
                  onClick={() => setDistanceUnit('miles')}
                >
                  Miles
                </button>
              </div>
            </div>
            
            <Button 
              onClick={handleCalculate} 
              className="w-full bg-travel-blue hover:bg-travel-teal transition-colors"
              disabled={isLoading || !fromLocation || !toLocation}
            >
              {isLoading ? "Calculating..." : "Calculate Distance & Time"}
            </Button>
          </div>
          
          <div className="bg-travel-light rounded-lg p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Calculating distance and travel times...</p>
              </div>
            ) : distance !== null && travelTimes ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">As the crow flies</p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-travel-blue mr-1" />
                      <p className="text-2xl font-bold text-travel-dark">
                        {getFormattedDistance()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDistanceUnit(distanceUnit === 'km' ? 'miles' : 'km')}
                    className="text-xs"
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    Switch to {distanceUnit === 'km' ? 'Miles' : 'Kilometers'}
                  </Button>
                </div>
                
                <div className="p-4 bg-white rounded-md border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-travel-dark">From</p>
                    <p className="text-sm font-medium text-travel-dark">To</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-medium">{fromLocation}</p>
                      <p className="text-xs text-gray-500">{LOCATIONS.find(loc => loc.name === fromLocation)?.country}</p>
                    </div>
                    <div className="flex-1 mx-2 border-t border-dashed border-gray-300"></div>
                    <div className="text-right">
                      <p className="font-medium">{toLocation}</p>
                      <p className="text-xs text-gray-500">{LOCATIONS.find(loc => loc.name === toLocation)?.country}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-travel-dark mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimated Travel Times
                  </h4>
                  
                  <Tabs defaultValue="flight" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-2">
                      <TabsTrigger value="flight" className="text-xs">Flight</TabsTrigger>
                      <TabsTrigger value="ground" className="text-xs">Ground</TabsTrigger>
                      <TabsTrigger value="sea" className="text-xs">Sea</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="flight" className="mt-0">
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-travel-blue mr-2" />
                          <div>
                            <p className="font-medium">Commercial Flight</p>
                            <p className="text-sm text-gray-600">{formatTime(travelTimes.flight)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Includes approximately 3 hours for check-in, security, boarding, and baggage claim.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ground" className="mt-0 space-y-2">
                      {isTransportFeasible('car', distance) ? (
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="font-medium">By Car</p>
                          <p className="text-sm text-gray-600">{formatTime(travelTimes.car)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Assumes average highway speeds without stops.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-500">By Car</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Not recommended for this distance.
                          </p>
                        </div>
                      )}
                      
                      {isTransportFeasible('train', distance) ? (
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="font-medium">By Train</p>
                          <p className="text-sm text-gray-600">{formatTime(travelTimes.train)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Assumes high-speed train where available.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-500">By Train</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Not available for this route.
                          </p>
                        </div>
                      )}
                      
                      {isTransportFeasible('bus', distance) ? (
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="font-medium">By Bus</p>
                          <p className="text-sm text-gray-600">{formatTime(travelTimes.bus)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Includes rest stops for longer journeys.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-500">By Bus</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Not recommended for this distance.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="sea" className="mt-0">
                      {isTransportFeasible('ship', distance) ? (
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <p className="font-medium">By Ship/Ferry</p>
                          <p className="text-sm text-gray-600">{formatTime(travelTimes.ship)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Estimated time aboard a passenger ship or ferry.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-500">By Ship/Ferry</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Not available for this route or not practical.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Travel tip:</span>{' '}
                    {distance < 300 
                      ? "For this short distance, ground transportation is often more convenient than flying when you factor in airport procedures." 
                      : distance < 800 
                        ? "This medium distance can be efficiently covered by high-speed train or a short flight." 
                        : "For this long distance, flying is usually the most time-efficient option."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Select starting location and destination to calculate distance and travel times.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
