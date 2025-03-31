import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

// Comprehensive time zone data with UTC offsets in hours
const TIMEZONES = [
  // North America
  { city: "Anchorage", country: "USA", offset: -8, code: "America/Anchorage" },
  { city: "Los Angeles", country: "USA", offset: -7, code: "America/Los_Angeles" },
  { city: "Denver", country: "USA", offset: -6, code: "America/Denver" },
  { city: "Chicago", country: "USA", offset: -5, code: "America/Chicago" },
  { city: "New York", country: "USA", offset: -4, code: "America/New_York" },
  { city: "Toronto", country: "Canada", offset: -4, code: "America/Toronto" },
  { city: "Halifax", country: "Canada", offset: -3, code: "America/Halifax" },
  { city: "St. John's", country: "Canada", offset: -2.5, code: "America/St_Johns" },
  { city: "Mexico City", country: "Mexico", offset: -5, code: "America/Mexico_City" },
  
  // South America
  { city: "Rio de Janeiro", country: "Brazil", offset: -3, code: "America/Sao_Paulo" },
  { city: "Buenos Aires", country: "Argentina", offset: -3, code: "America/Argentina/Buenos_Aires" },
  { city: "Santiago", country: "Chile", offset: -4, code: "America/Santiago" },
  { city: "Caracas", country: "Venezuela", offset: -4, code: "America/Caracas" },
  { city: "Lima", country: "Peru", offset: -5, code: "America/Lima" },
  
  // Europe
  { city: "London", country: "UK", offset: 1, code: "Europe/London" },
  { city: "Dublin", country: "Ireland", offset: 1, code: "Europe/Dublin" },
  { city: "Lisbon", country: "Portugal", offset: 1, code: "Europe/Lisbon" },
  { city: "Paris", country: "France", offset: 2, code: "Europe/Paris" },
  { city: "Madrid", country: "Spain", offset: 2, code: "Europe/Madrid" },
  { city: "Rome", country: "Italy", offset: 2, code: "Europe/Rome" },
  { city: "Berlin", country: "Germany", offset: 2, code: "Europe/Berlin" },
  { city: "Amsterdam", country: "Netherlands", offset: 2, code: "Europe/Amsterdam" },
  { city: "Brussels", country: "Belgium", offset: 2, code: "Europe/Brussels" },
  { city: "Zurich", country: "Switzerland", offset: 2, code: "Europe/Zurich" },
  { city: "Vienna", country: "Austria", offset: 2, code: "Europe/Vienna" },
  { city: "Copenhagen", country: "Denmark", offset: 2, code: "Europe/Copenhagen" },
  { city: "Stockholm", country: "Sweden", offset: 2, code: "Europe/Stockholm" },
  { city: "Oslo", country: "Norway", offset: 2, code: "Europe/Oslo" },
  { city: "Helsinki", country: "Finland", offset: 3, code: "Europe/Helsinki" },
  { city: "Athens", country: "Greece", offset: 3, code: "Europe/Athens" },
  { city: "Istanbul", country: "Turkey", offset: 3, code: "Europe/Istanbul" },
  { city: "Moscow", country: "Russia", offset: 3, code: "Europe/Moscow" },
  
  // Asia
  { city: "Dubai", country: "UAE", offset: 4, code: "Asia/Dubai" },
  { city: "Abu Dhabi", country: "UAE", offset: 4, code: "Asia/Dubai" },
  { city: "Doha", country: "Qatar", offset: 3, code: "Asia/Qatar" },
  { city: "Riyadh", country: "Saudi Arabia", offset: 3, code: "Asia/Riyadh" },
  { city: "Tehran", country: "Iran", offset: 4.5, code: "Asia/Tehran" },
  { city: "Kabul", country: "Afghanistan", offset: 4.5, code: "Asia/Kabul" },
  { city: "Karachi", country: "Pakistan", offset: 5, code: "Asia/Karachi" },
  { city: "New Delhi", country: "India", offset: 5.5, code: "Asia/Kolkata" },
  { city: "Mumbai", country: "India", offset: 5.5, code: "Asia/Kolkata" },
  { city: "Bangalore", country: "India", offset: 5.5, code: "Asia/Kolkata" },
  { city: "Colombo", country: "Sri Lanka", offset: 5.5, code: "Asia/Colombo" },
  { city: "Kathmandu", country: "Nepal", offset: 5.75, code: "Asia/Kathmandu" },
  { city: "Dhaka", country: "Bangladesh", offset: 6, code: "Asia/Dhaka" },
  { city: "Yangon", country: "Myanmar", offset: 6.5, code: "Asia/Yangon" },
  { city: "Bangkok", country: "Thailand", offset: 7, code: "Asia/Bangkok" },
  { city: "Ho Chi Minh City", country: "Vietnam", offset: 7, code: "Asia/Ho_Chi_Minh" },
  { city: "Jakarta", country: "Indonesia", offset: 7, code: "Asia/Jakarta" },
  { city: "Kuala Lumpur", country: "Malaysia", offset: 8, code: "Asia/Kuala_Lumpur" },
  { city: "Singapore", country: "Singapore", offset: 8, code: "Asia/Singapore" },
  { city: "Hong Kong", country: "China", offset: 8, code: "Asia/Hong_Kong" },
  { city: "Shanghai", country: "China", offset: 8, code: "Asia/Shanghai" },
  { city: "Beijing", country: "China", offset: 8, code: "Asia/Shanghai" },
  { city: "Taipei", country: "Taiwan", offset: 8, code: "Asia/Taipei" },
  { city: "Seoul", country: "South Korea", offset: 9, code: "Asia/Seoul" },
  { city: "Tokyo", country: "Japan", offset: 9, code: "Asia/Tokyo" },
  
  // Australia and Pacific
  { city: "Perth", country: "Australia", offset: 8, code: "Australia/Perth" },
  { city: "Darwin", country: "Australia", offset: 9.5, code: "Australia/Darwin" },
  { city: "Adelaide", country: "Australia", offset: 10.5, code: "Australia/Adelaide" },
  { city: "Brisbane", country: "Australia", offset: 10, code: "Australia/Brisbane" },
  { city: "Sydney", country: "Australia", offset: 11, code: "Australia/Sydney" },
  { city: "Melbourne", country: "Australia", offset: 11, code: "Australia/Melbourne" },
  { city: "Hobart", country: "Australia", offset: 11, code: "Australia/Hobart" },
  { city: "Auckland", country: "New Zealand", offset: 13, code: "Pacific/Auckland" },
  { city: "Wellington", country: "New Zealand", offset: 13, code: "Pacific/Auckland" },
  { city: "Christchurch", country: "New Zealand", offset: 13, code: "Pacific/Auckland" },
  { city: "Fiji", country: "Fiji", offset: 12, code: "Pacific/Fiji" },
  { city: "Honolulu", country: "USA", offset: -10, code: "Pacific/Honolulu" },
  
  // Africa
  { city: "Cairo", country: "Egypt", offset: 2, code: "Africa/Cairo" },
  { city: "Johannesburg", country: "South Africa", offset: 2, code: "Africa/Johannesburg" },
  { city: "Lagos", country: "Nigeria", offset: 1, code: "Africa/Lagos" },
  { city: "Nairobi", country: "Kenya", offset: 3, code: "Africa/Nairobi" },
  { city: "Casablanca", country: "Morocco", offset: 1, code: "Africa/Casablanca" },
  { city: "Tunis", country: "Tunisia", offset: 1, code: "Africa/Tunis" },
  { city: "Addis Ababa", country: "Ethiopia", offset: 3, code: "Africa/Addis_Ababa" },
  { city: "Accra", country: "Ghana", offset: 0, code: "Africa/Accra" },
  
  // Other important time zones
  { city: "Reykjavik", country: "Iceland", offset: 0, code: "Atlantic/Reykjavik" },
  { city: "Midway Islands", country: "US Minor Outlying Islands", offset: -11, code: "Pacific/Midway" },
  { city: "International Date Line West", country: "International", offset: -12, code: "Etc/GMT+12" },
  { city: "International Date Line East", country: "International", offset: 12, code: "Etc/GMT-12" },
  { city: "Azores", country: "Portugal", offset: 0, code: "Atlantic/Azores" },
  { city: "Cape Verde", country: "Cape Verde", offset: -1, code: "Atlantic/Cape_Verde" },
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
        <CardTitle className="text-[#5e17eb] text-2xl">Time Zone Converter</CardTitle>
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
                <SelectContent className="max-h-[300px]">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={`from-${tz.code}`} value={tz.code}>
                      {tz.city}, {tz.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {fromTimezone && (
                <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current time:</p>
                  <p className="text-xl font-semibold">
                    {format(currentTime, "h:mm:ss a")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <SelectContent className="max-h-[300px]">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={`to-${tz.code}`} value={tz.code}>
                      {tz.city}, {tz.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {toTimezone && convertedTime && (
                <div className="mt-2 p-3 bg-[#5e17eb]/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Local time:</p>
                  <p className="text-xl font-semibold text-[#5e17eb]">
                    {format(convertedTime, "h:mm:ss a")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(convertedTime, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Time Difference</h3>
              
              {timeDifference && (
                <>
                  <div className="flex justify-center items-center space-x-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {TIMEZONES.find(tz => tz.code === fromTimezone)?.city}
                      </p>
                      <p className="text-lg font-semibold">
                        {format(currentTime, "h:mm a")}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-0.5 bg-[#5e17eb]"></div>
                      <p className="text-sm text-[#5e17eb] font-medium my-1">{timeDifference}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {TIMEZONES.find(tz => tz.code === toTimezone)?.city}
                      </p>
                      <p className="text-lg font-semibold text-[#5e17eb]">
                        {convertedTime && format(convertedTime, "h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 mt-4">
                    <p>
                      When it's <span className="font-medium">{format(currentTime, "h:mm a")}</span> in {TIMEZONES.find(tz => tz.code === fromTimezone)?.city}, 
                      it's <span className="font-medium text-[#5e17eb]">{convertedTime && format(convertedTime, "h:mm a")}</span> in {TIMEZONES.find(tz => tz.code === toTimezone)?.city}.
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
