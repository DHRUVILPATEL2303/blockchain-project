import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import Logo from "./Logo";
import {
  WalletIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  AlertCircleIcon,
  CopyIcon,
  CheckIcon,
  LogoutIcon,
  SettingsIcon,
  SpinnerIcon,
} from "./Icons";
import { Button } from "./ui";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/submissions", label: "Submissions" },
  { to: "/identity", label: "Identity Lookup" },
];

export default function Layout({
  children,
  account,
  shortAccount,
  role,
  onConnect,
  onDisconnect,
  address,
  setAddress,
  busy,
  notice,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveContractAddress = (e) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setAddress(tempAddress.trim());
      localStorage.setItem("ps_addr", tempAddress.trim());
      setShowConfig(false);
    }
  };

  const getRoleBadge = () => {
    if (!role) return null;
    if (role === "Professor") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <ShieldCheckIcon className="w-3.5 h-3.5" />
          Professor
        </span>
      );
    }
    if (role === "Student") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <AcademicCapIcon className="w-3.5 h-3.5" />
          Student
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertCircleIcon className="w-3.5 h-3.5" />
        Unregistered
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white relative">
      {/* Subtle background cryptographic grid and ambient radial light */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-60" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-gradient" />

      {/* Main Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Navbar */}
        <header className="sticky top-0 z-30 py-4 backdrop-blur-xl bg-[#0B0F17]/85 border-b border-slate-800/80 transition-all">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand / Logo */}
            <Link
              to={account ? "/dashboard" : "/"}
              className="flex items-center gap-3 group text-decoration-none"
            >
              <Logo size={36} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    BlockProof
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    ETH Registry
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-normal">
                  Academic Practical Verification
                </div>
              </div>
            </Link>

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#111726]/80 border border-slate-800/80 rounded-xl p-1 backdrop-blur-md">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === "/"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                Overview
              </Link>
              {account && (
                <>
                  {NAV_ITEMS.map(({ to, label }) => {
                    const active = pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            {/* Right: Contract setting + Connect Wallet / Account Pill */}
            <div className="flex items-center gap-3">
              {/* Quick Contract Chip */}
              <button
                onClick={() => {
                  setTempAddress(address);
                  setShowConfig(!showConfig);
                }}
                title="Configure smart contract address"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">
                  {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Set Contract"}
                </span>
              </button>

              {/* Wallet connection state */}
              {account ? (
                <div className="flex items-center gap-2 bg-[#111726] border border-slate-800 rounded-xl p-1 pl-2.5 shadow-sm">
                  {/* Role Tag */}
                  {getRoleBadge()}

                  {/* Account address pill with copy button */}
                  <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-slate-200 font-medium">
                      {shortAccount}
                    </span>
                    <button
                      onClick={copyAddress}
                      title="Copy wallet address"
                      className="text-slate-400 hover:text-white p-1 rounded transition hover:bg-slate-800 cursor-pointer"
                    >
                      {copied ? (
                        <CheckIcon className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <CopyIcon className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Disconnect button */}
                  <button
                    onClick={() => {
                      if (onDisconnect) onDisconnect();
                      navigate("/");
                    }}
                    title="Disconnect wallet"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  >
                    <LogoutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Primary Connect Wallet Button directly on the Header */
                <Button
                  onClick={onConnect}
                  loading={busy}
                  size="md"
                  icon={<WalletIcon className="w-4 h-4" />}
                  className="bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>

          {/* Mobile navigation row if connected */}
          {account && (
            <div className="flex md:hidden items-center gap-1 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1">
              <Link
                to="/"
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                  pathname === "/" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Overview
              </Link>
              {NAV_ITEMS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    pathname === to ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Quick Contract Modal/Dropdown */}
          {showConfig && (
            <div className="absolute right-4 top-20 z-50 w-84 p-4 rounded-xl bg-[#111726] border border-slate-700 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Smart Contract
                </span>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Transactions and records interact with this verified contract address.
              </p>
              <form onSubmit={saveContractAddress} className="space-y-3">
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="0x… deployed contract"
                  className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}
        </header>

        {/* Global Notice / Toast */}
        {notice && (
          <div className="mt-4">
            <div
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm border backdrop-blur-md shadow-lg ${
                notice.type === "error"
                  ? "bg-rose-950/40 border-rose-500/30 text-rose-300"
                  : notice.type === "success"
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-blue-950/40 border-blue-500/30 text-blue-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {notice.type === "error" ? (
                  <AlertCircleIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                ) : notice.type === "success" ? (
                  <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                )}
                <span>{notice.text}</span>
              </div>
              <button
                onClick={() => notice.onClose && notice.onClose()}
                className="text-current opacity-60 hover:opacity-100 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 py-8">{children}</main>

        {/* Professional Footer */}
        <footer className="mt-auto py-8 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">BlockProof</span>
            <span>·</span>
            <span>Tamper-Proof Academic Practical Verification</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ethereum SHA-256 Protocol</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-slate-500">
              Contract: {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Not configured"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
