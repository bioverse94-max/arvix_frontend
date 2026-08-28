import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [stepUpThreshold, setStepUpThreshold] = useState(40);
  const [freezeThreshold, setFreezeThreshold] = useState(85);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Risk Threshold & Operational Policy Settings
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Configure automated step-up verification triggers and regulatory freeze thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Thresholds Card */}
        <div className="arvix-card p-6 bg-white border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D] pb-2 border-b border-slate-100">
            Graduated Action Thresholds
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-bold text-[#172B4D]">
                  Step-Up Authentication Trigger (Medium Risk):
                </label>
                <span className="font-mono-code font-bold text-[#D99000]">
                  Score &gt;= {stepUpThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={70}
                value={stepUpThreshold}
                onChange={(e) => setStepUpThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-[#7B8794] mt-1">
                Transactions crossing this score are challenged with out-of-band biometric/OTP verification.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-bold text-[#172B4D]">
                  Mandatory Fraud Review & Hold Trigger (High/Critical Risk):
                </label>
                <span className="font-mono-code font-bold text-red-600">
                  Score &gt;= {freezeThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min={70}
                max={95}
                value={freezeThreshold}
                onChange={(e) => setFreezeThreshold(Number(e.target.value))}
                className="w-full accent-red-600"
              />
              <p className="text-[11px] text-[#7B8794] mt-1">
                Outbound transfers above this score are held for human investigator authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {saved && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Policy thresholds saved successfully!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SettingsPage;
