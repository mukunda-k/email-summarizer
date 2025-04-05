
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckSquare, ArrowRight } from 'lucide-react';

interface InfoCardProps {
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ className }) => {
  return (
    <Card className={`shadow-md bg-secondary/30 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Paste Email Thread</h3>
              <p className="text-xs text-muted-foreground">Copy and paste your email thread or upload a text file</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Get Instant Summary</h3>
              <p className="text-xs text-muted-foreground">AI extracts key points and action items from your conversation</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
