import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, Sparkles } from "lucide-react";
import { demoEngine } from "../../services/demoEngine";
import type { DemoSimulationState } from "../../types/system";
import { useNavigate } from "react-router-dom";

export const DemoBanner: React.FC = () => {
  const [state, setState] = useState<DemoSimulationState>(demoEngine.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = demoEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsub;
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-[#061F36] text-white border-b-2 border-red-500 px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3">
      {/* Left: Stage Title & Mode Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 rounded text-[10px] font-mono-code font-bold uppercase tracking-wider text-white shadow-2xs">
          <Sparkles className="w-3 h-3" />
          <span>SIH 2026 PRESENTATION SIMULATOR</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono-code font-bold text-[#BAE6FD] bg-[#123B63] px-2 py-0.5 rounded">
            Stage {state.stage} / 8
          </span>
          <span className="font-bold text-white hidden sm:inline truncate max-w-md">
            {state.title}
          </span>
        </div>
      </div>

      {/* Center/Right: Simulation Stepper & Controls */}
      <div className="flex items-center gap-2">
        {/* Speed Multiplier */}
        <div className="flex items-center bg-[#082A49] border border-[#123B63] rounded-lg p-0.5 text-[11px] font-mono-code">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => demoEngine.setSpeed(spd)}
              className={`px-2 py-0.5 rounded transition-all ${
                state.speed === spd ? "bg-[#0072BC] text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={() =>
            state.isPlaying ? demoEngine.pauseSimulation() : demoEngine.startSimulation()
          }
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            state.isPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
              : "bg-[#0072BC] hover:bg-[#005B96] text-white"
          }`}
        >
          {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{state.isPlaying ? "Pause" : "Play Story"}</span>
        </button>

        {/* Instant Mule Attack Trigger */}
        <button
          onClick={() => {
            demoEngine.triggerMuleAttack();
            navigate("/demo");
          }}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
          title="Fast-forward to Mule Funnel Inflow Attack"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Trigger Attack</span>
        </button>

        {/* Reset */}
        <button
          onClick={() => demoEngine.resetSimulation()}
          className="p-1.5 bg-[#082A49] border border-[#123B63] hover:bg-[#123B63] text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Reset Simulation to Stage 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
