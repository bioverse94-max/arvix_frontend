import React, { useState } from "react";
import { ShieldCheck, Smartphone, CheckCircle, X, KeyRound } from "lucide-react";

interface StepUpModalProps {
  isOpen: boolean;
  transactionId: string;
  accountVpa: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const StepUpModal: React.FC<StepUpModalProps> = ({
  isOpen,
  transactionId,
  accountVpa,
  amount,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<"OTP" | "BIOMETRIC" | "IVR">("OTP");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSimulateChallenge = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setIsCompleted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsCompleted(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-row-insert">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Trigger Step-Up Verification</h3>
              <p className="text-xs text-[#526581]">Non-destructive fraud friction</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-[#EAF5FC] border border-[#BAE6FD] rounded-lg">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#526581]">Transaction ID:</span>
              <span className="font-mono-code font-bold text-[#123B63]">{transactionId}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#526581]">Account VPA:</span>
              <span className="font-mono-code font-bold text-[#123B63]">{accountVpa}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#526581]">Held Amount:</span>
              <span className="font-mono-code font-bold text-[#0072BC]">₹{amount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <p className="text-xs text-[#526581] leading-relaxed">
            As outlined in the NPCI fraud prevention framework, medium-risk transactions trigger a real-time out-of-band verification challenge before funds are released.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-2">
              Verification Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "OTP", label: "Dynamic OTP", icon: Smartphone },
                { id: "BIOMETRIC", label: "In-App FIDO", icon: KeyRound },
                { id: "IVR", label: "IVR Call Callout", icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = method === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id as any)}
                    className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "border-[#0072BC] bg-[#EAF5FC] text-[#0072BC] font-bold shadow-xs"
                        : "border-slate-200 text-[#526581] hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8FAFC] border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#526581] border border-slate-200 rounded-lg bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSimulateChallenge}
            disabled={isSimulating || isCompleted}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0072BC] hover:bg-[#005B96] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-75"
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Verified & Released</span>
              </>
            ) : isSimulating ? (
              <span>Dispatching Challenge...</span>
            ) : (
              <span>Dispatch Challenge</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
