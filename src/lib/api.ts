
export interface OpenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Function to check if API key is valid (simple format check)
export const isValidOpenAIKey = (key: string): boolean => {
  return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
};

// Function to store API key in local storage
export const storeOpenAIKey = (key: string): void => {
  localStorage.setItem('openai-api-key', key);
};

// Function to get API key from local storage
export const getOpenAIKey = (): string | null => {
  return localStorage.getItem('openai-api-key');
};

// Generic function to make requests to OpenAI API
export const fetchFromOpenAI = async (
  prompt: string,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  apiKey?: string
): Promise<OpenAIResponse> => {
  const key = apiKey || getOpenAIKey();
  
  if (!key) {
    return {
      success: false,
      error: 'No API key provided. Please set your OpenAI API key.'
    };
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || 'Failed to fetch from OpenAI API'
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Helper for flight price suggestions
export const getFlightPriceSuggestions = async (
  from: string,
  to: string,
  date: Date,
  apiKey?: string
): Promise<OpenAIResponse> => {
  const prompt = `
    I need realistic flight price estimates for a flight from ${from} to ${to} on ${date.toISOString().split('T')[0]}.
    
    Please provide:
    1. A price range (lowest to highest prices)
    2. The average price
    3. A tip for getting the best deal
    4. Best time to book (e.g., "now", "1 month in advance", etc.)
    
    Format the response as JSON with the following structure:
    {
      "priceRange": { "low": number, "high": number },
      "averagePrice": number,
      "bestDealTip": "string",
      "bestTimeToBook": "string",
      "priceClass": "low" | "medium" | "high"
    }
    
    Only respond with the JSON, no other text.
  `;
  
  return fetchFromOpenAI(prompt, 'gpt-4o', 0.3, apiKey);
};

// Helper for customized packing list suggestions
export const getPackingListSuggestions = async (
  destination: string,
  duration: number,
  climate: string,
  apiKey?: string
): Promise<OpenAIResponse> => {
  const prompt = `
    Create a customized packing list for a trip to ${destination} for ${duration} days in a ${climate} climate.
    
    Format the response as JSON with the following structure:
    {
      "categories": [
        {
          "name": "string",
          "items": ["string"]
        }
      ],
      "specialItems": ["string"],
      "destinationTips": ["string"]
    }
    
    Only respond with the JSON, no other text.
  `;
  
  return fetchFromOpenAI(prompt, 'gpt-4o', 0.5, apiKey);
};

// For simulating realistic flight prices
export const simulateFlightPrice = (
  from: string,
  to: string,
  date: Date
): { lowPrice: number, highPrice: number, averagePrice: number, bestDayToBook: string, priceClass: string } => {
  // Base price calculation (can be enhanced with more factors)
  const basePrice = 200 + (Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) * 20);
  
  // Date factor (prices increase as date approaches)
  const today = new Date();
  const daysUntilFlight = Math.max(1, Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  let priceFactor = 1;
  if (daysUntilFlight < 7) {
    priceFactor = 1.7; // Last minute premium
  } else if (daysUntilFlight < 14) {
    priceFactor = 1.4;
  } else if (daysUntilFlight < 30) {
    priceFactor = 1.2;
  } else if (daysUntilFlight < 90) {
    priceFactor = 1.0; // Optimal booking window
  } else {
    priceFactor = 1.1; // Too early can also be more expensive
  }
  
  // Season factor (summer and holidays are more expensive)
  const month = date.getMonth();
  let seasonFactor = 1;
  if (month >= 5 && month <= 8) {
    seasonFactor = 1.2; // Summer premium
  } else if (month === 11 || month === 0) {
    seasonFactor = 1.3; // Holiday premium
  }
  
  // Weekend factor
  const day = date.getDay();
  const weekendFactor = (day === 0 || day === 5 || day === 6) ? 1.15 : 1;
  
  // Calculate final price
  let finalPrice = basePrice * priceFactor * seasonFactor * weekendFactor;
  finalPrice = Math.round(finalPrice / 10) * 10; // Round to nearest 10
  
  // Price range
  const lowPrice = Math.round(finalPrice * 0.85);
  const highPrice = Math.round(finalPrice * 1.25);
  
  // Determine price class
  let priceClass = "medium";
  if (priceFactor >= 1.4) {
    priceClass = "high";
  } else if (priceFactor <= 1.0) {
    priceClass = "low";
  }
  
  // Best day advice
  let bestDayToBook;
  if (daysUntilFlight < 7) {
    bestDayToBook = "immediately (prices will likely increase further)";
  } else if (daysUntilFlight < 21) {
    bestDayToBook = "as soon as possible";
  } else if (daysUntilFlight < 90) {
    bestDayToBook = "now (you're in the optimal booking window)";
  } else {
    bestDayToBook = "waiting until 2-3 months before departure";
  }
  
  return {
    lowPrice,
    highPrice,
    averagePrice: finalPrice,
    bestDayToBook,
    priceClass
  };
};
