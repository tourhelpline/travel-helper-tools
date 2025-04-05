
import React, { useState } from 'react';
import { User, Settings, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePreferences } from '@/hooks/use-preferences';
import UserPreferencesPanel from './UserPreferencesPanel';

const UserPreferencesToolbar: React.FC = () => {
  const { recentlyUsed, favorites } = usePreferences();
  const [open, setOpen] = useState(false);

  const hasPreferences = recentlyUsed.length > 0 || favorites.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
          >
            <User className="h-4 w-4" />
            {hasPreferences && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-600" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <UserPreferencesPanel />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserPreferencesToolbar;
