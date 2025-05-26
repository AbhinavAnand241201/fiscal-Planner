
"use client";

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import React from "react"; // Changed from "import type React from "react";"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons/logo-icon";
import { navItems, type NavItem, authNavItems } from "@/config/nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const protectedRoutes = ["/spending", "/budgets", "/goals", "/advisor", "/payments"]; // Add any other routes that need auth

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isUserReady } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isUserReady && !loading && !user && protectedRoutes.includes(pathname)) {
      router.push(`/auth?redirect=${pathname}`);
    }
  }, [user, loading, isUserReady, pathname, router]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/auth');
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    // For auth page, exact match
    if (item.href === "/auth") {
      return pathname === "/auth";
    }
    return pathname.startsWith(item.href);
  };
  
  const currentNavItems = user ? navItems : authNavItems;


  // If auth state is not ready yet, show a global loading or minimal layout
  if (!isUserReady) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in and trying to access a protected route,
  // AuthContext's loading screen or the useEffect redirect will handle it.
  // For non-protected routes or the auth page itself, allow rendering.
  if (!user && protectedRoutes.includes(pathname)) {
    // This check ensures children of protected routes are not rendered before redirect
    // The AuthProvider and useEffect handle the actual loading screen / redirect.
    return (
         <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="ml-4 text-xl">Authenticating...</p>
        </div>
    );
  }


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        { (user || !protectedRoutes.includes(pathname) || pathname === '/auth') && (
          <Sidebar variant="sidebar" collapsible="icon" className="border-r">
            <SidebarHeader className="p-4">
              <Link href="/" className="flex items-center gap-2">
                <LogoIcon className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Fiscal Compass
                </h1>
              </Link>
            </SidebarHeader>
            <ScrollArea className="flex-grow">
              <SidebarContent>
                <SidebarMenu>
                  {currentNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item)}
                          tooltip={{
                            children: item.label,
                            className: "group-data-[collapsible=icon]:visible hidden",
                          }}
                          className="justify-start"
                        >
                          <a>
                            <item.icon className="h-5 w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.label}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </ScrollArea>
            {user && (
              <SidebarFooter className="p-2 border-t border-sidebar-border">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-2 h-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
                        <Avatar className="h-8 w-8 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7">
                          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.email ? user.email[0].toUpperCase() : <UserCircle />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                          <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">{user.displayName || user.email}</p>
                          <p className="text-xs text-sidebar-foreground/70">View Profile</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-56">
                      <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </SidebarFooter>
            )}
          </Sidebar>
        )}

        <SidebarInset className="flex flex-col">
           { (user || !protectedRoutes.includes(pathname) || pathname === '/auth') && (
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
              <div className="md:hidden">
                <SidebarTrigger/>
              </div>
              <div className="flex-1">
                {/* Placeholder for potential breadcrumbs or page title */}
              </div>
              {/* Placeholder for user menu or additional header actions for non-sidebar users */}
            </header>
           )}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
