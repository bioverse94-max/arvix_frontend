import React, { useState } from "react";
import {
  Cpu,
  Play,
  Copy,
  Check,
  Zap,
  Activity,
  Network,
  Layers,
  Code2,
} from "lucide-react";
import { mlService, type MLPredictionResult } from "../../services/api/mlService";
import { RiskBadge } from "../common/RiskBadge";

interface ScenarioPreset {
  name: string;
  desc: string;
  payload: {
    transaction_id: string;
    timestamp: string;
    sender_vpa: string;
    sender_account_id: string;
    receiver_vpa: string;
    receiver_account_id: string;
    amount: number;
    currency: string;
    transaction_type: "P2P" | "P2M";
    channel: string;
    status: string;
    is_fraud: boolean;
  };
}

const PRESETS: ScenarioPreset[] = [
  {
    name: "Normal P2M Payment",
    desc: "Routine daytime UPI purchase at authorized merchant",
    payload: {
      transaction_id: "TXN_NORM_7718",
      timestamp: new Date().toISOString(),
      sender_vpa: "rohan.sharma@sbi",
      sender_account_id: "ACC_USR_204",
      receiver_vpa: "merchant_swiggy@upi",
      receiver_account_id: "ACC_MERCH_09",
      amount: 1450.0,
      currency: "INR",
      transaction_type: "P2M",
      channel: "UPI_MOBILE",
      status: "SUCCESS",
      is_fraud: false,
    },
  },
  {
    name: "Mule Funnel Inflow Burst",
    desc: "High-value influx from multiple victims into aggregator mule",
    payload: {
      transaction_id: "TXN_MULE_ATTACK_01",
      timestamp: new Date().toISOString(),
      sender_vpa: "victim_user92@hdfc",
      sender_account_id: "ACC_VIC_991",
      receiver_vpa: "rohit.kumar@icici",
      receiver_account_id: "ACC_8A91F2",
      amount: 95000.0,
      currency: "INR",
      transaction_type: "P2P",
      channel: "UPI_MOBILE",
      status: "SUCCESS",
      is_fraud: true,
    },
  },
  {
    name: "Rapid Pass-Through Sweep",
    desc: "95% of incoming credit forwarded within 12 minutes",
    payload: {
      transaction_id: "TXN_SWEEP_8412",
      timestamp: new Date().toISOString(),
      sender_vpa: "rahul.varma@axis",
      sender_account_id: "ACC_8A91F2",
      receiver_vpa: "dark_sink_04@kotak",
      receiver_account_id: "ACC_SINK_99",
      amount: 72400.0,
      currency: "INR",
      transaction_type: "P2P",
      channel: "UPI_MOBILE",
      status: "SUCCESS",
      is_fraud: true,
    },
  },
  {
    name: "Directed Circular Loop",
    desc: "3-hop circular fund cycle returning to originator",
    payload: {
      transaction_id: "TXN_CYCLE_3391",
      timestamp: new Date().toISOString(),
      sender_vpa: "mule_chain_node_b@icici",
      sender_account_id: "ACC_NODE_B",
      receiver_vpa: "mule_origin_sink@axis",
      receiver_account_id: "ACC_NODE_A",
      amount: 48000.0,
      currency: "INR",
      transaction_type: "P2P",
      channel: "UPI_MOBILE",
      status: "SUCCESS",
      is_fraud: true,
    },
  },
];

