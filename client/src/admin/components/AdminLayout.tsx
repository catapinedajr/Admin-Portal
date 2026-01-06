import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  BookOpen, 
  Megaphone, 
  ShoppingBag,
  Users,
  UserCog,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Twitter,
  Building2,
  Map,
  Target,
  BarChart3,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/goals", label: "Goals", icon: Target },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: BookOpen },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/social", label: "Social", icon: Twitter },
  { href: "/admin/store", label: "Store", icon: ShoppingBag },
  { href: "/admin/crm", label: "B2B CRM", icon: Building2 },
  { href: "/admin/roadmap", label: "Roadmap", icon: Map },
  { href: "/admin/settings", label: "Settings", icon: Settings, superAdminOnly: true },
  { href: "/admin/team", label: "Team", icon: UserCog, superAdminOnly: true },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: admin } = useQuery<{ firstName: string; lastName: string; email: string; role: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const filteredNavItems = navItems.filter(item => 
    !item.superAdminOnly || admin?.role === 'super_admin'
  );

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("admin_session");
    if (sessionId) {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionId}`,
        },
      });
    }
    localStorage.removeItem("admin_session");
    setLocation("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800"
        data-testid="button-mobile-menu"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">
                HL
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-orange-500/20 text-orange-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-medium text-white">
                {admin?.firstName?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <p className="text-xs text-zinc-500 truncate">{admin?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
