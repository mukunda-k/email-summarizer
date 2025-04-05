
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, AlertCircle, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SummaryResultsProps {
  summaryPoints: string[];
  actionItems: string[];
  originalEmail: string;
  onBack: () => void;
}

const SummaryResults: React.FC<SummaryResultsProps> = ({
  summaryPoints,
  actionItems,
  originalEmail,
  onBack,
}) => {
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
      description: "You can now paste it elsewhere",
      duration: 3000,
    });
  };
  
  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: "Thank you for your feedback!",
      description: isPositive 
        ? "We're glad the summary was helpful." 
        : "We'll use this to improve our summaries.",
      duration: 3000,
    });
    setFeedbackGiven(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <CardTitle>Summary Results</CardTitle>
            </div>
            <Badge variant="outline" className="gap-1">
              <span className="bg-primary/20 w-2 h-2 rounded-full"></span> AI Generated
            </Badge>
          </div>
          <CardDescription>
            We've analyzed your email thread and extracted the key points and action items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Key Points</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(summaryPoints.join("\n"), "Key points")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              {summaryPoints.map((point, index) => (
                <div key={index} className="summary-item animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {point}
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Action Items</h3>
                <Badge variant="outline" className="bg-action/10 text-xs">Priority</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(actionItems.join("\n"), "Action items")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div key={index} className="action-item animate-slide-in" style={{ animationDelay: `${(index + summaryPoints.length) * 0.1}s` }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Input
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Was this summary helpful?</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => handleFeedback(true)}
              disabled={feedbackGiven}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => handleFeedback(false)}
              disabled={feedbackGiven}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Original Email Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-md max-h-[250px] overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap">{originalEmail}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryResults;
