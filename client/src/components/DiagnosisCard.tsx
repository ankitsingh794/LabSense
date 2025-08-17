// In src/components/DiagnosisCard.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

// Define a type for the AI response for better code safety
type AiResponseType = {
  possible_conditions: {
    name: string;
    likelihood: number;
    reasoning: string;
  }[];
  recommendations: string[];
  severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
};

const getSeverityProps = (level: AiResponseType['severity_level']) => {
  switch (level) {
    case 'Low':
      return { variant: 'default' as const, Icon: CheckCircle, className: 'bg-green-500' };
    case 'Medium':
      return { variant: 'default' as const, Icon: Lightbulb, className: 'bg-yellow-500' };
    case 'High':
    case 'Critical':
      return { variant: 'destructive' as const, Icon: AlertTriangle, className: '' };
    default:
      return { variant: 'secondary' as const, Icon: Lightbulb, className: '' };
  }
};

export const DiagnosisCard = ({ aiResponse }: { aiResponse: AiResponseType }) => {
  const severity = getSeverityProps(aiResponse.severity_level);
  
  return (
    <Card className="border-primary/20 shadow-soft">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>Based on your symptoms and lab data.</CardDescription>
            </div>
            <Badge variant={severity.variant} className={severity.className}>
                <severity.Icon className="h-4 w-4 mr-2" />
                {aiResponse.severity_level} Severity
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Possible Conditions</h3>
          <div className="space-y-4">
            {aiResponse.possible_conditions.map((condition) => (
              <div key={condition.name} className="p-3 bg-accent/50 rounded-lg">
                <p className="font-medium">{condition.name} <span className="text-muted-foreground">({(condition.likelihood * 100).toFixed(0)}% likelihood)</span></p>
                <p className="text-sm text-muted-foreground mt-1">{condition.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            {aiResponse.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};