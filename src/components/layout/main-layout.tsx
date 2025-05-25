"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons/logo-icon";
import { navItems, type NavItem } from "@/config/nav";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
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
                {navItems.map((item) => (
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
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 lg:px-8">
            <div className="md:hidden">
               <SidebarTrigger/>
            </div>
            <div className="flex-1">
              {/* Placeholder for potential breadcrumbs or page title */}
            </div>
            {/* Placeholder for user menu or additional header actions */}
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
