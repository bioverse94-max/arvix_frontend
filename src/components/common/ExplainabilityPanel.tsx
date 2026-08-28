import React from "react";
import type { RiskBreakdown } from "../../types/fraud";

interface ExplainabilityPanelProps {
  riskScore: number;
  breakdown?: RiskBreakdown;
  entityName?: string;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  riskScore,
  breakdown,
  entityName = "ACC_8A91F2",
}) => {
  const defaultReasons = [
    {
      title: "Unusual inbound activity",
      detail: "31 unique senders today (historical baseline: 2–3 regular contacts).",
      score: "+27",
    },
    {
      title: "High pass-through ratio",
      detail: "95% of funds forwarded within 12 minutes of receipt.",
      score: "+23",
    },
    {
      title: "Network anomaly",
      detail: "Account connected as central choke-point in cluster CLUSTER_MULE_084.",
      score: "+19",
    },
    {
      title: "Burst velocity",
      detail: "18 inbound transactions completed within a 12-minute window.",
      score: "+14",
    },
  ];

  const reasons = breakdown?.shapContributions?.map((c) => ({
    title: c.feature,
    detail: `${c.description}. Observed: ${c.observed} (Baseline: ${c.baseline})`,
    score: c.contribution > 0 ? `+${c.contribution}` : `${c.contribution}`,
  })) || defaultReasons;

  const riskLabel = riskScore >= 85 ? "CRITICAL" : riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";
  const badgeClass =
    riskScore >= 85
      ? "bg-[#FCEAEB] text-[#A91D2F] border-[#F5A3AE]"
      : riskScore >= 70
      ? "bg-[#FDF0F0] text-[#D64545] border-[#F8BABA]"
      : riskScore >= 40
      ? "bg-[#FEF7E6] text-[#D99000] border-[#FCE2A6]"
      : "bg-[#E8F8F0] text-[#168A5B] border-[#A7E3C7]";

  return (
    <div className="bg-white border border-[#E1E7ED] rounded-lg p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E1E7ED]">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D]">
            Why was this flagged?
          </h3>
          <p className="text-xs text-[#526581]">
            Deterministic signal attribution for <span className="font-mono-code font-semibold">{entityName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono-code font-bold px-2.5 py-1 rounded border ${badgeClass}`}>
            Risk Score: {riskScore} — {riskLabel}
          </span>
        </div>
      </div>

      {/* Clean List of Reasons */}
      <div className="space-y-2.5">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="p-3 rounded-md bg-[#F5F7FA] border border-[#E1E7ED] flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <strong className="text-[#172B4D] block font-semibold">{r.title}</strong>
              <p className="text-[#526581] leading-relaxed">{r.detail}</p>
            </div>
            <span className="font-mono-code font-bold text-red-600 shrink-0">
              {r.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExplainabilityPanel;
