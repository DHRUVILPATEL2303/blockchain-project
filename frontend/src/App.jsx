import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract, isAddress } from "ethers";
import { ABI } from "./abi";
import { CONTRACT_ADDRESS } from "./config";

const short = (a) => a.slice(0, 6) + "…" + a.slice(-4);
const errMsg = (e) => e.reason || e.shortMessage || e.message;

async function hashFile(file) {
  const d = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return "0x" + [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function App() {
  const [addr, setAddr] = useState(CONTRACT_ADDRESS || localStorage.getItem("ps_addr") || "");
  const [acct, setAcct] = useState("");
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");
  const [subs, setSubs] = useState([]);
  const [f, setF] = useState({ no: "1" });
  const [who, setWho] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const say = (text, type = "ok") => setNote({ text, type });

  useEffect(() => {
    if (!window.ethereum) return;
    const reload = () => window.location.reload();
    window.ethereum.on("accountsChanged", reload);
    window.ethereum.on("chainChanged", reload);
  }, []);

  const connect = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found - install it first");
      if (!isAddress(addr)) throw new Error("Enter a valid contract address");
      const signer = await new BrowserProvider(window.ethereum).getSigner();
      setAcct(await signer.getAddress());
      setContract(new Contract(addr, ABI, signer));
      localStorage.setItem("ps_addr", addr);
      setNote(null);
    } catch (e) {
      say(errMsg(e), "err");
    }
  };

  const load = useCallback(async () => {
    if (!contract) return;
    const prof = await contract.professor();
    const me = await contract.getIdentity(acct);
    setRole(prof.toLowerCase() === acct.toLowerCase() ? "Professor" : me.registered ? "Student" : "Unregistered");
    const n = Number(await contract.totalSubmissions());
    const list = [];
    for (let i = 1; i <= n; i++) {
      const s = await contract.getSubmission(i);
      list.push({ id: i, name: s[0], enroll: s[1], no: Number(s[2]), title: s[3], hash: s[4], time: Number(s[5]), verified: s[6] });
    }
    setSubs(list.reverse());
  }, [contract, acct]);

  useEffect(() => {
    load().catch((e) => say(errMsg(e), "err"));
  }, [load]);

  const run = async (fn, okText) => {
    try {
      setBusy(true);
      await (await fn()).wait();
      say(okText);
      await load();
    } catch (e) {
      say(errMsg(e), "err");
    } finally {
      setBusy(false);
    }
  };

  const register = () => run(() => contract.registerStudent(f.wallet, f.name, f.enroll), "Student registered on-chain");
  const submit = async () => {
    if (!f.file) return say("Choose the practical file first", "err");
    const h = await hashFile(f.file);
    run(() => contract.submitPractical(f.no, f.title, h), "Practical submitted with SHA-256 proof");
  };
  const check = async () => {
    try {
      const r = await contract.getIdentity(f.check);
      setWho({ name: r[0], enroll: r[1], registered: r[2] });
    } catch (e) {
      say(errMsg(e), "err");
    }
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>Practical Submission <span>DApp</span></h1>
          <p>Student ⇄ Professor smart contract · identity checked on-chain</p>
        </div>
        {acct && (
          <div className="pill">
            <i className={"dot " + role.toLowerCase()} /> {role} · {short(acct)}
          </div>
        )}
      </header>

      {note && <div className={"note " + note.type}>{note.text}</div>}

      {!contract ? (
        <section className="card center">
          <h2>Connect</h2>
          <p className="muted">Paste the deployed contract address (from Remix) and connect MetaMask.</p>
          <input placeholder="0x… contract address" value={addr} onChange={(e) => setAddr(e.target.value)} />
          <button onClick={connect}>Connect MetaMask</button>
        </section>
      ) : (
        <main>
          {role === "Professor" && (
            <section className="card">
              <h2>Register student</h2>
              <p className="muted">Links a wallet to a real name and enrollment number.</p>
              <input placeholder="Student wallet 0x…" onChange={set("wallet")} />
              <input placeholder="Full name" onChange={set("name")} />
              <input placeholder="Enrollment no." onChange={set("enroll")} />
              <button disabled={busy} onClick={register}>Register</button>
            </section>
          )}

          {role === "Student" && (
            <section className="card">
              <h2>Submit practical</h2>
              <p className="muted">The file never leaves your PC - only its SHA-256 hash goes on-chain.</p>
              <input type="number" min="1" placeholder="Practical no." value={f.no} onChange={set("no")} />
              <input placeholder="Title" onChange={set("title")} />
              <input type="file" onChange={(e) => setF({ ...f, file: e.target.files[0] })} />
              <button disabled={busy} onClick={submit}>Submit</button>
            </section>
          )}

          {role === "Unregistered" && (
            <section className="card">
              <h2>Not registered</h2>
              <p className="muted">Ask the professor to register this wallet before you can submit.</p>
            </section>
          )}

          <section className="card">
            <h2>Check identity</h2>
            <input placeholder="Wallet 0x…" onChange={set("check")} />
            <button className="ghost" onClick={check}>Check</button>
            {who && (
              <p className={"result " + (who.registered ? "yes" : "no")}>
                {who.registered ? `✔ ${who.name} · ${who.enroll}` : "✖ Not a registered student"}
              </p>
            )}
          </section>

          <section className="card wide">
            <h2>Submissions <small>{subs.length}</small></h2>
            {subs.length === 0 && <p className="muted">Nothing submitted yet.</p>}
            {subs.map((s) => (
              <div className="row" key={s.id}>
                <div>
                  <b>#{s.id} · Practical {s.no}: {s.title}</b>
                  <p className="muted">{s.name} ({s.enroll}) · {new Date(s.time * 1000).toLocaleString()}</p>
                  <code>{s.hash.slice(0, 22)}…</code>
                </div>
                {s.verified ? (
                  <span className="badge ok">Verified</span>
                ) : role === "Professor" ? (
                  <button disabled={busy} onClick={() => run(() => contract.verify(s.id), "Submission verified")}>Verify</button>
                ) : (
                  <span className="badge">Pending</span>
                )}
              </div>
            ))}
          </section>
        </main>
      )}
    </div>
  );
}
