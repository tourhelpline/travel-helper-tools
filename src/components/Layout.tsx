
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { TimeZoneConverter } from './tools/TimeZoneConverter';
import { FlightPriceTracker } from './tools/FlightPriceTracker';
import { PackingListGenerator } from './tools/PackingListGenerator';
import { DistanceCalculator } from './tools/DistanceCalculator';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-travel-gradient text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Travel Helper Tools</h1>
          <p className="text-sm md:text-base opacity-90">Everything you need for your journey in one place</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs defaultValue="currency" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-travel-light">
            <TabsTrigger value="currency" className="text-xs md:text-sm">Currency</TabsTrigger>
            <TabsTrigger value="timezone" className="text-xs md:text-sm">Time Zone</TabsTrigger>
            <TabsTrigger value="flight" className="text-xs md:text-sm">Flight Prices</TabsTrigger>
            <TabsTrigger value="packing" className="text-xs md:text-sm">Packing List</TabsTrigger>
            <TabsTrigger value="distance" className="text-xs md:text-sm">Distance</TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <TabsContent value="currency" className="focus:outline-none">
              <CurrencyConverter />
            </TabsContent>
            
            <TabsContent value="timezone" className="focus:outline-none">
              <TimeZoneConverter />
            </TabsContent>
            
            <TabsContent value="flight" className="focus:outline-none">
              <FlightPriceTracker />
            </TabsContent>
            
            <TabsContent value="packing" className="focus:outline-none">
              <PackingListGenerator />
            </TabsContent>
            
            <TabsContent value="distance" className="focus:outline-none">
              <DistanceCalculator />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <footer className="bg-travel-dark text-white p-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Travel Helper Tools | All data is for informational purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
