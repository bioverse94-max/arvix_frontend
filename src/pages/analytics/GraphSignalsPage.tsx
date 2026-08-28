import React from "react";
import { Share2 } from "lucide-react";
import { MuleFunnelDemo } from "../../components/graph/MuleFunnelDemo";

export const GraphSignalsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Graph-Based Fraud Detection & Funnel Topology Engine
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Real-time structural detection of mule funnel topologies, in-degree anomalies, betweenness centrality, and money forward velocity.
        </p>
      </div>

      {/* Feature Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="arvix-card p-4 bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono-code font-bold uppercase text-[#0072BC]">Signal 01</span>
          <h3 className="text-xs font-bold text-[#172B4D]">In-Degree Centrality Spike</h3>
          <p className="text-[11px] text-[#526581]">
            Sudden concentration of 20+ inbound transfer edges from accounts that have never interacted before.
          </p>
        </div>
        <div className="arvix-card p-4 bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono-code font-bold uppercase text-[#0072BC]">Signal 02</span>
          <h3 className="text-xs font-bold text-[#172B4D]">Near-Zero Clustering Coeff</h3>
          <p className="text-[11px] text-[#526581]">
            Remitters have 0 links between each other (0.02 vs normal 0.45), indicating disparate scam victims rather than a social group.
          </p>
        </div>
        <div className="arvix-card p-4 bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono-code font-bold uppercase text-[#0072BC]">Signal 03</span>
          <h3 className="text-xs font-bold text-[#172B4D]">Pass-Through Velocity</h3>
          <p className="text-[11px] text-[#526581]">
            Incoming funds are held for an abnormally short period (&lt; 15 mins) before 90%+ is forwarded to collection sinks.
          </p>
        </div>
        <div className="arvix-card p-4 bg-white border border-slate-200 space-y-1">
          <span className="text-[10px] font-mono-code font-bold uppercase text-[#0072BC]">Signal 04</span>
          <h3 className="text-xs font-bold text-[#172B4D]">Betweenness Funnel Index</h3>
          <p className="text-[11px] text-[#526581]">
            High betweenness centrality (0.88) acting as a choke-point bridge between victim clusters and laundering endpoints.
          </p>
        </div>
      </div>

      {/* Visual Funnel Comparison */}
      <MuleFunnelDemo />

      {/* Normal Network vs Mule Funnel Comparison Table */}
      <div className="arvix-card p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
          Graph Topology Contrast: Normal User Network vs. Mule Funnel
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#7B8794] font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Graph Metric</th>
                <th className="py-2.5 px-3">Legitimate Community Pattern</th>
                <th className="py-2.5 px-3">Mule Funnel Pattern</th>
                <th className="py-2.5 px-3">Engine Risk Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-code">
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#172B4D]">In-Degree to Out-Degree Ratio</td>
                <td className="py-2.5 px-3 text-[#526581]">Balanced (1.0 - 1.5)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">Asymmetric (14 in : 1 out)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">+28 pts</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#172B4D]">Local Clustering Coefficient</td>
                <td className="py-2.5 px-3 text-[#526581]">High (0.35 - 0.65, friends know friends)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">Near Zero (0.02, stranger victims)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">+22 pts</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-[#172B4D]">Transit Residence Time</td>
                <td className="py-2.5 px-3 text-[#526581]">Days to Weeks (Savings/Spending)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">Minutes (&lt; 15 mins)</td>
                <td className="py-2.5 px-3 text-red-600 font-bold">+25 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default GraphSignalsPage;
