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
import { uploadToIpfs } from "../hooks/useContract";

export default function Dashboard({
  role,
  busy,
  run,
  contract,
  account,
  shortAccount,
  submissions = [],
  networkMismatch,
  contractChainName,
  switchToContractNetwork,
}) {
  const [form, setForm] = useState({ no: "1", title: "", wallet: "", name: "", enroll: "" });
  const [fileInfo, setFileInfo] = useState(null);
  const [computingHash, setComputingHash] = useState(false);
  const [uploadingIpfs, setUploadingIpfs] = useState(false);
  const [ipfsCid, setIpfsCid] = useState("");
  const [copiedAccount, setCopiedAccount] = useState(false);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComputingHash(true);
    setIpfsCid("");
    try {
      const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
      const hash =
        "0x" +
        [...new Uint8Array(digest)]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
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

    setUploadingIpfs(true);
    let uploadedIpfsCid = "";
    try {
      uploadedIpfsCid = await uploadToIpfs(fileInfo.file);
      setIpfsCid(uploadedIpfsCid);
    } catch (err) {
      alert(err.message || "Could not upload file to IPFS through Pinata.");
      setUploadingIpfs(false);
      return;
    } finally {
      setUploadingIpfs(false);
    }

    return run(
      () =>
        contract.submitPractical(
          Number(form.no),
          form.title.trim(),
          uploadedIpfsCid,
          fileInfo.hash
        ),
      `Practical ${form.no} pinned to IPFS and recorded on Ethereum`
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-zinc-400">Workspace</span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-500 font-mono">{shortAccount}</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {role === "Professor"
              ? "Professor Administration"
              : role === "Student"
              ? "Student Portal"
              : "Account Dashboard"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {role === "Professor"
              ? "Authorize student wallets and review practical PDFs stored on decentralized IPFS."
              : role === "Student"
              ? "Upload coursework to decentralized IPFS and record verification receipts on Ethereum."
              : "Wallet connected as a guest. Contact your course professor to register."}
          </p>
        </div>

        {/* View Submissions Link */}
        <Link to="/submissions" className="shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<FileTextIcon className="w-3.5 h-3.5 text-zinc-400" />}
          >
            Submissions ({submissions.length})
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-800 bg-[#111114] p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Total Submissions
          </span>
          <div className="text-2xl font-bold text-white">{submissions.length}</div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-[#111114] p-4">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block mb-1">
            Verified
          </span>
          <div className="text-2xl font-bold text-emerald-400">
            {verifiedSubmissionsCount}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-[#111114] p-4">
          <span className="text-[11px] font-medium text-amber-400 uppercase tracking-wider block mb-1">
            Pending Review
          </span>
          <div className="text-2xl font-bold text-amber-400">
            {pendingSubmissionsCount}
          </div>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Action Form */}
        <div className="lg:col-span-7 space-y-4">
          {networkMismatch && (
            <Card className="border-amber-900/50 bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertCircleIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200">Wrong network</h3>
                    <p className="text-xs text-zinc-300 mt-1">
                      Student registration and submissions for this contract are on {contractChainName}.
                    </p>
                  </div>
                  <Button onClick={switchToContractNetwork} disabled={busy} loading={busy} size="sm">
                    Switch to {contractChainName}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Professor: Register Student */}
          {role === "Professor" && !networkMismatch && (
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheckIcon className="w-4 h-4 text-zinc-300" />
                <h2 className="text-sm font-semibold text-white">Register Student</h2>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Bind a student wallet to their verified enrollment number on-chain.
              </p>

              <div className="space-y-3">
                <Input
                  label="Student Wallet Address"
                  placeholder="0x…"
                  value={form.wallet}
                  onChange={setField("wallet")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
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

                <div className="pt-1">
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
          {role === "Student" && !networkMismatch && (
            <Card>
              <div className="flex items-center gap-2 mb-1">
                <AcademicCapIcon className="w-4 h-4 text-zinc-300" />
                <h2 className="text-sm font-semibold text-white">Submit Assignment Proof</h2>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Upload coursework to IPFS and pin immutable cryptographic proof to Ethereum.
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      label="Title"
                      placeholder="e.g. Dijkstra Algorithm"
                      value={form.title}
                      onChange={setField("title")}
                    />
                  </div>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Assignment File (PDF, Code, or Document)
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-zinc-700/80 hover:border-zinc-500 bg-zinc-900/60 rounded-lg p-5 cursor-pointer transition text-center group">
                    <UploadCloudIcon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition mb-1.5" />
                    {fileInfo ? (
                      <div className="text-xs">
                        <span className="font-medium text-zinc-200 block">{fileInfo.name}</span>
                        <span className="text-zinc-500 text-[11px]">{fileInfo.size}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-400">
                        <span className="font-medium text-zinc-200">Choose file</span> or drag & drop
                        <p className="text-[11px] text-zinc-500 mt-0.5">PDF, DOCX, ZIP, or code file</p>
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {/* Local Hash Indicator */}
                {computingHash && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg">
                    <span className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    Computing client SHA-256 fingerprint locally…
                  </div>
                )}

                {/* IPFS Uploading Indicator */}
                {uploadingIpfs && (
                  <div className="flex items-center gap-2 text-xs text-blue-300 bg-blue-950/40 border border-blue-900/60 p-2.5 rounded-lg">
                    <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Uploading PDF to decentralized IPFS via Pinata…
                  </div>
                )}

                {fileInfo?.hash && !computingHash && (
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                        Client SHA-256 Digest
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">Verified locally</span>
                    </div>
                    <code className="block text-[11px] font-mono text-zinc-300 break-all select-all bg-black/40 p-2 rounded border border-zinc-800/80">
                      {fileInfo.hash}
                    </code>
                  </div>
                )}

                <div className="pt-1">
                  <Button
                    onClick={submit}
                    disabled={busy || uploadingIpfs || !fileInfo?.hash || !form.title}
                    loading={busy || uploadingIpfs}
                    className="w-full"
                    icon={<FileTextIcon className="w-4 h-4" />}
                  >
                    {uploadingIpfs ? "Pinning to IPFS…" : "Submit Practical Proof On-Chain"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Unregistered Guest View */}
          {role === "Unregistered" && !networkMismatch && (
            <Card className="border-amber-900/50 bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertCircleIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-amber-200">
                    Wallet Not Registered
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Your wallet is connected, but not yet linked to an enrollment number by the course professor.
                  </p>
                  <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg">
                    <span className="text-[11px] text-zinc-400 block mb-1">
                      Share your wallet address with the professor:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono text-zinc-200 truncate">
                        {account}
                      </code>
                      <button
                        onClick={copyMyAccount}
                        className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
                      >
                        {copiedAccount ? (
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <CopyIcon className="w-3.5 h-3.5" />
                        )}
                        {copiedAccount ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <Card>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
              Protocol Security
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <UploadCloudIcon className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-zinc-200">Decentralized IPFS Storage</h4>
                  <p className="text-zinc-400 mt-0.5">
                    Coursework PDFs are pinned to IPFS, ensuring permanent, tamper-resistant document access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-zinc-200">Block Timestamping</h4>
                  <p className="text-zinc-400 mt-0.5">
                    Ethereum block headers verify the exact submission time without relying on central servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheckIcon className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-zinc-200">Professor Verification</h4>
                  <p className="text-zinc-400 mt-0.5">
                    Professors inspect the uploaded PDF and certify official verification on-chain.
                  </p>
                </div>
              </div>
            </div>

            {role === "Professor" && (
              <div className="mt-4 pt-3 border-t border-zinc-800">
                <Link
                  to="/identity"
                  className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1"
                >
                  <span>Look up student registration</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
