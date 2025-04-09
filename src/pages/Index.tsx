
import LayoutWithPreferences from "@/components/LayoutWithPreferences";

interface IndexProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

const Index = ({ embedMode = false, embedTool = null }: IndexProps) => {
  return (
    <div className="w-full h-full">
      <LayoutWithPreferences embedMode={embedMode} embedTool={embedTool}>
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold gradient-heading mb-6">TourHelpline Tools</h1>
          <p className="text-lg mb-8">Welcome to our essential travel tools for planning and organizing your trips.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for tool cards */}
            <div className="card-container">
              <h2 className="text-xl font-semibold mb-2">Currency Converter</h2>
              <p>Convert between different currencies with real-time exchange rates.</p>
            </div>
            <div className="card-container">
              <h2 className="text-xl font-semibold mb-2">Distance Calculator</h2>
              <p>Calculate distances between destinations for your trip planning.</p>
            </div>
            <div className="card-container">
              <h2 className="text-xl font-semibold mb-2">Packing List</h2>
              <p>Generate customized packing lists for your travels.</p>
            </div>
          </div>
        </div>
      </LayoutWithPreferences>
    </div>
  );
};

export default Index;
