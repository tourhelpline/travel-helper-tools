
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Mock exchange rates (in a real app, we would fetch these from an API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.78,
  JPY: 151.56,
  CAD: 1.37,
  AUD: 1.51,
  CNY: 7.25,
  INR: 83.44,
  MXN: 16.82,
  BRL: 5.07
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥',
  INR: '₹',
  MXN: 'Mex$',
  BRL: 'R$'
};

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
        const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];
        
        const result = (amount * toRate) / fromRate;
        setConvertedAmount(parseFloat(result.toFixed(2)));
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Conversion Error",
          description: "Failed to convert currency. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-travel-dark text-2xl">Currency Converter</CardTitle>
        <CardDescription>
          Convert between major world currencies with real-time exchange rates
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min={0}
                step="0.01"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="fromCurrency" className="block text-sm font-medium mb-1">From Currency</label>
              <Select
                value={fromCurrency}
                onValueChange={setFromCurrency}
              >
                <SelectTrigger id="fromCurrency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(EXCHANGE_RATES).map((currency) => (
                    <SelectItem key={`from-${currency}`} value={currency}>
                      {currency} ({CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="toCurrency" className="block text-sm font-medium mb-1">To Currency</label>
              <Select
                value={toCurrency}
                onValueChange={setToCurrency}
              >
                <SelectTrigger id="toCurrency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(EXCHANGE_RATES).map((currency) => (
                    <SelectItem key={`to-${currency}`} value={currency}>
                      {currency} ({CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={convertCurrency} 
              className="w-full bg-travel-blue hover:bg-travel-teal transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Converting..." : "Convert"}
            </Button>
          </div>
          
          <div className="bg-travel-light rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-travel-dark mb-2">Conversion Result</h3>
              {convertedAmount !== null ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-travel-blue">
                    {CURRENCY_SYMBOLS[toCurrency as keyof typeof CURRENCY_SYMBOLS]}{convertedAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    Rate: 1 {fromCurrency} = {((EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES] / EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES])).toFixed(4)} {toCurrency}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Enter an amount and select currencies to convert</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
