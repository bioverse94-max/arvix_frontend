import React, { useState, useEffect } from "react";
import { Briefcase, Search, ArrowRight, User } from "lucide-react";
import { caseService } from "../../services/caseService";
import type { FraudCase } from "../../types/case";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    caseService.getCases().then(setCases);
  }, []);

  const filtered = cases.filter((c) => {
    const matchSearch =
      !search ||
      c.case_id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.primary_vpa.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#0072BC]" />
            <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
              Fraud Case Management & Investigations
            </h1>
          </div>
          <p className="text-xs text-[#526581]">
            Formal fraud investigation workspace linking trigger telemetry, victim rosters, graph evidence, and regulatory actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="arvix-card p-4 bg-white border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases by ID, title, or target VPA..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs w-full md:w-auto overflow-x-auto">
          {["ALL", "INVESTIGATING", "STEP_UP_ISSUED", "NEW"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-white text-[#123B63] shadow-2xs font-bold"
                  : "text-[#526581]"
              }`}
            >
              {st === "ALL" ? "All Cases" : st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div
            key={c.case_id}
            onClick={() => navigate(`/cases/${c.case_id}`)}
            className="arvix-card p-5 bg-white border border-slate-200 hover:border-[#0072BC] cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                  {c.case_id}
                </span>
                <StatusBadge status={c.status} size="sm" />
                <span className="text-xs text-slate-400">· Created {new Date(c.created_at).toLocaleDateString("en-IN")}</span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D] group-hover:text-[#0072BC] transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-[#526581] line-clamp-2 leading-relaxed">
                {c.trigger_summary}
              </p>
              <div className="flex items-center gap-4 text-xs pt-1 text-[#7B8794]">
                <span>Target: <strong className="font-mono-code text-[#172B4D]">{c.primary_vpa}</strong></span>
                <span>Amount: <strong className="font-mono-code text-red-600">₹{c.amount_at_risk.toLocaleString("en-IN")}</strong></span>
                {c.assigned_investigator && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{c.assigned_investigator.name}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <RiskBadge level={c.risk_level} score={c.risk_score} size="md" />
              <button className="px-3.5 py-1.5 text-xs font-bold text-[#0072BC] bg-[#EAF5FC] rounded-lg flex items-center gap-1 group-hover:bg-[#0072BC] group-hover:text-white transition-all">
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CasesPage;
