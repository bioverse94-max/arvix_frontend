import React, { useState, useEffect } from "react";
import { CheckSquare, Lock } from "lucide-react";
import { systemService } from "../../services/systemService";
import type { AuditLogEntry } from "../../types/system";

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search] = useState("");

  useEffect(() => {
    systemService.getAuditLogs().then(setLogs);
  }, []);

  const filtered = logs.filter(
    (l) =>
      !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      l.target_id.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Compliance & Intervention Audit Logs
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Cryptographically immutable audit trail for analyst reviews, step-up challenges, and account freezes.
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="arvix-card bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#7B8794] font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Audit ID / Timestamp</th>
                <th className="py-3 px-4">Investigator / Actor</th>
                <th className="py-3 px-4">Action Executed</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Justification & Compliance Notes</th>
                <th className="py-3 px-4 text-center">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#123B63] block">
                      {entry.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      {new Date(entry.timestamp).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <strong className="text-[#172B4D] block">{entry.actor_name}</strong>
                    <span className="text-[10px] text-[#7B8794] font-mono-code">{entry.ip_address}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {entry.action_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono-code font-semibold text-[#172B4D]">
                      {entry.target_id}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{entry.target_type}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#526581] max-w-sm">
                    {entry.details}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AuditLogsPage;
