import React, { useState } from "react";
import "./App.css";
import { connectWallet, sendTransaction } from "./wallet";

function App() {
  const [account, setAccount] = useState(null);
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [result, setResult] = useState(null);

  // CONNECT WALLET
  async function handleConnect() {
    try {
      const acc = await connectWallet();
      setAccount(acc);
    } catch (err) {
      console.error(err);
    }
  }

  // FILE → HASH
  async function fileToHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // GET TRANSACTION DATA (SAFE VERSION)
  async function getTransaction(txId) {
    const res = await fetch(
      `https://testnet-api.algonode.cloud/v2/transactions/${txId}`
    );

    const data = await res.json();

    // 🔥 handle delay in blockchain confirmation
    if (!data.transaction || !data.transaction.note) {
      throw new Error("Transaction not confirmed yet, try again");
    }

    const note = atob(data.transaction.note);

    return JSON.parse(note);
  }

  // MAIN FUNCTION
  async function handleSubmit() {
    try {
      if (!fileA || !fileB) {
        alert("Upload both documents");
        return;
      }

      // create hashes
      const hashA = await fileToHash(fileA);
      const hashB = await fileToHash(fileB);

      // send transaction
      const txId = await sendTransaction({
        hashA,
        hashB,
        timestamp: Date.now(),
      });

      if (!txId) {
        alert("Transaction sent but TX ID missing");
        return;
      }

      // ⏳ WAIT for blockchain confirmation
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // fetch stored data
      const savedData = await getTransaction(txId);

      setResult(savedData);

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="App">
      <h1>📄 AI Agreement Verifier</h1>

      <button onClick={handleConnect}>
        {account ? "Connected ✅" : "Connect Wallet (QR)"}
      </button>

      <div className="card">
        <h3>Upload Agreement Documents</h3>

        <input type="file" onChange={(e) => setFileA(e.target.files[0])} />
        <input type="file" onChange={(e) => setFileB(e.target.files[0])} />

        <button onClick={handleSubmit}>
          Verify & Record on Blockchain
        </button>
      </div>

      {result && (
        <div className="result">
          <h3>📊 Stored Data</h3>
          <p><b>Hash A:</b> {result.hashA}</p>
          <p><b>Hash B:</b> {result.hashB}</p>
          <p><b>Time:</b> {new Date(result.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default App;