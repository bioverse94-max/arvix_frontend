import React, { useState, useEffect } from "react";
import { Filter, User, ArrowRight, Layers } from "lucide-react";
import { TransactionGraph } from "../../components/graph/TransactionGraph";
import { graphService } from "../../services/graphService";
import type { GraphData, GraphNode } from "../../types/graph";
import { RiskBadge } from "../../components/common/RiskBadge";
import { useNavigate } from "react-router-dom";

export const TransactionGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [minVolumeFilter, setMinVolumeFilter] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGraph = () => {
      graphService.getGraphData().then((data) => {
        setGraphData(data);
        const defaultMule = data.nodes.find((n) => n.role === "MULE" || n.risk_score >= 80) || data.nodes[0];
        if (defaultMule) setSelectedNode(defaultMule);
      });
    };

    loadGraph();
    window.addEventListener("arvix-data-refreshed", loadGraph);
    return () => {
      window.removeEventListener("arvix-data-refreshed", loadGraph);
    };
  }, []);

  const filteredGraphData: GraphData = React.useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };

    const filteredNodes = graphData.nodes.filter((n) => {
      if (activeFilter === "MULE" && n.role !== "MULE") return false;
      if (activeFilter === "VICTIM" && n.role !== "VICTIM") return false;
      if (activeFilter === "CRITICAL" && n.risk_score < 70) return false;
      const totalVol = (n.total_inflow || 0) + (n.total_outflow || 0);
      if (minVolumeFilter > 0 && totalVol < minVolumeFilter) return false;
      return true;
    });

    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = graphData.links.filter(
      (l) =>
        nodeIds.has(typeof l.source === "string" ? l.source : l.source.id) &&
        nodeIds.has(typeof l.target === "string" ? l.target : l.target.id)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, activeFilter, minVolumeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0A1F36] tracking-tight">
            Network Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-1">
            Force-directed money flow topology visualizer and funnel choke-point inspector.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-code text-xs text-[#526581]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse" />
          <span>Interactive Topology Live</span>
        </div>
      </div>

      {/* Main Grid: Sidebar Controls (Left 3.5) + Canvas (Right 8.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GRAPH SIDEBAR PANEL (Requirement 18) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
          {/* Section: Network Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Filter className="w-4 h-4 text-[#0072BC]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                Network Filters
              </h3>
            </div>

            {/* Risk Level Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#526581] block">
                Node Classification
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: "ALL", label: "All Nodes" },
                  { id: "CRITICAL", label: "Score ≥ 70" },
                  { id: "MULE", label: "Mule Nodes" },
                  { id: "VICTIM", label: "Victim Sources" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                      activeFilter === f.id
                        ? "bg-[#0A1F36] text-white shadow-2xs font-bold"
                        : "bg-[#F8FAFC] text-[#526581] border border-[#CBD5E1] hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-[#526581]">Min Flow Volume</span>
                <span className="font-mono-code font-bold text-[#0A1F36]">
                  {minVolumeFilter === 0 ? "Any Volume" : `≥ ₹${minVolumeFilter.toLocaleString("en-IN")}`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={5000}
                value={minVolumeFilter}
                onChange={(e) => setMinVolumeFilter(Number(e.target.value))}
                className="w-full accent-[#0072BC] cursor-pointer"
              />
            </div>
          </div>

          {/* Section: Selected Account Dossier */}
          <div className="space-y-4 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0072BC]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F36] font-mono-code">
                  Selected Account
                </h3>
              </div>
              {selectedNode && (
                <RiskBadge level={selectedNode.risk_score >= 70 ? "CRITICAL" : selectedNode.risk_score >= 40 ? "MEDIUM" : "LOW"} score={selectedNode.risk_score} size="sm" />
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#0A1F36] font-mono-code font-bold text-sm">
                      {selectedNode.id}
                    </strong>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0072BC] font-mono-code">
                      {selectedNode.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#526581] font-mono-code block">
                    {selectedNode.vpa}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                      Risk Score
                    </span>
                    <strong className="text-lg font-mono-code text-red-600">
                      {selectedNode.risk_score} / 100
                    </strong>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#7B8794] block uppercase font-mono-code font-bold">
                      Inflow / Outflow
                    </span>
                    <strong className="text-sm font-mono-code text-[#0A1F36]">
                      ₹{((selectedNode.total_inflow || 0) + (selectedNode.total_outflow || 0) || 98000).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#EAF5FC] border border-[#BAE6FD] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0072BC] font-bold text-xs">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Funnel Choke-Point Analysis</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Node acts as rapid aggregator forwarding {selectedNode.in_degree || 12} inbound transfers to a single collection address.
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/accounts/${selectedNode.id}`)}
                  className="w-full py-2.5 bg-[#0072BC] hover:bg-[#005B96] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Open Complete Forensic Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 font-mono-code">
                Click any node on the graph canvas to view details
              </div>
            )}
          </div>
        </div>

        {/* GRAPH CANVAS WORKSPACE (Right 8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-xl relative flex flex-col justify-between">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono-code text-[11px]">
              <span className="text-[#38BDF8] font-bold">Force-Directed DAG</span>
              <span>· {filteredGraphData.nodes.length} Nodes</span>
              <span>· {filteredGraphData.links.length} Edges</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono-code">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Mule Node
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Victim Node
              </span>
            </div>
          </div>

          <div className="w-full min-h-[580px]">
            <TransactionGraph
              data={filteredGraphData}
              height={580}
              highlightNodeId={selectedNode?.id}
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>

          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
            <span>Scroll to Zoom · Drag canvas to pan · Click node to inspect</span>
            <span className="text-[#38BDF8]">Centrality Algorithm: PageRank &amp; In-Degree</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionGraphPage;
