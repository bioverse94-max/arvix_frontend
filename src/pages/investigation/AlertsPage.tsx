import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { alertService } from "../../services/alertService";
import type { FraudAlert } from "../../types/fraud";
import { RiskBadge } from "../../components/common/RiskBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useNavigate } from "react-router-dom";

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      alertService.getAlerts().then(setAlerts);
    };

    load();
    window.addEventListener("arvix-data-refreshed", load);

    return () => {
      window.removeEventListener("arvix-data-refreshed", load);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
            Real-Time Fraud Alerts & Interception Stream
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Automated rule triggers and ML threshold alerts dispatched to switch-level interception handlers.
        </p>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.alert_id}
            onClick={() => navigate(`/accounts/${alert.account_id}`)}
            className="arvix-card p-5 bg-white border border-slate-200 hover:border-[#0072BC] cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                  {alert.alert_id}
                </span>
                <StatusBadge status={alert.status} size="sm" />
                <span className="text-[10px] text-slate-400 font-mono-code">
                  {new Date(alert.detected_at).toLocaleTimeString("en-IN")}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D]">{alert.primary_reason}</h3>
              <div className="flex items-center gap-4 text-xs text-[#7B8794]">
                <span>Target: <strong className="font-mono-code text-[#172B4D]">{alert.account_vpa}</strong></span>
                <span>Amount: <strong className="font-mono-code text-red-600">₹{alert.amount.toLocaleString("en-IN")}</strong></span>
                <span>Bank: <strong className="text-[#172B4D]">{alert.bank_name}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <RiskBadge level={alert.risk_level} score={alert.risk_score} size="md" />
              <button className="px-3 py-1.5 bg-[#EAF5FC] text-[#0072BC] text-xs font-bold rounded-lg hover:bg-[#0072BC] hover:text-white transition-all">
                Review Account
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AlertsPage;
