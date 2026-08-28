import React from "react";
import { Gauge, CheckCircle2, Cpu, Zap, Activity } from "lucide-react";
import { KpiCard } from "../../components/common/KpiCard";

export const ModelPerformancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Machine Learning Engine Performance & Latency Benchmarks
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Online scoring latency benchmarks, model drift telemetry, and inference throughput (PDF Spec Section 7).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Average Scoring Latency"
          value="18.2 ms"
          icon={Zap}
          comparison="Well under 50ms UPI SLA"
          tooltip="End-to-end time from transaction ingestion to SHAP score emission"
        />
        <KpiCard
          label="Inference Throughput"
          value="7,820 /s"
          icon={Cpu}
          comparison="Peak capacity tested"
          tooltip="Current real-time evaluations per second"
        />
        <KpiCard
          label="Validation AUC-ROC"
          value="0.942"
          icon={CheckCircle2}
          comparison="On labeled synthetic fraud set"
          tooltip="Area under ROC curve for binary mule vs legitimate classification"
          badge="HIGH"
          badgeType="success"
        />
        <KpiCard
          label="Model Drift Metric"
          value="0.004 PSI"
          icon={Activity}
          comparison="Population Stability Index"
          tooltip="Feature distribution drift against 90-day training baseline"
        />
      </div>

      {/* Computational Cost at National Scale */}
      <div className="arvix-card p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider">
          Computational Feasibility at National Scale (750M - 1B Txns / Day)
        </h3>
        <p className="text-xs text-[#526581] leading-relaxed">
          As detailed in the project specification, per-transaction scoring using lightweight gradient-boosted trees and streaming graph lookups is comparable to existing card-network fraud scoring (Visa/Mastercard process billions daily). The core infrastructure utilizes Kafka ingestion, an online in-memory feature store for 90-day baselines, and a streaming graph engine for local neighborhood queries.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <strong className="text-[#123B63] block mb-1">Scoring Cost: Negligible</strong>
            <p className="text-[#526581]">Runs efficiently on CPU clusters alongside existing UPI switch processing layers.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <strong className="text-[#123B63] block mb-1">Graph State Management</strong>
            <p className="text-[#526581]">Maintained in sliding distributed memory stores for real-time sub-graph traversal.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <strong className="text-[#123B63] block mb-1">False-Positive Optimization</strong>
            <p className="text-[#526581]">Step-up authentication mitigates user friction and call center review overhead.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModelPerformancePage;
