import React from "react";
import type { AnomalyMetric } from "../../types/fraud";
import { AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AccountComparisonTableProps {
  metrics: AnomalyMetric[];
  title?: string;
}

export const AccountComparisonTable: React.FC<AccountComparisonTableProps> = ({
  metrics,
  title = "Normal Baseline vs. Observed Current 24h Activity",
}) => {
  return (
    <div className="arvix-card bg-white border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-5 py-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
            {title}
          </h3>
          <p className="text-[11px] text-[#526581]">
            Side-by-side comparison of historical 90-day statistical cadence against real-time signals.
          </p>
        </div>
        <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 bg-[#EAF5FC] text-[#0072BC] rounded border border-[#BAE6FD]">
          Z-SCORE THRESHOLD 3.0σ
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#7B8794] font-semibold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Behavioral Metric</th>
              <th className="py-3 px-4">90-Day Normal Baseline</th>
              <th className="py-3 px-4">Observed Today (24h)</th>
              <th className="py-3 px-4 text-right">Deviation (%)</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono-code text-xs">
            {metrics.map((m, idx) => {
              const isPositive = m.deviationPercent > 0;

              return (
                <tr
                  key={idx}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    m.isAnomaly ? "bg-red-50/20" : ""
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-medium text-[#172B4D]">
                    {m.metric}
                  </td>
                  <td className="py-3 px-4 text-[#526581] font-semibold">
                    {m.normalBaseline}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        m.isAnomaly ? "text-red-600" : "text-[#172B4D]"
                      }`}
                    >
                      {m.currentObserved}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        m.isAnomaly
                          ? "text-red-600"
                          : isPositive
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {m.deviationPercent}%
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {m.isAnomaly ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span>ANOMALY</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>NORMAL</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AccountComparisonTable;
