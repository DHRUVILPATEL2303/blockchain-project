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
import { Button, Card } from "../components/ui";

export default function Submissions({
  submissions = [],
  role,
  busy,
  run,
  contract,
}) {
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
      s.hash?.toLowerCase().includes(term) ||
      s.ipfsHash?.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-zinc-400">
              On-Chain Ledger
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-500">
              {submissions.length} Total Records
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Academic Submissions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Browse coursework submissions with IPFS document access and SHA-256 cryptographic digests.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student, enrollment, title, hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
              filter === "all"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
              filter === "verified"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Verified ({submissions.filter((s) => s.verified).length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
              filter === "pending"
                ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Pending ({submissions.filter((s) => !s.verified).length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card className="text-center py-10">
          <FileTextIcon className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-0.5">No Submissions Recorded</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            When students submit coursework, timestamped records and IPFS document links will be listed here.
          </p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-xs text-zinc-300">No records match your query.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="mt-2 text-xs text-zinc-400 hover:text-white underline cursor-pointer"
          >
            Reset Filters
          </button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-zinc-800 bg-[#111114] p-4 transition hover:bg-[#141418]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Details Column */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-mono font-medium">
                      #{s.id}
                    </span>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400">
                      Practical {s.no}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate">
                      {s.title || "Untitled"}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="text-zinc-200 font-medium">{s.name}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="font-mono text-zinc-400 text-[11px]">{s.enroll}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
                      <ClockIcon className="w-3 h-3" />
                      {new Date(s.time * 1000).toLocaleString()}
                    </span>
                  </div>

                  {/* Hash & IPFS info row */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 flex items-center gap-1">
                      <HashIcon className="w-3 h-3 text-zinc-500" />
                      SHA-256:
                    </span>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-zinc-800 px-2 py-0.5 rounded max-w-sm flex-1">
                      <code className="text-[11px] font-mono text-zinc-300 truncate select-all flex-1">
                        {s.hash}
                      </code>
                      <button
                        onClick={() => copyHash(s.id, s.hash)}
                        title="Copy hash"
                        className="text-zinc-500 hover:text-zinc-200 transition cursor-pointer p-0.5"
                      >
                        {copiedId === s.id ? (
                          <CheckIcon className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* IPFS CID badge if available */}
                    {s.ipfsHash && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded truncate max-w-[140px]" title={`IPFS CID: ${s.ipfsHash}`}>
                        IPFS: {s.ipfsHash.slice(0, 6)}…{s.ipfsHash.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: View PDF & Verify Action */}
                <div className="flex items-center gap-2 lg:border-l lg:border-zinc-800 lg:pl-4 shrink-0">
                  {/* View PDF Button */}
                  {s.ipfsHash ? (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${s.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                      title="Open PDF document from IPFS in new tab"
                    >
                      <FileTextIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>View PDF</span>
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">No file attached</span>
                  )}

                  {/* Verification Status */}
                  {s.verified ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-medium">
                        <ClockIcon className="w-3 h-3 text-amber-400" />
                        Pending
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
                              `Submission #${s.id} certified on-chain`
                            )
                          }
                          icon={<ShieldCheckIcon className="w-3.5 h-3.5" />}
                        >
                          Verify
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
