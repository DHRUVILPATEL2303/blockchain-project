import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, isAddress } from "ethers";
import { ABI } from "../abi";
import { CONTRACT_ADDRESS } from "../config";

const short = (address) => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "");

const errorMessage = (error) => {
  if (!error) return "An unknown error occurred";
  if (error.code === 4001 || error.code === "ACTION_REJECTED") {
    return "Transaction was cancelled in MetaMask.";
  }
  return error.reason || error.shortMessage || error.message || "Operation failed";
};

async function hashFile(file) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return "0x" + [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function uploadToIpfs(file) {
  const formData = new FormData();
  formData.append("file", file);

  let res;
  try {
    res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Could not connect to IPFS upload service. Please ensure the backend is running (`node server.js` in the backend folder).");
  }

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || "Failed to upload file to IPFS.");
  }

  const data = await res.json();
  return data.ipfsHash;
}

export function useContract() {
  const [address, setAddress] = useState(
    () => CONTRACT_ADDRESS || localStorage.getItem("ps_addr") || ""
  );
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const professor = await contract.professor();
      const identity = await contract.getIdentity(account);
      setRole(
        professor.toLowerCase() === account.toLowerCase()
          ? "Professor"
          : identity.registered
          ? "Student"
          : "Unregistered"
      );
      const total = Number(await contract.totalSubmissions());
      const records = [];
      for (let id = 1; id <= total; id += 1) {
        const submission = await contract.getSubmission(id);
        records.push({
          id,
          name: submission[0],
          enroll: submission[1],
          no: Number(submission[2]),
          title: submission[3],
          ipfsHash: submission[4] || "",
          hash: submission[5],
          time: Number(submission[6]),
          verified: submission[7],
        });
      }
      setSubmissions(records.reverse());
    } catch (err) {
      console.error("Error loading contract data:", err);
    }
  }, [account, contract]);

  useEffect(() => {
    if (!window.ethereum) return undefined;
    const reload = () => window.location.reload();
    window.ethereum.on("accountsChanged", reload);
    window.ethereum.on("chainChanged", reload);
    return () => {
      window.ethereum.removeListener("accountsChanged", reload);
      window.ethereum.removeListener("chainChanged", reload);
    };
  }, []);

  useEffect(() => {
    load().catch((error) => setNotice({ text: errorMessage(error), type: "error" }));
  }, [load]);

  const connect = async (contractAddress = address) => {
    const targetAddr = (CONTRACT_ADDRESS || contractAddress || address || "").trim();
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to connect.");
      }
      if (!isAddress(targetAddr)) {
        throw new Error("Please verify the Ethereum contract address in config.js.");
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddr = await signer.getAddress();
      const instance = new Contract(targetAddr, ABI, signer);

      setAccount(userAddr);
      setContract(instance);
      setAddress(targetAddr);
      setNotice(null);
    } catch (error) {
      setNotice({ text: errorMessage(error), type: "error" });
    }
  };

  const disconnect = () => {
    setAccount("");
    setContract(null);
    setRole("");
    setSubmissions([]);
    setNotice({ text: "Wallet disconnected", type: "info" });
  };

  const run = async (action, successMessage) => {
    try {
      setBusy(true);
      const tx = await action();
      await tx.wait();
      setNotice({ text: successMessage, type: "success" });
      await load();
    } catch (error) {
      setNotice({ text: errorMessage(error), type: "error" });
    } finally {
      setBusy(false);
    }
  };

  return {
    address,
    setAddress,
    account,
    shortAccount: account ? short(account) : "",
    contract,
    role,
    submissions,
    busy,
    notice,
    setNotice,
    connect,
    disconnect,
    run,
    hashFile,
    uploadToIpfs,
  };
}
