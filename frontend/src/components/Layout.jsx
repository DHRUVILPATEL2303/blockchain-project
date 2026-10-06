import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import Logo from "./Logo";
import {
  WalletIcon,
  CopyIcon,
  CheckIcon,
  LogoutIcon,
  AlertCircleIcon,
} from "./Icons";
import { Button } from "./ui";

export default function Layout({
  children,
  account,
  shortAccount,
  role,
  onConnect,
  onDisconnect,
  address,
  busy,
  notice,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyContract = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  // Student: only Dashboard & Submissions (NO identity, NO overview)
  // Teacher/Professor: Dashboard, Submissions, Identity (NO overview)
  const navItems = [];
  if (account) {
    navItems.push({ to: "/dashboard", label: "Dashboard" });
    navItems.push({ to: "/submissions", label: "Submissions" });
    if (role === "Professor") {
      navItems.push({ to: "/identity", label: "Identity" });
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Container */}
      <div className="flex flex-col min-h-screen max-w-5xl w-full mx-auto px-4 sm:px-6">
        
        {/* Header: Super clean, zero middle clutter when logged out */}
        <header className="sticky top-0 z-30 py-3.5 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand */}
            <Link
              to={account ? "/dashboard" : "/"}
              className="flex items-center gap-2 group text-decoration-none"
            >
              <Logo size={24} />
              <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition">
                BlockProof
              </span>
            </Link>

            {/* Center: Role-based Navigation (ONLY visible when connected, NEVER shows Overview) */}
            {account && navItems.length > 0 && (
              <nav className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                {navItems.map(({ to, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                        active
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right: Wallet Button or Account Pill */}
            <div className="flex items-center gap-2">
              {account ? (
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
                  {/* Role Tag */}
                  {role && (
                    <span
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                        role === "Professor"
                          ? "bg-zinc-800 text-zinc-200"
                          : role === "Student"
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                          : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                      }`}
                    >
                      {role}
                    </span>
                  )}

                  {/* Copy Account */}
                  <button
                    onClick={copyAddress}
                    title="Copy wallet address"
                    className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    <span>{shortAccount}</span>
                    {copied ? (
                      <CheckIcon className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <CopyIcon className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                    )}
                  </button>

                  {/* Disconnect */}
                  <button
                    onClick={() => {
                      if (onDisconnect) onDisconnect();
                      navigate("/");
                    }}
                    title="Disconnect wallet"
                    className="p-1 text-zinc-500 hover:text-rose-400 rounded transition cursor-pointer ml-1"
                  >
                    <LogoutIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={onConnect}
                  loading={busy}
                  size="sm"
                  icon={<WalletIcon className="w-3.5 h-3.5" />}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold rounded-lg px-3.5"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Global Notice / Toast */}
        {notice && (
          <div className="mt-3">
            <div
              className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg text-xs border ${
                notice.type === "error"
                  ? "bg-rose-950/40 border-rose-900 text-rose-300"
                  : notice.type === "success"
                  ? "bg-emerald-950/40 border-emerald-900 text-emerald-300"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {notice.type === "error" ? (
                  <AlertCircleIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : notice.type === "success" ? (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                )}
                <span>{notice.text}</span>
              </div>
              <button
                onClick={() => notice.onClose && notice.onClose()}
                className="text-current opacity-60 hover:opacity-100 p-0.5 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 py-7">{children}</main>

        {/* Clean Footer */}
        <footer className="mt-auto py-5 border-t border-zinc-900 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400">BlockProof</span>
            <span>·</span>
            <span>Academic Verification</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
            <span>Contract:</span>
            {address ? (
              <button
                onClick={copyContract}
                title="Click to copy contract address"
                className="text-zinc-400 hover:text-zinc-200 transition flex items-center gap-1 cursor-pointer bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800"
              >
                <span>{`${address.slice(0, 6)}…${address.slice(-4)}`}</span>
                {copiedContract ? (
                  <CheckIcon className="w-3 h-3 text-emerald-400" />
                ) : (
                  <CopyIcon className="w-3 h-3 opacity-60" />
                )}
              </button>
            ) : (
              <span>Not configured</span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
