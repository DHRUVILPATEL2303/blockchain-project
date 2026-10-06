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
  FileTextIcon,
  CheckCircleIcon,
} from "../components/Icons";
import { Button, Card } from "../components/ui";

const features = [
  {
    icon: <ShieldCheckIcon className="w-6 h-6 text-blue-400" />,
    title: "Tamper-Proof Records",
    desc: "File hashes and submission timestamps stored directly in Ethereum state cannot be altered, overwritten, or erased by anyone.",
  },
  {
    icon: <AcademicCapIcon className="w-6 h-6 text-emerald-400" />,
    title: "Verified Student Identity",
    desc: "Professors register verified students by enrollment number, creating cryptographic proof of authorship for each assignment.",
  },
  {
    icon: <HashIcon className="w-6 h-6 text-indigo-400" />,
    title: "Client-Side SHA-256 Fingerprint",
    desc: "Assignments are hashed locally in your browser. The cryptographic digest serves as absolute mathematical proof of originality.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Upload & Hash",
    desc: "Student selects the assignment file. Browser generates a unique SHA-256 cryptographic digest.",
  },
  {
    step: "02",
    title: "Smart Contract Minting",
    desc: "Submission metadata and hash are broadcast to Ethereum, creating an immutable on-chain receipt.",
  },
  {
    step: "03",
    title: "Professor Verification",
    desc: "Professor inspects the practical and certifies authenticity with an on-chain verification signature.",
  },
];

export default function Home({ address, setAddress, onConnect, account, role }) {
  const [copied, setCopied] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const copyContract = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setAddress(tempAddress.trim());
      localStorage.setItem("ps_addr", tempAddress.trim());
      setIsEditingAddress(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-16">
      
      {/* Top Protocol Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        Ethereum Academic Verification Protocol
      </div>

      {/* Hero Headline */}
      <div className="max-w-3xl text-center mb-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Academic submissions.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            Cryptographically sealed.
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Prove authorship, timestamp coursework, and receive professor verification on the
          Ethereum blockchain. Zero passwords, no centralized storage vulnerabilities.
        </p>
      </div>

      {/* Primary Hero Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        {account ? (
          <Link to="/dashboard">
            <Button size="lg" icon={<ArrowRightIcon className="w-5 h-5" />}>
              Open Dashboard ({role || "Connected"})
            </Button>
          </Link>
        ) : (
          <Button
            size="lg"
            onClick={onConnect}
            icon={<WalletIcon className="w-5 h-5" />}
            className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 px-6"
          >
            Connect MetaMask Wallet
          </Button>
        )}

        <a
          href="#architecture"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all"
        >
          <FileTextIcon className="w-4 h-4 text-slate-400" />
          How Protocol Works
        </a>
      </div>

      {/* Target Contract Status Card */}
      <div className="w-full max-w-2xl mb-16">
        <div className="rounded-2xl border border-slate-800 bg-[#111726]/90 p-5 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Connected Smart Contract
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-sm text-slate-200 font-medium">
                  {address ? `${address.slice(0, 10)}…${address.slice(-8)}` : "No address specified"}
                </span>
                {address && (
                  <button
                    onClick={copyContract}
                    className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer hover:bg-slate-800"
                    title="Copy full address"
                  >
                    {copied ? (
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <CopyIcon className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700"
              >
                {isEditingAddress ? "Close" : "Change Contract"}
              </button>
            </div>
          </div>

          {isEditingAddress && (
            <form onSubmit={handleSaveAddress} className="mt-4 pt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="0x… custom contract address"
                className="flex-1 font-mono text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
              />
              <Button type="submit" size="sm">
                Save & Update
              </Button>
            </form>
          )}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Security</span>
              <span className="text-slate-200 font-medium">SHA-256 Digest</span>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Network</span>
              <span className="text-slate-200 font-medium">Ethereum EVM</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">Identity</span>
              <span className="text-slate-200 font-medium">On-chain Roll No.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-800/80 bg-[#111726]/60 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:bg-[#111726]"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works Section */}
      <div id="architecture" className="w-full max-w-4xl pt-8 border-t border-slate-800/80">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Workflow Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            How BlockProof Verifies Assignments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSteps.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-slate-800 bg-[#0e1422] p-5"
            >
              <div className="text-xs font-mono font-bold text-blue-400 mb-2">
                {step}
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1.5">{title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
