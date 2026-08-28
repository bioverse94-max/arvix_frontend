import React, { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { graphService } from "../../services/graphService";
import type { FraudCluster } from "../../types/graph";
import { TransactionGraph } from "../../components/graph/TransactionGraph";
import { useNavigate } from "react-router-dom";

export const FraudClustersPage: React.FC = () => {
  const [clusters, setClusters] = useState<FraudCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<FraudCluster | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClusters = () => {
      graphService.getClusters().then((res) => {
        setClusters(res);
        if (res.length > 0) setSelectedCluster(res[0]);
      });
    };

    loadClusters();
    window.addEventListener("arvix-data-refreshed", loadClusters);
    return () => {
      window.removeEventListener("arvix-data-refreshed", loadClusters);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0072BC]" />
            <h1 className="text-xl lg:text-2xl font-bold text-[#172B4D]">
              Multi-Account Fraud Clusters & Syndicates
            </h1>
          </div>
          <p className="text-xs text-[#526581]">
            Connected graph communities exhibiting coordinated funneling, high betweenness centrality, and mule syndicates.
          </p>
        </div>
      </div>

      {/* Cluster Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cluster List */}
        <div className="lg:col-span-5 space-y-3">
          {clusters.map((c) => (
            <div
              key={c.cluster_id}
              onClick={() => setSelectedCluster(c)}
              className={`arvix-card p-5 border cursor-pointer transition-all ${
                selectedCluster?.cluster_id === c.cluster_id
                  ? "bg-[#EAF5FC] border-[#0072BC] ring-1 ring-[#0072BC]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                  {c.cluster_id}
                </span>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded">
                  Conviction: {c.conviction_score}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172B4D] mt-1">{c.name}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-[#7B8794] block">Victims Identified</span>
                  <span className="font-mono-code font-bold text-[#172B4D]">{c.victim_count} accounts</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7B8794] block">Funneled Volume</span>
                  <span className="font-mono-code font-bold text-red-600">
                    ₹{c.total_funneled_amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Cluster Visualization */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCluster && (
            <div className="arvix-card p-5 bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-[#172B4D]">{selectedCluster.name}</h3>
                  <p className="text-xs text-[#526581]">
                    Central Choke-point: <span className="font-mono-code text-[#0072BC] font-bold">{selectedCluster.mule_vpa}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/accounts/${selectedCluster.mule_account_id}`)}
                  className="px-3 py-1.5 bg-[#0072BC] text-white text-xs font-bold rounded-lg hover:bg-[#005B96] transition-colors"
                >
                  Inspect Mule Account
                </button>
              </div>

              <TransactionGraph
                data={{
                  nodes: selectedCluster.nodes,
                  links: selectedCluster.links,
                }}
                height={380}
                highlightNodeId={selectedCluster.mule_account_id}
                onSelectNode={(node) => navigate(`/accounts/${node.id}`)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FraudClustersPage;
