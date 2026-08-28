import React, { useRef, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

export const HeroNetworkVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Fixed network nodes
    const networkNodes = [
      { id: "MULE", x: 260, y: 170, label: "Mule Account", role: "MULE", radius: 18, color: "#A91D2F", bg: "#FCEAEB" },
      { id: "V1", x: 80, y: 70, label: "Victim A", role: "VICTIM", radius: 12, color: "#0072BC", bg: "#EAF5FC" },
      { id: "V2", x: 70, y: 160, label: "Victim B", role: "VICTIM", radius: 12, color: "#0072BC", bg: "#EAF5FC" },
      { id: "V3", x: 90, y: 260, label: "Victim C", role: "VICTIM", radius: 12, color: "#0072BC", bg: "#EAF5FC" },
      { id: "S1", x: 440, y: 100, label: "Crypto Sink", role: "SINK", radius: 15, color: "#7E22CE", bg: "#F3E8FF" },
      { id: "S2", x: 430, y: 240, label: "Offshore Hub", role: "SINK", radius: 14, color: "#7E22CE", bg: "#F3E8FF" },
    ];

    const edges = [
      { from: "V1", to: "MULE", isFraud: true },
      { from: "V2", to: "MULE", isFraud: true },
      { from: "V3", to: "MULE", isFraud: true },
      { from: "MULE", to: "S1", isFraud: true },
      { from: "MULE", to: "S2", isFraud: true },
    ];

    // Particles flowing along edges
    const particles = edges.map((e, idx) => ({
      edge: e,
      progress: (idx * 0.22) % 1,
      speed: 0.005 + (idx % 2) * 0.003,
      size: 3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle background grid
      ctx.strokeStyle = "#F1F5F9";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Edges
      edges.forEach((e) => {
        const source = networkNodes.find((n) => n.id === e.from);
        const target = networkNodes.find((n) => n.id === e.to);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = e.isFraud ? "rgba(214, 69, 69, 0.45)" : "#CBD5E1";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw Particles
      particles.forEach((p) => {
        const source = networkNodes.find((n) => n.id === p.edge.from);
        const target = networkNodes.find((n) => n.id === p.edge.to);
        if (source && target) {
          p.progress += p.speed;
          if (p.progress >= 1) p.progress = 0;

          const px = source.x + (target.x - source.x) * p.progress;
          const py = source.y + (target.y - source.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#D64545";
          ctx.fill();
        }
      });

      // Draw Nodes
      networkNodes.forEach((node) => {
        // Outer halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = node.bg;
        ctx.fill();

        // Core Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Text label
        ctx.fillStyle = "#172B4D";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white border border-[#E1E7ED] rounded-xl p-5 shadow-sm space-y-4">
      {/* Visual Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E1E7ED]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#EAF5FC] text-[#0072BC] flex items-center justify-center font-bold">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold font-mono-code text-[#172B4D]">
            LIVE MULE FUNNEL INTERCEPTION
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF7E6] border border-[#FCE2A6] text-[10px] font-mono-code text-[#D99000] font-bold">
          <Zap className="w-3 h-3 fill-current" />
          <span>INSPECTION ACTIVE</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative h-72 w-full rounded-lg overflow-hidden bg-[#FAFCFF] border border-[#E1E7ED]">
        <canvas
          ref={canvasRef}
          width={520}
          height={320}
          className="w-full h-full block"
        />

        {/* Floating Telemetry Pill */}
        <div className="absolute top-2 right-2 bg-white/95 border border-[#E1E7ED] px-2.5 py-1 rounded text-[10px] font-mono-code shadow-2xs">
          <span className="text-[#7B8794]">Pass-Through: </span>
          <strong className="text-red-600 font-bold">95.2% in 12m</strong>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 bg-[#F5F7FA] rounded border border-[#E1E7ED] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-[10px] text-[#7B8794] block">Pattern Anomaly</span>
            <strong className="text-xs font-mono-code text-[#172B4D]">+1,408% Inflow</strong>
          </div>
        </div>

        <div className="p-2.5 bg-[#E8F8F0] rounded border border-[#A7E3C7] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] text-[#168A5B] block">Regulatory Hold</span>
            <strong className="text-xs font-mono-code text-[#168A5B]">₹98,000 Sweep Held</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeroNetworkVisual;
