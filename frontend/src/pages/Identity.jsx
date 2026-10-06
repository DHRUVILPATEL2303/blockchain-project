import { useState } from "react";
import {
  SearchIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AcademicCapIcon,
  WalletIcon,
} from "../components/Icons";
import { Button, Card, Input } from "../components/ui";

export default function Identity({ contract }) {
  const [wallet, setWallet] = useState("");
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!wallet.trim()) return;
    setLoading(true);
    setError("");
    setIdentity(null);
    try {
      const result = await contract.getIdentity(wallet.trim());
      setIdentity({
        name: result[0],
        enroll: result[1],
        registered: result[2],
        address: wallet.trim(),
      });
    } catch {
      setError("Could not fetch identity. Please verify the Ethereum address format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800/80 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            On-Chain Registry Lookup
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Student Identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Query the smart contract directly to audit student registration status and academic credentials.
        </p>
      </div>

      {/* Query Card */}
      <Card>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Student Ethereum Address
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <WalletIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="0x…"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl bg-[#0d1322] border border-slate-800 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition"
            />
          </div>
          <Button
            onClick={check}
            disabled={loading || !wallet.trim()}
            loading={loading}
            icon={<SearchIcon className="w-4 h-4" />}
          >
            Verify Identity
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircleIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Identity Result */}
        {identity && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            {identity.registered ? (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        Verified Student Identity
                      </span>
                      <span className="text-xs text-slate-400">Authenticated on Ethereum state</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#0b0f17]/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Student Full Name
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {identity.name}
                    </span>
                  </div>

                  <div className="bg-[#0b0f17]/90 rounded-xl p-3 border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Enrollment Number
                    </span>
                    <span className="text-sm font-bold text-emerald-300 mt-0.5 block font-mono">
                      {identity.enroll}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0b0f17]/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                    Bound Wallet Address
                  </span>
                  <code className="text-xs font-mono text-slate-300 break-all select-all mt-0.5 block">
                    {identity.address}
                  </code>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <AlertCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Wallet Not Registered</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    This Ethereum address is not linked to any registered student on this contract. Please check the address or ask the professor to register it.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
