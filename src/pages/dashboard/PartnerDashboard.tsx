import { useState } from "react";

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="partner-dashboard">

      {/* Header */}
      <header className="partner-header">
        <div>
          <p className="partner-label">ARVIX</p>

          <h1>Partner Dashboard</h1>

          <p className="partner-subtitle">
            Your UPI transaction intelligence at a glance
          </p>
        </div>

        <div className="partner-user">
          <div className="partner-avatar">P</div>

          <div>
            <strong>Partner Account</strong>
            <span>Customer Partner</span>
          </div>
        </div>
      </header>


      {/* Navigation */}
      <nav className="partner-nav">

        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "transactions" ? "active" : ""}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>

        <button
          className={activeTab === "insights" ? "active" : ""}
          onClick={() => setActiveTab("insights")}
        >
          Insights
        </button>

        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>

      </nav>


      {/* Main Content */}
      <main className="partner-content">

        {/* =========================
            OVERVIEW
        ========================= */}

        {activeTab === "overview" && (
          <>

            <section className="partner-welcome">

              <p className="partner-section-label">
                PARTNER OVERVIEW
              </p>

              <h2>Transaction Intelligence</h2>

              <p>
                Monitor your UPI transaction activity and understand
                important patterns across your transaction data.
              </p>

            </section>


            {/* Statistics */}

            <section className="partner-stats">

              <div className="partner-stat-card">
                <span>Total Transactions</span>

                <strong>12,480</strong>

                <small>
                  Transactions processed
                </small>
              </div>


              <div className="partner-stat-card">
                <span>Successful Transactions</span>

                <strong>11,926</strong>

                <small>
                  95.6% success rate
                </small>
              </div>


              <div className="partner-stat-card">
                <span>Total Transaction Value</span>

                <strong>₹18.42L</strong>

                <small>
                  Across recorded transactions
                </small>
              </div>


              <div className="partner-stat-card">
                <span>Flagged Activity</span>

                <strong>84</strong>

                <small>
                  Transactions requiring attention
                </small>
              </div>

            </section>


            {/* Recent Transactions */}

            <section className="partner-section">

              <div className="partner-section-heading">

                <div>
                  <p className="partner-section-label">
                    TRANSACTION ACTIVITY
                  </p>

                  <h2>Recent Transactions</h2>
                </div>

              </div>


              <div className="partner-table">

                <div className="partner-table-row partner-table-header">

                  <span>Transaction ID</span>

                  <span>Amount</span>

                  <span>Status</span>

                  <span>Date</span>

                </div>


                <div className="partner-table-row">

                  <span>TXN-10482</span>

                  <span>₹2,450</span>

                  <span className="partner-status-success">
                    Successful
                  </span>

                  <span>Today</span>

                </div>


                <div className="partner-table-row">

                  <span>TXN-10481</span>

                  <span>₹780</span>

                  <span className="partner-status-success">
                    Successful
                  </span>

                  <span>Today</span>

                </div>


                <div className="partner-table-row">

                  <span>TXN-10480</span>

                  <span>₹6,200</span>

                  <span className="partner-status-review">
                    Flagged
                  </span>

                  <span>Yesterday</span>

                </div>


                <div className="partner-table-row">

                  <span>TXN-10479</span>

                  <span>₹1,150</span>

                  <span className="partner-status-success">
                    Successful
                  </span>

                  <span>Yesterday</span>

                </div>

              </div>

            </section>


            {/* Insights */}

            <section className="partner-section">

              <div className="partner-section-heading">

                <div>

                  <p className="partner-section-label">
                    PLATFORM INTELLIGENCE
                  </p>

                  <h2>Your Insights</h2>

                </div>

              </div>


              <div className="partner-insights">

                <div className="partner-insight-card">

                  <span className="partner-insight-number">
                    01
                  </span>

                  <h3>
                    Transaction Activity
                  </h3>

                  <p>
                    Your transaction activity has remained
                    consistent across the recent period.
                  </p>

                </div>


                <div className="partner-insight-card">

                  <span className="partner-insight-number">
                    02
                  </span>

                  <h3>
                    Payment Patterns
                  </h3>

                  <p>
                    Arvix can help identify recurring transaction
                    patterns and behavioural trends.
                  </p>

                </div>


                <div className="partner-insight-card">

                  <span className="partner-insight-number">
                    03
                  </span>

                  <h3>
                    Anomaly Monitoring
                  </h3>

                  <p>
                    Potentially unusual transaction activity can
                    be surfaced for further review.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}


        {/* =========================
            TRANSACTIONS
        ========================= */}

        {activeTab === "transactions" && (
          <section className="partner-section">

            <p className="partner-section-label">
              TRANSACTIONS
            </p>

            <h2>Transaction History</h2>

            <p>
              Your complete UPI transaction history will be
              displayed here once the backend and dataset are
              connected.
            </p>

          </section>
        )}


        {/* =========================
            INSIGHTS
        ========================= */}

        {activeTab === "insights" && (
          <section className="partner-section">

            <p className="partner-section-label">
              INTELLIGENCE
            </p>

            <h2>Transaction Insights</h2>

            <p>
              Detailed transaction patterns, trends and anomaly
              intelligence will appear here once the Arvix
              intelligence engine is connected.
            </p>

          </section>
        )}


        {/* =========================
            PROFILE
        ========================= */}

        {activeTab === "profile" && (
          <section className="partner-section">

            <p className="partner-section-label">
              ACCOUNT
            </p>

            <h2>Partner Profile</h2>

            <div className="partner-profile-card">

              <div>
                <span>Partner Type</span>
                <strong>Customer</strong>
              </div>

              <div>
                <span>Account Status</span>
                <strong className="profile-active">
                  Active
                </strong>
              </div>

              <div>
                <span>Partner Since</span>
                <strong>2026</strong>
              </div>

              <div>
                <span>Data Connection</span>
                <strong>
                  Pending Backend Integration
                </strong>
              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default PartnerDashboard;