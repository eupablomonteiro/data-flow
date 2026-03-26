"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Upload,
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { LuDatabaseZap } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { useAuth } from "@/features/auth/hooks/use-auth";

const menuItems: { title: string; icon: typeof LayoutDashboard; href: Route }[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Uploads",
    icon: Upload,
    href: "/dashboard",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Arquivos",
    icon: FileSpreadsheet,
    href: "/dashboard",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <Sidebar className="border-r border-df-surface/20 bg-df-bg-deep">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-df-surface/15 bg-df-bg-deep">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <LuDatabaseZap className="w-8 h-8 text-white bg-df-accent rounded-lg p-1.5 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-df-accent rounded-lg blur-md opacity-30" />
          </div>
          <div>
            <h1 className="text-df-white font-bold text-lg leading-tight">
              Data<span className="gradient-text">Flow</span>
            </h1>
            <p className="text-df-muted text-[10px] font-medium uppercase tracking-wider">
              Dashboard
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-df-bg-deep">
        <SidebarGroup>
          <SidebarGroupLabel className="text-df-muted/60 text-[10px] uppercase tracking-widest font-semibold px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg mx-1 transition-all duration-200 ${
                        isActive
                          ? "bg-df-accent/15 text-df-accent border border-df-accent/20"
                          : "text-df-muted hover:text-df-text hover:bg-df-surface/15"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <item.icon
                          className={`w-4 h-4 ${isActive ? "text-df-accent" : ""}`}
                        />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-df-accent" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3 border-t border-df-surface/15 bg-df-bg-deep">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-df-surface/15 transition-colors cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatarUrl || undefined} />
            <AvatarFallback className="bg-df-accent/20 text-df-accent text-xs font-bold uppercase">
              {user?.name?.substring(0, 2) ||
                user?.email?.substring(0, 2) ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-df-text text-sm font-medium truncate">
              {user?.name || "Usuário"}
            </p>
            <p className="text-df-muted text-xs truncate">
              {user?.email || "..."}
            </p>
          </div>
          <ChevronUp className="w-4 h-4 text-df-muted" />
        </div>

        <div className="flex gap-1 mt-1">
          <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-df-muted hover:text-df-text hover:bg-df-surface/15 transition-colors text-xs">
            <Settings className="w-3.5 h-3.5" />
            Config
          </button>
          <button
            onClick={logout}
            disabled={isLoggingOut}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-df-muted hover:text-df-error hover:bg-df-error/10 transition-colors text-xs disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            {isLoggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
