import { Link } from "react-router-dom";
import { Shield, LayoutDashboard } from "lucide-react";

function Navbar() {
  return (
    <nav className="h-16 bg-[#082A49] text-white flex items-center justify-between px-6 border-b border-[#123B63]">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0072BC] text-white flex items-center justify-center font-extrabold shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-extrabold font-mono-code text-base tracking-wider text-white">
            ARVIX
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-6 text-xs font-semibold">
        <Link to="/home" className="text-slate-300 hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/find-partner" className="text-slate-300 hover:text-white transition-colors">
          Find a Partner
        </Link>
        <Link to="/become-a-partner" className="text-slate-300 hover:text-white transition-colors">
          Become a Partner
        </Link>
        <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
          Login
        </Link>
        <Link
          to="/dashboard"
          className="px-3.5 py-1.5 bg-[#0072BC] hover:bg-[#005B96] text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Fraud Operations Console</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;