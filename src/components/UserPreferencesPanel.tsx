
import React from 'react';
import { Star, Clock, X, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreferences, UserPreference } from '@/hooks/use-preferences';
import { toast } from 'sonner';

const UserPreferencesPanel: React.FC = () => {
  const { 
    recentlyUsed, 
    favorites, 
    removePreference, 
    removeFromFavorites, 
    addToFavorites,
    clearAllPreferences
  } = usePreferences();

  const getIconForType = (type: UserPreference['type']) => {
    switch (type) {
      case 'tool':
        return '🧰';
      case 'destination':
        return '🌍';
      case 'currency':
        return '💱';
      default:
        return '📌';
    }
  };

  const handleFavoriteClick = (item: UserPreference) => {
    const isFavorite = favorites.some(f => f.id === item.id);
    if (isFavorite) {
      removeFromFavorites(item.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(item.id);
      toast.success('Added to favorites');
    }
  };

  const handleDeleteClick = (id: string) => {
    removePreference(id);
    toast.success('Item removed');
  };

  const handleClearAll = () => {
    clearAllPreferences();
    toast.success('All preferences cleared');
  };

  const renderPreferenceItem = (item: UserPreference, isFavoritesList = false) => {
    const isFavorite = favorites.some(f => f.id === item.id);
    
    return (
      <div 
        key={item.id} 
        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{item.icon || getIconForType(item.type)}</span>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFavoriteClick(item)}
            className="h-8 w-8"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(item.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Preferences</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
        <CardDescription>Your recent activities and favorites</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent" className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Star className="h-4 w-4" /> Favorites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-2">
            {recentlyUsed.length > 0 ? (
              <div className="space-y-1">
                {recentlyUsed.map(item => renderPreferenceItem(item))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No recent activity yet</p>
                <p className="text-sm">Your recent tools and searches will appear here</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="mt-2">
            {favorites.length > 0 ? (
              <div className="space-y-1">
                {favorites.map(item => renderPreferenceItem(item, true))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No favorites yet</p>
                <p className="text-sm">Add items to your favorites to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesPanel;
