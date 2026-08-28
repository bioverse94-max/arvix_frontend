import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { demoEngine, DEMO_STAGES } from "../../services/demoEngine";
import type { DemoSimulationState } from "../../types/system";
import { TransactionGraph } from "../../components/graph/TransactionGraph";
import { MuleFunnelDemo } from "../../components/graph/MuleFunnelDemo";
import { ExplainabilityPanel } from "../../components/common/ExplainabilityPanel";
import { graphService } from "../../services/graphService";
import type { GraphData } from "../../types/graph";
import { useNavigate } from "react-router-dom";

export const DemoModePage: React.FC = () => {
  const [state, setState] = useState<DemoSimulationState>(demoEngine.getState());
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    graphService.getGraphData().then(setGraphData);
    const unsub = demoEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsub;
  }, []);

  const currentStage = DEMO_STAGES[state.stage - 1];

  return (
    <div className="space-y-8">
      {/* 1. Header with Dedicated Presentation Mode Branding */}
      <div className="pb-4 border-b border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 bg-[#0A1F36] text-[#BAE6FD] font-mono-code font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs border border-[#133252]">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Interactive Presentation Simulator</span>
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F36] tracking-tight">
            Mule Detection &amp; Attack Simulation Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-1 max-w-3xl">
            Interactive 8-stage scenario simulating real-time pattern-of-life divergence, graph funnel formation, SHAP explainability, and automated case generation.
          </p>
        </div>

        {/* Presentation Controls Bar (Dedicated to /demo) */}
        <div className="flex items-center gap-2.5 bg-white p-2.5 border border-[#E2E8F0] rounded-2xl shadow-xs shrink-0">
          {/* Speed Selector */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg text-xs font-mono-code">
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => demoEngine.setSpeed(spd)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  state.speed === spd
                    ? "bg-[#0072BC] text-white shadow-2xs"
                    : "text-[#526581] hover:text-[#0A1F36]"
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* Play / Pause */}
          <button
            onClick={() =>
              state.isPlaying ? demoEngine.pauseSimulation() : demoEngine.startSimulation()
            }
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              state.isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                : "bg-[#0072BC] hover:bg-[#005B96] text-white"
            }`}
          >
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{state.isPlaying ? "Pause Story" : "Play Story"}</span>
          </button>

          {/* Trigger Attack Button */}
          <button
            onClick={() => demoEngine.triggerMuleAttack()}
            className="px-3.5 py-2 bg-[#A91D2F] hover:bg-[#8A1826] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Trigger Attack (Stage 5)</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => demoEngine.resetSimulation()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Reset Simulation to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 8-Stage Interactive Progress Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {DEMO_STAGES.map((st) => {
          const isActive = state.stage === st.stage;
          const isCompleted = state.stage > st.stage;

          return (
            <button
              key={st.stage}
              onClick={() => demoEngine.setStage(st.stage)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0A1F36] text-white border-[#0072BC] shadow-md ring-2 ring-[#0072BC]"
                  : isCompleted
                  ? "bg-emerald-50/80 text-emerald-950 border-emerald-300"
                  : "bg-white text-slate-400 border-[#E2E8F0] hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono-code font-bold mb-1">
                <span>Stage {st.stage}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <span className={`text-[11px] font-semibold line-clamp-1 ${isActive ? "text-white" : ""}`}>
                {st.title.split(":")[1]?.trim() || st.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Current Stage Deep Dive Banner */}
      <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-code font-bold text-xs text-[#0072BC] bg-[#EAF5FC] px-2.5 py-0.5 rounded border border-[#BAE6FD]">
              STAGE {state.stage} OF 8
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#0A1F36]">{currentStage.title}</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#526581] max-w-3xl">{currentStage.description}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-[#7B8794] block uppercase font-bold font-mono-code">
              Mule Account Risk
            </span>
            <span className="font-mono-code font-extrabold text-xl text-red-600">
              {currentStage.riskScore} / 100
            </span>
          </div>

          <button
            onClick={() => demoEngine.setStage(Math.min(8, state.stage + 1))}
            disabled={state.stage >= 8}
            className="px-4 py-2.5 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Centerpiece: Mule Funnel Topology Demo Component */}
      <MuleFunnelDemo onInspectMule={(accId) => navigate(`/accounts/${accId}`)} />

      {/* 5. Live Graph & SHAP Explainability Dual View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
              Dynamic Topology Stage View
            </span>
            <span className="text-xs text-[#526581] font-mono-code">Target: ACC_8A91F2</span>
          </div>

          {graphData && (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
              <TransactionGraph
                data={graphData}
                height={400}
                highlightNodeId={state.stage >= 2 ? "ACC_8A91F2" : undefined}
                onSelectNode={(node) => navigate(`/accounts/${node.id}`)}
              />
            </div>
          )}
        </div>

        <div className="xl:col-span-5 space-y-4">
          <ExplainabilityPanel
            riskScore={currentStage.riskScore}
            entityName="Target Mule ACC_8A91F2"
          />

          {/* Action Trigger Box for Stage 7/8 */}
          {state.stage >= 7 && (
            <div className="p-6 bg-gradient-to-br from-rose-50 to-red-50 border border-red-200 rounded-2xl animate-row-insert space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Automated Alert &amp; Case Created</span>
              </div>
              <p className="text-xs text-red-950 leading-relaxed">
                Case <strong>CASE_UPI_2026_8492</strong> generated with intercepted ₹98,000 sweep held at switch layer.
              </p>
              <button
                onClick={() => navigate("/cases/CASE_UPI_2026_8492")}
                className="w-full py-2.5 bg-[#A91D2F] hover:bg-[#8A1826] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Formal Investigation Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoModePage;
