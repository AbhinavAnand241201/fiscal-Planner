
"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // Removed as it's not used correctly here
} from "@/components/ui/alert-dialog";
import type { FinancialGoal } from "@/types";
import { PlusCircle, Edit3, Trash2, CalendarIcon, AlertTriangle, Goal as GoalIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isValid } from "date-fns";

const initialGoals: FinancialGoal[] = [
  { id: "1", description: "Save for a new Laptop", targetAmount: 1200, currentAmount: 300, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * 3).toISOString() }, // 3 months from now
  { id: "2", description: "Vacation Fund", targetAmount: 2000, currentAmount: 1500, deadline: null },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const storedGoals = localStorage.getItem("financialGoals");
    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals);
        // Ensure deadline is a Date object or null
        const validatedGoals = parsedGoals.map((goal: any) => ({
          ...goal,
          deadline: goal.deadline && isValid(new Date(goal.deadline)) ? new Date(goal.deadline).toISOString() : null,
        }));
        setGoals(validatedGoals);
      } catch (error) {
        console.error("Failed to parse goals from localStorage:", error);
        setGoals(initialGoals);
        localStorage.setItem("financialGoals", JSON.stringify(initialGoals));
      }
    } else {
      setGoals(initialGoals);
      localStorage.setItem("financialGoals", JSON.stringify(initialGoals));
    }
  }, []);

  const updateLocalStorageGoals = (updatedGoals: FinancialGoal[]) => {
    localStorage.setItem("financialGoals", JSON.stringify(updatedGoals));
  };

  const resetForm = () => {
    setIsEditing(null);
    setDescription("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline(null);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const numTargetAmount = parseFloat(targetAmount);
    const numCurrentAmount = currentAmount ? parseFloat(currentAmount) : 0;

    if (!description.trim()) {
      toast({ title: "Missing Description", description: "Please enter a goal description.", variant: "destructive" });
      return;
    }
    if (isNaN(numTargetAmount) || numTargetAmount <= 0) {
      toast({ title: "Invalid Target Amount", description: "Target amount must be a positive number.", variant: "destructive" });
      return;
    }
    if (currentAmount && (isNaN(numCurrentAmount) || numCurrentAmount < 0)) {
        toast({ title: "Invalid Current Amount", description: "Current amount must be a non-negative number.", variant: "destructive" });
        return;
    }
    if (numCurrentAmount > numTargetAmount) {
        toast({ title: "Invalid Amounts", description: "Current amount cannot exceed target amount.", variant: "destructive" });
        return;
    }


    let updatedGoals;
    if (isEditing) {
      updatedGoals = goals.map(g => g.id === isEditing ? {
        ...g,
        description,
        targetAmount: numTargetAmount,
        currentAmount: numCurrentAmount,
        deadline: deadline ? deadline.toISOString() : null
      } : g);
      toast({ title: "Goal Updated", description: `Goal "${description}" has been updated.` });
    } else {
      const newGoal: FinancialGoal = {
        id: Date.now().toString(),
        description,
        targetAmount: numTargetAmount,
        currentAmount: numCurrentAmount,
        deadline: deadline ? deadline.toISOString() : null,
      };
      updatedGoals = [newGoal, ...goals];
      toast({ title: "Goal Added", description: `New goal "${description}" created.` });
    }
    
    setGoals(updatedGoals);
    updateLocalStorageGoals(updatedGoals);
    resetForm();
  };

  const handleEdit = (goal: FinancialGoal) => {
    setIsEditing(goal.id);
    setDescription(goal.description);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount?.toString() || "");
    setDeadline(goal.deadline && isValid(new Date(goal.deadline)) ? new Date(goal.deadline) : null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteGoalId) return;
    const goalToDelete = goals.find(g => g.id === deleteGoalId);
    const updatedGoals = goals.filter(g => g.id !== deleteGoalId);
    setGoals(updatedGoals);
    updateLocalStorageGoals(updatedGoals);
    toast({ title: "Goal Deleted", description: `Goal "${goalToDelete?.description}" has been removed.` });
    if (isEditing === deleteGoalId) resetForm();
    setDeleteGoalId(null);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2"><GoalIcon className="h-8 w-8" /> Financial Goals</h1>
        <p className="text-muted-foreground">Set, track, and achieve your financial milestones.</p>
      </header>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Goal" : "Create New Goal"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <Label htmlFor="goal-description">Description</Label>
              <Textarea id="goal-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Save for a new car" required className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goal-target-amount">Target Amount ($)</Label>
                <Input id="goal-target-amount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="e.g., 5000" required className="mt-1" min="0.01" step="0.01"/>
              </div>
              <div>
                <Label htmlFor="goal-current-amount">Current Amount ($) (Optional)</Label>
                <Input id="goal-current-amount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="e.g., 1000" className="mt-1" step="0.01" />
              </div>
              <div>
                <Label htmlFor="goal-deadline">Deadline (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline || undefined}
                      onSelect={(date) => setDeadline(date || null)}
                      initialFocus
                    />
                     {deadline && (
                        <Button variant="ghost" size="sm" className="w-full" onClick={() => setDeadline(null)}>Clear</Button>
                      )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {isEditing ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isEditing ? "Update Goal" : "Add Goal"}
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
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Overview of your financial aspirations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.length > 0 ? goals.map((goal) => {
            const current = goal.currentAmount || 0;
            const target = goal.targetAmount;
            const percentage = target > 0 ? (current / target) * 100 : 0;
            const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && current < target;
            const isComplete = current >= target;

            return (
              <Card key={goal.id} className={`p-4 card-hover-animation ${isOverdue ? 'border-destructive bg-destructive/10' : ''} ${isComplete ? 'border-green-500 bg-green-500/10' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.description}</h3>
                    <p className={`text-sm ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      Progress: ${current.toFixed(2)} / ${target.toFixed(2)}
                      {goal.deadline && ` (Deadline: ${format(new Date(goal.deadline), "PPP")})`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)} aria-label="Edit goal" disabled={isComplete}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {/* 
                      Removed AlertDialogTrigger here. The Button's onClick now directly sets 
                      the state to open the AlertDialog defined below.
                    */}
                     <Button variant="ghost" size="icon" onClick={() => setDeleteGoalId(goal.id)} aria-label="Delete goal">
                       <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                  </div>
                </div>
                <Progress value={Math.min(percentage, 100)} className={`mt-2 h-3 ${isOverdue ? '[&>div]:bg-destructive' : ''} ${isComplete ? '[&>div]:bg-green-500' : ''}`} />
                {isOverdue && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    This goal is overdue!
                  </p>
                )}
                {isComplete && (
                   <p className="text-xs text-green-600 mt-1 font-semibold">Goal Achieved!</p>
                )}
              </Card>
            );
          }) : (
            <p className="text-center text-muted-foreground">No financial goals set up yet. Add one above to get started!</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteGoalId} onOpenChange={(open) => !open && setDeleteGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the goal
              "{goals.find(g => g.id === deleteGoalId)?.description}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteGoalId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    