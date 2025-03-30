
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Info, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { isValidOpenAIKey, storeOpenAIKey, getOpenAIKey } from '@/lib/api';

interface OpenAIKeyInputProps {
  onKeyChange?: (key: string | null) => void;
}

export const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const key = getOpenAIKey();
    if (key) {
      setSavedKey(key);
      setIsValid(true);
      if (onKeyChange) onKeyChange(key);
    }
  }, [onKeyChange]);

  const handleSave = () => {
    if (isValidOpenAIKey(apiKey)) {
      storeOpenAIKey(apiKey);
      setSavedKey(apiKey);
      setIsValid(true);
      setShowInput(false);
      if (onKeyChange) onKeyChange(apiKey);
    } else {
      setIsValid(false);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('openai-api-key');
    setSavedKey(null);
    setApiKey('');
    setIsValid(null);
    if (onKeyChange) onKeyChange(null);
  };

  if (!showInput && !savedKey) {
    return (
      <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50 mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Add your OpenAI API key for enhanced results</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowInput(true)}
          className="text-xs"
        >
          <Key className="h-3 w-3 mr-1" />
          Add API Key
        </Button>
      </div>
    );
  }

  if (savedKey && !showInput) {
    return (
      <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">OpenAI API key is set</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowInput(true)}
            className="text-xs"
          >
            Change
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemove}
            className="text-xs"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      <Alert>
        <AlertTitle className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          OpenAI API Key
        </AlertTitle>
        <AlertDescription>
          Enter your OpenAI API key to enhance results. Your key is stored locally and never sent to our servers.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setIsValid(null);
          }}
          className={`font-mono ${isValid === false ? "border-red-500" : ""}`}
        />
        <Button onClick={handleSave}>Save</Button>
        <Button variant="ghost" onClick={() => {
          setShowInput(false);
          setIsValid(null);
          setApiKey(savedKey || '');
        }}>
          Cancel
        </Button>
      </div>
      
      {isValid === false && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Invalid API key format. It should start with "sk-" followed by characters.
        </div>
      )}
    </div>
  );
};
