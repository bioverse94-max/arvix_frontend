import React, { useState, useEffect } from "react";
import type { Transaction } from "../../types/transaction";
import { transactionService } from "../../services/transactionService";
import { RiskBadge } from "../common/RiskBadge";
import { StatusBadge } from "../common/StatusBadge";
import { Search, Pause, Play } from "lucide-react";

interface TransactionFeedProps {
  maxRows?: number;
  onSelectTransaction?: (tx: Transaction) => void;
  onStepUp?: (tx: Transaction) => void;
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({
  maxRows = 8,
  onSelectTransaction,
  onStepUp,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    const load = () => {
      transactionService.getTransactions().then(setTransactions);
    };

    load();
    transactionService.startLiveSimulation(3500);

    const unsub = transactionService.subscribe((newTx) => {
      setTransactions((prev) => [newTx, ...prev]);
    });

    window.addEventListener("arvix-data-refreshed", load);

    return () => {
      unsub();
      window.removeEventListener("arvix-data-refreshed", load);
      transactionService.stopLiveSimulation();
    };
  }, []);

  const toggleStream = () => {
    if (isLive) {
      transactionService.stopLiveSimulation();
      setIsLive(false);
    } else {
      transactionService.startLiveSimulation(3500);
      setIsLive(true);
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchesRisk =
      filterRisk === "ALL" ||
      (filterRisk === "HIGH_CRITICAL" && (tx.risk_level === "HIGH" || tx.risk_level === "CRITICAL")) ||
      tx.risk_level === filterRisk;

    const matchesSearch =
      !search ||
      tx.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      tx.sender_vpa.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiver_vpa.toLowerCase().includes(search.toLowerCase());

    return matchesRisk && matchesSearch;
  });

  const displayList = filtered.slice(0, maxRows);

  return (
    <div className="bg-white border border-[#E1E7ED] rounded-lg overflow-hidden shadow-2xs space-y-0">
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E1E7ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D]">
            Live UPI Transaction Stream
          </h3>
          <p className="text-xs text-[#526581]">
            Inline scoring engine · ~18.2ms latency
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleStream}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isLive
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isLive ? "Pause" : "Resume"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-2 border-b border-[#E1E7ED] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search VPA, Txn ID..."
            className="w-full text-xs pl-8 pr-2 py-1 border border-[#E1E7ED] rounded focus:outline-hidden focus:border-[#0072BC]"
          />
        </div>

        {/* Risk Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "ALL", label: "All" },
            { id: "HIGH_CRITICAL", label: "High & Critical" },
            { id: "MEDIUM", label: "Medium" },
            { id: "LOW", label: "Low" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterRisk(pill.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRisk === pill.id
                  ? "bg-[#123B63] text-white font-semibold"
                  : "bg-slate-100 text-[#526581] hover:bg-slate-200"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Institutional Table: | Time | Transaction | Amount | Risk | Status | Action | */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E1E7ED] text-[#7B8794] font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4">Transaction ID / Remitter</th>
              <th className="py-2.5 px-4">Beneficiary</th>
              <th className="py-2.5 px-4 text-right">Amount (INR)</th>
              <th className="py-2.5 px-4 text-center">Risk</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E7ED]">
            {displayList.map((tx) => (
              <tr
                key={tx.transaction_id}
                onClick={() => onSelectTransaction?.(tx)}
                className="hover:bg-[#F5F7FA] cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-4 whitespace-nowrap font-mono-code text-[11px] text-[#7B8794]">
                  {new Date(tx.timestamp).toLocaleTimeString("en-IN")}
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="font-mono-code font-bold text-xs text-[#0072BC] block">
                    {tx.transaction_id}
                  </span>
                  <span className="font-mono-code text-[11px] text-[#526581]">{tx.sender_vpa}</span>
                </td>
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <span className="font-mono-code text-xs text-[#172B4D] block truncate max-w-[140px]">
                    {tx.receiver_vpa}
                  </span>
                  <span className="text-[10px] text-[#7B8794] font-mono-code">{tx.receiver_bank}</span>
                </td>
                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                  <span className="font-mono-code font-bold text-xs text-[#172B4D]">
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center whitespace-nowrap">
                  <RiskBadge level={tx.risk_level} score={tx.risk_score} size="sm" />
                </td>
                <td className="py-2.5 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={tx.status} size="sm" />
                </td>
                <td className="py-2.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {tx.risk_score >= 40 && (
                      <button
                        onClick={() => onStepUp?.(tx)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-amber-800 bg-[#FEF7E6] border border-[#FCE2A6] rounded hover:bg-amber-100"
                      >
                        Step-Up
                      </button>
                    )}
                    <button
                      onClick={() => onSelectTransaction?.(tx)}
                      className="px-2 py-0.5 text-[11px] font-semibold text-[#0072BC] bg-[#EAF5FC] border border-[#BAE6FD] rounded hover:bg-blue-100"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TransactionFeed;
