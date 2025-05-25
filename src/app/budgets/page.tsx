
"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget, Transaction } from "@/types";
import { PlusCircle, Edit3, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const spendingCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Health", "Other"]; // Should be consistent with spending tracker

const initialBudgets: Budget[] = [
  { id: "1", category: "Food", limit: 500, spent: 0, period: "monthly" },
  { id: "2", category: "Entertainment", limit: 150, spent: 0, period: "monthly" },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // To calculate spent amount
  
  // Form states for adding/editing budget
  const [isEditing, setIsEditing] = useState<string | null>(null); // Stores ID of budget being edited
  const [category, setCategory] = useState(spendingCategories[0]);
  const [limit, setLimit] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const { toast } = useToast();

  useEffect(() => {
    const storedBudgets = localStorage.getItem("budgets");
    const storedTransactions = localStorage.getItem("transactions");

    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    } else {
      setBudgets(initialBudgets);
      localStorage.setItem("budgets", JSON.stringify(initialBudgets));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Update spent amount in budgets whenever transactions change
  useEffect(() => {
    if (transactions.length > 0 && budgets.length > 0) {
      const updatedBudgets = budgets.map(budget => {
        const relevantTransactions = transactions.filter(
          t => t.category === budget.category && t.type === 'expense' && 
               // Basic monthly filtering, can be improved for weekly/yearly
               new Date(t.date).getMonth() === new Date().getMonth() && 
               new Date(t.date).getFullYear() === new Date().getFullYear()
        );
        const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, spent };
      });
      setBudgets(updatedBudgets);
      // Note: Avoid saving back to localStorage here to prevent loop if transactions also trigger budget updates
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]); // Only re-run if transactions change, not budgets to avoid loop


  const updateLocalStorageBudgets = (updatedBudgets: Budget[]) => {
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!category || !limit || !period) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    const numericLimit = parseFloat(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      toast({ title: "Invalid Limit", description: "Budget limit must be a positive number.", variant: "destructive" });
      return;
    }

    let updatedBudgets;
    if (isEditing) {
      // Edit existing budget
      updatedBudgets = budgets.map(b => b.id === isEditing ? { ...b, category, limit: numericLimit, period } : b);
      toast({ title: "Budget Updated", description: `Budget for ${category} has been updated.` });
    } else {
      // Add new budget
      if (budgets.find(b => b.category === category && b.period === period)) {
        toast({ title: "Budget Exists", description: `A ${period} budget for ${category} already exists.`, variant: "destructive" });
        return;
      }
      const newBudget: Budget = {
        id: Date.now().toString(),
        category,
        limit: numericLimit,
        spent: 0, // Will be recalculated
        period,
      };
      updatedBudgets = [newBudget, ...budgets];
      toast({ title: "Budget Added", description: `New budget for ${category} created.` });
    }
    
    setBudgets(updatedBudgets);
    updateLocalStorageBudgets(updatedBudgets);
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(null);
    setCategory(spendingCategories[0]);
    setLimit("");
    setPeriod("monthly");
  };

  const handleEdit = (budget: Budget) => {
    setIsEditing(budget.id);
    setCategory(budget.category);
    setLimit(budget.limit.toString());
    setPeriod(budget.period);
  };

  const handleDelete = (id: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    updateLocalStorageBudgets(updatedBudgets);
    toast({ title: "Budget Deleted", description: "The budget has been removed." });
    if (isEditing === id) resetForm(); // Reset form if editing the deleted budget
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Manage Budgets</h1>
        <p className="text-muted-foreground">Set spending limits and track your progress.</p>
      </header>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Budget" : "Create New Budget"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget-category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="budget-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {spendingCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget-limit">Limit ($)</Label>
                <Input id="budget-limit" type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g., 500" required />
              </div>
              <div>
                <Label htmlFor="budget-period">Period</Label>
                <Select value={period} onValueChange={(value) => setPeriod(value as "weekly" | "monthly" | "yearly")} required>
                  <SelectTrigger id="budget-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {isEditing ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isEditing ? "Update Budget" : "Add Budget"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>Your Budgets</CardTitle>
          <CardDescription>
            Overview of your current budget allocations.
            <span className="block text-xs text-muted-foreground mt-1">Note: Data is stored in your browser. 'Spent' amount is indicative for current month.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgets.length > 0 ? budgets.map((budget) => {
            const percentageSpent = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const isOverBudget = budget.spent > budget.limit;
            return (
              <Card key={budget.id} className={`p-4 card-hover-animation ${isOverBudget ? 'border-destructive bg-destructive/10' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{budget.category} <span className="text-sm text-muted-foreground">({budget.period})</span></h3>
                    <p className={`text-sm ${isOverBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      Spent: ${budget.spent.toFixed(2)} / Limit: ${budget.limit.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)} aria-label="Edit budget">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)} aria-label="Delete budget">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Progress value={Math.min(percentageSpent, 100)} className={`mt-2 h-3 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`} />
                {isOverBudget && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    You are over budget by ${(budget.spent - budget.limit).toFixed(2)}!
                  </p>
                )}
              </Card>
            );
          }) : (
            <p className="text-center text-muted-foreground">No budgets set up yet. Add one above to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
