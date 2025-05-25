"use client";

import React, { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lightbulb, DollarSign, BookOpen } from "lucide-react";
import { provideFinancialAdvice, type FinancialAdviceInput, type FinancialAdviceOutput } from "@/ai/flows/provide-financial-advice";
import { useToast } from "@/hooks/use-toast";

export default function AdvisorPage() {
  const [spendingPatterns, setSpendingPatterns] = useState("");
  const [financialGoals, setFinancialGoals] = useState("");
  const [adviceResult, setAdviceResult] = useState<FinancialAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!spendingPatterns.trim() || !financialGoals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your spending patterns and financial goals.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAdviceResult(null);

    try {
      const input: FinancialAdviceInput = {
        spendingPatterns,
        financialGoals,
      };
      const result = await provideFinancialAdvice(input);
      setAdviceResult(result);
      toast({
        title: "Advice Generated!",
        description: "Your personalized financial advice is ready.",
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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
        <p className="text-muted-foreground">Get personalized financial advice powered by AI.</p>
      </header>

      <Card className="shadow-lg">
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
                value={spendingPatterns}
                onChange={(e) => setSpendingPatterns(e.target.value)}
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
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                placeholder="What are your financial goals? E.g., 'Save for a down payment on a house in 5 years, pay off student loans, build an emergency fund...'"
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

      {adviceResult && (
        <div className="space-y-6 mt-8">
          <Card className="shadow-md border-l-4 border-primary">
            <CardHeader className="flex flex-row items-center gap-3">
              <Lightbulb className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Personalized Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{adviceResult.advice}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl">Investment Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{adviceResult.investmentSuggestions}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <CardTitle className="text-2xl">Budgeting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{adviceResult.budgetingTips}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
