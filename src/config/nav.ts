
import { LayoutDashboard, CreditCard, Target, Sparkles, QrCode, Goal, LogIn, type LucideIcon } from "lucide-react";
import type React from 'react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon | React.ElementType;
  matchSegments?: string[];
  authRequired?: boolean; // true if page requires authentication
  publicOnly?: boolean; // true if page should only be shown to unauthenticated users
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard, authRequired: false }, // Landing page is public
  { href: "/spending", label: "Spending", icon: CreditCard, authRequired: true },
  { href: "/budgets", label: "Budgets", icon: Target, authRequired: true },
  { href: "/goals", label: "Financial Goals", icon: Goal, authRequired: true },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles, authRequired: true },
  { href: "/payments", label: "Payments", icon: QrCode, authRequired: true },
];


export const authNavItems: NavItem[] = [
 { href: "/", label: "Home", icon: LayoutDashboard, authRequired: false },
 { href: "/auth", label: "Login / Sign Up", icon: LogIn, publicOnly: true },
  // You can add other public links here if needed, e.g. About Us, Pricing etc.
];
