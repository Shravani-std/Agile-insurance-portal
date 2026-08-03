// src/components/layout/AdminHeader.jsx
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Search, Loader2 } from "lucide-react";
import { pageTitles } from "../../../utils/helpers";
import { apiRequest } from "../../../utils/api";

const CATEGORY_LABELS = {
  users: "Users",
  claims: "Claims",
  tickets: "Tickets",
  policies: "Policies",
  documents: "Documents",
  kyc: "KYC",
  payments: "Payments",
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

const AdminHeader = ({ onMenuOpen, onNavigate }) => {
  const { selectedProfile } = useSelector((s) => s.auth);
  const { activePage } = useSelector((s) => s.ui);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search-as-you-type
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      apiRequest(`/api/admin/search?q=${encodeURIComponent(q)}`, { useAdminToken: true })
        .then((res) => setResults(res.data))
        .catch(() => setResults(null))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToFullResults = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    navigate(`/admin/search?q=${encodeURIComponent(trimmed)}`);
  };

  const categories = results ? Object.keys(CATEGORY_LABELS).filter((c) => (results[c]?.length || 0) > 0) : [];
  const totalCount = categories.reduce((sum, c) => sum + results[c].length, 0);

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-lg border border-slate-200 p-2 lg:hidden" onClick={onMenuOpen} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="truncate text-xs font-black uppercase tracking-wide text-slate-500">{pageTitles[activePage]}</div>
            <div className="truncate text-lg font-black text-slate-950">{selectedProfile.role} Workspace</div>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
          <div ref={wrapRef} className="relative w-full max-w-xl">
            {loading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" size={18} />
              : <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => { if (e.key === "Enter") goToFullResults(query); }}
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500"
              placeholder="Search users, claims, tickets, policies..."
            />

            {/* Dropdown */}
            {open && query.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                {loading && !results ? (
                  <div className="p-4 text-center text-xs font-semibold text-slate-400">Searching…</div>
                ) : totalCount === 0 ? (
                  <div className="p-4 text-center text-xs font-semibold text-slate-400">No results found</div>
                ) : (
                  <>
                    {categories.map((cat) => (
                      <div key={cat} className="border-b border-slate-100 p-3 last:border-b-0">
                        <div className="px-1 text-[11px] font-black uppercase tracking-wide text-slate-400">
                          {CATEGORY_LABELS[cat]}
                        </div>
                        <div className="mt-1 space-y-0.5">
                          {results[cat].slice(0, 4).map((row) => (
                            <button
                              key={row.id}
                              onClick={() => goToFullResults(query)}
                              className="block w-full truncate rounded-lg px-2 py-2 text-left text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {rowLabel(cat, row)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => goToFullResults(query)}
                      className="block w-full rounded-b-lg bg-slate-50 px-3 py-3 text-center text-xs font-black text-blue-700 hover:bg-blue-50"
                    >
                      See all {totalCount} results for &quot;{query.trim()}&quot; →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => onNavigate("notifications")} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button onClick={() => onNavigate("profile")} className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex">
            {selectedProfile.profilePhoto
              ? <img src={selectedProfile.profilePhoto} alt={selectedProfile.name} className="h-8 w-8 rounded-lg object-cover" />
              : <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{selectedProfile.initials}</span>}
            {selectedProfile.name.split(" ")[0]}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;