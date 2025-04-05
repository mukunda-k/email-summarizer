
import React, { useState } from 'react';
import EmailInputForm from '@/components/EmailInputForm';
import SummaryResults from '@/components/SummaryResults';
import InfoCard from '@/components/InfoCard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [emailText, setEmailText] = useState('');
  const [summaryData, setSummaryData] = useState<{
    summaryPoints: string[];
    actionItems: string[];
  }>({
    summaryPoints: [],
    actionItems: [],
  });
  const { toast } = useToast();

  const handleSubmit = (text: string) => {
    setEmailText(text);
    
    // In a real application, this would be an API call to a backend service
    // For demonstration, we'll simulate the processing with example data
    
    // Mock summary points
    const mockSummaryPoints = [
      "Team needs to finalize the Q3 report by Friday",
      "Client meeting presentation needs to be prepared for next week",
      "Jane is working on the presentation slides",
      "Jane will send updated analytics by tomorrow",
    ];
    
    // Mock action items
    const mockActionItems = [
      "Jane to send updated analytics by tomorrow",
      "Team to finalize Q3 report by Friday",
      "Prepare presentation for client meeting next week",
      "Schedule team offsite by end of month",
    ];
    
    setSummaryData({
      summaryPoints: mockSummaryPoints,
      actionItems: mockActionItems,
    });
    
    toast({
      title: "Email thread processed!",
      description: "Your summary is ready to view",
      duration: 3000,
    });
    
    setStep('results');
  };

  const handleBack = () => {
    setStep('input');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-secondary/20 p-4 sm:p-6">
      <header className="w-full max-w-3xl mx-auto text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Email Thread Summarizer</h1>
        <p className="text-gray-500 mt-2">Transform messy email threads into clear summaries and action items</p>
      </header>
      
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full">
          {step === 'input' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <EmailInputForm onSubmit={handleSubmit} />
              </div>
              <div className="hidden lg:block">
                <InfoCard />
              </div>
            </div>
          ) : (
            <SummaryResults 
              summaryPoints={summaryData.summaryPoints}
              actionItems={summaryData.actionItems}
              originalEmail={emailText}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
      
      <footer className="w-full max-w-3xl mx-auto mt-12 text-center text-sm text-gray-500">
        <p>Email Thread Summarizer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
