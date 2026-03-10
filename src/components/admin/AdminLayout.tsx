import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, Image, Settings, LogOut, Menu, X, Plus, ChevronLeft, Loader2,
  BarChart2, MessageSquare, Tag, Users, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [pendingComments, setPendingComments] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      const [{ count: cCount }, { count: nCount }] = await Promise.all([
        (supabase as any).from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        (supabase as any).from("admin_notifications").select("*", { count: "exact", head: true }).eq("read", false),
      ]);
      setPendingComments(cCount ?? 0);
      setUnreadNotifs(nCount ?? 0);
    };
    if (user && isAdmin) fetchBadges();
  }, [user, isAdmin, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const sidebarGroups: NavGroup[] = [
    {
      label: "Contenu",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { label: "Articles", path: "/admin/posts", icon: FileText },
        { label: "Médias", path: "/admin/media", icon: Image },
        { label: "Commentaires", path: "/admin/comments", icon: MessageSquare, badge: pendingComments },
        { label: "Catégories", path: "/admin/categories", icon: Tag },
      ],
    },
    {
      label: "Audience",
      items: [
        { label: "Analytics", path: "/admin/analytics", icon: BarChart2 },
        { label: "Utilisateurs", path: "/admin/users", icon: Users },
      ],
    },
    {
      label: "Système",
      items: [
        { label: "Notifications", path: "/admin/notifications", icon: Bell, badge: unreadNotifs },
        { label: "Paramètres", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const renderNavItem = (item: NavItem, mobile = false) => {
    const active = isActive(item.path);
    const linkEl = (
      <Link
        key={item.path}
        to={item.path}
        onClick={mobile ? () => setMobileOpen(false) : undefined}
        className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          collapsed && !mobile ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
        } ${
          active
            ? "bg-primary/15 text-primary border-l-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {(!collapsed || mobile) && <span className="flex-1">{item.label}</span>}
        {(!collapsed || mobile) && item.badge ? (
          <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );

    if (collapsed && !mobile) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge ? <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
          </TooltipContent>
        </Tooltip>
      );
    }
    return linkEl;
  };

  const renderGroups = (mobile = false) => (
    <>
      {sidebarGroups.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && <div className="my-2 border-t border-border" />}
          {(!collapsed || mobile) && (
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => renderNavItem(item, mobile))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen flex bg-background">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
          <div className={`border-b border-border flex items-center ${collapsed ? "justify-center p-3" : "p-5"}`}>
            {!collapsed ? (
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🐝</span>
                <span className="font-heading font-bold text-foreground">Admin</span>
              </Link>
            ) : (
              <span className="text-2xl">🐝</span>
            )}
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">{renderGroups()}</nav>
          <div className="p-2 border-t border-border">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={signOut} className="flex items-center justify-center w-full px-2 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Déconnexion</TooltipContent>
              </Tooltip>
            ) : (
              <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full">
                <LogOut className="w-5 h-5" /> Déconnexion
              </button>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
              <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col lg:hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2">
                    <span className="text-2xl">🐝</span>
                    <span className="font-heading font-bold text-foreground">Admin</span>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">{renderGroups(true)}</nav>
                <div className="p-3 border-t border-border">
                  <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive w-full">
                    <LogOut className="w-5 h-5" /> Déconnexion
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 sticky top-0 z-30">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-secondary/50" aria-label="Ouvrir le menu">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-secondary/50 transition-colors" aria-label="Toggle sidebar">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Voir le site
            </Link>
            <div className="flex-1" />
            <Link to="/admin/posts/new">
              <Button size="sm" className="honey-gradient text-primary-foreground gap-1.5">
                <Plus className="w-4 h-4" /> Nouvel article
              </Button>
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {user.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
