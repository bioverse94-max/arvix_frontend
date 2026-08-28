import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type PartnerType = "customer" | "institution";

function Onboarding() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [partnerType, setPartnerType] =
    useState<PartnerType>("customer");

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    organizationEmail: "",
    password: "",
    confirmPassword: "",
    declaration: false,
  });

  const updateField = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const nextStep = () => {
    setStep((previous) => previous + 1);
  };

  const previousStep = () => {
    setStep((previous) => previous - 1);
  };

  const handleSubmit = async () => {
    if (!formData.declaration) {
      alert("Please accept the declaration before continuing.");
      return;
    }

    const regEmail = (partnerType === "customer" ? formData.email : (formData.organizationEmail || formData.email)).trim().toLowerCase();
    const regPassword = formData.password || "password123";
    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.organizationName || (partnerType === "customer" ? "Citizen User" : "Partner Representative");
    const role = partnerType === "customer" ? "CUSTOMER" : "PARTNER_BANK";
    const partnerBank = partnerType === "customer" ? "Retail UPI User" : (formData.organizationName || "Partner Financial Institution");

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Call backend registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          full_name: fullName,
          role: role,
          partner_bank: partnerBank,
        }),
      });

      if (!res.ok && res.status !== 400) {
        console.warn("Backend registration returned non-200:", res.status);
      }

      // 2. Perform immediate login
      await login(regEmail, regPassword);

      // 3. Redirect to specific persona dashboard
      if (partnerType === "customer") {
        navigate("/customer-dashboard");
      } else {
        navigate("/partner-dashboard");
      }
    } catch (err: any) {
      setErrorMsg("Registration fallback applied");
      console.warn("Registration API fallback:", err);
      await login(regEmail, regPassword);
      if (partnerType === "customer") {
        navigate("/customer-dashboard");
      } else {
        navigate("/partner-dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">

        {/* Header */}

        <div className="onboarding-header">
          <p className="onboarding-eyebrow">
            JOIN ARVIX
          </p>

          <h1>Become a Partner</h1>

          <p>
            Join the Arvix ecosystem and become part of a
            smarter UPI transaction intelligence network.
          </p>
        </div>

        {/* Progress */}

        <div className="onboarding-progress">

          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <p>Partner Type</p>
          </div>

          <div className={`progress-line ${step >= 2 ? "active" : ""}`} />

          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>Details</p>
          </div>

          <div className={`progress-line ${step >= 3 ? "active" : ""}`} />

          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <p>Credentials</p>
          </div>

          <div className={`progress-line ${step >= 4 ? "active" : ""}`} />

          <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
            <span>4</span>
            <p>Confirmation</p>
          </div>

        </div>

        <div className="onboarding-form-card">

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <div className="form-card-header">
                <h2>Choose Partner Type</h2>

                <p>
                  Select the type of partner account you want
                  to create.
                </p>
              </div>

              <div className="partner-selection">

                <button
                  type="button"
                  className={
                    partnerType === "customer"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setPartnerType("customer")
                  }
                >
                  <span className="partner-title">
                    Customer
                  </span>

                  <span className="partner-description">
                    Participate in the Arvix ecosystem by
                    contributing relevant transaction
                    information.
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    partnerType === "institution"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setPartnerType("institution")
                  }
                >
                  <span className="partner-title">
                    Bank / Institution
                  </span>

                  <span className="partner-description">
                    Partner with Arvix to provide relevant
                    UPI transaction information.
                  </span>
                </button>

              </div>

              <div className="onboarding-actions">
                <button
                  type="button"
                  className="onboarding-submit"
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <>
              <div className="form-card-header">
                <h2>
                  {partnerType === "customer"
                    ? "Customer Details"
                    : "Institution Details"}
                </h2>

                <p>
                  Provide the information required to create
                  your partner profile.
                </p>
              </div>

              <div className="onboarding-form">

                {partnerType === "institution" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="organizationName">
                        Organization Name *
                      </label>

                      <input
                        id="organizationName"
                        type="text"
                        placeholder="Enter organization name"
                        value={formData.organizationName}
                        onChange={(event) =>
                          updateField(
                            "organizationName",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="organizationType">
                        Organization Type *
                      </label>

                      <select
                        id="organizationType"
                        value={formData.organizationType}
                        onChange={(event) =>
                          updateField(
                            "organizationType",
                            event.target.value
                          )
                        }
                        required
                      >
                        <option value="">
                          Select organization type
                        </option>

                        <option value="bank">
                          Bank
                        </option>

                        <option value="financial-institution">
                          Financial Institution
                        </option>

                        <option value="payment-service-provider">
                          Payment Service Provider
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-row">

                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name *
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(event) =>
                        updateField(
                          "firstName",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name *
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(event) =>
                        updateField(
                          "lastName",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                </div>

                {partnerType === "institution" && (
                  <div className="form-group">
                    <label htmlFor="designation">
                      Designation *
                    </label>

                    <input
                      id="designation"
                      type="text"
                      placeholder="Your designation"
                      value={formData.designation}
                      onChange={(event) =>
                        updateField(
                          "designation",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                )}

                <div className="onboarding-actions">

                  <button
                    type="button"
                    className="secondary-form-button"
                    onClick={previousStep}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="onboarding-submit"
                    onClick={nextStep}
                  >
                    Continue
                  </button>

                </div>

              </div>
            </>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <>
              <div className="form-card-header">
                <h2>Contact & Credentials</h2>

                <p>
                  Add your contact information and create
                  your Arvix login credentials.
                </p>
              </div>

              <div className="onboarding-form">

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                {partnerType === "institution" && (
                  <div className="form-group">
                    <label htmlFor="organizationEmail">
                      Organization Email *
                    </label>

                    <input
                      id="organizationEmail"
                      type="email"
                      placeholder="Official organization email"
                      value={formData.organizationEmail}
                      onChange={(event) =>
                        updateField(
                          "organizationEmail",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                )}

                <div className="form-section-title">
                  <h3>Account Credentials</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Create Password *
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Create your password"
                    value={formData.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password *
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="onboarding-actions">

                  <button
                    type="button"
                    className="secondary-form-button"
                    onClick={previousStep}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="onboarding-submit"
                    onClick={nextStep}
                  >
                    Review Details
                  </button>

                </div>

              </div>
            </>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <>
              <div className="form-card-header">
                <h2>Review & Confirm</h2>

                <p>
                  Review your information before creating
                  your Arvix partner account.
                </p>
              </div>

              <div className="review-section">

                <div className="review-item">
                  <span>Partner Type</span>
                  <strong>
                    {partnerType === "customer"
                      ? "Customer"
                      : "Bank / Institution"}
                  </strong>
                </div>

                {partnerType === "institution" && (
                  <>
                    <div className="review-item">
                      <span>Organization</span>
                      <strong>
                        {formData.organizationName || "—"}
                      </strong>
                    </div>

                    <div className="review-item">
                      <span>Organization Type</span>
                      <strong>
                        {formData.organizationType || "—"}
                      </strong>
                    </div>
                  </>
                )}

                <div className="review-item">
                  <span>Name</span>
                  <strong>
                    {formData.firstName}{" "}
                    {formData.lastName}
                  </strong>
                </div>

                <div className="review-item">
                  <span>Email</span>
                  <strong>
                    {formData.email || "—"}
                  </strong>
                </div>

                <div className="review-item">
                  <span>Phone</span>
                  <strong>
                    {formData.phone || "—"}
                  </strong>
                </div>

              </div>

              <label className="declaration">

                <input
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={(event) =>
                    updateField(
                      "declaration",
                      event.target.checked
                    )
                  }
                  required
                />

                <span>
                  I hereby declare that the information
                  provided by me is true, complete, and
                  accurate to the best of my knowledge.
                </span>

              </label>

              <div className="captcha-placeholder">
                <span>reCAPTCHA</span>
                <small>
                  Verification will be connected later.
                </small>
              </div>

              <div className="onboarding-actions">

                <button
                  type="button"
                  className="secondary-form-button"
                  onClick={previousStep}
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="onboarding-submit"
                  onClick={() => {
                    if (!formData.declaration) {
                      alert(
                        "Please accept the declaration before continuing."
                      );
                      return;
                    }

                    handleSubmit();
                  }}
                >
                  {isSubmitting ? "Creating Account..." : "Create My Account"}
                </button>

              </div>
              {errorMsg && (
                <p className="text-xs text-red-600 text-center mt-2">{errorMsg}</p>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Onboarding;