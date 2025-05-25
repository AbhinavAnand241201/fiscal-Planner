
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp, PiggyBank } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { ChartDataPoint } from "@/types";

const MOCK_BUDGET_DATA: ChartDataPoint[] = [
  { name: 'Groceries', value: 400 },
  { name: 'Transport', value: 150 },
  { name: 'Entertainment', value: 200 },
  { name: 'Utilities', value: 250 },
  { name: 'Savings', value: 300 },
];

const MOCK_SPENDING_TREND_DATA: ChartDataPoint[] = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1100 },
  { name: 'Mar', value: 1350 },
  { name: 'Apr', value: 1250 },
  { name: 'May', value: 1400 },
  { name: 'Jun', value: 1300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']; // These will be picked up by theme if not overridden by chart specific colors

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Fiscal Compass</h1>
        {currentDate && <p className="text-muted-foreground">{currentDate}</p>}
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg card-hover-animation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget Progress</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250 / $2,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
            {/* Placeholder for progress bar */}
            <div className="mt-2 h-2 w-full bg-muted rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: `${(1250/2000)*100}%`}}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg card-hover-animation">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Spending Alert</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High: Dining Out</div>
            <p className="text-xs text-muted-foreground">You've spent $250 on dining this week.</p>
             <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
              <Link href="/spending">View Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg card-hover-animation md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Financial Tip</CardTitle>
            <SparklesIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Consider automating your savings to reach your goals faster.</p>
            <Button variant="default" size="sm" className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/advisor">Get Personalized Advice <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg card-hover-animation">
          <CardHeader>
            <CardTitle>Spending by Category (Monthly)</CardTitle>
            <CardDescription>Overview of your expenses this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_BUDGET_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="hsl(var(--chart-1))" /* Use theme variable */
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {MOCK_BUDGET_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                 />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg card-hover-animation">
          <CardHeader>
            <CardTitle>Spending Trend (Last 6 Months)</CardTitle>
            <CardDescription>Your spending habits over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SPENDING_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Spending"]}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg card-hover-animation">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/spending">Track New Expense</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/budgets">Manage Budgets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/payments">Make a Payment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
