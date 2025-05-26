"use client";

import React, { useState, type FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
<<<<<<< HEAD
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Lightbulb, DollarSign, CheckCircle, Info, MessageSquareQuote } from "lucide-react";
=======
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lightbulb, DollarSign, Target, TrendingUp, Calendar } from "lucide-react";
>>>>>>> origin/master
import { provideFinancialAdvice, type FinancialAdviceInput, type FinancialAdviceOutput } from "@/ai/flows/provide-financial-advice";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/error-boundary";

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
                {adviceResult.spendingAnalysis.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-muted-foreground">
                        ${category.currentAmount} → ${category.recommendedAmount}
                      </span>
                    </div>
                    <Progress value={category.percentageChange} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {category.percentageChange > 0 ? "Increase" : "Decrease"} by {Math.abs(category.percentageChange)}%
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
                {adviceResult.actionSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Badge variant={getPriorityColor(step.priority)} className="mt-1">
                      {step.priority}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
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
                    {adviceResult.investmentPlan.shortTerm.map((investment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{investment.type}</p>
                          <p className="text-sm text-muted-foreground">{investment.reason}</p>
                        </div>
                        <span className="font-medium">${investment.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Long-term Investments</h3>
                  <div className="space-y-4">
                    {adviceResult.investmentPlan.longTerm.map((investment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{investment.type}</p>
                          <p className="text-sm text-muted-foreground">{investment.reason}</p>
                        </div>
                        <span className="font-medium">${investment.amount}</span>
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
                {adviceResult.progressTracking.milestones.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{milestone.milestone}</span>
                      <span className="text-muted-foreground">
                        Target: ${milestone.targetAmount} by {milestone.targetDate}
                      </span>
                    </div>
                    <Progress 
                      value={(milestone.currentAmount / milestone.targetAmount) * 100} 
                      className="h-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Current: ${milestone.currentAmount} ({(milestone.currentAmount / milestone.targetAmount * 100).toFixed(1)}% of target)
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
<<<<<<< HEAD
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
            <div>
              <Label htmlFor="spendingPatterns" className="text-lg">Your Spending Patterns</Label>
              <Textarea
                id="spendingPatterns"
                value={spendingPatterns}
                onChange={(e) => setSpendingPatterns(e.target.value)}
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
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
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

      {isLoading && (
        <Card className="shadow-md mt-8">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Our AI is crafting your personalized advice... this might take a moment.</p>
          </CardContent>
        </Card>
      )}

      {adviceResult && !isLoading && (
        <div className="space-y-6 mt-8">
          <Card className="shadow-md border-l-4 border-primary card-hover-animation">
            <CardHeader className="flex flex-row items-center gap-3">
              <Info className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Overall Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{adviceResult.overallSummary}</p>
            </CardContent>
          </Card>

          {adviceResult.actionableAdvice && adviceResult.actionableAdvice.length > 0 && (
            <Card className="shadow-md border-l-4 border-accent card-hover-animation">
              <CardHeader className="flex flex-row items-center gap-3">
                <Lightbulb className="h-8 w-8 text-accent" />
                <CardTitle className="text-2xl">Actionable Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue={`item-0`}>
                  {adviceResult.actionableAdvice.map((section, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc space-y-3 pl-5 text-base">
                          {section.points.map((point, pIndex) => (
                            <li key={pIndex} className="leading-relaxed whitespace-pre-wrap">{point}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {adviceResult.investmentSuggestions && adviceResult.investmentSuggestions.points.length > 0 && (
            <Card className="shadow-md border-l-4 border-green-500 card-hover-animation">
              <CardHeader className="flex flex-row items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <CardTitle className="text-2xl">{adviceResult.investmentSuggestions.title || "Investment Suggestions"}</CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="list-disc space-y-3 pl-5 text-base">
                    {adviceResult.investmentSuggestions.points.map((point, pIndex) => (
                      <li key={pIndex} className="leading-relaxed whitespace-pre-wrap">{point}</li>
                    ))}
                  </ul>
              </CardContent>
            </Card>
          )}

          {adviceResult.keyTakeaways && adviceResult.keyTakeaways.length > 0 && (
            <Card className="shadow-md border-l-4 border-blue-500 card-hover-animation">
              <CardHeader className="flex flex-row items-center gap-3">
                <MessageSquareQuote className="h-8 w-8 text-blue-500" />
                <CardTitle className="text-2xl">Key Takeaways & Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {adviceResult.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="text-base italic leading-relaxed p-4 bg-blue-500/10 rounded-lg shadow">
                      "{takeaway}"
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
=======
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
>>>>>>> origin/master
  );
}
