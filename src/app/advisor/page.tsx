"use client";

import React, { useState, type FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Lightbulb, DollarSign, CheckCircle, Info, MessageSquareQuote } from "lucide-react";
import { provideFinancialAdvice, type FinancialAdviceInput } from "@/ai/flows/provide-financial-advice";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AdvisorFormProps {
  onSubmit: (input: FinancialAdviceInput) => Promise<void>;
  isLoading: boolean;
}

function AdvisorForm({ onSubmit, isLoading }: AdvisorFormProps) {
  const [formData, setFormData] = useState<FinancialAdviceInput>({
    spendingPatterns: "",
    financialGoals: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.spendingPatterns.trim() || !formData.financialGoals.trim()) {
      return;
    }
    await onSubmit(formData);
  };

  const handleChange = (field: keyof FinancialAdviceInput) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="shadow-lg card-hover-animation">
      <CardHeader>
        <CardTitle>Tell Us About Yourself</CardTitle>
        <CardDescription>The more details you provide, the better the advice. Be specific with amounts and categories for spending, and clear about your goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="spendingPatterns" className="text-lg">Your Spending Patterns</Label>
            <Textarea
              id="spendingPatterns"
              value={formData.spendingPatterns}
              onChange={handleChange("spendingPatterns")}
              placeholder="E.g., 'Monthly spending: Rent $1200, Groceries $450, Transport $150, Dining Out $250, Subscriptions (Netflix, Spotify) $30, Gym $50. I also spend about $100 on hobbies.'"
              rows={5}
              className="mt-1 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="financialGoals" className="text-lg">Your Financial Goals</Label>
            <Textarea
              id="financialGoals"
              value={formData.financialGoals}
              onChange={handleChange("financialGoals")}
              placeholder="E.g., '1. Save $10,000 for a house down payment in 2 years. 2. Pay off $3,000 in credit card debt (18% APR) within 1 year. 3. Build a 3-month emergency fund ($6,000).'"
              rows={5}
              className="mt-1 text-base"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Advice...
              </>
            ) : (
              "Get Financial Advice"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface FinancialPlanProps {
  adviceResult: FinancialAdviceOutput;
}

function FinancialPlan({ adviceResult }: FinancialPlanProps) {
  const getPriorityColor = (priority: string): "default" | "destructive" | "secondary" => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{adviceResult.summary}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="spending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Steps</TabsTrigger>
          <TabsTrigger value="investment">Investment Plan</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle>Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adviceResult.spendingAnalysis.map(({ category, percentage, amount }, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        ${amount}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {percentage > 0 ? "Increase" : "Decrease"} by {Math.abs(percentage)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Action Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adviceResult.actionSteps.map(({ step, priority }, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <Badge variant={getPriorityColor(priority)} className="mt-1">
                      {priority}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{step}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>Investment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Short-term Investments</h3>
                  <div className="space-y-4">
                    {adviceResult.investmentPlan.map(({ type, allocation, risk, description }, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{type}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        <span className="font-medium">{allocation}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Long-term Investments</h3>
                  <div className="space-y-4">
                    {adviceResult.investmentPlan.map(({ type, allocation, risk, description }, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{type}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        <span className="font-medium">{allocation}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {adviceResult.progressTracking.map(({ milestone, targetDate, status, progress }, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{milestone}</span>
                      <span className="text-muted-foreground">
                        Target: {targetDate}
                      </span>
                    </div>
                    <Progress 
                      value={(progress / 100) * 100} 
                      className="h-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Current: {progress}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FinancialAdviceOutput {
  advice: string;
  investmentSuggestions: string;
  budgetingTips: string;
  summary: string;
  spendingAnalysis: Array<{
    category: string;
    percentage: number;
    amount: number;
  }>;
  actionSteps: Array<{
    step: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  investmentPlan: Array<{
    type: string;
    allocation: number;
    risk: 'low' | 'medium' | 'high';
    description: string;
  }>;
  progressTracking: Array<{
    milestone: string;
    targetDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    progress: number;
  }>;
}

export default function AdvisorPage() {
  const [adviceResult, setAdviceResult] = useState<FinancialAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FinancialAdviceInput>({
    spendingPatterns: '',
    financialGoals: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAdviceResult(null);

    try {
      const result = await provideFinancialAdvice(formData);
      setAdviceResult({
        ...result,
        summary: result.advice.split('\n')[0], // Use first line of advice as summary
        spendingAnalysis: [], // These will be populated by the AI
        actionSteps: [],
        investmentPlan: [],
        progressTracking: []
      });
      toast({
        title: "Advice Generated!",
        description: "Your personalized financial plan is ready.",
      });
    } catch (error) {
      console.error("Error getting financial advice:", error);
      toast({
        title: "Error",
        description: "Failed to generate financial advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FinancialAdviceInput) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <ErrorBoundary>
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
          <p className="text-muted-foreground">Get personalized financial advice powered by AI. Break down complex goals into simple steps.</p>
      </header>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
            <CardDescription>The more details you provide, the better the advice. Be specific with amounts and categories for spending, and clear about your goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
            <div>
                  <Label htmlFor="spending-patterns">Your Spending Patterns</Label>
                  <textarea
                    id="spending-patterns"
                    value={formData.spendingPatterns}
                    onChange={handleChange("spendingPatterns")}
                    placeholder="E.g., 'Monthly spending: Rent $1200, Groceries $450, Transport $150, Dining Out $250, Subscriptions (Netflix, Spotify) $30, Gym $50. I also spend about $100 on hobbies.'"
                rows={5}
                className="mt-1 text-base"
              />
            </div>
            <div>
                  <Label htmlFor="financial-goals">Your Financial Goals</Label>
                  <textarea
                    id="financial-goals"
                    value={formData.financialGoals}
                    onChange={handleChange("financialGoals")}
                    placeholder="E.g., '1. Save $10,000 for a house down payment in 2 years. 2. Pay off $3,000 in credit card debt (18% APR) within 1 year. 3. Build a 3-month emergency fund ($6,000).'"
                rows={5}
                className="mt-1 text-base"
              />
            </div>
              </div>
              <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Advice...
                </>
              ) : (
                "Get Financial Advice"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {adviceResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{adviceResult.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{adviceResult.advice}</p>
            </CardContent>
          </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{adviceResult.investmentSuggestions}</p>
            </CardContent>
          </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budgeting Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{adviceResult.budgetingTips}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}
