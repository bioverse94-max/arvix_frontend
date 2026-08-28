import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  ListOrdered,
  Users,
  ShieldAlert,
  Layers,
  Network,
  Briefcase,
  Bell,
  Clock,
  Activity,
  Share2,
  SlidersHorizontal,
  FileSpreadsheet,
  GitBranch,
  Terminal,
  X,
  ArrowRight,
} from "lucide-react";

interface ServiceItem {
  name: string;
  path: string;
  desc: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface ServiceCategory {
  title: string;
  items: ServiceItem[];
}

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServicesMegaMenu: React.FC<ServicesMegaMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: ServiceCategory[] = [
    {
      title: "Monitoring",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          desc: "Real-time metrics, active throughput & priority triage",
          icon: LayoutDashboard,
        },
        {
          name: "Transactions",
          path: "/transactions",
          desc: "Inline scoring stream across UPI switches (< 20ms)",
          icon: Radio,
          badge: "748K",
          badgeColor: "bg-[#0072BC] text-white",
        },
        {
          name: "Risk Queue",
          path: "/risk-queue",
          desc: "Graduated step-up and freeze intervention queue",
          icon: ListOrdered,
          badge: "8",
          badgeColor: "bg-[#0A1F36] text-white",
        },
        {
          name: "Accounts Directory",
          path: "/accounts",
          desc: "90-day baseline profiles and forensic dossiers",
          icon: Users,
        },
      ],
    },
    {
      title: "Intelligence",
      items: [
        {
          name: "Mule Accounts",
          path: "/mule-accounts",
          desc: "Mule account watchlist & rapid transit velocity",
          icon: ShieldAlert,
          badge: "342",
          badgeColor: "bg-slate-700 text-white",
        },
        {
          name: "Fraud Clusters",
          path: "/clusters",
          desc: "Syndicate detection and coordinated laundering rings",
          icon: Layers,
          badge: "27",
          badgeColor: "bg-slate-700 text-white",
        },
        {
          name: "Network Graph",
          path: "/graph",
          desc: "Directed DAG visualizer & funnel choke-point nodes",
          icon: Network,
        },
        {
          name: "Pattern-of-Life",
          path: "/analytics/pattern-of-life",
          desc: "Behavioral rhythms and inbound sender spikes",
          icon: Activity,
        },
      ],
    },
    {
      title: "Investigations",
      items: [
        {
          name: "Cases",
          path: "/cases",
          desc: "Active investigation dossiers and persistent notes",
          icon: Briefcase,
          badge: "14",
          badgeColor: "bg-[#0072BC] text-white",
        },
        {
          name: "Alerts Stream",
          path: "/alerts",
          desc: "Real-time telemetry triggers and threshold alerts",
          icon: Bell,
        },
        {
          name: "Incident Timeline",
          path: "/timeline",
          desc: "Chronological incident sequence reconstruction",
          icon: Clock,
        },
      ],
    },
    {
      title: "Analytics & Governance",
      items: [
        {
          name: "ML Model Sandbox",
          path: "/api",
          desc: "Real-time interactive ML inference testbed & vector inspector",
          icon: Terminal,
          badge: "LIVE",
          badgeColor: "bg-emerald-600 text-white",
        },
        {
          name: "Risk Model Architecture",
          path: "/analytics/risk-model",
          desc: "PoL + Graph + Supervised Fusion & SHAP explainability",
          icon: SlidersHorizontal,
        },
        {
          name: "Graph Signals",
          path: "/analytics/graph",
          desc: "In-degree centrality and community clustering",
          icon: Share2,
        },
        {
          name: "Regulatory Reports",
          path: "/reports",
          desc: "Compliance reports and regulatory export tables",
          icon: FileSpreadsheet,
        },
        {
          name: "System Telemetry",
          path: "/system-health",
          desc: "Switch node health, cluster metrics, and uptime",
          icon: GitBranch,
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs transition-opacity duration-200 flex justify-center items-start pt-14 select-none">
      <div
        ref={menuRef}
        className="w-full max-w-6xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden animate-row-insert max-h-[85vh] flex flex-col mt-2"
      >
        {/* Mega Menu Header */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
              Platform Modules
            </span>
            <span className="text-xs text-[#526581]">· Select any operational module</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#526581] hover:text-[#0A1F36] hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close Menu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mega Menu Grid Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0072BC] font-mono-code pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>{cat.title}</span>
                <span className="text-[10px] text-slate-400 font-normal font-sans">
                  ({cat.items.length})
                </span>
              </h4>

              <div className="space-y-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`group block p-2.5 rounded-lg border transition-all ${
                        isActive
                          ? "bg-[#EAF5FC] border-[#BAE6FD] shadow-2xs"
                          : "bg-white border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isActive
                              ? "bg-[#0072BC] text-white"
                              : "bg-[#F1F5F9] text-[#0072BC] group-hover:bg-[#EAF5FC]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs font-bold truncate ${
                                isActive ? "text-[#0072BC]" : "text-[#0A1F36] group-hover:text-[#0072BC]"
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono-code font-bold uppercase shrink-0 ${
                                  item.badgeColor || "bg-slate-700 text-white"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#526581] line-clamp-2 mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mega Menu Footer */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#526581]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono-code text-[11px]">NPCI Central Intelligence v2.4 · Switch Operational</span>
          </div>

          <Link
            to="/demo"
            onClick={onClose}
            className="text-xs font-bold text-[#0072BC] hover:underline flex items-center gap-1"
          >
            <span>Simulation Lab (/demo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
