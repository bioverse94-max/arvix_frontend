import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Download,
  Play,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { transactionService } from "../../services/transactionService";
import type { Transaction } from "../../types/transaction";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";

interface ScenarioOption {
  id: string;
  name: string;
  category: string;
  description: string;
  riskWeight: string;
}

const AVAILABLE_SCENARIOS: ScenarioOption[] = [
  {
    id: "mule_network",
    name: "Mule Account Funnel",
    category: "Graph Topology",
    description: "Multiple victim nodes converge funds into a central mule aggregator.",
    riskWeight: "CRITICAL",
  },
  {
    id: "circular_flow",
    name: "Directed Circular Loop",
    category: "Laundering Cycle",
    description: "3-hop cyclical fund transfer loop returning to initial source node.",
    riskWeight: "CRITICAL",
  },
  {
    id: "rapid_pass_through",
    name: "Rapid Pass-Through Sweep",
    category: "Velocity Anomaly",
    description: "Inbound credits forwarded to sink wallets within a sub-15 minute window.",
    riskWeight: "HIGH",
  },
  {
    id: "account_takeover",
    name: "Account Takeover Drain",
    category: "Behavioral Deviation",
    description: "New device login followed by max-limit transfer to unknown VPAs.",
    riskWeight: "HIGH",
  },
  {
    id: "fan_in",
    name: "Fan-In Aggregation",
    category: "Network Inflow",
    description: "Dispersed remitters funneling small-ticket amounts into single account.",
    riskWeight: "MEDIUM",
  },
  {
    id: "fan_out",
    name: "Fan-Out Distribution",
    category: "Network Outflow",
    description: "Single funding source rapidly dispersing payouts across mule clusters.",
    riskWeight: "MEDIUM",
  },
];

