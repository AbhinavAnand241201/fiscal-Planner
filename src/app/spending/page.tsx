
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialTransactions: Transaction[] = [
  { id: "1", date: new Date().toISOString(), description: "Groceries", amount: 75.50, category: "Food", type: "expense" },
  { id: "2", date: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Salary", amount: 2500, category: "Income", type: "income" },
  { id: "3", date: new Date(Date.now() - 86400000 * 3).toISOString(), description: "Coffee", amount: 4.25, category: "Food", type: "expense" },
];

const spendingCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Health", "Other"];
const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];

export default function SpendingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch transactions from a persistent store
    // For now, use initialTransactions on first load if localStorage is empty
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem("transactions", JSON.stringify(initialTransactions));
    }
  }, []);

  const updateLocalStorage = (updatedTransactions: Transaction[]) => {
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(date).toISOString(),
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    updateLocalStorage(updatedTransactions);

    setDescription("");
    setAmount("");
    // Reset category based on type, or to first in list
    const currentCats = type === 'expense' ? spendingCategories : incomeCategories;
    setCategory(currentCats.length > 0 ? currentCats[0] : "");
    // setDate(new Date().toISOString().split('T')[0]); // Keep date or reset
    toast({
      title: "Transaction Added",
      description: `${description} for $${amount} has been logged.`,
    });
  };

  const handleDelete = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    updateLocalStorage(updatedTransactions);
    toast({
      title: "Transaction Deleted",
      description: "The transaction has been removed.",
    });
  };
  
  const currentCategories = type === 'expense' ? spendingCategories : incomeCategories;
  useEffect(() => {
    if (currentCategories.length > 0) {
        // If the current category isn't valid for the new type, reset it
        if (!currentCategories.includes(category)) {
            setCategory(currentCategories[0]);
        }
    } else {
      setCategory("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, category]); // Rerun when type or category changes, ensure category is valid for type.


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Spending Tracker</h1>
        <p className="text-muted-foreground">Log and manage your income and expenses.</p>
      </header>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Lunch with friends" required />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 25.50" required step="0.01" min="0.01" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as "expense" | "income")}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Displaying the last {transactions.length} transactions.
            <span className="block text-xs text-muted-foreground mt-1">Note: Data is stored in your browser and will be lost if you clear your browser data.</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? transactions.map((t) => (
                  <TableRow key={t.id} className={`${t.type === 'income' ? 'bg-green-500/10 hover:bg-green-500/20 dark:bg-green-700/20 dark:hover:bg-green-700/30' : 'bg-red-500/10 hover:bg-red-500/20 dark:bg-red-700/20 dark:hover:bg-red-700/30'} transition-colors duration-150`}>
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} aria-label="Delete transaction">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No transactions yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
