
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Mail, HelpCircle, Save, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ThemeToggle from './ThemeToggle';

interface EmailInputFormProps {
  onSubmit: (emailText: string) => void;
}

const EmailInputForm: React.FC<EmailInputFormProps> = ({ onSubmit }) => {
  const [emailText, setEmailText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { toast } = useToast();
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('savedEmail', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) return;
    
    setIsLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      onSubmit(emailText);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setFileError('Please upload a text file (.txt)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEmailText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const exampleEmail = `From: john@example.com
To: team@example.com
Subject: Project Status Update

Hi Team,

Just following up on our previous discussion about the Q3 deliverables.

We need to finalize the report by Friday and also prepare the presentation for the client meeting next week.

Jane, could you please send me the updated analytics?

Also, remember that we need to schedule the team offsite by end of month.

Thanks,
John

---

From: jane@example.com
To: team@example.com
Subject: Re: Project Status Update

I'll send the analytics by tomorrow. Also, I've already started working on the slides for the presentation.

Jane
`;

  const handleUseExample = () => {
    setEmailText(exampleEmail);
  };

  const handleSaveEmail = () => {
    if (!emailText.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please enter an email thread first",
        variant: "destructive",
      });
      return;
    }
    
    setSavedEmail(emailText);
    toast({
      title: "Email thread saved",
      description: "Your email thread has been saved locally",
    });
  };

  const handleLoadSavedEmail = () => {
    if (!savedEmail) {
      toast({
        title: "No saved email",
        description: "You haven't saved any email thread yet",
        variant: "destructive",
      });
      return;
    }
    
    setEmailText(savedEmail);
    toast({
      title: "Email thread loaded",
      description: "Your saved email thread has been loaded",
    });
  };

  const handleClearEmail = () => {
    if (!emailText.trim()) return;
    
    setEmailText('');
    toast({
      title: "Email thread cleared",
      description: "Your email thread has been cleared",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle>Email Thread Summarizer</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Paste your email thread or upload a text file. We'll analyze the conversation and extract the key points and action items.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>
          Paste your email thread or upload a text file to get a concise summary and action items
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <Textarea 
              placeholder="Paste your email thread here..." 
              className="min-h-[200px] font-mono text-sm"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <input
                  type="file"
                  accept=".txt"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleUseExample}
              >
                Use Example
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveEmail}
                title="Save email thread"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              
              {savedEmail && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadSavedEmail}
                  title="Load saved email thread"
                >
                  Load Saved
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClearEmail}
                title="Clear email thread"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            
            {fileError && (
              <p className="text-sm text-warning mt-1">{fileError}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!emailText.trim() || isLoading}
          >
            {isLoading ? "Processing..." : "Summarize Thread"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailInputForm;
