import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mail, HelpCircle, Save, Trash2, Loader2 } from 'lucide-react';
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
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();
  const [savedEmail, setSavedEmail] = useLocalStorage<string>('savedEmail', '');
  const navigate = useNavigate();

  // Check if the backend is available
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setIsBackendAvailable(true);
          console.log('Backend is available');
        } else {
          setIsBackendAvailable(false);
          console.error('Backend health check failed');
        }
      } catch (error) {
        setIsBackendAvailable(false);
        console.error('Backend is not available:', error);
      }
    };

    checkBackendHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailText.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email thread to summarize",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, pass the email text to the parent component
      onSubmit(emailText);
      
      // Make the API call
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_thread: emailText }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.summary) {
        // Navigate to the summary page with the summary data
        navigate('/summary', { state: { summaryText: data.summary } });
        
        toast({
          title: "Success",
          description: "Email thread processed successfully",
        });
      } else {
        throw new Error('No summary in response');
      }
    } catch (error) {
      console.error('Error processing email:', error);
      
      let errorMessage = 'Failed to process email thread';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Could not connect to the server. Please make sure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Try to parse the error response if it's a JSON
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        // If we can't parse the error as JSON, use the default error message
        console.error('Error parsing error response:', jsonError);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  <p>Paste your email thread to get a concise summary and action items.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CardDescription>
          Paste your email thread to get a concise summary and action items
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
              disabled={isLoading}
            />
            
            <div className="flex flex-wrap gap-2 items-center">
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
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!emailText.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Summarize Email Thread'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailInputForm;
