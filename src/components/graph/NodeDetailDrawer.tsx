import React from "react";
import { X, ExternalLink, ShieldCheck } from "lucide-react";
import type { GraphNode } from "../../types/graph";
import { StatusBadge } from "../common/StatusBadge";
import { RiskScore } from "../common/RiskScore";

export interface NodeDetailDrawerProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectAccount?: (accountId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  isOpen,
  onClose,
  onInspectAccount,
}) => {
  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-row-insert">
      {/* Drawer Header */}
      <div className="p-4 bg-[#082A49] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono-code font-bold text-xs text-[#BAE6FD] bg-[#123B63] px-2 py-0.5 rounded">
            NODE INSPECTOR
          </span>
          <StatusBadge status={node.role === "MULE" ? "WATCHLIST" : "ACTIVE"} size="sm" />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-[#123B63] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Node Identity */}
        <div>
          <h3 className="text-base font-bold text-[#172B4D]">{node.name}</h3>
          <p className="font-mono-code text-xs text-[#0072BC]">{node.vpa}</p>
          <p className="text-xs text-[#526581] mt-0.5">{node.bank} · Role: {node.role}</p>
        </div>

        {/* Risk Score */}
        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200">
          <RiskScore
            score={node.risk_score}
            patternScore={node.risk_score}
            graphScore={node.risk_score}
            size="md"
            showBreakdown={true}
          />
        </div>

        {/* Graph Metrics */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
            Topological Graph Signals
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-[#7B8794] block">In-Degree (Remitters)</span>
              <span className="font-mono-code font-bold text-[#172B4D]">{node.in_degree} connections</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-[#7B8794] block">Out-Degree (Sinks)</span>
              <span className="font-mono-code font-bold text-[#172B4D]">{node.out_degree} connections</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-[#7B8794] block">Total Inflow</span>
              <span className="font-mono-code font-bold text-red-600">
                ₹{node.total_inflow.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-[#7B8794] block">Pass-Through Ratio</span>
              <span className="font-mono-code font-bold text-red-600">
                {(node.passthrough_ratio * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
        <button
          onClick={() => onInspectAccount?.(node.id)}
          className="flex-1 py-2 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Open Full Intelligence</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {node.role === "MULE" && (
          <button
            onClick={() => onInspectAccount?.(node.id)}
            className="py-2 px-3 bg-[#A91D2F] hover:bg-[#8A1826] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Freeze</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default NodeDetailDrawer;
