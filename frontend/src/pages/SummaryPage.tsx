import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SummaryData {
  summary: string;
  actionItems: string;
  decisions: string;
  questions: string;
}

const SummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    // Get the summary from location state
    const summaryText = location.state?.summaryText;
    
    if (!summaryText) {
      toast({
        title: "Error",
        description: "No summary data found. Please try again.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Parse the summary text into sections
    const parsedData = parseSummaryText(summaryText);
    setSummaryData(parsedData);
  }, [location.state, navigate, toast]);

  const parseSummaryText = (text: string): SummaryData => {
    const sections = {
      summary: '',
      actionItems: '',
      decisions: '',
      questions: ''
    };

    // Extract summary section
    const summaryMatch = text.match(/📝 SUMMARY:\s*([\s\S]*?)(?=✅ ACTION ITEMS:|$)/);
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Extract action items section
    const actionItemsMatch = text.match(/✅ ACTION ITEMS:\s*([\s\S]*?)(?=🔍 KEY DECISIONS:|$)/);
    if (actionItemsMatch) {
      sections.actionItems = actionItemsMatch[1].trim();
    }

    // Extract decisions section
    const decisionsMatch = text.match(/🔍 KEY DECISIONS:\s*([\s\S]*?)(?=❓ OPEN QUESTIONS:|$)/);
    if (decisionsMatch) {
      sections.decisions = decisionsMatch[1].trim();
    }

    // Extract questions section
    const questionsMatch = text.match(/❓ OPEN QUESTIONS:\s*([\s\S]*?)$/);
    if (questionsMatch) {
      sections.questions = questionsMatch[1].trim();
    }

    return sections;
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    
    toast({
      title: "Copied!",
      description: `${section} copied to clipboard`,
    });
    
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!summaryData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-foreground">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <div className="mb-6">
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Email Thread Summary</h1>

      <div className="grid gap-8">
        {/* Summary Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Summary</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(summaryData.summary, 'Summary')}
              className="flex items-center gap-1"
            >
              {copiedSection === 'Summary' ? <Check size={16} /> : <Copy size={16} />}
              {copiedSection === 'Summary' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="prose max-w-none text-foreground">
            {summaryData.summary || 'No summary available.'}
          </div>
        </div>

        {/* Action Items Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Action Items</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(summaryData.actionItems, 'Action Items')}
              className="flex items-center gap-1"
            >
              {copiedSection === 'Action Items' ? <Check size={16} /> : <Copy size={16} />}
              {copiedSection === 'Action Items' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="prose max-w-none whitespace-pre-line text-foreground">
            {summaryData.actionItems || 'No action items detected.'}
          </div>
        </div>

        {/* Decisions Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Key Decisions</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(summaryData.decisions, 'Decisions')}
              className="flex items-center gap-1"
            >
              {copiedSection === 'Decisions' ? <Check size={16} /> : <Copy size={16} />}
              {copiedSection === 'Decisions' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="prose max-w-none whitespace-pre-line text-foreground">
            {summaryData.decisions || 'No decisions detected.'}
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Open Questions</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(summaryData.questions, 'Questions')}
              className="flex items-center gap-1"
            >
              {copiedSection === 'Questions' ? <Check size={16} /> : <Copy size={16} />}
              {copiedSection === 'Questions' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="prose max-w-none whitespace-pre-line text-foreground">
            {summaryData.questions || 'No open questions detected.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage; 