
import React from 'react';
import Layout from './Layout';
import UserPreferencesToolbar from './UserPreferencesToolbar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LayoutWithPreferencesProps {
  embedMode?: boolean;
  embedTool?: string | null;
}

const LayoutWithPreferences: React.FC<LayoutWithPreferencesProps> = ({ embedMode, embedTool }) => {
  // We'll pass the UserPreferencesToolbar to the Layout component through its children prop
  // This assumes the Layout component renders its children
  return (
    <Layout embedMode={embedMode} embedTool={embedTool}>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <UserPreferencesToolbar />
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/b645517e-cd80-41dd-9e86-c09cc933a1c3.png" alt="TourHelpline" />
          <AvatarFallback>TH</AvatarFallback>
        </Avatar>
      </div>
    </Layout>
  );
};

export default LayoutWithPreferences;
