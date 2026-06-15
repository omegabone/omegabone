import { useState } from "react";

const COLORS = {
  bg: "#ffffff",
  text: "#093c25",
  button: "#75967b",
  buttonHover: "#5e7d63",
  border: "#d0ddd2",
  inputBg: "#f7faf8",
  accent: "#093c25",
  error: "#b91c1c",
  subtle: "#4a6b54",
};

// ── PayPal payment links per package ──
const PAYPAL_LINKS = {
  "inner-circle": "https://www.paypal.com/ncp/payment/NLRKSUD9PXFQ6",
  "live-room": "https://www.paypal.com/ncp/payment/L96Y3QXXG2VQS",
};

const PACKAGES = [
  {
    id: "inner-circle",
    label: "The Inner Circle",
    sub: "Private 1-on-1 Coaching",
    description:
      "Weekly private sessions with Omega. Personalized training plan. Direct access between sessions. Roster strictly limited.",
  },
  {
    id: "live-room",
    label: "The Live Room",
    sub: "Group Cohort",
    description:
      "Small-group intensive (max 10). Live sessions only — no recordings. Real-time hot-seat coaching. 10 seats per cohort. No exceptions.",
  },
];

export default function IntakeForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    businessName: "",
    package: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email address is required.";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required.";
    if (!form.businessName.trim()) e.businessName = "Business name is required.";
    if (!form.package) e.package = "Please select a package.";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  const handlePayDeposit = () => {
    window.open(PAYPAL_LINKS[form.package] || "#", "_blank", "noopener,noreferrer");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Vocal Mastery for Entrepreneurs</p>
          <h1 style={styles.heading}>Apply for Coaching</h1>
          <p style={styles.subheading}>
            Limited roster. Complete this form to secure your place.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate style={styles.form}>
            {/* Full Name */}
            <Field
              label="Full Name"
              error={errors.fullName}
              required
            >
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.fullName ? styles.inputError : {}),
                }}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" error={errors.email} required>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {}),
                }}
              />
            </Field>

            {/* WhatsApp */}
            <Field
              label="WhatsApp Number"
              error={errors.whatsapp}
              hint="Include country code, e.g. +60 12 345 6789"
              required
            >
              <input
                type="tel"
                placeholder="+60 12 345 6789"
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.whatsapp ? styles.inputError : {}),
                }}
              />
            </Field>

            {/* Business Name */}
            <Field label="Business Name" error={errors.businessName} required>
              <input
                type="text"
                placeholder="Your company or personal brand"
                value={form.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.businessName ? styles.inputError : {}),
                }}
              />
            </Field>

            {/* Package Selection */}
            <Field
              label="I'm interested in…"
              error={errors.package}
              required
            >
              <div style={styles.packageGrid}>
                {PACKAGES.map((pkg) => {
                  const selected = form.package === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleChange("package", pkg.id)}
                      style={{
                        ...styles.packageCard,
                        ...(selected ? styles.packageCardSelected : {}),
                      }}
                    >
                      <div style={styles.packageTop}>
                        <div
                          style={{
                            ...styles.radio,
                            ...(selected ? styles.radioSelected : {}),
                          }}
                        >
                          {selected && <div style={styles.radioDot} />}
                        </div>
                        <div>
                          <p style={styles.packageLabel}>{pkg.label}</p>
                          <p style={styles.packageSub}>{pkg.sub}</p>
                        </div>
                      </div>
                      <p style={styles.packageDesc}>{pkg.description}</p>
                    </button>
                  );
                })}
              </div>
              {errors.package && (
                <p style={styles.errorText}>{errors.package}</p>
              )}
            </Field>

            {/* Submit */}
            <button type="submit" style={styles.submitBtn}>
              Submit Application
            </button>
          </form>
        ) : (
          /* ── Success State ── */
          <div style={styles.successBox}>
            <div style={styles.checkmark}>✓</div>
            <h2 style={styles.successHeading}>Application received.</h2>
            <p style={styles.successText}>
              You've applied for{" "}
              <strong>
                {PACKAGES.find((p) => p.id === form.package)?.label}
              </strong>
              . Omega will be in touch via{" "}
              <strong>{form.email}</strong> within 48 hours.
            </p>
            <div style={styles.divider} />
            <p style={styles.depositLabel}>
              Ready to lock in your spot? Pay your deposit now to secure your
              place on the roster.
            </p>
            <button
              onClick={handlePayDeposit}
              style={styles.depositBtn}
            >
              Pay Deposit →
            </button>
            <p style={styles.depositNote}>
              Powered by PayPal. Secure checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Field wrapper ── */
function Field({ label, error, hint, required, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {children}
      {hint && !error && <p style={styles.hint}>{hint}</p>}
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: COLORS.bg,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px 80px",
    fontFamily:
      "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
  },
  header: {
    marginBottom: "40px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.button,
    marginBottom: "12px",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "800",
    color: COLORS.text,
    margin: "0 0 12px",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  subheading: {
    fontSize: "15px",
    color: COLORS.subtle,
    margin: 0,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  required: {
    color: COLORS.error,
  },
  hint: {
    fontSize: "12px",
    color: COLORS.subtle,
    margin: 0,
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    fontSize: "15px",
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: "12px",
    color: COLORS.error,
    margin: 0,
  },
  packageGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  packageCard: {
    width: "100%",
    textAlign: "left",
    padding: "18px 20px",
    backgroundColor: COLORS.inputBg,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: "10px",
    cursor: "pointer",
    transition: "border-color 0.15s, background-color 0.15s",
    boxSizing: "border-box",
  },
  packageCardSelected: {
    borderColor: COLORS.text,
    backgroundColor: "#edf3ef",
  },
  packageTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "8px",
  },
  radio: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: `2px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
    transition: "border-color 0.15s",
  },
  radioSelected: {
    borderColor: COLORS.text,
  },
  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: COLORS.text,
  },
  packageLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: COLORS.text,
    margin: "0 0 2px",
  },
  packageSub: {
    fontSize: "12px",
    color: COLORS.subtle,
    margin: 0,
    fontWeight: "600",
    letterSpacing: "0.03em",
  },
  packageDesc: {
    fontSize: "13px",
    color: COLORS.subtle,
    margin: 0,
    lineHeight: 1.55,
    paddingLeft: "30px",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: COLORS.button,
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s",
  },
  successBox: {
    textAlign: "center",
    padding: "40px 0",
  },
  checkmark: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#edf3ef",
    color: COLORS.text,
    fontSize: "24px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  successHeading: {
    fontSize: "28px",
    fontWeight: "800",
    color: COLORS.text,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  successText: {
    fontSize: "15px",
    color: COLORS.subtle,
    lineHeight: 1.6,
    margin: "0 auto 28px",
    maxWidth: "420px",
  },
  divider: {
    height: "1px",
    backgroundColor: COLORS.border,
    margin: "28px 0",
  },
  depositLabel: {
    fontSize: "14px",
    color: COLORS.subtle,
    marginBottom: "20px",
    lineHeight: 1.6,
  },
  depositBtn: {
    display: "inline-block",
    padding: "16px 40px",
    backgroundColor: COLORS.button,
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  depositNote: {
    fontSize: "12px",
    color: COLORS.subtle,
    margin: 0,
  },
};
