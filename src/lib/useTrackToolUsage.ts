
import { usePreferences } from "@/hooks/use-preferences";

interface UseTrackToolUsageOptions {
  toolName: string;
  toolIcon?: string;
}

export const useTrackToolUsage = ({ toolName, toolIcon }: UseTrackToolUsageOptions) => {
  const { addPreference } = usePreferences();
  
  const trackUsage = () => {
    addPreference({
      name: toolName,
      type: 'tool',
      value: toolName.toLowerCase().replace(/\s+/g, '-'),
      icon: toolIcon,
    });
  };
  
  return { trackUsage };
};

export const useTrackDestination = (destination: string) => {
  const { addPreference } = usePreferences();
  
  const trackDestination = () => {
    if (destination.trim()) {
      addPreference({
        name: destination,
        type: 'destination',
        value: destination,
      });
    }
  };
  
  return { trackDestination };
};

export const useTrackCurrency = (from: string, to: string) => {
  const { addPreference } = usePreferences();
  
  const trackCurrency = () => {
    if (from && to) {
      addPreference({
        name: `${from} to ${to}`,
        type: 'currency',
        value: `${from}-${to}`,
      });
    }
  };
  
  return { trackCurrency };
};