export const DatasetGeneratorPage: React.FC = () => {
  const [numAccounts, setNumAccounts] = useState<number>(150);
  const [numTransactions, setNumTransactions] = useState<number>(300);
  const [seed, setSeed] = useState<number>(42);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([
    "mule_network",
    "circular_flow",
    "rapid_pass_through",
  ]);
  const [resetDb, setResetDb] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [generationStats, setGenerationStats] = useState<{
    generated_transactions: number;
    inserted_transactions: number;
    ml_scores_computed: number;
    alerts_created: number;
    scenarios_injected: string[];
  } | null>(null);
  const [previewTransactions, setPreviewTransactions] = useState<Transaction[]>([]);
  const [previewSearch, setPreviewSearch] = useState<string>("");

  const loadPreview = () => {
    transactionService.getTransactions().then((txs) => {
      setPreviewTransactions(txs);
    });
  };

  useEffect(() => {
    loadPreview();
  }, []);

  const toggleScenario = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter((s) => s !== id));
    } else {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_accounts: numAccounts,
          num_transactions: numTransactions,
          scenarios: selectedScenarios,
          seed,
          reset_db: resetDb,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGenerationStats(data);
        const fresh = await transactionService.getTransactions();
        setPreviewTransactions(fresh);
        window.dispatchEvent(new Event("arvix-data-refreshed"));
      }
    } catch (err) {
      console.error("Failed to generate dataset:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/generator/export/csv");
      if (!res.ok) throw new Error("Failed to export dataset CSV");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `synthetic_upi_dataset_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("CSV download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredPreview = previewTransactions.filter((tx) => {
    if (!previewSearch) return true;
    const q = previewSearch.toLowerCase();
    return (
      tx.transaction_id.toLowerCase().includes(q) ||
      tx.sender_vpa.toLowerCase().includes(q) ||
      tx.receiver_vpa.toLowerCase().includes(q) ||
      tx.risk_level.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-mono-code font-bold">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>SYNTHETIC UPI ENGINE &amp; ML STUDIO</span>
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F36] tracking-tight">
            Synthetic Dataset Studio &amp; CSV Exporter
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-1">
            Configure custom population scale, inject graph fraud scenarios, trigger real-time ML scoring, and export the complete dataset as CSV.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Download complete database as a CSV file"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Downloading CSV...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Dataset as CSV</span>
              </>
            )}
          </button>
          <Link
            to="/transactions"
            className="px-4 py-2.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#0A1F36] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Feed</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Scenarios & Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Sliders & Generator Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0072BC]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                  Generation Parameters
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono-code">Config Engine</span>
            </div>

            {/* Account Population Scale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#0A1F36]">Account Population (Transactors):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={20}
                    max={5000}
                    value={numAccounts}
                    onChange={(e) => setNumAccounts(Math.max(20, Math.min(5000, Number(e.target.value))))}
                    className="w-20 font-mono-code font-bold text-xs text-right text-[#0072BC] bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                  />
                  <span className="text-[11px] text-slate-500 font-mono-code">accs</span>
                </div>
              </div>
              <input
                type="range"
                min={20}
                max={5000}
                step={50}
                value={numAccounts}
                onChange={(e) => setNumAccounts(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0072BC]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-code">
                <span>20 min</span>
                <span>2,500 mid</span>
                <span>5,000 max</span>
              </div>
            </div>

            {/* Transaction Volume Scale (Up to 20,000) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#0A1F36]">UPI Transaction Volume:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={50}
                    max={20000}
                    value={numTransactions}
                    onChange={(e) => setNumTransactions(Math.max(50, Math.min(20000, Number(e.target.value))))}
                    className="w-24 font-mono-code font-bold text-xs text-right text-[#0072BC] bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                  />
                  <span className="text-[11px] text-slate-500 font-mono-code">txns</span>
                </div>
              </div>
              <input
                type="range"
                min={50}
                max={20000}
                step={100}
                value={numTransactions}
                onChange={(e) => setNumTransactions(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0072BC]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-code">
                <span>50 min</span>
                <span>10,000 mid</span>
                <span>20,000 max</span>
              </div>

              {/* Quick Volume Preset Pills */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono-code">Presets:</span>
                {[500, 2000, 5000, 10000, 20000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNumTransactions(preset)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold transition-all cursor-pointer ${
                      numTransactions === preset
                        ? "bg-[#0072BC] text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Random Seed Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0A1F36]">
                Reproducibility Seed (RNG):
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full text-xs font-mono-code px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:border-[#0072BC]"
                placeholder="42"
              />
              <p className="text-[10px] text-[#7B8794]">
                Using the same seed ensures identical baseline topology generation across runs.
              </p>
            </div>

            {/* Database Reset Option */}
            <div className="flex items-center gap-2 pt-1 pb-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="resetDbToggle"
                checked={resetDb}
                onChange={(e) => setResetDb(e.target.checked)}
                className="rounded text-[#0072BC] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="resetDbToggle" className="text-xs font-medium text-[#0A1F36] cursor-pointer select-none">
                Clear previous records before generating (clean dataset)
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedScenarios.length === 0}
              className="w-full py-3 bg-gradient-to-r from-[#0072BC] to-[#0A1F36] hover:from-[#005B96] hover:to-[#08192C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating &amp; Scoring ML Ensemble...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate Dataset &amp; Score ML Models</span>
                </>
              )}
            </button>
          </div>

          {/* Real-Time Generation Status Card */}
          {generationStats && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono-code">
                  Generation &amp; ML Scoring Successful
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-mono-code block">Generated Txns</span>
                  <strong className="text-base text-[#0A1F36] font-mono-code">
                    {generationStats.generated_transactions}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-mono-code block">ML Scores Computed</span>
                  <strong className="text-base text-emerald-700 font-mono-code">
                    {generationStats.ml_scores_computed}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-mono-code block">Alerts Triggered</span>
                  <strong className="text-base text-red-600 font-mono-code">
                    {generationStats.alerts_created}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-mono-code block">Scenarios Active</span>
                  <strong className="text-base text-[#0072BC] font-mono-code">
                    {generationStats.scenarios_injected.length}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Fraud Scenarios Checkboxes & Live Previews (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                  Inject Fraud Topology Scenarios
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono-code">
                {selectedScenarios.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {AVAILABLE_SCENARIOS.map((sc) => {
                const isChecked = selectedScenarios.includes(sc.id);
                return (
                  <div
                    key={sc.id}
                    onClick={() => toggleScenario(sc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? "bg-blue-50/60 border-[#0072BC] shadow-xs"
                        : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-slate-300 opacity-75"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#0072BC] focus:ring-0 cursor-pointer"
                        />
                        <h4 className="text-xs font-bold text-[#0A1F36]">{sc.name}</h4>
                      </div>
                      <span
                        className={`text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                          sc.riskWeight === "CRITICAL"
                            ? "bg-red-100 text-red-700"
                            : sc.riskWeight === "HIGH"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {sc.riskWeight}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#526581] leading-relaxed pl-5">
                      {sc.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview Dataset Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                  Generated Transactions Preview ({filteredPreview.length})
                </h3>
                <p className="text-[11px] text-[#526581]">
                  Live dataset stored in SQLite with real-time multi-model ML risk scores.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Filter preview..."
                  className="text-xs px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-hidden focus:border-[#0072BC]"
                />
                <button
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono-code border-collapse">
                <thead className="bg-[#F8FAFC] text-[#526581] border-b border-[#E2E8F0] sticky top-0">
                  <tr>
                    <th className="p-2">TXN ID</th>
                    <th className="p-2">Sender</th>
                    <th className="p-2">Receiver</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Risk</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredPreview.slice(0, 15).map((tx) => (
                    <tr key={tx.transaction_id} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-[#0072BC]">{tx.transaction_id}</td>
                      <td className="p-2 text-slate-700 truncate max-w-[120px]">{tx.sender_vpa}</td>
                      <td className="p-2 text-slate-700 truncate max-w-[120px]">{tx.receiver_vpa}</td>
                      <td className="p-2 font-bold text-[#0A1F36]">₹{tx.amount.toLocaleString("en-IN")}</td>
                      <td className="p-2">
                        <RiskBadge level={tx.risk_level} score={tx.risk_score} size="sm" />
                      </td>
                      <td className="p-2">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetGeneratorPage;
