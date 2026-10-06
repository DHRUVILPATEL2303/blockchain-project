import { useState } from "react";
import {
  SearchIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AcademicCapIcon,
  WalletIcon,
} from "../components/Icons";
import { Button, Card } from "../components/ui";

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
      setError("Could not fetch identity. Please verify the Ethereum address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="text-xs font-medium text-zinc-400">
            Registry Lookup
          </span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Verify Student Identity
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Query the smart contract directly to audit student registration status.
        </p>
      </div>

      {/* Query Card */}
      <Card>
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Student Ethereum Address
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <WalletIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="0x…"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && check()}
              className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
            />
          </div>
          <Button
            onClick={check}
            disabled={loading || !wallet.trim()}
            loading={loading}
            size="sm"
            icon={<SearchIcon className="w-3.5 h-3.5" />}
          >
            Verify
          </Button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircleIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        {/* Identity Result */}
        {identity && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            {identity.registered ? (
              <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-emerald-300 block">
                        Verified Student
                      </span>
                      <span className="text-[11px] text-zinc-400">Authenticated on-chain</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                    Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-zinc-900/90 rounded p-2.5 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Name</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">
                      {identity.name}
                    </span>
                  </div>

                  <div className="bg-zinc-900/90 rounded p-2.5 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase block">Enrollment No.</span>
                    <span className="text-xs font-semibold text-emerald-300 mt-0.5 block font-mono">
                      {identity.enroll}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/90 rounded p-2.5 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">Bound Wallet</span>
                  <code className="text-[11px] font-mono text-zinc-300 break-all select-all mt-0.5 block">
                    {identity.address}
                  </code>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-4 flex items-start gap-2.5">
                <AlertCircleIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-300">Wallet Not Registered</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    This Ethereum address is not linked to any registered student on this contract.
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
