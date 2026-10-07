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

  const accountPanel = account ? (
    <div className="rounded-2xl border border-white/[.09] bg-white/[.04] p-3 space-y-2">
      {role && <span className="inline-flex rounded-lg bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">{role}</span>}
      <button onClick={copyAddress} title="Copy wallet address" className="flex w-full items-center justify-between gap-2 font-mono text-xs text-slate-300 hover:text-white">
        <span>{shortAccount}</span>
        {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      <button onClick={() => { if (onDisconnect) onDisconnect(); navigate("/"); }} className="flex items-center gap-2 text-xs text-slate-500 hover:text-rose-300">
        <LogoutIcon className="w-3.5 h-3.5" /> Disconnect wallet
      </button>
    </div>
  ) : <Button onClick={onConnect} loading={busy} size="sm" icon={<WalletIcon className="w-3.5 h-3.5" />} className="w-full rounded-xl">Connect Wallet</Button>;

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-violet-300/30 selection:text-white lg:p-5">
      <div className="mx-auto flex min-h-screen max-w-7xl lg:gap-5">
        <aside className="hidden w-64 shrink-0 flex-col rounded-3xl border border-white/[.09] bg-slate-950/55 p-4 backdrop-blur-xl lg:flex lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
          <Link to={account ? "/dashboard" : "/"} className="flex items-center gap-3 px-2 py-2">
            <Logo size={34} /><span className="text-base font-bold tracking-tight text-white">BlockProof</span>
          </Link>
          <div className="mt-8 px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Workspace</div>
          <nav className="mt-2 space-y-1">
            {navItems.map(({ to, label }) => <Link key={to} to={to} className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname === to ? "bg-violet-400/15 text-violet-100 ring-1 ring-violet-300/15" : "text-slate-400 hover:bg-white/[.06] hover:text-slate-100"}`}>{label}</Link>)}
          </nav>
          <div className="mt-auto">{accountPanel}</div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col px-4 sm:px-6 lg:px-0">
          <header className="sticky top-0 z-30 pt-3 lg:hidden">
            <div className="flex items-center justify-between rounded-2xl border border-white/[.09] bg-slate-950/75 px-3.5 py-2.5 backdrop-blur-xl">
              <Link to={account ? "/dashboard" : "/"} className="flex items-center gap-2"><Logo size={25} /><span className="text-sm font-bold">BlockProof</span></Link>
              <div className="w-auto max-w-[11rem]">{account ? <button onClick={copyAddress} className="font-mono text-xs text-slate-300">{shortAccount}</button> : <Button onClick={onConnect} loading={busy} size="sm" icon={<WalletIcon className="w-3.5 h-3.5" />}>Connect</Button>}</div>
            </div>
          </header>

          {notice && <div className={`mt-3 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs ${notice.type === "error" ? "border-rose-400/20 bg-rose-500/10 text-rose-200" : notice.type === "success" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200" : "border-white/[.09] bg-white/[.04] text-slate-300"}`}><div className="flex gap-2">{notice.type === "error" ? <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" /> : <CheckIcon className="w-3.5 h-3.5 shrink-0" />}<span>{notice.text}</span></div><button onClick={() => notice.onClose && notice.onClose()}>✕</button></div>}

          <main className="flex-1 py-8 sm:py-10 lg:py-12">{children}</main>
          <footer className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-white/[.07] py-6 text-xs text-slate-500 sm:flex-row">
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
  </div>
  );
}
