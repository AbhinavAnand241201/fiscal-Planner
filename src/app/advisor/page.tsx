"use client";

import React, { useState, type FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lightbulb, DollarSign, Target, TrendingUp, Calendar } from "lucide-react";
import { provideFinancialAdvice, type FinancialAdviceInput, type FinancialAdviceOutput } from "@/ai/flows/provide-financial-advice";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/error-boundary";

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
        <CardDescription>The more details you provide, the better the advice.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="spendingPatterns" className="text-lg">Your Spending Patterns</Label>
            <Textarea
              id="spendingPatterns"
              value={formData.spendingPatterns}
              onChange={handleChange("spendingPatterns")}
              placeholder="Describe your typical monthly spending. E.g., 'I spend $500 on rent, $300 on groceries, $100 on dining out, $50 on subscriptions...'"
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
              placeholder="What are your financial goals? E.g., 'Save for a down payment on a house in 5 years, pay off student loans, build an emergency fund...'"
              rows={5}
              className="mt-1 text-base"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Plan...
              </>
            ) : (
              "Generate Financial Plan"
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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <Card className="shadow-md border-l-4 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{adviceResult.summary}</p>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Steps</TabsTrigger>
          <TabsTrigger value="investments">Investment Plan</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        {/* Spending Analysis Tab */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                Spending Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adviceResult.spendingAnalysis.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.category}</span>
                      <Badge variant={category.percentageChange > 0 ? "destructive" : "default"}>
                        {category.percentageChange > 0 ? "+" : ""}{category.percentageChange}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current: ${category.currentAmount}</p>
                        <Progress value={(category.currentAmount / category.recommendedAmount) * 100} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recommended: ${category.recommendedAmount}</p>
                        <Progress value={100} className="bg-green-100" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {adviceResult.spendingAnalysis.visualization}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Steps Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-500" />
                Action Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adviceResult.actionSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className={`w-2 rounded-full ${getPriorityColor(step.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Step {step.step}: {step.title}</h3>
                        <Badge variant="outline">{step.timeline}</Badge>
                      </div>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Plan Tab */}
        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                Investment Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Short-term Investments</h3>
                  <div className="space-y-2">
                    {adviceResult.investmentPlan.shortTerm.map((investment, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{investment.type}</span>
                          <span className="text-green-600">${investment.amount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{investment.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Long-term Investments</h3>
                  <div className="space-y-2">
                    {adviceResult.investmentPlan.longTerm.map((investment, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{investment.type}</span>
                          <span className="text-green-600">${investment.amount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{investment.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {adviceResult.investmentPlan.visualization}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-orange-500" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adviceResult.progressTracking.milestones.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{milestone.milestone}</span>
                      <span className="text-sm text-muted-foreground">{milestone.targetDate}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>${milestone.currentAmount}</span>
                        <span>${milestone.targetAmount}</span>
                      </div>
                      <Progress 
                        value={(milestone.currentAmount / milestone.targetAmount) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {adviceResult.progressTracking.visualization}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdvisorPage() {
  const [adviceResult, setAdviceResult] = useState<FinancialAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (input: FinancialAdviceInput) => {
    setIsLoading(true);
    setAdviceResult(null);

    try {
      const result = await provideFinancialAdvice(input);
      setAdviceResult(result);
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

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
          <p className="text-muted-foreground">Get your personalized financial plan with visual insights.</p>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <AdvisorForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Suspense>

        {adviceResult && (
          <Suspense fallback={<div>Loading financial plan...</div>}>
            <FinancialPlan adviceResult={adviceResult} />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}