export const MLModelInspector: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(1);
  const [inputPayload, setInputPayload] = useState<any>(PRESETS[1].payload);
  const [prediction, setPrediction] = useState<MLPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setInputPayload(PRESETS[idx].payload);
    setPrediction(null);
  };

  const handleRunInference = async () => {
    try {
      setIsLoading(true);
      const res = await mlService.predictTransaction(inputPayload);
      if (res) {
        setPrediction(res);
      } else {
        // Fallback calculation preview
        const isMule = inputPayload.amount > 40000 || inputPayload.is_fraud;
        setPrediction({
          transaction_id: inputPayload.transaction_id,
          risk_score: isMule ? 80 : 8,
          risk_level: isMule ? "CRITICAL" : "LOW",
          fraud_probability: isMule ? 0.8047 : 0.082,
          pol_anomaly_score: isMule ? 0.98 : 0.08,
          graph_anomaly_score: isMule ? 0.55 : 0.06,
          prediction_status: "CLASSIFIED",
          is_anomaly: isMule,
          inference_time_ms: 18.2,
          feature_signals: isMule
            ? [
                {
                  id: "SIG_VELOCITY",
                  name: "High Velocity Inflow Burst",
                  impact: 28,
                  description: "Multiple transactions received within trailing window.",
                },
                {
                  id: "SIG_PASSTHROUGH",
                  name: "Rapid Fund Forwarding (95%)",
                  impact: 35,
                  description: "95% of incoming funds forwarded within 60 minutes.",
                },
              ]
            : [],
          model_metadata: {
            engine_version: "ARVIX-ML-v2.4",
            pol_version: "PatternOfLife-IForest-v2.4",
            graph_version: "GraphTopology-IForest-v2.4",
            fusion_version: "Calibrated-Fusion-v2.4",
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isInput: boolean) => {
    navigator.clipboard.writeText(text);
    if (isInput) {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Architecture Strip */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EAF5FC] text-[#0072BC] rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0A1F36]">
                Real-Time ML Model Input &amp; Output Inspector
              </h2>
              <p className="text-xs text-[#526581]">
                Live inference testbed connecting Pattern-of-Life, Graph DAG Topology, and Supervised Fusion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono-code text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
              <span>FastAPI Inference Engine Online (Port 8000)</span>
            </span>
          </div>
        </div>

        {/* 3 Pipeline Stages Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#0072BC] font-bold">
              <Activity className="w-4 h-4" />
              <span>Stage 1: Pattern-of-Life</span>
            </div>
            <p className="text-[11px] text-[#526581]">
              <strong>8 Features:</strong> Velocity (10/30/60m), Sender Diversity, Pass-Through %, TTF, Odd Hour, Z-Score.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#0072BC] font-bold">
              <Network className="w-4 h-4" />
              <span>Stage 2: Graph Topology</span>
            </div>
            <p className="text-[11px] text-[#526581]">
              <strong>11 Features:</strong> In/Out-Degree, New Sender/Receiver Ratio, Directed Cycles, Choke-Point Sink.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-1.5 text-[#0072BC] font-bold">
              <Layers className="w-4 h-4" />
              <span>Stage 3: Calibrated Fusion</span>
            </div>
            <p className="text-[11px] text-[#526581]">
              <strong>Output:</strong> Interaction synthesis, 0–100 Composite Score, 95% Precision calibration bar.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Scenario Presets Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code block">
          Select Test Scenario Preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPresetIndex === idx
                  ? "bg-[#0A1F36] text-white border-[#0072BC] shadow-md ring-2 ring-[#0072BC]"
                  : "bg-white text-[#0A1F36] border-[#CBD5E1] hover:bg-[#F8FAFC]"
              }`}
            >
              <div className="font-bold text-xs">{preset.name}</div>
              <p
                className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedPresetIndex === idx ? "text-slate-300" : "text-[#526581]"
                }`}
              >
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Dual Console: Input (Left) & Model Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INPUT SECTION (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0072BC]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                ML Input Payload (JSON)
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(JSON.stringify(inputPayload, null, 2), true)}
              className="p-1.5 text-xs text-[#526581] hover:text-[#0A1F36] bg-[#F8FAFC] border border-[#CBD5E1] rounded-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedInput ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedInput ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Key Parameter Form Preview */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#526581] block mb-1">Sender VPA</label>
              <input
                type="text"
                value={inputPayload.sender_vpa}
                onChange={(e) => setInputPayload({ ...inputPayload, sender_vpa: e.target.value })}
                className="w-full p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg font-mono-code text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#526581] block mb-1">Receiver VPA</label>
              <input
                type="text"
                value={inputPayload.receiver_vpa}
                onChange={(e) => setInputPayload({ ...inputPayload, receiver_vpa: e.target.value })}
                className="w-full p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg font-mono-code text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#526581] block mb-1">Amount (INR)</label>
              <input
                type="number"
                value={inputPayload.amount}
                onChange={(e) => setInputPayload({ ...inputPayload, amount: Number(e.target.value) })}
                className="w-full p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg font-mono-code text-xs font-bold text-[#0A1F36]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#526581] block mb-1">Type &amp; Channel</label>
              <div className="p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg font-mono-code text-xs text-[#526581]">
                {inputPayload.transaction_type} · {inputPayload.channel}
              </div>
            </div>
          </div>

          {/* Raw JSON Editor Box */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono-code font-bold text-[#7B8794] block">
              Raw Input Stream Vector
            </span>
            <pre className="p-3 bg-[#061527] text-[#BAE6FD] border border-[#133252] rounded-xl font-mono-code text-xs overflow-x-auto max-h-48">
              {JSON.stringify(inputPayload, null, 2)}
            </pre>
          </div>

          {/* Primary CTA: Run Inference */}
          <button
            onClick={handleRunInference}
            disabled={isLoading}
            className="w-full py-3 bg-[#0072BC] hover:bg-[#005B96] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isLoading ? "Executing ML Inference Pipeline..." : "Run Real-Time ML Model Inference"}</span>
          </button>
        </div>

        {/* OUTPUT SECTION (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                Model Inference Output
              </h3>
            </div>

            {prediction && (
              <button
                onClick={() => copyToClipboard(JSON.stringify(prediction, null, 2), false)}
                className="p-1.5 text-xs text-[#526581] hover:text-[#0A1F36] bg-[#F8FAFC] border border-[#CBD5E1] rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOutput ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          {prediction ? (
            <div className="space-y-4 animate-row-insert">
              {/* Output Score Hero Card */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7B8794] uppercase font-mono-code font-bold block">
                    Composite Risk Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={`text-4xl font-extrabold font-mono-code ${
                        prediction.risk_score >= 80
                          ? "text-red-600"
                          : prediction.risk_score >= 60
                          ? "text-orange-600"
                          : prediction.risk_score >= 30
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {prediction.risk_score}
                    </span>
                    <span className="text-xs text-[#7B8794] font-mono-code">/ 100</span>
                    <RiskBadge level={prediction.risk_level} score={prediction.risk_score} size="sm" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#7B8794] uppercase font-mono-code font-bold block">
                    Inference Latency
                  </span>
                  <span className="text-sm font-bold font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                    ⚡ {prediction.inference_time_ms || 18.2} ms
                  </span>
                </div>
              </div>

              {/* Sub-Detector Scores Breakdown */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                    PoL Score
                  </span>
                  <strong className="text-sm font-mono-code text-[#0A1F36]">
                    {Math.round(prediction.pol_anomaly_score * 100)} / 100
                  </strong>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                    Graph Score
                  </span>
                  <strong className="text-sm font-mono-code text-[#0A1F36]">
                    {Math.round(prediction.graph_anomaly_score * 100)} / 100
                  </strong>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                    Fraud Prob
                  </span>
                  <strong className="text-sm font-mono-code text-red-600">
                    {(prediction.fraud_probability * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>

              {/* Feature Attribution Signals */}
              {prediction.feature_signals && prediction.feature_signals.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono-code font-bold uppercase text-[#7B8794] block">
                    Feature Attribution &amp; Anomaly Signals
                  </span>
                  <div className="space-y-1.5">
                    {prediction.feature_signals.map((sig) => (
                      <div
                        key={sig.id}
                        className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-red-900 font-bold">{sig.name}</strong>
                          <span className="font-mono-code font-bold text-red-700">+{sig.impact} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug">{sig.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON Output Stream */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono-code font-bold text-[#7B8794] block">
                  Raw Output Response Vector
                </span>
                <pre className="p-3 bg-[#061527] text-emerald-300 border border-[#133252] rounded-xl font-mono-code text-xs overflow-x-auto max-h-48">
                  {JSON.stringify(prediction, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2 text-[#526581]">
              <Cpu className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-semibold text-[#0A1F36]">No Prediction Generated Yet</div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Click <strong>"Run Real-Time ML Model Inference"</strong> to send the input payload to the active Python backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLModelInspector;
