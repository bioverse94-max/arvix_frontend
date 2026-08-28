import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const PatternOfLifeChart: React.FC = () => {
  // 24-hour volume baseline vs current anomalous day
  const hourlyData = [
    { hour: "00:00", baseline: 200, today: 180, senders: 0 },
    { hour: "02:00", baseline: 50, today: 40, senders: 0 },
    { hour: "04:00", baseline: 20, today: 30, senders: 0 },
    { hour: "06:00", baseline: 120, today: 150, senders: 1 },
    { hour: "08:00", baseline: 600, today: 750, senders: 2 },
    { hour: "10:00", baseline: 1200, today: 1400, senders: 2 },
    { hour: "12:00", baseline: 1800, today: 2100, senders: 3 },
    { hour: "14:00", baseline: 1500, today: 1900, senders: 2 },
    { hour: "16:00", baseline: 1400, today: 2200, senders: 3 },
    { hour: "18:00", baseline: 1100, today: 18400, senders: 14 }, // Sudden anomaly burst!
    { hour: "19:00", baseline: 900, today: 48500, senders: 31 },  // Critical Spike
    { hour: "20:00", baseline: 800, today: 22000, senders: 8 },
    { hour: "22:00", baseline: 400, today: 600, senders: 1 },
  ];

  return (
    <div className="arvix-card p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider">
            Pattern-of-Life: Hourly Transaction Volume (₹)
          </h3>
          <p className="text-xs text-[#526581]">
            Comparing account ACC_8A91F2 today's hourly inflow against 90-day historical baseline
          </p>
        </div>
        <span className="text-xs font-mono-code font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
          BURST AT 18:00 - 19:45
        </span>
      </div>

      <div className="h-64 mt-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A91D2F" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A91D2F" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0072BC" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0072BC" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#7B8794" }} />
            <YAxis
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              tick={{ fontSize: 10, fill: "#7B8794" }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                name === "today" ? "Today's Observed Inflow" : "90-Day Normal Baseline",
              ]}
              contentStyle={{ backgroundColor: "#082A49", color: "#FFFFFF", borderRadius: "8px", fontSize: "11px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
            <Area
              type="monotone"
              dataKey="baseline"
              name="90-Day Historical Baseline"
              stroke="#0072BC"
              fillOpacity={1}
              fill="url(#baselineGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="today"
              name="Today's Observed Activity"
              stroke="#A91D2F"
              fillOpacity={1}
              fill="url(#todayGrad)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
