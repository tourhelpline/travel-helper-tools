
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Plane, Clock, Calculator, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export const DistanceCalculator = () => {
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState<boolean>(false);
  const [showToSuggestions, setShowToSuggestions] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTimes, setTravelTimes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [distanceUnit, setDistanceUnit] = useState<"km" | "miles">("km");
  const [routeDetails, setRouteDetails] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load Google Maps API script
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDstR0CAhqB8EDENlx4KZ-fGoyg1g0DYzQ&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
    
    // Close suggestions when clicking outside
    const handleClickOutside = () => {
      setShowFromSuggestions(false);
      setShowToSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const initMap = () => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });
      
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#6d28d9", // Purple color
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });
    }
  };

  const fetchLocationSuggestions = (query: string, setResults: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
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
          setResults([]);
          return;
        }
        
        setResults(predictions.map(p => p.description));
      }
    );
  };

  const handleFromLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromLocation(value);
    fetchLocationSuggestions(value, setFromSuggestions);
    setShowFromSuggestions(true);
  };

  const handleToLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToLocation(value);
    fetchLocationSuggestions(value, setToSuggestions);
    setShowToSuggestions(true);
  };

  const selectFromSuggestion = (suggestion: string) => {
    setFromLocation(suggestion);
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = (suggestion: string) => {
    setToLocation(suggestion);
    setShowToSuggestions(false);
  };

  const calculateRoute = () => {
    if (!fromLocation || !toLocation || !window.google || !window.google.maps) return;
    
    setIsLoading(true);
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: fromLocation,
        destination: toLocation,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          // Set directions on map
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          }
          
          // Get distance and duration
          const route = result.routes[0];
          const distanceValue = route.legs[0].distance?.value || 0; // in meters
          const durationValue = route.legs[0].duration?.value || 0; // in seconds
          
          // Convert to km
          const distanceKm = distanceValue / 1000;
          setDistance(distanceKm);
          
          // Calculate other travel times
          setTravelTimes(calculateTravelTimes(distanceKm));
          
          // Set route details
          setRouteDetails({
            from: route.legs[0].start_address,
            to: route.legs[0].end_address,
            distance: route.legs[0].distance?.text,
            duration: route.legs[0].duration?.text
          });
          
          toast({
            title: "Route calculated!",
            description: `Distance: ${route.legs[0].distance?.text}, Duration: ${route.legs[0].duration?.text}`,
          });
        } else {
          console.error("Directions request failed:", status);
          toast({
            variant: "destructive",
            title: "Failed to calculate route",
            description: "Could not determine the route between these locations. Please try again.",
          });
        }
        
        setIsLoading(false);
      }
    );
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
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Distance & Travel Time Calculator</CardTitle>
        <CardDescription>
          Calculate the distance and estimated travel time between locations using Google Maps
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="fromLocation" className="block text-sm font-medium mb-1">Starting Location</label>
              <div className="relative">
                <Input
                  id="fromLocation"
                  placeholder="Enter starting location"
                  value={fromLocation}
                  onChange={handleFromLocationChange}
                  className="w-full pr-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fromLocation.length >= 3) {
                      setShowFromSuggestions(true);
                    }
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {fromSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      onClick={() => selectFromSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <label htmlFor="toLocation" className="block text-sm font-medium mb-1">Destination</label>
              <div className="relative">
                <Input
                  id="toLocation"
                  placeholder="Enter destination"
                  value={toLocation}
                  onChange={handleToLocationChange}
                  className="w-full pr-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (toLocation.length >= 3) {
                      setShowToSuggestions(true);
                    }
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {toSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      onClick={() => selectToSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Distance Unit</label>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${distanceUnit === 'km' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  onClick={() => setDistanceUnit('km')}
                >
                  Kilometers
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${distanceUnit === 'miles' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  onClick={() => setDistanceUnit('miles')}
                >
                  Miles
                </button>
              </div>
            </div>
            
            <Button 
              onClick={calculateRoute} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading || !fromLocation || !toLocation}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Distance & Time"
              )}
            </Button>
            
            {/* Google Maps */}
            <div 
              ref={mapRef} 
              className="w-full h-[300px] rounded-lg border border-gray-200 dark:border-gray-700 mt-4"
            ></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600 dark:text-gray-300">Calculating distance and travel times...</p>
              </div>
            ) : distance !== null && travelTimes ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">As the crow flies</p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-purple-600 mr-1" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
                
                {routeDetails && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">From</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">To</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-left max-w-[45%]">
                        <p className="font-medium text-sm">{routeDetails.from}</p>
                      </div>
                      <div className="flex-1 mx-2 border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                      <div className="text-right max-w-[45%]">
                        <p className="font-medium text-sm">{routeDetails.to}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                      <p>Driving distance: {routeDetails.distance} ({routeDetails.duration} by car)</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
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
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-purple-600 mr-2" />
                          <div>
                            <p className="font-medium">Commercial Flight</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(travelTimes.flight)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Includes approximately 3 hours for check-in, security, boarding, and baggage claim.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ground" className="mt-0 space-y-2">
                      {isTransportFeasible('car', distance) ? (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium">By Car</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(travelTimes.car)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Assumes average highway speeds without stops.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-500 dark:text-gray-400">By Car</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Not recommended for this distance.
                          </p>
                        </div>
                      )}
                      
                      {isTransportFeasible('train', distance) ? (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium">By Train</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(travelTimes.train)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Assumes high-speed train where available.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-500 dark:text-gray-400">By Train</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Not available for this route.
                          </p>
                        </div>
                      )}
                      
                      {isTransportFeasible('bus', distance) ? (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium">By Bus</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(travelTimes.bus)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Includes rest stops for longer journeys.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-500 dark:text-gray-400">By Bus</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Not recommended for this distance.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="sea" className="mt-0">
                      {isTransportFeasible('ship', distance) ? (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium">By Ship/Ferry</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(travelTimes.ship)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Estimated time aboard a passenger ship or ferry.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-500 dark:text-gray-400">By Ship/Ferry</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Not available for this route or not practical.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-md">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
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
                <p className="text-gray-600 dark:text-gray-300">Select starting location and destination to calculate distance and travel times.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
