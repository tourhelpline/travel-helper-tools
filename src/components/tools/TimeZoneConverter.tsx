
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

// Sample timezone data with UTC offsets in hours
const TIMEZONES = [
  { city: "New York", country: "USA", offset: -4, code: "America/New_York" },
  { city: "Los Angeles", country: "USA", offset: -7, code: "America/Los_Angeles" },
  { city: "London", country: "UK", offset: 1, code: "Europe/London" },
  { city: "Paris", country: "France", offset: 2, code: "Europe/Paris" },
  { city: "Berlin", country: "Germany", offset: 2, code: "Europe/Berlin" },
  { city: "Moscow", country: "Russia", offset: 3, code: "Europe/Moscow" },
  { city: "Dubai", country: "UAE", offset: 4, code: "Asia/Dubai" },
  { city: "Mumbai", country: "India", offset: 5.5, code: "Asia/Kolkata" },
  { city: "Singapore", country: "Singapore", offset: 8, code: "Asia/Singapore" },
  { city: "Tokyo", country: "Japan", offset: 9, code: "Asia/Tokyo" },
  { city: "Sydney", country: "Australia", offset: 10, code: "Australia/Sydney" },
  { city: "Auckland", country: "New Zealand", offset: 12, code: "Pacific/Auckland" }
];

export const TimeZoneConverter = () => {
  const [fromTimezone, setFromTimezone] = useState<string>("America/New_York");
  const [toTimezone, setToTimezone] = useState<string>("Europe/London");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [convertedTime, setConvertedTime] = useState<Date | null>(null);
  const [timeDifference, setTimeDifference] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fromTimezone && toTimezone) {
      convertTime();
    }
  }, [currentTime, fromTimezone, toTimezone]);

  const convertTime = () => {
    try {
      // Get the from timezone details
      const fromTz = TIMEZONES.find(tz => tz.code === fromTimezone);
      const toTz = TIMEZONES.find(tz => tz.code === toTimezone);
      
      if (!fromTz || !toTz) return;
      
      // Get current UTC time by subtracting the from timezone offset
      const utcTime = new Date(currentTime.getTime() - (fromTz.offset * 3600000));
      
      // Convert to target timezone by adding the to timezone offset
      const targetTime = new Date(utcTime.getTime() + (toTz.offset * 3600000));
      setConvertedTime(targetTime);
      
      // Calculate time difference
      const diffHours = toTz.offset - fromTz.offset;
      const diffText = diffHours === 0 
        ? "Same time" 
        : `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'ahead' : 'behind'}`;
      
      setTimeDifference(diffText);
      
    } catch (error) {
      console.error("Error converting time:", error);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-travel-dark text-2xl">Time Zone Converter</CardTitle>
        <CardDescription>
          Check time differences between major cities around the world
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fromTimezone" className="block text-sm font-medium mb-1">From Location</label>
              <Select
                value={fromTimezone}
                onValueChange={setFromTimezone}
              >
                <SelectTrigger id="fromTimezone" className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={`from-${tz.code}`} value={tz.code}>
                      {tz.city}, {tz.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {fromTimezone && (
                <div className="mt-2 p-3 bg-travel-light rounded-lg">
                  <p className="text-sm text-gray-500">Current time:</p>
                  <p className="text-xl font-semibold">
                    {format(currentTime, "h:mm:ss a")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(currentTime, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="toTimezone" className="block text-sm font-medium mb-1">To Location</label>
              <Select
                value={toTimezone}
                onValueChange={setToTimezone}
              >
                <SelectTrigger id="toTimezone" className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={`to-${tz.code}`} value={tz.code}>
                      {tz.city}, {tz.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {toTimezone && convertedTime && (
                <div className="mt-2 p-3 bg-travel-blue bg-opacity-10 rounded-lg">
                  <p className="text-sm text-gray-500">Local time:</p>
                  <p className="text-xl font-semibold text-travel-blue">
                    {format(convertedTime, "h:mm:ss a")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(convertedTime, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-travel-light rounded-lg p-6 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-travel-dark">Time Difference</h3>
              
              {timeDifference && (
                <>
                  <div className="flex justify-center items-center space-x-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {TIMEZONES.find(tz => tz.code === fromTimezone)?.city}
                      </p>
                      <p className="text-lg font-semibold">
                        {format(currentTime, "h:mm a")}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-0.5 bg-travel-blue"></div>
                      <p className="text-sm text-travel-blue font-medium my-1">{timeDifference}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {TIMEZONES.find(tz => tz.code === toTimezone)?.city}
                      </p>
                      <p className="text-lg font-semibold text-travel-blue">
                        {convertedTime && format(convertedTime, "h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-gray-200 text-sm text-gray-600 mt-4">
                    <p>
                      When it's <span className="font-medium">{format(currentTime, "h:mm a")}</span> in {TIMEZONES.find(tz => tz.code === fromTimezone)?.city}, 
                      it's <span className="font-medium text-travel-blue">{convertedTime && format(convertedTime, "h:mm a")}</span> in {TIMEZONES.find(tz => tz.code === toTimezone)?.city}.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
