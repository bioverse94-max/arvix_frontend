import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Landmark,
  Radio,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { PublicNavbar } from "../../components/public/PublicNavbar";
import { Footer } from "../../components/common/Footer";
import { ArvixLogo } from "../../components/common/ArvixLogo";

interface PartnerCategory {
  title: string;
  description: string;
  integrationFocus: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ecosystemCategories: PartnerCategory[] = [
  {
    title: "Financial Institutions",
    description:
      "Core banking architectures and cooperative financial networks managing large-volume account ecosystems.",
    integrationFocus: "Longitudinal behavioral baselines & dormant account protection",
    icon: Landmark,
  },
  {
    title: "Banks & NBFCs",
    description:
      "Public and private banking infrastructure requiring real-time mule account detection and step-up challenge triggers.",
    integrationFocus: "Step-up authentication APIs & regulatory freeze mechanisms",
    icon: Building2,
  },
  {
    title: "Payment Networks",
    description:
      "High-throughput national switches and routing gateways processing millions of transactions per minute.",
    integrationFocus: "Sub-20ms inline inference & high-velocity stream scoring",
    icon: Radio,
  },
  {
    title: "Fintech Companies",
    description:
      "Digital payment providers, neo-banking apps, and merchant service platforms seeking embedded risk controls.",
    integrationFocus: "Lightweight REST/WebSocket scoring SDKs & VPA telemetry",
    icon: Cpu,
  },
  {
    title: "Regulatory & Security Ecosystems",
    description:
      "Central regulatory bodies and cyber intelligence cells requiring cross-institutional syndicate discovery.",
    integrationFocus: "Exportable forensic dossiers & DAG graph topology",
    icon: ShieldCheck,
  },
];

export const PartnersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B4D] flex flex-col font-sans selection:bg-[#0072BC] selection:text-white">
      {/* Public Top Navbar */}
      <PublicNavbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1F36] text-white border border-[#133252] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#BAE6FD]">
              Ecosystem & Collaboration
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A1F36] tracking-tight">
              Building the future of financial intelligence together.
            </h1>
            <p className="text-sm sm:text-base text-[#526581] max-w-2xl mx-auto leading-relaxed">
              ARVIX is engineered to collaborate across institutions, payment switches, and regulatory ecosystems to defend digital payment networks against organized financial crime.
            </p>
          </div>
        </div>
      </section>

      {/* Ecosystem Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#0072BC] bg-[#EAF5FC] px-3 py-1 rounded-md">
            ECOSYSTEM PARTICIPANTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1F36]">
            Architected for Interoperability
          </h2>
          <p className="text-xs sm:text-sm text-[#526581]">
            Our platform provides standardized interfaces for entities across the digital payment lifecycle.
          </p>
        </div>

        {/* 5 Neutral Ecosystem Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs hover:border-[#0072BC]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#EAF5FC] text-[#0072BC] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0A1F36]">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#526581] leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] block">
                    Integration Focus
                  </span>
                  <span className="text-xs font-semibold text-[#0072BC] block mt-0.5">
                    {category.integrationFocus}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Neutral Open Inquiry Card */}
          <div className="bg-gradient-to-br from-[#0A1F36] to-[#061527] text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-md flex flex-col justify-between border border-[#133252]">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#0072BC] text-white flex items-center justify-center font-bold shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Integration & Pilot Sandbox
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our deployment architecture team to evaluate real-time scoring endpoints or trial our synthetic sandbox telemetry feeds.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[#38BDF8]">
                Open Collaboration
              </span>
              <Link
                to="/dashboard"
                className="text-xs font-bold text-white hover:underline flex items-center gap-1"
              >
                <span>Platform Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Principles Section */}
      <section className="bg-white border-y border-[#E2E8F0] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A1F36]">
              Institutional Integration Standards
            </h3>
            <p className="text-xs sm:text-sm text-[#526581] max-w-xl mx-auto">
              Built around strict compliance, high-availability SLA, and zero-compromise security benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong className="text-xs font-bold text-[#0A1F36]">
                  Regulatory Compliance
                </strong>
              </div>
              <p className="text-xs text-[#526581] leading-relaxed">
                Deterministic audit logging aligned with RBI master directions for digital payments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong className="text-xs font-bold text-[#0A1F36]">
                  Low Latency SLA
                </strong>
              </div>
              <p className="text-xs text-[#526581] leading-relaxed">
                Sub-20 millisecond round-trip inference to evaluate payments without checkout friction.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong className="text-xs font-bold text-[#0A1F36]">
                  Encrypted Telemetry
                </strong>
              </div>
              <p className="text-xs text-[#526581] leading-relaxed">
                FIDO2 cryptographic auth, end-to-end data encryption, and role-based access control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <ArvixLogo size="md" showText={false} className="mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1F36]">
            Ready to explore ARVIX?
          </h2>
          <p className="text-xs sm:text-sm text-[#526581] max-w-md mx-auto">
            Access the live operational console or test the simulation laboratory.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="px-5 py-3 bg-white hover:bg-slate-50 text-[#0A1F36] border border-[#CBD5E1] text-xs font-bold rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PartnersPage;
