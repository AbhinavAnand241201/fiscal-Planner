import { LayoutDashboard, CreditCard, Target, Sparkles, QrCode, type LucideIcon } from "lucide-react";
import type React from 'react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon | React.ElementType; 
  matchSegments?: string[]; 
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/spending", label: "Spending", icon: CreditCard },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles },
  { href: "/payments", label: "Payments", icon: QrCode },
];
