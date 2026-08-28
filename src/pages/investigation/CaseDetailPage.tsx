import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Send,
  AlertTriangle,
  FileText,
  Network,
} from "lucide-react";
import { caseService } from "../../services/caseService";
import { graphService } from "../../services/graphService";
import type { FraudCase } from "../../types/case";
import type { GraphData } from "../../types/graph";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { TransactionGraph } from "../../components/graph/TransactionGraph";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fraudCase, setFraudCase] = useState<FraudCase | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isFreezeOpen, setIsFreezeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const caseId = id || "CASE_UPI_2026_8492";
    caseService.getCaseById(caseId).then((found) => {
      if (found) setFraudCase(found);
      else caseService.getCases().then((list) => setFraudCase(list[0]));
    });

    graphService.getMuleFunnelTopology().then(setGraphData);
  }, [id]);

  if (!fraudCase) {
    return <div className="p-8 text-center text-slate-500">Loading Case Workspace...</div>;
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    caseService.addCaseNote(fraudCase.case_id, newNote.trim(), "Abhirup Sengupta");
    setFraudCase({
      ...fraudCase,
      notes: [
        {
          id: `NOTE_${Date.now()}`,
          author: "Abhirup Sengupta",
          role: "Lead Fraud Operations Specialist",
          timestamp: new Date().toISOString(),
          text: newNote.trim(),
        },
        ...fraudCase.notes,
      ],
    });
    setNewNote("");
    setToast("Investigator note recorded in case log.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (newStatus: any, label: string) => {
    caseService.updateCaseStatus(fraudCase.case_id, newStatus);
    setFraudCase({ ...fraudCase, status: newStatus });
    setToast(`Case status updated: ${label}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082A49] text-white px-4 py-3 rounded-lg shadow-xl border border-[#0072BC] flex items-center gap-2 text-xs font-semibold animate-row-insert">
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cases")}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code font-bold text-sm text-[#0072BC]">
                {fraudCase.case_id}
              </span>
              <StatusBadge status={fraudCase.status} size="md" />
              <RiskBadge level={fraudCase.risk_level} score={fraudCase.risk_score} size="sm" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D] mt-0.5">
              {fraudCase.title}
            </h1>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange("ESCALATED_LE", "Escalated to Cyber Cell")}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Escalate to Cyber Cell
          </button>
          <button
            onClick={() => setIsFreezeOpen(true)}
            className="px-3 py-2 bg-[#A91D2F] hover:bg-[#8A1826] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Freeze Node</span>
          </button>
          <button
            onClick={() => handleStatusChange("RESOLVED_FROZEN", "Resolved & Funds Secured")}
            className="px-3 py-2 bg-[#168A5B] hover:bg-[#12704A] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            Resolve Case
          </button>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Trigger Summary & Evidence */}
        <div className="md:col-span-8 space-y-6">
          {/* Trigger Card */}
          <div className="arvix-card p-5 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
              Trigger Hypothesis & Detection Rationale
            </h3>
            <p className="text-xs text-[#526581] leading-relaxed">
              {fraudCase.trigger_summary}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-[#7B8794] block">Primary Target</span>
                <span className="font-mono-code font-bold text-[#123B63]">{fraudCase.primary_vpa}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#7B8794] block">Amount at Risk</span>
                <span className="font-mono-code font-bold text-red-600">
                  ₹{fraudCase.amount_at_risk.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7B8794] block">Cluster Reference</span>
                <span className="font-mono-code font-bold text-[#7E22CE]">
                  {fraudCase.cluster_id || "CLUSTER_MULE_084"}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Signals */}
          <div className="arvix-card p-5 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
              Forensic Evidence & Telemetry Signals ({fraudCase.evidence_signals.length})
            </h3>
            <div className="space-y-2.5">
              {fraudCase.evidence_signals.map((ev, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#172B4D] font-bold">{ev.title}</strong>
                    <span className="font-mono-code font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Score: {ev.score}
                    </span>
                  </div>
                  <p className="text-[#526581] mt-1">{ev.description}</p>
                  <span className="text-[10px] font-mono-code text-[#0072BC] block mt-1">
                    Proof: {ev.evidence}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Evidence Graph */}
          {graphData && (
            <div className="arvix-card p-5 bg-white border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center gap-2">
                <Network className="w-4 h-4 text-[#0072BC]" />
                <span>Forensic Transaction Funnel DAG</span>
              </h3>
              <TransactionGraph
                data={graphData}
                height={320}
                highlightNodeId={fraudCase.primary_account_id}
              />
            </div>
          )}
        </div>

        {/* Right 4 Cols: Timeline & Investigator Notes */}
        <div className="md:col-span-4 space-y-6">
          {/* Assigned Investigator Info */}
          <div className="arvix-card p-4 bg-white border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8794] block mb-2">
              Assigned Investigator
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#123B63] text-white flex items-center justify-center font-bold font-mono-code">
                {fraudCase.assigned_investigator?.avatar || "AS"}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#172B4D]">
                  {fraudCase.assigned_investigator?.name || "Abhirup Sengupta"}
                </h4>
                <p className="text-[11px] text-[#526581]">
                  {fraudCase.assigned_investigator?.role || "Lead Fraud Specialist"}
                </p>
              </div>
            </div>
          </div>

          {/* Case Timeline */}
          <div className="arvix-card p-5 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7B8794]" />
              <span>Incident Timeline</span>
            </h3>
            <div className="relative pl-4 border-l-2 border-slate-200 space-y-4 text-xs">
              {fraudCase.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0072BC] ring-4 ring-white" />
                  <div className="font-bold text-[#172B4D]">{item.action}</div>
                  <p className="text-[11px] text-[#526581] mt-0.5">{item.details}</p>
                  <span className="text-[10px] text-slate-400 font-mono-code">
                    {new Date(item.timestamp).toLocaleTimeString("en-IN")} · {item.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investigator Notes Editor */}
          <div className="arvix-card p-5 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#7B8794]" />
              <span>Investigator Notes ({fraudCase.notes.length})</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log notes, bank desk verification, victim callback status..."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full py-1.5 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Record Note</span>
              </button>
            </form>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 max-h-56 overflow-y-auto">
              {fraudCase.notes.map((note) => (
                <div key={note.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#7B8794] mb-1">
                    <span className="font-bold text-[#172B4D]">{note.author}</span>
                    <span className="font-mono-code">{new Date(note.timestamp).toLocaleTimeString("en-IN")}</span>
                  </div>
                  <p className="text-[#526581] leading-snug">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isFreezeOpen && (
        <ConfirmDialog
          isOpen={true}
          title="Confirm Case Target Freeze"
          description={`Freezing account ${fraudCase.primary_account_id} for Case ${fraudCase.case_id}.`}
          targetId={fraudCase.primary_account_id}
          actionLabel="Authorize Regulatory Freeze"
          confirmVariant="danger"
          onClose={() => setIsFreezeOpen(false)}
          onConfirm={(reason) => {
            handleStatusChange("RESOLVED_FROZEN", `Frozen with reason: ${reason}`);
            setIsFreezeOpen(false);
          }}
        />
      )}
    </div>
  );
};
export default CaseDetailPage;
