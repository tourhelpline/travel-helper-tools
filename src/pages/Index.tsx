
import Layout from "@/components/Layout";

interface IndexProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

const Index = ({ embedMode = false, embedTool = null }: IndexProps) => {
  return <Layout embedMode={embedMode} embedTool={embedTool} />;
};

export default Index;
