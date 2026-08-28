import React, { useState, useEffect } from "react";
import { Search, ShieldAlert, CheckCircle2, ArrowUpDown } from "lucide-react";
import { alertService } from "../../services/alertService";
import { accountService } from "../../services/accountService";
import { systemService } from "../../services/systemService";
import type { FraudAlert } from "../../types/fraud";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { StepUpModal } from "../../components/common/StepUpModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

export const RiskQueuePage: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"SCORE_DESC" | "TIME_DESC" | "AMOUNT_DESC">("SCORE_DESC");
  const [stepUpAlert, setStepUpAlert] = useState<FraudAlert | null>(null);
  const [freezeAlert, setFreezeAlert] = useState<FraudAlert | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAlerts = () => {
      alertService.getAlerts().then(setAlerts);
    };
    loadAlerts();
    window.addEventListener("arvix-data-refreshed", loadAlerts);
    return () => {
      window.removeEventListener("arvix-data-refreshed", loadAlerts);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStepUpSuccess = () => {
    if (stepUpAlert) {
      alertService.updateAlertStatus(stepUpAlert.alert_id, "STEP_UP_SENT");
      systemService.addAuditLog({
        actor_id: "ANALYST_QUEUE",
        actor_name: "Abhirup Sengupta",
        action_type: "STEP_UP_REQUEST",
        target_id: stepUpAlert.transaction_id,
        target_type: "TRANSACTION",
        ip_address: "192.168.1.104",
        details: `Step-Up verification sent for Alert ${stepUpAlert.alert_id}`,
        auth_confirmed: true,
      });
      showToast(`Step-Up challenge successfully sent for ${stepUpAlert.account_vpa}`);
      setStepUpAlert(null);
    }
  };

  const handleFreezeConfirm = (reason: string) => {
    if (freezeAlert) {
      accountService.updateAccountStatus(freezeAlert.account_id, "FROZEN");
      alertService.updateAlertStatus(freezeAlert.alert_id, "ESCALATED");
      systemService.addAuditLog({
        actor_id: "ANALYST_QUEUE",
        actor_name: "Abhirup Sengupta",
        action_type: "FREEZE_ACCOUNT",
        target_id: freezeAlert.account_id,
        target_type: "ACCOUNT",
        ip_address: "192.168.1.104",
        details: `Account ${freezeAlert.account_id} frozen from risk queue. Justification: ${reason}`,
        auth_confirmed: true,
      });
      showToast(`Account ${freezeAlert.account_id} placed on regulatory freeze.`);
      setFreezeAlert(null);
    }
  };

  const filtered = alerts
    .filter((a) => {
      const matchSearch =
        !search ||
        a.alert_id.toLowerCase().includes(search.toLowerCase()) ||
        a.account_vpa.toLowerCase().includes(search.toLowerCase()) ||
        a.primary_reason.toLowerCase().includes(search.toLowerCase()) ||
        a.bank_name.toLowerCase().includes(search.toLowerCase());

      const matchLevel = levelFilter === "ALL" || a.risk_level === levelFilter;
      return matchSearch && matchLevel;
    })
    .sort((a, b) => {
      if (sortBy === "SCORE_DESC") return b.risk_score - a.risk_score;
      if (sortBy === "AMOUNT_DESC") return b.amount - a.amount;
      return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
    });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1F36] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#0072BC] flex items-center gap-2.5 text-xs font-semibold animate-row-insert">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F36] tracking-tight">
            Risk Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-1">
            Prioritized triage of high-risk transactions and funnel anomalies awaiting analyst review.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#0A1F36] bg-white border border-[#CBD5E1] px-3.5 py-2 rounded-lg shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>{alerts.filter((a) => a.risk_score >= 70).length} High &amp; Critical Queue Items</span>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search risk queue by VPA, reason, bank..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:border-[#0072BC] focus:bg-white text-[#0A1F36] placeholder-slate-400"
          />
        </div>

        {/* Level Filters & Sort Options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  levelFilter === lvl
                    ? "bg-white text-[#0A1F36] shadow-2xs font-bold"
                    : "text-[#526581] hover:text-[#0A1F36]"
                }`}
              >
                {lvl === "ALL" ? "All Levels" : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#526581]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-[#0A1F36] font-medium focus:outline-hidden focus:border-[#0072BC]"
            >
              <option value="SCORE_DESC">Sort: Highest Risk Score</option>
              <option value="AMOUNT_DESC">Sort: Highest Amount</option>
              <option value="TIME_DESC">Sort: Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Queue Cards */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.alert_id}
            className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0072BC]/50 transition-all"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                  {alert.alert_id}
                </span>
                <StatusBadge status={alert.status} size="sm" />
                <span className="text-[11px] text-[#7B8794] font-mono-code">
                  {new Date(alert.detected_at).toLocaleTimeString("en-IN")}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#0A1F36]">
                {alert.primary_reason}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#526581]">
                <span>
                  Target VPA: <strong className="font-mono-code text-[#0A1F36]">{alert.account_vpa}</strong>
                </span>
                <span>
                  Bank: <strong className="text-[#0A1F36]">{alert.bank_name}</strong>
                </span>
                <span>
                  Amount: <strong className="font-mono-code text-red-600 font-bold">₹{alert.amount.toLocaleString("en-IN")}</strong>
                </span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-4 shrink-0">
              <RiskBadge level={alert.risk_level} score={alert.risk_score} size="md" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStepUpAlert(alert)}
                  className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Step-Up
                </button>
                <button
                  onClick={() => setFreezeAlert(alert)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#A91D2F] hover:bg-[#8A1826] rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Freeze
                </button>
                <button
                  onClick={() => navigate(`/accounts/${alert.account_id}`)}
                  className="px-3.5 py-2 text-xs font-bold text-[#0072BC] bg-[#EAF5FC] hover:bg-[#0072BC] hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0] space-y-2">
            <h4 className="text-sm font-bold text-[#0A1F36]">No High-Risk Activity</h4>
            <p className="text-xs text-[#526581]">
              No suspicious transactions match the selected filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {stepUpAlert && (
        <StepUpModal
          isOpen={true}
          transactionId={stepUpAlert.transaction_id}
          accountVpa={stepUpAlert.account_vpa}
          amount={stepUpAlert.amount}
          onClose={() => setStepUpAlert(null)}
          onSuccess={handleStepUpSuccess}
        />
      )}

      {freezeAlert && (
        <ConfirmDialog
          isOpen={true}
          title="Confirm Account Freeze from Risk Queue"
          description={`Freezing account ${freezeAlert.account_id} (${freezeAlert.account_vpa}). Outbound transfers will be held under compliance.`}
          targetId={freezeAlert.account_id}
          actionLabel="Authorize Regulatory Freeze"
          confirmVariant="danger"
          onClose={() => setFreezeAlert(null)}
          onConfirm={handleFreezeConfirm}
        />
      )}
    </div>
  );
};

export default RiskQueuePage;
