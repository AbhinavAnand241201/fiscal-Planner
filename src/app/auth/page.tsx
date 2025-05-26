
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
import { Loader2, LogIn, UserPlus, Mail, Lock, AlertTriangle, ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LogoIcon } from '@/components/icons/logo-icon';

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
      const redirect = searchParams.get('redirect') || '/'; // Default to dashboard or spending after login
      router.push(redirect);
    }
  }, [user, isUserReady, router, searchParams]);


  const handleEmailPasswordSubmit = async (e: FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (type === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ title: "Sign Up Failed", description: "Passwords do not match.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (type === 'signup' && password.length < 6) {
      setError("Password should be at least 6 characters.");
      toast({ title: "Sign Up Failed", description: "Password should be at least 6 characters.", variant: "destructive" });
      setIsLoading(false);
      return;
    }


    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast({ 
        title: type === 'login' ? 'Logged In Successfully!' : 'Account Created Successfully!',
        description: type === 'login' ? 'Welcome back!' : 'Welcome to Fiscal Compass!' 
      });
      // Redirect will be handled by useEffect
    } catch (err: any) {
      let friendlyMessage = 'An unexpected error occurred. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already in use. Try logging in or use a different email.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address is not valid.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak. Please choose a stronger password.';
      }
      setError(friendlyMessage);
      toast({ title: 'Authentication Failed', description: friendlyMessage, variant: 'destructive' });
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
      toast({ title: 'Logged In Successfully with Google!', description: 'Welcome to Fiscal Compass!' });
      // Redirect will be handled by useEffect
    } catch (err: any)
     {
      let friendlyMessage = 'Google Sign-In failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Google Sign-In was cancelled.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        friendlyMessage = 'An account already exists with this email address using a different sign-in method.';
      }
      setError(friendlyMessage);
      toast({ title: 'Google Sign-In Failed', description: friendlyMessage, variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast({ title: "Email Required", description: "Please enter your email address to reset your password.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      toast({ title: "Password Reset Email Sent", description: "Check your email inbox (and spam folder) for instructions to reset your password." });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (err: any) {
      let friendlyMessage = 'Failed to send password reset email. Please try again.';
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No account found with this email address.';
      }
      setError(friendlyMessage);
      toast({ title: "Error Sending Reset Email", description: friendlyMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  if (isUserReady && user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted to-background p-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-background p-4 selection:bg-primary/20">
       <Card className="w-full max-w-md shadow-2xl card-hover-animation border-primary/20">
        <CardHeader className="text-center space-y-3 pt-8">
          <LogoIcon className="mx-auto h-16 w-16 text-primary animate-pulse" />
          <CardTitle className="text-4xl font-bold text-primary tracking-tight">Fiscal Compass</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            {showForgotPassword ? "Reset your password" : "Welcome! Sign in or create an account."}
          </CardDescription>
        </CardHeader>

        {showForgotPassword ? (
          <CardContent className="space-y-6 px-6 pb-8 pt-4">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="flex items-center mb-1.5 text-base">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email Address
                </Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  value={forgotPasswordEmail} 
                  onChange={(e) => setForgotPasswordEmail(e.target.value)} 
                  placeholder="your.email@example.com" 
                  required 
                  className="py-3 text-base"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive flex items-center pt-1"><AlertTriangle className="mr-1.5 h-4 w-4" />{error}</p>
              )}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 mt-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                Send Reset Link
              </Button>
            </form>
            <Button variant="link" onClick={() => { setShowForgotPassword(false); setError(null); setEmail(''); setPassword(''); setConfirmPassword('');}} className="w-full text-primary hover:text-primary/80 text-sm">
              Back to Login
            </Button>
          </CardContent>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(tab) => {setActiveTab(tab); setError(null); setEmail(''); setPassword(''); setConfirmPassword('');}} className="w-full px-2">
              <TabsList className="grid w-full grid-cols-2 mb-6 mx-auto max-w-[90%]">
                <TabsTrigger value="login" className="text-base py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-base py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <CardContent className="space-y-6 px-4 pb-6">
                  <form onSubmit={(e) => handleEmailPasswordSubmit(e, 'login')} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="flex items-center mb-1.5 text-base">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                      </Label>
                      <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required className="py-3 text-base" />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="flex items-center mb-1.5 text-base">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                      </Label>
                      <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="py-3 text-base" />
                    </div>
                     {error && (
                        <p className="text-sm text-destructive flex items-center pt-1"><AlertTriangle className="mr-1.5 h-4 w-4" />{error}</p>
                      )}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 mt-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                      Login
                    </Button>
                  </form>
                  <Button variant="link" onClick={() => {setShowForgotPassword(true); setError(null);}} className="w-full text-sm text-primary hover:text-primary/80">
                    <ShieldQuestion className="mr-1.5 h-4 w-4" /> Forgot Password?
                  </Button>
                </CardContent>
              </TabsContent>
              <TabsContent value="signup">
                <CardContent className="space-y-6 px-4 pb-6">
                  <form onSubmit={(e) => handleEmailPasswordSubmit(e, 'signup')} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email" className="flex items-center mb-1.5 text-base">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                      </Label>
                      <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" required className="py-3 text-base" />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="flex items-center mb-1.5 text-base">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                      </Label>
                      <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="py-3 text-base" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="flex items-center mb-1.5 text-base">
                        <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Confirm Password
                      </Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className="py-3 text-base" />
                    </div>
                     {error && (
                        <p className="text-sm text-destructive flex items-center pt-1"><AlertTriangle className="mr-1.5 h-4 w-4" />{error}</p>
                      )}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 mt-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex flex-col space-y-4 px-6 pb-8 pt-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-lg py-3 border-input hover:border-primary/50 hover:bg-primary/5 hover:text-primary" 
                  onClick={handleGoogleSignIn} 
                  disabled={isGoogleLoading || isLoading}
                >
                  {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon />}
                  <span className="ml-2">Sign in with Google</span>
                </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-8">
        By signing up, you agree to our (non-existent) Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}


    