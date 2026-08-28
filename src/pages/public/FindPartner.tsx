import { useState } from "react";

type Partner = {
  id: number;
  name: string;
  type: string;
  location: string;
  services: string[];
  description: string;
  verified: boolean;
};

const partners: Partner[] = [
  {
    id: 1,
    name: "Arvix Partner Network",
    type: "Financial Institution",
    location: "Mumbai, Maharashtra",
    services: ["Banking", "Payments", "Business Services"],
    description:
      "A verified financial institution providing banking and transaction services.",
    verified: true,
  },
  {
    id: 2,
    name: "Partner Alpha",
    type: "Bank",
    location: "Bengaluru, Karnataka",
    services: ["Banking", "Payments"],
    description:
      "Financial services partner supporting secure digital transactions.",
    verified: true,
  },
  {
    id: 3,
    name: "Partner Beta",
    type: "Payment Provider",
    location: "New Delhi, Delhi",
    services: ["Payments", "Transaction Intelligence"],
    description:
      "Payment-focused partner offering digital transaction solutions.",
    verified: true,
  },
  {
    id: 4,
    name: "Partner Gamma",
    type: "Financial Institution",
    location: "Hyderabad, Telangana",
    services: ["Lending", "Business Services"],
    description:
      "Financial institution offering lending and business-oriented services.",
    verified: true,
  },
  {
    id: 5,
    name: "Partner Delta",
    type: "Bank",
    location: "Pune, Maharashtra",
    services: ["Banking", "Payments", "Lending"],
    description:
      "Banking partner providing financial and payment services.",
    verified: true,
  },
  {
    id: 6,
    name: "Partner Epsilon",
    type: "Payment Provider",
    location: "Chennai, Tamil Nadu",
    services: ["Payments", "Transaction Intelligence"],
    description:
      "Digital payments partner focused on secure transaction processing.",
    verified: true,
  },
];

function FindPartner() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(search.toLowerCase()) ||
      partner.location.toLowerCase().includes(search.toLowerCase()) ||
      partner.services.some((service) =>
        service.toLowerCase().includes(search.toLowerCase())
      );

    const matchesType =
      typeFilter === "All" || partner.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="find-partner-page">

      {/* Header */}
      <section className="find-partner-header">
        <p className="section-label">ARVIX PARTNER NETWORK</p>

        <h1>Find the right partner</h1>

        <p>
          Discover verified financial institutions and service partners
          connected to the Arvix ecosystem.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="partner-search">

        <input
          type="text"
          placeholder="Search by partner, service or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="All">All partner types</option>
          <option value="Bank">Bank</option>
          <option value="Financial Institution">
            Financial Institution
          </option>
          <option value="Payment Provider">
            Payment Provider
          </option>
        </select>

      </section>

      {/* Results */}
      <section className="partner-results">

        <div className="partner-results-header">
          <div>
            <p className="section-label">PARTNERS</p>
            <h2>Available partners</h2>
          </div>

          <span>
            {filteredPartners.length} partner
            {filteredPartners.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredPartners.length > 0 ? (
          <div className="partner-grid">

            {filteredPartners.map((partner) => (
              <article className="partner-card" key={partner.id}>

                <div className="partner-card-top">
                  <div className="partner-icon">
                    {partner.name.charAt(0)}
                  </div>

                  {partner.verified && (
                    <span className="partner-verified">
                      Verified
                    </span>
                  )}
                </div>

                <h3>{partner.name}</h3>

                <p className="partner-type">
                  {partner.type}
                </p>

                <p className="partner-location">
                  {partner.location}
                </p>

                <p className="partner-description">
                  {partner.description}
                </p>

                <div className="partner-services">
                  {partner.services.map((service) => (
                    <span key={service}>
                      {service}
                    </span>
                  ))}
                </div>

                <button type="button" className="partner-view-button">
                  View Partner
                </button>

              </article>
            ))}

          </div>
        ) : (
          <div className="partner-empty">
            <h3>No partners found</h3>

            <p>
              Try adjusting your search or partner type.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

      </section>

    </div>
  );
}

export default FindPartner;