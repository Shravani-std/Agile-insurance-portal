// SettingsContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { apiRequest } from "../utils/api";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  pages: {
    generalInsurancePage: true,
    lifeInsurancePage: true,
    termInsurancePage: true,
    investmentPage: true,
    healthInsurancePage: true,
    otherInsurancePage: true,
    premiumCalculator: true,
    termCalculator: true,
    emiCalculator: true,
    carCalculator: true,
    articlesPage: true,
    reviewsPage: true,
    companiesPage: true,
    newsroomPage: true,
    awardsPage: true,
    aboutPage: true,
    careersPage: true,
    legalPoliciesPage: true,
    contactPage: true,
  },
  policyForms: {
    healthForm: true,
    motorForm: true,
    lifeForm: true,
    travelForm: true,
    businessForm: true,
  },
  features: {
    aiAssistant: true,
    policyCompare: true,
  },
  general: {
    companyName: "Agile Insurance",
    supportPhone: "+91 98765 43210",
  },
  // --- New: landing page defaults, matched to LandingPage.jsx / Navbar.jsx / Footer.jsx fallbacks ---
  landingPage: {
    heroLine1: "Claim Smarter,",
    heroLine2: "Not Harder!",
    heroSubtitle:
      "Experience the future of insurance. Report vehicle claims in seconds with our AI-driven appraisal system. Simpler, faster, better.",
    heroButtonText: "Get Started",
    heroButtonTextLoggedIn: "Open Dashboard",
    trustedPartnersLabel: "Trusted Partners",
    whyChooseEyebrow: "Why Choose Us",
    whyChooseHeading: "Trusted Digital Insurance Experience",
    whyChooseFeatures: [
      { icon: "💬", title: "24/7 Customer Support", desc: "Real-time human + AI support anytime from anywhere.", slug: "customer-support" },
      { icon: "⚡", title: "Fast Claim Processing", desc: "Verification and processing completed within minutes.", slug: "fast-claims" },
      { icon: "📄", title: "Smart Policy Tracking", desc: "Track and manage all policies from one dashboard.", slug: "policy-tracking" },
      { icon: "🔒", title: "Advanced Security", desc: "Military-grade encryption for all your data and management.", slug: "advanced-security" },
    ],
    navbarTagline: "Smart & Secure Protection",
    footerLegalNotice: "BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS / FRAUDULENT OFFERS",
    socialFacebook: "https://www.facebook.com",
    socialYoutube: "https://www.youtube.com",
    socialLinkedin: "https://www.linkedin.com",
    socialTwitter: "https://www.twitter.com",
  },
  heroImageUrl: "",
    logoUrl: "",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const response = await apiRequest("/api/admin/settings");
        const data = response?.data ?? response ?? {};

        if (!isMounted) return;

        // Merge EVERY known section, not just four of them.
        // Object.keys(DEFAULT_SETTINGS) drives this so adding a new
        // settings section later just means adding it to DEFAULT_SETTINGS —
        // no need to remember to also list it here.
        const merged = {};
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
          const fallback = DEFAULT_SETTINGS[key];
          const incoming = data?.[key];
          merged[key] =
            fallback && typeof fallback === "object" && !Array.isArray(fallback)
              ? { ...fallback, ...(incoming || {}) }
              : incoming ?? fallback;
        }

        setSettings(merged);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({ settings, loading }), [settings, loading]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);