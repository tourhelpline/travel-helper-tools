
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookieConsent');
    if (hasConsent === null) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-medium mb-2">Cookie Consent</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We use cookies to enhance your experience on our website, including Google Analytics to analyze traffic. 
              By clicking "Accept," you consent to our use of cookies for analytics purposes. You can decline if you prefer.
              <a 
                href="https://tourhelpline.com/privacy-policy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 ml-1 underline"
              >
                Learn more about our Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="whitespace-nowrap"
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="whitespace-nowrap bg-purple-600 hover:bg-purple-700"
            >
              Accept
            </Button>
            <button 
              onClick={handleDecline} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
