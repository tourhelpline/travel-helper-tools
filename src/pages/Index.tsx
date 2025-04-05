
import LayoutWithPreferences from "@/components/LayoutWithPreferences";

interface IndexProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

const Index = ({ embedMode = false, embedTool = null }: IndexProps) => {
  return (
    <div className="w-full h-full">
      <LayoutWithPreferences embedMode={embedMode} embedTool={embedTool} />
    </div>
  );
};

export default Index;
