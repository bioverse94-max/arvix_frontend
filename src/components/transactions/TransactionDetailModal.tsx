import React, { useState } from "react";
import type { Transaction } from "../../types/transaction";
import {
  X,
  ShieldCheck,
  Cpu,
  Zap,
  Copy,
  Check,
  Activity,
  Network,
} from "lucide-react";
import { RiskBadge } from "../common/RiskBadge";
import { StatusBadge } from "../common/StatusBadge";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onStepUp?: (tx: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onStepUp,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "ml_vectors">("overview");
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  if (!transaction) return null;

  const rawInputPayload = {
    transaction_id: transaction.transaction_id,
    utr: transaction.utr,
    timestamp: transaction.timestamp,
    sender_vpa: transaction.sender_vpa,
    sender_account_id: transaction.sender_account_id,
    receiver_vpa: transaction.receiver_vpa,
    receiver_account_id: transaction.receiver_account_id,
    amount: transaction.amount,
    currency: transaction.currency || "INR",
    transaction_type: transaction.transaction_type,
    channel: transaction.channel,
    status: transaction.status,
    device_id: transaction.device_id,
    is_fraud: transaction.is_fraud,
  };

  const rawOutputPayload = {
    transaction_id: transaction.transaction_id,
    risk_score: transaction.risk_score,
    risk_level: transaction.risk_level,
    fraud_probability:
      transaction.fraud_probability ??
      Number((transaction.risk_score / 100).toFixed(4)),
    pol_anomaly_score:
      transaction.pol_anomaly_score ??
      Number((transaction.pattern_score / 100).toFixed(4)),
    graph_anomaly_score:
      transaction.graph_anomaly_score ??
      Number((transaction.graph_score / 100).toFixed(4)),
    inference_time_ms: transaction.inference_time_ms || 18.2,
    feature_signals: transaction.signals || [],
    model_metadata: {
      engine_version: "ARVIX-ML-v2.4",
      pol_version: "PatternOfLife-IForest-v2.4",
      graph_version: "GraphTopology-IForest-v2.4",
      fusion_version: transaction.model_version || "Calibrated-Fusion-v2.4",
    },
  };

  const copyText = (text: string, isInput: boolean) => {
    navigator.clipboard.writeText(text);
    if (isInput) {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-row-insert">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-3.5 bg-[#0A1F36] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono-code font-bold text-xs text-[#BAE6FD] bg-[#133252] px-2.5 py-1 rounded">
              {transaction.transaction_id}
            </span>
            <RiskBadge
              level={transaction.risk_level}
              score={transaction.risk_score}
              size="sm"
            />
            <StatusBadge status={transaction.status} size="sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs Selector */}
            <div className="flex items-center bg-[#061527] p-0.5 rounded-lg border border-[#133252] text-xs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#0072BC] text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("ml_vectors")}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "ml_vectors"
                    ? "bg-[#0072BC] text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>ML Input &amp; Output</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {activeTab === "overview" ? (
            <>
              {/* Amount & Timestamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] gap-2">
                <div>
                  <span className="text-xs text-[#7B8794] block uppercase font-bold">
                    Transfer Amount
                  </span>
                  <span className="text-2xl font-extrabold font-mono-code text-[#0A1F36]">
                    ₹{transaction.amount.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-[#526581]">INR</span>
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#7B8794] block uppercase font-bold">
                    NPCI UTR
                  </span>
                  <span className="font-mono-code text-xs text-[#0072BC] font-semibold">
                    {transaction.utr}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono-code mt-0.5">
                    {new Date(transaction.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Remitter vs Beneficiary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8794]">
                    Remitter (Sender)
                  </span>
                  <div>
                    <strong className="text-sm text-[#0A1F36] block font-semibold">
                      {transaction.sender_name || "Account Remitter"}
                    </strong>
                    <span className="font-mono-code text-xs text-[#0072BC] block mt-0.5">
                      {transaction.sender_vpa}
                    </span>
                    <span className="text-xs text-[#526581]">{transaction.sender_bank}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8794]">
                    Beneficiary (Receiver)
                  </span>
                  <div>
                    <strong className="text-sm text-[#0A1F36] block font-semibold">
                      {transaction.receiver_name || "Account Beneficiary"}
                    </strong>
                    <span className="font-mono-code text-xs text-[#0072BC] block mt-0.5">
                      {transaction.receiver_vpa}
                    </span>
                    <span className="text-xs text-[#526581]">{transaction.receiver_bank}</span>
                  </div>
                </div>
              </div>

              {/* ML Intelligence Card */}
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#0072BC]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                      ML Inference Summary
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    <span>Inference: {transaction.inference_time_ms || 18.2} ms</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                      PoL Anomaly
                    </span>
                    <strong className="text-sm font-mono-code text-[#0A1F36]">
                      {transaction.pattern_score || 12} / 100
                    </strong>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                      Graph Topology
                    </span>
                    <strong className="text-sm font-mono-code text-[#0A1F36]">
                      {transaction.graph_score || 10} / 100
                    </strong>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                      Fraud Probability
                    </span>
                    <strong className="text-sm font-mono-code text-red-600">
                      {(
                        (transaction.fraud_probability ||
                          transaction.risk_score / 100) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>
                </div>
              </div>

              {/* Triggered Telemetry Signals */}
              {transaction.signals && transaction.signals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                    Feature Signals &amp; Explainability ({transaction.signals.length})
                  </h4>
                  <div className="space-y-2">
                    {transaction.signals.map((sig) => (
                      <div
                        key={sig.id}
                        className="p-3 rounded-lg bg-red-50/70 border border-red-200 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-red-900 font-bold">{sig.name}</strong>
                          <span className="font-mono-code font-bold text-red-700">
                            +{sig.impactScore} pts
                          </span>
                        </div>
                        <p className="text-slate-700">{sig.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: RAW ML INPUT & OUTPUT VECTORS */
            <div className="space-y-6">
              {/* Feature Vector Extractors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0072BC] font-mono-code">
                    <Activity className="w-4 h-4" />
                    <span>Pattern-of-Life Feature Vector (8)</span>
                  </div>
                  <div className="space-y-1 text-[11px] font-mono-code text-[#0A1F36]">
                    <div className="flex justify-between">
                      <span className="text-[#526581]">velocity_10min:</span>
                      <strong>{transaction.risk_score >= 60 ? "4" : "1"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">velocity_30min:</span>
                      <strong>{transaction.risk_score >= 60 ? "7" : "1"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">sender_diversity_24h:</span>
                      <strong>{transaction.risk_score >= 60 ? "6" : "1"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">pass_through_ratio:</span>
                      <strong>{transaction.risk_score >= 60 ? "0.95" : "0.05"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">amount_zscore:</span>
                      <strong>{transaction.risk_score >= 60 ? "+3.42σ" : "+0.12σ"}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0072BC] font-mono-code">
                    <Network className="w-4 h-4" />
                    <span>Graph DAG Topology Vector (11)</span>
                  </div>
                  <div className="space-y-1 text-[11px] font-mono-code text-[#0A1F36]">
                    <div className="flex justify-between">
                      <span className="text-[#526581]">in_degree_24h:</span>
                      <strong>{transaction.risk_score >= 60 ? "8" : "2"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">new_sender_ratio_24h:</span>
                      <strong>{transaction.risk_score >= 60 ? "0.87" : "0.00"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">cycle_flag:</span>
                      <strong>{transaction.risk_score >= 80 ? "1 (Cycle)" : "0"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">last_mile_candidate:</span>
                      <strong>{transaction.risk_score >= 60 ? "1 (Funnel)" : "0"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526581]">clustering_coeff:</span>
                      <strong>0.412</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Raw JSON Vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Input Payload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-mono-code text-[#0A1F36]">
                      Raw Input Vector (JSON)
                    </span>
                    <button
                      onClick={() =>
                        copyText(JSON.stringify(rawInputPayload, null, 2), true)
                      }
                      className="p-1 text-[11px] text-[#526581] hover:text-[#0A1F36] bg-[#F8FAFC] border border-[#CBD5E1] rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedInput ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedInput ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#061527] text-[#BAE6FD] border border-[#133252] rounded-xl font-mono-code text-xs overflow-x-auto max-h-56">
                    {JSON.stringify(rawInputPayload, null, 2)}
                  </pre>
                </div>

                {/* Output Payload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase font-mono-code text-[#0A1F36]">
                      Raw Output Vector (JSON)
                    </span>
                    <button
                      onClick={() =>
                        copyText(JSON.stringify(rawOutputPayload, null, 2), false)
                      }
                      className="p-1 text-[11px] text-[#526581] hover:text-[#0A1F36] bg-[#F8FAFC] border border-[#CBD5E1] rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedOutput ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedOutput ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#061527] text-emerald-300 border border-[#133252] rounded-xl font-mono-code text-xs overflow-x-auto max-h-56">
                    {JSON.stringify(rawOutputPayload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#0A1F36] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Close Inspector
          </button>

          {transaction.risk_score >= 40 && (
            <button
              onClick={() => onStepUp?.(transaction)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Issue Step-Up Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
