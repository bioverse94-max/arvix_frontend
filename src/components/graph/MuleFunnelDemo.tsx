import React from "react";
import { Users, ShieldAlert, ArrowRight } from "lucide-react";

interface MuleFunnelDemoProps {
  onInspectMule?: (muleId: string) => void;
}

export const MuleFunnelDemo: React.FC<MuleFunnelDemoProps> = ({ onInspectMule }) => {
  const victims = [
    { id: "ACC_VIC_001", vpa: "vikram@okhdfc", amount: "₹48,500", time: "19:42:11", bank: "HDFC" },
    { id: "ACC_VIC_002", vpa: "ananya@axis", amount: "₹25,000", time: "19:40:05", bank: "Axis" },
    { id: "ACC_VIC_003", vpa: "dev@sbi", amount: "₹32,000", time: "19:35:50", bank: "SBI" },
    { id: "ACC_VIC_004", vpa: "amit@pnb", amount: "₹19,500", time: "19:21:10", bank: "PNB" },
    { id: "ACC_VIC_005", vpa: "kavita@bob", amount: "₹35,000", time: "19:18:02", bank: "BOB" },
    { id: "ACC_VIC_006", vpa: "sunil@canara", amount: "₹15,000", time: "19:15:22", bank: "Canara" },
  ];

  const sinks = [
    { id: "ACC_COL_001", vpa: "crypto.vault99@paytm", amount: "₹98,000", time: "19:43:20", bank: "Paytm", type: "Crypto Settlement Hub" },
    { id: "ACC_COL_002", vpa: "hawala.settle@airtel", amount: "₹70,000", time: "19:44:00", bank: "Airtel", type: "Offshore Settlement" },
  ];

  return (
    <div className="bg-white border border-[#E1E7ED] rounded-lg p-6 space-y-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E1E7ED] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#0072BC] bg-[#EAF5FC] px-2 py-0.5 rounded border border-[#BAE6FD]">
              TOPOLOGY VISUALIZATION
            </span>
            <span className="text-xs text-[#7B8794] font-mono-code">Cluster: CLUSTER_MULE_084</span>
          </div>
          <h3 className="text-base font-bold text-[#172B4D] mt-1">
            Mule Funnel Topology: Disparate Victims → Mule Choke-Point → Collection Sinks
          </h3>
          <p className="text-xs text-[#526581]">
            Direct demonstration of stranger victim remittances funneled into a single intermediary account before rapid high-value exit.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <span className="text-[10px] text-[#7B8794] uppercase block">Pass-Through Velocity</span>
            <span className="font-mono-code font-bold text-red-600">95.2% in 12.4m</span>
          </div>
          <div className="text-right border-l border-slate-200 pl-3">
            <span className="text-[10px] text-[#7B8794] uppercase block">Total Funneled</span>
            <span className="font-mono-code font-bold text-[#123B63]">₹3,48,500</span>
          </div>
        </div>
      </div>

      {/* 3-Column Visual Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Victims (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between pb-1 text-xs">
            <span className="font-bold text-[#172B4D] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0072BC]" />
              <span>Victim Senders (6 Active)</span>
            </span>
            <span className="text-[10px] text-[#7B8794] font-mono-code">Clustering: 0.02</span>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {victims.map((v) => (
              <div
                key={v.id}
                className="p-2 rounded border border-[#E1E7ED] bg-[#F5F7FA] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono-code font-medium text-[#172B4D] block">{v.vpa}</span>
                  <span className="text-[10px] text-[#7B8794] font-mono-code">{v.bank} · {v.time}</span>
                </div>
                <span className="font-mono-code font-bold text-emerald-700">{v.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Mule Choke-Point (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-lg border-2 border-red-200 bg-[#FDF0F0] text-center space-y-3">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono-code font-bold uppercase">
            <ShieldAlert className="w-3 h-3" />
            <span>MULE CHOKE-POINT</span>
          </div>

          <div>
            <span className="font-mono-code font-bold text-sm text-[#172B4D] block">
              ACC_8A91F2
            </span>
            <span className="font-mono-code text-xs text-[#0072BC] block">
              rohit.kumar@icici
            </span>
            <span className="text-xs text-[#526581]">ICICI Bank · Savings</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-red-100">
            <div className="p-1.5 bg-white rounded border border-red-100">
              <span className="text-[10px] text-[#7B8794] block">Risk Score</span>
              <strong className="font-mono-code text-red-600 font-bold">91 / 100</strong>
            </div>
            <div className="p-1.5 bg-white rounded border border-red-100">
              <span className="text-[10px] text-[#7B8794] block">Inbound Spike</span>
              <strong className="font-mono-code text-red-600 font-bold">+1,408%</strong>
            </div>
          </div>

          <button
            onClick={() => onInspectMule?.("ACC_8A91F2")}
            className="w-full py-1.5 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
          >
            <span>Inspect Forensic Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Sinks (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between pb-1 text-xs">
            <span className="font-bold text-[#172B4D]">
              Collection Sinks (2 Hubs)
            </span>
            <span className="text-[10px] text-[#7B8794]">Rapid Dispersal</span>
          </div>

          <div className="space-y-1.5">
            {sinks.map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded border border-[#E1E7ED] bg-[#F5F7FA] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-medium text-[#172B4D]">{s.vpa}</span>
                  <span className="font-mono-code font-bold text-red-600">{s.amount}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#7B8794]">
                  <span>{s.type}</span>
                  <span className="text-red-700 font-bold font-mono-code bg-red-100 px-1 rounded">
                    HELD
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 rounded bg-[#E8F8F0] border border-[#A7E3C7] text-xs text-[#168A5B]">
            <strong>Interception Verified:</strong> Outbound sweep held before settlement.
          </div>
        </div>
      </div>
    </div>
  );
};
export default MuleFunnelDemo;
