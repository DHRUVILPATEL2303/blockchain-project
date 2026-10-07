import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, isAddress } from "ethers";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { ABI } from "../abi";
import { CONTRACT_ADDRESS, PINATA_JWT } from "../config";
import { CONTRACT_CHAIN } from "../wagmi";

const short = (address) => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "");

const errorMessage = (error) => {
  if (!error) return "An unknown error occurred";
  if (
    error.code === 4001 ||
    error.code === "ACTION_REJECTED" ||
    error.name === "UserRejectedRequestError" ||
    error?.info?.error?.code === 4001
  ) {
    return "Transaction was cancelled in wallet.";
  }
  return error.reason || error.shortMessage || error.message || "Operation failed";
};

async function hashFile(file) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return "0x" + [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function uploadToIpfs(file) {
  const pinataJwt = PINATA_JWT || import.meta.env.VITE_PINATA_JWT;
  if (!pinataJwt) {
    throw new Error("Pinata is not configured. Please verify your Pinata JWT key.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: file.name,
      keyvalues: {
        app: "BlockProof",
        uploadedAt: new Date().toISOString(),
      },
    })
  );

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "Pinata could not pin this file to IPFS.");
  }

  const data = await res.json();
  if (!data.IpfsHash) {
    throw new Error("Pinata did not return an IPFS CID for this file.");
  }
  return data.IpfsHash;
}

export function useContract() {
  const [address, setAddress] = useState(
    () => CONTRACT_ADDRESS || localStorage.getItem("ps_addr") || ""
  );
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  // Wagmi hooks for wallet connection management
  const { address: account, chainId, isConnected, connector, status } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const networkMismatch = isConnected && chainId !== CONTRACT_CHAIN.id;

  // Create contract instance whenever Wagmi account/connector changes
  useEffect(() => {
    let active = true;

    async function initContract() {
      if (!isConnected || !account || !connector) {
        setContract(null);
        setRole("");
        setSubmissions([]);
        return;
      }

      if (chainId !== CONTRACT_CHAIN.id) {
        setContract(null);
        setRole("");
        setSubmissions([]);
        setNotice({
          text: `Switch your wallet to ${CONTRACT_CHAIN.name} to access student registration and submissions.`,
          type: "error",
        });
        return;
      }

      const targetAddr = (CONTRACT_ADDRESS || address || "").trim();
      if (!isAddress(targetAddr)) {
        setContract(null);
        return;
      }

      try {
        const rawProvider = await connector.getProvider();
        if (!active) return;
        const provider = new BrowserProvider(rawProvider);
        const signer = await provider.getSigner();
        if (!active) return;
        const instance = new Contract(targetAddr, ABI, signer);
        setContract(instance);
      } catch (err) {
        console.error("Error initializing contract instance:", err);
        if (active) {
          setContract(null);
        }
      }
    }

    initContract();

    return () => {
      active = false;
    };
  }, [isConnected, account, chainId, connector, address]);

  const load = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const professor = await contract.professor();
      const identity = await contract.getIdentity(account);
      const isProf = professor.toLowerCase() === account.toLowerCase();
      const isStud = Boolean(identity?.registered || identity?.[2]);
      console.log("[useContract] Identity loaded for account:", account, {
        isProf,
        isStud,
        name: identity?.[0] ?? identity?.name,
        enroll: identity?.[1] ?? identity?.enrollmentNo,
        registeredRaw: identity?.[2] ?? identity?.registered,
      });
      setRole(isProf ? "Professor" : isStud ? "Student" : "Unregistered");
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
    if (contract && account) {
      load().catch((error) => setNotice({ text: errorMessage(error), type: "error" }));
    }
  }, [contract, account, load]);

  const connect = async () => {
    try {
      // Use the browser-injected connector configured in wagmi.js.
      const targetConnector = connectors.find((c) => c.type === "injected") || connectors[0];

      if (!targetConnector) {
        throw new Error("No browser wallet found. Install or unlock an Ethereum wallet to continue.");
      }

      const result = await connectAsync({
        connector: targetConnector,
        chainId: CONTRACT_CHAIN.id,
      });
      setNotice(null);
      return result?.accounts?.[0] || null;
    } catch (error) {
      console.error("Wagmi connect error:", error);
      if (
        error.name === "UserRejectedRequestError" ||
        error.code === 4001 ||
        error.message?.includes("rejected") ||
        error.message?.includes("User rejected")
      ) {
        setNotice({
          text: "Wallet connection was cancelled in your wallet.",
          type: "error",
        });
      } else {
        setNotice({ text: errorMessage(error), type: "error" });
      }
      return null;
    }
  };

  const switchToContractNetwork = async () => {
    try {
      await switchChainAsync({ chainId: CONTRACT_CHAIN.id });
      setNotice(null);
      return true;
    } catch (error) {
      setNotice({ text: errorMessage(error), type: "error" });
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error("Wagmi disconnect error:", err);
    }
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
    account: account || "",
    shortAccount: account ? short(account) : "",
    isConnected: isConnected && status === "connected",
    isConnecting,
    networkMismatch,
    contractChainName: CONTRACT_CHAIN.name,
    contract,
    role,
    submissions,
    busy: busy || isConnecting || isSwitchingChain,
    notice,
    setNotice,
    connect,
    disconnect,
    switchToContractNetwork,
    run,
    hashFile,
    uploadToIpfs,
  };
}
