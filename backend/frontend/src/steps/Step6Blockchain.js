import React, { useState } from "react";
import { connectWallet, sendTransaction } from "../wallet/wallet";

function Step6Blockchain({ filesA, filesB }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const acc = await connectWallet();
    setAccount(acc);
  };

  const fileToHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const handleBlockchain = async () => {
    try {
      setLoading(true);

      const keys = Object.keys(filesA);

      const hashes = {};

      for (let key of keys) {
        const hashA = await fileToHash(filesA[key]);
        const hashB = await fileToHash(filesB[key]);

        hashes[key] = { hashA, hashB };
      }

      const txId = await sendTransaction({
        documents: hashes,
        timestamp: Date.now(),
      });

      alert("✅ Saved to blockchain!\nTX ID: " + txId);

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 6: Blockchain</h2>

      <button onClick={handleConnect}>
        {account ? "Connected ✅" : "Connect Wallet"}
      </button>

      <br /><br />

      <button onClick={handleBlockchain} disabled={loading}>
        {loading ? "Processing..." : "Save to Blockchain"}
      </button>
    </div>
  );
}

export default Step6Blockchain;