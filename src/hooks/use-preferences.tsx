
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserPreference {
  id: string;
  name: string;
  type: 'tool' | 'destination' | 'currency';
  value: string;
  icon?: string;
  timestamp: number;
}

interface UserPreferencesContextType {
  preferences: UserPreference[];
  recentlyUsed: UserPreference[];
  favorites: UserPreference[];
  addPreference: (preference: Omit<UserPreference, 'id' | 'timestamp'>) => void;
  addToFavorites: (preferenceId: string) => void;
  removeFromFavorites: (preferenceId: string) => void;
  removePreference: (preferenceId: string) => void;
  clearAllPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedFavorites = localStorage.getItem('userFavorites');
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse saved preferences', error);
        localStorage.removeItem('userPreferences');
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse saved favorites', error);
        localStorage.removeItem('userFavorites');
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a new preference
  const addPreference = (preference: Omit<UserPreference, 'id' | 'timestamp'>) => {
    const newPreference: UserPreference = {
      ...preference,
      id: `${preference.type}-${preference.value}-${Date.now()}`,
      timestamp: Date.now(),
    };

    // If same type and value exists, update its timestamp instead of adding a new one
    setPreferences(prev => {
      const existingIndex = prev.findIndex(p => 
        p.type === preference.type && p.value === preference.value
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          timestamp: Date.now(),
        };
        return updated;
      }
      
      return [...prev, newPreference];
    });
  };

  // Add a preference to favorites
  const addToFavorites = (preferenceId: string) => {
    if (!favorites.includes(preferenceId)) {
      setFavorites(prev => [...prev, preferenceId]);
    }
  };

  // Remove a preference from favorites
  const removeFromFavorites = (preferenceId: string) => {
    setFavorites(prev => prev.filter(id => id !== preferenceId));
  };

  // Remove a preference completely
  const removePreference = (preferenceId: string) => {
    setPreferences(prev => prev.filter(p => p.id !== preferenceId));
    removeFromFavorites(preferenceId);
  };

  // Clear all preferences and favorites
  const clearAllPreferences = () => {
    setPreferences([]);
    setFavorites([]);
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('userFavorites');
  };

  // Get recently used items (last 7 days, max 5 items)
  const recentlyUsed = preferences
    .filter(p => p.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Get favorite items
  const favoriteItems = preferences.filter(p => favorites.includes(p.id));

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      recentlyUsed,
      favorites: favoriteItems,
      addPreference,
      addToFavorites,
      removeFromFavorites,
      removePreference,
      clearAllPreferences,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
