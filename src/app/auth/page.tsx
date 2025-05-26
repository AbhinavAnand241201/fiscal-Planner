
"use client";

import React, { useState, type FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus, Mail, Lock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

// Simple SVG for Google icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.34 5.03 12.5C5.03 8.66 8.36 5.73 12.19 5.73C14.03 5.73 15.64 6.36 16.9 7.38L19.37 5.02C17.39 3.16 14.86 2 12.19 2C6.92 2 2.76 6.32 2.76 12.5C2.76 18.68 6.92 23 12.19 23C17.93 23 21.69 18.88 21.69 12.82C21.69 12.05 21.56 11.53 21.35 11.1Z"/>
  </svg>
);


export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, isUserReady } = useAuth();

  useEffect(() => {
    if (isUserReady && user) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [user, isUserReady, router, searchParams]);


  const handleEmailPasswordSubmit = async (e: FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (type === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast({ title: type === 'login' ? 'Logged In Successfully!' : 'Account Created Successfully!' });
      // Redirect will be handled by useEffect
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({ title: 'Authentication Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Logged In Successfully with Google!' });
      // Redirect will be handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
      toast({ title: 'Google Sign-In Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast({ title: "Email required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (err: any) {
      toast({ title: "Error Sending Reset Email", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  if (isUserReady && user) {
    // User is already logged in, show loading or null while redirecting
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Redirecting...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
       <Card className="w-full max-w-md shadow-2xl card-hover-animation">
        <CardHeader className="text-center">
          <Image src="https://placehold.co/100x100.png?text=FC" alt="Fiscal Compass Logo" width={80} height={80} className="mx-auto mb-4 rounded-full" data-ai-hint="compass logo" />
          <CardTitle className="text-3xl font-bold text-primary">Fiscal Compass</CardTitle>
          <CardDescription>Welcome! Manage your finances smartly.</CardDescription>
        </CardHeader>

        {showForgotPassword ? (
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Reset Password</h3>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="flex items-center mb-1">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                </Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  value={forgotPasswordEmail} 
                  onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
              {error && (
                <p className="text-sm text-destructive flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />{error}</p>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Send Reset Link
              </Button>
            </form>
            <Button variant="link" onClick={() => { setShowForgotPassword(false); setError(null); }} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-base py-2.5">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-base py-2.5">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <CardContent className="space-y-6">
                  <form onSubmit={(e) => handleEmailPasswordSubmit(e, 'login')} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="flex items-center mb-1">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                      </Label>
                      <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="flex items-center mb-1">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                      </Label>
                      <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                     {error && (
                        <p className="text-sm text-destructive flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />{error}</p>
                      )}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                      Login
                    </Button>
                  </form>
                  <Button variant="link" onClick={() => {setShowForgotPassword(true); setError(null);}} className="w-full text-sm">
                    Forgot Password?
                  </Button>
                </CardContent>
              </TabsContent>
              <TabsContent value="signup">
                <CardContent className="space-y-6">
                  <form onSubmit={(e) => handleEmailPasswordSubmit(e, 'signup')} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email" className="flex items-center mb-1">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                      </Label>
                      <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="flex items-center mb-1">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                      </Label>
                      <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="flex items-center mb-1">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Confirm Password
                      </Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
                    </div>
                     {error && (
                        <p className="text-sm text-destructive flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />{error}</p>
                      )}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                      Sign Up
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-lg py-3" 
                  onClick={handleGoogleSignIn} 
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
                  <span className="ml-2">Sign in with Google</span>
                </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
