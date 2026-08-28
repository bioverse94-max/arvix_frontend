import { mockClusters, globalGraphData } from "../data/mock/fraudClusters";
import type { FraudCluster, GraphData } from "../types/graph";

class GraphService {
  public async getGraphData(): Promise<GraphData> {
    try {
      const res = await fetch("/api/graph/data");
      if (res.ok) {
        const data = await res.json();
        if (data && data.nodes && data.nodes.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("Falling back to mock graph data:", err);
    }
    return {
      nodes: [...globalGraphData.nodes],
      links: [...globalGraphData.links],
    };
  }

  public async getClusters(): Promise<FraudCluster[]> {
    try {
      const res = await fetch("/api/graph/clusters");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("Falling back to mock clusters:", err);
    }
    return [...mockClusters];
  }

  public async getClusterById(id: string): Promise<FraudCluster | undefined> {
    try {
      const res = await fetch(`/api/graph/clusters/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("Falling back to mock cluster by id:", err);
    }
    const clusters = await this.getClusters();
    return clusters.find((c) => c.cluster_id === id);
  }

  public async getMuleFunnelTopology(): Promise<GraphData> {
    const clusters = await this.getClusters();
    const cluster = clusters[0] || mockClusters[0];
    return {
      nodes: [...cluster.nodes],
      links: [...cluster.links],
    };
  }
}

export const graphService = new GraphService();

