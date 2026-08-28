import React, { useState, useEffect } from "react";
import { Search, Download, Filter, ArrowRight } from "lucide-react";
import { transactionService } from "../../services/transactionService";
import type { Transaction } from "../../types/transaction";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { KpiCard } from "../../components/common/KpiCard";
import { TransactionDetailModal } from "../../components/transactions/TransactionDetailModal";
import { StepUpModal } from "../../components/common/StepUpModal";

export const LiveTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("24H");
  const [amountFilter, setAmountFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [stepUpTx, setStepUpTx] = useState<Transaction | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  useEffect(() => {
    const load = () => {
      transactionService.getTransactions().then(setTransactions);
    };

    load();
    transactionService.startLiveSimulation(3000);

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
    if (isLiveStreaming) {
      transactionService.stopLiveSimulation();
      setIsLiveStreaming(false);
    } else {
      transactionService.startLiveSimulation(3000);
      setIsLiveStreaming(true);
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      tx.sender_vpa.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiver_vpa.toLowerCase().includes(search.toLowerCase()) ||
      tx.utr.toLowerCase().includes(search.toLowerCase()) ||
      (tx.sender_name && tx.sender_name.toLowerCase().includes(search.toLowerCase())) ||
      (tx.receiver_name && tx.receiver_name.toLowerCase().includes(search.toLowerCase()));

    const matchRisk = riskFilter === "ALL" || tx.risk_level === riskFilter;

    const matchAmount =
      amountFilter === "ALL" ||
      (amountFilter === "UNDER_10K" && tx.amount < 10000) ||
      (amountFilter === "10K_50K" && tx.amount >= 10000 && tx.amount <= 50000) ||
      (amountFilter === "OVER_50K" && tx.amount > 50000);

    const matchStatus = statusFilter === "ALL" || tx.status === statusFilter;

    return matchSearch && matchRisk && matchAmount && matchStatus;
  });

  const exportCSV = () => {
    // Attempt direct download from backend export endpoint
    window.open("/api/generator/export/csv", "_blank");
  };

  const totalCount = transactions.length;
  const highRiskCount = transactions.filter((t) => t.risk_level === "CRITICAL" || t.risk_level === "HIGH" || t.risk_score >= 50).length;
  const flaggedCount = transactions.filter((t) => t.is_fraud || t.status === "HELD_STEP_UP").length;
  const totalRiskAmount = transactions
    .filter((t) => t.risk_level === "CRITICAL" || t.risk_level === "HIGH" || t.risk_score >= 50 || t.is_fraud)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const formattedRiskAmount = totalRiskAmount >= 10000000 
    ? `₹${(totalRiskAmount / 10000000).toFixed(2)} Cr` 
    : totalRiskAmount >= 100000 
    ? `₹${(totalRiskAmount / 100000).toFixed(2)} L` 
    : totalRiskAmount > 0 
    ? `₹${totalRiskAmount.toLocaleString("en-IN")}`
    : "₹0.00";

  return (
    <div className="space-y-8">
      {/* 1. Header with Clear Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F36] tracking-tight">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-1">
            Monitor and investigate real-time UPI transaction activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStream}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              isLiveStreaming
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                : "bg-amber-50 text-amber-800 border border-amber-300"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? "bg-emerald-500 live-pulse" : "bg-amber-500"}`} />
            <span>{isLiveStreaming ? "Live Feed Ingestion Active" : "Stream Paused"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#0A1F36] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Dynamic Top Metrics (4 Clean Institutional Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          label="Total Transactions"
          value={totalCount >= 1000 ? `${(totalCount / 1000).toFixed(1)}K` : `${totalCount}`}
          trend={{ value: isLiveStreaming ? "Live Ingestion" : "Paused", isIncrease: isLiveStreaming }}
          comparison="In active dataset"
        />
        <KpiCard
          label="High-Risk Transactions"
          value={`${highRiskCount}`}
          trend={{ value: `${highRiskCount} flagged`, isIncrease: highRiskCount > 0 }}
          comparison="Requires review"
          badge="ALERT"
          badgeType="danger"
        />
        <KpiCard
          label="Flagged Today"
          value={`${flaggedCount}`}
          trend={{ value: `${flaggedCount} held/fraud`, isIncrease: flaggedCount > 0 }}
          comparison="Active watchlist"
          badge="WATCHLIST"
          badgeType="warning"
        />
        <KpiCard
          label="Amount at Risk"
          value={formattedRiskAmount}
          trend={{ value: "ML Scored", isIncrease: true }}
          comparison="Protected funds"
        />
      </div>

      {/* 3. Professional Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Transactions by ID, VPA, UTR, names..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:border-[#0072BC] focus:bg-white text-[#0A1F36] placeholder-slate-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Level */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[#0A1F36] font-medium focus:outline-hidden focus:border-[#0072BC]"
            >
              <option value="ALL">Risk Level: All</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Time Range */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[#0A1F36] font-medium focus:outline-hidden focus:border-[#0072BC]"
          >
            <option value="1H">Time: Last 1 Hour</option>
            <option value="24H">Time: Last 24 Hours</option>
            <option value="7D">Time: Last 7 Days</option>
          </select>

          {/* Amount Range */}
          <select
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[#0A1F36] font-medium focus:outline-hidden focus:border-[#0072BC]"
          >
            <option value="ALL">Amount: All</option>
            <option value="UNDER_10K">&lt; ₹10,000</option>
            <option value="10K_50K">₹10,000 - ₹50,000</option>
            <option value="OVER_50K">&gt; ₹50,000</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-[#0A1F36] font-medium focus:outline-hidden focus:border-[#0072BC]"
          >
            <option value="ALL">Status: All</option>
            <option value="CLEARED">Cleared</option>
            <option value="FLAGGED">Flagged</option>
            <option value="HELD_STEP_UP">Held Step-Up</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* 4. Main Professional Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#7B8794] font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Transaction ID / Time</th>
                <th className="py-3.5 px-4">Sender (Remitter)</th>
                <th className="py-3.5 px-4">Receiver (Beneficiary)</th>
                <th className="py-3.5 px-4 text-right">Amount (INR)</th>
                <th className="py-3.5 px-4 text-center">Risk Level</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((tx) => (
                <tr
                  key={tx.transaction_id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#0072BC] block">
                      {tx.transaction_id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code mt-0.5 block">
                      {new Date(tx.timestamp).toLocaleTimeString("en-IN")} · {tx.utr}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-[#0A1F36] block font-semibold">
                      {tx.sender_name || "Remitter Account"}
                    </strong>
                    <span className="text-[11px] text-[#526581] font-mono-code block mt-0.5">
                      {tx.sender_vpa} ({tx.sender_bank})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-[#0A1F36] block font-semibold">
                      {tx.receiver_name || "Beneficiary Account"}
                    </strong>
                    <span className="text-[11px] text-[#526581] font-mono-code block mt-0.5">
                      {tx.receiver_vpa} ({tx.receiver_bank})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#0A1F36]">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <RiskBadge level={tx.risk_level} score={tx.risk_score} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <StatusBadge status={tx.status} size="sm" />
                  </td>
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.risk_score >= 40 && (
                        <button
                          onClick={() => setStepUpTx(tx)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors cursor-pointer"
                        >
                          Step-Up
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#0072BC] bg-[#EAF5FC] hover:bg-blue-100 border border-[#BAE6FD] rounded transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-500">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#526581]">
          <span>
            Showing <strong>{filtered.length}</strong> matching transaction records
          </span>
          <span className="font-mono-code text-[11px]">
            Live feed updating every 3.0s
          </span>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onStepUp={(tx) => {
            setSelectedTx(null);
            setStepUpTx(tx);
          }}
        />
      )}

      {/* Step Up Modal */}
      {stepUpTx && (
        <StepUpModal
          isOpen={true}
          transactionId={stepUpTx.transaction_id}
          accountVpa={stepUpTx.receiver_vpa}
          amount={stepUpTx.amount}
          onClose={() => setStepUpTx(null)}
          onSuccess={() => setStepUpTx(null)}
        />
      )}
    </div>
  );
};

export default LiveTransactionsPage;
