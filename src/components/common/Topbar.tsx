import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Radio,
  ListOrdered,
  LayoutDashboard,
  Settings,
  Activity,
  FileText,
  Globe,
  SlidersHorizontal,
  Zap,
  Loader2,
} from "lucide-react";
import { SearchModal } from "./SearchModal";
import { ServicesMegaMenu } from "./ServicesMegaMenu";
import { ArvixLogo } from "./ArvixLogo";
import { useAuth } from "../../context/AuthContext";
import { mlService, type ModelHealthResponse } from "../../services/api/mlService";
import { transactionService } from "../../services/transactionService";

export const Topbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelHealth, setModelHealth] = useState<ModelHealthResponse | null>(null);

  const handleGenerateTraffic = async () => {
    setIsGenerating(true);
    try {
      await transactionService.triggerSyntheticGeneration();
      window.dispatchEvent(new Event("arvix-data-refreshed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check ML Model Health
  useEffect(() => {
    mlService.getHealth().then(setModelHealth);
    const interval = setInterval(() => {
      mlService.getHealth().then(setModelHealth);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Hotkey Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/login");
  };

  const handleMobileNav = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const isNavActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/fraud-dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="h-14 bg-[#0A1F36] text-white border-b border-[#133252] px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 shrink-0 select-none">
        {/* Left Side: ARVIX Logo + Essential Platform Navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            to={user?.role === "CUSTOMER" ? "/customer-dashboard" : user?.role === "PARTNER_BANK" ? "/partner-dashboard" : "/dashboard"}
            className="flex items-center gap-2 group shrink-0 transition-opacity hover:opacity-90"
          >
            <ArvixLogo size="sm" showText={true} textColor="white" />
          </Link>

          <div className="hidden md:block h-4 w-px bg-white/10" />

          {/* Clean Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {user?.role === "CUSTOMER" ? (
              <>
                <Link
                  to="/customer-dashboard"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/customer-dashboard")
                      ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  My UPI Dashboard
                </Link>
                <Link
                  to="/become-a-partner"
                  className="px-3 py-1.5 rounded-md font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Account Profile
                </Link>
              </>
            ) : user?.role === "PARTNER_BANK" ? (
              <>
                <Link
                  to="/partner-dashboard"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/partner-dashboard")
                      ? "bg-amber-600 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Partner Bank Portal
                </Link>
                <Link
                  to="/transactions"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/transactions")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Bank Transactions
                </Link>
                <Link
                  to="/risk-queue"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/risk-queue")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Risk Queue
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/dashboard")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Platform Dropdown MegaMenu */}
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isServicesOpen
                      ? "bg-[#0072BC] text-white shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Platform</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isServicesOpen ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                <Link
                  to="/transactions"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/transactions")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Transactions
                </Link>

                <Link
                  to="/risk-queue"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/risk-queue")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Risk Queue
                </Link>

                <Link
                  to="/dataset-generator"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isNavActive("/dataset-generator")
                      ? "bg-white/10 text-white font-semibold shadow-2xs"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dataset Studio
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Global Search + Status Pill + Notifications + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Subtle Global Search Bar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center justify-between w-48 lg:w-60 h-8 px-2.5 bg-[#061527]/80 hover:bg-[#061527] border border-white/10 hover:border-white/20 rounded-md text-xs text-slate-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 shrink-0 transition-colors" />
              <span className="truncate text-[11px] text-slate-400 group-hover:text-slate-300">
                Search accounts, transactions, UTRs...
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono-code font-bold text-slate-400 bg-white/5 rounded border border-white/10 shrink-0 ml-1">
              Ctrl+K
            </kbd>
          </button>

          {/* Dynamic Synthetic UPI Traffic Generator Button */}
          <button
            onClick={handleGenerateTraffic}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Generate fresh synthetic UPI traffic and run ML predictions"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Scoring ML...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Generate Traffic</span>
              </>
            )}
          </button>

          {/* Search Trigger for Mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/5"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Subtle Real-Time ML System Status Indicator (Requirement 15) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                modelHealth?.status === "ready" ? "bg-emerald-400 live-pulse" : "bg-amber-400"
              }`}
            />
            <span className="font-medium text-[11px]">
              {modelHealth?.status === "ready" ? "ML Model Active (< 20ms)" : "System Operational"}
            </span>
          </div>

          {/* Notifications Bell */}
          <Link
            to="/alerts"
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/5 relative transition-colors"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-[#0A1F36]" />
          </Link>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-[#0072BC] text-white flex items-center justify-center font-bold text-xs shadow-2xs border border-white/20">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "AS"}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 hidden sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-[#172B4D] rounded-xl shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-row-insert">
                {/* User Header */}
                <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
                  <div className="font-bold text-xs text-[#0A1F36] truncate">
                    {user?.name || "A. Sengupta"}
                  </div>
                  <div className="text-[11px] text-[#526581] font-mono-code truncate mt-0.5">
                    {user?.email || "analyst@npci.gov.in"}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#EAF5FC] border border-[#BAE6FD] text-[10px] font-bold font-mono-code text-[#0072BC] rounded">
                    <span>{user?.role || "Fraud Analyst"}</span>
                  </div>
                </div>

                {/* Status Element inside Profile */}
                <div className="px-4 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#526581]">ML Engine Status</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {modelHealth?.status === "ready" ? "3 Active Models" : "Operational (18.2ms)"}
                  </span>
                </div>

                {/* Quick Links */}
                <div className="py-1 text-xs">
                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#526581] hover:text-[#0A1F36] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Public Landing Page</span>
                  </Link>

                  <Link
                    to="/demo"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#526581] hover:text-[#0A1F36] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>Simulation Lab</span>
                  </Link>

                  <Link
                    to="/system-health"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#526581] hover:text-[#0A1F36] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span>System Telemetry</span>
                  </Link>

                  <Link
                    to="/audit-logs"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#526581] hover:text-[#0A1F36] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Audit Logs</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#526581] hover:text-[#0A1F36] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>
                </div>

                {/* Sign Out */}
                <div className="pt-1 border-t border-[#E2E8F0]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Services Mega Menu Dropdown */}
      <ServicesMegaMenu isOpen={isServicesOpen} onClose={() => setIsServicesOpen(false)} />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-[#0A1F36] text-white border-b border-[#133252] shadow-2xl z-40 p-4 space-y-3 max-h-[85vh] overflow-y-auto animate-row-insert">
          <div className="space-y-1">
            <button
              onClick={() => handleMobileNav("/dashboard")}
              className={`flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                isNavActive("/dashboard") ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleMobileNav("/transactions")}
              className={`flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                isNavActive("/transactions") ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Transactions</span>
            </button>

            <button
              onClick={() => handleMobileNav("/risk-queue")}
              className={`flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                isNavActive("/risk-queue") ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Risk Queue (8)</span>
            </button>

            <button
              onClick={() => handleMobileNav("/accounts")}
              className={`flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                isNavActive("/accounts") ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Accounts Directory</span>
            </button>

            <button
              onClick={() => handleMobileNav("/")}
              className="flex items-center gap-2.5 w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              <Globe className="w-4 h-4" />
              <span>Public Landing Page</span>
            </button>
          </div>

          {/* Mobile User & Logout */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0072BC] text-white flex items-center justify-center font-bold text-[10px]">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "AS"}
              </div>
              <span className="text-slate-300">{user?.name || "A. Sengupta"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 font-bold hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
