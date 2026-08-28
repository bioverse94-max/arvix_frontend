import React, { useRef, useEffect, useState, useCallback } from "react";
import type { GraphData, GraphNode } from "../../types/graph";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface TransactionGraphProps {
  data: GraphData;
  height?: number;
  highlightNodeId?: string;
  onSelectNode?: (node: GraphNode) => void;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  data,
  height = 500,
  highlightNodeId,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  // Initialize node layout positions in clear topology
  useEffect(() => {
    if (!data || data.nodes.length === 0) return;

    const width = 800;
    const h = height;
    const centerX = width / 2;
    const centerY = h / 2;

    const positioned = data.nodes.map((node, i) => {
      let x = centerX;
      let y = centerY;

      if (node.role === "MULE") {
        x = centerX;
        y = centerY;
      } else if (node.role === "VICTIM") {
        x = centerX - 240;
        y = centerY - 150 + i * 50;
      } else if (node.role === "COLLECTION") {
        const offset = (i - 0.5) * 120;
        x = centerX + 240;
        y = centerY + offset;
      } else {
        const angle = i * 1.2;
        x = centerX + Math.cos(angle) * 260;
        y = centerY + Math.sin(angle) * 140;
      }

      return {
        ...node,
        x,
        y,
        val: node.role === "MULE" ? 20 : node.role === "COLLECTION" ? 16 : 12,
      };
    });

    setNodes(positioned);
  }, [data, height]);

  // Main Canvas Render Loop (Institutional Clean Light Canvas)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with clean white surface
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw Subtle Grid Lines for Analytical Context
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 1;
    for (let x = -500; x < 1500; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, -500);
      ctx.lineTo(x, 1500);
      ctx.stroke();
    }
    for (let y = -500; y < 1500; y += 40) {
      ctx.beginPath();
      ctx.moveTo(-500, y);
      ctx.lineTo(1500, y);
      ctx.stroke();
    }

    // Draw Directed Links (Grey / Red lines with directional arrow)
    data.links.forEach((link) => {
      const sourceId = typeof link.source === "string" ? link.source : link.source.id;
      const targetId = typeof link.target === "string" ? link.target : link.target.id;

      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);

      if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (link.is_fraud) {
          ctx.strokeStyle = "#D64545";
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = "#CBD5E1";
          ctx.lineWidth = 1.5;
        }
        ctx.stroke();

        // Draw directional arrow on the link
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const angle = Math.atan2(dy, dx);
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-6, -3);
        ctx.lineTo(-6, 3);
        ctx.closePath();
        ctx.fillStyle = link.is_fraud ? "#D64545" : "#94A3B8";
        ctx.fill();
        ctx.restore();
      }
    });

    // Draw Nodes (Professional Outlined Nodes)
    nodes.forEach((node) => {
      if (!node.x || !node.y) return;

      const isHighlighted = highlightNodeId === node.id;
      const radius = (node.val || 12) * (isHighlighted ? 1.2 : 1);

      // Node Body
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

      if (node.role === "MULE") {
        ctx.fillStyle = "#FCEAEB";
        ctx.strokeStyle = "#A91D2F";
      } else if (node.role === "COLLECTION") {
        ctx.fillStyle = "#F3E8FF";
        ctx.strokeStyle = "#7E22CE";
      } else if (node.role === "VICTIM") {
        ctx.fillStyle = "#EAF5FC";
        ctx.strokeStyle = "#0072BC";
      } else {
        ctx.fillStyle = "#E8F8F0";
        ctx.strokeStyle = "#168A5B";
      }

      ctx.lineWidth = isHighlighted ? 3 : 2;
      ctx.fill();
      ctx.stroke();

      // Node Label
      ctx.fillStyle = "#172B4D";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.name.split(" ")[0], node.x, node.y + radius + 14);

      // Sub-label (ID / Bank)
      ctx.fillStyle = "#7B8794";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(node.id, node.x, node.y + radius + 25);
    });

    ctx.restore();
  }, [data, nodes, zoom, pan, highlightNodeId]);

  useEffect(() => {
    render();
  }, [render]);

  // Handle Canvas Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = height;
      render();
    }
  }, [height, render]);

  // Mouse Interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    const clickedNode = nodes.find((n) => {
      if (!n.x || !n.y) return false;
      const dx = n.x - clickX;
      const dy = n.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) <= (n.val || 14) + 6;
    });

    if (clickedNode && onSelectNode) {
      onSelectNode(clickedNode);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden bg-white border border-[#E1E7ED] shadow-xs">
      {/* Zoom / Pan Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white border border-[#E1E7ED] rounded-md p-1 shadow-xs">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
          className="p-1 rounded text-[#526581] hover:text-[#172B4D] hover:bg-slate-100"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
          className="p-1 rounded text-[#526581] hover:text-[#172B4D] hover:bg-slate-100"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1 rounded text-[#526581] hover:text-[#172B4D] hover:bg-slate-100"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Analytical Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-4 bg-white/95 px-3 py-1.5 rounded-md border border-[#E1E7ED] text-[11px] text-[#526581]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FCEAEB] border border-[#A91D2F]"></span>
          <span>Mule Choke-Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAF5FC] border border-[#0072BC]"></span>
          <span>Victim Senders</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F3E8FF] border border-[#7E22CE]"></span>
          <span>Collection Sinks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#D64545]"></span>
          <span>Siphon Flow</span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full cursor-grab active:cursor-grabbing block"
      />
    </div>
  );
};
export default TransactionGraph;
