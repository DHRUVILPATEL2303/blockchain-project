import { useState } from "react";
import { Link } from "react-router";
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  AlertCircleIcon,
  UploadCloudIcon,
  HashIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FileTextIcon,
  CopyIcon,
  CheckIcon,
} from "../components/Icons";
import { Button, Card, Input } from "../components/ui";

export default function Dashboard({ role, busy, run, contract, account, shortAccount, submissions = [] }) {
  const [form, setForm] = useState({ no: "1", title: "", wallet: "", name: "", enroll: "" });
  const [fileInfo, setFileInfo] = useState(null);
  const [computingHash, setComputingHash] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComputingHash(true);
    try {
      const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
      const hash = "0x" + [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
      setFileInfo({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        hash,
      });
    } catch (err) {
      console.error("Hashing failed", err);
    } finally {
      setComputingHash(false);
    }
  };

  const register = () => {
    if (!form.wallet || !form.name || !form.enroll) return;
    run(
      () => contract.registerStudent(form.wallet.trim(), form.name.trim(), form.enroll.trim()),
      `Student ${form.name} registered on-chain`
    );
  };

  const submit = async () => {
    if (!fileInfo?.hash || !form.title) return;
    return run(
      () => contract.submitPractical(Number(form.no), form.title.trim(), fileInfo.hash),
      `Practical ${form.no} submitted with immutable SHA-256 proof`
    );
  };

  const copyMyAccount = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const verifiedSubmissionsCount = submissions.filter((s) => s.verified).length;
  const pendingSubmissionsCount = submissions.length - verifiedSubmissionsCount;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Workspace Overview
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Connected: {shortAccount}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {role === "Professor"
              ? "Professor Administration"
              : role === "Student"
              ? "Student Practical Portal"
              : "Account Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {role === "Professor"
              ? "Authorize student wallets and verify practical submissions with cryptographic certainty."
              : role === "Student"
              ? "Generate cryptographic SHA-256 proofs and submit coursework directly on Ethereum."
              : "Your wallet is connected as a guest. Contact your course professor to register."}
          </p>
        </div>

        {/* Quick Link to Submissions */}
        <div className="flex items-center gap-3">
          <Link to="/submissions">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileTextIcon className="w-4 h-4 text-slate-400" />}
            >
              View All Submissions ({submissions.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-[#111726]/70 p-5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total On-Chain Records
          </span>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            {submissions.length}
            <span className="text-xs text-slate-500 font-normal">practicals</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726]/70 p-5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Verified Records
          </span>
          <div className="text-2xl font-bold text-emerald-400 flex items-baseline gap-2">
            {verifiedSubmissionsCount}
            <span className="text-xs text-slate-500 font-normal">certified</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#111726]/70 p-5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Pending Review
          </span>
          <div className="text-2xl font-bold text-amber-400 flex items-baseline gap-2">
            {pendingSubmissionsCount}
            <span className="text-xs text-slate-500 font-normal">awaiting</span>
          </div>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Action Card (Left / Center) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Professor: Register Student */}
          {role === "Professor" && (
            <Card className="border-blue-500/20 shadow-blue-900/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Register Student Identity</h2>
                  <p className="text-xs text-slate-400">
                    Bind a student wallet to their verified enrollment record on-chain.
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-5">
                <Input
                  label="Student Wallet Address"
                  placeholder="0x…"
                  value={form.wallet}
                  onChange={setField("wallet")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Student Full Name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={setField("name")}
                  />
                  <Input
                    label="Enrollment Number"
                    placeholder="e.g. 21CS001"
                    value={form.enroll}
                    onChange={setField("enroll")}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={register}
                    disabled={busy || !form.wallet || !form.name || !form.enroll}
                    loading={busy}
                    className="w-full"
                    icon={<ShieldCheckIcon className="w-4 h-4" />}
                  >
                    Register Student On-Chain
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Student: Submit Practical */}
          {role === "Student" && (
            <Card className="border-emerald-500/20 shadow-emerald-900/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <AcademicCapIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Submit Assignment Proof</h2>
                  <p className="text-xs text-slate-400">
                    Generate SHA-256 fingerprint and broadcast submission receipt.
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Practical No."
                      type="number"
                      min="1"
                      value={form.no}
                      onChange={setField("no")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Practical Title"
                      placeholder="e.g. Dijkstra Shortest Path Algorithm"
                      value={form.title}
                      onChange={setField("title")}
                    />
                  </div>
                </div>

                {/* File Upload & Client Hashing Zone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Assignment File
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 bg-[#0d1322] hover:bg-slate-900/50 rounded-xl p-5 cursor-pointer transition text-center group">
                    <UploadCloudIcon className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition mb-2" />
                    {fileInfo ? (
                      <div className="text-xs">
                        <span className="font-semibold text-slate-200 block">{fileInfo.name}</span>
                        <span className="text-slate-500 text-[11px]">{fileInfo.size}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-blue-400">Click to select file</span> or drag & drop
                        <p className="text-[11px] text-slate-500 mt-0.5">PDF, DOCX, ZIP, or code file</p>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {/* Instant SHA-256 preview */}
                {computingHash && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950/30 border border-blue-800/40 p-3 rounded-xl">
                    <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Computing cryptographic SHA-256 digest in browser…
                  </div>
                )}

                {fileInfo?.hash && !computingHash && (
                  <div className="bg-[#0d1322] border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                        Client SHA-256 Digest
                      </span>
                      <span className="text-[11px] text-emerald-400">Computed locally</span>
                    </div>
                    <code className="block text-[11px] font-mono text-slate-300 break-all select-all bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                      {fileInfo.hash}
                    </code>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={submit}
                    disabled={busy || !fileInfo?.hash || !form.title}
                    loading={busy}
                    className="w-full"
                    icon={<FileTextIcon className="w-4 h-4" />}
                  >
                    Submit Practical Proof On-Chain
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Unregistered State */}
          {role === "Unregistered" && (
            <Card className="border-amber-500/30 bg-amber-950/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <AlertCircleIcon className="w-5 h-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-amber-200">
                    Wallet Not Yet Registered
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your wallet is connected, but the course professor has not yet linked it to an enrollment number on this smart contract.
                  </p>
                  
                  <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Share your wallet address with your professor:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono text-slate-200 truncate">
                        {account}
                      </code>
                      <button
                        onClick={copyMyAccount}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        {copiedAccount ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                        {copiedAccount ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar / Instructions & Security Details */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Security Protocol Principles
            </span>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                  <HashIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Zero File Exposure</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your raw document never touches an external server. Only a one-way mathematical hash is broadcast.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Indelible Timestamping</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ethereum block headers verify precisely when your practical was completed and submitted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Professor Verification</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Once certified by the professor, submissions carry verifiable academic authenticity.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <Link
                to="/identity"
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5"
              >
                <span>Look up student registration status</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
