import React, { useState, useEffect } from 'react';
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
import { TimeZoneConverter } from './tools/TimeZoneConverter';
import { PackingListGenerator } from './tools/PackingListGenerator';
import { DistanceCalculator } from './tools/DistanceCalculator';
import { EmbedCodeButton } from './EmbedCodeButton';
import { Clock, PackageCheck, Map, ExternalLink, Home } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './ui/button';

interface LayoutProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

export const Layout = ({ embedMode = false, embedTool = null }: LayoutProps) => {
  const [activeTool, setActiveTool] = useState<string>("timezone");
  const { theme } = useTheme();
  
  useEffect(() => {
    if (embedMode && embedTool) {
      if (embedTool.toLowerCase().includes('time') || embedTool.toLowerCase().includes('zone')) {
        setActiveTool("timezone");
      } else if (embedTool.toLowerCase().includes('pack')) {
        setActiveTool("packing");
      } else if (embedTool.toLowerCase().includes('distance') || embedTool.toLowerCase().includes('map')) {
        setActiveTool("distance");
      }
    }
  }, [embedMode, embedTool]);
  
  const logoPath = '/lovable-uploads/b645517e-cd80-41dd-9e86-c09cc933a1c3.png';
  
  const toolDescriptions = {
    timezone: "The Time Zone Converter is an essential travel tool designed to help travelers navigate the complexities of global time differences with precision and ease. This intuitive tool allows users to compare local times across multiple international destinations simultaneously, making it invaluable for planning international trips, scheduling calls with overseas contacts, or simply staying connected with friends and family abroad. With support for all major time zones around the world, from GMT to specific city-based time zones like Tokyo (JST) or New York (EST), the converter accounts for daylight saving time changes automatically, ensuring accuracy year-round. The user-friendly interface presents time differences in a clear, visual format, highlighting the hours ahead or behind between locations. For business travelers, this tool proves indispensable when coordinating meetings across multiple time zones, helping to avoid scheduling conflicts and confusion. Additionally, the tool provides information about business hours, helping travelers understand when offices, banks, and government services are likely to be open in their destination. Whether planning a multi-city itinerary, arranging international communications, or simply wanting to know the best time to call home while traveling, this comprehensive time zone calculator eliminates the guesswork from international time calculations, ensuring travelers stay punctual and connected regardless of their global location.",
    packing: "The Packing List Generator is a sophisticated travel planning tool designed to eliminate the stress and uncertainty from pre-trip preparation. This intelligent system creates comprehensive, personalized packing lists tailored to a traveler's specific journey parameters. By analyzing destination weather conditions through real-time meteorological data, trip duration, travel purpose, and traveler demographics (including options for solo male/female travelers, couples, or families with children), the generator produces highly relevant packing recommendations. The tool's smart algorithms consider seasonal variations and specific climate zones—from tropical beaches to alpine mountains—ensuring travelers are prepared for the actual conditions they'll encounter rather than relying on generic advice. For business travelers, it includes essential work-related items, while adventure tourists receive suggestions for specialized gear. The generator features categorized sections covering clothing, toiletries, medications, electronics, travel documents, and destination-specific necessities, with each item thoughtfully selected based on practical travel experience. Users can further customize their lists by adding personal items or removing suggested ones, creating a truly bespoke planning resource. The list can be saved for future reference, printed for convenient packing, or shared with travel companions to coordinate group packing efforts. By considering factors like airline baggage restrictions, local cultural norms regarding attire, and destination-specific requirements (such as modest clothing for religious sites), this comprehensive tool helps travelers pack efficiently without overpacking or forgetting crucial items. Whether preparing for a weekend business trip, a family vacation, or an extended international journey, the Packing List Generator transforms the often overwhelming packing process into a streamlined, confidence-building part of travel preparation.",
    distance: "The Distance Calculator is a sophisticated geospatial tool designed specifically for travel planning, offering precise measurements between global locations using advanced Google Maps integration. This comprehensive utility goes beyond simple point-to-point distance calculations by providing multi-faceted journey insights essential for effective trip planning. Users can input any global destination—from major cities to remote locations—and instantly receive accurate distance measurements displayed in both metric and imperial units for universal accessibility. What distinguishes this calculator is its ability to compute distances across different transportation modes, including driving, walking, cycling, and public transit, providing realistic travel time estimates that account for route-specific factors like traffic patterns, road conditions, elevation changes, and transportation infrastructure quality. For road trips, the tool offers detailed routing options with alternative paths, highlighting scenic routes, toll-free options, or fastest connections depending on user preference. The interactive map interface allows for visual route exploration, waypoint additions for multi-stop journeys, and real-time adjustments to optimize travel itineraries. Particularly valuable for international travelers, the calculator helps in managing transportation budgets by estimating fuel costs based on distance, vehicle efficiency, and local fuel prices, while also calculating carbon emissions for environmentally-conscious travelers seeking to offset their journey's environmental impact. Whether planning complex multi-city itineraries, organizing day trips from a vacation base, calculating business travel reimbursements, or simply satisfying curiosity about global distances, this powerful tool transforms abstract geographic information into practical travel intelligence, enabling more informed decision-making throughout the journey planning process."
  };
  
  const footerLinks = [
    { title: "About Us", url: "https://tourhelpline.com/about-us/" },
    { title: "Contact Us", url: "https://tourhelpline.com/contact-us/" },
    { title: "Disclaimer", url: "https://tourhelpline.com/disclaimer/" },
    { title: "Privacy Policy", url: "https://tourhelpline.com/privacy-policy/" },
    { title: "Affiliate Disclosure", url: "https://tourhelpline.com/affiliate-disclosure/" },
    { title: "Terms & Conditions", url: "https://tourhelpline.com/terms-and-conditions/" },
  ];

  if (embedMode) {
    return (
      <div className="w-full bg-gradient-to-b from-background to-purple-50/20 dark:from-background dark:to-purple-950/10 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-5 backdrop-blur-sm dark:backdrop-blur-sm dark:bg-opacity-30">
          {activeTool === "timezone" && <TimeZoneConverter />}
          {activeTool === "packing" && <PackingListGenerator />}
          {activeTool === "distance" && <DistanceCalculator />}
        </div>
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Powered by <a href="https://tourhelpline.com" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600">TourHelpline</a></p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-purple-50/20 dark:from-background dark:to-purple-950/10">
        <Sidebar variant="floating" className="border-r border-gray-200 dark:border-gray-800">
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex-1">
              <img src={logoPath} alt="TourHelpline Logo" className="h-10" />
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
                    isActive={activeTool === "timezone"} 
                    tooltip="Time Zone Converter"
                    onClick={() => setActiveTool("timezone")}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
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
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
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
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                  >
                    <Map className="mr-2 h-4 w-4" />
                    <span>Distance Calculator</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
            
            <SidebarSeparator />
            
            <div className="px-3 py-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Back to Main Website"
                  onClick={() => window.open("https://tourhelpline.com", "_blank")}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>Main Website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="px-3 py-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} TourHelpline</p>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
          <main className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5e17eb] to-purple-500 bg-clip-text text-transparent">
                {activeTool === "timezone" && "Time Zone Converter"}
                {activeTool === "packing" && "Packing List Generator"}
                {activeTool === "distance" && "Distance Calculator"}
              </h1>
              <div className="flex items-center gap-3">
                <EmbedCodeButton toolName={
                  activeTool === "timezone" ? "Time Zone Converter" :
                  activeTool === "packing" ? "Packing List Generator" :
                  "Distance Calculator"
                } />
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-5 md:p-7 backdrop-blur-sm dark:backdrop-blur-sm dark:bg-opacity-30">
              {activeTool === "timezone" && <TimeZoneConverter />}
              {activeTool === "packing" && <PackingListGenerator />}
              {activeTool === "distance" && <DistanceCalculator />}
            </div>
            
            <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">About this tool</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
                    className="text-gray-500 hover:text-[#5e17eb] text-sm text-center md:text-left transition-colors"
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
