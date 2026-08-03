// src/components/pages/SearchResultsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Users, ClipboardCheck, Headphones, FileText, ShieldCheck, BadgeCheck, CreditCard } from "lucide-react";
import { apiRequest } from "../utils/api";
import { statusClass } from "../utils/helpers";
import { useAdminActions } from "../hooks/useAdminActions";

const CATEGORY_META = {
  users:    { label: "Users",    icon: Users,         page: "users" },
  claims:   { label: "Claims",   icon: ClipboardCheck, page: "claims" },
  tickets:  { label: "Tickets",  icon: Headphones,    page: "support" },
  policies: { label: "Policies", icon: FileText,       page: "policies" },
  documents:{ label: "Documents",icon: ShieldCheck,    page: "documents" },
  kyc:      { label: "KYC",      icon: BadgeCheck,     page: "users" },
  payments: { label: "Payments", icon: CreditCard,     page: "reports" },
};

const rowLabel = (category, row) => {
  switch (category) {
    case "users": return row.name;
    case "claims": return `${row.claimNumber || row.id} · ${row.user}`;
    case "tickets": return `${row.subject} · ${row.user}`;
    case "policies": return row.name;
    case "documents": return `${row.type} · ${row.owner}`;
    case "kyc": return row.user;
    case "payments": return `${row.user} · ₹${row.amount ?? 0}`;
    default: return row.id;
  }
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { openPage } = useAdminActions();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!q) { setResults(null); return; }
    setLoading(true);
    setError(null);
    apiRequest(`/api/admin/search?q=${encodeURIComponent(q)}`, { useAdminToken: true })
      .then((res) => setResults(res.data))
      .catch((err) => setError(err.message || "Search failed"))
      .finally(() => setLoading(false));
  }, [q]);

  const totalCount = useMemo(() => {
    if (!results) return 0;
    return Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
  }, [results]);

  const categories = Object.keys(CATEGORY_META).filter((cat) => (results?.[cat]?.length || 0) > 0);
  const visibleCategories = activeFilter === "all" ? categories : [activeFilter];

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <Search size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-slate-950">
              Search results for &quot;{q}&quot;
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {loading ? "Searching…" : `${totalCount} result${totalCount !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        {/* Filter chips */}
        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`rounded-lg border px-3 py-1.5 text-xs font-black transition ${
                activeFilter === "all"
                  ? "border-blue-300 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              All ({totalCount})
            </button>
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const count = results[cat].length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-black transition ${
                    activeFilter === cat
                      ? "border-blue-300 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <meta.icon size={13} />
                  {meta.label} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && totalCount === 0 && q && (
        <div className="grid h-40 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
          <div>
            <Search size={24} className="mx-auto text-slate-400" />
            <div className="mt-2 text-sm font-black text-slate-600">No results found</div>
            <div className="mt-1 text-xs font-semibold text-slate-400">Try a different search term.</div>
          </div>
        </div>
      )}

      {visibleCategories.map((cat) => {
        const rows = results?.[cat] || [];
        if (rows.length === 0) return null;
        const meta = CATEGORY_META[cat];
        return (
          <div key={cat} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <meta.icon size={16} className="text-blue-700" />
                <h3 className="text-sm font-black text-slate-950">{meta.label}</h3>
              </div>
              <button
                onClick={() => openPage(meta.page)}
                className="text-xs font-black text-blue-700 hover:underline"
              >
                Open {meta.label} page →
              </button>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {rows.map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0 truncate text-sm font-bold text-slate-800">
                    {rowLabel(cat, row)}
                  </span>
                  {row.status && (
                    <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black ring-1 ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SearchResultsPage;