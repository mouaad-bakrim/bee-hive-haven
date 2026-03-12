import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, Image, Settings, LogOut, Menu, X, Plus, ChevronLeft, Loader2,
  BarChart2, MessageSquare, Tag, Users, Bell, Mail, MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [pendingComments, setPendingComments] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [pendingQuestions, setPendingQuestions] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Close on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const fetchBadges = async () => {
      const [{ count: cCount }, { count: nCount }, { count: qCount }, { count: sCount }] = await Promise.all([
        (supabase as any).from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        (supabase as any).from("admin_notifications").select("*", { count: "exact", head: true }).eq("read", false),
        (supabase as any).from("forum_questions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        (supabase as any).from("subscribers").select("*", { count: "exact", head: true }),
      ]);
      setPendingComments(cCount ?? 0);
      setUnreadNotifs(nCount ?? 0);
      setPendingQuestions(qCount ?? 0);
      setSubscriberCount(sCount ?? 0);
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
        { label: "Newsletter", path: "/admin/subscribers", icon: Mail, badge: subscriberCount },
        { label: "Communauté", path: "/admin/communaute", icon: MessagesSquare, badge: pendingQuestions },
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

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
          collapsed ? "justify-center px-2 py-2.5 md:justify-center" : "px-3 py-2.5"
        } ${
          active
            ? "bg-primary/15 text-primary border-l-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="flex-1">{item.label}</span>}
        {!collapsed && item.badge ? (
          <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  const renderGroups = () => (
    <>
      {sidebarGroups.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && <div className="my-2 border-t border-border" />}
          {!collapsed && (
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => renderNavItem(item))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-card border-b border-border">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-secondary/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="font-heading font-bold text-foreground flex items-center gap-2">
          <span className="text-xl">🐝</span> Admin
        </span>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
          {user.email?.[0]?.toUpperCase()}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:relative top-0 left-0 h-full z-50
          bg-card border-r border-border
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Close button mobile */}
        <button
          className="md:hidden absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>

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

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto h-[calc(100%-130px)]">{renderGroups()}</nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && "Déconnexion"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop header */}
        <header className="hidden md:flex h-14 border-b border-border bg-card items-center px-4 gap-3 sticky top-0 z-30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Voir le site
          </Link>
          <div className="flex-1" />
          <Link to="/admin/posts/new">
            <Button size="sm" className="honey-gradient text-primary-foreground gap-1.5 min-h-[44px]">
              <Plus className="w-4 h-4" /> Nouvel article
            </Button>
          </Link>
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {user.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-6 lg:p-8 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
