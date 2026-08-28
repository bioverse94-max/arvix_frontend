import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">ARVIX</p>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage the Arvix transaction intelligence ecosystem
          </p>
        </div>

        <div className="dashboard-user">
          <div className="user-avatar">A</div>

          <div>
            <strong>Administrator</strong>
            <span>Admin</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">

        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "partners" ? "active" : ""}
          onClick={() => setActiveTab("partners")}
        >
          Partners
        </button>

        <button
          className={activeTab === "transactions" ? "active" : ""}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>

        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>

        <button
          onClick={() => navigate("/fraud-dashboard")}
        >
          Fraud Monitoring
        </button>

      </nav>

      {/* Content */}
      <main className="dashboard-content">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <section className="welcome-section">
              <div>
                <p className="section-label">SYSTEM OVERVIEW</p>

                <h2>Arvix Ecosystem</h2>

                <p>
                  Monitor partners, transaction activity and
                  platform-level intelligence from one place.
                </p>
              </div>
            </section>

            {/* Statistics */}
            <section className="stats-grid">

              <div className="stat-card">
                <span>Total Partners</span>
                <strong>248</strong>
                <small>Registered partners</small>
              </div>

              <div className="stat-card">
                <span>Active Partners</span>
                <strong>214</strong>
                <small>Currently active</small>
              </div>

              <div className="stat-card">
                <span>Total Transactions</span>
                <strong>1.28M</strong>
                <small>Processed transactions</small>
              </div>

              <div className="stat-card">
                <span>Flagged Transactions</span>
                <strong>1,842</strong>
                <small>Requires review</small>
              </div>

            </section>

            {/* Partner Activity */}
            <section className="dashboard-section">

              <div className="section-heading">
                <div>
                  <p className="section-label">
                    PARTNER ACTIVITY
                  </p>

                  <h2>Recent Partner Activity</h2>
                </div>
              </div>

              <div className="transaction-table">

                <div className="transaction-row transaction-header">
                  <span>Partner</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Joined</span>
                </div>

                <div className="transaction-row">
                  <span>Partner Alpha</span>
                  <span>Customer</span>
                  <span className="status-success">
                    Active
                  </span>
                  <span>Today</span>
                </div>

                <div className="transaction-row">
                  <span>Partner Beta</span>
                  <span>Institution</span>
                  <span className="status-success">
                    Active
                  </span>
                  <span>Yesterday</span>
                </div>

                <div className="transaction-row">
                  <span>Partner Gamma</span>
                  <span>Customer</span>
                  <span className="status-review">
                    Pending
                  </span>
                  <span>Yesterday</span>
                </div>

                <div className="transaction-row">
                  <span>Partner Delta</span>
                  <span>Institution</span>
                  <span className="status-success">
                    Active
                  </span>
                  <span>2 days ago</span>
                </div>

              </div>

            </section>

            {/* System Insights */}
            <section className="dashboard-section">

              <div className="section-heading">
                <div>
                  <p className="section-label">
                    PLATFORM INTELLIGENCE
                  </p>

                  <h2>System Insights</h2>
                </div>
              </div>

              <div className="insights-grid">

                <div className="insight-card">
                  <span className="insight-number">01</span>

                  <h3>Partner Growth</h3>

                  <p>
                    Monitor the growth of customers and financial
                    institutions participating in the Arvix ecosystem.
                  </p>
                </div>

                <div className="insight-card">
                  <span className="insight-number">02</span>

                  <h3>Transaction Intelligence</h3>

                  <p>
                    Track transaction volumes and patterns across
                    connected partners.
                  </p>
                </div>

                <div className="insight-card">
                  <span className="insight-number">03</span>

                  <h3>Anomaly Monitoring</h3>

                  <p>
                    Review potentially unusual transaction activity
                    detected by the platform.
                  </p>
                </div>

              </div>

            </section>
          </>
        )}

        {/* PARTNERS */}
        {activeTab === "partners" && (
          <section className="dashboard-section">

            <p className="section-label">PARTNERS</p>

            <h2>Partner Management</h2>

            <p>
              View and manage customers and financial institutions
              connected to the Arvix ecosystem.
            </p>

          </section>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <section className="dashboard-section">

            <p className="section-label">TRANSACTIONS</p>

            <h2>Transaction Monitoring</h2>

            <p>
              Platform-wide transaction information will appear
              here once the backend and dataset are connected.
            </p>

          </section>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <section className="dashboard-section">

            <p className="section-label">ANALYTICS</p>

            <h2>Platform Analytics</h2>

            <p>
              Advanced analytics and transaction intelligence
              will be displayed here.
            </p>

          </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;