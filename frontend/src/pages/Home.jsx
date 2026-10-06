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
    <div className="flex flex-col items-center pt-8 sm:pt-12 pb-16">
      {/* Top Protocol Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-6 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Ethereum Academic Protocol
      </div>

      {/* Hero Headline */}
      <div className="max-w-2xl text-center mb-8">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Academic submissions, verified on the blockchain.
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg mx-auto">
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
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold px-5"
          >
            Connect Wallet
          </Button>
        )}

        <a
          href="#how-it-works"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 transition"
        >
          How It Works
        </a>
      </div>

      {/* Deployed Contract Ribbon (Clean & Crisp) */}
      {address && (
        <div className="w-full max-w-lg mb-14">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#111114] border border-zinc-800 text-xs shadow-sm">
            <div className="flex items-center gap-2.5 text-zinc-400 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-zinc-400 font-medium shrink-0">Smart Contract:</span>
              <span className="font-mono text-zinc-200 text-[11px] truncate">
                {address}
              </span>
            </div>
            <button
              onClick={copyContract}
              title="Copy contract address"
              className="p-1 rounded text-zinc-400 hover:text-white transition cursor-pointer shrink-0 hover:bg-zinc-800"
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
            className="rounded-xl border border-zinc-800 bg-[#111114] p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-[#15151a] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 px-2 py-0.5 rounded">
                  {badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture / How It Works */}
      <div id="how-it-works" className="w-full max-w-4xl pt-8 border-t border-zinc-800/80">
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
              className="rounded-xl border border-zinc-800 bg-[#111114] p-5 transition-all hover:border-zinc-700 hover:bg-[#15151a]"
            >
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 mb-3">
                {step}
              </div>
              <h4 className="text-sm font-semibold text-zinc-100 mb-1.5">{title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
