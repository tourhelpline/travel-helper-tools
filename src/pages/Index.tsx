
import Layout from "@/components/Layout";

interface IndexProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

const Index = ({ embedMode = false, embedTool = null }: IndexProps) => {
  return (
    <div className="w-full h-full">
      <Layout embedMode={embedMode} embedTool={embedTool} />
    </div>
  );
};

export default Index;
