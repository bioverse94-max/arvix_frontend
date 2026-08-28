import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Network,
  Clock,
  ArrowRight,
} from "lucide-react";
import { accountService } from "../../services/accountService";
import type { AccountProfile } from "../../types/account";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { AccountComparisonTable } from "../../components/accounts/AccountComparisonTable";
import { ExplainabilityPanel } from "../../components/common/ExplainabilityPanel";
import { StepUpModal } from "../../components/common/StepUpModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export const AccountIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountProfile | null>(null);
  const [allAccounts, setAllAccounts] = useState<AccountProfile[]>([]);
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [isFreezeOpen, setIsFreezeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    accountService.getAccounts().then((list) => {
      setAllAccounts(list);
      const targetId = id || "ACC_8A91F2";
      const found = list.find((a) => a.account_id === targetId || a.vpa === targetId) || list[0];
      setAccount(found);
    });
  }, [id]);

  if (!account) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs font-mono-code">
        Loading Account Intelligence Dossier...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1F36] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#0072BC] flex items-center gap-2.5 text-xs font-semibold animate-row-insert">
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Header with Breadcrumbs and Clear Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/accounts")}
            className="p-2 text-[#526581] hover:text-[#0A1F36] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Back to Accounts Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[#0A1F36] tracking-tight">
                Account Intelligence
              </h1>
              <span className="font-mono-code font-bold text-sm text-[#0072BC] bg-[#EAF5FC] px-2.5 py-0.5 rounded-md border border-[#BAE6FD]">
                {account.account_id}
              </span>
              <StatusBadge status={account.status} size="sm" />
            </div>
            <p className="text-xs text-[#526581] font-mono-code mt-0.5">
              {account.vpa} · {account.holder_name} · {account.bank_name}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsStepUpOpen(true)}
            className="px-4 py-2 bg-[#FEF7E6] hover:bg-amber-100 text-amber-900 border border-[#FCE2A6] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Step-Up Verification</span>
          </button>

          <button
            onClick={() => setIsFreezeOpen(true)}
            className="px-4 py-2 bg-[#A91D2F] hover:bg-[#8A1826] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Regulatory Freeze</span>
          </button>
        </div>
      </div>

      {/* Account Selector Pill Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allAccounts.map((a) => (
          <button
            key={a.account_id}
            onClick={() => {
              setAccount(a);
              navigate(`/accounts/${a.account_id}`);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-colors cursor-pointer ${
              account.account_id === a.account_id
                ? "bg-[#0A1F36] text-white font-bold border-[#0A1F36] shadow-2xs"
                : "bg-white text-[#526581] border-[#CBD5E1] hover:bg-slate-50"
            }`}
          >
            <span className="font-mono-code">{a.account_id}</span> ({a.role})
          </button>
        ))}
      </div>

      {/* 2. Primary Risk Score Hero Banner (Clean, Large, Section 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Risk Score Card */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
              Composite Fraud Risk
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl font-extrabold font-mono-code text-red-600">
                {account.risk_score}
              </span>
              <span className="text-sm font-mono-code text-[#7B8794]">/ 100</span>
              <RiskBadge level={account.risk_level} score={account.risk_score} size="md" />
            </div>
            <p className="text-xs text-[#526581] mt-2">
              Calibrated composite score reflecting high-velocity behavioral divergence and funnel topology.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                Pattern Divergence
              </span>
              <span className="text-base font-bold font-mono-code text-[#0A1F36]">
                {account.risk_breakdown.patternOfLifeScore} / 100
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                Graph Centrality
              </span>
              <span className="text-base font-bold font-mono-code text-[#0A1F36]">
                {account.risk_breakdown.graphRiskScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* 3. Human-Readable "Why Flagged" Reason Cards (Requirement 17) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code pb-2 border-b border-[#E2E8F0]">
              Why This Account Was Flagged
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3">
              {/* Reason 1 */}
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#A91D2F]">
                  <Activity className="w-4 h-4 shrink-0" />
                  <strong className="text-xs font-bold">Unusual Inbound Activity</strong>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  31 unique senders recorded today, compared with a historical 90-day baseline average of 3 contacts.
                </p>
              </div>

              {/* Reason 2 */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <strong className="text-xs font-bold">Rapid Fund Movement</strong>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  95% of received funds (₹72,400) forwarded within 12 minutes to high-degree sweep collectors.
                </p>
              </div>

              {/* Reason 3 */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-950">
                  <Network className="w-4 h-4 shrink-0 text-indigo-600" />
                  <strong className="text-xs font-bold">Suspicious Funnel Cluster</strong>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Direct topology link to high-risk laundering syndicate cluster CLUSTER_DELHI_04.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#526581]">
            <span>Automated alert triggered by Inline AI Switch Model v2.4</span>
            <button
              onClick={() => navigate("/graph")}
              className="text-xs font-bold text-[#0072BC] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Account in Graph Visualizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Normal Baseline vs 24h Observed Comparison Table */}
      <AccountComparisonTable metrics={account.metrics} />

      {/* 5. SHAP Explainability Breakdown */}
      <ExplainabilityPanel
        riskScore={account.risk_score}
        breakdown={account.risk_breakdown}
        entityName={`Account ${account.account_id} (${account.vpa})`}
      />

      {/* Modals */}
      {isStepUpOpen && (
        <StepUpModal
          isOpen={true}
          transactionId="TXN_STEP_MANUAL"
          accountVpa={account.vpa}
          amount={account.current_24h_stats.today_inflow}
          onClose={() => setIsStepUpOpen(false)}
          onSuccess={() => {
            setToast(`Step-Up challenge successfully dispatched to ${account.vpa}`);
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}

      {isFreezeOpen && (
        <ConfirmDialog
          isOpen={true}
          title="Authorize Regulatory Account Freeze"
          description={`Placing account ${account.account_id} (${account.vpa}) on immediate administrative hold under RBI compliance directives.`}
          targetId={account.account_id}
          actionLabel="Authorize Regulatory Freeze"
          confirmVariant="danger"
          onClose={() => setIsFreezeOpen(false)}
          onConfirm={() => {
            accountService.updateAccountStatus(account.account_id, "FROZEN");
            setAccount({ ...account, status: "FROZEN" });
            setIsFreezeOpen(false);
            setToast(`Account ${account.account_id} placed on regulatory freeze.`);
            setTimeout(() => setToast(null), 3000);
          }}
        />
      )}
    </div>
  );
};

export default AccountIntelligencePage;
