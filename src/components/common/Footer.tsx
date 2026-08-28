import React from "react";
import { Link } from "react-router-dom";
import { ArvixLogo } from "./ArvixLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1F36] text-white border-t border-[#133252] mt-auto">
      {/* Top Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <ArvixLogo size="sm" showText={true} textColor="white" />
            </Link>
            <p className="text-xs text-[#B8CCE0] leading-relaxed max-w-sm">
              Intelligence for safer financial networks. Continuous transaction monitoring, anomaly detection, and rapid intervention designed for modern payment ecosystems.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#A0B8D0] font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Enterprise-Grade Security · Regulatory Compliant</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono-code">
              Platform
            </h4>
            <ul className="space-y-2 text-[#B8CCE0]">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Fraud Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-white transition-colors">
                  Live Transactions
                </Link>
              </li>
              <li>
                <Link to="/risk-queue" className="hover:text-white transition-colors">
                  Analyst Risk Queue
                </Link>
              </li>
              <li>
                <Link to="/accounts" className="hover:text-white transition-colors">
                  Account Dossiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono-code">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-[#B8CCE0]">
              <li>
                <Link to="/partners" className="hover:text-white transition-colors">
                  Partner Network
                </Link>
              </li>
              <li>
                <Link to="/graph" className="hover:text-white transition-colors">
                  Transaction Graph
                </Link>
              </li>
              <li>
                <Link to="/clusters" className="hover:text-white transition-colors">
                  Fraud Clusters
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-white transition-colors">
                  Simulation Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & System */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono-code">
              Governance
            </h4>
            <ul className="space-y-2 text-[#B8CCE0]">
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  Regulatory Reports
                </Link>
              </li>
              <li>
                <Link to="/system-health" className="hover:text-white transition-colors">
                  System Telemetry
                </Link>
              </li>
              <li>
                <Link to="/audit-logs" className="hover:text-white transition-colors">
                  Audit Logs
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-[#133252] bg-[#061527] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} ARVIX Financial Intelligence. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/partners" className="hover:text-slate-300 transition-colors">
              Partners
            </Link>
            <span>·</span>
            <Link to="/dashboard" className="hover:text-slate-300 transition-colors">
              Platform Console
            </Link>
            <span>·</span>
            <span className="text-slate-400">Institutional Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
