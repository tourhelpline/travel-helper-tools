
import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EmbedCodeButtonProps {
  toolName: string;
}

export const EmbedCodeButton = ({ toolName }: EmbedCodeButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate embed code based on the current tool
  const getEmbedCode = () => {
    // Base URL of the application
    const baseUrl = window.location.origin;
    
    // Create an iframe embed code that loads only the specific tool
    return `<iframe 
  src="${baseUrl}?embed=true&tool=${encodeURIComponent(toolName)}" 
  width="100%" 
  height="600px" 
  style="border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" 
  title="TourHelpline ${toolName}"
></iframe>`;
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="h-4 w-4" />
          <span>Embed</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed {toolName}</DialogTitle>
          <DialogDescription>
            Copy this code to embed the {toolName} on your website.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea 
            className="font-mono text-xs h-40" 
            readOnly 
            value={getEmbedCode()}
          />
          <Button
            onClick={handleCopyToClipboard}
            className="w-full flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedCodeButton;
