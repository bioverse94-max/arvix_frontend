import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  ListOrdered,
  Users,
  ShieldAlert,
  Network,
  Share2,
  Briefcase,
  Bell,
  Clock,
  Activity,
  GitBranch,
  SlidersHorizontal,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Layers,
  Terminal,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: any;
  count?: number;
  countColor?: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationSections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { path: "/dashboard", label: "Fraud Dashboard", icon: LayoutDashboard },
        { path: "/demo", label: "SIH Showcase", icon: PlayCircle, badge: "DEMO", badgeColor: "bg-red-600 text-white" },
      ],
    },
    {
      title: "Monitoring",
      items: [
        { path: "/transactions", label: "Live Transactions", icon: Radio, count: 748, countColor: "bg-[#0072BC]" },
        { path: "/risk-queue", label: "Risk Queue", icon: ListOrdered, count: 8, countColor: "bg-red-600" },
        { path: "/accounts", label: "Account Directory", icon: Users },
      ],
    },
    {
      title: "Fraud Intelligence",
      items: [
        { path: "/mule-accounts", label: "Mule Accounts", icon: ShieldAlert, count: 342, countColor: "bg-amber-600" },
        { path: "/clusters", label: "Fraud Clusters", icon: Layers, count: 27, countColor: "bg-indigo-600" },
        { path: "/graph", label: "Transaction Graph", icon: Network },
      ],
    },
    {
      title: "Investigations",
      items: [
        { path: "/cases", label: "Cases", icon: Briefcase, count: 14, countColor: "bg-[#123B63]" },
        { path: "/alerts", label: "Alerts", icon: Bell },
        { path: "/timeline", label: "Timeline", icon: Clock },
      ],
    },
    {
      title: "Analytics",
      items: [
        { path: "/analytics/pattern-of-life", label: "Pattern-of-Life", icon: Activity },
        { path: "/analytics/graph", label: "Graph Signals", icon: Share2 },
        { path: "/analytics/risk-model", label: "Risk Analytics", icon: SlidersHorizontal },
      ],
    },
    {
      title: "System & Reports",
      items: [
        { path: "/reports", label: "Reports", icon: FileSpreadsheet },
        { path: "/system-health", label: "System Health", icon: GitBranch },
        { path: "/api", label: "Scoring API", icon: Terminal },
        { path: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white text-[#172B4D] border-r border-[#E1E7ED] transition-all duration-200 z-30 select-none ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-2 space-y-4">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#7B8794] font-mono-code mb-1">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors group ${
                        isActive
                          ? "bg-[#EAF5FC] text-[#0072BC] font-bold border-l-3 border-[#0072BC]"
                          : "text-[#526581] hover:text-[#172B4D] hover:bg-[#F5F7FA]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0072BC]" : "text-[#7B8794]"}`} />

                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 truncate">
                          <span className="truncate">{item.label}</span>

                          {item.count !== undefined && (
                            <span
                              className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-mono-code font-bold text-white shrink-0 ${
                                item.countColor || "bg-[#123B63]"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 font-mono-code ${
                                item.badgeColor || "bg-blue-600 text-white"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Collapse & Sign Out Footer */}
      <div className="p-2 border-t border-[#E1E7ED] bg-[#F5F7FA] flex items-center justify-between gap-1">
        {!collapsed ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-[#7B8794] hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="p-1 rounded-md text-[#7B8794] hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-[#526581] hover:text-[#172B4D] hover:bg-slate-200 transition-colors ml-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
