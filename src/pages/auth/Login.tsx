import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowLeft, Eye, EyeOff, User as UserIcon, Building2, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ArvixLogo } from "../../components/common/ArvixLogo";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("a.sengupta@npci.gov.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDestinationForRole = (emailInput: string) => {
    const lower = emailInput.toLowerCase();
    if (lower.includes("customer") || lower.includes("gmail") || lower.includes("user")) {
      return "/customer-dashboard";
    }
    if (lower.includes("partner") || lower.includes("hdfc") || lower.includes("icici") || lower.includes("bank")) {
      return "/partner-dashboard";
    }
    if (lower.includes("admin")) {
      return "/admin-dashboard";
    }
    return "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered Email or User ID.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email.trim(), password);

      const target = (location.state as any)?.from?.pathname || getDestinationForRole(email.trim());
      navigate(target, { replace: true });
    } catch {
      setError("Invalid credentials. Please verify your User ID.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaLogin = async (targetEmail: string, destination: string) => {
    setEmail(targetEmail);
    setPassword("password123");
    setIsLoading(true);
    setError(null);
    try {
      await login(targetEmail, "password123");
      navigate(destination, { replace: true });
    } catch (e) {
      console.warn("Persona login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Brand & Back to Home */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526581] hover:text-[#0072BC] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ARVIX Home</span>
        </Link>

        <div className="flex flex-col items-center">
          <ArvixLogo size="md" showText={true} textColor="dark" className="justify-center" />
          <h2 className="mt-4 text-2xl font-extrabold text-[#0A1F36] tracking-tight">
            Welcome to ARVIX
          </h2>
          <p className="mt-1 text-xs text-[#526581] text-center max-w-sm">
            Sign in to access your persona-specific intelligence dashboard
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#E1E7ED] rounded-2xl shadow-xs space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / User ID */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#172B4D]">
                Email address or Operator ID
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@npci.gov.in or customer@gmail.com"
                  className="w-full text-xs font-mono-code p-2.5 bg-white border border-[#E1E7ED] rounded-lg text-[#172B4D] focus:outline-hidden focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold text-[#172B4D]">
                  Password
                </label>
                <span className="text-[11px] text-[#0072BC] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  className="w-full text-xs p-2.5 bg-white border border-[#E1E7ED] rounded-lg text-[#172B4D] pr-10 focus:outline-hidden focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#526581]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E1E7ED] text-[#0072BC] focus:ring-[#0072BC]"
                />
                <span>Remember this session</span>
              </label>

              <span className="text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FIDO2 / 2FA Active
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? "Authenticating Session..." : "Sign In to Your Dashboard"}</span>
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-xs text-[#526581]">
              Don't have an account?{" "}
              <Link to="/become-a-partner" className="font-bold text-[#0072BC] hover:underline">
                Register as Customer or Partner Bank
              </Link>
            </p>
          </div>

          {/* Quick 1-Click Demo Personas */}
          <div className="pt-3 border-t border-[#E1E7ED] space-y-2">
            <span className="text-[11px] font-bold text-[#7B8794] block uppercase tracking-wider text-center">
              1-Click Persona Demo Sign-in
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* 1. Public Customer */}
              <button
                type="button"
                onClick={() => handlePersonaLogin("customer@gmail.com", "/customer-dashboard")}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span>Public Retail User (Customer Dashboard)</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono-code">Personal View &rarr;</span>
              </button>

              {/* 2. Partner Bank */}
              <button
                type="button"
                onClick={() => handlePersonaLogin("partner.hdfc@npci.gov.in", "/partner-dashboard")}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Partner Bank Officer (HDFC Bank Portal)</span>
                </div>
                <span className="text-[10px] text-amber-700 font-mono-code">Bank View &rarr;</span>
              </button>

              {/* 3. Lead Fraud Analyst */}
              <button
                type="button"
                onClick={() => handlePersonaLogin("a.sengupta@npci.gov.in", "/dashboard")}
                className="w-full py-2 px-3 bg-[#EAF5FC] hover:bg-[#D4EDFC] text-[#0072BC] border border-[#BAE6FD] text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0072BC]" />
                  <span>Lead Fraud Analyst (NPCI Admin Console)</span>
                </div>
                <span className="text-[10px] text-[#0072BC] font-mono-code">Admin View &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-6 text-center text-[11px] text-[#7B8794] font-mono-code">
          Authorized access under RBI UPI Safety & Risk Governance Framework.
        </p>
      </div>
    </div>
  );
};

export default Login;