import React, { useState } from "react";
import { FileSpreadsheet, Download } from "lucide-react";

export const ReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: "REP_MULE_DAILY",
      title: "Daily Mule Account Interception & Funnel Summary",
      frequency: "Daily (24h Window)",
      format: "PDF & CSV (NPCI / RBI Spec)",
      description: "Aggregated record of flagged mule accounts, inbound sender counts, and held transaction sweeps.",
      lastGenerated: "Today at 06:00 IST",
    },
    {
      id: "REP_STEP_UP_AUDIT",
      title: "Step-Up Verification Resolution & False-Positive Audit",
      frequency: "Weekly",
      format: "CSV",
      description: "Audit log of all OTP/biometric step-up challenges issued, pass/fail ratios, and clearance times.",
      lastGenerated: "25 Aug 2026",
    },
    {
      id: "REP_SYNDICATE_FORENSIC",
      title: "Cross-Bank Syndicate Network Intelligence Dossier",
      frequency: "On-Demand",
      format: "Forensic PDF",
      description: "Complete graph topologies and counterparty lists for law enforcement cyber cell submission.",
      lastGenerated: "26 Aug 2026",
    },
  ];

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `${id}_Arvix_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Regulatory & Fraud Intelligence Reports
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Pre-formatted compliance reports for NPCI, RBI Master Directions, and bank internal audit committees.
        </p>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="arvix-card p-5 bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                  {rep.id}
                </span>
                <span className="text-xs text-slate-400 font-mono-code">· {rep.frequency}</span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D]">{rep.title}</h3>
              <p className="text-xs text-[#526581]">{rep.description}</p>
              <span className="text-[10px] text-[#7B8794] block mt-1">
                Format: <strong className="text-[#172B4D]">{rep.format}</strong> · Last compiled: {rep.lastGenerated}
              </span>
            </div>

            <button
              onClick={() => handleDownload(rep.id)}
              disabled={downloading === rep.id}
              className="px-4 py-2 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === rep.id ? "Compiling Report..." : "Download Export"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReportsPage;
