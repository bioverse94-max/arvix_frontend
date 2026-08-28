import React from "react";
import { Activity } from "lucide-react";
import { PatternOfLifeChart } from "../../components/analytics/PatternOfLifeChart";
import { AccountComparisonTable } from "../../components/accounts/AccountComparisonTable";
import { mockAccounts } from "../../data/mock/accounts";

export const PatternOfLifePage: React.FC = () => {
  const muleAccount = mockAccounts[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Pattern-of-Life Anomaly Detection Engine
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Measures real-time divergence of account transaction rhythms against 90-day baseline distributions.
        </p>
      </div>

      {/* Hourly Cadence Visualization */}
      <PatternOfLifeChart />

      {/* Metrics Deviation Matrix */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
          Statistical Feature Deviations (Target Mule: {muleAccount.account_id})
        </h3>
        <AccountComparisonTable metrics={muleAccount.metrics} />
      </div>
    </div>
  );
};
export default PatternOfLifePage;
