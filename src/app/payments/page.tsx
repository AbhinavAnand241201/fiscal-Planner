
"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, AlertTriangle, WalletCards } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { Budget } from "@/types";

// Assume spending categories are consistent with budgets page
const spendingCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Health", "Other"];

export default function PaymentsPage() {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCategory, setPaymentCategory] = useState(spendingCategories[0]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);
  const [restrictionMessage, setRestrictionMessage] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const storedBudgets = localStorage.getItem("budgets");
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    }
  }, []);

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentCategory) {
      toast({
        title: "Category Not Selected",
        description: "Please select a payment category.",
        variant: "destructive",
        });
      return;
    }

    const relevantBudget = budgets.find(b => b.category === paymentCategory && b.period === "monthly"); // Assuming monthly for now

    if (relevantBudget) {
      // Basic monthly check for demonstration
      // A more robust solution would check transactions against budget period (weekly/yearly)
      const transactionsRaw = localStorage.getItem("transactions");
      let currentSpentInBudgetCategory = 0;
      if (transactionsRaw) {
        const transactions = JSON.parse(transactionsRaw);
        currentSpentInBudgetCategory = transactions
          .filter((t: any) => 
            t.category === paymentCategory && 
            t.type === 'expense' &&
            new Date(t.date).getMonth() === new Date().getMonth() && // current month
            new Date(t.date).getFullYear() === new Date().getFullYear() // current year
          )
          .reduce((sum: number, t: any) => sum + t.amount, 0);
      }
      
      if (currentSpentInBudgetCategory + amount > relevantBudget.limit) {
        setRestrictionMessage(`Your budget for ${paymentCategory} is $${relevantBudget.limit.toFixed(2)}. You've already spent $${currentSpentInBudgetCategory.toFixed(2)}. This payment of $${amount.toFixed(2)} would exceed your limit. RESTRAINT IS KEY. Re-evaluate your spending and try again next time.`);
        setShowRestrictionDialog(true);
        return;
      }
    } else {
        // No specific budget for this category, allow payment but maybe warn?
        // For now, we'll allow it if no budget is set.
    }

    // Simulate payment success
    toast({
      title: "Mock Payment Successful!",
      description: `Successfully processed (mock) payment of $${amount.toFixed(2)} for ${paymentCategory}.`,
    });
    setPaymentAmount("");
    // Potentially add this transaction to localStorage if needed
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">UPI Payments (Mock)</h1>
        <p className="text-muted-foreground">Simulate making payments and check against your budgets.</p>
      </header>

      <Card className="shadow-lg max-w-lg mx-auto card-hover-animation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-6 w-6 text-primary" />
            Simulate Payment
          </CardTitle>
          <CardDescription>Enter payment details. This is a mock interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div>
              <Label htmlFor="paymentAmount">Amount ($)</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="e.g., 50.00"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="paymentCategory">Category</Label>
              <Select value={paymentCategory} onValueChange={setPaymentCategory} required>
                <SelectTrigger id="paymentCategory" className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {spendingCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              <QrCode className="mr-2 h-5 w-5" /> Simulate Scan & Pay
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Image 
              src="https://placehold.co/200x200.png?text=Merchant+QR" 
              alt="QR Code Placeholder" 
              width={150} 
              height={150}
              data-ai-hint="qr code"
              className="mx-auto rounded-lg border p-1 shadow-sm"
            />
             <p className="mt-2 text-xs text-muted-foreground">(Visual for mock scan)</p>
          </div>

        </CardContent>
      </Card>

      <AlertDialog open={showRestrictionDialog} onOpenChange={setShowRestrictionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              BUDGET ALERT! PAYMENT RESTRICTED!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-4">
              {restrictionMessage}
              <br/><br/>
              <strong>This is a critical moment for your financial discipline. Your choices now define your future financial health.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowRestrictionDialog(false)}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
            >
              I Understand. I Will Do Better.
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>About This Mock Feature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>This page simulates a UPI payment flow integrated with your budget.</p>
            <p>1. Enter an amount and select a category for your mock payment.</p>
            <p>2. Click "Simulate Scan & Pay".</p>
            <p>3. The system checks if this payment keeps you within your monthly budget for the selected category.</p>
            <p>4. If you're over budget, a STRICT warning will appear. If not, a mock success message is shown.</p>
            <p className="font-semibold text-destructive-foreground bg-destructive/20 p-2 rounded-md">Real payment integrations like Stripe or PayPal require significant backend setup and are not implemented in this prototype.</p>
        </CardContent>
      </Card>
    </div>
  );
}
