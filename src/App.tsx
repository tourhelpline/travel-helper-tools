
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [embedToolName, setEmbedToolName] = useState<string | null>(null);

  useEffect(() => {
    // Update the page title
    document.title = "TourHelpline Tools";
    
    // Update favicon - using the same logo for favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "/lovable-uploads/b645517e-cd80-41dd-9e86-c09cc933a1c3.png";
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = "/lovable-uploads/b645517e-cd80-41dd-9e86-c09cc933a1c3.png";
      document.head.appendChild(newLink);
    }
    
    // Check for embed mode in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const embedParam = urlParams.get('embed');
    const toolParam = urlParams.get('tool');
    
    if (embedParam === 'true') {
      setIsEmbedMode(true);
      if (toolParam) {
        setEmbedToolName(toolParam);
      }
    }
    
    // Fix the Google Maps API TypeScript issues by extending the Window interface
    // This makes TypeScript aware of the google object on the window
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDstR0CAhqB8EDENlx4KZ-fGoyg1g0DYzQ&libraries=places";
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    document.head.appendChild(googleMapsScript);
    
    return () => {
      // Clean up the script when component unmounts
      if (document.head.contains(googleMapsScript)) {
        document.head.removeChild(googleMapsScript);
      }
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" theme="light" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index embedMode={isEmbedMode} embedTool={embedToolName} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
