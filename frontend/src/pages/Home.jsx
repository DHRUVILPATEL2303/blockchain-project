import { useState } from "react";
import { Link } from "react-router";
import {
  WalletIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  HashIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
} from "../components/Icons";
import { Button } from "../components/ui";

const features = [
  {
    icon: <ShieldCheckIcon className="w-4 h-4 text-zinc-200" />,
    badge: "Immutable",
    title: "Tamper-Proof Records",
    desc: "Submission hashes and block timestamps stored directly on Ethereum cannot be altered, erased, or manipulated.",
  },
  {
    icon: <AcademicCapIcon className="w-4 h-4 text-zinc-200" />,
    badge: "Authorized",
    title: "Verified Student Identity",
    desc: "Professors register authorized students by enrollment number, linking wallet addresses to academic identity.",
  },
  {
    icon: <HashIcon className="w-4 h-4 text-zinc-200" />,
    badge: "Zero-Knowledge",
    title: "Client-Side SHA-256",
    desc: "Assignments are hashed locally in your browser. Raw files remain private and never touch an external server.",
  },
];

const workflowSteps = [
  {
    step: "Step 01",
    title: "Select & Hash",
    desc: "Choose your coursework file. The browser computes an instant SHA-256 cryptographic digest locally.",
  },
  {
    step: "Step 02",
    title: "Submit On-Chain",
    desc: "Broadcast practical number, title, and hash to the smart contract as an indelible timestamped receipt.",
  },
  {
    step: "Step 03",
    title: "Professor Certification",
    desc: "The professor reviews the practical and records verified authenticity directly on the Ethereum ledger.",
  },
];

export default function Home({ address, onConnect, account, role }) {
  const [copied, setCopied] = useState(false);

  const copyContract = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center pt-5 sm:pt-10 pb-16">
      {/* Top Protocol Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-400/10 border border-violet-300/20 text-xs text-violet-100 mb-7 shadow-[0_0_32px_rgba(139,92,246,.12)]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]" />
        On-chain academic protocol
      </div>

      {/* Hero Headline */}
      <div className="max-w-3xl text-center mb-9">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.045em] text-white leading-[1.03]">
          Give every submission
          <span className="block mt-1 bg-gradient-to-r from-violet-200 via-indigo-100 to-cyan-200 bg-clip-text text-transparent">a permanent proof.</span>
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
          Timestamp coursework, prove authorship, and receive official professor verification with client-side SHA-256 digests.
        </p>
      </div>

      {/* Hero Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {account ? (
          <Link to="/dashboard">
            <Button size="md" icon={<ArrowRightIcon className="w-4 h-4" />}>
              Open Dashboard ({role || "Connected"})
            </Button>
          </Link>
        ) : (
          <Button
            size="md"
            onClick={onConnect}
            icon={<WalletIcon className="w-4 h-4" />}
            className="px-5 py-2.5"
          >
            Connect Wallet
          </Button>
        )}

        <a
          href="#how-it-works"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-white/[.045] hover:bg-white/[.09] border border-white/[.10] transition"
        >
          How It Works
        </a>
      </div>

      {/* Deployed Contract Ribbon (Clean & Crisp) */}
      {address && (
        <div className="w-full max-w-lg mb-14">
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-950/55 backdrop-blur-xl border border-white/[.09] text-xs shadow-[0_18px_55px_rgba(0,0,0,.18)]">
            <div className="flex items-center gap-2.5 text-slate-400 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-300 shrink-0 shadow-[0_0_10px_rgba(103,232,249,.75)]" />
              <span className="text-slate-400 font-medium shrink-0">Live contract</span>
              <span className="font-mono text-slate-200 text-[11px] truncate">
                {address}
              </span>
            </div>
            <button
              onClick={copyContract}
              title="Copy contract address"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer shrink-0 hover:bg-white/[.08]"
            >
              {copied ? (
                <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Feature Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {features.map(({ icon, badge, title, desc }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-white/[.09] bg-slate-950/55 backdrop-blur-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet-300/30 hover:shadow-[0_16px_42px_rgba(0,0,0,.24)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-400/10 border border-violet-300/15 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-white/[.04] border border-white/[.08] px-2 py-0.5 rounded-lg">
                  {badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture / How It Works */}
      <div id="how-it-works" className="w-full max-w-4xl pt-10 border-t border-white/[.08]">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Workflow Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSteps.map(({ step, title, desc }) => (
            <div
              key={step}
            className="rounded-2xl border border-white/[.09] bg-slate-950/55 backdrop-blur-xl p-5 transition-all hover:border-cyan-300/25"
            >
              <div className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-cyan-400/10 text-cyan-200 border border-cyan-300/15 mb-3">
                {step}
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1.5">{title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
