import { useState } from "react";

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="customer-dashboard">

      {/* Header */}
      <header className="customer-header">
        <div>
          <p className="customer-label">ARVIX</p>

          <h1>Customer Dashboard</h1>

          <p className="customer-subtitle">
            Your UPI activity and transaction intelligence
          </p>
        </div>

        <div className="customer-user">
          <div className="customer-avatar">C</div>

          <div>
            <strong>Customer Account</strong>
            <span>Arvix Partner</span>
          </div>
        </div>
      </header>


      {/* Navigation */}
      <nav className="customer-nav">

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
          className={activeTab === "security" ? "active" : ""}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>

        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>

      </nav>


      {/* Main Content */}
      <main className="customer-content">

        {/* =========================
            OVERVIEW
        ========================= */}

        {activeTab === "overview" && (
          <>

            <section className="customer-welcome">

              <p className="customer-section-label">
                ACCOUNT OVERVIEW
              </p>

              <h2>Your Transaction Activity</h2>

              <p>
                Monitor your UPI transactions and understand
                important activity detected across your account.
              </p>

            </section>


            {/* Statistics */}

            <section className="customer-stats">

              <div className="customer-stat-card">

                <span>Total Transactions</span>

                <strong>486</strong>

                <small>
                  Transactions recorded
                </small>

              </div>


              <div className="customer-stat-card">

                <span>Total Amount</span>

                <strong>₹82,450</strong>

                <small>
                  Total transaction value
                </small>

              </div>


              <div className="customer-stat-card">

                <span>Successful</span>

                <strong>472</strong>

                <small>
                  97.1% success rate
                </small>

              </div>


              <div className="customer-stat-card">

                <span>Security Alerts</span>

                <strong>3</strong>

                <small>
                  Requires attention
                </small>

              </div>

            </section>


            {/* Security Status */}

            <section className="customer-security-card">

              <div>

                <p className="customer-section-label">
                  ACCOUNT SECURITY
                </p>

                <h2>Transaction Security Status</h2>

                <p>
                  Arvix continuously evaluates transaction
                  behaviour for unusual activity.
                </p>

              </div>

              <div className="security-status">

                <div className="security-indicator">
                  <span></span>
                </div>

                <div>
                  <strong>Normal</strong>

                  <small>
                    No high-risk activity detected
                  </small>
                </div>

              </div>

            </section>


            {/* Recent Transactions */}

            <section className="customer-section">

              <div className="customer-section-heading">

                <div>

                  <p className="customer-section-label">
                    TRANSACTION ACTIVITY
                  </p>

                  <h2>Recent Transactions</h2>

                </div>

              </div>


              <div className="customer-table">

                <div className="customer-table-row customer-table-header">

                  <span>Transaction ID</span>

                  <span>Amount</span>

                  <span>Status</span>

                  <span>Date</span>

                </div>


                <div className="customer-table-row">

                  <span>UPI-84291</span>

                  <span>₹1,250</span>

                  <span className="customer-status-success">
                    Successful
                  </span>

                  <span>Today</span>

                </div>


                <div className="customer-table-row">

                  <span>UPI-84290</span>

                  <span>₹560</span>

                  <span className="customer-status-success">
                    Successful
                  </span>

                  <span>Today</span>

                </div>


                <div className="customer-table-row">

                  <span>UPI-84289</span>

                  <span>₹4,800</span>

                  <span className="customer-status-review">
                    Under Review
                  </span>

                  <span>Yesterday</span>

                </div>


                <div className="customer-table-row">

                  <span>UPI-84288</span>

                  <span>₹950</span>

                  <span className="customer-status-success">
                    Successful
                  </span>

                  <span>Yesterday</span>

                </div>

              </div>

            </section>


            {/* Insights */}

            <section className="customer-section">

              <div className="customer-section-heading">

                <div>

                  <p className="customer-section-label">
                    ARVIX INTELLIGENCE
                  </p>

                  <h2>Account Insights</h2>

                </div>

              </div>


              <div className="customer-insights">

                <div className="customer-insight-card">

                  <span className="customer-insight-number">
                    01
                  </span>

                  <h3>
                    Normal Behaviour
                  </h3>

                  <p>
                    Your recent transaction activity is
                    consistent with your normal account pattern.
                  </p>

                </div>


                <div className="customer-insight-card">

                  <span className="customer-insight-number">
                    02
                  </span>

                  <h3>
                    Transaction Pattern
                  </h3>

                  <p>
                    Arvix analyses transaction frequency,
                    amounts and behavioural changes over time.
                  </p>

                </div>


                <div className="customer-insight-card">

                  <span className="customer-insight-number">
                    03
                  </span>

                  <h3>
                    Risk Monitoring
                  </h3>

                  <p>
                    Potentially unusual activity can be
                    identified and surfaced for review.
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

          <section className="customer-section">

            <p className="customer-section-label">
              TRANSACTIONS
            </p>

            <h2>Transaction History</h2>

            <p>
              Your complete UPI transaction history will appear
              here when the Arvix backend and transaction dataset
              are connected.
            </p>

          </section>

        )}


        {/* =========================
            SECURITY
        ========================= */}

        {activeTab === "security" && (

          <section className="customer-section">

            <p className="customer-section-label">
              SECURITY
            </p>

            <h2>Account Security</h2>

            <p>
              Security alerts, risk indicators and transaction
              verification information will appear here.
            </p>


            <div className="customer-security-list">

              <div className="security-item">

                <div className="security-item-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Account Monitoring
                  </strong>

                  <span>
                    Active
                  </span>

                </div>

              </div>


              <div className="security-item">

                <div className="security-item-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Transaction Monitoring
                  </strong>

                  <span>
                    Active
                  </span>

                </div>

              </div>


              <div className="security-item">

                <div className="security-item-icon">
                  !
                </div>

                <div>

                  <strong>
                    Recent Security Alerts
                  </strong>

                  <span>
                    3 alerts available for review
                  </span>

                </div>

              </div>

            </div>

          </section>

        )}


        {/* =========================
            PROFILE
        ========================= */}

        {activeTab === "profile" && (

          <section className="customer-section">

            <p className="customer-section-label">
              ACCOUNT
            </p>

            <h2>Customer Profile</h2>


            <div className="customer-profile-card">

              <div>
                <span>Partner Type</span>

                <strong>
                  Customer
                </strong>
              </div>


              <div>
                <span>Account Status</span>

                <strong className="customer-profile-active">
                  Active
                </strong>
              </div>


              <div>
                <span>Arvix Partnership</span>

                <strong>
                  Active
                </strong>
              </div>


              <div>
                <span>Transaction Data</span>

                <strong>
                  Connected through banking partner
                </strong>
              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default CustomerDashboard;