
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lightbulb, Users, Zap, TrendingUp, PiggyBank, Goal as GoalIconLucide, Compass, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

// Helper for scroll animations (simplified for CSS-driven approach)
const useScrollAnimate = (id: string, threshold: number = 0.1) => {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [id, threshold]);
};


export default function LandingPage() {
  useScrollAnimate("hero-section");
  useScrollAnimate("features-section");
  useScrollAnimate("how-it-works-section");
  useScrollAnimate("testimonials-section");
  useScrollAnimate("cta-section");

  const [currentDate, setCurrentDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground">
      {/* Hero Section */}
      <section id="hero-section" className="py-20 md:py-32 bg-gradient-to-br from-primary via-blue-700 to-primary-foreground/10 text-primary-foreground opacity-0 transition-opacity duration-1000 ease-in-out">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Compass className="h-20 w-20 mx-auto mb-6 text-accent animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Navigate Your Financial Future with <span className="text-accent">Fiscal Compass</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90">
              Smart budgeting, AI-powered advice, and effortless expense tracking. Take control of your money today.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform" asChild>
                <Link href={user ? "/spending" : "/auth"}>Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 relative flex items-center justify-center">
            <TrendingUp className="h-64 w-64 text-accent/30 opacity-60" data-ai-hint="financial growth chart" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-blob animation-delay-2000"></div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-16 md:py-24 bg-background opacity-0 transition-opacity duration-1000 ease-in-out delay-200">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">Why Fiscal Compass?</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We provide the tools and insights you need to achieve financial clarity and freedom.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: PiggyBank, title: "Smart Budgeting", description: "Visualize weekly, monthly, and yearly budgets with clear progress.", dataAiHint: "piggy bank savings", iconColor: "text-green-500", bgColor: "bg-green-500/10" },
              { icon: Lightbulb, title: "AI Financial Advisor", description: "Personalized advice based on your spending and goals, powered by Gemini.", dataAiHint: "idea lightbulb", iconColor: "text-yellow-500", bgColor: "bg-yellow-500/10" },
              { icon: Activity, title: "Spending Tracker", description: "Automatically track and categorize your expenses with ease.", dataAiHint: "analytics chart", iconColor: "text-blue-500", bgColor: "bg-blue-500/10" },
              { icon: GoalIconLucide, title: "Goal Setting", description: "Define and track your financial goals, from saving for a vacation to a down payment.", dataAiHint: "target goal", iconColor: "text-purple-500", bgColor: "bg-purple-500/10" },
              { icon: Zap, title: "Budget Alerts", description: "Customized limits to prevent overspending with real-time alerts.", dataAiHint: "notification bell", iconColor: "text-red-500", bgColor: "bg-red-500/10" },
              { icon: ShieldCheck, title: "Secure & Private", description: "Your financial data is encrypted and securely managed.", dataAiHint: "security shield", iconColor: "text-teal-500", bgColor: "bg-teal-500/10" },
            ].map((feature, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 card-hover-animation">
                <CardHeader className="flex flex-col items-center text-center gap-4 pb-2">
                  <div className={`p-4 rounded-full ${feature.bgColor} ${feature.iconColor}`}>
                    <feature.icon className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-16 md:py-24 bg-muted opacity-0 transition-opacity duration-1000 ease-in-out delay-400">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Get Started in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            {[
              { step: 1, title: "Sign Up", description: "Create your account in minutes. It's fast, free, and secure.", icon: UserPlus, dataAiHint: "user profile setup" },
              { step: 2, title: "Set Your Goals", description: "Define your budgets and financial aspirations. Tell us what you're working towards.", icon: Target, dataAiHint: "financial planning secure" },
              { step: 3, title: "Track & Optimize", description: "Log spending, get AI insights, and watch your financial health improve.", icon: TrendingUp, dataAiHint: "progress chart arrow" },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-card rounded-lg shadow-lg card-hover-animation flex flex-col items-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground text-2xl font-bold">
                  {item.step}
                </div>
                 <div className="p-3 rounded-full bg-primary/10 text-primary inline-block mb-4">
                    <item.icon className="h-10 w-10" />
                  </div>
                <h3 className="text-2xl font-semibold mb-2 text-primary">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Mock) */}
      <section id="testimonials-section" className="py-16 md:py-24 bg-background opacity-0 transition-opacity duration-1000 ease-in-out delay-600">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Loved by Users</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", quote: "Fiscal Compass helped me finally understand where my money goes. The AI advisor is a game-changer!", avatarHint: "woman smiling professional", icon: Users },
              { name: "Mike B.", quote: "Setting and tracking budgets used to be a chore. Now it's simple and motivating. Highly recommend!", avatarHint: "man working laptop", icon: Users },
              { name: "Jessica P.", quote: "I've achieved two of my financial goals faster than I thought possible, thanks to this app!", avatarHint: "person happy success", icon: Users },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card shadow-lg p-6 card-hover-animation">
                <CardContent className="flex flex-col items-center text-center">
                  <testimonial.icon className="h-16 w-16 rounded-full mb-4 border-2 border-primary p-2 text-primary" data-ai-hint={testimonial.avatarHint} />
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <p className="font-semibold text-primary">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta-section" className="py-20 md:py-32 bg-gradient-to-r from-accent to-teal-600 text-accent-foreground opacity-0 transition-opacity duration-1000 ease-in-out delay-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Master Your Money?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-accent-foreground/90">
            Join Fiscal Compass today and start your journey towards financial empowerment.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl py-4 px-10 rounded-full shadow-xl transform hover:scale-105 transition-transform" asChild>
            <Link href={user ? "/spending" : "/auth"}>Sign Up For Free <ArrowRight className="ml-2 h-6 w-6" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Compass className="h-6 w-6 text-primary" />
            <p className="font-semibold text-primary">Fiscal Compass</p>
          </div>
          <p>&copy; {new Date().getFullYear()} Fiscal Compass. All rights reserved.</p>
          <p className="text-xs mt-1">Your smart financial companion.</p>
          {currentDate && <p className="text-xs mt-2">Today is {currentDate}</p>}
        </div>
      </footer>

      {/* CSS for animations - simplified */}
      <style jsx global>{`
        .opacity-0 { opacity: 0; }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

