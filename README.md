# ARVIX Frontend — Web Console & Real-Time Intelligence Dashboard

This is the official enterprise frontend web application for the ARVIX Real-Time UPI Fraud & Mule-Account Intelligence Platform.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 + Custom Enterprise Design System
- **Icons:** Lucide React
- **Network Intelligence:** Canvas & Force-Directed Temporal Graph Visualization
- **API Integration:** Direct async REST client to FastAPI ML inference engine (`http://127.0.0.1:8000`)

---

## 🚀 Development & Build Commands

```bash
# Install dependencies
npm install

# Start Vite Development Server
npm run dev

# Build for Production (tsc + vite build)
npm run build

# Preview Production Build locally
npm run preview
```

---

## 📂 Key Directory Structure

```
src/
 ├── components/
 │    ├── common/          # AppShell, Topbar, ServicesMegaMenu, ArvixLogo, Badges
 │    ├── transactions/    # TransactionDetailModal with ML Input/Output tabs
 │    ├── ml/              # MLModelInspector (Interactive Sandbox)
 │    └── analytics/       # PrecisionRecallCurve, ExplainabilityPanel
 ├── pages/
 │    ├── public/          # Home.tsx, PartnersPage.tsx
 │    ├── dashboard/       # FraudDashboard.tsx, LiveTransactionsPage.tsx, RiskQueuePage.tsx
 │    ├── accounts/        # AccountIntelligencePage.tsx
 │    ├── analytics/       # RiskModelPage.tsx, ModelPerformancePage.tsx
 │    ├── system/          # ApiDocsPage.tsx, SystemHealthPage.tsx, SettingsPage.tsx
 │    └── demo/            # DemoModePage.tsx (8-Stage Presentation Simulation Lab)
 ├── services/
 │    ├── api/             # mlService.ts (FastAPI Client)
 │    └── transactionService.ts # Real-time transaction streaming & scoring
 └── types/
      └── transaction.ts   # Core transaction, signal, and ML risk interfaces
```

---

## 🔗 Environment Variables

Configure `.env` or `.env.local` if custom backend hosts are needed:

```env
VITE_ML_API_URL=http://127.0.0.1:8000
```
