import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { ArvixLogo } from "../common/ArvixLogo";

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#0A1F36]/95 backdrop-blur-md border-b border-[#133252] shadow-sm py-3"
          : "bg-[#0A1F36] border-b border-[#133252]/60 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: ARVIX Official Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90 shrink-0"
        >
          <ArvixLogo size="sm" showText={true} textColor="white" />
        </Link>

        {/* Center: Clean & Spaced Main Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <Link
            to="/"
            className={`transition-colors py-1 ${
              location.pathname === "/" || location.pathname === "/home"
                ? "text-white font-semibold"
                : "hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-white transition-colors py-1"
          >
            Platform
          </Link>
          <Link
            to="/partners"
            className={`transition-colors py-1 ${
              location.pathname === "/partners"
                ? "text-white font-semibold"
                : "hover:text-white"
            }`}
          >
            Partners
          </Link>
        </nav>

        {/* Right: Primary Call to Action */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-[#0072BC] hover:bg-[#005B96] text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 group cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1F36] border-b border-[#133252] px-6 pt-3 pb-6 space-y-3 shadow-2xl text-xs font-medium text-slate-300 animate-row-insert">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 transition-colors ${
              location.pathname === "/" || location.pathname === "/home"
                ? "text-white font-bold"
                : "hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 hover:text-white transition-colors"
          >
            Platform / Dashboard
          </Link>
          <Link
            to="/partners"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2.5 transition-colors ${
              location.pathname === "/partners"
                ? "text-white font-bold"
                : "hover:text-white"
            }`}
          >
            Partners
          </Link>

          <div className="pt-3 border-t border-white/10">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0072BC] hover:bg-[#005B96] text-white font-bold rounded-lg shadow-xs transition-colors text-center"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
