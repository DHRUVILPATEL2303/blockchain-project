import { useState } from "react";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon,
  FileTextIcon,
  HashIcon,
} from "../components/Icons";
import { Button, Card, Badge } from "../components/ui";

export default function Submissions({ submissions = [], role, busy, run, contract }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'verified' | 'pending'
  const [copiedId, setCopiedId] = useState(null);

  const copyHash = (id, hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = submissions.filter((s) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "verified"
        ? s.verified
        : !s.verified;

    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.enroll?.toLowerCase().includes(term) ||
      s.title?.toLowerCase().includes(term) ||
      String(s.no).includes(term) ||
      s.hash?.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              On-Chain Ledger
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {submissions.length} Total Registered Submissions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse immutable practical submissions anchored with SHA-256 cryptographic fingerprints.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student, enrollment no, title, or hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0d1322] border border-slate-800 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#0d1322] border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === "verified"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Verified ({submissions.filter((s) => s.verified).length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filter === "pending"
                ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending ({submissions.filter((s) => !s.verified).length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <FileTextIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Submissions Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When students submit practical assignments, their on-chain verification records and SHA-256 hashes will appear here.
          </p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-300 font-medium">No records match your search criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-800/90 bg-[#111726]/80 p-5 shadow-lg shadow-black/20 hover:border-slate-700/90 transition-all duration-150 backdrop-blur-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Details Column */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
                      #{s.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Practical {s.no}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate">
                      {s.title || "Untitled Submission"}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="text-slate-200 font-medium">{s.name}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-slate-300">{s.enroll}</span>
                    <span className="text-slate-500">·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {new Date(s.time * 1000).toLocaleString()}
                    </span>
                  </div>

                  {/* Cryptographic SHA-256 Digest Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <HashIcon className="w-3 h-3 text-slate-500" />
                      SHA-256:
                    </span>
                    <div className="flex items-center gap-1.5 bg-[#0b0f17] border border-slate-800 px-2.5 py-1 rounded-lg max-w-xl flex-1">
                      <code className="text-[11px] font-mono text-slate-300 truncate select-all flex-1">
                        {s.hash}
                      </code>
                      <button
                        onClick={() => copyHash(s.id, s.hash)}
                        title="Copy SHA-256 hash"
                        className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                      >
                        {copiedId === s.id ? (
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status & Professor Action */}
                <div className="flex items-center gap-3 lg:border-l lg:border-slate-800/80 lg:pl-5 flex-shrink-0">
                  {s.verified ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                      <CheckCircleIcon className="w-4 h-4" />
                      Verified On-Chain
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Pending Review
                      </div>

                      {role === "Professor" && (
                        <Button
                          size="sm"
                          variant="success"
                          disabled={busy}
                          loading={busy}
                          onClick={() =>
                            run(
                              () => contract.verify(s.id),
                              `Submission #${s.id} certified and verified on-chain`
                            )
                          }
                          icon={<ShieldCheckIcon className="w-3.5 h-3.5" />}
                        >
                          Verify Record
                        </Button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
