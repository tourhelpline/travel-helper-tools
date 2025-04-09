
import React from 'react';

interface LayoutProps {
  embedMode?: boolean;
  embedTool?: string | null;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, embedMode, embedTool }) => {
  // This is a basic layout component that renders its children
  return (
    <div className={`min-h-screen w-full ${embedMode ? 'pt-0' : 'pt-16'}`}>
      {children}
    </div>
  );
};

export default Layout;
