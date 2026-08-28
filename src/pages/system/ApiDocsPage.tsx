import React from "react";
import { Terminal } from "lucide-react";
import { MLModelInspector } from "../../components/ml/MLModelInspector";

export const ApiDocsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#0072BC]" />
          <h1 className="text-xl lg:text-2xl font-bold text-[#0A1F36]">
            ML Model Inference Engine &amp; API Sandbox
          </h1>
        </div>
        <p className="text-xs text-[#526581]">
          Execute real-time ML inference tests, inspect input feature vectors, and review raw model prediction outputs.
        </p>
      </div>

      {/* Interactive ML Inspector Sandbox */}
      <MLModelInspector />
    </div>
  );
};

export default ApiDocsPage;
