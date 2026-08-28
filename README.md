# ARVIX Intelligence Dashboard 🛡️

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Welcome to the **ARVIX Frontend**, the official enterprise web console and real-time intelligence dashboard designed to monitor, visualize, and analyze UPI fraud and mule-account networks.

## 📖 Overview

The ARVIX Dashboard provides analysts and investigators with a powerful interface to detect illicit financial patterns in real-time. It seamlessly connects to the ARVIX Machine Learning Inference Engine to stream transaction evaluations, graph analytics, and live alerts directly into an intuitive, high-performance web interface.

## ✨ Key Features

- **Real-Time Transaction Monitoring:** Stream and analyze UPI transactions continuously.
- **Force-Directed Graph Analytics:** Visualize complex mule-network structures and circular money flows instantly.
- **Interactive ML Sandbox:** Inspect and interpret machine learning decisions (explainable AI) for every flagged transaction.
- **Enterprise-Grade UI:** High-performance, tailored component library built with Tailwind CSS v4.
- **Demo Mode:** Fully simulated 8-stage presentation lab for showcasing platform capabilities.

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Bundler:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualizations:** `recharts` for metrics and `react-force-graph-2d` for network graphs
- **Icons:** `lucide-react`
- **Routing:** `react-router-dom`

## 🚀 Getting Started

Follow these steps to set up the dashboard on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- The ARVIX Backend (FastAPI ML inference engine) running locally.

### 1. Installation
Clone the repository and install the dependencies:
```bash

# Install dependencies
npm install
```

### 2. Environment Variables
The application requires connection details for the ARVIX backend engine. We've provided an `.env.example` file. 

Create a `.env` file in the root of the project:
```bash
cp .env.example .env
```

Ensure your `.env` contains the API base URL:
```env
VITE_ML_API_URL=http://127.0.0.1:8000
```
*(Adjust the host or port if your FastAPI backend runs on a different address.)*

### 3. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`.

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Compiles TypeScript and builds the production bundle. |
| `npm run lint` | Runs ESLint to check for code quality and formatting issues. |
| `npm run preview` | Boots up a local web server to preview the production build. |

## 📂 Project Structure

```text
src/
 ├── components/
 │    ├── common/          # Layout, AppShell, Topbar, Badges, Logos
 │    ├── transactions/    # Transaction modals & data grids
 │    ├── ml/              # Interactive ML Model Inspector
 │    └── analytics/       # Evaluation charts and Explainability UI
 ├── pages/
 │    ├── public/          # Landing and Partner pages
 │    ├── dashboard/       # Core Fraud Dashboards & Live Queue
 │    ├── accounts/        # Account-specific risk profiles
 │    ├── analytics/       # Global Risk & Model Performance metrics
 │    ├── system/          # API Docs, Settings, and Health Checks
 │    └── demo/            # Interactive Sandbox & Presentation Simulation
 ├── services/
 │    ├── api/             # API clients (e.g., FastAPI backend connectivity)
 │    └── transactionService.ts # Stream handlers and scoring interfaces
 └── types/
      └── transaction.ts   # Core TypeScript definitions and interfaces
```

## 🤝 API Integration
This frontend operates strictly as a client. It communicates with the ARVIX Backend asynchronously to fetch fraud scores, retrieve transaction nodes, and perform structural analysis. Ensure your backend server is responsive to fully utilize the dashboard's capabilities.
