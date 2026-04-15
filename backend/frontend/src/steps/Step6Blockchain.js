import React, { useState } from "react";
import { connectWallet, sendTransaction } from "../wallet/wallet";

function Step6Blockchain({ filesA = {}, filesB = {}, notify }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      const acc = await connectWallet();
      setAccount(acc);
      notify?.(`Wallet connected: ${acc}`, "success");
    } catch (error) {
      notify?.("Wallet connection failed.", "error");
    }
  };

  const fileToHash = async (file) => {
    if (!file) return "NO_FILE"; // ✅ VERY IMPORTANT

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleBlockchain = async () => {
    try {
      setLoading(true);

      const safeFilesA = filesA || {};
      const safeFilesB = filesB || {};

      const keys = Array.from(
        new Set([
          ...Object.keys(safeFilesA),
          ...Object.keys(safeFilesB),
        ])
      );

      if (keys.length === 0) {
        notify?.("No documents uploaded. Saving empty agreement.", "warning");
      }

      const hashes = {};

      for (let key of keys) {
        const hashA = await fileToHash(safeFilesA[key]);
        const hashB = await fileToHash(safeFilesB[key]);

        hashes[key] = {
          partyA: hashA,
          partyB: hashB,
        };
      }

      const txid = await sendTransaction({
        documents: hashes,
        timestamp: Date.now(),
      });

      notify?.(`Saved to blockchain. TX ID: ${txid}`, "success");

    } catch (err) {
      console.error(err);
      notify?.(`Blockchain error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Step 6: ⛓ Blockchain Finalization</h2>
      <p className="section-help">
        Connect wallet and save hashed agreement metadata on chain.
      </p>

      <button className="button button-secondary" onClick={handleConnect}>
        {account ? "Connected ✅" : "🔗 Connect Wallet"}
      </button>

      <div style={{ height: 12 }} />

      <button className="button button-success" onClick={handleBlockchain} disabled={loading}>
        {loading ? "Processing..." : "🚀 Save to Blockchain"}
      </button>
    </div>
  );
}

export default Step6Blockchain;