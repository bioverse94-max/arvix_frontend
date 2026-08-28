import React, { useState, useEffect } from "react";
import { ShieldAlert, Search } from "lucide-react";
import { accountService } from "../../services/accountService";
import type { AccountProfile } from "../../types/account";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

export const MuleAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountProfile[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    accountService.getMuleAccounts().then(setAccounts);
  }, []);

  const filtered = accounts.filter(
    (acc) =>
      !search ||
      acc.account_id.toLowerCase().includes(search.toLowerCase()) ||
      acc.vpa.toLowerCase().includes(search.toLowerCase()) ||
      acc.holder_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
              Flagged Mule Accounts & Syndicate Watchlist
            </h1>
          </div>
          <p className="text-xs text-[#526581]">
            Accounts exhibiting high betweenness centrality, abnormal sender diversity, and rapid pass-through velocity.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="arvix-card p-4 bg-white border border-slate-200 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mule accounts by ID, VPA, name..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]"
          />
        </div>
      </div>

      {/* Mule Accounts Table */}
      <div className="arvix-card bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#7B8794] font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Account ID / VPA</th>
                <th className="py-3 px-4">Holder Name & Bank</th>
                <th className="py-3 px-4">24h Inflow Volume</th>
                <th className="py-3 px-4">Unique Senders</th>
                <th className="py-3 px-4">Pass-Through</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((acc) => (
                <tr
                  key={acc.account_id}
                  onClick={() => navigate(`/accounts/${acc.account_id}`)}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#0072BC] block">
                      {acc.account_id}
                    </span>
                    <span className="font-mono-code text-[11px] text-slate-500">{acc.vpa}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-[#172B4D] block">{acc.holder_name}</strong>
                    <span className="text-[10px] text-[#7B8794] font-mono-code">{acc.bank_name}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-red-600">
                      ₹{acc.current_24h_stats.today_inflow.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#172B4D]">
                      {acc.current_24h_stats.today_unique_senders} senders
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-red-600 block">
                      {(acc.current_24h_stats.current_passthrough_ratio * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      in {acc.current_24h_stats.avg_forward_time_mins}m
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <RiskBadge level={acc.risk_level} score={acc.risk_score} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <StatusBadge status={acc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button className="px-3 py-1 bg-[#EAF5FC] text-[#0072BC] hover:bg-[#0072BC] hover:text-white rounded text-[11px] font-bold transition-all">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default MuleAccountsPage;
