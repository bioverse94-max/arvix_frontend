import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { PrecisionRecallCurve } from "../../components/analytics/PrecisionRecallCurve";
import { ExplainabilityPanel } from "../../components/common/ExplainabilityPanel";
import { MLModelInspector } from "../../components/ml/MLModelInspector";

export const RiskModelPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#0A1F36]">
            ML Risk Model Architecture &amp; Live Inference Engine
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Dual-signal fusion scoring combining Pattern-of-Life (PoL), Graph Topology DAGs, and Calibrated Supervised Fusion.
        </p>
      </div>

      {/* Real-time ML Input/Output Inspector */}
      <MLModelInspector />

      {/* Model Fusion Formula Card */}
      <div className="bg-[#0A1F36] text-white border border-[#133252] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#133252]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#BAE6FD] font-mono-code">
            Fused Risk Function Mathematical Specification
          </h3>
          <span className="text-xs font-mono-code text-emerald-400 font-bold">
            Calibrated Precision Target: 95%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#061527] border border-[#133252] text-center font-mono-code text-sm sm:text-base text-[#BAE6FD]">
          RiskScore = 0.50 × max(PoL, Graph) + 0.30 × (PoL × Graph) + 0.20 × (PoL + Graph)/2
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#0F2D4A] border border-[#133252]">
            <span className="text-[10px] text-slate-300 block">Pattern-of-Life Max Weight</span>
            <strong className="text-white font-mono-code">50% (0.50)</strong>
          </div>
          <div className="p-3 rounded-lg bg-[#0F2D4A] border border-[#133252]">
            <span className="text-[10px] text-slate-300 block">Interaction Product</span>
            <strong className="text-white font-mono-code">30% (0.30)</strong>
          </div>
          <div className="p-3 rounded-lg bg-[#0F2D4A] border border-[#133252]">
            <span className="text-[10px] text-slate-300 block">Average Ensemble Weight</span>
            <strong className="text-white font-mono-code">20% (0.20)</strong>
          </div>
          <div className="p-3 rounded-lg bg-[#0F2D4A] border border-[#133252]">
            <span className="text-[10px] text-slate-300 block">Anomaly Threshold</span>
            <strong className="text-white font-mono-code">Score ≥ 60.0</strong>
          </div>
        </div>
      </div>

      {/* SHAP Explainability Breakdown */}
      <ExplainabilityPanel riskScore={80} entityName="Aggregator Mule Account (rohit.kumar@icici)" />

      {/* Precision-Recall Curve & Operating Points */}
      <PrecisionRecallCurve />
    </div>
  );
};

export default RiskModelPage;
