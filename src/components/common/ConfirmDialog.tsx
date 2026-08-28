import React, { useState } from "react";
import { AlertTriangle, Lock, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  targetId: string;
  actionLabel?: string;
  confirmVariant?: "danger" | "warning" | "primary";
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  targetId,
  actionLabel = "Confirm Action",
  confirmVariant = "danger",
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [confirmedAuth, setConfirmedAuth] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  const getButtonStyles = () => {
    switch (confirmVariant) {
      case "danger":
        return "bg-[#A91D2F] hover:bg-[#8A1826] text-white";
      case "warning":
        return "bg-[#D99000] hover:bg-[#B87A00] text-white";
      default:
        return "bg-[#0072BC] hover:bg-[#005B96] text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-row-insert">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#A91D2F] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">{title}</h3>
              <p className="text-xs text-[#526581]">Target: <span className="font-mono-code font-semibold">{targetId}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#526581] leading-relaxed">
            {description}
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Regulatory Audit Requirement:</span>
              This action will be permanently recorded in the immutable compliance audit log with your investigator credential.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-1.5">
              Reason / Justification Note (Required)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. High confidence mule funnel pattern verified with ICICI fraud desk; victim funds protected."
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072BC] focus:border-transparent font-sans"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={confirmedAuth}
              onChange={(e) => setConfirmedAuth(e.target.checked)}
              className="rounded border-slate-300 text-[#0072BC] focus:ring-[#0072BC]"
            />
            <span className="text-xs text-[#172B4D] font-medium select-none">
              I authorize this intervention under RBI Master Direction on Fraud Monitoring.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8FAFC] border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#526581] hover:text-[#172B4D] border border-slate-200 rounded-lg bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmedAuth || !reason.trim()}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles()}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
