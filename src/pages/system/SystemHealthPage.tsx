import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { systemService } from "../../services/systemService";
import type { SystemEngineHealth } from "../../types/system";
import { StatusBadge } from "../../components/common/StatusBadge";

export const SystemHealthPage: React.FC = () => {
  const [engines, setEngines] = useState<SystemEngineHealth[]>([]);

  useEffect(() => {
    systemService.getEngineHealth().then(setEngines);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
              Platform System Health & Engine Telemetry
            </h1>
          </div>
          <p className="text-xs text-[#526581]">
            Real-time status of streaming ingestion pipelines, ML scoring microservices, and graph traversal engines.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse"></span>
          <span>ALL CLUSTERS OPERATIONAL</span>
        </div>
      </div>

      {/* Engine Status Cards */}
      <div className="space-y-4">
        {engines.map((eng) => (
          <div
            key={eng.name}
            className="arvix-card p-5 bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <StatusBadge status={eng.status} size="sm" />
                <span className="text-[10px] font-mono-code font-bold uppercase text-[#7B8794]">
                  {eng.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D]">{eng.name}</h3>
              <p className="text-xs text-[#526581]">{eng.notes}</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#7B8794] block">Latency</span>
                <span className="font-mono-code font-bold text-[#172B4D]">
                  {eng.latency_ms} ms
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#7B8794] block">Throughput</span>
                <span className="font-mono-code font-bold text-[#123B63]">
                  {eng.throughput_eps} eps
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#7B8794] block">Error Rate</span>
                <span className="font-mono-code font-bold text-emerald-600">
                  {(eng.error_rate * 100).toFixed(3)}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#7B8794] block">Uptime</span>
                <span className="font-mono-code font-bold text-[#172B4D]">
                  {eng.uptime_pct}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SystemHealthPage;
