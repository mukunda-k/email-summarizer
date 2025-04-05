import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, AlertCircle, Copy, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SummaryResultsProps {
  summary: string;
  originalEmail: string;
  onBack: () => void;
}

const SummaryResults: React.FC<SummaryResultsProps> = ({
  summary,
  originalEmail,
  onBack,
}) => {
  const { toast } = useToast();
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate loading time for the summary to be processed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  const parseSummary = (summaryText: string) => {
    const sections = {
      summary: '',
      actionItems: '',
      decisions: '',
      questions: ''
    };

    // Extract summary section
    const summaryMatch = summaryText.match(/📝 SUMMARY:\s*([\s\S]*?)(?=✅ ACTION ITEMS:|$)/);
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Extract action items section
    const actionItemsMatch = summaryText.match(/✅ ACTION ITEMS:\s*([\s\S]*?)(?=🔍 KEY DECISIONS:|$)/);
    if (actionItemsMatch) {
      sections.actionItems = actionItemsMatch[1].trim();
    }

    // Extract decisions section
    const decisionsMatch = summaryText.match(/🔍 KEY DECISIONS:\s*([\s\S]*?)(?=❓ OPEN QUESTIONS:|$)/);
    if (decisionsMatch) {
      sections.decisions = decisionsMatch[1].trim();
    }

    // Extract questions section
    const questionsMatch = summaryText.match(/❓ OPEN QUESTIONS:\s*([\s\S]*?)$/);
    if (questionsMatch) {
      sections.questions = questionsMatch[1].trim();
    }

    // If no sections were found, try to parse the text directly
    if (!sections.summary && !sections.actionItems && !sections.decisions && !sections.questions) {
      // Check if the text contains "Action Items", "Key Decisions", or "Open Questions"
      if (summaryText.includes("Action Items")) {
        const parts = summaryText.split("Action Items");
        if (parts.length > 1) {
          const actionItemsPart = parts[1].split("Key Decisions")[0].trim();
          sections.actionItems = actionItemsPart;
          
          if (parts[1].includes("Key Decisions")) {
            const decisionsPart = parts[1].split("Key Decisions")[1].split("Open Questions")[0].trim();
            sections.decisions = decisionsPart;
            
            if (parts[1].includes("Open Questions")) {
              const questionsPart = parts[1].split("Open Questions")[1].trim();
              sections.questions = questionsPart;
            }
          }
        }
      } else if (summaryText.includes("Key Decisions")) {
        const parts = summaryText.split("Key Decisions");
        if (parts.length > 1) {
          const decisionsPart = parts[1].split("Open Questions")[0].trim();
          sections.decisions = decisionsPart;
          
          if (parts[1].includes("Open Questions")) {
            const questionsPart = parts[1].split("Open Questions")[1].trim();
            sections.questions = questionsPart;
          }
        }
      } else if (summaryText.includes("Open Questions")) {
        const parts = summaryText.split("Open Questions");
        if (parts.length > 1) {
          sections.questions = parts[1].trim();
        }
      }
    }

    return sections;
  };

  const parsedSummary = parseSummary(summary);
  console.log("Parsed summary:", parsedSummary);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center p-8">
        <Card className="shadow-lg w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-medium mb-2 text-foreground">Processing your email thread</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We're analyzing your email thread to extract key points, action items, and decisions.
              This may take a moment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <CardTitle className="text-foreground">Summary Results</CardTitle>
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
              <h3 className="text-lg font-medium text-foreground">Summary</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(parsedSummary.summary, "Summary")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="summary-item animate-slide-in text-foreground">
              {parsedSummary.summary || "No summary available"}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-foreground">Action Items</h3>
                <Badge variant="outline" className="bg-action/10 text-xs">Priority</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(parsedSummary.actionItems, "Action items")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              {parsedSummary.actionItems ? (
                <ul className="space-y-1 list-disc list-inside">
                  {parsedSummary.actionItems.split('\n').map((item, index) => {
                    const cleaned = item.trim();
                    if (!cleaned || cleaned.toLowerCase() === 'copy') return null;

                    // Optional: Remove leading numbering like "1. -", "- ", or "•"
                    const formatted = cleaned.replace(/^\d+\.\s*-?\s*|^-?\s*|^•\s*/, '');

                    return (
                      <li key={index} className="text-foreground animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        {formatted}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-muted-foreground">No action items detected</div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Key Decisions</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(parsedSummary.decisions, "Decisions")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              {parsedSummary.decisions ? (
                <ul className="space-y-1 list-disc list-inside">
                  {parsedSummary.decisions.split('\n').map((decision, index) => {
                    const cleaned = decision.trim();
                    if (!cleaned || cleaned.toLowerCase() === 'copy') return null;

                    // Optional: Remove leading numbering like "1. -", "- ", or "•"
                    const formatted = cleaned.replace(/^\d+\.\s*-?\s*|^-?\s*|^•\s*/, '');

                    return (
                      <li key={index} className="text-foreground animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        {formatted}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-muted-foreground">No decisions detected</div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Open Questions</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => handleCopyToClipboard(parsedSummary.questions, "Questions")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="space-y-2">
              {parsedSummary.questions ? (
                <ul className="space-y-1 list-disc list-inside">
                  {parsedSummary.questions.split('\n').map((question, index) => {
                    const cleaned = question.trim();
                    if (!cleaned || cleaned.toLowerCase() === 'copy') return null;

                    // Optional: Remove leading numbering like "1. -", "- ", or "•"
                    const formatted = cleaned.replace(/^\d+\.\s*-?\s*|^-?\s*|^•\s*/, '');

                    return (
                      <li key={index} className="text-foreground animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        {formatted}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-muted-foreground">No open questions detected</div>
              )}
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
          <CardTitle className="text-base text-foreground">Original Email Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-md max-h-[250px] overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">{originalEmail}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryResults; 