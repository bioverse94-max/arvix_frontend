import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Network,
  Radio,
  Sparkles,
  Layers,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { PublicNavbar } from "../../components/public/PublicNavbar";
import { Footer } from "../../components/common/Footer";
import { ArvixLogo } from "../../components/common/ArvixLogo";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const scrollToCapabilities = () => {
    const el = document.getElementById("capabilities");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col font-sans selection:bg-[#0072BC] selection:text-white">
      {/* Top Public Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
        {/* Subtle Ambient Background Gradients Inspired by ARVIX Brand */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Official Brand Lockup Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0A1F36] text-white border border-[#133252] shadow-xs animate-row-insert">
            <ArvixLogo size="xs" showText={false} />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#BAE6FD]">
              Financial Intelligence Platform
            </span>
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A1F36] tracking-tight leading-[1.15]">
              Intelligence for Safer <br className="hidden sm:inline" />
              Financial Networks.
            </h1>
            <p className="text-base sm:text-lg text-[#526581] max-w-2xl mx-auto leading-relaxed font-normal">
              ARVIX helps financial ecosystems identify suspicious activity, monitor emerging risks, and enable faster intervention through intelligent fraud intelligence.
            </p>
          </div>

          {/* Hero Action CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0072BC] hover:bg-[#005B96] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              onClick={scrollToCapabilities}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0A1F36] border border-[#CBD5E1] text-sm font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-[#526581]" />
            </button>
          </div>

          {/* Trust & Metric Pill Band */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
                Inference Latency
              </span>
              <span className="text-base font-bold font-mono-code text-[#0A1F36]">
                &lt; 20 ms
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
                Mule Funnel Recall
              </span>
              <span className="text-base font-bold font-mono-code text-emerald-700">
                87.4%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
                Network Topology
              </span>
              <span className="text-base font-bold font-mono-code text-[#0072BC]">
                Multi-Hop DAG
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
                Compliance Baseline
              </span>
              <span className="text-base font-bold font-mono-code text-[#0A1F36]">
                Audit Grade
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: What ARVIX Does */}
      <section id="capabilities" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#0072BC] bg-[#EAF5FC] px-3 py-1 rounded-md">
            CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1F36] tracking-tight">
            What ARVIX Does
          </h2>
          <p className="text-sm text-[#526581] leading-relaxed">
            Continuous intelligence specifically architected for modern, high-velocity financial infrastructures.
          </p>
        </div>

        {/* 3 Simple Capability Cards: Detect, Analyze, Intervene */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Detect */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7 sm:p-8 space-y-4 shadow-xs hover:border-[#0072BC]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EAF5FC] text-[#0072BC] flex items-center justify-center font-bold transition-transform group-hover:scale-105">
              <Radio className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A1F36]">Detect</h3>
              <p className="text-xs sm:text-sm text-[#526581] leading-relaxed">
                Identify unusual transaction patterns and emerging anomalies across streaming payment channels before settlement.
              </p>
            </div>
          </div>

          {/* Card 2: Analyze */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7 sm:p-8 space-y-4 shadow-xs hover:border-[#0072BC]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold transition-transform group-hover:scale-105">
              <Network className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A1F36]">Analyze</h3>
              <p className="text-xs sm:text-sm text-[#526581] leading-relaxed">
                Turn complex network activity into actionable intelligence with graph topology, funnel discovery, and explainable AI metrics.
              </p>
            </div>
          </div>

          {/* Card 3: Intervene */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7 sm:p-8 space-y-4 shadow-xs hover:border-[#0072BC]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold transition-transform group-hover:scale-105">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0A1F36]">Intervene</h3>
              <p className="text-xs sm:text-sm text-[#526581] leading-relaxed">
                Prioritize high-risk events and support faster responses through automated step-up challenges and regulatory freeze authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Built for Financial Intelligence */}
      <section className="bg-white border-y border-[#E2E8F0] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#0072BC] bg-[#EAF5FC] px-3 py-1 rounded-md">
              USE CASES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1F36] tracking-tight">
              Built for Financial Intelligence
            </h2>
            <p className="text-sm text-[#526581] leading-relaxed">
              Modular capabilities tailored to protect diverse layers of digital payment and banking operations.
            </p>
          </div>

          {/* 4 Ecosystem Use Cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use Case 1 */}
            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:bg-white hover:border-[#0072BC]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-[#0072BC] flex items-center justify-center">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A1F36]">
                Transaction Monitoring
              </h4>
              <p className="text-xs text-[#526581] leading-relaxed">
                Real-time inline scoring of transaction streams to intercept anomalous behavioral velocity.
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:bg-white hover:border-[#0072BC]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A1F36]">
                Risk Intelligence
              </h4>
              <p className="text-xs text-[#526581] leading-relaxed">
                Multi-dimensional risk scoring combining historical account baselines with telemetry signals.
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:bg-white hover:border-[#0072BC]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-rose-100/80 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A1F36]">
                Fraud Detection
              </h4>
              <p className="text-xs text-[#526581] leading-relaxed">
                Specialized pattern recognition for mule funnels, pass-through nodes, and syndicate sweeps.
              </p>
            </div>

            {/* Use Case 4 */}
            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 hover:bg-white hover:border-[#0072BC]/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#0A1F36]">
                Network Analysis
              </h4>
              <p className="text-xs text-[#526581] leading-relaxed">
                Multi-hop graph topology visualization to trace flow routes and cluster communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Operational Platform Preview Banner */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-[#0A1F36] text-white rounded-3xl p-8 sm:p-12 border border-[#133252] relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0072BC]/30 text-[#BAE6FD] text-xs font-mono-code font-bold border border-[#0072BC]/50">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>ENTERPRISE PLATFORM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Ready to explore the ARVIX Intelligence Console?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the full operational dashboard with live transaction feeds, interactive graph visualizers, risk triage queues, and forensic dossiers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-6 py-3 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/partners"
              className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold rounded-xl transition-all text-center"
            >
              View Partners
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
};

export default Home;