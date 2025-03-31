
// Weather utility functions to work with OpenWeatherMap API or similar

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  climate: string; // cold, moderate, warm, hot, tropical, variable
}

// Function to determine climate type based on temperature
export const getClimateType = (tempCelsius: number): string => {
  if (tempCelsius < 10) return 'cold';
  if (tempCelsius < 21) return 'moderate';
  if (tempCelsius < 29) return 'warm';
  return 'hot';
};

// This would be connected to a real weather API in production
export const fetchWeatherForLocation = async (location: string): Promise<WeatherData | null> => {
  try {
    // This is where we would make an API call to a weather service
    // For demo purposes, we'll create mock data based on the location string
    
    // Simple hash function to generate consistent "random" temperatures for locations
    const hash = location.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    const baseTemp = (hash % 40) - 5; // Temperature range from -5 to 35°C
    
    // Determine climate based on temperature
    const climate = getClimateType(baseTemp);
    
    // Mock weather conditions based on climate
    let condition = 'Clear';
    let icon = '01d'; // Default clear day icon
    
    if (climate === 'cold') {
      condition = hash % 2 === 0 ? 'Snow' : 'Clear';
      icon = hash % 2 === 0 ? '13d' : '01d';
    } else if (climate === 'moderate') {
      condition = hash % 3 === 0 ? 'Clouds' : (hash % 3 === 1 ? 'Rain' : 'Clear');
      icon = hash % 3 === 0 ? '03d' : (hash % 3 === 1 ? '10d' : '01d');
    } else if (climate === 'warm' || climate === 'hot') {
      condition = hash % 4 === 0 ? 'Clouds' : (hash % 4 === 1 ? 'Rain' : 'Clear');
      icon = hash % 4 === 0 ? '03d' : (hash % 4 === 1 ? '10d' : '01d');
    }
    
    return {
      temperature: baseTemp,
      condition,
      icon,
      climate
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
