import React from "react";
import { Clock } from "lucide-react";

export const InvestigationTimelinePage: React.FC = () => {
  const events = [
    {
      time: "19:44:00",
      actor: "Risk Scoring Engine",
      title: "Outbound Sweep Intercepted on Threshold (Score 96)",
      details: "Transaction TXN_33D810B2 (₹98,000) from ACC_8A91F2 held under rule 'High-Velocity Siphon to Crypto Hub'.",
      type: "ACTION",
    },
    {
      time: "19:42:15",
      actor: "Abhirup Sengupta (Fraud Lead)",
      title: "Case CASE_UPI_2026_8492 Assigned to Self",
      details: "Initiated multi-bank coordination with ICICI Bank and Paytm Payments Bank desks.",
      type: "INVESTIGATOR",
    },
    {
      time: "19:42:12",
      actor: "Graph Topology Engine",
      title: "Syndicate Funnel Identified: CLUSTER_MULE_084",
      details: "6 distinct victim nodes feeding ACC_8A91F2 with betweenness centrality 0.88.",
      type: "SYSTEM",
    },
    {
      time: "19:30:15",
      actor: "Risk Gateway",
      title: "Step-Up Authentication Dispatched (Score 54)",
      details: "Pushed FIDO biometric challenge for ₹14,500 merchant transfer.",
      type: "ACTION",
    },
    {
      time: "19:15:00",
      actor: "Pattern-of-Life Model",
      title: "Account ACC_8A91F2 Inbound Diversity Exceeded 8.0 Z-score",
      details: "5 distinct unrelated remitters recorded within 45-minute window.",
      type: "DETECTION",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Chronological Fraud Investigation Timeline
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Unified cross-switch incident trajectory tracking detection, ML scoring changes, and analyst interventions.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="arvix-card p-6 bg-white border border-slate-200">
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {events.map((ev, i) => (
            <div key={i} className="relative">
              <span
                className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                  ev.type === "ACTION"
                    ? "bg-red-600"
                    : ev.type === "INVESTIGATOR"
                    ? "bg-[#0072BC]"
                    : "bg-amber-500"
                }`}
              />
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono-code font-bold text-[#123B63]">{ev.time}</span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-slate-500">{ev.actor}</span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D] mt-0.5">{ev.title}</h3>
              <p className="text-xs text-[#526581] mt-1 leading-relaxed">{ev.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default InvestigationTimelinePage;
