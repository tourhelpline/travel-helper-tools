
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { TimeZoneConverter } from './tools/TimeZoneConverter';
import { FlightPriceTracker } from './tools/FlightPriceTracker';
import { PackingListGenerator } from './tools/PackingListGenerator';
import { DistanceCalculator } from './tools/DistanceCalculator';
import { Plane, Clock, Currency, PackageCheck, Map } from 'lucide-react';
import { Button } from './ui/button'; 
import { ModeToggle } from './ModeToggle';

export const Layout = () => {
  const [activeTab, setActiveTab] = useState("currency");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-travel-light/20">
      <header className="border-b border-border/40 shadow-sm py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-travel-gradient bg-clip-text text-transparent">
              Travel Helper Tools
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Everything you need for your journey in one place
            </p>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-7xl">
        <Tabs 
          defaultValue="currency" 
          className="w-full" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="mb-8 flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-secondary/50 backdrop-blur-sm rounded-lg p-1 shadow-sm">
              <TabsTrigger 
                value="currency" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs md:text-sm py-2 flex flex-col md:flex-row gap-1 md:gap-2 items-center"
                onClick={() => setActiveTab("currency")}
              >
                <Currency className="h-4 w-4" />
                <span>Currency</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timezone" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs md:text-sm py-2 flex flex-col md:flex-row gap-1 md:gap-2 items-center"
                onClick={() => setActiveTab("timezone")}
              >
                <Clock className="h-4 w-4" />
                <span>Time Zone</span>
              </TabsTrigger>
              <TabsTrigger 
                value="flight" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs md:text-sm py-2 flex flex-col md:flex-row gap-1 md:gap-2 items-center"
                onClick={() => setActiveTab("flight")}
              >
                <Plane className="h-4 w-4" />
                <span>Flight Prices</span>
              </TabsTrigger>
              <TabsTrigger 
                value="packing" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs md:text-sm py-2 flex flex-col md:flex-row gap-1 md:gap-2 items-center"
                onClick={() => setActiveTab("packing")}
              >
                <PackageCheck className="h-4 w-4" />
                <span>Packing List</span>
              </TabsTrigger>
              <TabsTrigger 
                value="distance" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm text-xs md:text-sm py-2 flex flex-col md:flex-row gap-1 md:gap-2 items-center"
                onClick={() => setActiveTab("distance")}
              >
                <Map className="h-4 w-4" />
                <span>Distance</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border/40 p-5 md:p-7">
            <TabsContent value="currency" className="focus:outline-none mt-0">
              <CurrencyConverter />
            </TabsContent>
            
            <TabsContent value="timezone" className="focus:outline-none mt-0">
              <TimeZoneConverter />
            </TabsContent>
            
            <TabsContent value="flight" className="focus:outline-none mt-0">
              <FlightPriceTracker />
            </TabsContent>
            
            <TabsContent value="packing" className="focus:outline-none mt-0">
              <PackingListGenerator />
            </TabsContent>
            
            <TabsContent value="distance" className="focus:outline-none mt-0">
              <DistanceCalculator />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <footer className="bg-travel-dark text-white p-4 text-center text-sm mt-10">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Travel Helper Tools | All data is for informational purposes only</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
