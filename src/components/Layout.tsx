
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { TimeZoneConverter } from './tools/TimeZoneConverter';
import { FlightPriceTracker } from './tools/FlightPriceTracker';
import { PackingListGenerator } from './tools/PackingListGenerator';
import { DistanceCalculator } from './tools/DistanceCalculator';
import { Plane, Clock, Currency, PackageCheck, Map, Menu, X } from 'lucide-react';
import { Button } from './ui/button'; 
import { ModeToggle } from './ModeToggle';
import { useTheme } from '@/hooks/use-theme';

export const Layout = () => {
  const [activeTab, setActiveTab] = useState("currency");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' 
    ? '/lovable-uploads/41a027d9-5eaa-45f2-b58b-308e20d618aa.png' 
    : '/lovable-uploads/7b9aaeb8-4854-4a23-9e54-eae208a20491.png';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const selectTab = (tabValue: string) => {
    setActiveTab(tabValue);
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-purple-50/20 dark:from-background dark:to-purple-950/10">
      <header className="border-b border-border/40 shadow-sm py-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <img src={logoSrc} alt="TourHelpline Logo" className="h-10 md:h-12" />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-border shadow-md">
          <div className="container mx-auto py-2 px-4">
            <div className="flex flex-col space-y-2">
              <button 
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium ${activeTab === 'currency' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => selectTab('currency')}
              >
                <Currency className="h-4 w-4" />
                <span>Currency Converter</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium ${activeTab === 'timezone' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => selectTab('timezone')}
              >
                <Clock className="h-4 w-4" />
                <span>Time Zone Converter</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium ${activeTab === 'flight' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => selectTab('flight')}
              >
                <Plane className="h-4 w-4" />
                <span>Flight Price Tracker</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium ${activeTab === 'packing' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => selectTab('packing')}
              >
                <PackageCheck className="h-4 w-4" />
                <span>Packing List Generator</span>
              </button>
              
              <button 
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium ${activeTab === 'distance' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => selectTab('distance')}
              >
                <Map className="h-4 w-4" />
                <span>Distance Calculator</span>
              </button>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-center mt-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="hidden md:block mb-8">
          <Tabs 
            defaultValue="currency" 
            className="w-full" 
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-5 bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                <TabsTrigger 
                  value="currency" 
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-sm text-sm py-2 flex gap-2 items-center"
                >
                  <Currency className="h-4 w-4" />
                  <span>Currency</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="timezone" 
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-sm text-sm py-2 flex gap-2 items-center"
                >
                  <Clock className="h-4 w-4" />
                  <span>Time Zone</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="flight" 
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-sm text-sm py-2 flex gap-2 items-center"
                >
                  <Plane className="h-4 w-4" />
                  <span>Flight Prices</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="packing" 
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-sm text-sm py-2 flex gap-2 items-center"
                >
                  <PackageCheck className="h-4 w-4" />
                  <span>Packing List</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="distance" 
                  className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200 data-[state=active]:shadow-sm text-sm py-2 flex gap-2 items-center"
                >
                  <Map className="h-4 w-4" />
                  <span>Distance</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-7">
          {activeTab === "currency" && <CurrencyConverter />}
          {activeTab === "timezone" && <TimeZoneConverter />}
          {activeTab === "flight" && <FlightPriceTracker />}
          {activeTab === "packing" && <PackingListGenerator />}
          {activeTab === "distance" && <DistanceCalculator />}
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white p-6 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src={logoSrc} alt="TourHelpline Logo" className="h-8" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} TourHelpline Tools | All data is for informational purposes only</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
