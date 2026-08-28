import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Layout
import { AppShell } from "./components/common/AppShell";

// Public pages
import Home from "./pages/public/Home";
import PartnersPage from "./pages/public/PartnersPage";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/onboarding/Onboarding";

// Arvix Enterprise Pages
import FraudDashboard from "./pages/dashboard/FraudDashboard";
import LiveTransactionsPage from "./pages/dashboard/LiveTransactionsPage";
import RiskQueuePage from "./pages/dashboard/RiskQueuePage";
import MuleAccountsPage from "./pages/dashboard/MuleAccountsPage";
import FraudClustersPage from "./pages/dashboard/FraudClustersPage";
import TransactionGraphPage from "./pages/dashboard/TransactionGraphPage";
import AccountIntelligencePage from "./pages/accounts/AccountIntelligencePage";
import CasesPage from "./pages/investigation/CasesPage";
import CaseDetailPage from "./pages/investigation/CaseDetailPage";
import AlertsPage from "./pages/investigation/AlertsPage";
import InvestigationTimelinePage from "./pages/investigation/InvestigationTimelinePage";
import PatternOfLifePage from "./pages/analytics/PatternOfLifePage";
import GraphSignalsPage from "./pages/analytics/GraphSignalsPage";
import RiskModelPage from "./pages/analytics/RiskModelPage";
import ModelPerformancePage from "./pages/analytics/ModelPerformancePage";
import ReportsPage from "./pages/reports/ReportsPage";
import SystemHealthPage from "./pages/system/SystemHealthPage";
import ApiDocsPage from "./pages/system/ApiDocsPage";
import AuditLogsPage from "./pages/system/AuditLogsPage";
import SettingsPage from "./pages/system/SettingsPage";
import DemoModePage from "./pages/demo/DemoModePage";
import DatasetGeneratorPage from "./pages/demo/DatasetGeneratorPage";

// Legacy dashboards
import PartnerDashboard from "./pages/dashboard/PartnerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 1. Public Entry Landing Page (/) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* 2. Public Ecosystem / Partners Page */}
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/find-partner" element={<PartnersPage />} />
        <Route path="/become-a-partner" element={<Onboarding />} />

        {/* 3. Authentication */}
        <Route path="/login" element={<Login />} />

        {/* 4. Protected Enterprise Arvix Fraud Intelligence Suite */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<FraudDashboard />} />
            <Route path="/fraud-dashboard" element={<FraudDashboard />} />

            {/* Monitoring */}
            <Route path="/transactions" element={<LiveTransactionsPage />} />
            <Route path="/transactions/:id" element={<LiveTransactionsPage />} />
            <Route path="/risk-queue" element={<RiskQueuePage />} />
            <Route path="/accounts" element={<AccountIntelligencePage />} />
            <Route path="/accounts/:id" element={<AccountIntelligencePage />} />

            {/* Fraud Intelligence */}
            <Route path="/mule-accounts" element={<MuleAccountsPage />} />
            <Route path="/clusters" element={<FraudClustersPage />} />
            <Route path="/graph" element={<TransactionGraphPage />} />

            {/* Analytics & Models */}
            <Route path="/analytics/pattern-of-life" element={<PatternOfLifePage />} />
            <Route path="/analytics/graph" element={<GraphSignalsPage />} />
            <Route path="/analytics/risk" element={<RiskModelPage />} />
            <Route path="/analytics/risk-model" element={<RiskModelPage />} />
            <Route path="/analytics/models" element={<ModelPerformancePage />} />

            {/* Investigation */}
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CaseDetailPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/timeline" element={<InvestigationTimelinePage />} />

            {/* Reports & System */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/system-health" element={<SystemHealthPage />} />
            <Route path="/api" element={<ApiDocsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* SIH Live Showcase Simulator */}
            <Route path="/demo" element={<DemoModePage />} />
            <Route path="/dataset-generator" element={<DatasetGeneratorPage />} />
            <Route path="/studio" element={<DatasetGeneratorPage />} />

            {/* Preserved legacy dashboards */}
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;