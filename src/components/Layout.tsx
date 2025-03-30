
import React, { useState } from 'react';
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { ModeToggle } from './ModeToggle';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { TimeZoneConverter } from './tools/TimeZoneConverter';
import { PackingListGenerator } from './tools/PackingListGenerator';
import { DistanceCalculator } from './tools/DistanceCalculator';
import { Clock, Currency, PackageCheck, Map, ExternalLink } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export const Layout = () => {
  const [activeTool, setActiveTool] = useState<string>("currency");
  const { theme } = useTheme();
  
  const darkLogo = '/lovable-uploads/41a027d9-5eaa-45f2-b58b-308e20d618aa.png';
  const lightLogo = '/lovable-uploads/7b9aaeb8-4854-4a23-9e54-eae208a20491.png';
  const newLogo = '/lovable-uploads/31a8e04d-2cc6-42d4-a914-82f3de9b11b8.png';
  
  // Use the new logo for dark mode and the light logo for light mode
  const logoSrc = theme === 'dark' ? newLogo : lightLogo;
  
  const toolDescriptions = {
    currency: "Easily convert between global currencies with real-time exchange rates. Perfect for travelers planning their budget or making international purchases.",
    timezone: "Check the time difference between cities worldwide. Essential for scheduling calls, meetings, or activities across different time zones during your travels.",
    packing: "Get customized packing suggestions based on your destination's climate and trip duration. Never forget essential items for your journey again.",
    distance: "Calculate travel distances, time, and routes between locations worldwide using Google Maps data. Plan your trips with accurate travel information."
  };
  
  const footerLinks = [
    { title: "About Us", url: "https://tourhelpline.com/about-us/" },
    { title: "Contact Us", url: "https://tourhelpline.com/contact-us/" },
    { title: "Disclaimer", url: "https://tourhelpline.com/disclaimer/" },
    { title: "Privacy Policy", url: "https://tourhelpline.com/privacy-policy/" },
    { title: "Affiliate Disclosure", url: "https://tourhelpline.com/affiliate-disclosure/" },
    { title: "Terms & Conditions", url: "https://tourhelpline.com/terms-and-conditions/" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-purple-50/20 dark:from-background dark:to-purple-950/10">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex-1">
              <img src={logoSrc} alt="TourHelpline Logo" className="h-10" />
            </div>
            <ModeToggle />
          </SidebarHeader>
          
          <SidebarContent>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
                Travel Tools
              </h2>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTool === "currency"} 
                    tooltip="Currency Converter"
                    onClick={() => setActiveTool("currency")}
                  >
                    <Currency className="mr-2 h-4 w-4" />
                    <span>Currency Converter</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTool === "timezone"} 
                    tooltip="Time Zone Converter"
                    onClick={() => setActiveTool("timezone")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Time Zone Converter</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTool === "packing"} 
                    tooltip="Packing List Generator"
                    onClick={() => setActiveTool("packing")}
                  >
                    <PackageCheck className="mr-2 h-4 w-4" />
                    <span>Packing List Generator</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTool === "distance"} 
                    tooltip="Distance Calculator"
                    onClick={() => setActiveTool("distance")}
                  >
                    <Map className="mr-2 h-4 w-4" />
                    <span>Distance Calculator</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
            
            <SidebarSeparator />
            
            <div className="px-3 py-4">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start gap-2 text-tour-purple border-tour-purple hover:bg-tour-light dark:hover:bg-gray-800"
                onClick={() => window.open("https://tourhelpline.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Back to Main Website</span>
              </Button>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="px-3 py-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} TourHelpline</p>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
          <main className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-tour-purple to-primary bg-clip-text text-transparent">
                {activeTool === "currency" && "Currency Converter"}
                {activeTool === "timezone" && "Time Zone Converter"}
                {activeTool === "packing" && "Packing List Generator"}
                {activeTool === "distance" && "Distance Calculator"}
              </h1>
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-5 md:p-7">
              {activeTool === "currency" && <CurrencyConverter />}
              {activeTool === "timezone" && <TimeZoneConverter />}
              {activeTool === "packing" && <PackingListGenerator />}
              {activeTool === "distance" && <DistanceCalculator />}
            </div>
            
            <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-medium mb-2">About this tool</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTool === "currency" && toolDescriptions.currency}
                {activeTool === "timezone" && toolDescriptions.timezone}
                {activeTool === "packing" && toolDescriptions.packing}
                {activeTool === "distance" && toolDescriptions.distance}
              </p>
            </div>
          </main>
          
          <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {footerLinks.map((link) => (
                  <a 
                    key={link.url} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary text-sm text-center md:text-left transition-colors"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
              
              <div className="text-center text-xs text-gray-400 pb-4">
                <p>© {new Date().getFullYear()} TourHelpline Tools | All data is for informational purposes only</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
