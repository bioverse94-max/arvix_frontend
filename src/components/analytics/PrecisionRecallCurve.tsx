import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from "recharts";

const prData = [
  { recall: 0.1, precision: 0.999, threshold: 95 },
  { recall: 0.3, precision: 0.995, threshold: 90 },
  { recall: 0.5, precision: 0.991, threshold: 85 },
  { recall: 0.7, precision: 0.986, threshold: 75 },
  { recall: 0.874, precision: 0.981, threshold: 70, isOperatingPoint: true },
  { recall: 0.92, precision: 0.942, threshold: 50 },
  { recall: 0.96, precision: 0.881, threshold: 40 },
  { recall: 0.99, precision: 0.712, threshold: 25 },
];

export const PrecisionRecallCurve: React.FC = () => {
  const [selectedThreshold, setSelectedThreshold] = useState<number>(70);

  const currentPoint = prData.find((p) => p.threshold === selectedThreshold) || prData[4];

  return (
    <div className="arvix-card p-6 bg-white border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
            Precision-Recall Trade-Off & Calibrated Operating Point
          </h3>
          <p className="text-[11px] text-[#526581]">
            Validation performance across synthetic UPI transactions (750M daily scale model).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono-code font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            ROC-AUC: 0.942
          </span>
          <span className="font-mono-code font-bold text-[#0072BC] bg-[#EAF5FC] border border-[#BAE6FD] px-2 py-0.5 rounded">
            PR-AUC: 0.961
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={prData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="prGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0072BC" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0072BC" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="recall"
              type="number"
              domain={[0, 1]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              stroke="#7B8794"
              fontSize={11}
              name="Recall"
            />
            <YAxis
              domain={[0.6, 1.0]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              stroke="#7B8794"
              fontSize={11}
              name="Precision"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#082A49] text-white p-3 rounded-lg shadow-xl border border-[#123B63] text-xs font-mono-code space-y-1">
                      <div className="font-bold text-[#BAE6FD]">
                        Risk Threshold: {d.threshold} / 100
                      </div>
                      <div>Precision: {(d.precision * 100).toFixed(1)}%</div>
                      <div>Recall: {(d.recall * 100).toFixed(1)}%</div>
                      <div className="text-[10px] text-emerald-400">
                        {d.isOperatingPoint ? "★ Calibrated Production Threshold" : ""}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="precision"
              stroke="#0072BC"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#prGradient)"
            />
            <ReferenceDot
              x={0.874}
              y={0.981}
              r={6}
              fill="#A91D2F"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Threshold Selector & Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
        <div>
          <span className="text-[10px] text-[#7B8794] uppercase font-bold block mb-1">
            Operating Threshold
          </span>
          <select
            value={selectedThreshold}
            onChange={(e) => setSelectedThreshold(Number(e.target.value))}
            className="w-full text-xs font-mono-code font-bold p-1.5 rounded border border-slate-300 bg-white"
          >
            {prData.map((p) => (
              <option key={p.threshold} value={p.threshold}>
                Score &gt;= {p.threshold} {p.isOperatingPoint ? "(Calibrated)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-[10px] text-[#7B8794] uppercase font-bold block">Precision (Low Friction)</span>
          <span className="text-base font-extrabold font-mono-code text-[#172B4D]">
            {(currentPoint.precision * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#526581] block">False Positive Rate: {((1 - currentPoint.precision) * 100).toFixed(1)}%</span>
        </div>

        <div>
          <span className="text-[10px] text-[#7B8794] uppercase font-bold block">Recall (Fraud Caught)</span>
          <span className="text-base font-extrabold font-mono-code text-[#0072BC]">
            {(currentPoint.recall * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#526581] block">Mule Catch Rate</span>
        </div>

        <div>
          <span className="text-[10px] text-[#7B8794] uppercase font-bold block">Intervention Profile</span>
          <span className="text-xs font-bold text-red-600 block">
            {selectedThreshold >= 85 ? "Regulatory Freeze" : selectedThreshold >= 40 ? "Step-Up Challenge" : "Pass-Through"}
          </span>
          <span className="text-[10px] text-[#526581]">Step-up avoids genuine payment blockage</span>
        </div>
      </div>
    </div>
  );
};
export default PrecisionRecallCurve;
