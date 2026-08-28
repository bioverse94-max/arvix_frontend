import React from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";

export const AppShell: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8FAFC] font-sans antialiased text-[#172B4D]">
      {/* Clean Top Navigation Bar with Services Mega Menu */}
      <Topbar />

      {/* Main Workspace Area with Generous Whitespace */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <main className="p-6 sm:p-8 lg:p-10 space-y-10 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>

        {/* Institutional Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AppShell;
