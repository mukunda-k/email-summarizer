import React, { useState } from 'react';
import EmailInputForm from '@/components/EmailInputForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const Index: React.FC = () => {
  const [emailText, setEmailText] = useState('');

  const handleSubmit = (text: string) => {
    setEmailText(text);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">Email Thread Summarizer</CardTitle>
            <CardDescription className="text-lg mt-2">
              Paste your email thread below and get an AI-powered summary with action items, key decisions, and open questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailInputForm onSubmit={handleSubmit} />
          </CardContent>
          <CardFooter className="flex flex-col items-center text-sm text-muted-foreground">
            <p>Your email content is processed locally and not stored.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
