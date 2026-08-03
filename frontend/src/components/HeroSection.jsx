// Homepage hero, service cards, partner names, CTA text, and inline hero animation live in this component.
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useSettings } from "../hooks/SettingsContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const DEFAULT_WHY_CHOOSE_FEATURES = [
  { icon: "💬", title: "24/7 Customer Support", desc: "Real-time human + AI support anytime from anywhere.", slug: "customer-support" },
  { icon: "⚡", title: "Fast Claim Processing", desc: "Verification and processing completed within minutes.", slug: "fast-claims" },
  { icon: "📄", title: "Smart Policy Tracking", desc: "Track and manage all policies from one dashboard.", slug: "policy-tracking" },
  { icon: "🔒", title: "Advanced Security", desc: "Military-grade encryption for all your data and management.", slug: "advanced-security" },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const policyForms = settings?.policyForms || {
    healthForm: true,
    motorForm: true,
    lifeForm: true,
    travelForm: true,
    businessForm: true,
  };

  // --- New: landing page content controlled from admin Settings -> Landing Page ---
  const landingPage = settings?.landingPage || {};
  const heroLine1 = landingPage.heroLine1 || "Claim Smarter,";
  const heroLine2 = landingPage.heroLine2 || "Not Harder!";
  const heroSubtitle =
    landingPage.heroSubtitle ||
    "Experience the future of insurance. Report vehicle claims in seconds with our AI-driven appraisal system. Simpler, faster, better.";
  const heroButtonText = landingPage.heroButtonText || "Get Started";
  const heroButtonTextLoggedIn = landingPage.heroButtonTextLoggedIn || "Open Dashboard";
  const trustedPartnersLabel = landingPage.trustedPartnersLabel || "Trusted Partners";
  const whyChooseEyebrow = landingPage.whyChooseEyebrow || "Why Choose Us";
  const whyChooseHeading = landingPage.whyChooseHeading || "Trusted Digital Insurance Experience";
  const whyChooseFeatures =
    Array.isArray(landingPage.whyChooseFeatures) && landingPage.whyChooseFeatures.length
      ? landingPage.whyChooseFeatures
      : DEFAULT_WHY_CHOOSE_FEATURES;

  // Change service card titles, descriptions, routes, images, and badges from this array.
  const services = [
    policyForms.healthForm && {
      title: "Health Insurance",
      desc: "Comprehensive medical coverage with AI-driven wellness tracking.",
      route: "/health-insurance",
      image: assets.InsuranceHealth,
    },
    policyForms.motorForm && {
      title: "Vehicle Insurance",
      desc: "Smart appraisals and instant roadside assistance.",
      route: "/car-insurance",
      image: assets.InsuranceCar,
    },
    policyForms.lifeForm && {
      title: "Life Insurance",
      desc: "Secure your family's future with flexible premium plans.",
      route: "/life-insurance",
      image: assets.InsuranceLife,
    },
    policyForms.travelForm && {
      title: "Travel Insurance",
      desc: "Global coverage for emergencies and lost baggage.",
      route: "/travel-insurance",
      image: assets.InsuranceTravel,
    },
    {
      title: "Home Insurance",
      desc: "Protection for your sanctuary against disasters.",
      route: "/home-insurance",
      image: assets.InsuranceHome,
    },
    policyForms.businessForm && {
      title: "Business Insurance",
      desc: "Liability and asset protection for modern enterprises.",
      route: "/business-insurance",
      image: assets.InsuranceBusiness,
    },
  ].filter(Boolean);

  const trustedPartners = [
    { name: "Solera", logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Solera_Logo_CMYK-master.svg" },
    { name: "SBI General Insurance", logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/State%20Bank%20of%20India.svg" },
    { name: "Policybazaar", logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Policybazaar%20Logo.gif" },
    { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/HDFC_ERGO_Logo_2025.png/250px-HDFC_ERGO_Logo_2025.png" },
    { name: "Bajaj Allianz", logo: "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/bajaj-allianz-logo.png", logoClass: "h-14 w-38" },
    { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/ICICI_Lombard.svg/250px-ICICI_Lombard.svg.png" },
    { name: "Tata AIG", logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/TATA_AIG_logo.png" },
    { name: "New India Assurance", logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/New%20India%20Assurance.svg" },
    { name: "Reliance General", logo: "https://www.reliancegeneral.co.in/siteassets/rgiclassets/images/logo.png" },
    { name: "Bharat Financial", logo: "https://media.fortuneindia.com/fortune-india/import/company/logos/Bharat%20Financial%20Inclusion%20Ltd.png?w=260&q=90", logoClass: "h-14 w-38" }
  ];

  return (
    <div className="w-full bg-white font-sans">

      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full min-h-[auto] flex items-center px-4 py-10 sm:px-6 lg:px-24 lg:pb-10 lg:pt-0 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <div className="order-2 lg:order-1 flex items-center justify-center h-full">
            <img
              src={assets.HeroSectionImage}
              alt="Hero Section Illustration"
              className="w-full max-w-[220px] sm:max-w-xs lg:max-w-sm mx-auto animate-bounce-slow"
            />
          </div>

          <div className="flex flex-col items-center space-y-5 text-center z-10 order-1 lg:order-2 lg:items-start lg:space-y-8 lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              {heroLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{heroLine2}</span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg max-w-lg leading-relaxed">
              {heroSubtitle}
            </p>

            <Link
              to={isAuthenticated ? "/dashboard" : "/auth"}
              className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
            >
              <button className="w-full px-8 py-4 bg-blue-500 text-white cursor-pointer font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all duration-500 transform hover:-translate-y-1 sm:w-auto">
                {isAuthenticated ? heroButtonTextLoggedIn : heroButtonText}
              </button>
            </Link>

            <div className="w-full border-t border-slate-100 pb-6 pt-5 sm:pb-12">
              <p className="text-slate-400 font-bold mb-4 text-xs uppercase tracking-[0.2em]">{trustedPartnersLabel}</p>
              <div className="relative overflow-hidden">
                <div className="partner-strip flex w-max items-center gap-8 py-2">
                  {[...trustedPartners, ...trustedPartners].map((partner, index) => (
                    <span
                      key={`${partner.name}-${index}`}
                      className="inline-flex h-16 w-40 items-center justify-center rounded-full border border-blue-200 bg-white px-2 py-1 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                      title={partner.name}
                      aria-label={`${partner.name} logo`}
                    >
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className={`${partner.logoClass || "h-10 w-28"} object-contain`}
                        loading="lazy"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE US / SERVICE FEATURE SWIPER */}
      <section className="w-full bg-white pt-8 pb-15 md:pt-10 overflow-hidden">
        <div className="text-center mb-14 px-6">
          <p className="text-blue-600 uppercase tracking-[4px] text-sm font-semibold mb-4">
            {whyChooseEyebrow}
          </p>
          <h2 className="text-black text-3xl md:text-3xl font-bold leading-tight">
            {whyChooseHeading}
          </h2>
        </div>

        <div className="w-full">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={"auto"}
            centeredSlides={true}
            loop={true}
            spaceBetween={30}
            speed={1200}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="!overflow-visible"
          >
            {[...whyChooseFeatures, ...whyChooseFeatures].map((item, index) => (
              <SwiperSlide
                key={index}
                className="!w-[82vw] sm:!w-[320px] md:!w-[380px]"
              >
                {({ isActive }) => (
                  <div
                    className={`
                      rounded-[32px]
                      border
                      p-6
                      md:p-10
                      min-h-[260px]
                      sm:min-h-[280px]
                      bg-white
                      flex
                      flex-col
                      justify-between
                      transition-all
                      duration-700
                      ease-in-out
                      ${
                        isActive
                          ? "border-blue-500 scale-100 shadow-2xl z-10"
                          : "border-slate-200 scale-[0.88] opacity-100 shadow-md"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {item.icon}
                      </div>
                      {isActive && (
                        <span className="text-[10px] text-blue-600 border border-blue-200 px-3 py-1 rounded-full font-bold uppercase tracking-widest bg-blue-50/50">
                          Active
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className={`text-xl font-bold mb-3 transition-colors ${isActive ? 'text-black' : 'text-slate-400'}`}>
                        {item.title}
                      </h3>
                      <p className={`leading-relaxed text-sm transition-colors ${isActive ? 'text-slate-600' : 'text-slate-300'}`}>
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/why-choose/${item.slug}`)}
                      className={`inline-flex cursor-pointer items-center gap-2 text-sm font-bold transition-all hover:text-blue-700 ${isActive ? 'text-blue-600' : 'text-slate-300'}`}
                    >
                      Learn More {isActive ? '→' : ''}
                    </button>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* SECTION 3: SERVICE CARDS */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-8 lg:pt-16">
        <div className="container mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-3xl p-5 sm:p-8 lg:rounded-[4rem] lg:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 lg:mb-20 gap-6 lg:gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4 block">
                Our Insurance Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Smart Insurance Solutions <br />
                Made <span className="text-blue-500">Simple & Secure</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm sm:text-md max-w-sm border-slate-800 lg:border-l lg:pl-8 lg:pb-2">
              AI-powered insurance platform helping users manage policies,
              claims, security, and support faster than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 relative z-10">
            {services.map((service, index) => (
              <Link
                to={service.route}
                key={index}
                className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 hover:border-blue-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
              >
                <div className="relative h-[190px] sm:h-[220px] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase">
                    Secure
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-white text-xl sm:text-2xl font-bold">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {service.desc}
                  </p>
                  <div className="mt-7 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                      Learn More
                      <span>→</span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                      <span className="text-blue-600 group-hover:text-white transition-all duration-300">
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-32 bg-white"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes scroll-partners {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .partner-strip {
          animation: scroll-partners 28s linear infinite;
        }
        .partner-strip:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default LandingPage;