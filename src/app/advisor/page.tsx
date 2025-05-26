
"use client";

import React, { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Lightbulb, DollarSign, CheckCircle, Info, MessageSquareQuote } from "lucide-react";
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
  );
}
